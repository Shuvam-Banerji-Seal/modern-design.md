#!/usr/bin/env python3
"""
scrape.py — Dump a website's HTML, CSS, JS, and assets into tmp/<slug>/.

Usage
-----
    python tools/scrape.py <url> <site-slug> [options]

Options
-------
    --depth N             Max recursion depth (default: 2)
    --use-playwright      Render with headless Chromium and capture
                          runtime responses (requires `playwright install chromium`)
    --extra-urls FILE     Plain-text file, one URL per line, to seed
                          the queue with (use after a Playwright pass
                          to add discovered URLs).
    --no-domain-limit     Don't restrict to the entry-point registrable
                          domain.
    --timeout SECONDS     Per-request timeout (default: 30)
    --concurrency N       Parallel download workers (default: 8)
    --quiet               Suppress per-file progress
    --insecure            Skip TLS certificate verification

Output
------
    tmp/<site-slug>/
    ├── html/   css/   js/   fonts/   images/   svgs/   models/   media/   other/
    └── manifest.json

manifest.json schema
--------------------
    {
      "site": "<url>",
      "slug": "<site-slug>",
      "scraped_at": "<iso8601>",
      "stats": { "files": N, "errors": M, "bytes": B },
      "files": [
        {
          "url": "...",
          "local": "css/reset__1a2b3c4d.css",
          "type": "css",
          "extension": ".css",
          "size": 1234,
          "content_type": "text/css",
          "sha1": "...",
          "discovered_via": "html",   // html | css-url | css-import | js-import | js-fetch | playwright | extra
          "depth": 1
        }, ...
      ],
      "errors": [ { "url": "...", "error": "..." }, ... ]
    }
"""

import argparse
import hashlib
import json
import mimetypes
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print(
        "Missing dependencies. Run: pip install -r tools/requirements.txt",
        file=sys.stderr,
    )
    sys.exit(1)


# --- file-type classification ---------------------------------------------

TYPE_DIRS = {
    "html": "html",
    "css": "css",
    "javascript": "js",
    "font": "fonts",
    "image": "images",
    "svg": "svgs",
    "model": "models",
    "video": "media",
    "audio": "media",
}

# 3D model file extensions
MODEL_EXTS = {".glb", ".gltf", ".obj", ".fbx", ".usdz", ".dae", ".3ds", ".ply", ".stl"}

# Recognised extensions per type (used when path has an extension)
EXT_TYPE = [
    (".html", "html"),
    (".htm", "html"),
    (".css", "css"),
    (".js", "javascript"),
    (".mjs", "javascript"),
    (".cjs", "javascript"),
    (".svg", "svg"),
    (".woff2", "font"),
    (".woff", "font"),
    (".ttf", "font"),
    (".otf", "font"),
    (".eot", "font"),
    (".png", "image"),
    (".jpg", "image"),
    (".jpeg", "image"),
    (".gif", "image"),
    (".webp", "image"),
    (".avif", "image"),
    (".ico", "image"),
    (".bmp", "image"),
    (".mp4", "video"),
    (".webm", "video"),
    (".mov", "video"),
    (".ogv", "video"),
    (".m4v", "video"),
    (".mp3", "audio"),
    (".wav", "audio"),
    (".ogg", "audio"),
    (".m4a", "audio"),
    (".flac", "audio"),
]
MODEL_TYPE = {ext: "model" for ext in MODEL_EXTS}


