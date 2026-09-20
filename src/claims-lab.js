/* Claims lab UI: claim DAG, theory explorer, and DAG-driven quiz. */
(function () {
  'use strict';

  function init() {
    if (!window.ClaimsEngine || !window.CLAIMS) return;
    const E = window.ClaimsEngine.bound();
    const $ = (id) => document.getElementById(id);
    const claimById = new Map(E.claims.map(c => [c.id, c]));
    const theoryById = new Map(E.theories.map(t => [t.id, t]));
    const shortLabels = {
      c0: 'Ordinary physics is enough', c1: 'Everything is mind',
      c2: 'Matter is mind seen outside', c3: 'One cosmic mind',
      c4: 'Many conscious agents', c5: 'Perception is an interface',
      c6: 'Mind is nonphysical', c7: 'Self can outlive the body',
      c8: 'Mind can affect the brain', c9: 'Experience is fundamental',
      c10: 'Physical causes are closed', c11: 'Zombies are conceivable',
      c12: 'Experience is causal structure', c13: 'Integrated structure matters',
      c14: 'Simulation is not consciousness'
    };

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }
    function claimChip(id, extra) {
      const c = claimById.get(id);
      return `<button class="lab-claim-chip${extra ? ' ' + extra : ''}" data-claim="${id}" title="${escapeHtml(c.text)}">${id}</button>`;
    }

    /* ---------------- three views ---------------- */
    const views = {
      quiz: { tab: $('labTabQuiz'), pane: $('labQuiz') },
      claims: { tab: $('labTabClaims'), pane: $('labClaims') },
      theories: { tab: $('labTabTheories'), pane: $('labTheories') }
    };
    function showTab(which) {
      Object.entries(views).forEach(([name, view]) => {
        const active = name === which;
        view.tab.classList.toggle('active', active);
        view.pane.classList.toggle('hidden', !active);
        view.tab.setAttribute('aria-selected', String(active));
        view.tab.tabIndex = active ? 0 : -1;
      });
      if (which === 'claims') requestAnimationFrame(drawEdges);
    }
    Object.entries(views).forEach(([name, view]) => view.tab.addEventListener('click', () => showTab(name)));

    /* ---------------- claim-focused DAG ---------------- */
    const graph = $('labClaimGraph');
    const claimDetail = $('labClaimDetail');
    let selectedClaim = null;
    let components = [];

    function directChildren(id) {
      return E.claims.filter(c => (c.entails || []).includes(id)).map(c => c.id);
    }

    function weakComponents() {
      const unseen = new Set(E.claims.map(c => c.id));
      const out = [];
      while (unseen.size) {
        const start = unseen.values().next().value;
        const ids = [];
        const stack = [start];
        unseen.delete(start);
        while (stack.length) {
          const id = stack.pop();
          ids.push(id);
          const neighbors = [...(claimById.get(id).entails || []), ...directChildren(id)];
          neighbors.forEach(n => { if (unseen.delete(n)) stack.push(n); });
        }
        out.push(ids);
      }
      return out;
    }

    function rankInComponent(id, memo) {
      if (memo.has(id)) return memo.get(id);
      const parents = claimById.get(id).entails || [];
      const rank = parents.length ? 1 + Math.max(...parents.map(p => rankInComponent(p, memo))) : 0;
      memo.set(id, rank);
      return rank;
    }

    function renderGraph() {
      const memo = new Map();
      components = weakComponents().map((ids, componentIndex) => {
        const levels = new Map();
        ids.forEach(id => {
          const rank = rankInComponent(id, memo);
          if (!levels.has(rank)) levels.set(rank, []);
          levels.get(rank).push(id);
        });
        const maxRank = Math.max(...levels.keys());
        const height = 28 + (maxRank + 1) * 88;
        const component = document.createElement('div');
        component.className = 'dag-component';
        component.style.height = `${height}px`;
        component.dataset.component = String(componentIndex);
        component.innerHTML = `<svg aria-hidden="true"><defs><marker id="dagArrow${componentIndex}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#49615f"></path></marker></defs></svg>`;
        levels.forEach((levelIds, rank) => {
          levelIds.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          levelIds.forEach((id, index) => {
            const claim = claimById.get(id);
            const button = document.createElement('button');
            button.className = `dag-node${rank === 0 ? ' root' : ''}`;
            button.dataset.claim = id;
            button.style.left = `${((index + 0.5) / levelIds.length) * 100}%`;
            button.style.top = `${18 + rank * 88}px`;
            button.title = claim.text;
            button.setAttribute('aria-label', `${id}: ${claim.text}`);
            button.innerHTML = `<span class="dag-node-id">${id}</span><span class="dag-node-label">${escapeHtml(shortLabels[id] || claim.text)}</span>`;
            component.appendChild(button);
          });
        });
        graph.appendChild(component);
        return { element: component, ids, index: componentIndex };
      });
    }

    function drawEdges() {
      components.forEach(component => {
        const box = component.element.getBoundingClientRect();
        if (!box.width) return;
        const svg = component.element.querySelector('svg');
        svg.querySelectorAll('.dag-edge').forEach(edge => edge.remove());
        component.ids.forEach(id => {
          const child = component.element.querySelector(`[data-claim="${id}"]`);
          (claimById.get(id).entails || []).forEach(parentId => {
            const parent = component.element.querySelector(`[data-claim="${parentId}"]`);
            if (!child || !parent) return;
            const cb = child.getBoundingClientRect();
            const pb = parent.getBoundingClientRect();
            const x1 = cb.left + cb.width / 2 - box.left;
            const y1 = cb.top - box.top;
            const x2 = pb.left + pb.width / 2 - box.left;
            const y2 = pb.bottom - box.top + 2;
            const mid = y1 - Math.max(12, (y1 - y2) / 2);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'dag-edge');
            path.setAttribute('d', `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`);
            path.setAttribute('marker-end', `url(#dagArrow${component.index})`);
            svg.appendChild(path);
          });
        });
      });
    }

    function renderClaimDetail(id) {
      const c = claimById.get(id);
      if (!c) return;
      selectedClaim = id;
      graph.querySelectorAll('.dag-node').forEach(n => n.classList.toggle('selected', n.dataset.claim === id));
      const parents = c.entails || [];
      const children = directChildren(id);
      const affirming = E.theories.filter(t => E.theoryFullClaims(t).has(id));
      claimDetail.innerHTML = `
        <p class="micro">Claim ${id}</p>
        <h3 class="lab-claim-title">${escapeHtml(c.text)}</h3>
        <p class="lab-plain">Put simply: ${escapeHtml(c.plain)}</p>
        <div class="claim-detail-groups">
          <div>
            <p class="micro">This directly entails</p>
            ${parents.length ? `<div class="lab-chip-row">${parents.map(p => claimChip(p)).join('')}</div>` : '<p class="lab-empty">Nothing — this is a base claim.</p>'}
          </div>
          <div>
            <p class="micro">Claims directly built on this</p>
            ${children.length ? `<div class="lab-chip-row">${children.map(child => claimChip(child)).join('')}</div>` : '<p class="lab-empty">Nothing depends directly on it yet.</p>'}
          </div>
          <div>
            <p class="micro">Theories affirming this</p>
            <div class="lab-chip-row">${affirming.map(t => {
              const direct = (t.claims || []).includes(id);
              return `<button class="lab-theory-chip${direct ? ' direct' : ''}" data-theory="${t.id}" title="${direct ? 'Listed directly' : 'Inherited through entailment'}">${escapeHtml(t.name)}${direct ? '' : ' · inherited'}</button>`;
            }).join('') || '<p class="lab-empty">None of the five prototype theories.</p>'}</div>
          </div>
        </div>`;
    }

    graph.addEventListener('click', (e) => {
      const node = e.target.closest('[data-claim]');
      if (!node) return;
      renderClaimDetail(node.dataset.claim);
      claimDetail.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    });
    claimDetail.addEventListener('click', (e) => {
      const claim = e.target.closest('[data-claim]');
      const theory = e.target.closest('[data-theory]');
      if (claim) renderClaimDetail(claim.dataset.claim);
      else if (theory) {
        showTab('theories');
        theoryNav = [{ kind: 'theory', id: Number(theory.dataset.theory) }];
        renderTheoryNav();
      }
    });

    renderGraph();
    requestAnimationFrame(drawEdges);
    if ('ResizeObserver' in window) new ResizeObserver(drawEdges).observe(graph);
    else window.addEventListener('resize', drawEdges);

    /* ---------------- theory explorer ---------------- */
    const theoryList = $('labTheoryList');
    const detail = $('labDetail');
    let theoryNav = [];

    function renderTheoryList() {
      theoryList.innerHTML = E.theories.map(t =>
        `<button class="lab-theory-btn" data-theory="${t.id}">
          <strong>${escapeHtml(t.name)}</strong>
          <span>${escapeHtml(t.family)} · ${t.claims.length} specific claim${t.claims.length === 1 ? '' : 's'}</span>
        </button>`
      ).join('');
    }
    function viaWhich(theory, inheritedId) {
      return (theory.claims || []).filter(sid => sid !== inheritedId && E.ancestors(sid).has(inheritedId));
    }
    function renderTheory(id) {
      const t = theoryById.get(id);
      if (!t) return;
      const full = E.theoryFullClaims(t);
      const direct = new Set(t.claims);
      const inherited = [...full].filter(x => !direct.has(x));
      theoryList.querySelectorAll('.lab-theory-btn').forEach(b => b.classList.toggle('active', Number(b.dataset.theory) === id));
      detail.innerHTML = `
        <p class="micro">Theory · ${escapeHtml(t.family)}</p>
        <h3>${escapeHtml(t.name)}</h3>
        <p class="micro">Specific claims (listed by the theory)</p>
        <div class="lab-chip-row">${[...direct].map(cid => claimChip(cid, 'direct')).join('')}</div>
        ${inherited.length ? `<p class="micro">Inherited claims (entailed by the specific ones)</p><div class="lab-chip-row">${inherited.map(cid => `<span class="lab-inherited-wrap">${claimChip(cid)}<small>via ${viaWhich(t, cid).join(', ')}</small></span>`).join('')}</div>` : ''}
        <div class="lab-claim-texts">${[...full].map(cid => {
          const claim = claimById.get(cid);
          return `<div class="lab-claim-text${direct.has(cid) ? ' direct' : ''}"><span class="lab-claim-id">${cid}${direct.has(cid) ? '' : ' · inherited'}</span><p>${escapeHtml(claim.text)}</p></div>`;
        }).join('')}</div>`;
    }
    function renderTheoryClaim(id) {
      const c = claimById.get(id);
      if (!c) return;
      const ancestors = [...E.ancestors(id)];
      const descendants = [...E.descendants(id)];
      const affirming = E.theories.filter(t => E.theoryFullClaims(t).has(id));
      detail.innerHTML = `
        <p class="micro">Claim ${id}</p>
        <h3 class="lab-claim-title">${escapeHtml(c.text)}</h3>
        <p class="lab-plain">Put simply: ${escapeHtml(c.plain)}</p>
        <div class="lab-claim-cols"><div><p class="micro">All claims this entails</p>${ancestors.length ? `<div class="lab-chip-row">${ancestors.map(a => claimChip(a)).join('')}</div>` : '<p class="lab-empty">Nothing — this is a base claim.</p>'}</div><div><p class="micro">Everything built on this</p>${descendants.length ? `<div class="lab-chip-row">${descendants.map(d => claimChip(d)).join('')}</div>` : '<p class="lab-empty">Nothing depends on this yet.</p>'}</div></div>
        <p class="micro">Theories affirming this claim</p><div class="lab-chip-row">${affirming.map(t => `<button class="lab-theory-chip${(t.claims || []).includes(id) ? ' direct' : ''}" data-theory="${t.id}">${escapeHtml(t.name)}${(t.claims || []).includes(id) ? '' : ' · inherited'}</button>`).join('') || '<p class="lab-empty">None of the prototype theories.</p>'}</div>`;
    }
    function renderTheoryNav() {
      const current = theoryNav[theoryNav.length - 1];
      $('labBack').classList.toggle('hidden', theoryNav.length <= 1);
      if (!current) {
        detail.innerHTML = '<p class="lab-empty">Pick a theory on the left to inspect its specific and inherited claims.</p>';
        theoryList.querySelectorAll('.lab-theory-btn').forEach(b => b.classList.remove('active'));
      } else if (current.kind === 'theory') renderTheory(current.id);
      else renderTheoryClaim(current.id);
    }
    detail.addEventListener('click', (e) => {
      const claim = e.target.closest('[data-claim]');
      const theory = e.target.closest('[data-theory]');
      if (claim) theoryNav.push({ kind: 'claim', id: claim.dataset.claim });
      else if (theory) theoryNav.push({ kind: 'theory', id: Number(theory.dataset.theory) });
      else return;
      renderTheoryNav();
    });
    theoryList.addEventListener('click', (e) => {
      const b = e.target.closest('[data-theory]');
      if (!b) return;
      theoryNav = [{ kind: 'theory', id: Number(b.dataset.theory) }];
      renderTheoryNav();
    });
    $('labBack').addEventListener('click', () => { theoryNav.pop(); renderTheoryNav(); });
    renderTheoryList();
    renderTheoryNav();

    /* ---------------- DAG-driven quiz ---------------- */
    const qStart = $('labQuizStart');
    const qMain = $('labQuizMain');
    const qResult = $('labQuizResult');
    let qstate = null;
    let qhistory = [];

    function startQuiz() {
      qstate = E.newQuiz();
      qhistory = [];
      qStart.classList.add('hidden');
      qResult.classList.add('hidden');
      qMain.classList.remove('hidden');
      renderQuestion();
    }

    function currentQuestion() {
      return E.nextQuestion(qstate);
    }

    function renderQuestion() {
      const q = currentQuestion();
      if (!q) {
        renderResults();
        return;
      }
      const claim = claimById.get(q.id);
      $('labQCount').textContent = String(qhistory.length + 1).padStart(2, '0');
      $('labQText').textContent = claim.text;
      $('labQPlain').textContent = claim.plain;
      $('labQCoverage').textContent = `Answering settles ${q.coverage} claim${q.coverage === 1 ? '' : 's'} — the most informative question right now.`;
      $('labQBack').classList.toggle('hidden', qhistory.length === 0);
      renderScores();
    }

    function answerQuestion(yesNo) {
      const q = currentQuestion();
      if (!q) return;
      E.answer(qstate, q.id, yesNo);
      qhistory.push(q.id);
      renderQuestion();
    }

    function renderScores() {
      $('labScores').innerHTML = E.score(qstate).map(result => {
        const pct = result.total ? Math.round(100 * result.agreed / result.total) : 0;
        return `<div class="lab-score-row">
          <div class="lab-score-top"><strong>${escapeHtml(result.theory.name)}</strong><span>${result.agreed} of ${result.total}</span></div>
          <div class="lab-score-bar"><span style="width:${pct}%"></span></div>
          ${result.disagreed ? `<small>${result.disagreed} rejected</small>` : ''}
        </div>`;
      }).join('');
    }

    function renderResults() {
      qMain.classList.add('hidden');
      qResult.classList.remove('hidden');
      $('labResultList').innerHTML = E.score(qstate).map((result, index) => `
        <div class="lab-result-row${index === 0 ? ' top' : ''}">
          <span class="lab-result-rank">${index + 1}</span>
          <div><strong>${escapeHtml(result.theory.name)}</strong>
          <p>You agree with ${result.agreed} of its ${result.total} claims${result.disagreed ? `, and reject ${result.disagreed}` : ''}.</p></div>
        </div>`).join('');
    }

    $('labQuizBegin').addEventListener('click', startQuiz);
    $('labQuizRestart').addEventListener('click', startQuiz);
    $('labAgree').addEventListener('click', () => answerQuestion('yes'));
    $('labDisagree').addEventListener('click', () => answerQuestion('no'));
    $('labQBack').addEventListener('click', () => {
      const last = qhistory.pop();
      if (last) E.undo(qstate, last);
      renderQuestion();
    });

    showTab('quiz');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
