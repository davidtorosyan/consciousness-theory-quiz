/*
  Claims DAG — auditable classification for the Consciousness Theory Quiz.

  Model:
  - Each claim is a single positive statement a theory can affirm.
  - `entails` lists the more general claims this claim logically depends on
    (child -> parent edges). A theory lists ONLY its most specific claims;
    everything more general is computed by walking `entails` upward.
  - `short` is the graph node label (moved here from the lab's hardcoded map).
  - Propagation rules (see src/claims-engine.js):
      affirm specific  -> affirm all ancestors
      reject general   -> reject all descendants
      affirm general   -> children stay open (no conclusion)
      reject specific  -> siblings and parents unaffected
  - The quiz asks, at each step, the undecided claim whose answer would settle
    the most other claims (undecided descendants + undecided ancestors + 1).

  To audit: read a theory's `claims`, then check each `entails` edge it walks
  through. Every routing decision the quiz makes must cite an affirmed claim.

  Batches: batch 1 (c0-c14, theories 1/3/4/5/19) was the five-theory prototype.
  Batch 2 (c15-c34, theories 6-15) added interactionist/emergent dualism,
  Spinozan/Jamesian/Russellian monism, micropsychism, cosmopsychism,
  panprotopsychism/panqualityism, identity theory, and biological naturalism.
  Pre-merge drafts lived in data/claims-batch2.js + data/claims-batch2-notes.md
  (see git history).
*/
window.CLAIMS_VERSION = '2';