def classify(url: str, content_type: str | None = None) -> tuple[str, str]:
    """Return (type, extension) for a URL given its (optional) content type."""
    path = urlparse(url).path.lower()
    ext = Path(path).suffix

    # extension wins
    if ext in MODEL_TYPE:
        return MODEL_TYPE[ext], ext
    for e, t in EXT_TYPE:
        if ext == e:
            return t, ext

    # fall back to content-type
    if content_type:
        ct = content_type.split(";")[0].strip().lower()
        if ct == "text/html":
            return "html", ".html"
        if ct == "text/css":
            return "css", ".css"
        if ct in (
            "application/javascript",
            "text/javascript",
            "application/x-javascript",
        ):
            return "javascript", ".js"
        if "json" in ct:
            return "other", ".json"
        if ct.startswith("font/") or "font" in ct or "woff" in ct or "opentype" in ct:
            return "font", ".woff2" if "woff2" in ct else ".woff"
        if ct.startswith("image/svg"):
            return "svg", ".svg"
        if ct.startswith("image/"):
            guessed = mimetypes.guess_extension(ct) or ".bin"
            return "image", guessed
        if ct.startswith("video/"):
            return "video", ".mp4"
        if ct.startswith("audio/"):
            return "audio", ".mp3"
        if "gltf" in ct or "model" in ct or "3d" in ct:
            return "model", ".glb"

    return "other", ext or ".bin"


# --- url extraction from each file type -----------------------------------


def extract_assets_from_html(html_str: str, base_url: str) -> set[tuple[str, str]]:
    soup = BeautifulSoup(html_str, "html.parser")
    urls: set[tuple[str, str]] = set()

    def _s(v) -> str:
        """Coerce a BeautifulSoup attribute value (str | list | None) to str."""
        if v is None:
            return ""
        if isinstance(v, list):
            return " ".join(str(x) for x in v)
        return str(v)

    for tag in soup.find_all("link", href=True):
        rel = _s(tag.get("rel")).lower()
        as_ = _s(tag.get("as")).lower()
        href = _s(tag.get("href"))
        is_link_asset = any(
            k in rel for k in ("stylesheet", "icon", "preload", "modulepreload", "manifest")
        ) or as_ in ("style", "script", "font", "image")
        if is_link_asset and href:
            urls.add(("link", urljoin(base_url, href)))

    for tag in soup.find_all("script", src=True):
        src = _s(tag.get("src"))
        if src:
            urls.add(("script", urljoin(base_url, src)))

    for tag in soup.find_all(["img", "source"], src=True):
        src = _s(tag.get("src"))
        if src:
            urls.add(("img", urljoin(base_url, src)))
        # srcset / data-srcset / imagesrcset
        for attr in ("srcset", "data-srcset", "imagesrcset"):
            srcset = _s(tag.get(attr))
            if srcset:
                for part in srcset.split(","):
                    u = part.strip().split()[0]
                    if u:
                        urls.add(("img", urljoin(base_url, u)))

    # <meta> images (e.g. OG tags) — usually remote, but capture anyway
    for tag in soup.find_all("meta"):
        prop = _s(tag.get("property"))
        content = _s(tag.get("content"))
        if prop.startswith("og:") and content:
            urls.add(("meta", urljoin(base_url, content)))

    return urls


def extract_assets_from_css(css_str: str, base_url: str) -> set[tuple[str, str]]:
    urls: set[tuple[str, str]] = set()
    # url(...) — handles "..." , '...' , and bare
    for m in re.finditer(r"url\(\s*(['\"]?)([^'\")]+)\1\s*\)", css_str):
        u = m.group(2)
        if u.startswith("data:") or u.startswith("#"):
            continue
        urls.add(("css-url", urljoin(base_url, u)))
    # @import "..." / url(...)
    for m in re.finditer(r"@import\s+(?:url\(\s*['\"]?)([^'\")]+)", css_str):
        urls.add(("css-import", urljoin(base_url, m.group(1))))
    return urls


