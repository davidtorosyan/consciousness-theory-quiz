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
  Batch 3 (c35-c54, theories 2/16/17/18/20/22/25/27) added Advaita Vedanta
  nondualism, non-reductive physicalism, functionalism, global workspace
  theory, higher-order thought, predictive processing, EM-field theory,
  and illusionism. Pre-merge drafts lived in data/claims-batch3.js +
  data/claims-batch3-notes.md (see git history).
  Batch 4 (c55-c73, theories 42-47/51-54) added Cartesian dualism, hylomorphism,
  Avicenna, Malebranche, Bergson, Samkhya, trialism, epiphenomenalism,
  Whitehead, and Leibniz. Pre-merge drafts lived in data/claims-batch4.js +
  data/claims-batch4-notes.md (see git history).
  Batch 5 (c74-c101, theories 41/48/49/50/53/55/56/57/58/59) added Aurobindo,
  Nyāya, Vaiśeṣika, Sufi wahdat al-wujūd, Dignāga, Śaṅkara Māyā,
  Libet, Beck-Eccles, Davidson, and Pereira (pre-merge draft deleted; notes at
  data/claims-batch5-notes.md).
  Batch 6 (c107-c129, theories 21/23/24/26/28/29/30/31/32/33) added first-order
  representationalism, affective/homeostatic consciousness, enactivism,
  Orch OR, Attention Schema Theory, Kashmir Shaivism, Berkeley, absolute
  idealism, Kant, and Schelling (pre-merge draft deleted; notes at
  data/claims-batch6-notes.md).
  Batch 7 (c130-c153, theories 34/35/36/37/38/39/40/61/62/63) added Schopenhauer,
  Yogacara, Nagarjuna, McGilchrist, Campbell Big TOE, Goswami, Builes,
  A. Harris, Tye, and Morch (pre-merge draft deleted; notes at
  data/claims-batch7-notes.md).
  Batch 8 (c154-c183, theories 64/65/66/67/68/69/70/71/72/73) added Kadić,
  Schneider-Bailey, Gambini-Pullin, Reber, Wigner-von Neumann, Stapp, Neven,
  Chalmers-McQueen, Bohm, and Faggin (pre-merge draft deleted; notes at
  data/claims-batch8-notes.md).
