/*
  Claims lab — prototype UI for the claims-DAG classification model.
  Two tabs:
    1. Explore — claims debugger: pick a theory, see its claims, click any
       claim to see what it entails (ancestors) and what is built on it
       (descendants), plus which theories affirm it.
    2. Quiz — prototype DAG-driven quiz: each step asks the undecided claim
       whose answer settles the most other claims; theories score by
       "agrees with X of Y claims".
*/
(function () {
  'use strict';

  function init() {
    if (!window.ClaimsEngine || !window.CLAIMS) return;
    const E = window.ClaimsEngine.bound();
    const $ = (id) => document.getElementById(id);

    const claimById = new Map(E.claims.map(c => [c.id, c]));
    const theoryById = new Map(E.theories.map(t => [t.id, t]));

    /* ---------------- tabs ---------------- */
    const tabExplore = $('labTabExplore'), tabQuiz = $('labTabQuiz');
    const paneExplore = $('labExplore'), paneQuiz = $('labQuiz');
    function showTab(which) {
      const explore = which === 'explore';
      tabExplore.classList.toggle('active', explore);
      tabQuiz.classList.toggle('active', !explore);
      paneExplore.classList.toggle('hidden', !explore);
      paneQuiz.classList.toggle('hidden', explore);
      tabExplore.setAttribute('aria-selected', String(explore));
      tabQuiz.setAttribute('aria-selected', String(!explore));
    }
    tabExplore.addEventListener('click', () => showTab('explore'));
    tabQuiz.addEventListener('click', () => showTab('quiz'));

    /* ---------------- explorer ---------------- */
    const theoryList = $('labTheoryList');
    const detail = $('labDetail');
    let navStack = []; // {kind:'theory'|'claim', id}

    function claimChip(id, extra) {
      const c = claimById.get(id);
      return `<button class="lab-claim-chip${extra ? ' ' + extra : ''}" data-claim="${id}" title="${escapeHtml(c.text)}">${id}</button>`;
    }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    function renderTheoryList() {
      theoryList.innerHTML = E.theories.map(t =>
        `<button class="lab-theory-btn" data-theory="${t.id}">
           <strong>${escapeHtml(t.name)}</strong>
           <span>${escapeHtml(t.family)} · ${t.claims.length} specific claim${t.claims.length === 1 ? '' : 's'}</span>
         </button>`
      ).join('');
    }

    function viaWhich(theory, inheritedId) {
      // Which specific claim(s) of this theory entail the inherited claim?
      return (theory.claims || []).filter(sid =>
        sid !== inheritedId && E.ancestors(sid).has(inheritedId));
    }

    function renderTheory(id) {
      const t = theoryById.get(id);
      if (!t) return;
      const full = E.theoryFullClaims(t);
      const direct = new Set(t.claims);
      const inherited = [...full].filter(x => !direct.has(x));
      detail.innerHTML = `
        <p class="micro">Theory · ${escapeHtml(t.family)}</p>
        <h3>${escapeHtml(t.name)}</h3>
        <p class="micro">Specific claims (listed by the theory)</p>
        <div class="lab-chip-row">${[...direct].map(cid => claimChip(cid, 'direct')).join('')}</div>
        ${inherited.length ? `
          <p class="micro">Inherited claims (entailed by the specific ones)</p>
          <div class="lab-chip-row">${inherited.map(cid => {
            const via = viaWhich(t, cid).join(', ');
            return `<span class="lab-inherited-wrap">${claimChip(cid)}<small>via ${via}</small></span>`;
          }).join('')}</div>` : ''}
        <div class="lab-claim-texts">
          ${[...full].map(cid => {
            const c = claimById.get(cid);
            return `<div class="lab-claim-text${direct.has(cid) ? ' direct' : ''}">
              <span class="lab-claim-id">${cid}${direct.has(cid) ? '' : ' · inherited'}</span>
              <p>${escapeHtml(c.text)}</p>
            </div>`;
          }).join('')}
        </div>`;
    }

    function renderClaim(id) {
      const c = claimById.get(id);
      if (!c) return;
      const anc = [...E.ancestors(id)];
      const desc = [...E.descendants(id)];
      const affirming = E.theories.filter(t => E.theoryFullClaims(t).has(id));
      detail.innerHTML = `
        <p class="micro">Claim ${id}</p>
        <h3 class="lab-claim-title">${escapeHtml(c.text)}</h3>
        <p class="lab-plain">Put simply: ${escapeHtml(c.plain)}</p>
        <div class="lab-claim-cols">
          <div>
            <p class="micro">Entails — saying yes here settles these as yes</p>
            ${anc.length ? `<div class="lab-chip-row">${anc.map(a => claimChip(a)).join('')}</div>`
                        : `<p class="lab-empty">Nothing — this is a base claim.</p>`}
          </div>
          <div>
            <p class="micro">Built on this — saying no here knocks these out</p>
            ${desc.length ? `<div class="lab-chip-row">${desc.map(d => claimChip(d)).join('')}</div>`
                         : `<p class="lab-empty">Nothing — nothing depends on this yet.</p>`}
          </div>
        </div>
        <p class="micro">Theories affirming this claim</p>
        <div class="lab-chip-row">
          ${affirming.map(t => {
            const direct = (t.claims || []).includes(id);
            return `<button class="lab-theory-chip${direct ? ' direct' : ''}" data-theory="${t.id}"
              title="${direct ? 'Listed directly' : 'Inherited'}">${escapeHtml(t.name)}${direct ? '' : ' · inherited'}</button>`;
          }).join('') || '<p class="lab-empty">None of the prototype theories.</p>'}
        </div>`;
    }

    function navTo(view) {
      navStack.push(view);
      renderNav();
    }
    function renderNav() {
      const cur = navStack[navStack.length - 1];
      $('labBack').classList.toggle('hidden', navStack.length <= 1);
      if (!cur) { detail.innerHTML = `<p class="lab-empty">Pick a theory on the left to inspect its claims.</p>`; return; }
      if (cur.kind === 'theory') renderTheory(cur.id);
      else renderClaim(cur.id);
    }

    detail.addEventListener('click', (e) => {
      const cb = e.target.closest('[data-claim]');
      const tb = e.target.closest('[data-theory]');
      if (cb) navTo({ kind: 'claim', id: cb.dataset.claim });
      else if (tb) navTo({ kind: 'theory', id: Number(tb.dataset.theory) });
    });
    theoryList.addEventListener('click', (e) => {
      const b = e.target.closest('[data-theory]');
      if (b) { navStack = [{ kind: 'theory', id: Number(b.dataset.theory) }]; renderNav(); }
    });
    $('labBack').addEventListener('click', () => { navStack.pop(); renderNav(); });

    renderTheoryList();
    renderNav();

    /* ---------------- prototype quiz ---------------- */
    const qStart = $('labQuizStart'), qMain = $('labQuizMain'), qResult = $('labQuizResult');
    let qstate = null, qhistory = [];

    function startQuiz() {
      qstate = E.newQuiz();
      qhistory = [];
      qStart.classList.add('hidden');
      qResult.classList.add('hidden');
      qMain.classList.remove('hidden');
      renderQuestion();
    }

    function currentQ() { return E.nextQuestion(qstate); }

    function renderQuestion() {
      const q = currentQ();
      if (!q) { renderResults(); return; }
      const c = claimById.get(q.id);
      $('labQCount').textContent = String(qhistory.length + 1).padStart(2, '0');
      $('labQText').textContent = c.text;
      $('labQPlain').textContent = c.plain;
      $('labQCoverage').textContent = `Answering settles ${q.coverage} claim${q.coverage === 1 ? '' : 's'} — the most informative question right now.`;
      $('labQBack').classList.toggle('hidden', qhistory.length === 0);
      renderScores();
    }

    function answerQuestion(yesNo) {
      const q = currentQ();
      if (!q) return;
      E.answer(qstate, q.id, yesNo);
      qhistory.push(q.id);
      renderQuestion();
    }

    function renderScores() {
      const scores = E.score(qstate);
      $('labScores').innerHTML = scores.map(r => {
        const pct = r.total ? Math.round(100 * r.agreed / r.total) : 0;
        return `<div class="lab-score-row">
          <div class="lab-score-top"><strong>${escapeHtml(r.theory.name)}</strong>
          <span>${r.agreed} of ${r.total}</span></div>
          <div class="lab-score-bar"><span style="width:${pct}%"></span></div>
          ${r.disagreed ? `<small>${r.disagreed} rejected</small>` : ''}
        </div>`;
      }).join('');
    }

    function renderResults() {
      qMain.classList.add('hidden');
      qResult.classList.remove('hidden');
      const scores = E.score(qstate);
      $('labResultList').innerHTML = scores.map((r, i) => `
        <div class="lab-result-row${i === 0 ? ' top' : ''}">
          <span class="lab-result-rank">${i + 1}</span>
          <div><strong>${escapeHtml(r.theory.name)}</strong>
          <p>You agree with ${r.agreed} of its ${r.total} claims${r.disagreed ? `, and reject ${r.disagreed}` : ''}.</p></div>
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

    showTab('explore');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