def extract_assets_from_js(js_str: str, base_url: str) -> set[tuple[str, str]]:
    urls: set[tuple[str, str]] = set()
    # ES module imports: import ... from "..."
    for m in re.finditer(r"""\bfrom\s+(['"])([^'"]+)\1""", js_str):
        u = m.group(2)
        if u.startswith(("http://", "https://", "/", "./", "../")):
            urls.add(("js-import", urljoin(base_url, u)))
    # import "..." (side-effect import)
    for m in re.finditer(r"""\bimport\s+(['"])([^'"]+)\1""", js_str):
        u = m.group(2)
        if u.startswith(("http://", "https://", "/", "./", "../")):
            urls.add(("js-import", urljoin(base_url, u)))
    # fetch("...")
    for m in re.finditer(r"""\bfetch\(\s*(['"])([^'"]+)\1""", js_str):
        urls.add(("js-fetch", urljoin(base_url, m.group(2))))
    # new URL("...", import.meta.url)  — Vite pattern
    for m in re.finditer(r"""\bnew\s+URL\(\s*(['"])([^'"]+)\1""", js_str):
        u = m.group(2)
        if u.startswith(("http://", "https://", "/", "./", "../")):
            urls.add(("js-url", urljoin(base_url, u)))
    # dynamic import("...")
    for m in re.finditer(r"""\bimport\(\s*(['"])([^'"]+)\1""", js_str):
        u = m.group(2)
        if u.startswith(("http://", "https://", "/", "./", "../")):
            urls.add(("js-import", urljoin(base_url, u)))
    return urls


# --- network ---------------------------------------------------------------


def safe_filename(url: str, n: int) -> str:
    """Return a collision-proof filename: <base>__<sha1-8>.<ext>."""
    path = urlparse(url).path
    name = unquote(Path(path).name) or f"asset_{n}"
    h = hashlib.sha1(url.encode()).hexdigest()[:8]
    base, ext = Path(name).stem, Path(name).suffix
    if not base:
        base = f"asset_{n}"
    return f"{base}__{h}{ext}" if ext else f"{base}__{h}"


def fetch(session: requests.Session, url: str, timeout: int, retries: int = 3, verify: bool = True):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; modern-design.md-scraper/1.0)",
        "Accept": "*/*",
    }
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            r = session.get(
                url, headers=headers, timeout=timeout, allow_redirects=True, verify=verify
            )
            r.raise_for_status()
            return r.content, r.headers.get("Content-Type", ""), r.url
        except Exception as e:  # noqa: BLE001
            last_err = e
            time.sleep(1 + attempt)
    if last_err is not None:
        print(f"  ✗ {url}: {last_err}", file=sys.stderr)
    return None


# --- playwright pass (optional) -------------------------------------------


