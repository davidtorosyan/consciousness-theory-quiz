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
  // state = { answers: { claimId: 'yes' | 'no' } }

  function newQuiz() {
    return { answers: {} };
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
    const und = new Set(undecided(claims, state));
    let ancCount = 0, descCount = 0;
    for (const a of ancestors(claims, id)) if (und.has(a)) ancCount++;
    for (const d of descendants(claims, id)) if (und.has(d)) descCount++;
    return Math.max(ancCount, descCount) + 1;
  }

  // Greedy: the undecided claim with the highest coverage. Ties -> stable id order.
  function nextQuestion(claims, state) {
    const und = undecided(claims, state);
    if (!und.length) return null;
    let best = und[0], bestCov = -1;
    for (const id of und) {
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

  // --- Audit ---------------------------------------------------------------
  // Returns a list of problems: dangling entails refs, cycles, dangling theory refs.
  function validate(claims, theories) {
    const problems = [];
    const byId = indexById(claims);
    for (const c of claims) {
      for (const p of (c.entails || [])) {
        if (!byId.has(p)) problems.push(`claim ${c.id} entails unknown claim ${p}`);
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
    newQuiz, affirmed, rejected, undecided, coverage,
    nextQuestion, answer, undo, score, validate
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
      nextQuestion: (state) => api.nextQuestion(claims, state),
      answer: (state, id, yesNo) => api.answer(state, id, yesNo),
      undo: (state, id) => api.undo(state, id),
      score: (state) => api.score(claims, theories, state),
      validate: () => api.validate(claims, theories)
    };
  };

  root.ClaimsEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
