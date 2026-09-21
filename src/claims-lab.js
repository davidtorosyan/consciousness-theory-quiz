/* Claims lab UI: claim DAG, theory explorer, and DAG-driven quiz. */
(function () {
  'use strict';

  function init() {
    const $ = (id) => document.getElementById(id);
    // Defensive boot: if the HTML and JS versions disagree (e.g. a deploy
    // landing mid-reload), say so plainly instead of dying silently.
    const need = ['labQuizStart', 'labQuizMain', 'labQuizResult', 'labQuizBegin', 'labQuizRestart', 'labQRestart',
      'labQuizContinue', 'labContinueNote', 'labAgree', 'labDisagree', 'labNotSure', 'labDontUnderstand',
      'labExplain', 'labExplainTitle', 'labExplainPlain', 'labExplainContext', 'labExplainStill', 'labExplainBack',
      'labQBack', 'labQText', 'labQPlain', 'labQCount', 'labProgressPill',
      'labSettledBy', 'labTension', 'labScores', 'labResultList', 'labClaimGraph',
      'labQRanking', 'labQuizResume', 'labResultKicker', 'labResultTitle',
      'labClaimDetail', 'labTheoryList', 'labDetail', 'labBack', 'labTabClaims', 'labTabTheories',
      'labClaims', 'labTheories', 'quizCountLine', 'exploreDek', 'updateBanner', 'updateReload',
      'labClaimSearch', 'labClaimSearchCount'];
    if (!window.ClaimsEngine || !window.CLAIMS || need.some(id => !$(id))) {
      const el = $('quizCountLine') || $('labQuizStart');
      if (el) el.textContent = 'The site just updated — please reload the page to get the latest version.';
      return;
    }
    const E = window.ClaimsEngine.bound();
    // Freshness check: the HTML shell can lag behind deploys (CDN cache), so
    // ask the server what the latest build is. The banner is only worth
    // showing once the visitor has quiz progress to protect — on a truly
    // fresh first load it just confuses.
    let newerBuildSeen = false;
    function quizHasProgress() {
      if (!qstate) return false;
      return Object.keys(qstate.answers || {}).length > 0
        || Object.keys(qstate.skipped || {}).length > 0
        || Object.keys(qstate.notUnderstood || {}).length > 0;
    }
    function maybeShowUpdateBanner() {
      if (newerBuildSeen && quizHasProgress()) $('updateBanner').classList.remove('hidden');
    }
    try {
      fetch('version.json?fresh=' + Date.now()).then(r => r.json()).then(v => {
        if (v && typeof v.build === 'number' && v.build > (window.SITE_BUILD || 0)) {
          newerBuildSeen = true;
          maybeShowUpdateBanner();
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
      return `<button class="lab-claim-chip${extra ? ' ' + extra : ''}" data-claim="${id}" title="${escapeHtml(c.text)}">${escapeHtml(shortLabel(c))}</button>`;
    }
    // Long theory lists never render hundreds of chips at once: show the
    // first CHIP_SHOW, hide the rest behind a "Show all N" control.
    const CHIP_SHOW = 10;
    function collapsedChips(chips) {
      const shown = chips.slice(0, CHIP_SHOW).join('');
      const extra = chips.slice(CHIP_SHOW).map(h =>
        h.replace('class="lab-theory-chip', 'class="lab-theory-chip extra-chip hidden')).join('');
      const more = chips.length > CHIP_SHOW
        ? `<button class="text-btn chip-more" data-chip-more="1">Show all ${chips.length}</button>` : '';
      return shown + extra + more;
    }
    function expandChipsIn(container) {
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-chip-more]');
        if (!btn) return;
        const row = btn.closest('.lab-chip-row');
        if (row) row.querySelectorAll('.extra-chip.hidden').forEach(el => el.classList.remove('hidden'));
        btn.remove();
      });
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
            // No title attribute and no internal claim id in the aria-label:
            // the short label (the node's visible identifier) leads so
            // assistive tech gets the same primary label sighted users see,
            // then the full text. The data-claim attribute carries the id
            // for clicks. data-plain feeds a CSS-only hover tooltip for
            // sighted users, so jargon-y short labels get an in-context
            // plain-language gloss without duplicating anything for
            // assistive tech. Claims with a direct opposite get a visible
            // ↔ mark (and the aria-label says so) so the opposites
            // mechanic is discoverable in the map itself.
            const hasAnti = !!(claim.anti && claimById.has(claim.anti));
            if (hasAnti) button.classList.add('has-anti');
            button.setAttribute('aria-label', `${shortLabel(claim)}. ${claim.text}${hasAnti ? ' This claim has a direct opposite.' : ''}`);
            button.setAttribute('data-plain', `Put simply: ${claim.plain}`);
            button.innerHTML = `<span class="dag-node-label">${escapeHtml(shortLabel(claim))}${hasAnti ? '<span class="dag-anti-mark" aria-hidden="true">↔</span>' : ''}</span>`;
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
      const antiClaim = c.anti ? claimById.get(c.anti) : null;
      const antiNote = antiClaim
        ? `<p class="lab-anti-note">↔ Anti-claim: <button class="text-btn" data-claim="${antiClaim.id}">“${escapeHtml(antiClaim.short)}”</button> — agreeing here means disagreeing there, and vice versa.</p>`
        : '';
      claimDetail.innerHTML = `
        <h3 class="lab-claim-title">${escapeHtml(c.text)}</h3>
        <p class="lab-plain">Put simply: ${escapeHtml(c.plain)}</p>
        ${antiNote}
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
            <p class="lab-gloss">Stated directly: the theory says this outright. Implied: it follows from claims the theory does state.</p>
            <div class="lab-chip-row">${affirming.length ? collapsedChips(affirming.map(t => {
              const direct = (t.claims || []).includes(id);
              return `<button class="lab-theory-chip${direct ? ' direct' : ''}" data-theory="${t.id}" title="${direct ? 'Stated directly by this theory' : 'Not stated directly — it follows from claims this theory does state'}">${escapeHtml(t.name)}${direct ? '' : ' · implied'}</button>`;
            })) : ('<p class="lab-empty">None of the ' + E.theories.length + ' theories with claims.</p>')}</div>
          </div>
        </div>`;
    }

    graph.addEventListener('click', (e) => {
      const node = e.target.closest('[data-claim]');
      if (!node) return;
      renderClaimDetail(node.dataset.claim);
      jumpTo(claimDetail);
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
    expandChipsIn(claimDetail);

    // Claim explorer search: dim non-matching nodes so a keyword surfaces
    // the claim in the 279-node graph. A highlight, not a filter — the map
    // stays whole and the match count says what matched.
    const claimSearch = $('labClaimSearch');
    const claimSearchCount = $('labClaimSearchCount');
    // "↔ Show opposite claims": dims everything except the anti-pair claims
    // and opens the first one's detail panel, so the opposites mechanic is
    // one tap away instead of hidden on two specific claims. Typing in the
    // search box clears the opposites view (it is a highlight like search).
    const oppositesBtn = $('labClaimOpposites');
    const antiIds = E.claims.filter(c => c.anti).map(c => c.id);
    function clearOppositesView() {
      oppositesBtn.setAttribute('aria-pressed', 'false');
      oppositesBtn.innerHTML = '↔ Show opposite claims';
      graph.querySelectorAll('.dag-node.dimmed-anti').forEach(node => node.classList.remove('dimmed-anti'));
    }
    oppositesBtn.addEventListener('click', () => {
      const showing = oppositesBtn.getAttribute('aria-pressed') === 'true';
      if (showing) { clearOppositesView(); return; }
      oppositesBtn.setAttribute('aria-pressed', 'true');
      oppositesBtn.innerHTML = '↔ Hide opposite claims';
      claimSearch.value = '';
      claimSearchCount.classList.add('hidden');
      graph.querySelectorAll('.dag-node').forEach(node => {
        const hit = antiIds.includes(node.dataset.claim);
        node.classList.remove('dimmed');
        node.classList.toggle('dimmed-anti', !hit);
      });
      if (antiIds.length) { renderClaimDetail(antiIds[0]); jumpTo(claimDetail); }
    });
    claimSearch.addEventListener('input', () => {
      clearOppositesView();
      const q = claimSearch.value.trim().toLowerCase();
      let hits = 0, total = 0;
      graph.querySelectorAll('.dag-node').forEach(node => {
        total++;
        if (!q) { node.classList.remove('dimmed'); return; }
        const hay = `${node.getAttribute('aria-label') || ''} ${node.getAttribute('data-plain') || ''}`.toLowerCase();
        const hit = hay.includes(q);
        node.classList.toggle('dimmed', !hit);
        if (hit) hits++;
      });
      claimSearchCount.classList.toggle('hidden', !q);
      if (q) claimSearchCount.textContent = `${hits} of ${total} claims match “${claimSearch.value.trim()}”`;
    });

    renderGraph();
    requestAnimationFrame(layoutGraph);
    if ('ResizeObserver' in window) new ResizeObserver(() => layoutGraph()).observe(graph);
    else window.addEventListener('resize', () => layoutGraph());

    // Instant jump to an element. The stylesheet sets
    // html { scroll-behavior: smooth }, which would otherwise turn a plain
    // scrollIntoView() into a slow animation the user may never notice —
    // so the smooth behavior is suppressed for the duration of the jump.
    function jumpTo(el) {
      const root = document.documentElement;
      const prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      el.scrollIntoView({ block: 'start' });
      root.style.scrollBehavior = prev;
    }

    /* ---------------- theory explorer ---------------- */
    const theoryList = $('labTheoryList');
    const detail = $('labDetail');
    let theoryNav = [];

    let theoryFilter = '';
    let theoryListLimit = 10;
    function renderTheoryList() {
      const q = theoryFilter.trim().toLowerCase();
      // Word-boundary matching: searching "dualism" must not match
      // "nondualism" — different word, different theory.
      const qRe = q
        ? new RegExp(`(^|[^\\p{L}\\p{N}])${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'iu')
        : null;
      const matches = t => !qRe
        || qRe.test(t.name || '')
        || qRe.test(t.family || '')
        || qRe.test(t.blurb || '')
        || qRe.test(t.category || '')
        // Searchable aliases: well-known proponent names / alternative names
        // that don't appear in the title (e.g. "descartes" -> Substance dualism).
        || (t.aliases || []).some(a => qRe.test(a));
      const all = E.theories.filter(matches);
      const withClaims = all.slice(0, theoryListLimit).map(t => {
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
      // Never render hundreds of theory buttons at once: page them in.
      const moreBtn = all.length > theoryListLimit
        ? `<button class="text-btn lab-list-more" data-theory-more="1">Show 10 more (${all.length - theoryListLimit} left)</button>`
        : '';
      theoryList.innerHTML = (withClaims || pending)
        ? withClaims + moreBtn + (pending ? `<p class="lab-theory-group">More theories — claims in progress</p>${pending}` : '')
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
        <p class="micro">Claims this theory states directly</p>
        <div class="lab-chip-row">${[...direct].map(cid => claimChip(cid, 'direct')).join('')}</div>
        ${inherited.length ? `<p class="micro">Claims that follow from those</p><p class="lab-gloss">How this theory connects its claims — the theory's own logic, not something inferred from your answers.</p><div class="lab-chip-row">${inherited.map(cid => {
          const via = viaWhich(t, cid).map(sid => { const sc = claimById.get(sid); return sc ? `“${sc.plain}”` : sid; });
          return `<span class="lab-implied-wrap">${claimChip(cid)}<small>via ${via.join(' · ')}</small></span>`;
        }).join('')}</div>` : ''}
        <div class="lab-claim-texts">${[...full].map(cid => {
          const claim = claimById.get(cid);
          return `<div class="lab-claim-text${direct.has(cid) ? ' direct' : ''}">${direct.has(cid) ? '' : '<span class="lab-claim-id">implied</span>'}<p>${escapeHtml(claim.text)}</p><p class="lab-claim-plain">Put simply: ${escapeHtml(claim.plain)}</p></div>`;
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
        <h3 class="lab-claim-title">${escapeHtml(c.text)}</h3>
        <p class="lab-plain">Put simply: ${escapeHtml(c.plain)}</p>
        <div class="lab-claim-cols"><div><p class="micro">↑ Broader claims this leads to</p>${ancestors.length ? `<div class="lab-chip-row">${ancestors.map(a => claimChip(a)).join('')}</div>` : '<p class="lab-empty">Nothing — this is a base claim.</p>'}</div><div><p class="micro">↓ More specific claims built on this</p>${descendants.length ? `<div class="lab-chip-row">${descendants.map(d => claimChip(d)).join('')}</div>` : '<p class="lab-empty">Nothing depends on this yet.</p>'}</div></div>
        <p class="micro">Theories affirming this claim</p>
        <p class="lab-gloss">Stated directly: the theory says this outright. Implied: it follows from claims the theory does state.</p>
        <div class="lab-chip-row">${affirming.length ? collapsedChips(affirming.map(t => `<button class="lab-theory-chip${(t.claims || []).includes(id) ? ' direct' : ''}" data-theory="${t.id}">${escapeHtml(t.name)}${(t.claims || []).includes(id) ? '' : ' · implied'}</button>`)) : ('<p class="lab-empty">None of the ' + E.theories.length + ' theories with claims.</p>')}</div>`;
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
    expandChipsIn(detail);
    theoryList.addEventListener('click', (e) => {
      const more = e.target.closest('[data-theory-more]');
      if (more) { theoryListLimit += 10; renderTheoryList(); return; }
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
      // Clear any stale filter text so the search box matches the panel
      // being opened (otherwise e.g. "Mandik" stays in the box while a
      // different theory's panel is displayed).
      theoryFilter = '';
      theoryListLimit = 10;
      const search = $('labTheorySearch');
      if (search) search.value = '';
      theoryNav = [{ kind: 'theory', id }];
      renderTheoryList();
      renderTheoryNav();
      $('labTheories').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      // The button says the claims are "below" — flash the destination panel
      // briefly so the scroll landing doesn't feel disorienting.
      const dest = $('labDetail');
      dest.classList.remove('detail-flash');
      void dest.offsetWidth; // restart the animation when re-selecting
      dest.classList.add('detail-flash');
      setTimeout(() => dest.classList.remove('detail-flash'), 1700);
    }
    renderTheoryList();
    renderTheoryNav();
    $('labTheorySearch').addEventListener('input', (e) => {
      theoryFilter = e.target.value;
      theoryListLimit = 10;
      // An open detail panel can show a theory the new filter hides — a
      // layperson could mistake it for a filtered theory's panel. Close it.
      theoryNav = [];
      renderTheoryList();
      renderTheoryNav();
    });

    /* ---------------- claim-driven quiz ---------------- */
    const qStart = $('labQuizStart');
    const qMain = $('labQuizMain');
    const qResult = $('labQuizResult');
    // A round is a short series: 12 questions, then results with the option
    // to keep going. The landing promises a short series, so the quiz keeps it.
    const QUIZ_ROUND_LENGTH = 12;
    const QUIZ_RAIL_TOP = 10;
    let railLimit = QUIZ_RAIL_TOP; // inline load-more in the live-alignment rail
    let resultLimit = 10;          // collapsed results list
    // The live rail keeps a stable theory order for the whole session and
    // shows rank-change indicators (▲/▼) instead of re-sorting the DOM every
    // question, which testers found jumpy. railPrevRank maps theory id ->
    // rank index at the last render, so deltas can be computed.
    let railOrder = null;
    let railPrevRank = new Map();
    let qstate = null;
    let qhistory = [];
    let forcedQuestionId = null; // Back re-shows the exact popped question instead of re-deriving
    let shownQuestionId = null; // the question currently on screen — answers/skips act on it, never re-derive
    let qRoundCount = 0;
    let qRound = 1;
    // Skipped questions get one more chance at round end instead of
    // vanishing silently: revisitLeft counts down the re-asked ones, and a
    // second skip is final (it stays skipped and the results say so).
    let revisitLeft = 0;
    let revisitTotal = 0;
    let revisitDone = new Set(); // claim ids already re-asked — never re-queue twice
    let revisitQueue = []; // re-queued claim ids, asked first so the revisit is literal
    let revisitShown = new Set(); // claim ids actually re-asked this pass — the honest "X of Y"
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
      revisitLeft = 0;
      revisitTotal = 0;
      revisitDone = new Set();
      revisitQueue = [];
      revisitShown = new Set();
      railLimit = QUIZ_RAIL_TOP;
      resultLimit = 10;
      railOrder = null;
      railPrevRank = new Map();
      lastSettledIds = [];
      lastSettledDir = null;
      qStart.classList.add('hidden');
      qResult.classList.add('hidden');
      qMain.classList.remove('hidden');
      disarmRestart();
      disarmAgain();
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
      revisitLeft = 0;
      revisitTotal = 0;
      revisitDone = new Set();
      revisitQueue = [];
      revisitShown = new Set();
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
        // Back re-asks the exact popped question: it is a genuine revisit
        // only if it came from this pass's re-queue.
        return { ...q, revisit: revisitShown.has(q.id) || revisitQueue.includes(q.id) };
      }
      // During the revisit pass, the re-queued claims go first so the
      // "another chance" promise is literal, not just pool-level.
      // Peek, don't consume: the item leaves the queue only when it is
      // answered or skipped. Consuming on display stranded questions when
      // the visitor left mid-revisit (e.g. peeked at the ranking) — the
      // queue item was gone but no answer was recorded, so a fresh
      // question appeared under the "revisiting" label.
      if (revisitQueue.length) {
        const settled = new Set([...E.affirmed(qstate), ...E.rejected(qstate), ...Object.keys(qstate.skipped || {})]);
        revisitQueue = revisitQueue.filter(id => !settled.has(id));
        if (!revisitQueue.length) revisitLeft = 0;
        else return { id: revisitQueue[0], revisit: true };
      }
      const nq = E.nextQuestion(qstate);
      return nq ? { ...nq, revisit: false } : nq;
    }

    // A revisit item is done once the visitor answers or skips it — only
    // then does it leave the queue.
    function consumeRevisit(id) {
      if (revisitQueue.length) revisitQueue = revisitQueue.filter(x => x !== id);
    }

    function renderQuestion() {
      // Back re-asks the exact popped question; the revisit machinery below
      // must not interfere with that.
      if (qRoundCount >= QUIZ_ROUND_LENGTH && !forcedQuestionId) {
        // A skipped question must not vanish silently: re-ask it before
        // results. The re-ask pass is bounded (one question each), and a
        // second skip is final. Propagation may have settled a re-queued
        // claim meanwhile — drop those up front so the pass never asks a
        // decided question and the "X of Y" counts only live re-asks.
        if (revisitQueue.length) {
          const settled = new Set([...E.affirmed(qstate), ...E.rejected(qstate), ...Object.keys(qstate.skipped || {})]);
          revisitQueue = revisitQueue.filter(id => !settled.has(id));
          if (!revisitQueue.length) revisitLeft = 0;
        }
        if (revisitLeft === 0) {
          const skipped = Object.keys(qstate.skipped || {}).filter(id => !revisitDone.has(id));
          if (skipped.length) {
            skipped.forEach(id => { E.unskip(qstate, id); revisitDone.add(id); });
            // Your answers may already have settled some of these via
            // propagation — re-asking a decided claim is pointless, and
            // counting it would inflate the "X of Y".
            const decided = new Set([...E.affirmed(qstate), ...E.rejected(qstate)]);
            revisitQueue = skipped.filter(id => !decided.has(id));
            revisitLeft = revisitQueue.length;
            revisitTotal = revisitQueue.length;
            revisitShown = new Set();
            lastSettledIds = [];
            if (revisitQueue.length) {
              lastSettledDir = 'revisit';
            } else {
              renderResults(false);
              return;
            }
          } else {
            renderResults(false);
            return;
          }
        }
      }
      const q = currentQuestion();
      shownQuestionId = q ? q.id : null;
      if (!q) {
        renderResults(true);
        return;
      }
      // Provenance-based labeling: the counter tracks claims actually
      // re-asked this pass (revisitShown), never a countdown that can drift
      // from the queue. A question that is not a genuine revisit is never
      // labeled as one — it is a follow-up to sharpen the result.
      const isRevisit = !!q.revisit;
      if (isRevisit) revisitShown.add(q.id);
      const claim = claimById.get(q.id);
      $('labQCount').textContent = isRevisit
        ? `${(qstate.notUnderstood || {})[q.id] ? 'Revisiting a claim you found unclear' : 'Revisiting a skipped claim'} — ${revisitShown.size} of ${revisitTotal}`
        : (qRoundCount >= QUIZ_ROUND_LENGTH
          ? 'A few more claims to sharpen your result'
          : (qRound > 1
            ? `${qRoundCount + 1} of ${QUIZ_ROUND_LENGTH} · round ${qRound}`
            : `${qRoundCount + 1} of ${QUIZ_ROUND_LENGTH}`));
      $('labQText').textContent = claim.text;
      $('labQPlain').textContent = `Put simply: ${claim.plain}`;
      // Progress pill: claims still in play out of the original total.
      // Undecided means not affirmed and not rejected; a skipped claim
      // decides nothing, so skipped-but-unresolved claims stay in play.
      const open = E.undecided(qstate).length;
      $('labProgressPill').textContent = `${open} of ${E.claims.length} claims still in play`;
      $('labExplain').classList.add('hidden');
      $('labQBack').classList.toggle('hidden', qhistory.length === 0);
      disarmRestart();
      renderSettledBy();
      renderTension();
      renderScores();
      maybeShowUpdateBanner();
    }

    function renderSettledBy() {
      const el = $('labSettledBy');
      el.classList.remove('dir-yes', 'dir-no');
      if (!lastSettledDir) { el.innerHTML = ''; return; }
      if (lastSettledDir === 'revisit') { el.textContent = 'You skipped some claims earlier — here’s another chance at them before your results.'; return; }
      if (lastSettledDir === 'skip') { el.textContent = 'Last question: skipped — nothing decided.'; return; }
      // The leading marker (a CSS ::before) reflects the answer direction:
      // ✓ after Agree, ✗ after Disagree, • for anything else.
      el.classList.add(lastSettledDir === 'yes' ? 'dir-yes' : 'dir-no');
      const n = lastSettledIds.length;
      if (!n) { el.textContent = 'Last question: that decided just this claim.'; return; }
      // Collapsed by default: one line plus a details expander. A big
      // propagation used to list dozens of claims here and shove the answer
      // buttons below the fold — the full list must never do that again.
      // The count includes the answered claim itself: lastSettledIds holds
      // only the *other* claims the answer settled, and without +1 the
      // number undershoots the progress-pill delta (e.g. 5 shown for a
      // 279 → 273 drop), which testers read as wrong arithmetic.
      const total = n + 1;
      // Per-bullet disposition: each newly settled claim is either affirmed
      // or rejected by this answer — mark it (✓/✗) so "settled" is never
      // ambiguous. A claim settled as the direct opposite of another claim
      // gets an explicit ↔ note, so the opposites mechanic surfaces in the
      // quiz itself. This covers both directions: the answered claim may
      // itself be anti-paired, or (the common case) the answer may affirm a
      // claim whose entailment chain reaches one side of an anti-pair,
      // which rejects the other side.
      const aff = E.affirmed(qstate), rej = E.rejected(qstate);
      const labels = lastSettledIds.map(id => {
        const c = claimById.get(id);
        const dispo = aff.has(id) ? 'yes' : (rej.has(id) ? 'no' : null);
        const mark = dispo === 'yes'
          ? '<span class="settled-mark settled-mark-yes" aria-hidden="true">✓</span>'
          : dispo === 'no'
            ? '<span class="settled-mark settled-mark-no" aria-hidden="true">✗</span>'
            : '<span class="settled-mark" aria-hidden="true">•</span>';
        const dispoWord = dispo === 'yes' ? 'agreed' : dispo === 'no' ? 'ruled out' : 'settled';
        const antiId = (c || {}).anti;
        const antiFired = antiId &&
          ((dispo === 'no' && aff.has(antiId)) || (dispo === 'yes' && rej.has(antiId)));
        const antiClaim = antiFired ? claimById.get(antiId) : null;
        const antiNote = antiClaim
          ? ` <span class="settled-anti-note">↔ direct opposite of “${escapeHtml(shortLabel(antiClaim))}”</span>`
          : '';
        return `<li>${mark}<span class="vh">${dispoWord}: </span>${escapeHtml(c ? c.plain : id)}${antiNote}</li>`;
      }).join('');
      el.innerHTML =
        `<span>Last question: that settled ${total} claim${total === 1 ? '' : 's'} — the one you just answered plus the ${n} below. </span>` +
        `<button class="text-btn settled-more-btn" data-settled-more="1" data-closed="▸ details" aria-expanded="false">▸ details</button>` +
        `<ul class="settled-details hidden">${labels}</ul>`;
    }

    function answerQuestion(yesNo) {
      // Act on the question on screen, not a re-derived one: re-deriving
      // mid-round could pick a different claim than the user just read.
      const q = shownQuestionId ? { id: shownQuestionId } : currentQuestion();
      shownQuestionId = null;
      if (!q) return;
      const before = new Set([...E.affirmed(qstate), ...E.rejected(qstate)]);
      E.answer(qstate, q.id, yesNo);
      qhistory.push({ id: q.id, action: 'answer' });
      qRoundCount++;
      if (revisitLeft > 0) revisitLeft--;
      consumeRevisit(q.id);
      lastSettledIds = [...E.affirmed(qstate), ...E.rejected(qstate)]
        .filter(id => !before.has(id) && id !== q.id);
      lastSettledDir = yesNo;
      renderQuestion();
    }

    function skipQuestion() {
      const q = shownQuestionId ? { id: shownQuestionId } : currentQuestion();
      shownQuestionId = null;
      if (!q) return;
      E.skip(qstate, q.id);
      qhistory.push({ id: q.id, action: 'skip' });
      qRoundCount++;
      if (revisitLeft > 0) revisitLeft--;
      consumeRevisit(q.id);
      lastSettledIds = [];
      lastSettledDir = 'skip';
      renderQuestion();
    }

    // "Don't understand" first opens a bigger explanation; only the
    // "Still don't get it" button inside it skips — and flags the claim as
    // not understood. The flag is inert for scoring (see the engine).
    function openExplain() {
      const id = shownQuestionId;
      if (!id) return;
      const c = claimById.get(id);
      if (!c) return;
      $('labExplainTitle').textContent = c.text;
      // The panel leads with a plain restatement ("in other words") derived
      // from the claim's put-simply gloss, then the bigger ideas, then
      // illustrations — labeled honestly as illustrations, not explanations,
      // because testers read them as competing claims and got more confused.
      $('labExplainPlain').textContent = `In other words: ${c.plain}`;
      const parents = c.entails || [];
      const children = directChildren(id);
      const plainOf = (cid) => { const cc = claimById.get(cid); return cc ? `<li>${escapeHtml(cc.plain)}</li>` : ''; };
      $('labExplainContext').innerHTML =
        (parents.length
          ? `<p class="micro">The bigger ideas behind it</p><ul class="explainer-points">${parents.map(plainOf).join('')}</ul>` : '') +
        (children.length
          ? `<p class="micro">Stronger ideas built on this one</p><p class="explain-note">These go further than the claim above — agreeing with the claim above does <em>not</em> mean agreeing with these. They are competing views, not a package: they can disagree with each other.</p><ul class="explainer-points">${children.slice(0, 4).map(plainOf).join('')}</ul>` : '') +
        `<p class="explain-note">No wrong answers here — “Not sure” skips without judging, and skipping from here notes that this one was unclear.</p>`;
      $('labExplain').classList.remove('hidden');
      jumpTo($('labExplain'));
    }
    function closeExplain() {
      $('labExplain').classList.add('hidden');
    }
    function skipNotUnderstood() {
      const q = shownQuestionId ? { id: shownQuestionId } : currentQuestion();
      shownQuestionId = null;
      if (!q) return;
      E.skipNotUnderstood(qstate, q.id);
      qhistory.push({ id: q.id, action: 'skipNu' });
      qRoundCount++;
      if (revisitLeft > 0) revisitLeft--;
      consumeRevisit(q.id);
      lastSettledIds = [];
      lastSettledDir = 'skip';
      renderQuestion();
    }

    // Gentle inconsistency note: the quiz measures alignment, not consistency,
    // but a layperson deserves to know when two affirmed claims pull apart.
    // Before any pair exists, flag the question whose affirmation would create
    // the first one — the useful moment is before answering, not after.
    //
    // Layout stability: the note appears on some questions and not others, so
    // it lives in a reserved slot (min-height in CSS, visibility toggle here)
    // instead of popping in and out of the flow and shoving the buttons.
    // At most one tension is shown inline; the rest hide behind an expander.
    function renderTension() {
      const el = $('labTension');
      el.classList.remove('hidden'); // visibility (tension-empty) owns show/hide from here on
      const pairs = E.contradictions(qstate).slice(0, 2);
      const pairText = ([a, b]) => {
        const ca = claimById.get(a), cb = claimById.get(b);
        return `“${ca.plain}” pulls against “${cb.plain}”`;
      };
      if (!pairs.length) {
        // Act on the question on screen (shownQuestionId), never re-derive:
        // currentQuestion() would consume the revisit queue / forced id.
        const qid = shownQuestionId;
        if (qid) {
          const probe = JSON.parse(JSON.stringify(qstate));
          E.answer(probe, qid, 'yes');
          const fresh = E.contradictions(probe).slice(0, 1);
          if (fresh.length) {
            const affNow = E.affirmed(qstate);
            const [a, b] = fresh[0];
            const otherId = affNow.has(a) ? a : b;
            const other = claimById.get(otherId);
            el.classList.remove('tension-empty');
            el.innerHTML = `<span>Heads up: agreeing here would pull against “${escapeHtml(other ? other.plain : otherId)}” — settled by your earlier answers.</span>`;
            return;
          }
        }
        el.classList.add('tension-empty');
        el.innerHTML = '';
        return;
      }
      el.classList.remove('tension-empty');
      const first = `Worth knowing: ${pairText(pairs[0])} — you affirmed both.`;
      el.innerHTML = pairs.length > 1
        ? `<span>${escapeHtml(first)} </span>` +
          `<button class="text-btn settled-more-btn" data-tension-more="1" data-closed="▸ one more tension" aria-expanded="false">▸ one more tension</button>` +
          `<p class="tension-details hidden">${escapeHtml(`Also: ${pairText(pairs[1])} — you affirmed both.`)}</p>`
        : `<span>${escapeHtml(first)}</span>`;
    }

    function renderScores() {
      const ranked = E.score(qstate);
      const rankOf = new Map(ranked.map((r, i) => [r.theory.id, i]));
      const byId = new Map(ranked.map(r => [r.theory.id, r]));
      if (!railOrder) railOrder = ranked.map(r => r.theory.id);
      const top = railOrder.slice(0, railLimit).map(id => byId.get(id)).filter(Boolean);
      $('labScores').innerHTML = top.map(result => {
        const pct = result.total ? Math.round(100 * result.agreed / result.total) : 0;
        const rank = rankOf.get(result.theory.id);
        const prev = railPrevRank.get(result.theory.id);
        let delta = '';
        if (prev !== undefined && prev !== rank) {
          const d = prev - rank;
          delta = d > 0
            ? ` <span class="rank-delta up" title="Moved up ${d} since the last question">▲${d}</span>`
            : ` <span class="rank-delta down" title="Moved down ${-d} since the last question">▼${-d}</span>`;
        }
        return `<div class="lab-score-row">
          <div class="lab-score-top"><strong>${escapeHtml(result.theory.name)}${delta}</strong><span>${result.agreed} of ${result.total}</span></div>
          ${result.theory.blurb ? `<div class="lab-score-blurb">${escapeHtml(result.theory.blurb)}</div>` : ''}
          <div class="lab-score-bar"><span style="width:${pct}%"></span></div>
          ${result.disagreed ? `<small>${result.disagreed} ruled out</small>` : ''}
        </div>`;
      }).join('') + (railOrder.length > railLimit
        ? `<button class="lab-scores-more text-btn" data-rail-more="1">Show 10 more (${railOrder.length - railLimit} left)</button>`
        : '');
      railPrevRank = rankOf;
    }

    // Results cite their own basis honestly: answers given, skips named,
    // claims settled — never a bare answer count after a skipped question.
    // The propagation explainer answers the natural follow-up ("why did 12
    // answers settle 70 claims?") wherever the basis line appears.
    function basisLine() {
      const answered = Object.keys(qstate.answers).length;
      const decided = E.affirmed(qstate).size + E.rejected(qstate).size;
      const skippedN = Object.keys(qstate.skipped || {}).length;
      return `Based on ${answered} answer${answered === 1 ? '' : 's'} from you${skippedN ? ` (${skippedN} skipped)` : ''} — ${decided} claim${decided === 1 ? '' : 's'} settled in total.`;
    }
    function basisNote() {
      return `${basisLine()} One answer can settle many claims, because answering a claim also settles the claims linked to it.`;
    }

    function renderResults(exhausted) {
      qMain.classList.add('hidden');
      qResult.classList.remove('hidden');
      $('labQuizResume').classList.add('hidden');
      $('labQuizContinue').classList.toggle('hidden', exhausted);
      $('labResultKicker').textContent = 'Your result · alignment, not elimination';
      if (exhausted) {
        // The engine ran out of undecided claims before the round filled up:
        // say so, or the early finish looks like a bug.
        $('labResultTitle').textContent = 'No questions left to ask';
        $('labContinueNote').textContent = 'Your answers settled the remaining questions on their own — every claim they could decide is decided.';
      } else {
        $('labResultTitle').textContent = 'Where your answers land';
        $('labContinueNote').textContent = `${basisNote()} Keep going any time for a sharper picture.`;
      }
      resultLimit = 10;
      paintResultList();
    }
    function resultRowHtml(result, index) {
      // Every row states the alignment count explicitly — including zero —
      // so a visitor can always tell *why* a theory outranks another, and
      // every row carries its rank so no row ever looks rankless.
      // "Aligns with", not "you agree with": the count includes claims
      // settled by entailment and opposites, which the visitor never saw —
      // the headline must not overstate conscious endorsement.
      const line = (result.agreed === 0 && result.disagreed === 0)
        ? `Aligns with 0 of its ${result.total} claim${result.total === 1 ? '' : 's'} — none of this theory's claims came up in your answers.`
        : (result.agreed === 0)
          ? `Aligns with 0 of its ${result.total} claims, and rules out ${result.disagreed}.`
          : `Aligns with ${result.agreed} of its ${result.total} claims${result.disagreed ? `, and rules out ${result.disagreed}` : ''}.`;
      return `
      <div class="lab-result-row${index === 0 ? ' top' : ''}">
        <span class="lab-result-rank">#${index + 1}</span>
        <div><strong>${escapeHtml(result.theory.name)}</strong>
        ${result.theory.blurb ? `<p class="lab-result-blurb">${escapeHtml(result.theory.blurb)}</p>` : ''}
        <p>${line}</p>
        <button class="text-btn" data-inspect="${result.theory.id}">See this theory’s claims below <span aria-hidden="true">↓</span><span class="vh"> — ${escapeHtml(result.theory.name)}</span></button></div>
      </div>`;
    }
    // The full ranking can be 120 rows: show the top 10, expand on demand.
    function paintResultList() {
      const scores = E.score(qstate);
      const maxAgreed = scores.length ? scores[0].agreed : 0;
      const shown = scores.slice(0, resultLimit);
      $('labResultList').innerHTML = (maxAgreed === 0
        ? '<p class="lab-empty">No theory matched your answers — nothing you decided lines up with any theory’s claims. The ranking below leads with the theories your answers ruled out least.</p>'
        : '') + shown.map((result, index) => resultRowHtml(result, index)).join('')
        + (scores.length > resultLimit
          ? `<div class="result-show-all-wrap"><button class="text-btn" data-result-more="1">Show all ${scores.length} theories</button></div>`
          : '');
    }

    $('labQuizBegin').addEventListener('click', startQuiz);
    // Results-page restart gets the same two-tap guard as the mid-round
    // restart: an accidental tap after a long session must not wipe answers.
    const QUIZ_RESTART_IDLE = 'Run it again <span class="arrow">↺</span>';
    let againArmed = false;
    let againTimer = null;
    function disarmAgain() {
      againArmed = false;
      if (againTimer) { clearTimeout(againTimer); againTimer = null; }
      $('labQuizRestart').innerHTML = QUIZ_RESTART_IDLE;
    }
    $('labQuizRestart').addEventListener('click', () => {
      if (againArmed) { disarmAgain(); startQuiz(); return; }
      againArmed = true;
      $('labQuizRestart').textContent = 'Tap again to restart — this clears your answers';
      againTimer = setTimeout(disarmAgain, 10000);
    });
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
      $('labContinueNote').textContent = basisNote();
      const top = E.score(qstate)[0];
      if (top && top.agreed === 0) {
        // Scores are sorted best-first, so a zero top score means every
        // theory sits at zero: an ordered #1..N would fake a recommendation.
        $('labResultList').innerHTML = '<p class="lab-empty">No theories align with your answers yet — nothing you’ve decided matches any theory’s claims. Keep answering and the ranking will take shape.</p>';
      }
      $('labQuizResume').classList.remove('hidden');
    }
    $('labQRanking').addEventListener('click', peekRanking);
    $('labScores').addEventListener('click', (e) => {
      if (e.target.closest('[data-rail-more]')) { railLimit += 10; renderScores(); }
    });
    $('labQuizResume').addEventListener('click', () => {
      $('labQuizResume').classList.add('hidden');
      qResult.classList.add('hidden');
      qMain.classList.remove('hidden');
      renderQuestion();
    });
    $('labAgree').addEventListener('click', () => answerQuestion('yes'));
    $('labDisagree').addEventListener('click', () => answerQuestion('no'));
    $('labNotSure').addEventListener('click', skipQuestion);
    $('labDontUnderstand').addEventListener('click', openExplain);
    $('labExplainStill').addEventListener('click', skipNotUnderstood);
    $('labExplainBack').addEventListener('click', closeExplain);
    // Collapsed "settled" and "tension" details share one delegated toggle:
    // the button names its own list, flips aria-expanded, and swaps its
    // label between "hide" and its resting label.
    qMain.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-settled-more],[data-tension-more]');
      if (!btn) return;
      const list = btn.parentElement.querySelector(
        btn.hasAttribute('data-settled-more') ? '.settled-details' : '.tension-details');
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (list) list.classList.toggle('hidden', open);
      btn.textContent = open ? (btn.getAttribute('data-closed') || '▸ details') : '▾ hide';
    });
    $('labResultList').addEventListener('click', (e) => {
      const more = e.target.closest('[data-result-more]');
      if (more) { resultLimit = E.score(qstate).length; paintResultList(); return; }
      const b = e.target.closest('[data-inspect]');
      if (b) selectTheory(Number(b.dataset.inspect));
    });
    $('labQBack').addEventListener('click', () => {
      const last = qhistory.pop();
      if (!last) return;
      const inRevisit = qRoundCount > QUIZ_ROUND_LENGTH && revisitTotal > 0;
      if (last.action === 'skip') E.unskip(qstate, last.id);
      else E.undo(qstate, last.id); // answers and 'skipNu': undo also clears the not-understood flag
      qRoundCount = Math.max(0, qRoundCount - 1);
      if (inRevisit) revisitLeft = Math.min(revisitTotal, revisitLeft + 1);
      // Backing into the round discards the revisit pass: the un-skipped
      // claims are simply back in the question pool, so nothing vanishes.
      if (qRoundCount < QUIZ_ROUND_LENGTH) { revisitLeft = 0; revisitTotal = 0; revisitDone = new Set(); revisitQueue = []; revisitShown = new Set(); }
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
