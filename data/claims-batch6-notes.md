# Claims batch 6 — drafting notes

New claims: c107–c129 (23 claims). New theories: 10
(ids 21, 23, 24, 26, 28, 29, 30, 31, 32, 33).

## Source situation (important)

`window.THEORY_LINKS_120` contains only 60 links and has NO entries for
ids 21, 23, 24, 26, 28, 29, 30, 31, 32, or 33. The instruction to fetch
these theories from their exact THEORY_LINKS_120 URLs therefore cannot be
fulfilled literally — no URLs were guessed.

What was used instead, all located live 2026-09-20:
1. The exact CTT All Landscape Theories index:
   https://loc.closertotruth.com/all-consciousness-categories-subcategories-and-theories
   (fetched; lists these theories under: First-order representationalism →
   Carruthers's First-Order Representationalism; Homeostatic/Affective →
   Solms's "Affect as the Hidden Spring of Consciousness", plus Damasio and
   Panksepp entries; Embodied/Enactive → Enactivism, Thompson's Mind in Life,
   Noë's "Out of Our Heads"; Quantum → Penrose–Hameroff's Orchestrated
   Objective Reduction; Eliminative/Illusionism → Graziano's Attention Schema
   Theory; Idealism → Kashmir Shaivism's Dynamic Non-Dualism, Kant's
   Transcendental Idealism, Schelling's Nature–Spirit Identity, Berkeley's
   Immaterialist Idealism, Bradley's Absolute Idealism, Sprigge's Absolute
   Idealism).
