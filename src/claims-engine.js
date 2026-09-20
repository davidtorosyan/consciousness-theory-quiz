/*
  Claims engine — DAG utilities, answer propagation, question selection, scoring.
  DOM-free: all functions take explicit data so the logic is unit-testable.
  In the browser, `ClaimsEngine.bound()` binds to window.CLAIMS / window.CLAIM_THEORIES.
*/
(function (root) {
  'use strict';

  function indexById(claims) {
    const m = new Map();
    for (const c of claims) m.set(c.id, c);
    return m;
  }

  function childrenMap(claims) {
    const m = new Map();
    for (const c of claims) m.set(c.id, []);
    for (const c of claims) {
      for (const p of (c.entails || [])) {
        if (m.has(p)) m.get(p).push(c.id);
      }
    }
    return m;
  }

  // Transitive closure upward: everything this claim entails (more general claims).
  function ancestors(claims, id) {
    const byId = indexById(claims);
    const out = new Set();
    const stack = [...((byId.get(id) || {}).entails || [])];
    while (stack.length) {
      const cur = stack.pop();
      if (out.has(cur) || !byId.has(cur)) continue;
      out.add(cur);
      stack.push(...((byId.get(cur).entails) || []));
    }
    return out;
  }

  // Transitive closure downward: everything that depends on this claim.
  function descendants(claims, id) {
    const kids = childrenMap(claims);
    const out = new Set();
    const stack = [...(kids.get(id) || [])];
    while (stack.length) {
      const cur = stack.pop();
      if (out.has(cur)) continue;
      out.add(cur);
      stack.push(...(kids.get(cur) || []));
    }
    return out;
  }

  // A theory's full claim set: its specific claims plus everything they entail.
  function theoryFullClaims(claims, theory) {
    const out = new Set(theory.claims || []);
    for (const c of (theory.claims || [])) {
      for (const a of ancestors(claims, c)) out.add(a);
    }
    return out;
  }

  // --- Quiz state -----------------------------------------------------------
  // state = { answers: { claimId: 'yes' | 'no' }, skipped: { claimId: true } }
  // A skipped claim stays undecided (it still counts as "open" in scoring)
  // but is never asked again.

  function newQuiz() {
    return { answers: {}, skipped: {} };
  }

  // Claims affirmed: every 'yes' answer plus all of its ancestors.
  function affirmed(claims, state) {
    const out = new Set();
    for (const [id, a] of Object.entries(state.answers)) {
      if (a !== 'yes') continue;
      out.add(id);
      for (const anc of ancestors(claims, id)) out.add(anc);
    }
    return out;
  }

  // Claims rejected: every 'no' answer plus all of its descendants.
  function rejected(claims, state) {
    const out = new Set();
    for (const [id, a] of Object.entries(state.answers)) {
      if (a !== 'no') continue;
      out.add(id);
      for (const d of descendants(claims, id)) out.add(d);
    }
    return out;
  }

  function undecided(claims, state) {
    const aff = affirmed(claims, state);
    const rej = rejected(claims, state);
    return claims.map(c => c.id).filter(id => !aff.has(id) && !rej.has(id));
  }

  // How many claims would an answer to `id` settle?
  // yes -> itself + undecided ancestors; no -> itself + undecided descendants.
  function coverage(claims, state, id) {
    const both = coverageBoth(claims, state, id);
    return Math.max(both.yes, both.no);
  }

  // Per-direction coverage, so the UI can say honestly what each answer does.
  function coverageBoth(claims, state, id) {
    const und = new Set(undecided(claims, state));
    let ancCount = 0, descCount = 0;
    for (const a of ancestors(claims, id)) if (und.has(a)) ancCount++;
    for (const d of descendants(claims, id)) if (und.has(d)) descCount++;
    return { yes: ancCount + 1, no: descCount + 1 };
  }

  // Greedy: the undecided, unskipped claim with the highest coverage.
  // Ties -> stable id order.
  // On a completely fresh quiz (no answers or skips yet), prefer a claim
  // flagged `opener: true` — a gentler first question than the raw
  // highest-coverage claim (which is the hardest metaphysical question).
  function nextQuestion(claims, state) {
    const skipped = state.skipped || {};
    const fresh = Object.keys(state.answers || {}).length === 0 &&
      Object.keys(skipped).length === 0;
    const byId = indexById(claims);
    const und = undecided(claims, state).filter(id => !skipped[id]);
    if (!und.length) return null;
    let pool = und;
    if (fresh) {
      const openers = und.filter(id => (byId.get(id) || {}).opener);
      if (openers.length) pool = openers;
    }
    let best = pool[0], bestCov = -1;
    for (const id of pool) {
      const cov = coverage(claims, state, id);
      if (cov > bestCov) { bestCov = cov; best = id; }
    }
    return { id: best, coverage: bestCov };
  }

  function answer(state, id, yesNo) {
    if (yesNo !== 'yes' && yesNo !== 'no') throw new Error('answer must be yes or no');
    state.answers[id] = yesNo;
    return state;
  }

  function undo(state, id) {
    delete state.answers[id];
    if (state.skipped) delete state.skipped[id];
    return state;
  }

  function skip(state, id) {
    if (!state.skipped) state.skipped = {};
    state.skipped[id] = true;
    return state;
  }

  function unskip(state, id) {
    if (state.skipped) delete state.skipped[id];
    return state;
  }

  // Per-theory alignment: how many of its full claim set are affirmed / rejected.
  // A claim affirmed AND rejected (only possible by answering inconsistently
  // outside the quiz flow) counts as conflict and is reported, not scored.
  function score(claims, theories, state) {
    const aff = affirmed(claims, state);
    const rej = rejected(claims, state);
    return theories.map(t => {
      const full = theoryFullClaims(claims, t);
      let agreed = 0, disagreed = 0, conflict = 0;
      for (const id of full) {
        const a = aff.has(id), r = rej.has(id);
        if (a && r) conflict++;
        else if (a) agreed++;
        else if (r) disagreed++;
      }
      return {
        theory: t, total: full.size, agreed, disagreed,
        open: full.size - agreed - disagreed - conflict, conflict
      };
    }).sort((x, y) => (y.agreed - x.agreed) || (x.disagreed - y.disagreed) || (x.theory.id - y.theory.id));
  }

  // Pairs of affirmed claims that directly contradict each other, from the
  // claims' `contradicts` lists. The quiz measures alignment, not
  // consistency, so these are reported gently, never scored.
  function contradictions(claims, state) {
    const aff = affirmed(claims, state);
    const byId = indexById(claims);
    const seen = new Set();
    const out = [];
    for (const id of aff) {
      for (const other of ((byId.get(id) || {}).contradicts || [])) {
        if (!aff.has(other)) continue;
        const key = [id, other].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        out.push([id, other]);
      }
    }
    return out;
  }

  // --- Audit ---------------------------------------------------------------
  // Returns a list of problems: dangling entails refs, cycles, dangling theory refs.
  function validate(claims, theories) {
    const problems = [];
    const byId = indexById(claims);
    for (const c of claims) {
      for (const p of (c.entails || [])) {
        if (!byId.has(p)) problems.push(`claim ${c.id} entails unknown claim ${p}`);
      }
      for (const q of (c.contradicts || [])) {
        if (!byId.has(q)) problems.push(`claim ${c.id} contradicts unknown claim ${q}`);
        else if (q === c.id) problems.push(`claim ${c.id} contradicts itself`);
      }
    }
    // Cycle detection (DFS on child -> parent edges).
    const visiting = new Set(), done = new Set();
    function visit(id, path) {
      if (done.has(id)) return;
      if (visiting.has(id)) {
        problems.push(`cycle detected: ${[...path, id].join(' -> ')}`);
        return;
      }
      visiting.add(id);
      for (const p of ((byId.get(id) || {}).entails || [])) visit(p, [...path, id]);
      visiting.delete(id);
      done.add(id);
    }
    for (const c of claims) visit(c.id, []);
    for (const t of theories) {
      for (const c of (t.claims || [])) {
        if (!byId.has(c)) problems.push(`theory ${t.name} lists unknown claim ${c}`);
      }
    }
    return problems;
  }

  const api = {
    ancestors, descendants, theoryFullClaims,
    newQuiz, affirmed, rejected, undecided, coverage, coverageBoth,
    nextQuestion, answer, undo, skip, unskip, score, validate,
    contradictions
  };

  api.bound = function () {
    const claims = root.CLAIMS || [];
    const theories = root.CLAIM_THEORIES || [];
    return {
      claims,
      theories,
      ancestors: (id) => api.ancestors(claims, id),
      descendants: (id) => api.descendants(claims, id),
      theoryFullClaims: (t) => api.theoryFullClaims(claims, t),
      newQuiz: () => api.newQuiz(),
      affirmed: (state) => api.affirmed(claims, state),
      rejected: (state) => api.rejected(claims, state),
      undecided: (state) => api.undecided(claims, state),
      coverage: (state, id) => api.coverage(claims, state, id),
      coverageBoth: (state, id) => api.coverageBoth(claims, state, id),
      nextQuestion: (state) => api.nextQuestion(claims, state),
      answer: (state, id, yesNo) => api.answer(state, id, yesNo),
      undo: (state, id) => api.undo(state, id),
      skip: (state, id) => api.skip(state, id),
      unskip: (state, id) => api.unskip(state, id),
      score: (state) => api.score(claims, theories, state),
      contradictions: (state) => api.contradictions(claims, state),
      validate: () => api.validate(claims, theories)
    };
  };

  root.ClaimsEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
