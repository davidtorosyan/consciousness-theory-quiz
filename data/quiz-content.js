/*
  Reviewable source of truth for every current quiz question.
  Each entry owns its decision split and every reader-facing content layer.
  Edit this file, update QUIZ_CONTENT_CHANGE_REPORT, then run the artifact build/audit.
*/
window.QUIZ_CONTENT_VERSION = '6';

window.QUIZ_CONTENT = Object.freeze([
  {
    id: "physical",
    scope: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120],
    yesTheoryIds: [14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,120],
    title: "Could consciousness be fully explained by ordinary matter and physics?",
    subtitle: "This first choice asks whether explaining every physical event would also explain every part of experience.",
    answers: {
      first: { label: "Yes — matter and physics are enough", hint: "Nothing beyond the physical world is needed." },
      second: { label: "No — something more is needed", hint: "A full explanation needs more than matter and physics." }
    },
    putSimply: "Which is closer to your view: “matter is enough” or “the question needs reframing”?",
    whyItMatters: "This is the single biggest fork in the quiz: it asks whether consciousness is entirely a physical phenomenon, with nothing nonphysical added. In other words: if physics gave a complete description of every particle and field, would there be anything left unexplained about experience?",
    examples: {
      firstRouteTheoryIds: [14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,120],
      secondRouteTheoryIds: [1,2,3,4,5,6,7,8,9,10,11,12,13,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,118,119]
    },
    definitions: []
  },
  {
    id: "phenomenology",
    scope: [1,2,3,4,5,6,7,8,9,10,11,12,13,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,118,119],
    yesTheoryIds: [118,119],
    title: "Should we first describe experience as it feels, before explaining what causes it?",
    subtitle: "This asks whether to start with experience as it feels, or with an explanation of what causes it.",
    answers: {
      first: { label: "Yes — begin with experience itself", hint: "First describe what experience is like." },
      second: { label: "No — begin with its causes", hint: "First explain what produces experience." }
    },
    putSimply: "Which is closer to your view: “describe experience first” or “make a metaphysical claim”?",
    whyItMatters: "This route pauses the debate about what reality is made of. It asks whether a careful description of experience—how a world, a self, and meaning show up—should come before any theory about causes or substances. Put simply: should we first describe experience from the inside, or first explain it from the outside?",
    examples: {
      firstRouteTheoryIds: [118,119],
      secondRouteTheoryIds: [1,2,3,4,5,6,7,8,9,10,11,12,13,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67]
    },
    definitions: []
  },
  {
    id: "phen-body",
    scope: [118,119],
    yesTheoryIds: [119],
    title: "Is consciousness rooted in how a living body experiences the world?",
    subtitle: "This asks whether the living body is essential, or whether we should begin with the way anything appears to us.",
    answers: {
      first: { label: "Yes — the living body comes first", hint: "Experience grows from bodily life in a world." },
      second: { label: "No — start with how things appear", hint: "Begin with the basic shape of experience itself." }
    },
    putSimply: "Which is closer to your view: “the lived body” or “transcendental description”?",
    whyItMatters: "This is for people who feel the first question is badly framed — it starts from lived experience instead of physics-versus-nonphysics. In other words: should we begin from what experience is like from the inside, rather than from matter or mind?",
    examples: {
      firstRouteTheoryIds: [119],
      secondRouteTheoryIds: [118]
    },
    definitions: ["transcendental: the conditions that make experience possible"]
  },
  {
    id: "ideal",
    scope: [1,2,3,4,5,6,7,8,9,10,11,12,13,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67],
    yesTheoryIds: [1,2,3,29,30,31,32,33,34,35,36,37,38,39,40,41],
    title: "Is consciousness the basic stuff of reality?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “consciousness is basic” or “reality contains more”?",
    whyItMatters: "This asks whether consciousness is the ultimate foundation of everything that exists. In other words: is the universe made of mind at bottom, with the physical world as its appearance?",
    examples: {
      firstRouteTheoryIds: [1,2,3,29,30,31,32,33,34,35,36,37,38,39,40,41],
      secondRouteTheoryIds: [4,5,6,7,8,9,10,11,12,13,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67]
    },
    definitions: []
  },
  {
    id: "ideal-one",
    scope: [1,2,3,29,30,31,32,33,34,35,36,37,38,39,40,41],
    yesTheoryIds: [1,2,29,31,33,34,38,39,41],
    title: "Is there only one consciousness behind every individual mind?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “one universal consciousness” or “not one universal subject”?",
    whyItMatters: "This asks whether there is only one cosmic consciousness, with individual minds as fragments or illusions of separateness. In other words: are you and I, deep down, the very same single awareness?",
    examples: {
      firstRouteTheoryIds: [1,2,29,31,33,34,38,39,41],
      secondRouteTheoryIds: [3,30,32,35,36,37,40]
    },
    definitions: []
  },
  {
    id: "ideal-unreal",
    scope: [1,2,29,31,33,34,38,39,41],
    yesTheoryIds: [2,31,38,39],
    title: "Is the physical world only an appearance, illusion, or simulation?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “appearance or simulation” or “real expression”?",
    whyItMatters: "This asks what the one universal consciousness implies about the physical world. In other words: is matter completely unreal — a mere appearance, dream, or simulation?",
    examples: {
      firstRouteTheoryIds: [2,31,38,39],
      secondRouteTheoryIds: [1,29,33,34,41]
    },
    definitions: []
  },
  {
    id: "ideal-vr",
    scope: [2,31,38,39],
    yesTheoryIds: [38],
    title: "Is the physical world a virtual reality generated by a larger mind?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “a rendered virtual reality” or “not a computed simulation”?",
    whyItMatters: "This is the digital, evolutionary idealism of Big TOE.",
    examples: {
      firstRouteTheoryIds: [38],
      secondRouteTheoryIds: [2,31,39]
    },
    definitions: ["nondual: not divided into two separate kinds of reality"]
  },
  {
    id: "ideal-create",
    scope: [2,31,39],
    yesTheoryIds: [39],
    title: "Does a conscious observer help bring the physical world into existence?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “observation creates matter” or “no quantum creation claim”?",
    whyItMatters: "Goswami makes the observer’s role in quantum theory explicitly metaphysical.",
    examples: {
      firstRouteTheoryIds: [39],
      secondRouteTheoryIds: [2,31]
    },
    definitions: []
  },
  {
    id: "ideal-feeling",
    scope: [2,31],
    yesTheoryIds: [31],
    title: "Is the deepest reality a kind of feeling before it divides into observer and observed?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “primordial feeling” or “self-luminous Brahman”?",
    whyItMatters: "Absolute idealism begins before the subject–object split; Advaita begins with self-luminous Brahman.",
    examples: {
      firstRouteTheoryIds: [31],
      secondRouteTheoryIds: [2]
    },
    definitions: []
  },
  {
    id: "ideal-evolve",
    scope: [1,29,33,34,41],
    yesTheoryIds: [41],
    title: "Is the universe moving toward ever-higher forms of consciousness?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “consciousness evolves” or “no directed cosmic ascent”?",
    whyItMatters: "Aurobindo joins nondualism to a teleological evolutionary story.",
    examples: {
      firstRouteTheoryIds: [41],
      secondRouteTheoryIds: [1,29,33,34]
    },
    definitions: ["nondual: not divided into two separate kinds of reality"]
  },
  {
    id: "ideal-will",
    scope: [1,29,33,34],
    yesTheoryIds: [34],
    title: "Is the force underneath reality a blind drive or urge?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “world as Will” or “not blind Will”?",
    whyItMatters: "Schopenhauer makes consciousness a late product of Will rather than the foundation itself.",
    examples: {
      firstRouteTheoryIds: [34],
      secondRouteTheoryIds: [1,29,33]
    },
    definitions: []
  },
  {
    id: "ideal-spanda",
    scope: [1,29,33],
    yesTheoryIds: [29],
    title: "Does one living consciousness become the many forms we see?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “dynamic spanda” or “another relation of nature and mind”?",
    whyItMatters: "Kashmir Shaivism treats manifestation as a real contraction of consciousness, not an illusion.",
    examples: {
      firstRouteTheoryIds: [29],
      secondRouteTheoryIds: [1,33]
    },
    definitions: []
  },
  {
    id: "ideal-schelling",
    scope: [1,33],
    yesTheoryIds: [33],
    title: "Are nature and mind two sides of one reality that is waking up to itself?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “nature as visible spirit” or “dissociated cosmic mind”?",
    whyItMatters: "Schelling treats nature and mind as poles of one Absolute; analytic idealism uses dissociation within cosmic mind.",
    examples: {
      firstRouteTheoryIds: [33],
      secondRouteTheoryIds: [1]
    },
    definitions: []
  },
  {
    id: "ideal-empty",
    scope: [3,30,32,35,36,37,40],
    yesTheoryIds: [36],
    title: "Does even consciousness lack a fixed, independent essence?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “everything is empty” or “retain a positive account”?",
    whyItMatters: "This asks whether even consciousness itself lacks any fixed, independent essence. In other words: is there no ultimate foundation at all — is everything, including awareness, empty of intrinsic nature?",
    examples: {
      firstRouteTheoryIds: [36],
      secondRouteTheoryIds: [3,30,32,35,37,40]
    },
    definitions: []
  },
  {
    id: "ideal-berkeley",
    scope: [3,30,32,35,37,40],
    yesTheoryIds: [30],
    title: "Does reality consist only of minds and the ideas they experience, sustained by God?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “minds and ideas only” or “not Berkeleyan theism”?",
    whyItMatters: "Berkeley denies matter outright while retaining many minds and one infinite spirit.",
    examples: {
      firstRouteTheoryIds: [30],
      secondRouteTheoryIds: [3,32,35,37,40]
    },
    definitions: []
  },
  {
    id: "ideal-agents",
    scope: [3,32,35,37,40],
    yesTheoryIds: [3],
    title: "Is reality a network of conscious agents, while space and time are just our display?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “conscious agents” or “no agent-network ontology”?",
    whyItMatters: "Conscious realism treats perception as fitness-guided interface rather than truth-tracking window.",
    examples: {
      firstRouteTheoryIds: [3],
      secondRouteTheoryIds: [32,35,37,40]
    },
    definitions: ["modal: about what is possible or necessary","ontology: a view about what truly exists"]
  },
  {
    id: "ideal-kant",
    scope: [32,35,37,40],
    yesTheoryIds: [32],
    title: "Does the mind supply the basic structure that makes experience possible?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “mind structures experience” or “not a priori constitution”?",
    whyItMatters: "Transcendental idealism distinguishes phenomena from unknowable things-in-themselves.",
    examples: {
      firstRouteTheoryIds: [32],
      secondRouteTheoryIds: [35,37,40]
    },
    definitions: ["transcendental: the conditions that make experience possible","a priori: known or structured before particular experience","modal: about what is possible or necessary"]
  },
  {
    id: "ideal-yoga",
    scope: [35,37,40],
    yesTheoryIds: [35],
    title: "Is the mind a changing stream with no permanent self?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “conditioned mind-only” or “a different plural idealism”?",
    whyItMatters: "Yogācāra explains coherence through store consciousness without external objects or an eternal subject.",
    examples: {
      firstRouteTheoryIds: [35],
      secondRouteTheoryIds: [37,40]
    },
    definitions: ["modal: about what is possible or necessary"]
  },
  {
    id: "ideal-modal",
    scope: [37,40],
    yesTheoryIds: [40],
    title: "Must consciousness be the basis of reality in every possible universe?",
    subtitle: "These views all put consciousness first. This choice separates different ways they explain the world and individual minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “necessary idealism” or “relational creative process”?",
    whyItMatters: "Builes gives the stark modal claim; McGilchrist emphasizes relational creative process.",
    examples: {
      firstRouteTheoryIds: [40],
      secondRouteTheoryIds: [37]
    },
    definitions: ["modal: about what is possible or necessary"]
  },
  {
    id: "dual",
    scope: [4,5,6,7,8,9,10,11,12,13,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67],
    yesTheoryIds: [4,5,6,7,42,43,44,45,46,47,48,49,50,51,52],
    title: "Are mind and matter fundamentally different kinds of thing?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — they are two different kinds", hint: "Mind cannot be reduced to matter." },
      second: { label: "No — they share one deeper basis", hint: "The difference comes from two views of one reality." }
    },
    putSimply: "Which is closer to your view: “Two different kinds” or “One common basis”?",
    whyItMatters: "This asks whether mind and matter are two fundamentally different kinds of stuff, or two faces of one underlying reality. In other words: is the universe built from two separate ingredients, or one ingredient showing up two ways?",
    examples: {
      firstRouteTheoryIds: [4,5,6,7,42,43,44,45,46,47,48,49,50,51,52],
      secondRouteTheoryIds: [8,9,10,11,12,13,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67]
    },
    definitions: []
  },
  {
    id: "dual-dep",
    scope: [4,5,6,7,42,43,44,45,46,47,48,49,50,51,52],
    yesTheoryIds: [5,7,49,50,52],
    title: "Could consciousness continue without a working brain?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "No — it needs a working brain", hint: "Consciousness cannot continue when the brain no longer works." },
      second: { label: "Yes — it could continue", hint: "Mind or soul could exist without a working brain." }
    },
    putSimply: "Which is closer to your view: “brain-dependent” or “independent in principle”?",
    whyItMatters: "This asks whether consciousness can exist without a brain. In other words: if your brain were destroyed, could your mind carry on?",
    examples: {
      firstRouteTheoryIds: [5,7,49,50,52],
      secondRouteTheoryIds: [4,6,42,43,44,45,46,47,48,51]
    },
    definitions: []
  },
  {
    id: "dual-epi",
    scope: [5,7,49,50,52],
    yesTheoryIds: [52],
    title: "Is consciousness a powerless side effect that causes nothing?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “causally idle” or “consciousness does causal or constitutive work”?",
    whyItMatters: "This asks whether consciousness actually does anything, or is just a powerless side effect. In other words: does your experience cause your actions, or is it a helpless passenger along for the ride?",
    examples: {
      firstRouteTheoryIds: [52],
      secondRouteTheoryIds: [5,7,49,50]
    },
    definitions: []
  },
  {
    id: "dual-synapse",
    scope: [5,7,49,50],
    yesTheoryIds: [50],
    title: "Could a nonphysical mind influence tiny quantum events where brain cells communicate?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “quantum synapses” or “not that mechanism”?",
    whyItMatters: "Beck–Eccles proposes psychons acting on dendrons by altering vesicle-release probabilities.",
    examples: {
      firstRouteTheoryIds: [50],
      secondRouteTheoryIds: [5,7,49]
    },
    definitions: []
  },
  {
    id: "dual-field",
    scope: [5,7,49],
    yesTheoryIds: [49],
    title: "Is consciousness a nonphysical field produced by the brain?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “a conscious mental field” or “not a mental field”?",
    whyItMatters: "Libet’s proposal is field-like, brain-generated, and potentially causally efficacious.",
    examples: {
      firstRouteTheoryIds: [49],
      secondRouteTheoryIds: [5,7]
    },
    definitions: []
  },
  {
    id: "dual-newself",
    scope: [5,7],
    yesTheoryIds: [7],
    title: "Does an organized brain create a genuinely new, nonphysical self?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “a new subject” or “irreducible properties”?",
    whyItMatters: "Emergent dualism posits a brain-born nonphysical self; property dualism posits irreducible conscious properties.",
    examples: {
      firstRouteTheoryIds: [7],
      secondRouteTheoryIds: [5]
    },
    definitions: ["psychophysical: concerning links between mental and physical events"]
  },
  {
    id: "dual-three",
    scope: [4,6,42,43,44,45,46,47,48,51],
    yesTheoryIds: [51],
    title: "Does reality have three basic kinds of thing rather than two?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “Three” or “Two”?",
    whyItMatters: "Most dualists say reality has two fundamental ingredients: mind and matter. A few traditions add a third — Sāṃkhya counts consciousness, nature, and the person witnessing both; Popper's Three Worlds adds abstract knowledge-objects alongside mind and matter. In other words: is reality a duet of mind and matter, or does it need a third voice?",
    examples: {
      firstRouteTheoryIds: [51],
      secondRouteTheoryIds: [4,6,42,43,44,45,46,47,48]
    },
    definitions: []
  },
  {
    id: "dual-form",
    scope: [4,6,42,43,44,45,46,47,48],
    yesTheoryIds: [43],
    title: "Is the soul the organizing form of a living body, rather than a separate object?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “form of the body” or “a separable or differently defined mind”?",
    whyItMatters: "Hylomorphism treats awareness as a capacity of the whole organism.",
    examples: {
      firstRouteTheoryIds: [43],
      secondRouteTheoryIds: [4,6,42,44,45,46,47,48]
    },
    definitions: ["hylomorphism: the soul is the organizing form of a living body"]
  },
  {
    id: "dual-god",
    scope: [4,6,42,44,45,46,47,48],
    yesTheoryIds: [45],
    title: "Does God cause every apparent interaction between mind and body?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “divine mediation” or “no divine intermediary”?",
    whyItMatters: "Malebranche’s occasionalism denies direct creaturely causation.",
    examples: {
      firstRouteTheoryIds: [45],
      secondRouteTheoryIds: [4,6,42,44,46,47,48]
    },
    definitions: ["occasionalism: God causes events that only seem to interact directly"]
  },
  {
    id: "dual-avicenna",
    scope: [4,6,42,44,46,47,48],
    yesTheoryIds: [44],
    title: "Would awareness of your own existence remain even with no senses or body?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “self-presence is primitive” or “use another dividing line”?",
    whyItMatters: "Avicenna’s Flying Man would know itself without body, senses, or inference.",
    examples: {
      firstRouteTheoryIds: [44],
      secondRouteTheoryIds: [4,6,42,46,47,48]
    },
    definitions: []
  },
  {
    id: "dual-samkhya",
    scope: [4,6,42,46,47,48],
    yesTheoryIds: [47],
    title: "Is consciousness a silent witness, while thoughts and feelings belong to matter?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “pure witness” or “mind remains on the conscious side”?",
    whyItMatters: "Sāṃkhya draws its dualism between puruṣa and prakṛti, not mind and body.",
    examples: {
      firstRouteTheoryIds: [47],
      secondRouteTheoryIds: [4,6,42,46,48]
    },
    definitions: ["puruṣa: pure witnessing consciousness in Sāṃkhya","prakṛti: nature, including mind and emotion, in Sāṃkhya"]
  },
  {
    id: "dual-nyaya",
    scope: [4,6,42,46,48],
    yesTheoryIds: [48],
    title: "Can the self keep existing during periods with no awareness?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “awareness comes and goes” or “consciousness is not merely contingent”?",
    whyItMatters: "Nyāya explains dreamless sleep by letting the self persist while consciousness lapses.",
    examples: {
      firstRouteTheoryIds: [48],
      secondRouteTheoryIds: [4,6,42,46]
    },
    definitions: []
  },
  {
    id: "dual-cartesian",
    scope: [4,6,42,46],
    yesTheoryIds: [4,42],
    title: "Are mind and matter two separate substances that can interact?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “Cartesian substances” or “a different dualism”?",
    whyItMatters: "This separates classical and modern Cartesian defenses from Popper–Eccles interactionism and Bergsonian duration.",
    examples: {
      firstRouteTheoryIds: [4,42],
      secondRouteTheoryIds: [6,46]
    },
    definitions: []
  },
  {
    id: "dual-classic",
    scope: [4,42],
    yesTheoryIds: [4],
    title: "Can the soul exist independently of the body and perhaps survive it?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “separable soul” or “defend direct interaction”?",
    whyItMatters: "The general substance-dualist outcome stresses separability; the modern Cartesian defense stresses interaction and conservation objections.",
    examples: {
      firstRouteTheoryIds: [4],
      secondRouteTheoryIds: [42]
    },
    definitions: []
  },
  {
    id: "dual-popper",
    scope: [6,46],
    yesTheoryIds: [6],
    title: "Does a nonphysical mind select and organize activity in the brain?",
    subtitle: "These views treat mind and matter as different in some basic way. This choice asks how they depend on or affect each other.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “mind acts on brain” or “duration and memory”?",
    whyItMatters: "Popper and Eccles stress mind selecting and unifying neural activity; Bergson contrasts lived duration with space.",
    examples: {
      firstRouteTheoryIds: [6],
      secondRouteTheoryIds: [46]
    },
    definitions: []
  },
  {
    id: "pan",
    scope: [8,9,10,11,12,13,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67],
    yesTheoryIds: [11,12,13,61,62,63,64,65,66,67],
    title: "Does every basic part of nature contain experience, or at least the seed of it?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “experience is basic” or “begin from a neutral basis”?",
    whyItMatters: "This asks whether experience — or at least its raw ingredients — goes all the way down to the smallest bits of matter. In other words: do electrons and atoms already have a spark of something mind-like?",
    examples: {
      firstRouteTheoryIds: [11,12,13,61,62,63,64,65,66,67],
      secondRouteTheoryIds: [8,9,10,53,54,55,56,57,58,59,60]
    },
    definitions: []
  },
  {
    id: "pan-cell",
    scope: [11,12,13,61,62,63,64,65,66,67],
    yesTheoryIds: [67],
    title: "Does consciousness begin with the first living cells?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “all living cells” or “more fundamental than life”?",
    whyItMatters: "Full panpsychism says mind goes all the way down to particles — but that creates the \"combination problem\": how do trillions of tiny minds fuse into your one unified experience? Biopsychism dodges the problem by granting experience only to living cells, not to rocks and electrons. In other words: was consciousness already there before life, or did life invent it?",
    examples: {
      firstRouteTheoryIds: [67],
      secondRouteTheoryIds: [11,12,13,61,62,63,64,65,66]
    },
    definitions: ["panpsychism: experience is present throughout nature"]
  },
  {
    id: "pan-whole",
    scope: [11,12,13,61,62,63,64,65,66],
    yesTheoryIds: [12,61,65],
    title: "Is the universe as a whole conscious before its parts are?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “whole before parts” or “start from smaller ingredients”?",
    whyItMatters: "These top-down views contrast with micro-subject or proto-quality accounts.",
    examples: {
      firstRouteTheoryIds: [12,61,65],
      secondRouteTheoryIds: [11,13,62,63,64,66]
    },
    definitions: []
  },
  {
    id: "pan-super",
    scope: [12,61,65],
    yesTheoryIds: [65],
    title: "Are the basic building blocks of reality more conscious than the things they form?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “super-conscious fundamentals” or “a cosmic subject or field”?",
    whyItMatters: "Superpsychism inverts the usual micro-to-macro direction and invokes entanglement.",
    examples: {
      firstRouteTheoryIds: [65],
      secondRouteTheoryIds: [12,61]
    },
    definitions: []
  },
  {
    id: "pan-field",
    scope: [12,61],
    yesTheoryIds: [61],
    title: "Is consciousness a basic field spread throughout the universe?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “pervasive field” or “cosmic subject”?",
    whyItMatters: "Harris uses a field metaphor; cosmopsychism starts from the universe as a subject.",
    examples: {
      firstRouteTheoryIds: [61],
      secondRouteTheoryIds: [12]
    },
    definitions: ["cosmopsychism: the universe as a whole is conscious"]
  },
  {
    id: "pan-actual",
    scope: [11,13,62,63,64,66],
    yesTheoryIds: [11,62,63,64],
    title: "Are the smallest building blocks of reality conscious subjects?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “actual micro-subjects” or “proto-conscious ingredients”?",
    whyItMatters: "This separates micropsychism from proto-conscious ingredients that are not yet subjects.",
    examples: {
      firstRouteTheoryIds: [11,62,63,64],
      secondRouteTheoryIds: [13,66]
    },
    definitions: ["proto-conscious: containing the ingredients for experience, but not yet experiencing","micropsychism: the smallest things have their own tiny experiences"]
  },
  {
    id: "pan-allornone",
    scope: [11,62,63,64],
    yesTheoryIds: [62],
    title: "Is something either conscious or not conscious, with no gray area?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “all or nothing” or “allow graded or structurally combined micro-experience”?",
    whyItMatters: "Tye’s consciousness* is technically stipulated as irreducible and on/off.",
    examples: {
      firstRouteTheoryIds: [62],
      secondRouteTheoryIds: [11,63,64]
    },
    definitions: ["micropsychism: the smallest things have their own tiny experiences"]
  },
  {
    id: "pan-causal",
    scope: [11,63,64],
    yesTheoryIds: [63],
    title: "Can basic feelings themselves cause physical effects?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “phenomenal powers” or “another combination story”?",
    whyItMatters: "Mørch’s view directly rejects epiphenomenal panpsychism.",
    examples: {
      firstRouteTheoryIds: [63],
      secondRouteTheoryIds: [11,64]
    },
    definitions: ["epiphenomenal: real but unable to cause anything","panpsychism: experience is present throughout nature","micropsychism: the smallest things have their own tiny experiences"]
  },
  {
    id: "pan-rel",
    scope: [11,64],
    yesTheoryIds: [64],
    title: "Can tiny pieces of experience combine through their relationships without merging into one mind?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “relational structure” or “generic micropsychism”?",
    whyItMatters: "Kadić makes phenomenal structure, rather than summation, do the combining.",
    examples: {
      firstRouteTheoryIds: [64],
      secondRouteTheoryIds: [11]
    },
    definitions: ["micropsychism: the smallest things have their own tiny experiences"]
  },
  {
    id: "pan-quantum",
    scope: [13,66],
    yesTheoryIds: [66],
    title: "Does the seed of experience exist specifically in quantum events?",
    subtitle: "These views place experience deep in nature. This choice asks where it begins and how smaller parts relate to larger minds.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “quantum proto-experience” or “general proto-qualities”?",
    whyItMatters: "Gambini–Pullin use quantum events and entanglement; panprotopsychism need not.",
    examples: {
      firstRouteTheoryIds: [66],
      secondRouteTheoryIds: [13]
    },
    definitions: ["ontology: a view about what truly exists"]
  },
  {
    id: "neutral-process",
    scope: [8,9,10,53,54,55,56,57,58,59,60],
    yesTheoryIds: [53],
    title: "Is reality made of brief events of experience rather than lasting things?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “process and prehension” or “another neutral basis”?",
    whyItMatters: "This asks whether reality is made of fleeting moments of experience rather than lasting substances. In other words: is the universe a stream of momentary happenings, with no solid things underneath?",
    examples: {
      firstRouteTheoryIds: [53],
      secondRouteTheoryIds: [8,9,10,54,55,56,57,58,59,60]
    },
    definitions: ["prehension: one event taking account of another in process philosophy","monad: a basic, indivisible point of view in Leibniz’s theory"]
  },
  {
    id: "neutral-evolve",
    scope: [8,9,10,54,55,56,57,58,59,60],
    yesTheoryIds: [57],
    title: "Is the universe developing toward more consciousness and a final peak?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “directed complexification” or “no Omega trajectory”?",
    whyItMatters: "Teilhard makes consciousness axial to cosmic evolution.",
    examples: {
      firstRouteTheoryIds: [57],
      secondRouteTheoryIds: [8,9,10,54,55,56,58,59,60]
    },
    definitions: []
  },
  {
    id: "neutral-monads",
    scope: [8,9,10,54,55,56,58,59,60],
    yesTheoryIds: [54],
    title: "Is reality made of countless separate points of view that never directly interact?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “monads” or “not monadic plurality”?",
    whyItMatters: "Leibniz replaces interaction with pre-established harmony.",
    examples: {
      firstRouteTheoryIds: [54],
      secondRouteTheoryIds: [8,9,10,55,56,58,59,60]
    },
    definitions: ["monad: a basic, indivisible point of view in Leibniz’s theory"]
  },
  {
    id: "neutral-aspects",
    scope: [8,9,10,55,56,58,59,60],
    yesTheoryIds: [8,55,59,60],
    title: "Are mind and matter two views of one deeper reality?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “aspects of one thing” or “a different neutral basis”?",
    whyItMatters: "Aspect theories keep one basis while allowing multiple inseparable presentations.",
    examples: {
      firstRouteTheoryIds: [8,55,59,60],
      secondRouteTheoryIds: [9,10,56,58]
    },
    definitions: []
  },
  {
    id: "neutral-three",
    scope: [8,55,59,60],
    yesTheoryIds: [59],
    title: "Does one reality show up in three ways: body, unconscious mind, and conscious mind?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “three aspects” or “two aspects”?",
    whyItMatters: "Pereira adds the mental-unconscious as an aspect in its own right.",
    examples: {
      firstRouteTheoryIds: [59],
      secondRouteTheoryIds: [8,55,60]
    },
    definitions: []
  },
  {
    id: "neutral-info",
    scope: [8,55,60],
    yesTheoryIds: [60],
    title: "Is information the basic reality, with both physical and conscious sides?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “double-aspect information” or “not information-first”?",
    whyItMatters: "Chalmers’s information-first view differs from substance- or projection-centered dual-aspect theories.",
    examples: {
      firstRouteTheoryIds: [60],
      secondRouteTheoryIds: [8,55]
    },
    definitions: []
  },
  {
    id: "neutral-reflexive",
    scope: [8,55],
    yesTheoryIds: [55],
    title: "Is the world you experience a projection placed where it seems to be?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “reflexive projection” or “Spinozan attributes”?",
    whyItMatters: "Velmans gives dual-aspect monism a modern psychological formulation.",
    examples: {
      firstRouteTheoryIds: [55],
      secondRouteTheoryIds: [8]
    },
    definitions: []
  },
  {
    id: "neutral-pure",
    scope: [9,10,56,58],
    yesTheoryIds: [9],
    title: "Is the common basis of mind and matter simply raw experience?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “pure experience” or “another neutral base”?",
    whyItMatters: "James makes the same stuff mental or physical according to organization and relations.",
    examples: {
      firstRouteTheoryIds: [9],
      secondRouteTheoryIds: [10,56,58]
    },
    definitions: []
  },
  {
    id: "neutral-russell",
    scope: [10,56,58],
    yesTheoryIds: [10],
    title: "Could consciousness be the hidden inner nature of matter that physics does not describe?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “hidden quiddities” or “another monist bridge”?",
    whyItMatters: "Russellian monism uses the gap between physical structure and intrinsic nature.",
    examples: {
      firstRouteTheoryIds: [10],
      secondRouteTheoryIds: [56,58]
    },
    definitions: ["quiddity: a thing’s hidden intrinsic nature","psychophysical: concerning links between mental and physical events"]
  },
  {
    id: "neutral-davidson",
    scope: [56,58],
    yesTheoryIds: [58],
    title: "Can each mental event also be a physical event even if no strict law links the two descriptions?",
    subtitle: "These views say mind and matter come from one deeper reality. This choice asks what that shared basis might be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “anomalous monism” or “psychophysical complementarity”?",
    whyItMatters: "Davidson keeps token identity while preserving irreducible mental explanation.",
    examples: {
      firstRouteTheoryIds: [58],
      secondRouteTheoryIds: [56]
    },
    definitions: ["psychophysical: concerning links between mental and physical events"]
  },
  {
    id: "qualia",
    scope: [14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,120],
    yesTheoryIds: [14,15,16,17,18,19,20,21,22,23,24,25,26,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,106,107,108,109,110,111,112,113,114,115,116,117,120],
    title: "Are the felt qualities of experience as real as they seem?",
    subtitle: "This asks whether feelings such as pain or seeing red are exactly as real as they seem from the inside.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “phenomenal character is real” or “illusion, elimination, or category mistake”?",
    whyItMatters: "This asks whether the rich 'feels' of experience — the redness of red, the ache of pain — are real as they seem, or a kind of introspective illusion. In other words: is what-it-is-like-to-feel genuine, or does your brain just convince you it is?",
    examples: {
      firstRouteTheoryIds: [14,15,16,17,18,19,20,21,22,23,24,25,26,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,106,107,108,109,110,111,112,113,114,115,116,117,120],
      secondRouteTheoryIds: [27,28,99,100,101,102,103,104,105]
    },
    definitions: []
  },
  {
    id: "ill-user",
    scope: [27,28,99,100,101,102,103,104,105],
    yesTheoryIds: [101],
    title: "Is consciousness a useful illusion evolution built for survival and social life?",
    subtitle: "These views question whether inner experience is exactly as it seems. This choice asks what science should explain, revise, or reject.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “magical mystery show” or “another deflationary view”?",
    whyItMatters: "This asks whether consciousness is specifically a \"user illusion\" — a kind of magical show the brain stages for itself because it helped our ancestors survive. In other words: is your inner life a useful fiction evolution built for you?",
    examples: {
      firstRouteTheoryIds: [101],
      secondRouteTheoryIds: [27,28,99,100,102,103,104,105]
    },
    definitions: []
  },
  {
    id: "ill-ryle",
    scope: [27,28,99,100,102,103,104,105],
    yesTheoryIds: [100],
    title: "Is the consciousness problem caused by putting mental life in the wrong conceptual box?",
    subtitle: "These views question whether inner experience is exactly as it seems. This choice asks what science should explain, revise, or reject.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “dissolve the mistake” or “explain or eliminate something”?",
    whyItMatters: "Ryle rejects the Cartesian inner theater as a misuse of mental vocabulary.",
    examples: {
      firstRouteTheoryIds: [100],
      secondRouteTheoryIds: [27,28,99,102,103,104,105]
    },
    definitions: []
  },
  {
    id: "ill-kammerer",
    scope: [27,28,99,102,103,104,105],
    yesTheoryIds: [103],
    title: "Does looking inward mislead us into believing in feelings that do not really exist?",
    subtitle: "These views question whether inner experience is exactly as it seems. This choice asks what science should explain, revise, or reject.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “introspective illusion” or “another target”?",
    whyItMatters: "Kammerer defends the strongest introspection-centered illusionism.",
    examples: {
      firstRouteTheoryIds: [103],
      secondRouteTheoryIds: [27,28,99,102,104,105]
    },
    definitions: ["illusionism: the view that experience is not as it seems from the inside"]
  },
  {
    id: "ill-blackmore",
    scope: [27,28,99,102,104,105],
    yesTheoryIds: [102],
    title: "Are our inner models conscious rather than whole organisms?",
    subtitle: "These views question whether inner experience is exactly as it seems. This choice asks what science should explain, revise, or reject.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “models are conscious” or “organisms or vocabularies remain central”?",
    whyItMatters: "Blackmore relocates “what it is like” from creatures to their internal models.",
    examples: {
      firstRouteTheoryIds: [102],
      secondRouteTheoryIds: [27,28,99,104,105]
    },
    definitions: []
  },
  {
    id: "ill-elim",
    scope: [27,28,99,104,105],
    yesTheoryIds: [99,105],
    title: "Should brain science replace everyday ideas like belief, pain, and thought?",
    subtitle: "These views question whether inner experience is exactly as it seems. This choice asks what science should explain, revise, or reject.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “eliminate the concepts” or “keep a narrower explanatory target”?",
    whyItMatters: "Eliminativists expect mature science to replace at least some familiar mental vocabulary.",
    examples: {
      firstRouteTheoryIds: [99,105],
      secondRouteTheoryIds: [27,28,104]
    },
    definitions: ["illusionism: the view that experience is not as it seems from the inside","eliminativism: replacing familiar mental concepts rather than reducing them"]
  },
  {
    id: "ill-irvine",
    scope: [99,105],
    yesTheoryIds: [105],
    title: "Should science stop using the idea of consciousness altogether?",
    subtitle: "These views question whether inner experience is exactly as it seems. This choice asks what science should explain, revise, or reject.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “remove consciousness-talk” or “replace folk psychology”?",
    whyItMatters: "Irvine’s version is stronger than Churchland’s replacement of folk psychology.",
    examples: {
      firstRouteTheoryIds: [105],
      secondRouteTheoryIds: [99]
    },
    definitions: ["qualia: the felt qualities of experience, such as what red looks like"]
  },
  {
    id: "ill-attention",
    scope: [27,28,104],
    yesTheoryIds: [28],
    title: "Is consciousness the brain’s simplified picture of what it is paying attention to?",
    subtitle: "These views question whether inner experience is exactly as it seems. This choice asks what science should explain, revise, or reject.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “attention schema” or “broader illusion or quietism”?",
    whyItMatters: "Attention Schema Theory names a particular control-and-social-attribution mechanism.",
    examples: {
      firstRouteTheoryIds: [28],
      secondRouteTheoryIds: [27,104]
    },
    definitions: []
  },
  {
    id: "ill-mandik",
    scope: [27,104],
    yesTheoryIds: [104],
    title: "Should we explain brain representations without treating felt qualities as separate things?",
    subtitle: "These views question whether inner experience is exactly as it seems. This choice asks what science should explain, revise, or reject.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “qualia quietism” or “general illusionism”?",
    whyItMatters: "Mandik’s quietism differs from general illusionism’s effort to explain phenomenal seeming.",
    examples: {
      firstRouteTheoryIds: [104],
      secondRouteTheoryIds: [27]
    },
    definitions: ["qualia: the felt qualities of experience, such as what red looks like","illusionism: the view that experience is not as it seems from the inside","representation: an internal state that stands for something"]
  },
  {
    id: "quantum",
    scope: [14,15,16,17,18,19,20,21,22,23,24,25,26,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,106,107,108,109,110,111,112,113,114,115,116,117,120],
    yesTheoryIds: [26,68,69,70,71,72,73,74,75,76],
    title: "Does consciousness require quantum physics, not just ordinary brain processes?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “quantum physics matters” or “classical mechanisms can suffice”?",
    whyItMatters: "This splits the physicalists. Most say ordinary neurons and chemistry suffice; a minority — Penrose, Hameroff, Stapp, and others — argue the brain must exploit quantum effects like superposition or wave-function collapse to explain experience. In other words: is the brain just a very complex chemical machine, or does explaining consciousness require quantum weirdness?",
    examples: {
      firstRouteTheoryIds: [26,68,69,70,71,72,73,74,75,76],
      secondRouteTheoryIds: [14,15,16,17,18,19,20,21,22,23,24,25,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,106,107,108,109,110,111,112,113,114,115,116,117,120]
    },
    definitions: ["ontology: a view about what truly exists","wave-function collapse: a quantum range of possibilities resolving to one outcome","superposition: several quantum possibilities existing together"]
  },
  {
    id: "quant-collapse",
    scope: [26,68,69,70,71,72,73,74,75,76],
    yesTheoryIds: [68,69,71],
    title: "Is consciousness tied to the moment a quantum possibility becomes one actual outcome?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “collapse” or “another quantum basis”?",
    whyItMatters: "This asks whether consciousness is tied to quantum measurement — the moment fuzzy quantum possibilities become definite. In other words: does mind play a role in collapsing quantum possibilities into a single reality?",
    examples: {
      firstRouteTheoryIds: [68,69,71],
      secondRouteTheoryIds: [26,70,72,73,74,75,76]
    },
    definitions: ["superposition: several quantum possibilities existing together"]
  },
  {
    id: "quant-cause",
    scope: [68,69,71],
    yesTheoryIds: [68,69],
    title: "Does consciousness choose quantum outcomes, or do chosen outcomes create consciousness?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Consciousness helps choose", hint: "The mind plays a part in settling the physical outcome." },
      second: { label: "The physical outcome comes first", hint: "A physical event happens, and experience follows." }
    },
    putSimply: "Which is closer to your view: “mind selects outcomes” or “collapse gives rise to consciousness”?",
    whyItMatters: "Wigner–von Neumann and Stapp put conscious agency on the selecting side.",
    examples: {
      firstRouteTheoryIds: [68,69],
      secondRouteTheoryIds: [71]
    },
    definitions: []
  },
  {
    id: "quant-stapp",
    scope: [68,69],
    yesTheoryIds: [69],
    title: "Can sustained attention repeatedly steer which quantum outcome occurs?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “quantum questions” or “conscious observation”?",
    whyItMatters: "Stapp gives volition a specific quantum-mechanical locus.",
    examples: {
      firstRouteTheoryIds: [69],
      secondRouteTheoryIds: [68]
    },
    definitions: []
  },
  {
    id: "quant-super",
    scope: [26,70,72,73,74,75,76],
    yesTheoryIds: [70],
    title: "Does consciousness begin whenever a genuine quantum overlap of possibilities forms?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “superposition formation” or “another quantum mechanism”?",
    whyItMatters: "Neven’s proposal is the most specific and minimal substrate claim in the set.",
    examples: {
      firstRouteTheoryIds: [70],
      secondRouteTheoryIds: [26,72,73,74,75,76]
    },
    definitions: ["superposition: several quantum possibilities existing together","microtubules: tiny structural tubes inside cells"]
  },
  {
    id: "quant-orch",
    scope: [26,72,73,74,75,76],
    yesTheoryIds: [26],
    title: "Does consciousness come from quantum computation inside tiny structures in brain cells?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “Orch OR” or “not microtubules”?",
    whyItMatters: "Orch OR joins microtubule orchestration to gravity-linked objective reduction.",
    examples: {
      firstRouteTheoryIds: [26],
      secondRouteTheoryIds: [72,73,74,75,76]
    },
    definitions: ["microtubules: tiny structural tubes inside cells"]
  },
  {
    id: "quant-info",
    scope: [72,73,74,75,76],
    yesTheoryIds: [73,75],
    title: "Does consciousness depend on quantum information carried by the brain?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “quantum information” or “another quantum ontology”?",
    whyItMatters: "These proposals make information-bearing quantum structure central.",
    examples: {
      firstRouteTheoryIds: [73,75],
      secondRouteTheoryIds: [72,74,76]
    },
    definitions: ["ontology: a view about what truly exists","zero-point field: the lowest-energy state of a quantum field"]
  },
  {
    id: "quant-fisher",
    scope: [73,75],
    yesTheoryIds: [75],
    title: "Are phosphorus atoms in the brain the carriers of quantum information?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “phosphorus spins” or “quantum-information panpsychism”?",
    whyItMatters: "Fisher offers a concrete biochemical mechanism; Faggin offers a broader information-based panpsychism.",
    examples: {
      firstRouteTheoryIds: [75],
      secondRouteTheoryIds: [73]
    },
    definitions: ["panpsychism: experience is present throughout nature"]
  },
  {
    id: "quant-bohm",
    scope: [72,74,76],
    yesTheoryIds: [72],
    title: "Do mind and matter unfold from one deeper, connected order?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “implicate order” or “another quantum ontology”?",
    whyItMatters: "Bohm makes wholeness primary and fragmentation derivative.",
    examples: {
      firstRouteTheoryIds: [72],
      secondRouteTheoryIds: [74,76]
    },
    definitions: ["ontology: a view about what truly exists"]
  },
  {
    id: "quant-kauff",
    scope: [74,76],
    yesTheoryIds: [74],
    title: "Does mind help turn real possibilities into actual events?",
    subtitle: "These views give quantum physics a role in consciousness. This choice asks what that role would be.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “possibles to actuals” or “zero-point field”?",
    whyItMatters: "Kauffman distinguishes Res potentia from Res extensa; Keppler locates consciousness in the quantum vacuum.",
    examples: {
      firstRouteTheoryIds: [74],
      secondRouteTheoryIds: [76]
    },
    definitions: ["zero-point field: the lowest-energy state of a quantum field"]
  },
  {
    id: "machine",
    scope: [14,15,16,17,18,19,20,21,22,23,24,25,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,106,107,108,109,110,111,112,113,114,115,116,117,120],
    yesTheoryIds: [17,18,19,20,21,22,25,77,78,79,80,81,82,83,93,94,95,96,97,98,106,107,108,109,110,111,120],
    title: "Could the right kind of nonliving machine be conscious?",
    subtitle: "This asks whether consciousness depends on being alive, or whether the right kind of machine could have it too.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “substrate can vary” or “living biology is essential”?",
    whyItMatters: "This asks whether a nonliving machine could be conscious, or whether living biology is essential. In other words: could the right computer program genuinely feel things, or does consciousness require a living brain?",
    examples: {
      firstRouteTheoryIds: [17,18,19,20,21,22,25,77,78,79,80,81,82,83,93,94,95,96,97,98,106,107,108,109,110,111,120],
      secondRouteTheoryIds: [14,15,16,23,24,84,85,86,87,88,89,90,91,92,112,113,114,115,116,117]
    },
    definitions: ["representation: an internal state that stands for something"]
  },
  {
    id: "em",
    scope: [17,18,19,20,21,22,25,77,78,79,80,81,82,83,93,94,95,96,97,98,106,107,108,109,110,111,120],
    yesTheoryIds: [25,77,78,79,80,81,82,83],
    title: "Is consciousness made from the brain’s electromagnetic activity?",
    subtitle: "These views connect consciousness to electrical activity in the brain or body. This choice asks which pattern matters.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “electromagnetic dynamics” or “another kind of organization”?",
    whyItMatters: "This asks whether consciousness is, at bottom, the brain's electromagnetic field. In other words: is your mind literally made of the electric and magnetic fields generated by your neurons?",
    examples: {
      firstRouteTheoryIds: [25,77,78,79,80,81,82,83],
      secondRouteTheoryIds: [17,18,19,20,21,22,93,94,95,96,97,98,106,107,108,109,110,111,120]
    },
    definitions: ["representation: an internal state that stands for something"]
  },
  {
    id: "em-res",
    scope: [25,77,78,79,80,81,82,83],
    yesTheoryIds: [78,80],
    title: "Does consciousness depend on large groups of brain processes beating in sync?",
    subtitle: "These views connect consciousness to electrical activity in the brain or body. This choice asks which pattern matters.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “resonance or synchrony” or “another field or wave mechanism”?",
    whyItMatters: "Resonance views make temporal coordination central rather than a specific static field pattern.",
    examples: {
      firstRouteTheoryIds: [78,80],
      secondRouteTheoryIds: [25,77,79,81,82,83]
    },
    definitions: []
  },
  {
    id: "em-multi",
    scope: [78,80],
    yesTheoryIds: [78],
    title: "Can the same kind of synchronized activity create consciousness at many scales, not just in brains?",
    subtitle: "These views connect consciousness to electrical activity in the brain or body. This choice asks which pattern matters.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “multiscale resonance” or “neuronal synchrony”?",
    whyItMatters: "General Resonance Theory extends the principle beyond neuronal synchrony.",
    examples: {
      firstRouteTheoryIds: [78],
      secondRouteTheoryIds: [80]
    },
    definitions: []
  },
  {
    id: "em-dc",
    scope: [25,77,79,81,82,83],
    yesTheoryIds: [77],
    title: "Are slow electrical fields across the whole body central to consciousness?",
    subtitle: "These views connect consciousness to electrical activity in the brain or body. This choice asks which pattern matters.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “body electric” or “another neural field dynamic”?",
    whyItMatters: "Becker’s account is analog and body-wide rather than synapse-centered.",
    examples: {
      firstRouteTheoryIds: [77],
      secondRouteTheoryIds: [25,79,81,82,83]
    },
    definitions: []
  },
  {
    id: "em-wave",
    scope: [25,79,81,82,83],
    yesTheoryIds: [79],
    title: "Do moving electrical waves across the brain perform the key work of consciousness?",
    subtitle: "These views connect consciousness to electrical activity in the brain or body. This choice asks which pattern matters.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “traveling waves” or “another EM identity”?",
    whyItMatters: "Miller emphasizes wave dynamics organizing the cortex beyond fixed wiring.",
    examples: {
      firstRouteTheoryIds: [79],
      secondRouteTheoryIds: [25,81,82,83]
    },
    definitions: ["cortex: the brain’s folded outer layer"]
  },
  {
    id: "em-pattern",
    scope: [25,81,82,83],
    yesTheoryIds: [81],
    title: "Is each experience identical to a particular three-dimensional electrical pattern?",
    subtitle: "These views connect consciousness to electrical activity in the brain or body. This choice asks which pattern matters.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “field patterns” or “another oscillatory or operational account”?",
    whyItMatters: "Pockett specifies which field patterns are conscious and which are not.",
    examples: {
      firstRouteTheoryIds: [81],
      secondRouteTheoryIds: [25,82,83]
    },
    definitions: []
  },
  {
    id: "em-llinas",
    scope: [25,82,83],
    yesTheoryIds: [82],
    title: "Does consciousness depend on a rhythmic conversation between the brain’s central relay and its outer layer?",
    subtitle: "These views connect consciousness to electrical activity in the brain or body. This choice asks which pattern matters.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “mindness oscillations” or “operations or generic field”?",
    whyItMatters: "Llinás centers rhythmic neuronal activity and thalamocortical dialogue.",
    examples: {
      firstRouteTheoryIds: [82],
      secondRouteTheoryIds: [25,83]
    },
    definitions: ["thalamus: a deep-brain hub linking and regulating many regions"]
  },
  {
    id: "em-ops",
    scope: [25,83],
    yesTheoryIds: [83],
    title: "Does consciousness come in brief, stable patterns of coordinated electrical activity?",
    subtitle: "These views connect consciousness to electrical activity in the brain or body. This choice asks which pattern matters.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “operations” or “generic EM field”?",
    whyItMatters: "Operational Architectonics uses transient EEG configurations as bridge units.",
    examples: {
      firstRouteTheoryIds: [83],
      secondRouteTheoryIds: [25]
    },
    definitions: ["phenomenology: careful description of experience from the inside"]
  },
  {
    id: "info-global",
    scope: [17,18,19,20,21,22,93,94,95,96,97,98,106,107,108,109,110,111,120],
    yesTheoryIds: [18,19,106,120],
    title: "Does consciousness require information to become widely available or tightly integrated?",
    subtitle: "These views focus on how information is shared or organized. This choice asks which feature could make it conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “access or integration” or “representation, computation, or distributed agency”?",
    whyItMatters: "This family centers workspace access, intrinsic integration, formal architecture, or macro causal structure.",
    examples: {
      firstRouteTheoryIds: [18,19,106,120],
      secondRouteTheoryIds: [17,20,21,22,93,94,95,96,97,98,107,108,109,110,111]
    },
    definitions: ["representation: an internal state that stands for something"]
  },
  {
    id: "workspace",
    scope: [18,19,106,120],
    yesTheoryIds: [18,106],
    title: "Does the brain need a shared stage where many specialist processes can exchange information?",
    subtitle: "These views focus on how information is shared or organized. This choice asks which feature could make it conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “workspace broadcast” or “intrinsic integration or causal emergence”?",
    whyItMatters: "Workspace theories focus on broadcast; IIT and causal emergence focus on intrinsic structure or macro cause.",
    examples: {
      firstRouteTheoryIds: [18,106],
      secondRouteTheoryIds: [19,120]
    },
    definitions: ["emergence: a whole system gaining properties its parts do not have alone"]
  },
  {
    id: "ctm",
    scope: [18,106],
    yesTheoryIds: [106],
    title: "Could that shared stage work like a formal computer?",
    subtitle: "These views focus on how information is shared or organized. This choice asks which feature could make it conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “conscious Turing machine” or “neural global workspace”?",
    whyItMatters: "The Blums turn the architecture into a theoretical-computer-science model.",
    examples: {
      firstRouteTheoryIds: [106],
      secondRouteTheoryIds: [18]
    },
    definitions: []
  },
  {
    id: "hoel",
    scope: [19,120],
    yesTheoryIds: [120],
    title: "Does consciousness appear when a whole system has stronger causes than its parts?",
    subtitle: "These views focus on how information is shared or organized. This choice asks which feature could make it conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “causal emergence” or “integrated information”?",
    whyItMatters: "Hoel privileges macro-level causal strength; IIT identifies experience with irreducible cause–effect structure.",
    examples: {
      firstRouteTheoryIds: [120],
      secondRouteTheoryIds: [19]
    },
    definitions: ["emergence: a whole system gaining properties its parts do not have alone"]
  },
  {
    id: "represent",
    scope: [17,20,21,22,93,94,95,96,97,98,107,108,109,110,111],
    yesTheoryIds: [20,21,22,93,94,95,96,97,98,107,111],
    title: "Is consciousness mainly the brain representing the world or itself?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “representation is central” or “another computational organization”?",
    whyItMatters: "Representational theories differ from broader functionalism, societies of agents, and self-referential architecture.",
    examples: {
      firstRouteTheoryIds: [20,21,22,93,94,95,96,97,98,107,111],
      secondRouteTheoryIds: [17,108,109,110]
    },
    definitions: ["representation: an internal state that stands for something"]
  },
  {
    id: "higher",
    scope: [20,21,22,93,94,95,96,97,98,107,111],
    yesTheoryIds: [20,93,94,95,96,97,98],
    title: "Must the mind represent its own mental state for that state to become conscious?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “awareness of representation” or “first-order, predictive, draft, or extended content”?",
    whyItMatters: "Higher-order families add awareness of a state, representational status, reality, learning, or selfhood.",
    examples: {
      firstRouteTheoryIds: [20,93,94,95,96,97,98],
      secondRouteTheoryIds: [21,22,107,111]
    },
    definitions: ["representation: an internal state that stands for something","higher-order: a mental state about another mental state"]
  },
  {
    id: "higher-thought",
    scope: [20,93,94,95,96,97,98],
    yesTheoryIds: [20,98],
    title: "Must that second-level awareness be a thought rather than a perception or learned skill?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “thought-like” or “another metacognitive form”?",
    whyItMatters: "HOT and HOROR use thought-like representation; other branches use inner sense or integrated self-models.",
    examples: {
      firstRouteTheoryIds: [20,98],
      secondRouteTheoryIds: [93,94,95,96,97]
    },
    definitions: ["representation: an internal state that stands for something","higher-order: a mental state about another mental state"]
  },
  {
    id: "horor",
    scope: [20,98],
    yesTheoryIds: [98],
    title: "Must the mind represent the fact that it is representing something?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “representation of representing” or “higher-order thought about the state”?",
    whyItMatters: "HOROR targets representational status; standard HOT targets being in the mental state.",
    examples: {
      firstRouteTheoryIds: [98],
      secondRouteTheoryIds: [20]
    },
    definitions: ["representation: an internal state that stands for something","higher-order: a mental state about another mental state"]
  },
  {
    id: "inner",
    scope: [93,94,95,96,97],
    yesTheoryIds: [93],
    title: "Is looking inward like one brain process observing another?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “higher-order perception” or “monitoring takes another form”?",
    whyItMatters: "Armstrong’s inner-sense theory treats both levels as neural.",
    examples: {
      firstRouteTheoryIds: [93],
      secondRouteTheoryIds: [94,95,96,97]
    },
    definitions: ["representation: an internal state that stands for something","higher-order: a mental state about another mental state"]
  },
  {
    id: "kriegel",
    scope: [94,95,96,97],
    yesTheoryIds: [94],
    title: "Can one mental state represent the world and itself at the same time?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “one state, two components” or “a learned or model-based account”?",
    whyItMatters: "Kriegel avoids two separate states by integrating first- and higher-order components.",
    examples: {
      firstRouteTheoryIds: [94],
      secondRouteTheoryIds: [95,96,97]
    },
    definitions: ["higher-order: a mental state about another mental state"]
  },
  {
    id: "plastic",
    scope: [95,96,97],
    yesTheoryIds: [95],
    title: "Is consciousness a skill the brain learns?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “learned skill” or “not acquired plasticity”?",
    whyItMatters: "Cleeremans makes metacognitive skill and plasticity fundamental.",
    examples: {
      firstRouteTheoryIds: [95],
      secondRouteTheoryIds: [96,97]
    },
    definitions: []
  },
  {
    id: "lau",
    scope: [96,97],
    yesTheoryIds: [96],
    title: "Must the brain mark a perception as being about the real world right now?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “reality monitoring” or “no-self through transparent modeling”?",
    whyItMatters: "Lau centers reality-monitoring content; Metzinger centers a transparent phenomenal self-model.",
    examples: {
      firstRouteTheoryIds: [96],
      secondRouteTheoryIds: [97]
    },
    definitions: []
  },
  {
    id: "prediction",
    scope: [21,22,107,111],
    yesTheoryIds: [22],
    title: "Is perception the brain’s best guess about what caused its senses?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “controlled hallucination” or “another first-order or external account”?",
    whyItMatters: "Predictive processing emphasizes top-down generative models and error correction.",
    examples: {
      firstRouteTheoryIds: [22],
      secondRouteTheoryIds: [21,107,111]
    },
    definitions: ["predictive processing: the brain continually guesses sensory causes and corrects errors"]
  },
  {
    id: "drafts",
    scope: [21,107,111],
    yesTheoryIds: [107],
    title: "Are there many competing versions of experience with no single final version?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “multiple drafts” or “another first-order structure”?",
    whyItMatters: "Dennett replaces the Cartesian theater with competing content-fixations.",
    examples: {
      firstRouteTheoryIds: [107],
      secondRouteTheoryIds: [21,111]
    },
    definitions: ["representation: an internal state that stands for something"]
  },
  {
    id: "extended",
    scope: [21,111],
    yesTheoryIds: [111],
    title: "Can tools and surroundings literally become part of a mind?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “active externalism” or “first-order representation”?",
    whyItMatters: "Extended mind applies the parity principle; first-order representationalism keeps consciousness in world-directed content.",
    examples: {
      firstRouteTheoryIds: [111],
      secondRouteTheoryIds: [21]
    },
    definitions: ["representation: an internal state that stands for something"]
  },
  {
    id: "society",
    scope: [17,108,109,110],
    yesTheoryIds: [108],
    title: "Is the mind a team of many simple, mindless specialists?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “society of mind” or “another computational architecture”?",
    whyItMatters: "Minsky removes the central self in favor of interacting modules.",
    examples: {
      firstRouteTheoryIds: [108],
      secondRouteTheoryIds: [17,109,110]
    },
    definitions: []
  },
  {
    id: "loop",
    scope: [17,109,110],
    yesTheoryIds: [110],
    title: "Does the sense of self come from symbols repeatedly referring back to themselves?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “strange loop” or “computation without that loop”?",
    whyItMatters: "Hofstadter derives selfhood from feedback in tangled representational hierarchies.",
    examples: {
      firstRouteTheoryIds: [110],
      secondRouteTheoryIds: [17,109]
    },
    definitions: ["representation: an internal state that stands for something"]
  },
  {
    id: "ai",
    scope: [17,109],
    yesTheoryIds: [109],
    title: "Would the right information-processing program be conscious in any suitable machine?",
    subtitle: "These views focus on how the mind builds, shares, or uses information. This choice asks which step could make experience conscious.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “computational consciousness” or “functional causal role”?",
    whyItMatters: "Agüera y Arcas states the AI-era computational thesis; generic functionalism defines states by causal role.",
    examples: {
      firstRouteTheoryIds: [109],
      secondRouteTheoryIds: [17]
    },
    definitions: []
  },
  {
    id: "bio-evo",
    scope: [14,15,16,23,24,84,85,86,87,88,89,90,91,92,112,113,114,115,116,117],
    yesTheoryIds: [84,116,117],
    title: "Should consciousness be explained mainly by when and why it evolved?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “evolutionary origin” or “current biological mechanism”?",
    whyItMatters: "Some theories don't start from physics or philosophy but from biology's history: which creatures became conscious, and what survival advantage it bought — feeling pain to avoid damage, pleasure to seek food, integrated senses to act as one animal. In other words: is the best clue to consciousness its evolutionary job description — when it appeared and what it was for?",
    examples: {
      firstRouteTheoryIds: [84,116,117],
      secondRouteTheoryIds: [14,15,16,23,24,85,86,87,88,89,90,91,92,112,113,114,115]
    },
    definitions: ["emergence: a whole system gaining properties its parts do not have alone"]
  },
  {
    id: "evo-edelman",
    scope: [84,116,117],
    yesTheoryIds: [84],
    title: "Does the brain build consciousness by selecting successful groups of neurons?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “neural selection” or “comparative or learning transition”?",
    whyItMatters: "Edelman offers a biological, anti-computational selectionist theory.",
    examples: {
      firstRouteTheoryIds: [84],
      secondRouteTheoryIds: [116,117]
    },
    definitions: []
  },
  {
    id: "evo-ual",
    scope: [116,117],
    yesTheoryIds: [117],
    title: "Did consciousness begin when animals learned without a fixed limit on what could be associated?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “UAL” or “gradual animal subjectivity”?",
    whyItMatters: "Ginsburg and Jablonka propose a specific operational transition; Godfrey-Smith emphasizes graded diversity.",
    examples: {
      firstRouteTheoryIds: [117],
      secondRouteTheoryIds: [116]
    },
    definitions: []
  },
  {
    id: "bio-identity",
    scope: [14,15,16,23,24,85,86,87,88,89,90,91,92,112,113,114,115],
    yesTheoryIds: [14,92],
    title: "Is a conscious state literally the same thing as a physical state of the brain or body?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “literal identity” or “another biological relation”?",
    whyItMatters: "Identity views make the strongest reduction, from modern brain-state identity back to matter in motion.",
    examples: {
      firstRouteTheoryIds: [14,92],
      secondRouteTheoryIds: [15,16,23,24,85,86,87,88,89,90,91,112,113,114,115]
    },
    definitions: ["emergence: a whole system gaining properties its parts do not have alone"]
  },
  {
    id: "bio-hobbes",
    scope: [14,92],
    yesTheoryIds: [92],
    title: "Can thought and feeling be explained entirely as matter in motion?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “mechanical materialism” or “modern brain-state identity”?",
    whyItMatters: "Hobbes offers the historical ancestor; modern identity theory names neural and experiential descriptions of one event.",
    examples: {
      firstRouteTheoryIds: [92],
      secondRouteTheoryIds: [14]
    },
    definitions: []
  },
  {
    id: "bio-body",
    scope: [15,16,23,24,85,86,87,88,89,90,91,112,113,114,115],
    yesTheoryIds: [23,24,112,113,114,115],
    title: "Does consciousness depend on the whole body’s feelings, needs, and actions?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “body and life regulation” or “brain mechanism or emergence”?",
    whyItMatters: "These approaches widen the unit beyond isolated neural machinery.",
    examples: {
      firstRouteTheoryIds: [23,24,112,113,114,115],
      secondRouteTheoryIds: [15,16,85,86,87,88,89,90,91]
    },
    definitions: ["autopoiesis: a living system continually making and maintaining itself","emergence: a whole system gaining properties its parts do not have alone"]
  },
  {
    id: "bio-friston",
    scope: [23,24,112,113,114,115],
    yesTheoryIds: [114],
    title: "Does the brain stay alive and understand the world by constantly reducing surprise?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “free energy” or “another body-centered account”?",
    whyItMatters: "Friston treats perception and action as two sides of surprise minimization.",
    examples: {
      firstRouteTheoryIds: [114],
      secondRouteTheoryIds: [23,24,112,113,115]
    },
    definitions: []
  },
  {
    id: "bio-seth",
    scope: [23,24,112,113,115],
    yesTheoryIds: [115],
    title: "Is conscious perception the brain’s best guess for keeping the body under control?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “beast machine” or “not control-first prediction”?",
    whyItMatters: "Seth’s beast machine fuses interoceptive inference with allostasis.",
    examples: {
      firstRouteTheoryIds: [115],
      secondRouteTheoryIds: [23,24,112,113]
    },
    definitions: []
  },
  {
    id: "bio-organism",
    scope: [23,24,112,113],
    yesTheoryIds: [24,112,113],
    title: "Is consciousness something the whole organism does while acting in its environment?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “enacted engagement” or “affective core”?",
    whyItMatters: "Enactive views make organism–environment coupling constitutive rather than merely causal.",
    examples: {
      firstRouteTheoryIds: [24,112,113],
      secondRouteTheoryIds: [23]
    },
    definitions: ["enactivism: mind arises through an organism’s active engagement with its world"]
  },
  {
    id: "bio-life",
    scope: [24,112,113],
    yesTheoryIds: [112],
    title: "Are life and mind different stages of the same self-organizing process?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “mind in life” or “another enactive emphasis”?",
    whyItMatters: "Thompson grounds subjectivity in autopoiesis and life’s organization.",
    examples: {
      firstRouteTheoryIds: [112],
      secondRouteTheoryIds: [24,113]
    },
    definitions: ["enactivism: mind arises through an organism’s active engagement with its world","autopoiesis: a living system continually making and maintaining itself"]
  },
  {
    id: "bio-noe",
    scope: [24,113],
    yesTheoryIds: [113],
    title: "Does consciousness happen through active engagement with the world rather than only inside the head?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “out of our heads” or “general enactivism”?",
    whyItMatters: "Noë gives the strongest externalist formulation; generic enactivism states the broader coupling view.",
    examples: {
      firstRouteTheoryIds: [113],
      secondRouteTheoryIds: [24]
    },
    definitions: ["enactivism: mind arises through an organism’s active engagement with its world"]
  },
  {
    id: "bio-emerge",
    scope: [15,16,85,86,87,88,89,90,91],
    yesTheoryIds: [16,91],
    title: "Can an organized physical system create consciousness with new powers of its own?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “strong emergence” or “a biological feature or specific neural mechanism”?",
    whyItMatters: "Emergent views reject both reduction and a separate nonphysical substance.",
    examples: {
      firstRouteTheoryIds: [16,91],
      secondRouteTheoryIds: [15,85,86,87,88,89,90]
    },
    definitions: ["emergence: a whole system gaining properties its parts do not have alone"]
  },
  {
    id: "bio-bunge",
    scope: [16,91],
    yesTheoryIds: [91],
    title: "Can consciousness emerge from a material system without becoming a separate thing?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “emergent materialism” or “non-reductive physicalism”?",
    whyItMatters: "Bunge gives emergence a hard-nosed systems-science framing.",
    examples: {
      firstRouteTheoryIds: [91],
      secondRouteTheoryIds: [16]
    },
    definitions: ["emergence: a whole system gaining properties its parts do not have alone"]
  },
  {
    id: "bio-searle",
    scope: [15,85,86,87,88,89,90],
    yesTheoryIds: [15],
    title: "Is consciousness a biological feature caused by the brain but experienced only from the inside?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “biological naturalism” or “a more specific neural architecture”?",
    whyItMatters: "Searle’s biological naturalism is causally reducible but not ontologically reducible.",
    examples: {
      firstRouteTheoryIds: [15],
      secondRouteTheoryIds: [85,86,87,88,89,90]
    },
    definitions: ["thalamus: a deep-brain hub linking and regulating many regions","dendrites: branching parts of brain cells that receive and combine signals"]
  },
  {
    id: "bio-mid",
    scope: [85,86,87,88,89,90],
    yesTheoryIds: [86],
    title: "Can basic consciousness exist without the brain’s outer layer, relying on the upper brainstem?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “midbrain suffices” or “another neural locus”?",
    whyItMatters: "Merker’s decorticate evidence puts the control problem low in the neuroaxis.",
    examples: {
      firstRouteTheoryIds: [86],
      secondRouteTheoryIds: [85,87,88,89,90]
    },
    definitions: ["thalamus: a deep-brain hub linking and regulating many regions","cortex: the brain’s folded outer layer","dendrites: branching parts of brain cells that receive and combine signals"]
  },
  {
    id: "bio-thal",
    scope: [85,87,88,89,90],
    yesTheoryIds: [87],
    title: "Does consciousness depend on repeated loops between the brain’s relay center and outer layer?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “thalamic dynamic core” or “another mechanism”?",
    whyItMatters: "Ward and Min recast the thalamus as active conductor rather than relay.",
    examples: {
      firstRouteTheoryIds: [87],
      secondRouteTheoryIds: [85,88,89,90]
    },
    definitions: ["thalamus: a deep-brain hub linking and regulating many regions","dendrites: branching parts of brain cells that receive and combine signals"]
  },
  {
    id: "bio-dend",
    scope: [85,88,89,90],
    yesTheoryIds: [88],
    title: "Does consciousness depend on complex processing inside the branching parts of individual brain cells?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “dendritic integration” or “another systems mechanism”?",
    whyItMatters: "Dendritic Integration Theory moves the key mechanism to the cellular level.",
    examples: {
      firstRouteTheoryIds: [88],
      secondRouteTheoryIds: [85,89,90]
    },
    definitions: ["dendrites: branching parts of brain cells that receive and combine signals"]
  },
  {
    id: "bio-action",
    scope: [85,89,90],
    yesTheoryIds: [89],
    title: "Did consciousness evolve to settle conflicts between different possible actions?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “passive frame” or “perception or cortical modeling”?",
    whyItMatters: "Morsella’s passive frame gives consciousness a narrow skeletal-muscle function.",
    examples: {
      firstRouteTheoryIds: [89],
      secondRouteTheoryIds: [85,90]
    },
    definitions: ["representation: an internal state that stands for something"]
  },
  {
    id: "bio-air",
    scope: [85,90],
    yesTheoryIds: [90],
    title: "Must a perception reach a middle level of processing and receive attention before it becomes conscious?",
    subtitle: "These views look to living bodies and brains. This choice asks which biological feature or part of their history matters most.",
    answers: {
      first: { label: "Yes — this feels closer", hint: "Keep the views that agree with this statement." },
      second: { label: "No — I lean another way", hint: "Keep the views that explain it differently." }
    },
    putSimply: "Which is closer to your view: “AIR theory” or “thousand brains”?",
    whyItMatters: "Prinz combines a processing level with attentional modulation; Hawkins emphasizes voting among cortical models.",
    examples: {
      firstRouteTheoryIds: [90],
      secondRouteTheoryIds: [85]
    },
    definitions: []
  }
]);

window.QUIZ_CONTENT_CHANGE_REPORT = Object.freeze({
  contentVersion: '6',
  previousVersion: '5',
  rewritten: Object.freeze({
    putSimply: '119/119 replaced: removed the repeated generic instruction and restored a question-specific plain-language contrast.',
    whyItMatters: '98/119 replaced: removed the shared fallback and restored each question’s specific decision context.'
  }),
  carriedOverUnchanged: Object.freeze({
    title: '119/119',
    subtitle: '119/119',
    answers: '119/119',
    decisionTopology: '119/119'
  }),
  migratedWithoutCopyChanges: Object.freeze({
    examples: '119/119 now declared per question; route membership is unchanged.',
    definitions: '119/119 now declared per question from the existing glossary matches.'
  })
});
