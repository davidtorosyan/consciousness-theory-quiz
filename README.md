# Consciousness Theory Quiz

A plain-language quiz that finds your closest-fit theory of consciousness.
120 theories, binary-search question flow, shareable progress links.

**Live site:** https://davidtorosyan.github.io/consciousness-theory-quiz/

## Layout

| Path | What it is |
|---|---|
| `index.html` | Page shell. Served directly by GitHub Pages — no build step. |
| `styles.css` | All styles. |
| `data/quiz-content.js` | The reviewable source of truth: every question, its decision split, and every reader-facing content layer (plain-language titles, "put simply" lines, why-it-matters, examples, jargon definitions). Start here for content review. |
| `src/app.js` | Quiz engine + rendering + shareable progress-link encoding. |
| `src/content-lint.js` | Release-gating checks. Throws before the quiz boots if a content layer is missing or a banned placeholder phrase is present. |
| `tools/split.py` | Rebuilds this layout from an exported monolith (see Workflow). |

## Workflow

The Muse artifact is the **staging** environment; this repo is **production**.

1. Iterate on the quiz in the Muse artifact and approve the result there.
2. Export the single-file build from the artifact.
3. Run `python3 tools/split.py <exported.html> .` to regenerate the split layout
   (mechanical, byte-exact — nothing is rewritten, only relocated).
4. `npm run check`, commit, push. GitHub Pages redeploys in about a minute.

Do not hand-edit the split files expecting changes to flow back into the
artifact — the export is the one-way bridge. Content edits happen in staging,
then re-export.
