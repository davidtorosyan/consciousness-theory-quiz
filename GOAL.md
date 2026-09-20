# The Consciousness Theories Quiz — Goal

This is the standing spec for the project. It lives in the repo and is the
authority the background iteration loop works against.

## Mission

Build the best public entry point for understanding the landscape of
consciousness theories. A curious person with no background should be able to
arrive, take the quiz, and leave understanding the landscape — and if they're
confused about a claim, they (and the maintainer) can dig in and debug it
easily.

## What the product is

- **The quiz is the product.** Landing goes straight into the quiz with as few
  choices as possible. Approachability is the top priority.
- **The claims graph is a debugging tool.** The claim explorer and theory
  explorer exist so visitors and the maintainer can inspect, understand, and
  debug the claims behind any question or result. They are secondary surfaces:
  reachable, but not in the way.
- **The claims DAG is the source of truth.** Classification comes from the
  graph, not hand-labeling. Every theory gets claims; theories are scored by
  alignment with the visitor's answers.

## Coverage

- All 400+ theories from the Closer to Truth site, including challenge entries,
  which are treated like everything else.
- It is fine for some theories to be indistinguishable at first; those get
  refined later.
- The quiz may exclude claims or partition a subgraph for usability. Full
  coverage lives in the data, not necessarily in every quiz run.

## The lines we've drawn (data model)

- Claims are positive statements only (starting point).
- A theory's silence on a claim is a genuine gap, not a rejection.
- Results measure alignment, not one winner: "you align with X of this
  theory's Y claims." A theory counts as aligned when all its claims are
  affirmed, even if another theory has more claims.
- Specific claims entail broader claims. Entailment edges point from specific
  to general.
- Propagation: affirm a specific claim → affirm all ancestors; reject a
  general claim → reject all descendants; affirm general → children stay open;
  reject specific → parents and siblings stay open.
- A theory lists only its most specific claims; broader inherited claims are
  computed.
- The quiz asks the undecided claim with the greatest current coverage.
- Contradictory positions may both be affirmed; the system measures alignment,
  not global consistency.

## Understandability

- Plain language everywhere. Jargon gets qualifiers or inline explanations.
  The exact mechanism (expandable context, glossary, more verbose claims) is
  decided through UX testing.
- Confusion has a resolution path: every claim and every result is traceable
  in the explorers.
- Visitors can raise issues when something seems off (wrong claim, missing
  theory, confusing language) via GitHub issues.

## How we work

- GitHub Pages is the single home. The Muse artifact workflow is retired.
- Background iteration: a fresh-eyes tester (agent driving a real browser,
  acting first as a pure layperson, then as someone who latches onto a theory
  and interrogates it) evaluates usability, navigation, and understandability
  each round.
- The maintainer applies feedback directly, including content-meaning changes.
- Check in with David when tester feedback dries up or about once a day —
  i.e., when it's in a good place for his review.

## Retired

- The 120-theory fixed list as a coverage target (it was an artifact of the
  old classification approach).
- The Muse artifact as an iteration surface.
