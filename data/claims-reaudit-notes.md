# Re-audit notes — flagged batch-6 and batch-9 content vs. live CTT pages

Audited 2026-09-20 against the exact live Closer to Truth theory pages.
Nothing below modifies `data/claims.js` or `data/theories.js`; these are
suggested edits for the maintainer to apply.

## Page recovery

`THEORY_LINKS_120` had no entries for any of the ten theories below. All ten
URLs were extracted from exact titles on the CTT all-theories index
(`https://loc.closertotruth.com/all-consciousness-categories-subcategories-and-theories`)
and verified individually via **HTTP 200 + `<title>` match** — no URLs were
guessed. Consider adding these to `THEORY_LINKS_120` in `data/theories.js`:

- 74 → https://loc.closertotruth.com/theory/kauffman-s-mind-mediating-possibles-to-actuals
- 75 → https://loc.closertotruth.com/theory/fisher-s-quantum-cognition
- 76 → https://loc.closertotruth.com/theory/keppler-s-zero-point-field
- 77 → https://loc.closertotruth.com/theory/becker-s-analog-body-electric
- 79 → https://loc.closertotruth.com/theory/millers-brain-waves-analog-organization-of-cortex
- 80 → https://loc.closertotruth.com/theory/singer-and-melloni-s-large-scale-synchrony
- 24 → https://loc.closertotruth.com/theory/enactivism
- 28 → https://loc.closertotruth.com/theory/graziano-s-attention-schema-theory
- 29 → https://loc.closertotruth.com/theory/kashmir-shaivism-s-dynamic-non-dualism
- 30 → https://loc.closertotruth.com/theory/berkeley-s-immaterialist-idealism

Notable: the Singer–Melloni page (theory 80) was verified by Lucia Melloni
herself (July 14, 2025); the Keppler page (theory 76) by Joachim Keppler
himself (January 13, 2026); the AST page (theory 28) verified July 1, 2024.
The Kashmir Shaivism page (theory 29) flags its own source as "General
Knowledge via online references, encyclopedias, and AI" — noted below.

## 74 — Kauffman's possibles-to-actuals — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/kauffman-s-mind-mediating-possibles-to-actuals
(filed under Quantum & Dimensions)

Page-stated position:
- "(i) Quantum measurement converts Res potentia — ontologically real
  Possibles — into Res extensa, ontologically real Actuals."
- "(ii) Brain/mind/consciousness cannot be purely classical physics ...
  therefore, brain/mind/consciousness must be partly quantum."
- Key takeaways: "Consciousness helps convert quantum 'Possibles'
  (Res potentia) into actual events (Res extensa). How It Works: Mind, partly
  quantum, collapses the wave function, turning potential states into
  experienced realities." Implications: "mind is nonlocal and plays an active
  causal role in the physical world."

Verdicts:
- **c184 "Possibles are real" — confirmed as-is.** The page supports the core
  claim (Res potentia as ontologically real possibilities). One nuance: the
  phrase "beyond spacetime" in the text is Kauffman's own framing from his
  published possiblist-realism paper (cited in the batch-9 drafting notes),
  not stated on the CTT page itself. Keeping it is defensible, but if you want
  strict page-only sourcing, drop those two words — the claim loses nothing.
- **c185 "Mind turns possibles into actuals" — confirmed as-is**, including
  both entailments (c184, c168). The page explicitly credits consciousness with
  converting possibles into actuals and attributes a causal role in the
  physical world (collapse of the wave function = consciousness acting on
  physics, c168).
- Theory blurb, family (Quantum), claim list [c185]: fine.

## 75 — Fisher's quantum cognition — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/fisher-s-quantum-cognition
(filed under Quantum & Dimensions)

Page-stated position:
- "Condensed matter physicist Matthew Fisher proposes that quantum processing
  with nuclear spins might be operative in the brain and key to its
  functioning. He identifies 'phosphorus as the unique biological element with
  a nuclear spin that can serve as a qubit for such putative quantum
  processing — a neural qubit — while the phosphate ion is the only possible
  qubit-transporter.'"
- "Posner molecule" (calcium phosphate clusters, Ca9(PO4)6) as "the unique
  molecule that can protect the neural qubits on very long times and thereby
  serve as a (working) quantum-memory" (Fisher, 2015).
- Working definition of "quantum cognition": "the dynamics and quantum
  entanglement of the phosphorus nuclear spins must be capable of modulating
  the excitability and signaling of neurons."

Verdicts:
- **c186 "Neural qubits are nuclear spins" — confirmed as-is** (verbatim match).
- **c187 "Posner molecules shield qubits" — confirmed as-is** (verbatim match),
  with its c186 entailment.
- Theory blurb, family (Quantum), claim list [c187]: fine.
- The page lists an "Open Issue: Experimental proof of Posner molecule quantum
  effects in living brains is still lacking" — worth knowing, but no claim
  change follows (Fisher's position is the proposal itself, and the claim text
  already hedges with "can"/"may").

## 76 — Keppler's zero-point field — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/keppler-s-zero-point-field
(filed under Quantum & Dimensions)

