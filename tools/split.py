#!/usr/bin/env python3
"""Split an exported consciousness-quiz monolith into the reviewable repo layout.

The artifact pipeline produces a single self-contained HTML file. This script
reverses that mechanically (no bytes are altered, only relocated) so the repo
stays human-reviewable and directly servable by GitHub Pages.

Usage:
    python3 tools/split.py <exported.html> [repo_dir]

Writes into repo_dir:
    index.html            page shell referencing the split assets
    styles.css            extracted <style> block
    data/quiz-content.js  decoded content data-uri script (reviewable source of truth)
    src/content-lint.js   decoded release-gating lint data-uri script
    data/claims.js        decoded claims-DAG data data-uri script
    src/claims-engine.js  decoded claims-DAG engine data-uri script
    src/claims-lab.js     decoded claims lab UI data-uri script
    src/app.js            extracted inline quiz app script
"""
import base64
import pathlib
import re
import sys


def main() -> None:
    src = pathlib.Path(sys.argv[1])
    out = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else pathlib.Path(".")
    html = src.read_text(encoding="utf-8")

    style_m = re.search(r"<style>.*?</style>", html, re.S)
    if not style_m:
        raise SystemExit("no <style> block found")
    css = style_m.group(0)[len("<style>") : -len("</style>")]

    scripts = [
        (m.group(0), m.group(1) or "", m.group(2))
        for m in re.finditer(r"<script(\s[^>]*)?>(.*?)</script>", html, re.S)
    ]
    if len(scripts) != 6:
        raise SystemExit(f"expected 6 script elements, found {len(scripts)}")

    plan = []  # (original_element, replacement_tag, rel_path, content)
    for full, attrs, body in scripts:
        src_m = re.search(r'src="([^"]+)"', attrs)
        if src_m and src_m.group(1).startswith("data:"):
            uri = src_m.group(1)
            b64 = uri.split("base64,", 1)[1]
            js = base64.b64decode(b64).decode("utf-8")
            if "Release-gating content checks" in js:
                rel = "src/content-lint.js"
            elif "Reviewable source of truth" in js:
                rel = "data/quiz-content.js"
            elif "Claims DAG prototype" in js:
                rel = "data/claims.js"
            elif "Claims engine" in js:
                rel = "src/claims-engine.js"
            elif "Claims lab" in js:
                rel = "src/claims-lab.js"
            else:
                raise SystemExit("unrecognized data-uri script")
        elif not src_m:
            rel = "src/app.js"
            js = body
        else:
            raise SystemExit(f"unexpected external script src: {src_m.group(1)[:60]}")
        plan.append((full, f'<script src="{rel}"></script>', rel, js))

    new_html = html.replace(style_m.group(0), '<link rel="stylesheet" href="styles.css">')
    for full, tag, _rel, _js in plan:
        if full not in new_html:
            raise SystemExit("script element not found exactly once during rebuild")
        new_html = new_html.replace(full, tag, 1)

    (out / "data").mkdir(parents=True, exist_ok=True)
    (out / "src").mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(new_html, encoding="utf-8")
    (out / "styles.css").write_text(css, encoding="utf-8")
    for _full, _tag, rel, js in plan:
        (out / rel).write_text(js, encoding="utf-8")

    # Byte-exactness check: every relocated byte must match the export.
    check = (
        (out / "styles.css").read_text(encoding="utf-8") == css
        and all((out / rel).read_text(encoding="utf-8") == js for _, _, rel, js in plan)
    )
    print(f"wrote split layout to {out} (byte-exact: {check})")
    for _, _, rel, js in plan:
        print(f"  {rel}: {len(js)} chars")
    print(f"  styles.css: {len(css)} chars, index.html: {len(new_html)} chars")


if __name__ == "__main__":
    main()
