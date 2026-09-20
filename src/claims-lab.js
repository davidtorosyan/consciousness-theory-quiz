/* Claims lab UI: claim DAG, theory explorer, and DAG-driven quiz. */
(function () {
  'use strict';

  function init() {
    const $ = (id) => document.getElementById(id);
    // Defensive boot: if the HTML and JS versions disagree (e.g. a deploy
    // landing mid-reload), say so plainly instead of dying silently.
    const need = ['labQuizStart', 'labQuizMain', 'labQuizResult', 'labQuizBegin', 'labQuizRestart', 'labQRestart',
      'labQuizContinue', 'labContinueNote', 'labAgree', 'labDisagree', 'labSkip', 'labQBack', 'labQText', 'labQPlain', 'labQCount',
      'labQCoverage', 'labSettled', 'labSettledBy', 'labTension', 'labScores', 'labResultList', 'labClaimGraph',
      'labQRanking', 'labQuizResume', 'labResultKicker', 'labResultTitle',
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
      return `<button class="lab-claim-chip${extra ? ' ' + extra : ''}" data-claim="${id}" title="${id}: ${escapeHtml(c.text)}">${escapeHtml(shortLabel(c))}</button>`;
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
      if (which === 'claims') requestAnimationFrame(layoutGraph);
    }
    Object.entries(views).forEach(([name, view]) => view.tab.addEventListener('click', () => showTab(name)));

    /* ---------------- claim-focused DAG ---------------- */
    const graph = $('labClaimGraph');
    const claimDetail = $('labClaimDetail');
    let selectedClaim = null;
    let components = [];
    // Fixed px slot geometry: neighbours can never overlap, whatever the
    // viewport. Rows wider than the pane scroll horizontally in .dag-scroll.
    const DAG_MAX_PER_ROW = 6;
    const DAG_NODE_W = 172;
    const DAG_SLOT_W = 188;
    const DAG_ROW_H = 96;
    const DAG_PAD_TOP = 16;

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
        // Wide ranks wrap into multiple rows of at most DAG_MAX_PER_ROW nodes.
        // Every node sits on a fixed-width px slot, so dense levels stay
        // readable instead of stacking on top of each other.
        const rows = [];
        [...levels.keys()].sort((a, b) => a - b).forEach(rank => {
          const levelIds = levels.get(rank);
          levelIds.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          for (let i = 0; i < levelIds.length; i += DAG_MAX_PER_ROW) {
            rows.push({ rank, ids: levelIds.slice(i, i + DAG_MAX_PER_ROW) });
          }
        });
        const scroller = document.createElement('div');
        scroller.className = 'dag-scroll';
        scroller.setAttribute('tabindex', '0');
        scroller.setAttribute('role', 'region');
        // Name the group after its most general claim(s) so the label means
        // something, instead of exposing the internal component index.
        const rootShorts = (levels.get(0) || []).slice(0, 2)
          .map(id => shortLabel(claimById.get(id))).join(' · ');
        scroller.setAttribute('aria-label',
          `Claim group about “${rootShorts}” — ${ids.length} connected claim${ids.length === 1 ? '' : 's'}, scroll sideways to see all`);
        const inner = document.createElement('div');
        inner.className = 'dag-component';
        inner.style.height = `${DAG_PAD_TOP + rows.length * DAG_ROW_H + 12}px`;
        inner.dataset.component = String(componentIndex);
        inner.innerHTML = `<svg aria-hidden="true"><defs><marker id="dagArrow${componentIndex}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#49615f"></path></marker></defs></svg>`;
        const rowLayouts = rows.map(({ rank, ids: rowIds }, row) => {
          const nodes = rowIds.map((id, index) => {
            const claim = claimById.get(id);
            const button = document.createElement('button');
            button.className = `dag-node${rank === 0 ? ' root' : ''}`;
            button.dataset.claim = id;
            button.style.top = `${DAG_PAD_TOP + row * DAG_ROW_H}px`;
            // No title attribute: the aria-label carries the claim. Lead with the
            // short label (the node's visible identifier) so assistive tech
            // gets the same primary label sighted users see, then the full text.
            // data-plain feeds a CSS-only hover tooltip for sighted users, so
            // jargon-y short labels get an in-context plain-language gloss
            // without duplicating anything for assistive tech.
            button.setAttribute('aria-label', `${id}: ${shortLabel(claim)}. ${claim.text}`);
            button.setAttribute('data-plain', `Put simply: ${claim.plain}`);
            button.innerHTML = `<span class="dag-node-id">${id}</span><span class="dag-node-label">${escapeHtml(shortLabel(claim))}</span>`;
            inner.appendChild(button);
            return { el: button, col: index };
          });
          return { width: rowIds.length * DAG_SLOT_W, nodes };
        });
        scroller.appendChild(inner);
        return {
          element: scroller, inner, ids, index: componentIndex, rowLayouts,
          maxRowWidth: Math.max(...rowLayouts.map(r => r.width), DAG_SLOT_W)
        };
      });
      // Biggest clusters first: the map metaphor matters most where it is densest.
      components.sort((a, b) => b.ids.length - a.ids.length);
      components.forEach(c => graph.appendChild(c.element));
    }

    // Centers each row's fixed slots in the available width, then redraws
    // edges. Re-runs on resize and when the tab becomes visible, because a
    // hidden tab reports zero width.
    function layoutGraph() {
      components.forEach(c => {
        const avail = c.element.clientWidth || c.maxRowWidth;
        const target = Math.max(c.maxRowWidth, avail);
        c.inner.style.width = `${target}px`;
        c.rowLayouts.forEach(row => {
          const xOff = (target - row.width) / 2;
          row.nodes.forEach(n => {
            n.el.style.left = `${xOff + (n.col + 0.5) * DAG_SLOT_W}px`;
          });
        });
      });
      drawEdges();
    }

    function drawEdges() {
      components.forEach(component => {
        const box = component.inner.getBoundingClientRect();
        if (!box.width) return;
        const svg = component.inner.querySelector('svg');
        svg.querySelectorAll('.dag-edge').forEach(edge => edge.remove());
        component.ids.forEach(id => {
          const child = component.inner.querySelector(`[data-claim="${id}"]`);
          (claimById.get(id).entails || []).forEach(parentId => {
            const parent = component.inner.querySelector(`[data-claim="${parentId}"]`);
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
            <p class="micro">↑ Broader claims this leads to</p>
            ${parents.length ? `<div class="lab-chip-row">${parents.map(p => claimChip(p)).join('')}</div>` : '<p class="lab-empty">Nothing broader — this is a base claim, the starting point of its chain.</p>'}
          </div>
          <div>
            <p class="micro">↓ More specific claims built on this</p>
            ${children.length ? `<div class="lab-chip-row">${children.map(child => claimChip(child)).join('')}</div>` : '<p class="lab-empty">Nothing depends directly on it yet.</p>'}
          </div>
          <div>
            <p class="micro">Theories affirming this claim</p>
            <div class="lab-chip-row">${affirming.map(t => {
              const direct = (t.claims || []).includes(id);
              return `<button class="lab-theory-chip${direct ? ' direct' : ''}" data-theory="${t.id}" title="${direct ? 'Stated directly by this theory' : 'Not stated directly — it follows from claims this theory does state'}">${escapeHtml(t.name)}${direct ? '' : ' · implied'}</button>`;
            }).join('') || ('<p class="lab-empty">None of the ' + E.theories.length + ' theories with claims.</p>')}</div>
          </div>
        </div>`;
    }

    graph.addEventListener('click', (e) => {
      const node = e.target.closest('[data-claim]');
      if (!node) return;
      renderClaimDetail(node.dataset.claim);
      // Instant jump, not smooth: the panel is far below a tall graph and a
      // slow scroll left testers unsure anything had happened.
      claimDetail.scrollIntoView({ block: 'start' });
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
    requestAnimationFrame(layoutGraph);
    if ('ResizeObserver' in window) new ResizeObserver(() => layoutGraph()).observe(graph);
    else window.addEventListener('resize', () => layoutGraph());

    /* ---------------- theory explorer ---------------- */
    const theoryList = $('labTheoryList');
    const detail = $('labDetail');
    let theoryNav = [];

    let theoryFilter = '';
    function renderTheoryList() {
      const q = theoryFilter.trim().toLowerCase();
      const matches = t => !q || t.name.toLowerCase().includes(q)
        || (t.family || '').toLowerCase().includes(q)
        || (t.blurb || '').toLowerCase().includes(q)
        || (t.category || '').toLowerCase().includes(q);
      const withClaims = E.theories.filter(matches).map(t => {
        const fullN = E.theoryFullClaims(t).size;
        return `<button class="lab-theory-btn" data-theory="${t.id}">
          <strong>${escapeHtml(t.name)}</strong>
          <span>${escapeHtml(t.family)} · ${fullN} claim${fullN === 1 ? '' : 's'}</span>
        </button>`;
      }).join('');
      const pending = META_THEORIES.filter(t => !claimTheoryIds.has(t.id) && matches(t)).map(t =>
        `<button class="lab-theory-btn lab-theory-pending" data-meta="${t.id}">
          <strong>${escapeHtml(t.name)}</strong>
          <span>${escapeHtml(t.category)} · claims in progress</span>
        </button>`
      ).join('');
      theoryList.innerHTML = (withClaims || pending)
        ? withClaims + (pending ? `<p class="lab-theory-group">More theories — claims in progress</p>${pending}` : '')
        : '<p class="lab-empty">No theories match that filter.</p>';
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
        ${t.caveat ? `<p class="lab-caveat">A note on how this is classified: ${escapeHtml(t.caveat)}</p>` : ''}
        <p class="micro">Specific claims (listed by the theory)</p>
        <div class="lab-chip-row">${[...direct].map(cid => claimChip(cid, 'direct')).join('')}</div>
        ${inherited.length ? `<p class="micro">Implied claims (they follow from the specific ones)</p><div class="lab-chip-row">${inherited.map(cid => `<span class="lab-implied-wrap">${claimChip(cid)}<small>via ${viaWhich(t, cid).join(', ')}</small></span>`).join('')}</div>` : ''}
        <div class="lab-claim-texts">${[...full].map(cid => {
          const claim = claimById.get(cid);
          return `<div class="lab-claim-text${direct.has(cid) ? ' direct' : ''}"><span class="lab-claim-id">${cid}${direct.has(cid) ? '' : ' · implied'}</span><p>${escapeHtml(claim.text)}</p><p class="lab-claim-plain">Put simply: ${escapeHtml(claim.plain)}</p></div>`;
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
        <div class="lab-claim-cols"><div><p class="micro">↑ Broader claims this leads to</p>${ancestors.length ? `<div class="lab-chip-row">${ancestors.map(a => claimChip(a)).join('')}</div>` : '<p class="lab-empty">Nothing — this is a base claim.</p>'}</div><div><p class="micro">↓ More specific claims built on this</p>${descendants.length ? `<div class="lab-chip-row">${descendants.map(d => claimChip(d)).join('')}</div>` : '<p class="lab-empty">Nothing depends on this yet.</p>'}</div></div>
        <p class="micro">Theories affirming this claim</p><div class="lab-chip-row">${affirming.map(t => `<button class="lab-theory-chip${(t.claims || []).includes(id) ? ' direct' : ''}" data-theory="${t.id}">${escapeHtml(t.name)}${(t.claims || []).includes(id) ? '' : ' · implied'}</button>`).join('') || ('<p class="lab-empty">None of the ' + E.theories.length + ' theories with claims.</p>')}</div>`;
    }
    function renderTheoryNav() {
      const current = theoryNav[theoryNav.length - 1];
      $('labBack').classList.toggle('hidden', theoryNav.length <= 1);
      if (!current) {
        detail.innerHTML = '<p class="lab-empty">Pick a theory on the left to inspect its specific and implied claims.</p>';
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
    $('labTheorySearch').addEventListener('input', (e) => {
      theoryFilter = e.target.value;
      renderTheoryList();
    });

    /* ---------------- claim-driven quiz ---------------- */
    const qStart = $('labQuizStart');
    const qMain = $('labQuizMain');
    const qResult = $('labQuizResult');
    // A round is a short series: 12 questions, then results with the option
    // to keep going. The landing promises a short series, so the quiz keeps it.
    const QUIZ_ROUND_LENGTH = 12;
    const QUIZ_RAIL_TOP = 8;
    let qstate = null;
    let qhistory = [];
    let forcedQuestionId = null; // Back re-shows the exact popped question instead of re-deriving
    let qRoundCount = 0;
    let qRound = 1;
    let restartArmed = false;
    let restartTimer = null;
    // Mid-round restart is a two-step tap: the first arms it ("tap again"),
    // so an accidental tap can't wipe a round. Any step taken disarms it.
    function disarmRestart() {
      restartArmed = false;
      if (restartTimer) { clearTimeout(restartTimer); restartTimer = null; }
      $('labQRestart').textContent = 'Restart ↺';
    }
    let lastSettledIds = [];
    let lastSettledDir = null; // 'yes' when the last answer affirmed, 'no' when it rejected

    // Dynamic intro copy: counts come from the data, never hardcoded.
    $('quizCountLine').textContent = `${E.claims.length} claims · ${E.theories.length} theories`;
    $('exploreDek').textContent = `${E.claims.length} claims, each linked to the broader claims it implies — general claims at the top, specific ones below. ${E.theories.length} theories mapped so far, and the map keeps growing. Select anything to inspect it.`;
    graph.setAttribute('aria-label', `Graph of ${E.claims.length} consciousness claims`);

    function startQuiz() {
      qstate = E.newQuiz();
      qhistory = [];
      qRoundCount = 0;
      qRound = 1;
      lastSettledIds = [];
      lastSettledDir = null;
      qStart.classList.add('hidden');
      qResult.classList.add('hidden');
      qMain.classList.remove('hidden');
      disarmRestart();
      // A fresh quiz also clears any open explorer panels.
      claimDetail.innerHTML = '';
      detail.innerHTML = '';
      selectedClaim = null;
      graph.querySelectorAll('.dag-node.selected').forEach(n => n.classList.remove('selected'));
      theoryList.querySelectorAll('.lab-theory-btn.active').forEach(b => b.classList.remove('active'));
      renderQuestion();
    }

    function continueQuiz() {
      qRoundCount = 0;
      qRound++;
      qhistory = [];
      lastSettledIds = [];
      lastSettledDir = null;
      qResult.classList.add('hidden');
      qMain.classList.remove('hidden');
      renderQuestion();
      qMain.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }

    function currentQuestion() {
      if (forcedQuestionId) {
        const q = { id: forcedQuestionId };
        forcedQuestionId = null;
        return q;
      }
      return E.nextQuestion(qstate);
    }

    function renderQuestion() {
      if (qRoundCount >= QUIZ_ROUND_LENGTH) {
        renderResults(false);
        return;
      }
      const q = currentQuestion();
      if (!q) {
        renderResults(true);
        return;
      }
      const claim = claimById.get(q.id);
      $('labQCount').textContent = qRound > 1
        ? `${qRoundCount + 1} of ${QUIZ_ROUND_LENGTH} · round ${qRound}`
        : `${qRoundCount + 1} of ${QUIZ_ROUND_LENGTH}`;
      $('labQText').textContent = claim.text;
      $('labQPlain').textContent = `Put simply: ${claim.plain}`;
      const both = E.coverageBoth(qstate, q.id);
      $('labQCoverage').textContent = `Why this question: one answer decides several claims at once — agreeing decides ${both.yes}, disagreeing decides ${both.no}.`;
      const affN = E.affirmed(qstate).size;
      const rejN = E.rejected(qstate).size;
      $('labSettled').textContent = (affN + rejN)
        ? `Decided so far: ${affN} agreed · ${rejN} ruled out · ${E.claims.length - affN - rejN} open`
        : '';
      $('labQBack').classList.toggle('hidden', qhistory.length === 0);
      disarmRestart();
      renderSettledBy();
      renderTension();
      renderScores();
    }

    function renderSettledBy() {
      const el = $('labSettledBy');
      if (!lastSettledDir) { el.textContent = ''; return; }
      if (lastSettledDir === 'skip') { el.textContent = 'Last question: skipped — nothing decided.'; return; }
      if (!lastSettledIds.length) { el.textContent = 'Last question: that decided just this claim.'; return; }
      const labels = lastSettledIds.map(id => {
        const c = claimById.get(id);
        return c ? c.plain : id;
      }).join(' · ');
      el.textContent = lastSettledDir === 'no'
        ? `Last question: that also ruled out: ${labels} — they were built on the claim you ruled out.`
        : `Last question: that also decided: ${labels} — they follow from the claim you agreed with.`;
    }

    function answerQuestion(yesNo) {
      const q = currentQuestion();
      if (!q) return;
      const before = new Set([...E.affirmed(qstate), ...E.rejected(qstate)]);
      E.answer(qstate, q.id, yesNo);
      qhistory.push({ id: q.id, action: 'answer' });
      qRoundCount++;
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
      qRoundCount++;
      lastSettledIds = [];
      lastSettledDir = 'skip';
      renderQuestion();
    }

    // Gentle inconsistency note: the quiz measures alignment, not consistency,
    // but a layperson deserves to know when two affirmed claims pull apart.
    // Before any pair exists, flag the question whose affirmation would create
    // the first one — the useful moment is before answering, not after.
    function renderTension() {
      const el = $('labTension');
      const pairs = E.contradictions(qstate).slice(0, 2);
      if (!pairs.length) {
        const q = currentQuestion();
        if (q) {
          const probe = JSON.parse(JSON.stringify(qstate));
          E.answer(probe, q.id, 'yes');
          const fresh = E.contradictions(probe).slice(0, 1);
          if (fresh.length) {
            const affNow = E.affirmed(qstate);
            const [a, b] = fresh[0];
            const otherId = affNow.has(a) ? a : b;
            const other = claimById.get(otherId);
            el.classList.remove('hidden');
            el.textContent = `Heads up: agreeing here would pull against “${other ? other.plain : otherId}” — settled by your earlier answers. No wrong answers here; just flagging the tension before you answer.`;
            return;
          }
        }
        el.textContent = '';
        el.classList.add('hidden');
        return;
      }
      el.classList.remove('hidden');
      el.textContent = pairs.map(([a, b]) => {
        const ca = claimById.get(a), cb = claimById.get(b);
        return `Worth knowing: “${ca.plain}” pulls against “${cb.plain}” — you affirmed both. No wrong answers here; the quiz measures alignment, not consistency.`;
      }).join(' ');
    }

    function renderScores() {
      const ranked = E.score(qstate);
      const top = ranked.slice(0, QUIZ_RAIL_TOP);
      $('labScores').innerHTML = top.map(result => {
        const pct = result.total ? Math.round(100 * result.agreed / result.total) : 0;
        return `<div class="lab-score-row">
          <div class="lab-score-top"><strong>${escapeHtml(result.theory.name)}</strong><span>${result.agreed} of ${result.total}</span></div>
          ${result.theory.blurb ? `<div class="lab-score-blurb">${escapeHtml(result.theory.blurb)}</div>` : ''}
          <div class="lab-score-bar"><span style="width:${pct}%"></span></div>
          ${result.disagreed ? `<small>${result.disagreed} ruled out</small>` : ''}
        </div>`;
      }).join('') + (ranked.length > QUIZ_RAIL_TOP
        ? `<button class="lab-scores-more text-btn" data-peek-ranking="1">${ranked.length - QUIZ_RAIL_TOP} more theories — see the full ranking any time.</button>`
        : '');
    }

    function renderResults(exhausted) {
      qMain.classList.add('hidden');
      qResult.classList.remove('hidden');
      $('labQuizResume').classList.add('hidden');
      $('labResultKicker').textContent = 'Your result · alignment, not elimination';
      $('labResultTitle').textContent = 'Where your answers land';
      const answered = Object.keys(qstate.answers).length;
      $('labQuizContinue').classList.toggle('hidden', exhausted);
      $('labContinueNote').textContent = exhausted
        ? ''
        : `Based on ${answered} answer${answered === 1 ? '' : 's'} so far — keep going any time for a sharper picture.`;
      qMain.classList.add('hidden');
      qResult.classList.remove('hidden');
      $('labResultList').innerHTML = E.score(qstate).map((result, index) => {
        const line = (result.agreed === 0 && result.disagreed === 0)
          ? `None of this theory's claims came up in your answers (${result.total} claim${result.total === 1 ? '' : 's'}).`
          : (result.agreed === 0)
            ? `You rule out ${result.disagreed} of its ${result.total} claims (agreeing with none).`
            : `You agree with ${result.agreed} of its ${result.total} claims${result.disagreed ? `, and rule out ${result.disagreed}` : ''}.`;
        return `
        <div class="lab-result-row${index === 0 ? ' top' : ''}">
          <span class="lab-result-rank">#${index + 1}</span>
          <div><strong>${escapeHtml(result.theory.name)}</strong>
          ${result.theory.blurb ? `<p class="lab-result-blurb">${escapeHtml(result.theory.blurb)}</p>` : ''}
          <p>${line}</p>
          <button class="text-btn" data-inspect="${result.theory.id}">Inspect this theory’s claims <span class="vh">— ${escapeHtml(result.theory.name)}</span></button></div>
        </div>`;
      }).join('');
    }

    $('labQuizBegin').addEventListener('click', startQuiz);
    $('labQuizRestart').addEventListener('click', startQuiz);
    $('labQuizContinue').addEventListener('click', continueQuiz);
    // Mid-round restart: first tap arms it, second tap wipes and restarts.
    $('labQRestart').addEventListener('click', () => {
      if (restartArmed) { disarmRestart(); startQuiz(); return; }
      restartArmed = true;
      $('labQRestart').textContent = 'Tap again to restart — this clears your answers';
      restartTimer = setTimeout(disarmRestart, 10000);
    });
    // Mid-round peek at the ranking: shows the results view over current
    // answers, with a way back that resumes the round untouched. Available
    // from round 1 — the rail's "full ranking any time" opens the same view.
    function peekRanking() {
      renderResults(false);
      $('labQuizContinue').classList.add('hidden');
      $('labResultKicker').textContent = 'Live ranking · not the final result';
      $('labResultTitle').textContent = 'Where your answers land so far';
      const answered = Object.keys(qstate.answers).length;
      $('labContinueNote').textContent = `Based on ${answered} answer${answered === 1 ? '' : 's'} so far.`;
      $('labQuizResume').classList.remove('hidden');
    }
    $('labQRanking').addEventListener('click', peekRanking);
    $('labScores').addEventListener('click', (e) => {
      if (e.target.closest('[data-peek-ranking]')) peekRanking();
    });
    $('labQuizResume').addEventListener('click', () => {
      $('labQuizResume').classList.add('hidden');
      qResult.classList.add('hidden');
      qMain.classList.remove('hidden');
      renderQuestion();
    });
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
      qRoundCount = Math.max(0, qRoundCount - 1);
      forcedQuestionId = last.id;
      lastSettledIds = [];
      lastSettledDir = null;
      renderQuestion();
    });

    showTab('claims');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