Page-stated position:
- "Consciousness is an intrinsic feature of the universe embedded in the
  quantum vacuum, specifically the zero-point field (ZPF) from quantum field
  theory, and the brain acts as a resonant, dynamical interface that modulates
  and orchestrates specific modes of the ZPF, allowing access to certain
  conscious states."
- "Treats the ZPF as a universal 'palette' of qualia, with brain activity
  acting like a resonant filter."
- "Consciousness is fundamental, primitive, much like spacetime and
  mass-energy. While consistent with panpsychism, Keppler's ZPF theory offers
  specific and unique mechanisms."

Verdicts:
- **c188 "ZPF carries phenomenal qualities" — confirmed as-is**, including the
  c25 entailment (page explicitly places itself "consistent with
  panpsychism" and treats consciousness as fundamental/primitive).
- **c189 "Brain tunes into ZPF modes" — confirmed as-is** (near-verbatim:
  brain as resonant interface selectively amplifying specific ZPF modes),
  with its c188 entailment.
- Theory blurb, family (Quantum), claim list [c189]: fine.

## 77 — Becker's analog body electric — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/becker-s-analog-body-electric
(filed under Materialism / Electromagnetic Field)

Page-stated position:
- "Phenomenal experience emerges not merely from discrete synaptic
  transmissions, but from continuous, slow direct-current (DC) electromagnetic
  fields generated by the perineural network involving glial and Schwann
  cells."
- Two interacting electrical modes: "the familiar fast, spike-based neuronal
  system and a slower, continuous direct-current (DC) system that provides
  organism-wide analog control, and ... subjective qualitative experience is
  bound together by these unified electrical gradients."
- "Continuous spatial voltage gradients provide the unified physical
  substrate required to bind isolated sensory inputs into the singular,
  cohesive gestalt of phenomenal consciousness."

Verdicts:
- **c190 "Slow DC body fields hold experience" — confirmed as-is.** Page
  matches the claim's wording almost one-to-one.
- Withheld c50 entailment: still correct. CTT files the page under
  "Electromagnetic Field," but Becker's thesis is whole-body slow DC fields
  generated by the perineural network, not the brain's global EM field as an
  identity thesis (c50). Do not add the entailment just because of the
  category listing — the mechanism claim differs.
- Theory blurb, family (Materialism), claim list [c190]: fine.

## 79 — Miller's analog brain waves — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/millers-brain-waves-analog-organization-of-cortex
(filed under Materialism / Electromagnetic Field)

Page-stated position:
- "Cognition and consciousness emerge from the fast and flexible dynamic
  organization of the cortex produced by traveling brain waves performing
  analog computations."
- "Consciousness is the tip of the iceberg of cognition and may be a natural
  outcome of analog computation."
- "Brain waves dynamically coordinate millions of neurons, using analog
  computations to organize information across the cortex."
- "When the analog computations create brain wave patterns that are large
  enough to unify the cortex, you get consciousness."

Verdicts:
- **c193 "Brain computes with traveling waves" — confirmed as-is.**
- **c194 "Waves organize neural firing" — confirmed as-is**, with its c193
  entailment (bidirectional wave↔neuron coordination supported by the page).
- Theory blurb, family (Materialism), claim list [c194]: fine. The batch-9
  draft was based on 2026 press summaries of the J. Neuroscience paper; the
  live page agrees with them.

## 80 — Singer–Melloni large-scale synchrony — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/singer-and-melloni-s-large-scale-synchrony
(filed under Materialism / Electromagnetic Field)

Page-stated position:
- "Conceiving consciousness as an emergent process from a dynamical system,
  this theory reframes consciousness not as a function of isolated brain
  areas or fixed representational codes, but as an emergent, temporally
  structured phenomenon arising from transient synchronization across
  distributed neural assemblies in different brain areas."
- "Neurons across the brain synchronize in timing (especially in gamma and
  theta bands) to unify perception. ... Synchrony binds features like color
  and motion into unified experience without needing special neurons."
- "Consciousness isn't layered on top of brain activity — it is the brain's
  large-scale synchrony in motion."

Verdicts:
- **c195 "Synchrony binds perception" — confirmed as-is.**
- **c196 "Integration, no separate workspace" — confirmed as-is**, with its
  c195 entailment. The "no separate workspace" half is supported by the
  page's "not a function of isolated brain areas or fixed representational
  codes" and the "consciousness isn't layered on top" framing.
- Withheld c191 (GRT resonance) reuse: still correct — Singer–Melloni is a
  mechanism-level synchrony account, not GRT's panpsychist combination.
  Do not add the entailment despite the shared "Electromagnetic Field"
  category listing.
- Theory blurb, family (Materialism), claim list [c196]: fine.

## c113 — Enactivism (theory 24) — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/enactivism
(filed under Materialism / Embodied & Enactive)

Page-stated position:
- "Enactivism is the way of thinking that to explore mental activities, one
  must examine living systems interacting with their environments, agents
  bringing forth a mental world through embodied, sensorimotor coupling with
  the physical world."
- "Cognition is characterized, not by representations in the brain, but by
  embodied activities and organisms-environment dynamics."
