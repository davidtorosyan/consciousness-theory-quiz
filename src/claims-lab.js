/* Claims lab UI: claim DAG, theory explorer, and DAG-driven quiz. */
(function () {
  'use strict';

  function init() {
    const $ = (id) => document.getElementById(id);
    // Defensive boot: if the HTML and JS versions disagree (e.g. a deploy
    // landing mid-reload), say so plainly instead of dying silently.
    const need = ['labQuizStart', 'labQuizMain', 'labQuizResult', 'labQuizBegin', 'labQuizRestart',
      'labAgree', 'labDisagree', 'labSkip', 'labQBack', 'labQText', 'labQPlain', 'labQCount',
      'labQCoverage', 'labSettled', 'labSettledBy', 'labScores', 'labResultList', 'labClaimGraph',
      'labClaimDetail', 'labTheoryList', 'labDetail', 'labBack', 'labTabClaims', 'labTabTheories',
      'labClaims', 'labTheories', 'quizCountLine', 'exploreDek', 'updateBanner', 'updateReload'];
    if (!window.ClaimsEngine || !window.CLAIMS || need.some(id => !$(id))) {
      const el = $('quizCountLine') || $('labQuizStart');
      if (el) el.textContent = 'The site just updated — please reload the page to get the latest version.';
      return;
    }
    const E = window.ClaimsEngine.bound();
    // Freshness check: the HTML shell can lag behind deploys (CDN cache), so
    // ask the server what the latest build is and offer a reload if newer.
    try {
      fetch('version.json?fresh=' + Date.now()).then(r => r.json()).then(v => {
        if (v && typeof v.build === 'number' && v.build > (window.SITE_BUILD || 0)) {
          $('updateBanner').classList.remove('hidden');
        }
      }).catch(() => {});
    } catch (e) { /* offline or file:// — stay quiet */ }
    $('updateReload').addEventListener('click', () => location.reload());
    const claimById = new Map(E.claims.map(c => [c.id, c]));
    const theoryById = new Map(E.theories.map(t => [t.id, t]));
    const META_THEORIES = window.THEORIES_120 || [];
    const META_LINKS = window.THEORY_LINKS_120 || {};
    const metaById = new Map(META_THEORIES.map(t => [t.id, t]));
    const claimTheoryIds = new Set(E.theories.map(t => t.id));
    const shortLabel = (c) => c.short || c.text;

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }
    function claimChip(id, extra) {
      const c = claimById.get(id);
      return `<button class="lab-claim-chip${extra ? ' ' + extra : ''}" data-claim="${id}" title="${escapeHtml(c.text)}">${id}</button>`;
    }

    /* ---------------- explorer views (quiz lives above, always visible) ---------------- */
    const views = {
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
            button.innerHTML = `<span class="dag-node-id">${id}</span><span class="dag-node-label">${escapeHtml(shortLabel(claim))}</span>`;
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
            <p class="micro">↑ What this implies (broader claims)</p>
            ${parents.length ? `<div class="lab-chip-row">${parents.map(p => claimChip(p)).join('')}</div>` : '<p class="lab-empty">Nothing — this is a base claim.</p>'}
          </div>
          <div>
            <p class="micro">↓ What implies this (more specific claims)</p>
            ${children.length ? `<div class="lab-chip-row">${children.map(child => claimChip(child)).join('')}</div>` : '<p class="lab-empty">Nothing depends directly on it yet.</p>'}
          </div>
          <div>
            <p class="micro">Theories affirming this</p>
            <div class="lab-chip-row">${affirming.map(t => {
              const direct = (t.claims || []).includes(id);
              return `<button class="lab-theory-chip${direct ? ' direct' : ''}" data-theory="${t.id}" title="${direct ? 'Listed directly' : 'Inherited through entailment'}">${escapeHtml(t.name)}${direct ? '' : ' · inherited'}</button>`;
            }).join('') || ('<p class="lab-empty">None of the ' + E.theories.length + ' theories with claims.</p>')}</div>
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
      const withClaims = E.theories.map(t =>
        `<button class="lab-theory-btn" data-theory="${t.id}">
          <strong>${escapeHtml(t.name)}</strong>
          <span>${escapeHtml(t.family)} · ${t.claims.length} specific claim${t.claims.length === 1 ? '' : 's'}</span>
        </button>`
      ).join('');
      const pending = META_THEORIES.filter(t => !claimTheoryIds.has(t.id)).map(t =>
        `<button class="lab-theory-btn lab-theory-pending" data-meta="${t.id}">
          <strong>${escapeHtml(t.name)}</strong>
          <span>${escapeHtml(t.category)} · claims in progress</span>
        </button>`
      ).join('');
      theoryList.innerHTML = withClaims +
        (pending ? `<p class="lab-theory-group">More theories — claims in progress</p>${pending}` : '');
    }
    function viaWhich(theory, inheritedId) {
      return (theory.claims || []).filter(sid => sid !== inheritedId && E.ancestors(sid).has(inheritedId));
    }
    function renderTheory(id) {
      const t = theoryById.get(id);
      if (!t) return;
      const meta = metaById.get(id);
      const link = META_LINKS[id];
      const full = E.theoryFullClaims(t);
      const direct = new Set(t.claims);
      const inherited = [...full].filter(x => !direct.has(x));
      theoryList.querySelectorAll('.lab-theory-btn').forEach(b => b.classList.toggle('active', Number(b.dataset.theory) === id));
      detail.innerHTML = `
        <p class="micro">Theory · ${escapeHtml(t.family)}</p>
        <h3>${escapeHtml(t.name)}</h3>
        ${meta ? `<p class="lab-plain">${escapeHtml(meta.summary)}</p>` : ''}
        ${link ? `<p class="source-note"><a href="${escapeHtml(link)}" target="_blank" rel="noopener">Read the original Closer to Truth entry ↗</a></p>` : ''}
        <p class="micro">Specific claims (listed by the theory)</p>
        <div class="lab-chip-row">${[...direct].map(cid => claimChip(cid, 'direct')).join('')}</div>
        ${inherited.length ? `<p class="micro">Inherited claims (entailed by the specific ones)</p><div class="lab-chip-row">${inherited.map(cid => `<span class="lab-inherited-wrap">${claimChip(cid)}<small>via ${viaWhich(t, cid).join(', ')}</small></span>`).join('')}</div>` : ''}
        <div class="lab-claim-texts">${[...full].map(cid => {
          const claim = claimById.get(cid);
          return `<div class="lab-claim-text${direct.has(cid) ? ' direct' : ''}"><span class="lab-claim-id">${cid}${direct.has(cid) ? '' : ' · inherited'}</span><p>${escapeHtml(claim.text)}</p><p class="lab-claim-plain">Put simply: ${escapeHtml(claim.plain)}</p></div>`;
        }).join('')}</div>`;
    }
    function renderMeta(id) {
      const t = metaById.get(id);
      if (!t) return;
      const link = META_LINKS[id];
      theoryList.querySelectorAll('.lab-theory-btn').forEach(b => b.classList.toggle('active', Number(b.dataset.meta) === id));
      detail.innerHTML = `
        <p class="micro">Theory · ${escapeHtml(t.category)}</p>
        <h3>${escapeHtml(t.name)}</h3>
        <p class="lab-plain">${escapeHtml(t.summary)}</p>
        <div class="result-block"><h3>The distinctive move</h3><p>${escapeHtml(t.signature)}</p></div>
        <div class="result-block"><h3>Another defining claim</h3><p>${escapeHtml(t.detail)}</p></div>
        ${link ? `<p class="source-note"><a href="${escapeHtml(link)}" target="_blank" rel="noopener">Read the original Closer to Truth entry ↗</a></p>` : ''}
        <p class="lab-empty">Claims for this theory are in progress — check back as the map grows.</p>`;
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
        <p class="micro">Theories affirming this claim</p><div class="lab-chip-row">${affirming.map(t => `<button class="lab-theory-chip${(t.claims || []).includes(id) ? ' direct' : ''}" data-theory="${t.id}">${escapeHtml(t.name)}${(t.claims || []).includes(id) ? '' : ' · inherited'}</button>`).join('') || ('<p class="lab-empty">None of the ' + E.theories.length + ' theories with claims.</p>')}</div>`;
    }
    function renderTheoryNav() {
      const current = theoryNav[theoryNav.length - 1];
      $('labBack').classList.toggle('hidden', theoryNav.length <= 1);
      if (!current) {
        detail.innerHTML = '<p class="lab-empty">Pick a theory on the left to inspect its specific and inherited claims.</p>';
        theoryList.querySelectorAll('.lab-theory-btn').forEach(b => b.classList.remove('active'));
      } else if (current.kind === 'theory') renderTheory(current.id);
      else if (current.kind === 'meta') renderMeta(current.id);
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
      const m = e.target.closest('[data-meta]');
      if (b) theoryNav = [{ kind: 'theory', id: Number(b.dataset.theory) }];
      else if (m) theoryNav = [{ kind: 'meta', id: Number(m.dataset.meta) }];
      else return;
      renderTheoryNav();
    });
    $('labBack').addEventListener('click', () => { theoryNav.pop(); renderTheoryNav(); });

    function selectTheory(id) {
      showTab('theories');
      theoryNav = [{ kind: 'theory', id }];
      renderTheoryNav();
      $('labTheories').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
    renderTheoryList();
    renderTheoryNav();

    /* ---------------- claim-driven quiz ---------------- */
    const qStart = $('labQuizStart');
    const qMain = $('labQuizMain');
    const qResult = $('labQuizResult');
    let qstate = null;
    let qhistory = [];
    let lastSettledIds = [];
    let lastSettledDir = null; // 'yes' when the last answer affirmed, 'no' when it rejected

    // Dynamic intro copy: counts come from the data, never hardcoded.
    $('quizCountLine').textContent = `${E.claims.length} claims · ${E.theories.length} theories`;
    $('exploreDek').textContent = `${E.claims.length} claims, each linked to the broader claims it entails — general claims at the top, specific ones below. ${E.theories.length} theories mapped so far; ${META_THEORIES.length - E.theories.length} more on the way. Tap anything to inspect it.`;
    graph.setAttribute('aria-label', `Graph of ${E.claims.length} consciousness claims`);

    function startQuiz() {
      qstate = E.newQuiz();
      qhistory = [];
      lastSettledIds = [];
      lastSettledDir = null;
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
      $('labQPlain').textContent = `Put simply: ${claim.plain}`;
      const both = E.coverageBoth(qstate, q.id);
      $('labQCoverage').textContent = `Agreeing settles ${both.yes} claim${both.yes === 1 ? '' : 's'} · disagreeing settles ${both.no} — the most informative question right now.`;
      const affN = E.affirmed(qstate).size;
      const rejN = E.rejected(qstate).size;
      $('labSettled').textContent = (affN + rejN)
        ? `Settled so far: ${affN} agreed · ${rejN} rejected · ${E.claims.length - affN - rejN} open`
        : '';
      $('labQBack').classList.toggle('hidden', qhistory.length === 0);
      renderSettledBy();
      renderScores();
    }

    function renderSettledBy() {
      const el = $('labSettledBy');
      if (lastSettledDir === 'skip') { el.textContent = 'Skipped — nothing settled.'; return; }
      if (!lastSettledIds.length) { el.textContent = 'That settles just this claim.'; return; }
      const labels = lastSettledIds.map(id => {
        const c = claimById.get(id);
        return c ? c.plain : id;
      }).join(' · ');
      el.textContent = lastSettledDir === 'no'
        ? `That also ruled out: ${labels} — they were built on the claim you rejected.`
        : `That also settled: ${labels} — they follow from the claim you agreed with.`;
    }

    function answerQuestion(yesNo) {
      const q = currentQuestion();
      if (!q) return;
      const before = new Set([...E.affirmed(qstate), ...E.rejected(qstate)]);
      E.answer(qstate, q.id, yesNo);
      qhistory.push({ id: q.id, action: 'answer' });
      lastSettledIds = [...E.affirmed(qstate), ...E.rejected(qstate)]
        .filter(id => !before.has(id) && id !== q.id);
      lastSettledDir = yesNo;
      renderQuestion();
    }

    function skipQuestion() {
      const q = currentQuestion();
      if (!q) return;
      E.skip(qstate, q.id);
      qhistory.push({ id: q.id, action: 'skip' });
      lastSettledIds = [];
      lastSettledDir = 'skip';
      renderQuestion();
    }

    function renderScores() {
      $('labScores').innerHTML = E.score(qstate).map(result => {
        const pct = result.total ? Math.round(100 * result.agreed / result.total) : 0;
        return `<div class="lab-score-row">
          <div class="lab-score-top"><strong>${escapeHtml(result.theory.name)}</strong><span>${result.agreed} of ${result.total}</span></div>
          ${result.theory.blurb ? `<div class="lab-score-blurb">${escapeHtml(result.theory.blurb)}</div>` : ''}
          <div class="lab-score-bar"><span style="width:${pct}%"></span></div>
          ${result.disagreed ? `<small>${result.disagreed} rejected</small>` : ''}
        </div>`;
      }).join('');
    }

    function renderResults() {
      qMain.classList.add('hidden');
      qResult.classList.remove('hidden');
      $('labResultList').innerHTML = E.score(qstate).map((result, index) => {
        const line = (result.agreed === 0 && result.disagreed === 0)
          ? `None of this theory's claims came up in your answers (${result.total} claim${result.total === 1 ? '' : 's'}).`
          : `You agree with ${result.agreed} of its ${result.total} claims${result.disagreed ? `, and reject ${result.disagreed}` : ''}.`;
        return `
        <div class="lab-result-row${index === 0 ? ' top' : ''}">
          <span class="lab-result-rank">${index + 1}</span>
          <div><strong>${escapeHtml(result.theory.name)}</strong>
          ${result.theory.blurb ? `<p class="lab-result-blurb">${escapeHtml(result.theory.blurb)}</p>` : ''}
          <p>${line}</p>
          <button class="text-btn" data-inspect="${result.theory.id}">Inspect this theory’s claims</button></div>
        </div>`;
      }).join('');
    }

    $('labQuizBegin').addEventListener('click', startQuiz);
    $('labQuizRestart').addEventListener('click', startQuiz);
    $('labAgree').addEventListener('click', () => answerQuestion('yes'));
    $('labDisagree').addEventListener('click', () => answerQuestion('no'));
    $('labSkip').addEventListener('click', skipQuestion);
    $('labResultList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-inspect]');
      if (b) selectTheory(Number(b.dataset.inspect));
    });
    $('labQBack').addEventListener('click', () => {
      const last = qhistory.pop();
      if (!last) return;
      if (last.action === 'skip') E.unskip(qstate, last.id);
      else E.undo(qstate, last.id);
      lastSettledIds = [];
      lastSettledDir = null;
      renderQuestion();
    });

    showTab('claims');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