*/
window.CLAIMS_VERSION = '6';

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
    text: "Reality is one single cosmic mind, and individual people are split-off parts of it — like alters of one mind.",
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
    text: "Space, time, and physical objects are a species-specific user interface shaped by evolution — useful for survival, not a true picture of reality.",
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
    text: "Conscious experience is a fundamental feature of reality — not built out of anything more basic.",
    plain: "Experience is basic furniture of the universe, not built out of something else.",
    entails: []
  },
  {
    id: "c10",
    short: "Physical causes are closed",
    text: "Every physical event has a purely physical cause — minds never move matter.",
    plain: "Everything physical has a purely physical cause; minds don't push neurons.",
    entails: []
  },
  {
    id: "c11",
    short: "Zombies are conceivable",
    text: "A physical duplicate of you with no inner experience is conceivable.",
    plain: "The 'philosophical zombie' thought experiment: a being physically identical to you, behaving exactly the same, with nobody home inside. If that's conceivable, experience must be something extra beyond physics.",
    entails: ["c9"]
  },
  {
    id: "c12",
    short: "Experience is causal structure",
    text: "A conscious experience is identical to a particular kind of cause-and-effect structure in a physical system — the complete pattern of how its parts affect each other — when that pattern is so tightly integrated it can't be divided into independent parts.",
    plain: "A conscious moment is a physical system whose parts affect each other as one tightly bound whole that can't be split into independent pieces.",
    entails: ["c0", "c13"]
  },
  {
    id: "c13",
    short: "Integrated structure matters",
    text: "What makes a system conscious is how tightly its parts are woven into one whole of mutual cause and effect — not the computations or functions it performs.",
    plain: "What matters is the parts forming one inseparable web of mutual influence, not running the right program.",
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
    text: "The conscious mind is an active agent that scans, selects, and unifies the brain's activity — including binding it into a single unified experience.",
    plain: "The mind isn't a passive product of the brain; it's an active user that reads out from and organizes neural activity.",
    entails: ["c8"]
  },
  {
    id: "c16",
    short: "Mind moves matter indirectly",
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
    text: "There is exactly one fundamental reality; individual minds and bodies are that same reality seen under two different aspects — the mental and the physical.",
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
    text: "Mind and matter are both built from something more basic — a single neutral stuff, not yet mental or physical, that James called 'pure experience'.",
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
    text: "Physics describes only how matter relates and behaves — never what matter is in itself.",
    plain: "Science tells us what matter does, never what it is in itself.",
    entails: []
  },
  {
    id: "c25",
    short: "intrinsic nature is (proto-)conscious",
    text: "What the physical world is in itself — beneath what physics describes — is qualitative and experiential; that is where consciousness fits in.",
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
    text: "Consciousness arises when a higher-order structure in the mind — a kind of inner monitor — makes organized qualities available to you as a subject.",
    plain: "You become conscious of qualities when your mind's inner monitor presents them to you.",
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
    text: "Consciousness is a real part of the natural world that can't be explained away or reduced to something non-conscious.",
    plain: "Experience is genuinely real; no redescription in brain terms makes its first-person character disappear.",
    entails: []
  },
  {
    id: "c35",
    short: "One universal consciousness",
    text: "There is a single universal consciousness; individual subjects are apparent delimitations of it, not separate entities.",
    plain: "One awareness underlies everything; your separate self is a case of mistaken identity.",
    entails: ["c1"]
  },
  {
    id: "c36",
    short: "Consciousness is self-revealing",
    text: "Awareness is self-luminous: it reveals itself without needing a second awareness to reveal it, and it is never an object of knowledge.",
    plain: "Awareness doesn't need to be seen to be there — it is the seeing itself.",
    entails: ["c9"]
  },
  {
    id: "c37",
    short: "The separate self is a construction",
    text: "The ordinary experiencing 'I' is a construction: witnessing awareness gets superimposed — laid over and confused with — the body-mind, producing the sense of a separate experiencer.",
    plain: "The 'me' that seems to have experiences is a useful fiction, not the real you.",
    entails: ["c35"]
  },
  {
    id: "c38",
    short: "Experience's contents come from machinery",
    text: "The qualitative variety of experience — colors, pains, thoughts — belongs to a material, insentient mental apparatus, not to consciousness itself.",
    plain: "What you're aware of is built by mental machinery; awareness itself is just the light that reveals it.",
    entails: []
  },
  {
    id: "c39",
    short: "Physical yet irreducible",
    text: "Consciousness is wholly physical but genuinely new — a strongly emergent level of brain organization, unpredictable even in principle from its constituents and not reducible to them.",
    plain: "100% physical, but a real new level — not just neurons redescribed.",
    entails: ["c34"]
  },
  {
    id: "c40",
    short: "Top-down causation is real",
    text: "Higher levels of organization, including conscious states, exert real causal force on lower physical levels — causation runs downward as well as upward.",
    plain: "Thoughts can reach down and steer neurons; causation isn't bottom-up only.",
    entails: []
  },
  {
    id: "c41",
    short: "Mind is defined by its role",
    text: "What makes a mental state the state it is is its functional role — the causal relations among sensory inputs, internal states, and motor outputs — not what it is made of.",
    plain: "Pain is pain because of what it does in the system, not because of the neurons.",
    entails: []
  },
  {
    id: "c42",
    short: "Same mind, different hardware",
    text: "The same conscious state can be realized in radically different physical systems — human brains, animal brains, or machines — as long as the functional organization is the same.",
    plain: "You could be made of Swiss cheese and it wouldn't matter, if the wiring did the same job.",
    entails: ["c41"]
  },
  {
    id: "c43",
    short: "Consciousness is global broadcast",
    text: "A mental state is conscious when it wins a competition among brain processes and is broadcast brain-wide, becoming available to attention, memory, speech, and action.",
    plain: "Whatever gets onto the brain's public announcement system is what you're conscious of.",
    entails: []
  },
  {
    id: "c44",
    short: "Attention gates consciousness",
    text: "Attention is a prerequisite for consciousness — the brain does a great deal of processing unconsciously until attention amplifies a signal into awareness.",
    plain: "Your brain works unconsciously most of the time; attention is the gate that lets things into awareness.",
    entails: []
  },
  {
    id: "c45",
    short: "Consciousness needs a higher thought",
    text: "A mental state is conscious only when the mind forms a thought about being in that state — that higher thought is what makes it conscious.",
    plain: "A feeling becomes conscious when your mind registers 'I'm having this feeling' — even if that registration is itself unconscious.",
    entails: []
  },
  {
    id: "c46",
    short: "Qualities can exist unconsciously",
    text: "Mental qualities (the raw feel of red, say) can exist without being conscious; they become conscious only through the mind’s awareness of them.",
    plain: "Your brain can carry the quality of redness without you being conscious of it — consciousness is the noticing.",
    entails: ["c45"]
  },
  {
    id: "c47",
    short: "The brain is a prediction engine",
    text: "The brain is fundamentally a prediction machine: top-down predictions about the causes of sensory input are constantly compared against bottom-up prediction errors.",
    plain: "Your brain doesn't passively receive the world — it predicts it, then corrects its guesses.",
    entails: []
  },
  {
    id: "c48",
    short: "Experience is controlled prediction",
    text: "Conscious experience is the brain's best controlled prediction — a synthesis of predictive expectation and sensory information.",
    plain: "What you experience is your brain's best guess about the world, refined by the senses.",
    entails: ["c47"]
  },
  {
    id: "c49",
    short: "Mind can extend beyond the skull",
    text: "The mind is not confined to the brain — predictive brains can participate in larger cognitive circuits that include the body, tools, and environment.",
    plain: "Thinking can loop through tools, body, and world, not just neurons.",
    entails: []
  },
  {
    id: "c50",
    short: "Consciousness is the brain's EM field",
    text: "Consciousness is the brain's global electromagnetic field — the coherent field generated by neural activity itself, not merely the firing patterns that produce it.",
    plain: "What it's like to be you just is the electromagnetic field your brain generates.",
    entails: ["c0"]
  },
  {
    id: "c51",
    short: "Fields bind experience together",
    text: "Electromagnetic fields bind distributed neural activity into unified conscious experience through their physical properties of superposition and interference.",
    plain: "The field stitches scattered brain activity into one seamless experience — it's the physical glue.",
    entails: []
  },
  {
    id: "c52",
    short: "The field pushes neurons around",
    text: "The brain's electromagnetic field exerts downward causation on neural firing — field and neurons influence each other in both directions.",
    plain: "The field isn't just an echo of neurons; it pushes back and steers them.",
    entails: ["c40"]
  },
  {
    id: "c53",
    short: "There are no real qualia",
    text: "There are no private, indescribable inner qualities of experience — the philosophical idea of ‘qualia’ is a fiction.",
    plain: "'What it's like' isn't a special inner property — that idea is a philosophical fiction.",
    entails: []
  },
  {
    id: "c54",
    short: "Experience is a user illusion",
    text: "Conscious experience is a benign 'user illusion' produced by the brain's unconscious processes — real as a functional pattern, but not what it seems to be.",
    plain: "Your experience is like a desktop interface: useful and real as a pattern, but hiding what's really going on.",
    entails: ["c53", "c0"]
  },
  {
    id: "c55",
    short: "Physics allows mental causation",
    text: "A nonphysical mind can affect the brain without violating physics; the conservation-of-energy objection to such interaction fails.",
    plain: "Physics can't be used to prove that a mind can't move the brain.",
    entails: ["c8"]
  },
  {
    id: "c56",
    short: "Soul as bodily form",
    text: "A living thing's soul is its organizing form — not a separate thing inside it, but what makes this matter one living organism.",
    plain: "The soul isn't a ghost in the machine; it's the organized way a living body is alive.",
    entails: []
  },
  {
    id: "c57",
    short: "Perception notices itself",
    text: "When we perceive, we also perceive that we perceive — awareness of perceiving is built into perceiving itself, not a separate act.",
    plain: "Seeing comes with knowing that you see.",
    entails: []
  },
  {
    id: "c58",
    short: "Self-awareness without senses",
    text: "Even with no sensory contact at all — no sight, touch, or memory — you would still be aware that you exist; self-awareness needs no sensory content.",
    plain: "Float in empty space with no senses and you'd still know you're there.",
    entails: ["c6"]
  },
  {
    id: "c59",
    short: "God alone causes",
    text: "No created thing — no body, no finite mind — has real causal power; God alone causes.",
    plain: "Nothing in nature truly causes anything; only God does.",
    entails: []
  },
  {
    id: "c60",
    short: "Brain only occasions sensation",
    text: "Bodily and brain processes do not produce our sensations; they are only occasions on which God produces the corresponding experience in the soul.",
    plain: "Your brain doesn't make your sensations; God makes them when your brain acts.",
    entails: ["c59"]
  },
  {
    id: "c61",
    short: "Brain filters consciousness",
    text: "The brain does not generate, store, or reconstruct experience; it transmits perception to consciousness and filters the past so we can act in the present.",
    plain: "Your brain doesn't make consciousness — it narrows it down so you can act.",
    entails: []
  },
  {
    id: "c62",
    short: "Consciousness is lived time",
    text: "Consciousness is essentially duration — the felt, indivisible flow of the past melting into the future, utterly unlike the time on a clock.",
    plain: "Your inner life is a flowing stream of time, not a string of frozen instants.",
    entails: []
  },
  {
    id: "c63",
    short: "Mental machinery is natural",
    text: "Intellect, ego, memory, emotion, and the senses are all products of unconscious nature — your mental machinery is natural through and through.",
    plain: "Your whole mental machinery — thoughts, memories, ego — belongs to nature, not to consciousness.",
    entails: []
  },
  {
    id: "c102",
    short: "Only the witness is outside nature",
    text: "The witness — pure witnessing awareness — stands entirely outside nature; everything else about the mind is natural, and only the witness is not.",
    plain: "One thing alone isn't part of nature: the silent witness itself.",
    entails: ["c63"]
  },
  {
    id: "c64",
    short: "Consciousness as pure witness",
    text: "Consciousness itself is pure, contentless witnessing: it never acts, changes, thinks, or feels — it only watches.",
    plain: "Consciousness is just the silent watcher; it does nothing and never changes.",
    entails: ["c9"]
  },
  {
    id: "c65",
    short: "Consciousness can't emerge",
    text: "No arrangement of insentient matter or mind, however complex, can produce consciousness; awareness cannot emerge from the non-aware.",
    plain: "You can't stack up unconscious stuff and get consciousness out.",
    entails: ["c34"]
  },
  {
    id: "c66",
    short: "Three irreducible domains",
    text: "Mind, matter, and at least one further domain — such as their union, objective knowledge, or mathematical reality — are each basic and can't be reduced to the others; reality doesn't split into just one or two kinds.",
    plain: "Reality has three basic realms relevant to consciousness, not one or two.",
    entails: []
  },
  {
    id: "c67",
    short: "Consciousness does nothing",
    text: "Subjective experience has no causal power of its own: all the work attributed to it — deciding, controlling, steering behavior — is done by nonconscious brain systems.",
    plain: "Your feeling of being in control doesn't actually control anything.",
    entails: []
  },
  {
    id: "c68",
    short: "Consciousness evolved socially",
    text: "Subjective awareness evolved to serve social life: sharing inner states helps groups communicate, cooperate, and survive.",
    plain: "Consciousness evolved to help us share our inner lives with each other.",
    entails: []
  },
  {
    id: "c69",
    short: "Every event experiences",
    text: "Every basic happening in nature has an inner experiential side — even the simplest events 'feel' something of the rest of reality, though they are not conscious.",
    plain: "Every tiny event in nature has a flicker of inner life, but none of it is conscious.",
    entails: ["c9"]
  },
  {
    id: "c70",
    short: "Consciousness rare, late",
    text: "Consciousness, as full self-aware experience, is rare and late in nature — it arises only in complex organisms under special conditions.",
    plain: "Real, self-aware consciousness is rare and came late in nature's story.",
    entails: []
  },
  {
    id: "c71",
    short: "Events are fundamental",
    text: "The world is made of happenings and their becoming — drops of experience — not of static substances with properties.",
    plain: "Reality is made of events, not stuff.",
    entails: []
  },
  {
    id: "c72",
    short: "Reality is perceiving monads",
    text: "The basic building blocks of reality are simple, partless, immaterial units — monads — each perceiving the whole universe from its own point of view, changing only from within.",
    plain: "Everything is made of tiny mind-like units, each mirroring the whole universe inside itself.",
    entails: []
  },
  {
    id: "c73",
    short: "No real interaction",
    text: "No monad ever acts on another; mind and body only seem to interact because God set every monad's inner unfolding to run in perfect pre-established harmony.",
    plain: "Nothing in the universe ever truly affects anything else — it's all choreographed in advance.",
    entails: []
  },
  {
    id: "c74",
    short: "Evolution unfolds involved consciousness",
    text: "Evolution is not the creation of something new but the unfolding of consciousness that was already involved — hidden — within matter. Nothing can evolve which was not already there.",
    plain: "Evolution doesn't invent consciousness; it unfolds what was hidden in matter all along.",
    entails: ["c9"]
  },
  {
    id: "c75",
    short: "Matter is involved spirit",
    text: "Matter is not separate from spirit — it is consciousness in its most primitive, involved form. There is no ontological gap between matter and mind.",
    plain: "Matter is spirit in disguise — the most primitive form consciousness takes.",
    entails: ["c1"]
  },
  {
    id: "c76",
    short: "Consciousness evolves ever higher",
    text: "Evolution has a spiritual direction: the human mind is far too imperfect to be nature's final resting point — still higher forms of consciousness are bound to unfold.",
    plain: "Human minds aren't the end of the story; higher consciousness is on its way.",
    entails: ["c74"]
  },
  {
    id: "c77",
    short: "Self can exist unconsciously",
    text: "The enduring self is not essentially conscious: consciousness is a contingent quality that arises in the self only under the right conditions, so the self can exist with no awareness at all — as in dreamless sleep.",
    plain: "You are not your awareness — you could exist with no experience whatsoever.",
    entails: ["c6"]
  },
  {
    id: "c78",
    short: "Awareness needs a second act",
    text: "A cognition reveals its object but never itself; knowing that you know requires a distinct, second act of inner perception — awareness of awareness is never built in.",
    plain: "Seeing doesn't come with knowing that you see — that takes a separate mental act.",
    entails: []
  },
  {
    id: "c79",
    short: "Qualities are in objects",
    text: "Sensible qualities like color, sound, and smell are real qualities of mind-independent objects — veridical perception presents the world itself, not an inner replica.",
    plain: "The redness is out there in the apple, not in your head.",
    entails: []
  },
  {
    id: "c80",
    short: "Experience is a nonphysical field",
    text: "Subjective experience is a field-like phenomenon generated by the activity of billions of neurons — yet it is nonphysical, belonging to no known category of physical field, and not detectable by physical means.",
    plain: "Experience is a real field the brain produces — but no instrument could ever detect it.",
    entails: ["c81"]
  },
  {
    id: "c81",
    short: "Nonphysical, not a substance",
    text: "Conscious experience is nonphysical — not describable in physical terms — yet it is not a separate substance that could exist apart from the brain; it is a property of the neural system.",
    plain: "Experience isn't physical, but it isn't a ghost that could float free of the brain either.",
    entails: []
  },
  {
    id: "c82",
    short: "Field influences neurons both ways",
    text: "The conscious field is generated by neural activity and in turn causally influences neural function — the interaction runs in both directions.",
    plain: "Neurons make the field, and the field pushes back on the neurons.",
    entails: ["c81"]
  },
  {
    id: "c83",
    short: "Mind steers quantum synapses",
    text: "Conscious intention becomes effective in the brain by momentarily shifting the probabilities of quantum events in synapses — selecting which neurotransmitter releases happen — without violating any physical law.",
    plain: "Your intentions nudge the quantum coin-flips in your synapses, tipping which neurons fire.",
    entails: ["c8"]
  },
  {
    id: "c84",
    short: "Quantum gaps leave room",
    text: "The fundamental indeterminacy of quantum events means the brain's future is not fully fixed by its past — leaving a genuine opening for mental influence.",
    plain: "Quantum randomness means physics doesn't fix everything, so mind has room to act.",
    entails: []
  },
  {
    id: "c85",
    short: "Experience is where it seems",
    text: "Experiences are located (roughly) where they seem to be: a pain is in the foot, not in the brain — the phenomenal world is the physical world as experienced, not something inside the head.",
    plain: "Your pain really is in your foot — experience isn't locked inside the skull.",
    entails: []
  },
  {
    id: "c86",
    short: "Universe aware of itself",
    text: "The universe differentiates into parts and becomes conscious of itself in manifold ways — each human mind is the universe participating in its own self-awareness.",
    plain: "Through you, the universe is becoming aware of itself.",
    entails: ["c19"]
  },
  {
    id: "c87",
    short: "Mind-matter complementarity",
    text: "Mind and matter are two complementary aspects — mutually exclusive yet jointly necessary descriptions, like particle and wave — of a single underlying reality that is itself neither mental nor physical.",
    plain: "Mind and matter are two sides of one coin, and you can never see both sides at once.",
    entails: ["c19"]
  },
  {
    id: "c88",
    short: "Neutral ground unknowable",
    text: "The psychophysically neutral reality underlying mind and matter cannot be apprehended directly at all — it is the condition of knowledge, not an object of it; neither mind nor matter has ontological priority.",
    plain: "The deep reality behind mind and matter exists, but can never be directly known.",
    entails: []
  },
  {
    id: "c89",
    short: "Awareness alters its object",
    text: "Bringing an unconscious content into awareness irreversibly transforms it, the way measuring a quantum system disturbs it — introspection is never neutral observation.",
    plain: "Looking at your own mind changes what you see.",
    entails: []
  },
  {
    id: "c90",
    short: "Complexity means consciousness",
    text: "There is a law of complexity-consciousness: the greater the exterior physical complexity of a system, the greater its interior consciousness — evolution is fundamentally the rise of consciousness.",
    plain: "More complex matter means more consciousness; evolution is consciousness rising.",
    entails: []
  },
  {
    id: "c91",
    short: "Evolution drawn to Omega",
    text: "Evolution is drawn forward by Omega — the absolute whole and prime mover — toward ever-greater convergence and unity of consciousness, ultimately identified with God.",
    plain: "Evolution is being pulled toward a final unity of all consciousness — Omega.",
    entails: []
  },
  {
    id: "c92",
    short: "Planetary mind-layer forming",
    text: "Individual human minds are converging into a planetary noosphere — a shared layer of thought and mind enveloping the Earth.",
    plain: "All human minds are merging into one planetary mind-layer.",
    entails: ["c90"]
  },
  {
    id: "c93",
    short: "Mental events are physical",
    text: "Every particular mental event — this pain, that thought — is numerically identical with a physical event in the brain; there is no extra mental stuff.",
    plain: "Each of your thoughts just is a physical brain event.",
    entails: []
  },
  {
    id: "c94",
    short: "No mind-brain laws",
    text: "There are no strict natural laws connecting mental phenomena with physical phenomena — psychology can never be a science like physics, with exceptionless laws for thoughts and actions.",
    plain: "There will never be strict laws mapping thoughts to neurons.",
    entails: []
  },
  {
    id: "c95",
    short: "Mind causes physical events",
    text: "Mental events have genuine causal powers — your beliefs and desires really cause your body to move and physical events to happen.",
    plain: "Your thoughts genuinely cause physical things to happen.",
    entails: []
  },
  {
    id: "c96",
    short: "Three aspects, one substance",
    text: "Brain and mind are a single substance with three inseparable aspects: the physiological (neurons, glia, chemistry), the mental-unconscious (informational patterns like brain waves), and the mental-conscious (felt experience itself).",
    plain: "Your brain has three inseparable sides: its wetware, its information patterns, and your felt experience.",
    entails: []
  },
  {
    id: "c97",
    short: "Consciousness co-emerges",
    text: "Consciousness is a co-emergent property that arises from the three aspects together — it cannot be separated from the physiological and informational processes it emerges with.",
    plain: "Consciousness emerges together with brain activity — never apart from it.",
    entails: ["c96"]
  },
  {
    id: "c98",
    short: "Astrocytes make feelings",
    text: "Networks of astrocyte glial cells integrate distributed neural information into large waves that instantiate feelings, then feed back to modulate synapses.",
    plain: "Star-shaped brain cells stitch neural signals into feelings, then tune the neurons back.",
    entails: ["c96"]
  },
  {
    id: "c99",
    short: "Information is fundamental",
    text: "Information is an ontologically fundamental feature of reality — not just a description we impose, but part of the basic furniture of the world.",
    plain: "Information isn't just a human idea — it's woven into reality itself.",
    entails: []
  },
  {
    id: "c100",
    short: "Information's two faces",
    text: "Every informational state has two aspects: a physical aspect (realized in brains, computers, and other systems) and a phenomenal aspect (realized as subjective experience) — the same information, two faces.",
    plain: "Information has an outside (physical) and an inside (felt) — same coin, two sides.",
    entails: ["c99"]
  },
  {
    id: "c101",
    short: "Information implies experience",
    text: "Wherever information is realized, there is a potential for conscious experience — experience and information always go together.",
    plain: "Where there's information, experience is at least possible.",
    entails: ["c100"]
  },
  {
    id: "c103",
    short: "Tiny unconscious perceptions add up",
    text: "Beneath awareness the mind holds countless tiny unconscious perceptions — petites perceptions — too faint to notice on their own, that add up to conscious experience.",
    plain: "Like the roar of the sea built from tiny unheard wave-sounds, experience is built from countless tiny unnoticed perceptions.",
    entails: ["c72"]
  },
  {
    id: "c104",
    short: "No mechanics explains perception",
    text: "Perception cannot be explained mechanically: imagine a brain enlarged to the size of a mill — inside you would see only parts pushing parts, never anything that explains perception.",
    plain: "Walk inside a giant brain and you'd see only moving parts — nothing there explains how it feels to perceive.",
    entails: []
  },
  {
    id: "c105",
    short: "Inner striving drives change",
    text: "Each monad changes only from within, driven by an inner striving — appetition — that carries it from one perception to the next.",
    plain: "Each tiny unit is self-propelled: an inner push carries it from one perception to the next.",
    entails: ["c72"]
  },
  {
    id: "c106",
    short: "Monads come in degrees",
    text: "Monads come in degrees: bare monads with only faint perception, souls with memory, and rational minds that can reflect on themselves.",
    plain: "Mind-like units range from dim and forgetful, to memory-having, to fully self-aware.",
    entails: ["c72"]
  }