- **"A mind without a body would be as if incoherent."**

Verdict: **c113 "No brain in a vat" — confirmed as-is.** The page's "A mind
without a body would be as if incoherent" supports the absolute wording
("could not be conscious"), and "organisms-environment dynamics" supports the
"body and environment are constitutive" clause. The c112 entailment (Perception
is a bodily skill) remains apt. Note: this CTT page covers the school broadly
rather than a single theorist — that is CTT's own framing, no data change
follows.

## c118 — Attention Schema Theory (theory 28) — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/graziano-s-attention-schema-theory
(filed under Materialism / Eliminative/Illusionism)

Page-stated position:
- "Attention schema theory asserts that for the brain to handle a profusion
  of information, it must have developed a quick and dirty model, a
  simplified version of itself, which it then reports 'as a ghostly,
  non-physical essence, a magical ability to mentally possess items'"
  (Graziano, 2019a, 2019b).
- "The attention schema [is] 'a self-reflecting mirror: it is the brain's
  representation of how the brain represents things and is a specific example
  of higher-order thought. In this account, consciousness isn't so much an
  illusion as a self-caricature.'"

Verdicts:
- **c118 "Model mistaken for a soul" — confirmed as-is**, with its c117
  entailment (the page supports the attention-schema-as-control-model base).
  The claim's "ghostly, nonphysical essence" wording is nearly the page's own
  quoted phrase.
- Note: the page says consciousness "isn't so much an illusion as a
  self-caricature." Our c118 doesn't call AST illusionist, so no conflict;
  the "Eliminative/Illusionism" CTT category should not push us to add a
  c54-type lineage.

## c119–c121 — Kashmir Shaivism (theory 29) — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/kashmir-shaivism-s-dynamic-non-dualism
(filed under Idealisms)

Page-stated position:
- "Supreme Consciousness (paramashiva) is ultimate reality, a dynamic unity
  of consciousness (chit) and power (shakti)."
- "Consciousness is not static but inherently vibrating, pulsating, or
  throbbing (spanda, the divine vibration, the first movement of awareness
  that gives rise to all creation)."
- "Self-recognition is realizing that one's individual consciousness is
  identical with universal Consciousness. Ignorance is forgetting this
  identity; enlightenment is self-recognition."
- Key takeaways: "Supreme Consciousness (Shiva) and its dynamic power
  (Shakti) are identical, manifesting as all reality." / "Consciousness
  vibrates as spanda, unfolding through 36 tattvas from pure awareness to
  physical matter." / Distinguishing idea: "The world is a real, divine play
  of Consciousness, not an illusion to be transcended."

Verdicts:
- **c119 "Universal consciousness vibrates into world" — confirmed as-is**
  (spanda, unfolding from pure awareness to matter). It is not listed
  directly by theory 29 (inherited via c121); no claim-list change needed.
- **c120 "World is real, not illusion" — confirmed as-is** (page's
  distinguishing idea is exactly this).
- **c121 "Recognition is liberation" — confirmed as-is** (self-recognition
  definition), with its c119 entailment intact.
- Caveat for the maintainer: this page's own source note reads "General
  Knowledge via online references, encyclopedias, and AI" — weaker provenance
  than the other pages. The claims themselves are standard Kashmir Shaivism
  doctrine and need no rewording, but consider a data-level note if that
  convention is ever adopted.

## c123 — Berkeley (theory 30) — CONFIRMED AS-IS

Page: https://loc.closertotruth.com/theory/berkeley-s-immaterialist-idealism
(filed under Idealisms)

Page-stated position:
- "Nothing exists but minds and the ideas they perceive, that the world we
  sense is constituted by the qualitative contents of perception themselves
  rather than by any mind-independent matter lying beneath them, and that
  these passive, perceived, lawfully ordered ideas are sustained as a
  coherent public world by the perception and will of an infinite spirit,
  God."
- "Objects of the senses are stable collections of such ideas rather than
  mind-independent material substances, and ... the order, vividness, and
  public coherence of experience are secured by God as the infinite spirit
  who causes and sustains the sensory world."

Verdicts:
- **c123 "To be is to be perceived" — confirmed as-is**, with both entailments
  (c122, c2). The page supports the full chain: stable collections of sensory
  ideas (c123) → only minds and ideas exist (c122) → everything is mind (c1,
  inherited via c2).
- Theory blurb, family (Idealism), claim list [c123]: fine.

## Housekeeping suggestions for the maintainer

1. All six batch-9 theories (74–77, 79, 80) carry a "The CTT theory page was
   not reachable during research" caveat. The pages are now recovered and
   every claim confirmed — the caveats can be dropped.
2. No claim rewordings, entailment changes, or claim additions/removals are
   recommended by this audit. The one optional softening: c184's "beyond
   spacetime" is Kauffman's paper framing, not the CTT page's wording —
   harmless to keep.
3. Nothing in this audit touches the known weak-provenance items beyond this
   scope (e.g., the Kashmir Shaivism page's AI-sourced note is CTT's own
   disclosure, not a data problem).