2. One exact CTT theory-page URL, located through web search (verbatim from
   search results, not guessed):
   https://loc.closertotruth.com/theory/penrose-hameroff-s-orchestrated-objective-reduction
   Its indexed description was used for Orch OR (quantum coherence in
   microtubules; gravity-induced objective reduction at threshold; Penrose's
   noncomputability criterion; "a moment of conscious awareness linked to the
   Penrose-Hameroff OR quantum state reduction").
3. The quiz's own `data/theories.js` summaries/signatures/details for all ten
   (distinguished below from fetched CTT sourcing).
4. Standard scholarly content (SEP-style summaries) for the philosophical
   positions where the CTT page text was not retrievable: Dretske/Tye first-
   order representationalism, Damasio/Panksepp/Solms affective neuroscience,
   Varela/Thompson/Noë enactivism, Graziano's AST, Kashmir Shaivism
   (spanda, pratyabhijñā), Berkeley's Principles/Three Dialogues, Bradley's
   Appearance and Reality / Sprigge's Vindication, Kant's Critique, Schelling's
   identity philosophy.

Per-claim sourcing below flags which of these supports it. Any future batch
with exact CTT page text available for these theories should re-check c113,
c118, c119–c121, and c123 against the page wording.

## Per-theory sources and claims

### 21 — First-order representationalism
- CTT: index lists Carruthers's First-Order Representationalism under the
  First-order section. Quiz metadata (theories.js): "Conscious experience just
  is certain world-directed representations; experience is 'transparent'...
  No higher-order monitoring needed."
- **c107 "No higher-order state needed"** — the defining negation of the
  school: first-order content suffices; no higher-order thought or inner
  monitor is required for a state to be conscious. Standalone root. NOTE:
  affirming c107 is genuinely incompatible with c45 ("Consciousness needs a
  higher thought") in reality, but the quiz measures alignment, not
  consistency — the same coexistence pattern as elsewhere in the graph.
- **c108 "Phenomenal character is representational content"** — Dretske/Tye's
  thesis: phenomenal character is exhausted by representational content (what
  the state is about). Entails **c107**: it is the specific FOR doctrine that
  makes higher-order states unnecessary.
- Theory lists ["c108"] (most-specific; c107 inherited).
- Family: Materialism (quiz metadata category: "Materialism — functional &
  computational"). Blurb: "Experience just is world-directed representation —
  no inner watcher needed."
- Judgment call: transparency ("you see through the experience to the
  represented object") is folded into c108's plain text rather than a separate
  claim. No existing claim was reused: c79 ("Qualities are in objects") is
  Nyāya's metaphysical direct realism about mind-independent qualities, not
  FOR's thesis about representational content; reusing it would drag in a
  commitment FOR doesn't make.

### 23 — Affective / homeostatic consciousness
- CTT: index lists Solms's "Affect as the Hidden Spring of Consciousness"
  plus Damasio and Panksepp entries under Homeostatic/Affective. Quiz
  metadata: "Consciousness begins in feeling... rooted in ancient
  brainstem/subcortical systems, not the cortex... Consciousness exists to
  regulate life."
- **c109 "Feeling came first"** — affect (pleasure, pain, hunger, need) is the
  foundation of consciousness; cognition is a late arrival. Standalone root.
- **c110 "Homeostatic regulation is the point"** — Damasio's functional thesis:
  feelings report the body's internal state so the organism can regulate
  itself. Entails **c109** (regulation-through-feeling presupposes feeling as
  the conscious base).
- **c111 "Brainstem, not cortex, is the seat"** — Solms's distinctive claim:
  the reticular activating system / brainstem is the seat; cortical
  elaboration without it is empty. Standalone — it is an anatomical claim
  independent of the feeling-first thesis (a cognitivist could in principle
  locate consciousness subcortically without the affective primacy).
- Theory lists ["c110", "c111"]; c109 inherited via c110.
- Family: Materialism (quiz metadata: "Materialism — affective & predictive").
  Blurb: "Consciousness begins in feeling, in the ancient brainstem, to
  regulate life."
- Judgment call: Panksepp's SEEKING-system specifics and Damasio's somatic
  marker details are mechanisms folded into c110's framing, not separate
  claims. c68 ("Consciousness evolved socially") was NOT reused — the
  affective view grounds consciousness in individual homeostasis, not social
  sharing.

### 24 — Enactivism / embodied cognition
- CTT: index lists Enactivism, Thompson's Mind in Life, and Noë's "Out of Our
  Heads" under Embodied/Enactive. Quiz metadata: "Consciousness isn't in the
  head at all... Perception is like touch: a bodily skill, not an inner
  movie... No brain in a vat could be conscious."
- **c112 "Perception is a bodily skill"** — sensorimotor mastery: perceiving is
  practical knowledge of how movements change sensory input, not an inner
  representation. Standalone root.
- **c113 "No brain in a vat"** — the constitutive thesis: body and world are
  part of experience itself, not merely causal inputs. Entails **c112**
  (the skill thesis is the specific account of why embodiment is
  constitutive). Re-check wording against the CTT Enactivism page if it
  becomes reachable — this is the strongest interpretive claim in the batch.
- Theory lists ["c113"]; c112 inherited.
- Family: Materialism (quiz metadata: "Materialism — embodied & enactive").
  Blurb: "Perception is a bodily skill; no body and world, no consciousness."
- Judgment call: c5 ("Perception is an interface") was NOT reused — that's
  Hoffman's evolutionary-UI thesis, a different view. c85 ("Experience is
  where it seems") was NOT reused — Velmans's phenomenological externalism
  keeps the brain generating experience; enactivism denies the generation is
  brain-internal at all.

### 26 — Orchestrated Objective Reduction — Orch OR
- Page: https://loc.closertotruth.com/theory/penrose-hameroff-s-orchestrated-objective-reduction
  (verbatim from search results; page description confirms: quantum coherence
  in microtubules; OR at a gravity-linked threshold producing "a moment of
  conscious awareness"; Penrose's noncomputability criterion; "Orchestrated"
  = synaptic-input-tuned). Quiz metadata: "Consciousness is non-computational
  — beyond any algorithm (Penrose)... Requires new physics."
- **c114 "Experience needs noncomputational physics"** — Penrose's
  noncomputability criterion plus the new-physics requirement. Standalone
  root.
- **c115 "Microtubule collapses are experience"** — the OR thesis: tubulin
  superpositions collapse at the objective threshold, each collapse a
  primitive experiential moment. Entails **c114**.
- **c116 "Orchestration makes rich moments"** — synaptic inputs/MAPs tune the
  collapses into coherent human moments. Entails **c115**.
- Theory lists ["c116"]; c115/c114 inherited.
- Family: Quantum (new family — the quiz previously had no quantum theories;
  matches the CTT "Quantum" category). Blurb: "Quantum collapses in
  microtubules, orchestrated by the brain, are experience."
- Judgment call: c83/c84 (Beck–Eccles) were NOT reused — those make quantum
  indeterminacy a *gap for mental influence* under substance dualism; Orch OR
  makes quantum collapse the *generator of experience itself*. Deliberately
  kept disjoint.

### 28 — Attention Schema Theory
- CTT: index lists Graziano's Attention Schema Theory under
  Eliminative/Illusionism. Quiz metadata: "The brain builds a simplified,
  cartoonish model of its own attention... and mistakes this model for a
  ghostly, nonphysical essence... (a form of higher-order thought)."
- **c117 "Awareness is a model of attention"** — the attention schema as an
  informational model used to monitor/control attention. Standalone root.
- **c118 "Model mistaken for a soul"** — the error thesis: the schema applied
  to itself produces the belief in a nonphysical essence of awareness.
  Entails **c117**.
- Theory lists ["c118"]; c117 inherited.
- Family: Materialism (quiz metadata: "Materialism — illusionist /
  eliminativist"; the theory is physicalist throughout). Blurb: "Awareness is
  the brain's simplified model of its own attention."
- Judgment call: c53 ("There are no real qualia") was NOT reused — Graziano
  insists AST is not eliminativist about awareness itself (the schema is
  real); what is denied is the *nonphysical essence* interpretation, which
  c118 states directly. Kept disjoint from id 27 Illusionism's c54: AST
  says the brain really builds a model; Frankish says the "what it's like"
  is a benign fiction. Re-check against the CTT page when reachable — the
  AST-vs-illusionism line is the subtle distinction here.

### 29 — Kashmir Shaivism's dynamic non-dualism
- CTT: index lists "Kashmir Shaivism's Dynamic Non-Dualism" under Idealism.
  Quiz metadata: "Consciousness (chit/Shiva) is the fundamental reality, but
  it is dynamic: the universe is consciousness vibrating and contracting
  itself (spanda) into finite forms... unlike stricter Advaita."
- **c119 "Universal consciousness vibrates into world"** — the spanda
  doctrine: one consciousness dynamically manifesting as finite forms.
  Entails **c1** (everything is fundamentally consciousness).
- **c120 "World is real, not illusion"** — the tradition's signature contrast
  with Advaita: the world is a real expression of consciousness, not māyā to
  be escaped. Standalone — it is a stance independent of the vibration
  metaphysics.
- **c121 "Recognition is liberation"** — pratyabhijñā: liberation as
  recognizing one's always-already identity with Shiva. Entails **c119**.
- Theory lists ["c120", "c121"]; c119 and c1 inherited via c121.
- Family: Idealism. Blurb: "One dynamic consciousness vibrates into the world;
  the world is real, and you are it."
- Judgment call: did NOT entail **c35** ("One universal consciousness" →
  "apparent delimitations"): c35's Advaita-flavored "apparent
  delimitations" wording conflicts with KS's affirmation of the world as
  real self-expression — the same reason c120 exists as its own claim.
  c2 ("Matter is mind seen outside") was not entailed either; KS affirms
  matter as real manifestation, not mere appearance. The 36-tattva
  cosmology and the mala (impurity) mechanics are doctrinal detail folded
  into c119's framing, not separate claims.

### 30 — Berkeley's immaterialist idealism
- CTT: index lists "Berkeley's Immaterialist Idealism" under Idealism. Quiz
  metadata: "Nothing exists but minds and the ideas they perceive... 'to be
  is to be perceived' (or to perceive)... Plural: many finite minds plus one
  infinite spirit."
- **c122 "Only minds and ideas exist"** — the immaterialist ontology: no
  mind-independent material substance. Entails **c1**.
- **c123 "To be is to be perceived"** — esse est percipi: sensible objects as
  stable idea-collections sustained by God perceiving all. Entails **c122**
  and **c2** ("Matter is mind seen outside"): physical objects are how mind
  appears, with no independent reality — a clean fit.
- Theory lists ["c123"]; c122, c2, c1 inherited.
- Family: Idealism. Blurb: "Only minds and their ideas exist; things exist
  because they are perceived."
- Judgment call: the plural-minds structure (finite minds + infinite spirit,
  vs. one cosmic mind) is carried by c123's text ("by finite minds and,
  always, by an infinite mind") rather than a separate claim — it is what
  keeps Berkeley distinct from c3 (cosmic mind with alters) in the graph.
  God's role is load-bearing for the *public, coherent* world, so it stays
  in c123 rather than being trimmed.

### 31 — Absolute idealism
- CTT: index lists Bradley's Absolute Idealism and Sprigge's Absolute
  Idealism under Idealism. Quiz metadata: "Sentient experience is the sole
  reality; at its most primitive it is 'feeling'... Bradley's and Sprigge's
  formulations are near-identical; treated as a single quiz outcome."
- **c124 "All reality is one Absolute Experience"** — Bradley's thesis that
  sentient experience is reality; finite things are partial appearances of
  the Absolute. Entails **c1**.
- **c125 "Subject and object are abstractions"** — Bradley's "feeling" as
  pre-relational unity: subject/object/body/self are abstractions from prior
  experiential unity. Entails **c124**.
- Theory lists ["c125"]; c124, c1 inherited.
- Family: Idealism. Blurb: "One Absolute Experience is all there is; subject
  and object are abstractions from it."
- Judgment call: Bradley and Sprigge kept as ONE theory outcome per the
  quiz metadata ("near-identical; treated as a single quiz outcome") —
  matches the existing single entry id 31. Did NOT reuse **c3** ("One
  cosmic mind... alters"): c3's dissociated-alter mechanics is Kastrup's
  specific model; the Absolute is an all-inclusive *experience*, not a mind
  with dissociated parts. c1 is the correct shared parent, and the graph
  now distinguishes analytic idealism (c3), KS dynamism (c119), Berkeleyan
  pluralism (c123), and the Absolute (c125) as four heirs of c1.

### 32 — Kant's transcendental idealism
- CTT: index lists "Kant's Transcendental Idealism" under Idealism. Quiz
  metadata: "Doesn't claim everything is consciousness; it structures what
  experience can be... Phenomena (things-as-experienced) vs.
  things-in-themselves (unknowable)."
- **c126 "We know only things-as-experienced"** — the
  phenomena/noumena divide: things-in-themselves are unknowable. Standalone
  root.
- **c127 "Mind structures all experience"** — the a priori forms (space,
  time, categories) and the transcendental unity of apperception ("I
  think"). Entails **c126**.
- Theory lists ["c127"]; c126 inherited.
- Family: Idealism (quiz metadata classification). Blurb: "We know only
  things-as-experienced; the mind structures all possible experience."
- Interpretive caveat (also recorded on the theory record): Kant deliberately
  does NOT entail **c1** ("Everything is mind"). Kant is not an ontological
  idealist — things-in-themselves exist independently; the mind contributes
  the *form* of experience. Entailing c1 would misrepresent the view and
  collapse Kant into Berkeley. The graph keeps Kant's branch fully disjoint
  from the c1 idealist cluster except by family label.

### 33 — Schelling's nature–spirit identity
- CTT: index lists "Schelling's Nature, Spirit, and the Identity of Mind"
  under Idealism. Quiz metadata: "'nature is visible spirit, spirit is
  invisible nature'; consciousness is nature's own coming-to-awareness...
  Bridges idealism and naturalism — a graded, self-organizing cosmos."
- **c128 "Nature and spirit are one Absolute"** — the identity thesis: nature
  and mind as two poles of one Absolute. Entails **c19** ("one substance,
  two aspects"): Schelling's identity philosophy is the dual-aspect family's
  historical ancestor — the convergence is intended, matching Velmans
  (c86), Teilhard (direct), and Pauli–Jung (c87).
- **c129 "Nature wakes up as consciousness"** — the stages/potencies
  doctrine: nature ascending from unconscious productivity to self-conscious
  mind. Entails **c128**.
- Theory lists ["c129"]; c128, c19 inherited.
- Family: Idealism (quiz metadata). Blurb: "Nature and mind are two poles of
  one Absolute; consciousness is nature waking up."
- Judgment call: the graded, self-organizing cosmos ("stages") is what c129
  adds over bare c19 dual-aspect monism — without it, Schelling would be
  indistinguishable from Spinoza (c20) in the graph.

## Cross-batch consistency notes
- **c1 ("Everything is mind")** now has four new heirs: KS dynamism (c119),
  Berkeleyan pluralism (c122), the Absolute (c124) — plus Kant deliberately
  excluded (see above). The idealist cluster is growing denser; refinement
  candidate: if quiz data shows visitors conflating c119/c122/c124, split
  with more specific differentiae (e.g. Berkeley's theistic sustainment vs.
  KS's real-expression doctrine).
- **c19 ("one substance, two aspects")** gains Schelling (c128) — intended
  convergence for the dual-aspect family (now: Spinoza c20/c21, Velmans c86,
  Teilhard direct, Pauli–Jung c87, Schelling c128).
- **c107 vs c45**: the first-order/HOT opposition is the graph's first
  genuine inter-theory contradiction pair held in the alignment-not-
  consistency model — worth watching in quiz routing (affirming one should
  not auto-reject the other; propagation rules already handle this).
- New family label **"Quantum"** introduced for Orch OR (id 26). If later
  quantum theories arrive (the index lists several under Quantum), they join
  it; otherwise consider folding back into Materialism on review.
- Non-reuse decisions this batch: c79 (Nyāya direct realism) not reused for
  FOR; c5 (Hoffman interface) not reused for enactivism; c85 (Velmans
  externalism) not reused for enactivism; c53/c54 (illusionism) not reused
  for AST; c83/c84 (Beck–Eccles) not reused for Orch OR; c68 (social
  evolution) not reused for affective consciousness; c35 not entailed by KS;
  c3 not reused for Berkeley or the Absolute. Each is documented per-theory
  above.
- Source caveat: because THEORY_LINKS_120 lacks pages for these ten ids, the
  per-theory claims rest on the CTT index + one verified CTT page (Orch OR)
  + quiz metadata + standard scholarly sources. When exact CTT page text for
  these theories becomes reachable, re-audit especially c113 (enactivism's
  constitutive thesis), c118 (AST vs illusionism line), c119–c121 (KS
  doctrinal wording), and c123 (Berkeley page's own phrasing).