,
  {
    id: "c107",
    short: "No higher-order state needed",
    text: "A mental state is conscious just by being a world-directed representation — no higher thought or monitoring of the state is needed.",
    plain: "No inner watcher is required — being conscious doesn't take a second thought.",
    entails: []
  },
  {
    id: "c108",
    short: "Phenomenal character is representational content",
    text: "What an experience feels like is nothing more than what it represents — its content about the world.",
    plain: "How it feels is fully fixed by what it's about.",
    entails: ["c107"]
  },
  {
    id: "c109",
    short: "Feeling came first",
    text: "Consciousness begins in feeling: affect — pleasure, pain, hunger, need — is the foundation of all conscious experience, not cognition.",
    plain: "Feeling came first; thinking is a late add-on.",
    entails: []
  },
  {
    id: "c110",
    short: "Homeostatic regulation is the point",
    text: "Consciousness exists to regulate life: feelings report the body's internal state so the organism can maintain itself.",
    plain: "Experience tells the organism how it's doing — that's its job.",
    entails: ["c109"]
  },
  {
    id: "c111",
    short: "Brainstem, not cortex, is the seat",
    text: "The ancient brainstem and subcortical systems — not the cortex — are the core seat of consciousness; rich cortex without them is empty.",
    plain: "Consciousness lives in the old lower brain, not the fancy outer layer.",
    entails: []
  },
  {
    id: "c112",
    short: "Perception is a bodily skill",
    text: "Perceiving is not building an inner picture of the world; it is a bodily skill — practical mastery of how your movements change what you sense.",
    plain: "Seeing is more like touching than like watching a movie in your head.",
    entails: []
  },
  {
    id: "c113",
    short: "No brain in a vat",
    text: "A brain in a vat — or any brain cut off from body and world — could not be conscious; body and environment are constitutive of experience, not just its causes.",
    plain: "Cut the body and world away and there's no mind left — they're part of the experience itself.",
    entails: ["c112"]
  },
  {
    id: "c114",
    short: "Experience needs noncomputational physics",
    text: "Consciousness is non-computational: no algorithm running on a classical computer could be conscious, because experience depends on quantum-gravity effects in the brain.",
    plain: "A computer running the right program would still miss it — consciousness needs brand-new physics.",
    entails: []
  },
  {
    id: "c115",
    short: "Microtubule collapses are experience",
    text: "Quantum superpositions inside neuronal microtubules collapse at a gravity-linked threshold, and each such collapse is a primitive moment of conscious experience.",
    plain: "Tiny quantum collapses inside brain cells are the atoms of experience.",
    entails: ["c114"]
  },
  {
    id: "c116",
    short: "Orchestration makes rich moments",
    text: "Synaptic inputs and brain processes 'orchestrate' — tune and shape — these quantum collapses, turning primitive flickers into the rich, coherent moments of human experience.",
    plain: "The brain tunes the quantum flickers into full, rich experiences.",
    entails: ["c115"]
  },
  {
    id: "c117",
    short: "Awareness is a model of attention",
    text: "The brain builds a simplified informational model of its own attention — an attention schema — to monitor and control it.",
    plain: "Your brain keeps a crude sketch of what it's paying attention to, and uses it to steer.",
    entails: []
  },
  {
    id: "c118",
    short: "Model mistaken for a soul",
    text: "What we call awareness is the brain's attention-schema applied to itself; the brain attributes this simplified model to itself as a ghostly, nonphysical essence.",
    plain: "We take our brain's crude self-sketch for a mysterious inner essence — but it's just data.",
    entails: ["c117"]
  },
  {
    id: "c119",
    short: "Universal consciousness vibrates into world",
    text: "The one universal consciousness is inherently dynamic: it vibrates and contracts itself into the world of finite things and selves.",
    plain: "Reality is one consciousness pulsing itself into everything you see.",
    entails: ["c1"]
  },
  {
    id: "c120",
    short: "World is real, not illusion",
    text: "The world is a real expression of consciousness — not an illusion to be escaped or denied.",
    plain: "The world is genuinely real, not a trick to see through.",
    entails: []
  },
  {
    id: "c121",
    short: "Recognition is liberation",
    text: "Liberation is recognition: the individual self realizing it was always identical with universal consciousness.",
    plain: "Enlightenment isn't becoming something new — it's remembering what you always were.",
    entails: ["c119"]
  },
  {
    id: "c122",
    short: "Only minds and ideas exist",
    text: "Nothing exists except minds and the ideas they perceive — there is no mind-independent material substance at all.",
    plain: "Reality is minds plus what they experience — and nothing else, no matter-stuff.",
    entails: ["c1"]
  },
  {
    id: "c123",
    short: "To be is to be perceived",
    text: "Physical objects are stable collections of sensory ideas sustained by God: a table exists because it is perceived — by finite minds and, always, by an infinite mind.",
    plain: "Things exist because they're being experienced — and God is always watching.",
    entails: ["c122","c2"]
  },
  {
    id: "c124",
    short: "All reality is one Absolute Experience",
    text: "Sentient experience is the sole reality; everything finite is a partial appearance of one all-inclusive Absolute Experience.",
    plain: "One all-inclusive experience is all there is; finite minds are glimpses of it.",
    entails: ["c1"]
  },
  {
    id: "c125",
    short: "Subject and object are abstractions",
    text: "Subject, object, body, and self are abstractions from a prior experiential unity — at its most primitive, experience is undivided feeling, not a relation between a perceiver and a perceived.",
    plain: "Before there's a 'you' seeing an 'it,' there's just undivided feeling — the split comes later.",
    entails: ["c124"]
  },
  {
    id: "c126",
    short: "We know only things-as-experienced",
    text: "We can know things only as they appear to us — phenomena; things as they are in themselves are forever beyond our knowledge.",
    plain: "You'll never know reality as it really is — only how it shows up for you.",
    entails: []
  },
  {
    id: "c127",
    short: "Mind structures all experience",
    text: "All possible experience is structured by the mind's own forms — space, time, and the categories — unified by the 'I think' that accompanies every perception.",
    plain: "Space, time, and cause-and-effect are your mind's lenses, not the world's raw features.",
    entails: ["c126"]
  },
  {
    id: "c128",
    short: "Nature and spirit are one Absolute",
    text: "Nature and mind are not two kinds of being but two poles of one Absolute: nature is visible spirit, spirit is invisible nature.",
    plain: "Nature and mind are the same reality seen from opposite ends.",
    entails: ["c19"]
  },
  {
    id: "c129",
    short: "Nature wakes up as consciousness",
    text: "Consciousness is nature's own coming-to-awareness: nature ascends through stages — from unconscious productivity to self-conscious mind.",
    plain: "Consciousness is nature waking up through you, stage by stage.",
    entails: ["c128"]
  },
  {
    id: "c130",
    short: "The world is representation",
    text: "Ordinary experience is the world as representation: objects exist only for a subject, structured by the mind's forms of space, time, and causality — never things as they are in themselves.",
    plain: "What you see isn't the world as it is — it's the world as your mind formats it.",
    entails: ["c126"]
  },
  {
    id: "c131",
    short: "Will is the inner essence",
    text: "Behind representation, the inner essence of everything — organic and inorganic alike — is will: a single, blind, aimless striving that is explicitly non-conscious.",
    plain: "Underneath everything sits a mindless, hungry drive — not a mind, not a purpose.",
    entails: []
  },
  {
    id: "c132",
    short: "Consciousness is the will's tool",
    text: "Consciousness and intellect are not the essence of the self but secondary biological instruments the will develops in higher organisms to serve its striving — they can vanish while the will persists.",
    plain: "Your awareness is a gadget your deeper drive built, not the boss of it.",
    entails: ["c131"]
  },
  {
    id: "c133",
    short: "We know will from inside",
    text: "Our own body is the single window onto reality as it is: known externally as a physical object and immediately from within as felt willing — and everything else is will in the same sense.",
    plain: "You don't just see your body — you feel your own willing from the inside, and that feeling is what the whole world is made of.",
    entails: ["c131"]
  },
  {
    id: "c134",
    short: "Store consciousness underlies experience",
    text: "A subliminal store consciousness retains the seeds of past intentional actions and conditions the arising of ordinary awareness, explaining how experience coheres and resumes across gaps — without any eternal self.",
    plain: "Below your everyday awareness sits a deep memory-bank that seeds each new moment of experience.",
    entails: []
  },
  {
    id: "c135",
    short: "Subject and object are constructed",
    text: "The felt split between an apprehending subject and apprehended objects is a bifurcation occurring within cognition itself — not a division in reality.",
    plain: "The 'you vs. world' split happens inside experience; reality has no such split.",
    entails: ["c1"]
  },
  {
    id: "c136",
    short: "Everything exists only dependently",
    text: "Nothing possesses intrinsic nature — existence from its own side: everything, including consciousness, exists only in dependence on causes, parts, relations, and concepts.",
    plain: "Nothing stands alone; everything exists only because of other things — including awareness itself.",
    entails: []
  },
  {
    id: "c137",
    short: "Consciousness real, yet empty",
    text: "Seeing, feeling, and suffering occur conventionally — but consciousness has no ultimate essence, no self-grounding core, and no enduring experiencer behind it; it is dependently arisen, and therefore empty.",
    plain: "Experience genuinely happens, but there's no deep 'self' or essence behind it.",
    entails: ["c136"]
  },
  {
    id: "c138",
    short: "No self-illuminating core",
    text: "Awareness is not self-intimating in any way that could ground certainty: it has no privileged reflexive access to itself, so experience can never be its own foundation.",
    plain: "Your awareness can't vouch for itself from the inside — there's no inner bedrock.",
    entails: ["c137"]
  },
  {
    id: "c139",
    short: "Consciousness is primordial process",
    text: "Consciousness is irreducible, primordial, and omnipresent — but it is not a thing; it is a creative, relational process, the fundamental given natural fact.",
    plain: "Awareness isn't an object in the world — it's the creative flow the world is made of.",
    entails: ["c9"]
  },
  {
    id: "c140",
    short: "Matter is a phase of consciousness",
    text: "Matter is not a separate substance but a phase or kind of consciousness — like ice is a phase of water: different in properties, but part of the same ontology.",
    plain: "Matter is what consciousness looks like when it hardens into a certain phase.",
    entails: ["c1"]
  },
  {
    id: "c141",
    short: "Relations are primary, things secondary",
    text: "Everything is relational, and what we call things — the relata — are secondary to relationship; subjects and objects co-arise, and neither is prior.",
    plain: "Relationships come first; the 'things' in them come second — including you and the world you meet.",
    entails: []
  },
  {
    id: "c142",
    short: "Reality is a computed virtuality",
    text: "The physical universe is a virtual reality computed by a Larger Consciousness System; there is no objective world outside of us — the hard problem dissolves once the belief in a fundamental external reality is dropped.",
    plain: "The world is a shared simulation run by a larger consciousness — not an objective place out there.",
    entails: []
  },
  {
    id: "c143",
    short: "We are consciousness units evolving",
    text: "We are individuated units of consciousness — immortal, interconnected parts of the Larger Consciousness System — who enter the virtual-reality game of life to evolve the quality of our consciousness, from fear to love.",
    plain: "You are a fragment of a vast consciousness, here in this world to grow less fearful and more loving.",
    entails: ["c28"]
  },
  {
    id: "c144",
    short: "Consciousness collapses the wave",
    text: "Consciousness is the agency that collapses the wave function of a quantum object, choosing among its possibilities — it is consciousness, not matter, that makes the material world manifest.",
    plain: "Your awareness picks which quantum possibility becomes real — that's how matter gets made.",
    entails: []
  },
  {
    id: "c145",
    short: "One consciousness, we participate",
    text: "There is only one consciousness, one subject of experience, in which we all participate; the ego is merely constricted consciousness, and expanded states reveal the participation.",
    plain: "There's really one awareness, and you're a narrowed-down corner of it.",
    entails: ["c35"]
  },
  {
    id: "c146",
    short: "Idealism is metaphysically necessary",
    text: "It is metaphysically necessary — true in all possible worlds — that every fundamental entity is conscious and every fundamental property is a phenomenal property.",
    plain: "It couldn't have been otherwise: reality had to be mind-first, in every possible world.",
    entails: ["c1"]
  },
  {
    id: "c147",
    short: "Possible worlds are divine thoughts",
    text: "Only one world is fundamental; all other possible worlds exist as ideas — precise, structured representations — in the mind of a divine being, or a structurally similar ideal observer.",
    plain: "Every way things could have been exists as a thought in a divine mind; only our world is fundamental.",
    entails: ["c146"]
  },
  {
    id: "c148",
    short: "Consciousness is a fundamental field",
    text: "Consciousness is like spacetime: a fundamental field that is everywhere — not something generated only by complex brains, but intrinsic to matter all along.",
    plain: "Awareness is woven through everything the way spacetime is — not switched on by brains.",
    entails: ["c25"]
  },
  {
    id: "c149",
    short: "Field without selfhood",
    text: "A conscious field in matter does not mean rocks have experiences or points of view; only certain complex arrangements of matter yield experience, subjects, and selfhood — there is no 'combining' problem for the field itself.",
    plain: "Everything is in the field, but a rock isn't having a day — subjects need the right arrangement.",
    entails: ["c148"]
  },
  {
    id: "c150",
    short: "Consciousness* is irreducible",
    text: "At the most fundamental level there is 'consciousness*' — what others would call protoconsciousness — and it is irreducible: there is no plausible reductive physical candidate for it.",
    plain: "At rock bottom sits something experience-like that no physical story can reduce away.",
    entails: ["c34"]
  },
  {
    id: "c151",
    short: "Consciousness is on/off",
    text: "There are no borderline cases of phenomenal consciousness itself — it is an on/off matter — and the best explanation of that sharpness is that consciousness is irreducible.",
    plain: "Awareness isn't a dimmer switch — it's on or off, and that sharpness means it's fundamental.",
    entails: ["c150"]
  },
  {
    id: "c152",
    short: "Complex minds from functional combinations",
    text: "Consciousness* is transferred from fundamental entities to complex combinations of them that meet further conditions: combinations that play the right functional role and represent various properties — yielding full-blooded consciousness.",
    plain: "Basic bits of consciousness* get passed up into complex systems that do the right jobs, making full experience.",
    entails: ["c150"]
  },
  {
    id: "c153",
    short: "Phenomenal properties have causal powers",
    text: "Phenomenal properties are not causally idle: they are essentially powerful — the categorical bases of causal powers — they are the very things that make matter behave as it does.",
    plain: "How things feel isn't a side-show — feelings are what make matter move.",
    entails: ["c25"]
  },
  {
    id: "c154",
    short: "Subjects don't combine",
    text: "Simple subjects do not fuse into a larger subject: complex experience is constituted relationally at the micro-level, without any new macrosubject ever forming.",
    plain: "Small minds don't merge into a big mind — your full experience is built from relations between them.",
    entails: []
  },
  {
    id: "c155",
    short: "Simples have bare perspective",
    text: "Fundamental simples possess a bare, intrinsic consciousness-as-such — a point of view with no rich content of its own — which is what makes them subjects at all.",
    plain: "The tiniest building blocks have a bare inner point of view, nothing richer.",
    entails: ["c25"]
  },
  {
    id: "c156",
    short: "Phenomenal qualities are relational",
    text: "The richness of experience — its phenomenal qualities — is relationally constituted: how a microsubject relates to other microsubjects determines what its experience is like.",
    plain: "How experience feels comes from relations between tiny minds, not from each one on its own.",
    entails: []
  },
  {
    id: "c157",
    short: "Deepest level is superconscious",
    text: "The fundamental level of reality hosts a 'superconscious' state — more coherent, more integrated, and more conscious than any mind inside spacetime.",
    plain: "At the deepest level of reality there is a consciousness greater than any brain's.",
    entails: []
  },
  {
    id: "c158",
    short: "Entangled megaobject is superconscious",
    text: "A timeless, non-spatiotemporal, holistically entangled 'megaobject' — underlying spacetime itself — exhibits maximal coherence, zero entropy, and the highest form of conscious resonance.",
    plain: "Beneath space and time sits one perfectly coherent entangled whole, and it is the most conscious thing there is.",
    entails: ["c157"]
  },
  {
    id: "c159",
    short: "Spacetime emerges from prototime",
    text: "Spacetime is not fundamental: it emerges from a deeper, aspatial, quasi-temporal dimension — 'prototime' — in which quantum entanglement keeps its coherence.",
    plain: "Space and time are not the bottom layer; they grow out of a deeper timeless entanglement.",
    entails: []
  },
  {
    id: "c160",
    short: "Quantum events have inner feeling",
    text: "Quantum states and events carry an internal phenomenal aspect: beneath the mathematics of quantum mechanics lies a proto-experiential character to physical events themselves.",
    plain: "Quantum events aren't just numbers — they have an inner, experience-like side.",
    entails: ["c25"]
  },
  {
    id: "c161",
    short: "Entanglement dissolves the combination problem",
    text: "Quantum indeterminacy and entanglement dissolve panpsychism's subject-summing combination problem: classical assumptions about how parts compose wholes simply don't apply at the quantum level.",
    plain: "Quantum entanglement makes the 'how do small minds add up?' problem disappear.",
    entails: []
  },
  {
    id: "c162",
    short: "Classical physics has no room",
    text: "Classical mechanistic determinism leaves no room for anything non-epiphenomenal: it has no intrinsic aspects and no novelty; quantum probabilistic determinism is needed for consciousness to matter.",
    plain: "Old-school clockwork physics leaves no room for experience to do anything — quantum physics does.",
    entails: []
  },
  {
    id: "c163",
    short: "Life is sentient from start",
    text: "Sentience emerged with life itself: even single-celled organisms are conscious in a primitive way — flexible cell walls, sensitivity to surroundings, and self-movement are the biological foundations of mind.",
    plain: "Consciousness didn't appear with brains — the first living cells already had a glimmer of it.",
    entails: ["c165"]
  },
  {
    id: "c164",
    short: "Minds can't be computed",
    text: "Mental states are intrinsically hardware-dependent: they cannot be captured by a computer program, so no artificial intelligence running the right algorithm could be conscious.",
    plain: "You can't program consciousness into being — minds need living biology, not software.",
    entails: []
  },
  {
    id: "c165",
    short: "All experience is consciousness",
    text: "All experience is mental: every organism that experiences anything has a mind — experience and consciousness are the same thing at every level of life.",
    plain: "If it experiences, it's conscious — full stop.",
    entails: []
  },
  {
    id: "c166",
    short: "Consciousness ends the quantum chain",
    text: "The quantum measurement chain — system, apparatus, sense organ, brain — terminates only in a conscious observer: no purely physical stopping point is privileged.",
    plain: "Trace the chain from particle to brain and it only ends when someone consciously sees a result.",
    entails: ["c168"]
  },
  {
    id: "c167",
    short: "Experience is never superposed",
    text: "Experience is always determinate, never superposed: you never experience a blur of two outcomes — and it is this phenomenal definiteness that the physics of measurement must account for.",
    plain: "You never experience 'both at once' — experience is always one definite thing.",
    entails: []
  },
  {
    id: "c168",
    short: "Consciousness acts on physics",
    text: "Consciousness is not merely affected by physics but acts on it: since the physical world manifestly acts on consciousness, a reciprocal influence must exist — and the quantum collapse is where it shows itself.",
    plain: "Mind doesn't just receive from physics — it pushes back, at the quantum collapse.",
    entails: []
  },
  {
    id: "c169",
    short: "Questions collapse the wave function",
    text: "Conscious acts of attending — 'asking questions' of nature — collapse the wave function: by posing yes-or-no questions, an observer selects which quantum possibility becomes actual.",
    plain: "Paying attention is asking nature a question — and the question collapses the quantum possibilities.",
    entails: ["c166"]
  },
  {
    id: "c170",
    short: "Physics doesn't pick the question",
    text: "Nothing in quantum mechanics determines which question gets asked: the choice of the experiment — what to measure, what to attend to — is a causal gap that physics cannot close.",
    plain: "Physics never says which question to ask — that choice comes from somewhere else.",
    entails: []
  },
  {
    id: "c171",
    short: "Classical physics makes mind idle",
    text: "Under classical physics the physical universe is a closed mechanism with nothing for consciousness to do — so consciousness would have to be an illusion or a passive, functionless spectator.",
    plain: "If the universe were classical clockwork, your mind would be a useless spectator.",
    entails: []
  },
  {
    id: "c172",
    short: "Superposition formation is experience",
    text: "Conscious experience arises whenever a quantum superposition forms — not at collapse, not in computation: the physical substrate of a conscious moment is the creation of a superposition.",
    plain: "A moment of experience is born when a quantum superposition forms — not when it collapses.",
    entails: []
  },
  {
    id: "c173",
    short: "Superposition structure fixes qualia",
    text: "The qualitative character of experience is fixed by the structure of the superposition: from the inside, phenomenology is classical and definite even though its substrate is quantum.",
    plain: "What an experience feels like is set by the shape of its quantum superposition.",
    entails: ["c172"]
  },
  {
    id: "c174",
    short: "Entanglement binds experience",
    text: "Entanglement is the only true binding agent in physics: it creates holistic states whose parts are fundamentally interconnected, and so it is what binds experience into one unity.",
    plain: "What holds your whole experience together is quantum entanglement.",
    entails: []
  },
  {
    id: "c175",
    short: "Classical computers can't be conscious",
    text: "A classical Turing machine may become intelligent but can never become conscious: sentience requires a quantum computer as its substrate.",
    plain: "Regular computers will never wake up — only quantum computers could.",
    entails: []
  },
  {
    id: "c176",
    short: "Collapse needs a consciousness measure",
    text: "A precise consciousness-collapse theory needs a quantitative measure of consciousness — such as integrated information — to specify exactly when and how fast collapse occurs.",
    plain: "To make collapse-by-consciousness exact, you need a meter for how conscious something is.",
    entails: []
  },
  {
    id: "c177",
    short: "Quantum collapse is consciousness's gap",
    text: "Wave-function collapse is a causal gap in physics that a non-physical consciousness could fill without violating known physics: consciousness collapses the wave function precisely where physics goes silent.",
    plain: "Collapse is the one place physics leaves open — and consciousness fills it.",
    entails: ["c166"]
  },
  {
    id: "c178",
    short: "Everything enfolds in implicate order",
    text: "Reality has an enfolded 'implicate order' underlying the unfolded 'explicate order' of ordinary experience: everything is in a process of folding and unfolding — a universal flux.",
    plain: "The everyday world is an unfolding of a deeper, enfolded order where everything is connected.",
    entails: []
  },
  {
    id: "c179",
    short: "Mind and matter share ground",
    text: "Mind and matter are not two independent things: both are projections of a common higher-dimensional ground that is neither mind nor body — and it is their shared ground, not causation, that relates them.",
    plain: "Mind and body are two projections of one deeper ground that is neither.",
    entails: ["c178"]
  },
  {
    id: "c180",
    short: "Reality is undivided wholeness",
    text: "Reality is an undivided, dynamic, alive wholeness in which observer and observed actively participate with each other — not a machine of independent parts.",
    plain: "Reality is one living whole, not a machine of separate pieces.",
    entails: []
  },
  {
    id: "c181",
    short: "Pure quantum states are conscious",
    text: "A quantum system in a pure state is conscious of its own state: quantum information describes the subjective inner reality of quantum systems — definite, private, and knowable only through qualia.",
    plain: "A quantum system in a pure state feels its own state from the inside.",
    entails: []
  },
  {
    id: "c182",
    short: "Seities are conscious agents",
    text: "Fundamental quantum-conscious agents — 'seities' or consciousness units — predate spacetime itself; physical laws, fields, and lived experience all emerge from their interactions.",
    plain: "Tiny conscious agents came before space and time — everything else grew from them.",
    entails: ["c181"]
  },
  {
    id: "c183",
    short: "Quantum mind can't be computed",
    text: "Consciousness, free will, and creativity are non-algorithmic properties of quantum reality: no machine can ever have them or create them by mechanical means.",
    plain: "Real creativity and free will aren't algorithms — no machine can ever have them.",
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
  { id:  1, name: "Analytic idealism", blurb: "Everything is the inner life of one universal mind.",               family: "Idealism",      claims: ["c3"] },
  { id:  3, name: "Conscious realism", blurb: "Reality is made of conscious agents interacting.",               family: "Idealism",      claims: ["c4", "c5"] },
  { id:  4, name: "Substance dualism", blurb: "Mind and body are two fundamentally different kinds of stuff.",               family: "Dualism",       claims: ["c7", "c8"] },
  { id:  5, name: "Naturalistic / property dualism", blurb: "Consciousness is a real non-physical property of brains.", family: "Dualism",       claims: ["c10", "c11"] },
  { id: 19, name: "Integrated Information Theory", blurb: "Consciousness is how integrated a system's cause-and-effect structure is.",   family: "Information",   claims: ["c12", "c14"] },
  { id:  6, name: "Interactionist dualism", blurb: "A non-physical mind genuinely moves the brain.",          family: "Dualism",       claims: ["c15", "c16"] },
  { id:  7, name: "Emergent dualism", blurb: "The soul emerges from the brain but isn't reducible to it.",                family: "Dualism",       claims: ["c17", "c18", "c8"] },
  { id:  8, name: "Spinozan dual-aspect monism", blurb: "Mind and body are two aspects of one single reality.",     family: "Neutral monism",claims: ["c20", "c21"] },
  { id:  9, name: "Jamesian neutral monism", blurb: "Mind and matter are both built from neutral raw experience.",         family: "Neutral monism",claims: ["c23"] },
  { id: 10, name: "Russellian monism", blurb: "Physics describes behavior; experience is what matter is inside.",               family: "Neutral monism",claims: ["c25"] },
  { id: 11, name: "Micropsychism", blurb: "Tiny particles have tiny bits of experience that combine into ours.",                   family: "Panpsychism",   claims: ["c27"] },
  { id: 12, name: "Cosmopsychism", blurb: "The whole universe is one conscious mind; we are its parts.",                   family: "Panpsychism",   claims: ["c28"] },
  { id: 13, name: "Panprotopsychism / panqualityism", blurb: "Matter has proto-experiential ingredients that combine into consciousness.",family: "Panpsychism",   claims: ["c31"] },
  { id: 14, name: "Mind–brain identity theory", blurb: "Conscious states just are brain states.",      family: "Materialism",   claims: ["c32"] },
  { id: 15, name: "Biological naturalism", blurb: "Consciousness is a biological feature of brains, like digestion.",           family: "Materialism",   claims: ["c33", "c34"] },
  { id:  2, name: "Advaita Vedānta nondualism", blurb: "Pure awareness alone is real; the separate self is an illusion.",      family: "Idealism",       claims: ["c36", "c37", "c38"] },
  { id: 16, name: "Non-reductive physicalism / strong emergence", blurb: "Consciousness emerges from matter and is something genuinely new.", family: "Materialism",    claims: ["c39", "c40"] },
  { id: 17, name: "Functionalism / computationalism", blurb: "The mind is what the brain does — its functions, not its stuff.", family: "Materialism",    claims: ["c42"] },
  { id: 18, name: "Global Workspace Theory", blurb: "Consciousness is information broadcast brain-wide for all systems to use.",         family: "Materialism",    claims: ["c43", "c44"] },
  { id: 20, name: "Higher-order thought theory", blurb: "A thought is conscious when the mind thinks about having it.",     family: "Materialism",    claims: ["c46"] },
  { id: 22, name: "Predictive processing", blurb: "The brain predicts incoming signals; consciousness is the winning prediction.",           family: "Materialism",    claims: ["c48", "c49"] },
  { id: 25, name: "Electromagnetic-field theory", blurb: "Consciousness is the brain's electromagnetic field.",    family: "Materialism",    claims: ["c50", "c51", "c52"] },
  { id: 27, name: "Illusionism", blurb: "Consciousness as we imagine it doesn't exist; it's a useful illusion.",                     family: "Materialism",    claims: ["c54"] },
  { id: 42, name: "Interactive (Cartesian) dualism", blurb: "An immaterial soul interacts with the body, physics permitting.",   family: "Dualism",         claims: ["c55"] },
  { id: 43, name: "Hylomorphism", blurb: "The soul is the living form of the body, not a separate thing.",                      family: "Dualism",         claims: ["c56", "c57"] },
  { id: 44, name: "Avicenna's self-present soul", blurb: "The self knows itself directly, needs no senses, and survives death.",      family: "Dualism",         claims: ["c36", "c7", "c58"] },
  { id: 45, name: "Malebranche's occasionalism", blurb: "Only God truly causes anything; mind and body never touch.",       family: "Dualism",         claims: ["c6", "c60"] },
  { id: 46, name: "Bergson's duration dualism", blurb: "The brain filters consciousness; real time is lived duration.",        family: "Dualism",         claims: ["c61", "c62"] },
  { id: 47, name: "Sāṃkhya witness dualism", blurb: "Consciousness is a pure silent witness; the mind itself is material.",           family: "Dualism",         claims: ["c102", "c64", "c65"] },
  { id: 51, name: "Trialism", blurb: "Reality has three basic domains, not one or two.",                          family: "Dualism",         claims: ["c66"] },
  { id: 52, name: "Epiphenomenalism", blurb: "The brain causes consciousness, but consciousness causes nothing.",                  family: "Materialism",     claims: ["c33", "c67", "c68"] },
  { id: 53, name: "Whitehead's process theory", blurb: "Reality is made of events with inner experience, not static stuff.",        family: "Neutral monism",  claims: ["c69", "c70", "c71"] },
  { id: 54, name: "Leibniz's monads", blurb: "Everything is made of tiny perceiving units in pre-set harmony.",                  family: "Neutral monism",  claims: ["c45", "c73", "c103", "c104", "c105", "c106"], caveat: "Filed under Neutral monism by structural analogy, not strict fit — Leibniz is a monist, but \u201cneutral monism\u201d is a modern label. The \u201chigher thought\u201d claim reflects the scholarly reading of Leibniz's \u201capperception\u201d; he never phrased it as higher-order thought." },
  { id: 41, name: "Aurobindo's evolving consciousness", blurb: "Consciousness is the fundamental reality, evolving from matter toward the divine.", family: "Idealism",       claims: ["c76", "c75"] },
  { id: 48, name: "Nyāya contingent-consciousness self", blurb: "The self is an enduring nonphysical thing that only sometimes happens to be conscious.", family: "Dualism",        claims: ["c77", "c78", "c79", "c7"] },
  { id: 49, name: "Libet's conscious mental field", blurb: "Experience is a nonphysical field the brain generates — which pushes back on the brain.", family: "Dualism",        claims: ["c80", "c82"] },
  { id: 50, name: "Beck–Eccles quantum synapse interactionism", blurb: "Conscious intentions steer the brain by tipping quantum events in synapses.", family: "Dualism",        claims: ["c83", "c84"] },
  { id: 55, name: "Velmans's reflexive monism", blurb: "Mind and world are two aspects of one reality — and your experience is out there in the world, not in your head.", family: "Neutral monism", claims: ["c85", "c86"] },
  { id: 56, name: "Pauli–Jung psychophysical complementarity", blurb: "Mind and matter are complementary faces of one unknowable neutral reality.", family: "Neutral monism", claims: ["c87", "c88", "c89"] },
  { id: 57, name: "Teilhard de Chardin's evolving consciousness", blurb: "Matter and mind are two aspects of one cosmic stuff, evolving toward ultimate unity.", family: "Neutral monism", claims: ["c19", "c91", "c92"] },
  { id: 58, name: "Davidson's anomalous monism", blurb: "Each thought is a brain event — but no laws will ever map the mental onto the physical.", family: "Materialism",    claims: ["c93", "c94", "c95"] },
  { id: 59, name: "Pereira's triple-aspect monism", blurb: "Brain, information, and experience are three inseparable aspects of one thing.", family: "Materialism",    claims: ["c97", "c98"] },
  { id: 60, name: "Chalmers's double-aspect theory of information", blurb: "Information is fundamental, with a physical face and a felt face.", family: "Neutral monism", claims: ["c101", "c34"] },
  { id: 21, name: "First-order representationalism", blurb: "Experience just is world-directed representation — no inner watcher needed.", family: "Materialism", claims: ["c108"] },
  { id: 23, name: "Affective / homeostatic consciousness", blurb: "Consciousness begins in feeling, in the ancient brainstem, to regulate life.", family: "Materialism", claims: ["c110","c111"] },
  { id: 24, name: "Enactivism / embodied cognition", blurb: "Perception is a bodily skill; no body and world, no consciousness.", family: "Materialism", claims: ["c113"] },
  { id: 26, name: "Orchestrated Objective Reduction — Orch OR", blurb: "Quantum collapses in microtubules, orchestrated by the brain, are experience.", family: "Quantum", claims: ["c116"] },
  { id: 28, name: "Attention Schema Theory", blurb: "Awareness is the brain's simplified model of its own attention.", family: "Materialism", claims: ["c118"] },
  { id: 29, name: "Kashmir Shaivism's dynamic non-dualism", blurb: "One dynamic consciousness vibrates into the world; the world is real, and you are it.", family: "Idealism", claims: ["c120","c121"] },
  { id: 30, name: "Berkeley's immaterialist idealism", blurb: "Only minds and their ideas exist; things exist because they are perceived.", family: "Idealism", claims: ["c123"] },
  { id: 31, name: "Absolute idealism", blurb: "One Absolute Experience is all there is; subject and object are abstractions from it.", family: "Idealism", claims: ["c125"] },
  { id: 32, name: "Kant's transcendental idealism", blurb: "We know only things-as-experienced; the mind structures all possible experience.", family: "Idealism", claims: ["c127"], caveat: "Kant does not affirm “everything is mind” (c1) — only that the mind structures what experience can be; the claims stop deliberately short of that." },
  { id: 33, name: "Schelling's nature–spirit identity", blurb: "Nature and mind are two poles of one Absolute; consciousness is nature waking up.", family: "Idealism", claims: ["c129"] },
  { id: 34, name: "Schopenhauer's world as Will", blurb: "The world is representation shaped by the mind; its inner essence is a blind, non-conscious Will.", family: "Idealism", claims: ["c132","c133","c130"], caveat: "Filed under Idealism by structural analogy: Schopenhauer's ultimate reality — the Will — is explicitly non-conscious. He demotes consciousness rather than making it fundamental, so he is not an idealist in the consciousness-first sense." },
  { id: 35, name: "Yogācāra mind-only", blurb: "Experience is cognition-only, held together by a deep store consciousness; no external objects needed.", family: "Idealism", claims: ["c134","c135"], caveat: "Whether Yogācāra is ontological idealism or an epistemology that brackets ontology is the central interpretive dispute in modern scholarship; the 'everything is mind' inheritance reflects the stronger ontological reading." },
  { id: 36, name: "Nāgārjuna's emptiness", blurb: "Experience is real but empty — nothing, not even awareness, has an intrinsic nature.", family: "Idealism", claims: ["c138"], caveat: "Filed under Idealism by structural analogy only: Nāgārjuna explicitly refuses both idealism and eliminativism about consciousness — experience is conventionally real and ultimately empty." },
  { id: 37, name: "McGilchrist's relational creative-process idealism", blurb: "Consciousness is a primordial creative process; matter is one of its phases.", family: "Idealism", claims: ["c139","c140","c141"] },
  { id: 38, name: "T. Campbell's Big TOE", blurb: "Reality is a virtual world computed by a Larger Consciousness System; we play to evolve.", family: "Idealism", claims: ["c142","c143"], caveat: "Campbell rejects the 'idealism' label — he presents this as a virtual-reality model rather than idealism; filed here by structural analogy." },
  { id: 39, name: "Goswami's self-aware universe", blurb: "Consciousness, not matter, is the primary stuff; it collapses the quantum wave into the world.", family: "Idealism", claims: ["c144","c145"] },
  { id: 40, name: "Builes's modal idealism", blurb: "It is metaphysically necessary that everything fundamental is conscious — possible worlds are divine thoughts.", family: "Idealism", claims: ["c147"], caveat: "The 'ideal observer' sustaining possible worlds is presented in the CTT entry as divine; Builes's argument requires an ideal observer, which may be divine or a structurally similar observer." },
  { id: 61, name: "A. Harris's fundamental-field panpsychism", blurb: "Consciousness is a fundamental field, like spacetime; subjects need the right arrangement.", family: "Panpsychism", claims: ["c149"], caveat: "Harris herself remains split between brain-based and panpsychic explanations and is not convinced panpsychism is correct — she presents it as a valid category of possible solutions." },
  { id: 62, name: "Tye's irreducible consciousness*", blurb: "Phenomenal consciousness is on/off and irreducible; fundamental 'consciousness*' scales up into complex minds.", family: "Panpsychism", claims: ["c151","c152"] },
  { id: 63, name: "Mørch's phenomenal-powers panpsychism", blurb: "Phenomenal properties aren't idle — they are the causal powers that make matter behave.", family: "Panpsychism", claims: ["c153"] },
  { id: 64, name: "Kadić's monadic panpsychism", blurb: "Micro-subjects don't combine — complex experience is relationally constituted between them.", family: "Panpsychism", claims: ["c154","c155","c156"] },
  { id: 65, name: "Schneider–Bailey entangled superpsychism", blurb: "The deepest level hosts a superconscious entangled megaobject; spacetime emerges from prototime.", family: "Panpsychism", claims: ["c158","c159"] },
  { id: 66, name: "Gambini–Pullin quantum panprotopsychism", blurb: "Quantum events have inner phenomenal aspects; entanglement dissolves the combination problem.", family: "Panpsychism", claims: ["c160","c161","c162"] },
  { id: 67, name: "Reber's cellular basis of consciousness", blurb: "Sentience began with life: every living cell has a primitive mind; minds can't be computed.", family: "Panpsychism", claims: ["c163","c164"] },
  { id: 68, name: "Wigner–von Neumann consciousness-collapse", blurb: "The quantum measurement chain terminates in conscious experience; mind acts on physics.", family: "Quantum", claims: ["c166","c167"], caveat: "Wigner later abandoned this hypothesis after decoherence removed its motivation, and recent scholarship argues the 'consciousness causes collapse' reading of von Neumann is overstated — he formalized the measurement chain but ascribed no causal power to the observer's 'abstract ego.'" },
  { id: 69, name: "Stapp's quantum collapse via questions", blurb: "Conscious attention — asking yes-or-no questions of nature — collapses the wave function.", family: "Quantum", claims: ["c169","c170","c171"] },
  { id: 70, name: "Neven's superposition formation", blurb: "A conscious moment is born when a quantum superposition forms — not at collapse.", family: "Quantum", claims: ["c173","c174","c175"] },
  { id: 71, name: "Chalmers–McQueen quantum collapse", blurb: "Consciousness fills the causal gap at wave-function collapse; a precise measure is needed.", family: "Quantum", claims: ["c176","c177"] },
  { id: 72, name: "Bohm's implicate order", blurb: "Everything enfolds in an implicate order; mind and matter are projections of one ground.", family: "Quantum", claims: ["c179","c180"] },
  { id: 73, name: "Faggin's quantum-information panpsychism", blurb: "Pure quantum states are conscious; seities — conscious agents — predate spacetime.", family: "Quantum", claims: ["c182","c183"] },
]);