window.CLAIMS = Object.freeze([
  {
    id: "c0",
    short: "Ordinary physics is enough",
    text: "Consciousness is entirely explainable by ordinary matter and physics.",
    plain: "Nothing about experience needs anything beyond the physical world.",
    entails: []
  },
  {
    id: "c1",
    short: "Everything is mind",
    text: "Everything that exists is fundamentally consciousness or mind.",
    plain: "Mind isn't made out of something else — it's the basic stuff of reality.",
    entails: []
  },
  {
    id: "c2",
    short: "Matter is mind seen outside",
    text: "The physical world is how consciousness looks from the outside, not an independent reality.",
    plain: "Tables, brains, and stars are appearances of mental activity, not separate things.",
    entails: ["c1"]
  },
  {
    id: "c3",
    short: "One cosmic mind",
    text: "Reality is one single cosmic mind, and individual people are dissociated parts of it.",
    plain: "We're like whirlpools in one stream of consciousness — separate-looking, but one water.",
    entails: ["c1", "c2"]
  },
  {
    id: "c4",
    short: "Many conscious agents",
    text: "Reality is a network of many interacting conscious agents.",
    plain: "Not one big mind — countless smaller minds, interacting.",
    entails: ["c1"]
  },
  {
    id: "c5",
    short: "Perception is an interface",
    text: "Space, time, and physical objects are a species-specific interface evolved for survival, not a report of objective truth.",
    plain: "Perception is like a desktop: icons hide the real machinery, but help you get things done.",
    entails: []
  },
  {
    id: "c6",
    short: "Mind is nonphysical",
    text: "The mind is a nonphysical substance, distinct in kind from the body.",
    plain: "Mind and body are two fundamentally different kinds of thing.",
    entails: []
  },
  {
    id: "c7",
    short: "Self can outlive the body",
    text: "The self can in principle exist without the body.",
    plain: "You could survive the death of your body.",
    entails: ["c6"]
  },
  {
    id: "c8",
    short: "Mind can affect the brain",
    text: "Conscious minds can causally affect the physical brain.",
    plain: "Your thoughts can move matter — physics isn't causally closed.",
    entails: ["c6"]
  },
  {
    id: "c9",
    short: "Experience is fundamental",
    text: "Conscious experience is a fundamental, irreducible feature of nature, like mass or charge.",
    plain: "Experience is basic furniture of the universe, not built out of something else.",
    entails: []
  },
  {
    id: "c10",
    short: "Physical causes are closed",
    text: "Physics is causally closed — experience never moves matter.",
    plain: "Everything physical has a purely physical cause; minds don't push neurons.",
    entails: []
  },
  {
    id: "c11",
    short: "Zombies are conceivable",
    text: "A physical duplicate of you with no inner experience is conceivable.",
    plain: "The 'philosophical zombie' test: if physics doesn't entail experience, experience is extra.",
    entails: ["c9"]
  },
  {
    id: "c12",
    short: "Experience is causal structure",
    text: "A conscious experience is identical to a maximally irreducible cause-effect structure in a physical system.",
    plain: "Experience just is a certain kind of integrated causal structure, measurable as Φ (phi).",
    entails: ["c0", "c13"]
  },
  {
    id: "c13",
    short: "Integrated structure matters",
    text: "What makes a system conscious is its integrated-information structure, not what it computes.",
    plain: "It's about how information is bound together, not about running the right program.",
    entails: ["c0"]
  },
  {
    id: "c14",
    short: "Simulation is not consciousness",
    text: "A behaviorally perfect simulation of a conscious brain would not itself be conscious.",
    plain: "Simulating the inputs and outputs isn't enough — the real causal structure is missing.",
    entails: ["c13"]
  },
  {
    id: "c15",
    short: "mind as active brain-user",
    text: "The conscious mind is an active agent that scans, selects, and unifies the brain's activity — including imposing the unity of the phenomenal field.",
    plain: "The mind isn't a passive product of the brain; it's an active user that reads out from and organizes neural activity.",
    entails: ["c8"]
  },
  {
    id: "c16",
    short: "thought acts on matter only through mind",
    text: "Objective products of thought — theories, ideas, artifacts — can change the physical world only by passing through a conscious mind.",
    plain: "An idea changes the world only when a mind grasps it; subjective experience is an indispensable link in the chain.",
    entails: ["c8"]
  },
  {
    id: "c17",
    short: "brain generates a nonphysical self",
    text: "A sufficiently organized brain naturally generates a new, nonphysical conscious self — a genuine individual, not just new properties.",
    plain: "The brain doesn't just make experiences; it gives rise to a brand-new, nonphysical subject, like a magnet gives rise to its field.",
    entails: ["c6"]
  },
  {
    id: "c18",
    short: "self naturally depends on brain",
    text: "The emergent conscious self is naturally generated by and dependent on the brain — without its brain it would normally cease.",
    plain: "This self needs its brain the way a field needs its magnet; destroy the brain and the self normally goes with it.",
    entails: []
  },
  {
    id: "c19",
    short: "one substance, two aspects",
    text: "There is exactly one substance (God-or-Nature); individual minds and bodies are finite modes of it expressed under different attributes.",
    plain: "There's only one reality, and mind and body are the same thing seen two ways — thought and extension are two views of one thing.",
    entails: []
  },
  {
    id: "c20",
    short: "mind-body parallelism",
    text: "Mind and body never causally interact — a mind and its body are one and the same thing under two descriptions.",
    plain: "The mind never pushes the brain and the brain never pushes the mind; there's no interaction problem because there was never a gap.",
    entails: ["c19"]
  },
  {
    id: "c21",
    short: "graded universal mindedness",
    text: "Mentality is present throughout nature in degrees, tracking the complexity and power of the body.",
    plain: "Everything is 'animate' to some degree; more complex bodies come with richer, more conscious minds.",
    entails: ["c19"]
  },
  {
    id: "c22",
    short: "pure experience prior to mind/matter",
    text: "Mind and matter are both arrangements of a more primitive neutral field of 'pure experience' that is neither mental nor physical.",
    plain: "Reality is made of one neutral stuff that isn't mind or matter yet; mind and matter are roles it plays depending on how it's organized.",
    entails: []
  },
  {
    id: "c23",
    short: "consciousness as function, not entity",
    text: "Within that neutral field, consciousness is not a separate stuff or entity — it is a function that experience performs in certain relations.",
    plain: "There's no ghostly 'consciousness ingredient'; being conscious is about how the neutral stuff is arranged and related.",
    entails: ["c22"]
  },
  {
    id: "c24",
    short: "physics is only structural",
    text: "Physics describes only the structure and relations of matter — never its hidden intrinsic nature.",
    plain: "Science tells us what matter does, never what it is in itself.",
    entails: []
  },
  {
    id: "c25",
    short: "intrinsic nature is (proto-)conscious",
    text: "The hidden intrinsic nature of the physical world is qualitative or experiential — that is where consciousness fits in.",
    plain: "What matter really is on the inside includes experience or its raw ingredients.",
    entails: ["c24"]
  },
  {
    id: "c26",
    short: "micro-subjects",
    text: "The smallest building blocks of nature are conscious subjects with their own rudimentary experiences.",
    plain: "Even particles have a flicker of experience — tiny subjects with tiny viewpoints.",
    entails: ["c9"]
  },
  {
    id: "c27",
    short: "macro from micro",
    text: "Macro-experience is grounded in micro-experience — big minds are built out of small ones.",
    plain: "Your unified experience is somehow composed out of countless tiny experiences combining.",
    entails: ["c26"]
  },
  {
    id: "c28",
    short: "conscious cosmos first",
    text: "The universe as a whole is the one fundamental thing, and it is conscious — individual minds derive from it.",
    plain: "The cosmos itself is one big conscious subject; your mind is a fragment of it, not the other way around.",
    entails: ["c9"]
  },
  {
    id: "c29",
    short: "purposeful cosmos",
    text: "The conscious universe is an agent with purposes of its own that are still unfolding.",
    plain: "The cosmos isn't just aware — it has goals, like explaining why the universe is fine-tuned for life and mind.",
    entails: ["c28"]
  },
  {
    id: "c30",
    short: "subjectless qualities",
    text: "The fundamental ingredients of reality are qualities that belong to no subject — unexperienced qualia.",
    plain: "The basic building blocks have qualitative character (like redness or painfulness) but nobody experiences them.",
    entails: ["c25"]
  },
  {
    id: "c31",
    short: "awareness of organized qualities",
    text: "Consciousness arises when an awareness-conferring structure (such as higher-order representation) makes organized qualities available to a subject.",
    plain: "You become conscious of qualities when your brain's higher-order machinery presents them to you — experience is awareness of qualia.",
    entails: ["c30"]
  },
  {
    id: "c32",
    short: "experience = brain process",
    text: "Every conscious experience is numerically identical to a physical brain process — not merely caused by or correlated with it.",
    plain: "Your pain just is a brain event, the way lightning just is an electrical discharge.",
    entails: ["c0"]
  },
  {
    id: "c33",
    short: "brain causes/realizes consciousness",
    text: "All conscious states are caused by lower-level brain processes and realized in the brain as higher-level biological features.",
    plain: "The brain causes consciousness the way a stomach causes digestion — it's a biological feature of the organism.",
    entails: []
  },
  {
    id: "c34",
    short: "consciousness irreducible",
    text: "Consciousness is a real, irreducible part of the natural world — it cannot be eliminated or ontologically reduced to something else.",
    plain: "Experience is genuinely real and survives any redescription in brain terms; its first-person character can't be reduced away.",
    entails: []
  }
]);

