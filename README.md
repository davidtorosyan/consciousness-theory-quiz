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
| `data/claims.js` | **Prototype.** Claims DAG for the auditable-classification model: positive claims, `entails` edges, and five theories listing only their most specific claims. |
| `src/claims-engine.js` | **Prototype.** DOM-free DAG utilities: ancestors/descendants, answer propagation, greedy most-informative-question selection, alignment scoring, `validate()` audit. |
| `src/claims-lab.js` | **Prototype.** The in-app claims lab UI: claims debugger (theory → claims → entailments) plus the DAG-driven prototype quiz. |
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

## Claims lab (prototype)

The page has a **Claims lab** section below the main quiz: an experimental,
auditable replacement for the hand-written decision tree, currently covering
five theories (analytic idealism, conscious realism, substance dualism,
naturalistic/property dualism, IIT).

- **Explore claims** — the claims debugger. Pick a theory to see its specific
  claims and the claims they entail; click any claim to see what it entails
  (ancestors: a "yes" settles these too) and what is built on it (descendants:
  a "no" knocks these out), plus every theory that affirms it.
- **Try the quiz** — the prototype quiz. Each step asks the undecided claim
  whose answer settles the most other claims. Theories score by alignment
  ("agrees with X of Y claims"), never by elimination, so a partial run still
  produces a meaningful ranking.

Model rules: claims are positive statements only; a theory lists only its most
specific claims; every routing decision must cite an affirmed claim; a theory
with no claim on either side of a question is an explicit gap, not a default.
`ClaimsEngine.validate()` checks the DAG for dangling refs and cycles.
