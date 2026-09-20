/*
  Claims DAG prototype — auditable classification for the Consciousness Theory Quiz.

  Model:
  - Each claim is a single positive statement a theory can affirm.
  - `entails` lists the more general claims this claim logically depends on
    (child -> parent edges). A theory lists ONLY its most specific claims;
    everything more general is computed by walking `entails` upward.
  - Propagation rules (see src/claims-engine.js):
      affirm specific  -> affirm all ancestors
      reject general   -> reject all descendants
      affirm general   -> children stay open (no conclusion)
      reject specific  -> siblings and parents unaffected
  - The quiz asks, at each step, the undecided claim whose answer would settle
    the most other claims (undecided descendants + undecided ancestors + 1).

  To audit: read a theory's `claims`, then check each `entails` edge it walks
  through. Every routing decision the quiz makes must cite an affirmed claim.
*/
window.CLAIMS_VERSION = '1';

window.CLAIMS = Object.freeze([
  {
    id: "c0",
    text: "Consciousness is entirely explainable by ordinary matter and physics.",
    plain: "Nothing about experience needs anything beyond the physical world.",
    entails: []
  },
  {
    id: "c1",
    text: "Everything that exists is fundamentally consciousness or mind.",
    plain: "Mind isn't made out of something else — it's the basic stuff of reality.",
    entails: []
  },
  {
    id: "c2",
    text: "The physical world is how consciousness looks from the outside, not an independent reality.",
    plain: "Tables, brains, and stars are appearances of mental activity, not separate things.",
    entails: ["c1"]
  },
  {
    id: "c3",
    text: "Reality is one single cosmic mind, and individual people are dissociated parts of it.",
    plain: "We're like whirlpools in one stream of consciousness — separate-looking, but one water.",
    entails: ["c1", "c2"]
  },
  {
    id: "c4",
    text: "Reality is a network of many interacting conscious agents.",
    plain: "Not one big mind — countless smaller minds, interacting.",
    entails: ["c1"]
  },
  {
    id: "c5",
    text: "Space, time, and physical objects are a species-specific interface evolved for survival, not a report of objective truth.",
    plain: "Perception is like a desktop: icons hide the real machinery, but help you get things done.",
    entails: []
  },
  {
    id: "c6",
    text: "The mind is a nonphysical substance, distinct in kind from the body.",
    plain: "Mind and body are two fundamentally different kinds of thing.",
    entails: []
  },
  {
    id: "c7",
    text: "The self can in principle exist without the body.",
    plain: "You could survive the death of your body.",
    entails: ["c6"]
  },
  {
    id: "c8",
    text: "Conscious minds can causally affect the physical brain.",
    plain: "Your thoughts can move matter — physics isn't causally closed.",
    entails: ["c6"]
  },
  {
    id: "c9",
    text: "Conscious experience is a fundamental, irreducible feature of nature, like mass or charge.",
    plain: "Experience is basic furniture of the universe, not built out of something else.",
    entails: []
  },
  {
    id: "c10",
    text: "Physics is causally closed — experience never moves matter.",
    plain: "Everything physical has a purely physical cause; minds don't push neurons.",
    entails: []
  },
  {
    id: "c11",
    text: "A physical duplicate of you with no inner experience is conceivable.",
    plain: "The 'philosophical zombie' test: if physics doesn't entail experience, experience is extra.",
    entails: ["c9"]
  },
  {
    id: "c12",
    text: "A conscious experience is identical to a maximally irreducible cause-effect structure in a physical system.",
    plain: "Experience just is a certain kind of integrated causal structure, measurable as Φ (phi).",
    entails: ["c0", "c13"]
  },
  {
    id: "c13",
    text: "What makes a system conscious is its integrated-information structure, not what it computes.",
    plain: "It's about how information is bound together, not about running the right program.",
    entails: ["c0"]
  },
  {
    id: "c14",
    text: "A behaviorally perfect simulation of a conscious brain would not itself be conscious.",
    plain: "Simulating the inputs and outputs isn't enough — the real causal structure is missing.",
    entails: ["c13"]
  }
]);

/*
  Theories list ONLY their most specific claims. Ancestors are computed.
  `name`/`family` mirror the main quiz's theory records for cross-referencing.
*/
window.CLAIM_THEORIES = Object.freeze([
  { id: 1,  name: "Analytic idealism",               family: "Idealism",   claims: ["c3"] },
  { id: 3,  name: "Conscious realism",               family: "Idealism",   claims: ["c4", "c5"] },
  { id: 4,  name: "Substance dualism",               family: "Dualism",    claims: ["c6", "c7", "c8"] },
  { id: 5,  name: "Naturalistic / property dualism", family: "Dualism",    claims: ["c9", "c10", "c11"] },
  { id: 19, name: "Integrated Information Theory",   family: "Information", claims: ["c12", "c14"] }
]);
