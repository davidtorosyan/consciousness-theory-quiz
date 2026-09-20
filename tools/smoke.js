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
  'labAgree', 'labDisagree', 'labSkip', 'labQBack', 'labQText', 'labQPlain', 'labQCount',
  'labQCoverage', 'labSettled', 'labSettledBy', 'labScores', 'labResultList', 'labClaimGraph',
  'labClaimDetail', 'labTheoryList', 'labDetail', 'labBack', 'labTabClaims', 'labTabTheories',
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
    scrollIntoView() {},
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
  console.log(`data: ${N} claims, ${M} theories`);

  check(text(env, 'quizCountLine') === `${N} claims · ${M} theories`, `quiz start shows ${N} claims · ${M} theories`);
  check(text(env, 'exploreDek').includes(`${N} claims`) && text(env, 'exploreDek').includes(`${M} theories mapped so far`),
    'explorer dek is dynamic');
  check(env.els.get('labClaimGraph').querySelectorAll('.dag-node').length === N, `graph rendered ${N} claim nodes`);
  const listHtml = html(env, 'labTheoryList');
  const withClaims = (listHtml.match(/data-theory="/g) || []).length;
  const pending = (listHtml.match(/data-meta="/g) || []).length;
  check(withClaims === M && pending === 120 - M, `theory list: ${M} with claims + ${120 - M} pending (got ${withClaims}+${pending})`);

  // claim detail headers
  click(env, 'labClaimGraph', { target: { closest: () => ({ dataset: { claim: 'c9' } }) } });
  check(html(env, 'labClaimDetail').includes('↑ What this implies (broader claims)') &&
    html(env, 'labClaimDetail').includes('↓ What implies this (more specific claims)'),
    'claim detail headers show implication direction');

  // quiz flow
  click(env, 'labQuizBegin');
  check(!hidden(env, 'labQuizMain') && hidden(env, 'labQuizStart'), 'quiz starts');
  check(text(env, 'labQText').length > 20, 'question text renders');
  check(text(env, 'labQPlain').startsWith('Put simply:'), 'put-simply line renders');
  check(text(env, 'labQCoverage').includes('Agreeing settles') && text(env, 'labQCoverage').includes('disagreeing settles'),
    'coverage copy is per-direction: ' + text(env, 'labQCoverage').slice(0, 80));

  // back button
  const q1 = text(env, 'labQText');
  click(env, 'labAgree');
  const q2 = text(env, 'labQText');
  check(q1 !== q2, 'answering advances to next question');
  click(env, 'labQBack');
  check(text(env, 'labQText') === q1, 'back returns to previous question');
  click(env, 'labAgree'); // re-answer, move on

  check(html(env, 'labScores').includes(' of '), 'live alignment scores render');
  check(html(env, 'labScores').includes('lab-score-blurb'), 'live scores show theory blurbs');

  // directional settled trace, verified against an engine mirror of quiz state.
  // Note: in a skip-free quiz, agreeing can never propagate — any undecided
  // ancestor would outscore its descendant and be asked first. So phase A
  // skips root claims to set up a genuine affirm-propagation.
  click(env, 'labQuizRestart');
  const CE = win.ClaimsEngine;
  const claimText = new Map(CLAIMS.map((c) => [c.text, c.id]));
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
      check(t.startsWith('That also settled:') && t.endsWith('they follow from the claim you agreed with.'),
        'affirm trace explains direction: ' + t.slice(0, 100));
    } else {
      click(env, 'labSkip');
      CE.skip(mirrorA, q.id);
      check(text(env, 'labSettledBy') === 'Skipped — nothing settled.', 'skip line renders');
    }
  }
  check(sawAffirm, 'observed an affirm-propagation trace');

  // Phase B: reject direction (fresh quiz)
  click(env, 'labQuizRestart');
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
      check(t.startsWith('That also ruled out:') && t.endsWith('they were built on the claim you rejected.'),
        'reject trace explains direction: ' + t.slice(0, 100));
    } else {
      const newAnc = [...CE.ancestors(CLAIMS, q.id)].filter((id) => !settled.has(id));
      click(env, 'labAgree');
      CE.answer(mirrorB, q.id, 'yes');
      const t = text(env, 'labSettledBy');
      if (newAnc.length) {
        check(t.startsWith('That also settled:') && t.endsWith('they follow from the claim you agreed with.'),
          'affirm trace explains direction: ' + t.slice(0, 100));
      } else {
        check(t === 'That settles just this claim.', 'no-propagation line renders');
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

  // complete the quiz
  let guard = 0;
  while (hidden(env, 'labQuizResult') && guard++ < N + 50) click(env, 'labAgree');
  check(!hidden(env, 'labQuizResult'), 'quiz completes to results screen');
  check(html(env, 'labResultList').includes('You agree with'), 'results use X-of-Y alignment framing');
  check(html(env, 'labResultList').includes('lab-result-blurb'), 'results rows show theory blurbs');
  check(html(env, 'labResultList').includes('data-inspect'), 'results have inspect-claims buttons');

  // untouched theories: a fresh all-skip run leaves every theory untouched
  click(env, 'labQuizRestart');
  guard = 0;
  while (hidden(env, 'labQuizResult') && guard++ < N + 50) click(env, 'labSkip');
  check(!hidden(env, 'labQuizResult'), 'all-skip run completes');
  const untouched = (html(env, 'labResultList').match(/None of this theory's claims came up/g) || []).length;
  check(untouched === M, `all ${M} theories explain themselves when untouched (got ${untouched})`);

  // restart
  click(env, 'labQuizRestart');
  check(!hidden(env, 'labQuizMain') && text(env, 'labQText').length > 0, 'restart works');

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