def playwright_capture(url: str, out_dir: Path, quiet: bool = False) -> list[str]:
    """Render url in headless Chromium, save responses, return list of captured URLs."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("playwright not installed; skipping dynamic pass.", file=sys.stderr)
        return []

    pw_dir = out_dir / "playwright"
    pw_dir.mkdir(exist_ok=True)
    captured: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        def on_response(resp):
            try:
                ct = (resp.headers.get("content-type") or "").lower()
                if not (
                    ct.startswith(("text/", "application/", "image/", "font/", "video/", "audio/"))
                    or "octet-stream" in ct
                ):
                    return
                body = resp.body()
                if not body:
                    return
                ftype, ext = classify(resp.url, ct)
                fname = safe_filename(resp.url, len(captured))
                target = pw_dir / (TYPE_DIRS.get(ftype, "other")) / fname
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(body)
                captured.append(resp.url)
                if not quiet:
                    print(f"  [playwright] {ftype:10} {resp.url}")
            except Exception as e:  # noqa: BLE001
                if not quiet:
                    print(f"  [playwright] ! {resp.url}: {e}", file=sys.stderr)

        page.on("response", on_response)
        try:
            page.goto(url, wait_until="networkidle", timeout=60000)
        except Exception as e:  # noqa: BLE001
            print(f"playwright goto failed: {e}", file=sys.stderr)
        # Give SPAs a moment to hydrate
        time.sleep(2)

        # Full-page screenshot
        try:
            page.screenshot(path=str(pw_dir / "homepage-fullpage.png"), full_page=True)
            page.screenshot(path=str(pw_dir / "homepage.png"))
        except Exception as e:  # noqa: BLE001
            print(f"playwright screenshot failed: {e}", file=sys.stderr)

        # DOM snapshot
        try:
            (pw_dir / "homepage.html").write_text(page.content(), encoding="utf-8")
        except Exception as e:  # noqa: BLE001
            print(f"playwright DOM dump failed: {e}", file=sys.stderr)

        # Computed styles for every visible element (truncated for sanity)
        try:
            computed = page.evaluate("""() => {
              const out = [];
              const els = document.querySelectorAll('body *');
              const seen = new Set();
              for (const el of els) {
                const cs = getComputedStyle(el);
                const sig = [cs.fontFamily, cs.fontSize, cs.color, cs.backgroundColor,
                             cs.borderRadius, cs.boxShadow, cs.padding, cs.margin].join('|');
                if (seen.has(sig)) continue;
                seen.add(sig);
                const tag = el.tagName.toLowerCase();
                const cls = (el.className && el.className.toString) ? el.className.toString().slice(0, 80) : '';
                out.push({
                  tag, class: cls,
                  fontFamily: cs.fontFamily,
                  fontSize: cs.fontSize,
                  fontWeight: cs.fontWeight,
                  lineHeight: cs.lineHeight,
                  letterSpacing: cs.letterSpacing,
                  color: cs.color,
                  backgroundColor: cs.backgroundColor,
                  borderRadius: cs.borderRadius,
                  boxShadow: cs.boxShadow,
                  padding: cs.padding,
                  margin: cs.margin,
                  display: cs.display,
                });
                if (out.length > 500) break;
              }
              return out;
            }""")
            (pw_dir / "computed-styles.json").write_text(
                json.dumps(computed, indent=2), encoding="utf-8"
            )
        except Exception as e:  # noqa: BLE001
            print(f"playwright computed-styles failed: {e}", file=sys.stderr)

        browser.close()
    return captured


# --- main scrape ----------------------------------------------------------


def domain_of(url: str) -> str:
    return urlparse(url).netloc.lower()


def scrape(
    url: str,
    slug: str,
    depth: int = 2,
    use_playwright: bool = False,
    extra_urls: Path | None = None,
    no_domain_limit: bool = False,
    timeout: int = 30,
    concurrency: int = 8,
    quiet: bool = False,
    verify_ssl: bool = True,
) -> dict:
    out = Path("tmp") / slug
    out.mkdir(parents=True, exist_ok=True)
    for d in set(TYPE_DIRS.values()) | {"other"}:
        (out / d).mkdir(exist_ok=True)

    base_netloc = domain_of(url)
    session = requests.Session()
    if not verify_ssl:
        session.verify = False
        import urllib3

        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    manifest: dict = {
        "site": url,
        "slug": slug,
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "stats": {"files": 0, "errors": 0, "bytes": 0},
        "files": [],
        "errors": [],
    }
    seen: set[tuple[str, int]] = set()  # (url, depth)
    queue: list[tuple[str, str, int]] = []  # (url, discovered_via, depth)

    # Optional: playwright pass first (captures runtime URLs into pw_dir)
    if use_playwright:
        if not quiet:
            print(f"[playwright] rendering {url} …")
        pw_captured = playwright_capture(url, out, quiet=quiet)
        for u in pw_captured:
            queue.append((u, "playwright", 0))
        # also write the manifest entry for the playwright artifacts
        for sub in ("playwright",):
            pw_dir = out / sub
            if pw_dir.exists():
                for path in pw_dir.rglob("*"):
                    if not path.is_file():
                        continue
                    rel = path.relative_to(out)
                    if rel.parts[0] != "playwright":
                        continue
                    manifest["files"].append(
                        {
                            "url": f"playwright://{rel}",
                            "local": str(rel),
                            "type": "playwright",
                            "extension": path.suffix,
                            "size": path.stat().st_size,
                            "content_type": "",
                            "sha1": hashlib.sha1(path.read_bytes()).hexdigest(),
                            "discovered_via": "playwright",
                            "depth": 0,
                        }
                    )

    # seed queue
    queue.append((url, "html", 0))
    if extra_urls and extra_urls.exists():
        for line in extra_urls.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                queue.append((line, "extra", 0))

    # BFS with bounded parallelism
    def process(item: tuple[str, str, int]) -> list[tuple]:
        u, via, d = item
        if (u, d) in seen:
            return []
        if d > depth:
            return []
        if not no_domain_limit and domain_of(u) and domain_of(u) != base_netloc:
            return []
        seen.add((u, d))
        result = fetch(session, u, timeout=timeout, verify=verify_ssl)
        if not result:
            err_payload = {"url": u, "error": "fetch failed", "via": via, "depth": d}
            return [("err", err_payload)]
        content, ct, final_url = result
        ftype, ext = classify(u, ct)
        fname = safe_filename(final_url, len(manifest["files"]))
        target_dir = out / TYPE_DIRS.get(ftype, "other")
        target = target_dir / fname
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
        entry = {
            "url": final_url,
            "local": str(target.relative_to(out)),
            "type": ftype,
            "extension": ext,
            "size": len(content),
            "content_type": ct,
            "sha1": hashlib.sha1(content).hexdigest(),
            "discovered_via": via,
            "depth": d,
        }
        # Recurse
        new_items: list[tuple[str, str, int]] = []
        if d < depth:
            try:
                text = content.decode("utf-8", errors="replace")
                if ftype == "html":
                    new_items = [
                        (c, v, d + 1) for v, c in extract_assets_from_html(text, final_url)
                    ]
                elif ftype == "css":
                    new_items = [(c, v, d + 1) for v, c in extract_assets_from_css(text, final_url)]
                elif ftype == "javascript":
                    new_items = [(c, v, d + 1) for v, c in extract_assets_from_js(text, final_url)]
            except Exception as e:  # noqa: BLE001
                err_payload = {
                    "url": final_url,
                    "error": f"parse: {e}",
                    "via": via,
                    "depth": d,
                }
                return [("entry", entry), ("err", err_payload)]
        return [("entry", entry)] + [("item", x) for x in new_items]

    with ThreadPoolExecutor(max_workers=concurrency) as ex:
        while queue:
            batch = queue[: concurrency * 4]
            queue = queue[concurrency * 4 :]
            futures = [ex.submit(process, item) for item in batch]
            for fut in as_completed(futures):
                for r in fut.result():
                    kind, payload = r[0], r[1]
                    if kind == "entry":
                        manifest["files"].append(payload)
                    elif kind == "err":
                        manifest["errors"].append(payload)
                    elif kind == "item":
                        queue.append(payload)

    # stats
    manifest["stats"]["files"] = len(manifest["files"])
    manifest["stats"]["errors"] = len(manifest["errors"])
    manifest["stats"]["bytes"] = sum(f["size"] for f in manifest["files"])
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    if not quiet:
        print(
            f"\n✓ {manifest['stats']['files']} files "
            f"({manifest['stats']['bytes']:,} bytes) "
            f"→ {out}/\n  manifest: {out}/manifest.json "
            f"({manifest['stats']['errors']} errors)"
        )
    return manifest


def main():
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    p.add_argument("url", help="Site URL to scrape (entry point)")
    p.add_argument("slug", help="Site slug — output folder name under tmp/")
    p.add_argument("--depth", type=int, default=2, help="Max recursion depth (default 2)")
    p.add_argument(
        "--use-playwright",
        action="store_true",
        help="Render with headless Chromium first",
    )
    p.add_argument("--extra-urls", type=Path, help="File of extra URLs to seed the queue with")
    p.add_argument("--no-domain-limit", action="store_true", help="Don't restrict to entry domain")
    p.add_argument("--timeout", type=int, default=30, help="Per-request timeout (seconds)")
    p.add_argument("--concurrency", type=int, default=8, help="Parallel download workers")
    p.add_argument("--quiet", action="store_true", help="Suppress per-file progress")
    p.add_argument(
        "--insecure",
        action="store_true",
        help="Skip TLS certificate verification (for sites with broken CDN certs)",
    )
    args = p.parse_args()
    scrape(
        args.url,
        args.slug,
        depth=args.depth,
        use_playwright=args.use_playwright,
        extra_urls=args.extra_urls,
        no_domain_limit=args.no_domain_limit,
        timeout=args.timeout,
        concurrency=args.concurrency,
        quiet=args.quiet,
        verify_ssl=not args.insecure,
    )


if __name__ == "__main__":
    main()
