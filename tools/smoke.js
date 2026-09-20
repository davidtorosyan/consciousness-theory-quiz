/* DOM-shim smoke test for the claims lab (quiz + explorers).
 * Runs the real data/claims.js, src/claims-engine.js and src/claims-lab.js
 * in Node with a minimal DOM stub, then drives the quiz like a user.
 * Usage: node tools/smoke.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// ---------------------------------------------------------------- shim
const NEED_IDS = ['labQuizStart', 'labQuizMain', 'labQuizResult', 'labQuizBegin', 'labQuizRestart',
  'labQuizContinue', 'labContinueNote', 'labAgree', 'labDisagree', 'labSkip', 'labQBack', 'labQText', 'labQPlain', 'labQCount',
  'labQCoverage', 'labSettled', 'labSettledBy', 'labTension', 'labScores', 'labResultList', 'labClaimGraph',
  'labQRanking', 'labQuizResume', 'labResultKicker', 'labResultTitle', 'labQRestart',
  'labClaimDetail', 'labTheoryList', 'labTheorySearch', 'labDetail', 'labBack', 'labTabClaims', 'labTabTheories',
  'labClaims', 'labTheories', 'quizCountLine', 'exploreDek', 'updateBanner', 'updateReload'];

function matches(el, sel) {
  if (sel.startsWith('.')) {
    const cls = (el.className || '').split(/\s+/);
    return cls.includes(sel.slice(1));
  }
  const m = sel.match(/^\[data-claim="([^"]+)"\]$/);
  if (m) return el.dataset && el.dataset.claim === m[1];
  if (sel === 'svg') return el.tag === 'svg';
  return false;
}

function makeEl(tag, id) {
  const listeners = {};
  const el = {
    tag: tag || 'div', id: id || '', className: '', textContent: '', innerHTML: '', title: '',
    dataset: {}, style: {}, children: [], tabIndex: 0,
    _listeners: listeners,
    _classes: new Set(),
    classList: null,
    addEventListener(t, fn) { (listeners[t] = listeners[t] || []).push(fn); },
    appendChild(c) { this.children.push(c); return c; },
    setAttribute(k, v) { this['_attr_' + k] = v; },
    getAttribute(k) { return this['_attr_' + k]; },
    querySelectorAll(sel) {
      const out = [];
      const walk = (n) => { for (const ch of n.children || []) { if (matches(ch, sel)) out.push(ch); walk(ch); } };
      walk(this); return out;
    },
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; },
    getBoundingClientRect() { return { width: 0, height: 0, left: 0, top: 0, bottom: 0, right: 0 }; },
    scrollIntoView(...a) { this._scrollArgs = a; },
    remove() {},
  };
  el.classList = {
    add: (c) => el._classes.add(c),
    remove: (c) => el._classes.delete(c),
    toggle: (c, f) => { if (f === undefined) f = !el._classes.has(c); f ? el._classes.add(c) : el._classes.delete(c); },
    contains: (c) => el._classes.has(c),
  };
  return el;
}

function boot({ siteBuild = 6, fetchImpl = null } = {}) {
  const registry = new Map();
  NEED_IDS.forEach((id) => registry.set(id, makeEl('div', id)));
  registry.get('updateBanner').classList.add('hidden');

  const env = { reloaded: false, els: registry };
  const win = {
    SITE_BUILD: siteBuild,
    addEventListener() {},
  };
  const doc = {
    readyState: 'complete',
    documentElement: { style: {} },
    getElementById: (id) => registry.get(id) || null,
    createElement: (tag) => makeEl(tag),
    createElementNS: (ns, tag) => makeEl(tag),
    addEventListener() {},
  };
  const sandbox = {
    window: win, document: doc,
    location: { reload() { env.reloaded = true; } },
    fetch: fetchImpl || (() => Promise.reject(new Error('no network in smoke test'))),
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: () => {},
    console,
    setTimeout, clearTimeout,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const run = (code, name) => vm.runInContext(code, sandbox, { filename: name });
  run(read('data/theories.js'), 'theories.js');
  run(read('data/claims.js'), 'claims.js');
  run(read('src/claims-engine.js'), 'claims-engine.js');
  run(read('src/claims-lab.js'), 'claims-lab.js');
  env.window = win;
  return env;
}

function click(env, id, event) {
  const el = env.els.get(id);
  const fns = el._listeners.click || [];
  if (!fns.length) throw new Error(`no click listener on #${id}`);
  fns.forEach((fn) => fn(event || { target: { closest: () => null }, preventDefault() {} }));
}
const text = (env, id) => env.els.get(id).textContent;
const html = (env, id) => env.els.get(id).innerHTML;
const hidden = (env, id) => env.els.get(id).classList.contains('hidden');
function fireInput(env, id, value) {
  const el = env.els.get(id);
  el.value = value;
  (el._listeners.input || []).forEach((fn) => fn({ target: el }));
}
// Results-page restart is two-tap: arm, then confirm.
function restartQuiz(env) { click(env, 'labQuizRestart'); click(env, 'labQuizRestart'); }

// ---------------------------------------------------------------- checks
let failures = 0;
function check(cond, label) {
  if (cond) console.log(`  ok: ${label}`);
  else { failures++; console.log(`  FAIL: ${label}`); }
}

async function main() {
  console.log('booting claims lab in DOM shim…');
  const env = boot();
  const { window: win } = env;
  const CLAIMS = win.CLAIMS, THEORIES = win.CLAIM_THEORIES;
  const N = CLAIMS.length, M = THEORIES.length;
  const claimText = new Map(CLAIMS.map((c) => [c.text, c.id]));
  console.log(`data: ${N} claims, ${M} theories`);

  check(text(env, 'quizCountLine') === `${N} claims · ${M} theories`, `quiz start shows ${N} claims · ${M} theories`);
  check(text(env, 'exploreDek').includes(`${N} claims`) && text(env, 'exploreDek').includes(`${M} theories mapped so far`),
    'explorer dek is dynamic');
  check(env.els.get('labClaimGraph').querySelectorAll('.dag-node').length === N, `graph rendered ${N} claim nodes`);
  const qRankingTag = read('index.html').match(/<button[^>]*id="labQRanking"[^>]*>/);
  check(!!qRankingTag && !qRankingTag[0].includes('hidden'),
    'ranking button is visible by default in markup (round 1+, not gated on round 2)');
  const scrollers = env.els.get('labClaimGraph').querySelectorAll('.dag-scroll');
  const badPlural = [...scrollers].filter(s => (s.getAttribute('aria-label') || '').includes('1 connected claims'));
  check(scrollers.length > 0 && badPlural.length === 0, `claim group labels pluralize correctly (${scrollers.length} groups)`);
  const internalIds = [...scrollers].filter(s => (s.getAttribute('aria-label') || '').includes('Claim map cluster'));
  check(internalIds.length === 0, 'no internal cluster ids leak into group labels');
  const firstNode = env.els.get('labClaimGraph').querySelectorAll('.dag-node')[0];
  check(firstNode.title === '' && firstNode.getAttribute('title') === undefined,
    'graph node buttons carry no title (claim text exposed once to screen readers)');
  check(String(firstNode.getAttribute('data-plain') || '').startsWith('Put simply:'),
    'graph nodes carry a plain-language tooltip for sighted users');
  const listHtml = html(env, 'labTheoryList');
  const withClaims = (listHtml.match(/data-theory="/g) || []).length;
  const pending = (listHtml.match(/data-meta="/g) || []).length;
  check(withClaims === M && pending === 120 - M, `theory list: ${M} with claims + ${120 - M} pending (got ${withClaims}+${pending})`);

  // no internal claim ids leak into visible UI
  const graphHtml = html(env, 'labClaimGraph');
  check(!graphHtml.includes('dag-node-id') && !/>c\d+</.test(graphHtml),
    'graph nodes show no internal claim ids');
  const CE2 = win.ClaimsEngine.bound();
  const withImplied = THEORIES.find(t => [...CE2.theoryFullClaims(t)].some(x => !(t.claims || []).includes(x)));
  check(!!withImplied, 'test setup: found a theory with implied claims');
  click(env, 'labTheoryList', { target: { closest: (sel) => sel === '[data-theory]' ? { dataset: { theory: String(withImplied.id) } } : null }, preventDefault() {} });
  const detailHtml = html(env, 'labDetail');
  check(!/via c\d/.test(detailHtml) && !detailHtml.includes('lab-claim-id">c'),
    'theory detail shows no internal claim ids (via-lines and implied markers are plain language)');
  check(read('src/claims-lab.js').includes("root.style.scrollBehavior = 'auto'"),
    'node-click scroll suppresses the CSS smooth behavior for an instant jump');

  // jargon regression guard: removed terms must not reappear unglossed
  const banned = ['numerically identical', 'subpersonal', 'prime mover', 'explanatory gap', 'non-separability'];
  const bad = [];
  for (const c of CLAIMS) {
    const hay = `${c.text} ${c.short || ''} ${c.plain || ''}`.toLowerCase();
    for (const b of banned) if (hay.includes(b)) bad.push(`${c.id}:${b}`);
  }
  for (const t of THEORIES) {
    const hay = `${t.name} ${t.blurb || ''}`.toLowerCase();
    for (const b of banned) if (hay.includes(b)) bad.push(`theory${t.id}:${b}`);
  }
  check(bad.length === 0, `no regressed jargon in claims/theories${bad.length ? ' (' + bad.slice(0, 6).join(', ') + ')' : ''}`);
  const badShorts = CLAIMS.filter(c => (c.short || '').startsWith('Phenomenal')).map(c => c.id);
  check(badShorts.length === 0, `no short label leads with unglossed 'Phenomenal'${badShorts.length ? ' (' + badShorts.join(',') + ')' : ''}`);
  const lowShorts = CLAIMS.filter(c => /^[a-z]/.test(c.short || 'x')).map(c => c.id);
  check(lowShorts.length === 0, `all short labels capitalized${lowShorts.length ? ' (' + lowShorts.join(',') + ')' : ''}`);
  const noShorts = CLAIMS.filter(c => !(c.short || '').trim()).map(c => c.id);
  check(noShorts.length === 0, `every claim has a short label${noShorts.length ? ' (' + noShorts.join(',') + ')' : ''}`);

  // theory search filter
  fireInput(env, 'labTheorySearch', 'integrated information');
  const filteredHtml = html(env, 'labTheoryList');
  const filteredCount = (filteredHtml.match(/data-theory="/g) || []).length;
  check(filteredCount >= 1 && filteredCount < withClaims, `theory search filters the list (got ${filteredCount})`);
  check(filteredHtml.toLowerCase().includes('integrated information'), 'theory search finds IIT');
  fireInput(env, 'labTheorySearch', 'zzz-no-such-theory');
  check(html(env, 'labTheoryList').includes('No theories match'), 'theory search shows empty state');
  fireInput(env, 'labTheorySearch', '');
  check(!html(env, 'labTheoryList').toLowerCase().includes('specific claim'),
    'theory list buttons count total claims (specific + implied), not just specific ones');
  check(!read('src/claims-lab.js').includes('inherited-wrap') && !read('styles.css').includes('inherited-wrap'),
    'no leftover inherited-wrap CSS class anywhere');

  // claim detail headers
  click(env, 'labClaimGraph', { target: { closest: () => ({ dataset: { claim: 'c9' } }) } });
  check(html(env, 'labClaimDetail').includes('↑ Broader claims this leads to') &&
    html(env, 'labClaimDetail').includes('↓ More specific claims built on this'),
    'claim detail headers show implication direction');
  check(html(env, 'labClaimDetail').includes('Theories affirming this claim'),
    'claim detail uses the consistent "affirming this claim" heading');
  const scrollArgs = env.els.get('labClaimDetail')._scrollArgs;
  check(!!scrollArgs && scrollArgs[0] && scrollArgs[0].block === 'start',
    'clicking a graph node scrolls the detail panel into view (block: start)');
  check(!html(env, 'labClaimDetail').includes('>Claim c'),
    'claim detail header shows no internal claim id');
  click(env, 'labQuizBegin');
  check(html(env, 'labClaimDetail') === '' && html(env, 'labDetail') === '',
    'starting a fresh quiz clears any open explorer panels');
  check(!read('src/claims-lab.js').includes(' rejected</small>') &&
    !read('src/claims-lab.js').includes('You reject ') &&
    !read('src/claims-lab.js').includes('and reject ') &&
    !read('src/claims-lab.js').includes('you rejected.'),
    'results and rail copy says "rule out", not "reject"');
  check(read('index.html').includes('aria-label="Filter theories by name, family, or topic"'),
    'theory filter label names what it actually matches');

  // quiz flow
  click(env, 'labQuizBegin');
  check(!hidden(env, 'labQuizMain') && hidden(env, 'labQuizStart'), 'quiz starts');
  check(text(env, 'labQText').length > 20, 'question text renders');
  check(claimText.get(text(env, 'labQText')) === 'c34', 'first question is the gentle opener (c34), not c0');
  check(text(env, 'labQCount') === '1 of 12', 'progress shows question N of 12: ' + text(env, 'labQCount'));
  check(text(env, 'labQPlain').startsWith('Put simply:'), 'put-simply line renders');
  check(text(env, 'labQCoverage').includes('Why this question') && text(env, 'labQCoverage').includes('agreeing decides') && text(env, 'labQCoverage').includes('disagreeing decides'),
    'coverage copy is per-direction and plain-language: ' + text(env, 'labQCoverage').slice(0, 90));
  check(!hidden(env, 'labQRanking'), 'ranking peek is offered from round 1, not just round 2');

  // back button
  const q1 = text(env, 'labQText');
  click(env, 'labAgree');
  const q2 = text(env, 'labQText');
  check(q1 !== q2, 'answering advances to next question');
  check(text(env, 'labQCount') === '2 of 12', 'counter advances after answering: ' + text(env, 'labQCount'));
  click(env, 'labQBack');
  check(text(env, 'labQText') === q1, 'back returns to previous question');
  check(text(env, 'labQCount') === '1 of 12', 'counter decrements on back: ' + text(env, 'labQCount'));
  click(env, 'labAgree'); // re-answer, move on

  // skip -> back must return the exact skipped question, not a re-derived one
  const qs1 = text(env, 'labQText');
  click(env, 'labSkip');
  const qs2 = text(env, 'labQText');
  check(qs1 !== qs2, 'skipping advances to the next question');
  click(env, 'labQBack');
  check(text(env, 'labQText') === qs1, 'back after skip returns the exact skipped question');
  check(text(env, 'labQCount') === '2 of 12', 'counter decrements on back after skip');
  click(env, 'labSkip'); // skip again, move on

  // mid-round restart: first tap arms it, second tap restarts the quiz
  check(!!env.els.get('labQRestart'), 'mid-round restart button exists');
  click(env, 'labQRestart');
  check(text(env, 'labQRestart').includes('Tap again'), 'first tap arms the restart: ' + text(env, 'labQRestart').slice(0, 40));
  click(env, 'labQRestart');
  check(text(env, 'labQCount') === '1 of 12', 'second tap restarts the quiz at question 1: ' + text(env, 'labQCount'));
  check(text(env, 'labQRestart') === 'Restart ↺', 'restart button disarms after restarting');
  click(env, 'labAgree'); // answer once more to resync the engine mirror below
  check(html(env, 'labScores').includes(' of '), 'live alignment scores render');
  check(html(env, 'labScores').includes('data-peek-ranking'),
    'rail "full ranking any time" is a live button that opens the ranking peek');
  check(html(env, 'labScores').includes('lab-score-blurb'), 'live scores show theory blurbs');

  // directional settled trace, verified against an engine mirror of quiz state.
  // Note: in a skip-free quiz, agreeing can never propagate — any undecided
  // ancestor would outscore its descendant and be asked first. So phase A
  // skips root claims to set up a genuine affirm-propagation.
  restartQuiz(env);
  const CE = win.ClaimsEngine;
  const settledOf = (mirror) => new Set([...CE.affirmed(CLAIMS, mirror), ...CE.rejected(CLAIMS, mirror)]);
  let sawAffirm = false, sawReject = false, rounds = 0;

  // Phase A: affirm direction
  const mirrorA = CE.newQuiz();
  while (!sawAffirm && rounds++ < 15) {
    const q = CE.nextQuestion(CLAIMS, mirrorA);
    if (!q || !hidden(env, 'labQuizResult')) break;
    check(claimText.get(text(env, 'labQText')) === q.id, `UI stays in sync with engine (round ${rounds})`);
    const settled = settledOf(mirrorA);
    const newAnc = [...CE.ancestors(CLAIMS, q.id)].filter((id) => !settled.has(id));
    if (newAnc.length) {
      click(env, 'labAgree');
      CE.answer(mirrorA, q.id, 'yes');
      const t = text(env, 'labSettledBy');
      sawAffirm = true;
      check(t.startsWith('Last question: that also decided:') && t.endsWith('they follow from the claim you agreed with.'),
        'affirm trace explains direction: ' + t.slice(0, 110));
    } else {
      click(env, 'labSkip');
      CE.skip(mirrorA, q.id);
      check(text(env, 'labSettledBy') === 'Last question: skipped — nothing decided.', 'skip line renders');
    }
  }
  check(sawAffirm, 'observed an affirm-propagation trace');

  // Phase B: reject direction (fresh quiz)
  restartQuiz(env);
  const mirrorB = CE.newQuiz();
  rounds = 0;
  while (!sawReject && rounds++ < 15) {
    const q = CE.nextQuestion(CLAIMS, mirrorB);
    if (!q || !hidden(env, 'labQuizResult')) break;
    const settled = settledOf(mirrorB);
    const newDesc = [...CE.descendants(CLAIMS, q.id)].filter((id) => !settled.has(id));
    if (newDesc.length) {
      click(env, 'labDisagree');
      CE.answer(mirrorB, q.id, 'no');
      const t = text(env, 'labSettledBy');
      sawReject = true;
      check(t.startsWith('Last question: that also ruled out:') && t.endsWith('they were built on the claim you ruled out.'),
        'reject trace explains direction: ' + t.slice(0, 110));
    } else {
      const newAnc = [...CE.ancestors(CLAIMS, q.id)].filter((id) => !settled.has(id));
      click(env, 'labAgree');
      CE.answer(mirrorB, q.id, 'yes');
      const t = text(env, 'labSettledBy');
      if (newAnc.length) {
        check(t.startsWith('Last question: that also decided:') && t.endsWith('they follow from the claim you agreed with.'),
          'affirm trace explains direction: ' + t.slice(0, 110));
      } else {
        check(t === 'Last question: that decided just this claim.', 'no-propagation line renders');
      }
    }
  }
  check(sawReject, 'observed a reject-propagation trace');

  // skip
  if (hidden(env, 'labQuizResult')) {
    const qs = text(env, 'labQText');
    click(env, 'labSkip');
    check(text(env, 'labQText') !== qs || !hidden(env, 'labQuizResult'), 'skip advances');
  }

  // engine-level: contradictions + validation
  const mContra = CE.newQuiz();
  CE.answer(mContra, 'c0', 'yes');
  CE.answer(mContra, 'c6', 'yes');
  check(CE.contradictions(CLAIMS, mContra).length === 1, 'engine reports the c0/c6 contradiction');
  check(CE.validate(CLAIMS, THEORIES).length === 0, 'claims-engine validation has no problems');

  // rail shows top 8, not all 120
  const railRows = (html(env, 'labScores').match(/lab-score-row/g) || []).length;
  check(railRows === 8, `rail shows top 8 theories during quiz (got ${railRows})`);
  check(html(env, 'labScores').includes('112 more theories'), 'rail notes the remaining theories');
  const railFracs = (html(env, 'labScores').match(/<span>\d+ of \d+<\/span>/g) || []).length;
  check(railFracs === railRows, `every rail row shows an X-of-Y fraction (got ${railFracs}/${railRows})`);

  // round cap + continue + tension notes (all-agree run)
  restartQuiz(env);
  let sawTension = false, sawPreNudge = false, answered = 0;
  while (hidden(env, 'labQuizResult') && answered < 20) {
    const t = text(env, 'labTension');
    if (t.length > 0) sawTension = true;
    if (t.includes('would pull against')) sawPreNudge = true;
    click(env, 'labAgree');
    answered++;
  }
  check(answered === 12 && !hidden(env, 'labQuizResult'), `quiz stops after a 12-question round (answered ${answered})`);
  check(sawTension, 'tension note appears when affirming contradictory claims');
  check(sawPreNudge, 'pre-answer heads-up appears before affirming a contradictory claim');
  check(!hidden(env, 'labQuizContinue'), 'continue button offered after a round');
  check(text(env, 'labContinueNote').includes('Based on 12 answers from you'), 'continue note cites answer count and settled claims');
  click(env, 'labQuizContinue');
  check(!hidden(env, 'labQuizMain') && hidden(env, 'labQuizResult'), 'continue resumes the quiz');
  check(text(env, 'labQCount') === '1 of 12 · round 2', 'round 2 counter names the round: ' + text(env, 'labQCount'));
  // mid-round ranking peek (round 2+): results over current answers, resume returns untouched
  check(!hidden(env, 'labQRanking'), 'round 2 offers a current-ranking peek');
  const rqBefore = text(env, 'labQText');
  click(env, 'labQRanking');
  check(!hidden(env, 'labQuizResult') && hidden(env, 'labQuizMain'), 'ranking peek shows the results view');
  check(!hidden(env, 'labQuizResume') && hidden(env, 'labQuizContinue'), 'peek offers resume, not continue');
  check(html(env, 'labResultList').includes('You agree with'), 'peek renders the live ranking');
  check(text(env, 'labResultTitle') === 'Where your answers land so far', 'peek uses an interim header, not the final-results header');
  click(env, 'labQuizResume');
  check(!hidden(env, 'labQuizMain') && hidden(env, 'labQuizResult'), 'resume returns to the quiz');
  check(text(env, 'labQText') === rqBefore, 'resume restores the same question');
  const mainScroll = env.els.get('labQuizMain')._scrollArgs;
  check(!!mainScroll && mainScroll[0] && mainScroll[0].block === 'start',
    'continuing scrolls the new question into view');

  // peek with zero agreement: an honest empty state, not an arbitrary ranking
  restartQuiz(env);
  for (let i = 0; i < 4; i++) click(env, 'labDisagree');
  click(env, 'labQRanking');
  check(html(env, 'labResultList').includes('No theories align with your answers yet'),
    'zero-agreement peek shows an honest empty state instead of an arbitrary ranking');
  click(env, 'labQuizResume');
  check(!hidden(env, 'labQuizMain') && hidden(env, 'labQuizResult'), 'resume works after the empty-state peek');

  // complete the quiz
  restartQuiz(env);
  let guard = 0;
  while (hidden(env, 'labQuizResult') && guard++ < N + 50) click(env, 'labAgree');
  check(!hidden(env, 'labQuizResult'), 'quiz completes to results screen');
  check(html(env, 'labResultList').includes('You agree with'), 'results use X-of-Y alignment framing');
  check(html(env, 'labResultList').includes('lab-result-blurb'), 'results rows show theory blurbs');
  check(html(env, 'labResultList').includes('data-inspect'), 'results have inspect-claims buttons');
  check((html(env, 'labResultList').match(/<span class="vh">/g) || []).length === M,
    'inspect buttons carry a screen-reader-only theory name');
  // every result row must explain its own ranking — no silent rows
  const resHtml = html(env, 'labResultList');
  const resRows = (resHtml.match(/class="lab-result-row/g) || []).length;
  const resLines = (resHtml.match(/You agree with \d+ of its|You rule out \d+ of its|None of this theory's claims came up/g) || []).length;
  check(resRows === M, `results render all ${M} theories (got ${resRows})`);
  check(resLines === M, `every result row explains its alignment (got ${resLines}/${resRows})`);
  check(!resHtml.includes('No theory matched your answers'), 'ordering explainer absent when theories do match');

  // untouched theories: a fresh all-skip run leaves every theory untouched
  restartQuiz(env);
  guard = 0;
  while (hidden(env, 'labQuizResult') && guard++ < N + 50) click(env, 'labSkip');
  check(!hidden(env, 'labQuizResult'), 'all-skip run completes');
  const untouched = (html(env, 'labResultList').match(/None of this theory's claims came up/g) || []).length;
  check(untouched === M, `all ${M} theories explain themselves when untouched (got ${untouched})`);
  check(html(env, 'labResultList').includes('No theory matched your answers — nothing you decided lines up'),
    'zero-match results explain the ordering instead of presenting a bare ranking');

  // exhaustion: disagree across "keep answering" rounds until the engine runs
  // out of undecided claims, then the results must explain the early finish
  restartQuiz(env);
  guard = 0;
  let exhaustedTitle = '';
  while (guard++ < 500) {
    if (!hidden(env, 'labQuizResult')) {
      exhaustedTitle = text(env, 'labResultTitle');
      if (exhaustedTitle === 'No questions left to ask') break;
      click(env, 'labQuizContinue');
    } else {
      click(env, 'labDisagree');
    }
  }
  check(exhaustedTitle === 'No questions left to ask',
    `exhausted round titles itself "No questions left to ask" (took ${guard} steps)`);
  check(text(env, 'labContinueNote').includes('settled the remaining questions on their own'),
    'exhausted round explains the early finish');
  check(hidden(env, 'labQuizContinue'), 'exhausted round offers no continue button');

  // answer buttons carry no external-link arrow (CSS ::after)
  check(!read('styles.css').includes('.answer-btn::after'),
    'answer buttons have no misleading external-link arrow');

  // restart: results-page restart needs the same two-tap confirm as mid-round
  click(env, 'labQuizRestart');
  check(text(env, 'labQuizRestart').includes('Tap again to restart'), 'results restart arms on first tap instead of wiping');
  check(!hidden(env, 'labQuizResult'), 'first tap leaves the results in place');
  click(env, 'labQuizRestart');
  check(!hidden(env, 'labQuizMain') && text(env, 'labQText').length > 0, 'second tap restarts the quiz');

  // reload button
  click(env, 'updateReload');
  check(env.reloaded, 'reload button triggers location.reload');

  // version freshness banner
  console.log('testing version-freshness banner…');
  const stale = boot({ siteBuild: 4, fetchImpl: () => Promise.resolve({ json: () => Promise.resolve({ build: 6 }) }) });
  await new Promise((r) => setTimeout(r, 50));
  check(!stale.els.get('updateBanner').classList.contains('hidden'), 'banner appears when server build is newer');
  const fresh = boot({ siteBuild: 6, fetchImpl: () => Promise.resolve({ json: () => Promise.resolve({ build: 6 }) }) });
  await new Promise((r) => setTimeout(r, 50));
  check(fresh.els.get('updateBanner').classList.contains('hidden'), 'banner stays hidden when build is current');

  console.log(failures ? `\n${failures} FAILURES` : '\nALL SMOKE TESTS PASSED');
  process.exit(failures ? 1 : 0);
}

main().catch((e) => { console.error('HARNESS ERROR:', e); process.exit(2); });