/*
  Theories list ONLY their most specific claims. Ancestors are computed.
  `name`/`family` mirror the main quiz's theory records for cross-referencing;
  families use the short style ("Idealism", "Dualism", "Neutral monism",
  "Panpsychism", "Materialism", "Information").
*/
window.CLAIM_THEORIES = Object.freeze([
  { id:  1, name: "Analytic idealism",               family: "Idealism",      claims: ["c3"] },
  { id:  3, name: "Conscious realism",               family: "Idealism",      claims: ["c4", "c5"] },
  { id:  4, name: "Substance dualism",               family: "Dualism",       claims: ["c7", "c8"] },
  { id:  5, name: "Naturalistic / property dualism", family: "Dualism",       claims: ["c10", "c11"] },
  { id: 19, name: "Integrated Information Theory",   family: "Information",   claims: ["c12", "c14"] },
  { id:  6, name: "Interactionist dualism",          family: "Dualism",       claims: ["c15", "c16"] },
  { id:  7, name: "Emergent dualism",                family: "Dualism",       claims: ["c17", "c18", "c8"] },
  { id:  8, name: "Spinozan dual-aspect monism",     family: "Neutral monism",claims: ["c20", "c21"] },
  { id:  9, name: "Jamesian neutral monism",         family: "Neutral monism",claims: ["c23"] },
  { id: 10, name: "Russellian monism",               family: "Neutral monism",claims: ["c25"] },
  { id: 11, name: "Micropsychism",                   family: "Panpsychism",   claims: ["c27"] },
  { id: 12, name: "Cosmopsychism",                   family: "Panpsychism",   claims: ["c28"] },
  { id: 13, name: "Panprotopsychism / panqualityism",family: "Panpsychism",   claims: ["c31"] },
  { id: 14, name: "Mind–brain identity theory",      family: "Materialism",   claims: ["c32"] },
  { id: 15, name: "Biological naturalism",           family: "Materialism",   claims: ["c33", "c34"] }
]);
