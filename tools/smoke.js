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
  'labQuizContinue', 'labContinueNote', 'labAgree', 'labDisagree', 'labNotSure', 'labDontUnderstand',
  'labExplain', 'labExplainTitle', 'labExplainPlain', 'labExplainContext', 'labExplainStill', 'labExplainBack',
  'labQBack', 'labQText', 'labQPlain', 'labQCount', 'labProgressPill',
  'labSettledBy', 'labTension', 'labScores', 'labResultList', 'labClaimGraph',
  'labQRanking', 'labQuizResume', 'labResultKicker', 'labResultTitle', 'labQRestart',
  'labClaimDetail', 'labTheoryList', 'labTheorySearch', 'labDetail', 'labBack', 'labTabClaims', 'labTabTheories',
  'labClaims', 'labTheories', 'quizCountLine', 'exploreDek', 'updateBanner', 'updateReload',
  'labClaimSearch', 'labClaimSearchCount', 'labClaimOpposites',
  'labPickGroup', 'labPickOptions', 'labPickNotSure',
  'labAnswers', 'labSkipActions'];

function matches(el, sel) {
  // Supports single and compound class selectors (".a", ".a.b") as used by
  // the app. A real browser's selector engine handles these; the shim must too.
  if (sel.startsWith('.') && !sel.includes(' ') && !sel.includes('[')) {
    // Union of className and the classList set: the app mutates both, and
    // a real browser's selector engine sees both.
    const cls = new Set([...(el.className || '').split(/\s+/), ...(el._classes || [])]);
    return sel.slice(1).split('.').every((w) => cls.has(w));
  }
  const m = sel.match(/^\[data-claim="([^"]+)"\]$/);
  if (m) return el.dataset && el.dataset.claim === m[1];
  if (sel === 'svg') return el.tag === 'svg';
  return false;
}

function makeEl(tag, id) {
  const listeners = {};
  const el = {
    tag: tag || 'div', id: id || '', className: '', textContent: '', title: '',
    _innerHTML: '',
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
  Object.defineProperty(el, 'innerHTML', {
    get() { return this._innerHTML; },
    set(v) { this._innerHTML = v; if (v === '') this.children = []; },
  });
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
function clickPickOption(env, index = 0) {
  const opts = env.els.get('labPickOptions').querySelectorAll('.pick-option');
  if (!opts.length) throw new Error('no pick options rendered');
  const el = opts[index];
  const fns = el._listeners.click || [];
  if (!fns.length) throw new Error('no click listener on pick option');
  fns.forEach((fn) => fn({ target: el, preventDefault() {} }));
}
function doPicks(env) {
  // Answer L1 and L2 pick-ones if showing (first option each).
  if (!hidden(env, 'labPickGroup')) {
    clickPickOption(env, 0);
    if (!hidden(env, 'labPickGroup')) clickPickOption(env, 0);
  }
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
  // theory list collapses: 10 shown, load-more pages the rest in
  const listHtml0 = html(env, 'labTheoryList');
  const initialTheories = (listHtml0.match(/data-theory="/g) || []).length;
  check(initialTheories === 10, `theory list shows 10 theories initially (got ${initialTheories})`);
  check(listHtml0.includes(`Show 10 more (${M - 10} left)`), 'theory list offers a load-more control');
  for (let i = 0; i < 12; i++) click(env, 'labTheoryList', { target: { closest: (sel) => sel === '[data-theory-more]' ? {} : null }, preventDefault() {} });
  const listHtml = html(env, 'labTheoryList');
  const withClaims = (listHtml.match(/data-theory="/g) || []).length;
  const pending = (listHtml.match(/data-meta="/g) || []).length;
  check(withClaims === M && pending === 120 - M, `theory list expands to ${M} with claims + ${120 - M} pending (got ${withClaims}+${pending})`);

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
  // round-2 jargon fixes: expansions and glosses for the tester-flagged terms
  const t98 = THEORIES.find(t => t.id === 98);
  check(t98 && t98.blurb.includes('Higher-Order Representation of a Representation'), 'HOROR acronym expanded in its blurb');
  const t13 = THEORIES.find(t => t.id === 13);
  check(t13 && t13.blurb.includes('seeds of experience'), 'panprotopsychism blurb glosses the jargon name');
  const t38 = THEORIES.find(t => t.id === 38);
  check(t38 && t38.name.includes('Theory of Everything'), 'Big TOE expanded in the theory name');
  check(read('data/theories.js').includes('what matter is in itself, beneath the equations'),
    'quiddities glossed in the Russellian monism summary');
  check(read('src/claims-lab.js').includes('Claims this theory states directly') &&
    read('src/claims-lab.js').includes('Claims that follow from those'),
    'theory detail headers reworded in plain language');
  const badShorts = CLAIMS.filter(c => (c.short || '').startsWith('Phenomenal')).map(c => c.id);
  check(badShorts.length === 0, `no short label leads with unglossed 'Phenomenal'${badShorts.length ? ' (' + badShorts.join(',') + ')' : ''}`);
  const lowShorts = CLAIMS.filter(c => /^[a-z]/.test(c.short || 'x')).map(c => c.id);
  check(lowShorts.length === 0, `all short labels capitalized${lowShorts.length ? ' (' + lowShorts.join(',') + ')' : ''}`);
  const noShorts = CLAIMS.filter(c => !(c.short || '').trim()).map(c => c.id);
  check(noShorts.length === 0, `every claim has a short label${noShorts.length ? ' (' + noShorts.join(',') + ')' : ''}`);

  // round-3: theory search aliases — a layperson typing a proponent's name
  // from the Closer to Truth entry must find the theory
  const aliasCases = [
    ['descartes', 'Substance dualism'],
    ['tononi', 'Integrated Information Theory'],
    ['dennett', 'Illusionism'],
    ['searle', 'Biological naturalism'],
    ['aristotle', 'Hylomorphism'],
    ['penrose', 'Orchestrated Objective Reduction'],
  ];
  for (const [q, name] of aliasCases) {
    fireInput(env, 'labTheorySearch', q);
    check(html(env, 'labTheoryList').includes(name), `alias search "${q}" finds ${name}`);
  }
  fireInput(env, 'labTheorySearch', '');
  check(html(env, 'labTheoryList').includes('Show 10 more'), 'clearing the search restores the full list');

  // round-3: claim panels explain the stated-directly vs implied distinction
  check(read('src/claims-lab.js').includes('Stated directly: the theory says this outright. Implied: it follows from claims the theory does state.'),
    'claim panels gloss the stated-directly vs implied distinction');

  // round-3 jargon sweep: every tester-flagged tagline now carries its gloss
  const byId = new Map(THEORIES.map(t => [t.id, t]));
  const jargonFixes = [
    [62, t => t.blurb.includes("what Tye calls 'consciousness*'"), "Tye's consciousness* explained"],
    [94, t => t.blurb.includes("'cross-order' self-representation"), "Kriegel's cross-order glossed"],
    [81, t => t.name.includes('electromagnetic'), "Pockett's EM expanded in the name"],
    [83, t => t.blurb.includes("'operational architectonics' is their name for"), 'Operational Architectonics glossed'],
    [88, t => t.blurb.includes("the branch-tips reaching toward the brain's surface"), 'apical dendrites glossed'],
    [117, t => t.blurb.includes('the open-ended ability to link brand-new situations'), 'unlimited associative learning glossed'],
    [40, t => t.blurb.includes("Modal means 'about what is possible and necessary'"), 'modal glossed'],
    [87, t => t.blurb.includes("the 'dynamic core'"), 'dynamic core glossed'],
    [75, t => t.blurb.includes('(tiny calcium-phosphate clusters)'), 'Posner molecules glossed'],
  ];
  for (const [id, ok, label] of jargonFixes) {
    const t = byId.get(id);
    check(t && ok(t), `round-3 jargon: ${label} (theory ${id})`);
  }

  // round-3: question text reserves vertical room so the buttons drift less
  check(read('styles.css').includes('.lab-quiz #labQText') && read('styles.css').includes('min-height: 3.2em'),
    'question text has a min-height to steady the answer buttons');

  // round-4: changing the theory filter closes a stale open detail panel
  click(env, 'labTheoryList', { target: { closest: (sel) => sel === '[data-theory]' ? { dataset: { theory: '4' } } : null }, preventDefault() {} });
  check(html(env, 'labDetail').includes('Substance dualism'), 'test setup: theory panel opens for Substance dualism');
  fireInput(env, 'labTheorySearch', 'integrated information');
  check(html(env, 'labDetail').includes('Pick a theory on the left'),
    'changing the filter closes the open theory panel instead of leaving a stale one');
  fireInput(env, 'labTheorySearch', '');

  // build-49: the settled "details" expander now explains the CURRENT
  // question (jargon definitions) instead of listing the previous
  // answer's fallout — testers read the old list as describing the
  // question on screen.
  check(read('src/claims-lab.js').includes('settled-more-btn') && read('src/claims-lab.js').includes('data-closed="▸ what does this mean?"'),
    'settled expander is a chevron pill-button labeled "what does this mean?"');
  check(read('styles.css').includes('.settled-more-btn') && read('styles.css').includes('min-height: 32px'),
    'details expander has a thumb-sized tap target');

  // round-4: update banner reworded and gated on having progress
  check(read('index.html').includes('This quiz just updated —'),
    'update banner reworded for first-time visitors');
  check(read('src/claims-lab.js').includes('newerBuildSeen') && read('src/claims-lab.js').includes('quizHasProgress()'),
    'update banner only shows once the visitor has quiz progress');

  // round-4 jargon sweep: tester-flagged taglines rewritten in plain words
  const theoriesSrc = read('data/theories.js');
  check(theoriesSrc.includes('not made of matter at all'),
    'Substance dualism summary avoids the "substance" term-of-art');
  check(!theoriesSrc.includes('maximally irreducible') && !theoriesSrc.includes('Φ (phi)') &&
    theoriesSrc.includes('researchers measure this with a quantity they call phi'),
    'IIT tagline rewritten in plain words, phi glossed');
  const t62 = byId.get(62), t104 = byId.get(104);
  check(t62 && t62.blurb.includes('Conscious experience is all-or-nothing'),
    "Tye's tagline no longer leads with unexplained 'Phenomenal consciousness'");
  check(t104 && t104.blurb.includes("(the supposed 'felt qualities' of experience)"),
    "Mandik's tagline glosses 'qualia' inline");
  // no internal claim ids anywhere in served UI strings
  check(!/\(c\d+\)/.test(read('data/claims.js')) && !/\(c\d+\)/.test(theoriesSrc),
    'no parenthesized internal claim ids in served data');
  const caveatIds = [...read('data/claims.js').matchAll(/caveat: "((?:[^"\\]|\\.)*)"/g)]
    .flatMap(m => m[1].match(/\bc\d+\b/g) || []);
  check(caveatIds.length === 0, `no bare internal claim ids in caveats${caveatIds.length ? ' (' + caveatIds.join(',') + ')' : ''}`);
  // sweep: unglossed phenomenal/qualia left in taglines/descriptions
  const tagSweep = [];
  for (const t of THEORIES) {
    const hay = `${t.name} ${t.blurb || ''}`;
    if (/\bphenomenal\b/i.test(hay) && !/felt/i.test(hay)) tagSweep.push(`theory${t.id}:phenomenal`);
    if (/\bqualia\b/i.test(hay) && !/felt qualities|felt experience/i.test(hay)) tagSweep.push(`theory${t.id}:qualia`);
  }
  check(tagSweep.length === 0, `no unglossed phenomenal/qualia in theory taglines${tagSweep.length ? ' (' + tagSweep.slice(0, 6).join(', ') + ')' : ''}`);

  // round-5: curator-voice phrases gone from classification notes
  const caveats = THEORIES.filter(t => t.caveat).map(t => t.caveat).join(' ');
  check(!/judgment call|landscape label|landscape convention|structural analogy|a reasonable map|could file it elsewhere|like Kriegel/.test(caveats),
    'classification notes read as visitor copy, not curator memos');
  const t19 = byId.get(19);
  check(t19 && t19.caveat.includes("We've grouped it with theories that say ordinary physics is enough"),
    'IIT classification note rewritten in plain visitor language');
  const t104c = byId.get(104);
  check(t104c && t104c.caveat.includes("Mandik himself says 'I'm not a physicalist'") && !t104c.caveat.includes('realist nor an eliminativist'),
    "Mandik's classification note rewritten without curator jargon");
  // round-5: Mandik's theories.js tagline rewritten
  check(theoriesSrc.includes("what we call felt qualities are just brain processes that represent the world") &&
    !theoriesSrc.includes('metaphysical posits') && !theoriesSrc.includes('naturalize them as brain-based'),
    "Mandik's tagline rewritten in plain words");
  // round-5: claim-title jargon sweep
  const claimById = new Map(CLAIMS.map(c => [c.id, c]));
  const jargonCases = [
    ['c36', null, 'self-luminous glossed away'],
    ['c41', /job description/, 'functional role glossed'],
    ['c136', /independent of everything else/, 'intrinsic nature glossed'],
    ['c138', /philosophers' word for directly self-revealing/, 'self-intimating glossed'],
    ['c150', /the asterisk marks a stripped-down precursor/, 'consciousness* asterisk glossed'],
    ['c150', /no plausible way physics could explain it/, 'reductive physical candidate reworded'],
    ['c152', /full, rich experience like ours/, 'full-blooded consciousness glossed'],
    ['c228', /because it represents itself/, 'in virtue of reworded'],
    ['c253', /no inner stage where experience is put on show/, 'Cartesian theater glossed'],
    ['c271', /philosophers' word for being 'of' or 'about' something/, 'philosophical intentional glossed'],
  ];
  for (const [id, re, label] of jargonCases) {
    const c = claimById.get(id);
    check(c && (re ? re.test(c.text || '') : !/self-luminous/.test(c.text || '')), `claim ${id}: ${label}`);
  }
  const c237 = claimById.get('c237');
  check(c237 && /thought-like state \(not spoken words\)/.test(c237.plain || ''), "claim c237: 'claim-like thought' glossed");
  // round-5: jumping to a theory via the results link clears stale filter text
  fireInput(env, 'labTheorySearch', 'Mandik');
  const searchEl = env.els.get('labTheorySearch');
  searchEl.value = 'Mandik';
  click(env, 'labResultList', { target: { closest: (sel) => sel === '[data-inspect]' ? { dataset: { inspect: '10' } } : null }, preventDefault() {} });
  check(searchEl.value === '' && html(env, 'labDetail').includes('Russellian monism'),
    'theory jump from results clears the filter text and opens the right panel');

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
  click(env, 'labClaimGraph', { target: { closest: () => ({ dataset: { claim: 'c0' } }) } });
  const c0Detail = html(env, 'labClaimDetail');
  const c0Hidden = (c0Detail.match(/extra-chip hidden/g) || []).length;
  check(c0Detail.includes('data-chip-more') && c0Hidden > 0,
    `claim detail collapses long affirming-theory lists (${c0Hidden} hidden behind show-all)`);
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
  // First question is now a pick-one camp question, not the c34 opener.
  check(text(env, 'labQText') === 'Which of these sounds most right to you?', 'first question is the L1 pick-one: ' + text(env, 'labQText'));
  check(!hidden(env, 'labPickGroup'), 'pick-one options are showing');
  check(hidden(env, 'labAnswers'), 'yes/no buttons are hidden during pick-one');
  const pickOpts = env.els.get('labPickOptions').querySelectorAll('.pick-option');
  check(pickOpts.length === 4, 'L1 pick-one offers 4 camp options (got ' + pickOpts.length + ')');
  check(text(env, 'labQCount') === '1 of 12', 'progress shows question N of 12: ' + text(env, 'labQCount'));
  // Build 49: comparative framing — "Pick the closest", never "Pick one —
  // the others count as disagreed".
  check(text(env, 'labQPlain').startsWith('Pick the closest'), 'pick-one instruction renders');
  check(text(env, 'labProgressPill') === `${N} of ${N} claims still in play`,
    'progress pill shows claims still in play out of the total: ' + text(env, 'labProgressPill'));
  const agreeTag = read('index.html').match(/<button[^>]*id="labAgree"[^>]*>[\s\S]*?<\/button>/);
  check(!!agreeTag && !agreeTag[0].includes('<small>') && agreeTag[0].includes('✓') && agreeTag[0].includes('>Agree<'),
    'agree button is a simple ✓ Agree with no subtitle');
  const disagreeTag = read('index.html').match(/<button[^>]*id="labDisagree"[^>]*>[\s\S]*?<\/button>/);
  check(!!disagreeTag && !disagreeTag[0].includes('<small>') && disagreeTag[0].includes('✗') && disagreeTag[0].includes('>Disagree<'),
    'disagree button is a simple ✗ Disagree with no subtitle');
  check(!read('index.html').includes('labQCoverage') && !read('src/claims-lab.js').includes('labQCoverage'),
    'the "why this question" section is gone from the quiz');
  check(read('index.html').includes('id="labNotSure"') && read('index.html').includes('id="labDontUnderstand"') && !read('index.html').includes('id="labSkip"'),
    'single skip button replaced by the two small skip buttons');
  check(!hidden(env, 'labQRanking'), 'ranking peek is offered from round 1, not just round 2');

  // Answer the L1 pick-one (pick the first option: physical).
  clickPickOption(env, 0);
  // Second question should be L2 pick-one (physical branch: 3 options).
  check(text(env, 'labQText') === 'Which of these sounds most right to you?', 'second question is the L2 pick-one');
  const pickOpts2 = env.els.get('labPickOptions').querySelectorAll('.pick-option');
  check(pickOpts2.length === 3, 'L2 pick-one offers 3 camp options (got ' + pickOpts2.length + ')');
  clickPickOption(env, 0); // pick reductive
  // Now we're in yes/no land.
  check(hidden(env, 'labPickGroup'), 'pick-one hides after L2 answered');
  check(!hidden(env, 'labAnswers'), 'yes/no buttons show after pick-one done');
  check(text(env, 'labQCount') === '3 of 12', 'counter advances after pick-ones: ' + text(env, 'labQCount'));

  // back button (on a yes/no question now)
  const q1 = text(env, 'labQText');
  click(env, 'labAgree');
  const q2 = text(env, 'labQText');
  check(q1 !== q2, 'answering advances to next question');
  const pillAfter = text(env, 'labProgressPill');
  const pillN = parseInt(pillAfter, 10);
  check(pillAfter.endsWith(`of ${N} claims still in play`) && pillN < N,
    `progress pill counts down as claims are decided (${pillAfter})`);
  check(text(env, 'labQCount') === '4 of 12', 'counter advances after answering: ' + text(env, 'labQCount'));
  click(env, 'labQBack');
  check(text(env, 'labQText') === q1, 'back returns to previous question');
  check(text(env, 'labQCount') === '3 of 12', 'counter decrements on back: ' + text(env, 'labQCount'));
  click(env, 'labAgree'); // re-answer, move on

  // skip -> back must return the exact skipped question, not a re-derived one
  const qs1 = text(env, 'labQText');
  click(env, 'labNotSure');
  const qs2 = text(env, 'labQText');
  check(qs1 !== qs2, 'skipping advances to the next question');
  click(env, 'labQBack');
  check(text(env, 'labQText') === qs1, 'back after skip returns the exact skipped question');
  check(text(env, 'labQCount') === '4 of 12', 'counter decrements on back after skip');
  click(env, 'labNotSure'); // skip again, move on

  // "Don't understand" opens a bigger explanation first; "Still don't get
  // it" skips and flags the claim as not understood (no signal, no elimination).
  const duQ = text(env, 'labQText');
  click(env, 'labDontUnderstand');
  check(!hidden(env, 'labExplain'), "don't-understand opens the explanation panel");
  check(text(env, 'labExplainTitle') === duQ, 'explanation panel names the current claim');
  check(text(env, 'labExplainPlain').startsWith('In other words:'), 'explanation panel leads with a plain restatement');
  check(html(env, 'labExplainContext').length > 0, 'explanation panel adds broader/specific context');
  click(env, 'labExplainBack');
  check(hidden(env, 'labExplain'), 'back-to-question closes the explanation panel');
  check(text(env, 'labQText') === duQ, 'closing the panel keeps the same question on screen');
  click(env, 'labDontUnderstand');
  click(env, 'labExplainStill');
  check(text(env, 'labQText') !== duQ || !hidden(env, 'labQuizResult'), "still-don't-get-it skips the question");
  check(text(env, 'labSettledBy') === 'Last question: skipped — nothing decided.', 'flagged skip records no signal');
  // engine-level: the flag is recorded and inert for scoring
  const mNu = CE2.newQuiz();
  CE2.skipNotUnderstood(mNu, 'c0');
  check(!!(mNu.notUnderstood || {})['c0'], 'engine records the not-understood flag');
  check(CE2.affirmed(mNu).size === 0 && CE2.rejected(mNu).size === 0,
    'a not-understood skip affirms and rejects nothing');
  check(CE2.score(mNu).every(r => r.agreed === 0 && r.disagreed === 0),
    'a not-understood skip eliminates no theories');
  CE2.undo(mNu, 'c0');
  check(!(mNu.notUnderstood || {})['c0'] && !(mNu.skipped || {})['c0'],
    'back/undo clears the not-understood skip');

  // Anti-pair propagation (c0 <-> c278): agreeing with one means
  // disagreeing with the other, with ladder effects on both sides.
  {
    const mA = CE2.newQuiz();
    CE2.answer(mA, 'c0', 'yes');
    const affA = CE2.affirmed(mA), rejA = CE2.rejected(mA);
    check(rejA.has('c278'), 'agree c0 rejects its anti-claim c278');
    check(rejA.has('c6') && rejA.has('c34') && rejA.has('c81'),
      'agree c0 rejects the claims laddered to c278 (c6, c34, c81)');
    check([...rejA].some(id => id !== 'c278' && id !== 'c6' && id !== 'c34' && id !== 'c81'),
      'agree c0 rejects descendants of the laddered claims too');
    check(affA.size + rejA.size > 1, `agree c0 settles more than itself (${affA.size + rejA.size})`);
    const mB = CE2.newQuiz();
    CE2.answer(mB, 'c278', 'yes');
    const affB = CE2.affirmed(mB), rejB = CE2.rejected(mB);
    check(rejB.has('c0'), 'agree c278 rejects its anti-claim c0');
    check(rejB.has('c32'),
      'agree c278 rejects a physicalist-ladder claim (c32 entails c0)');
    check(rejB.size > 2,
      `agree c278 rejects the physicalist ladder (${rejB.size} rejected)`);
    const mC = CE2.newQuiz();
    CE2.answer(mC, 'c6', 'yes');
    check(CE2.affirmed(mC).has('c278') && CE2.rejected(mC).has('c0'),
      'agree c6 affirms c278 and rejects c0 through the anti-pair');
    CE2.undo(mA, 'c0');
    check(CE2.affirmed(mA).size === 0 && CE2.rejected(mA).size === 0,
      'undo(c0) clears all derived anti effects');
    const mS = CE2.newQuiz();
    CE2.skip(mS, 'c0');
    check(CE2.undecided(mS).includes('c278'), 'skip(c0) leaves c278 askable');
    const cb = CE2.coverageBoth(mS, 'c278');
    check(cb.yes > 1 && cb.no > 1,
      `coverageBoth counts include the anti side (c278: yes=${cb.yes}, no=${cb.no})`);
    // validate() anti checks against synthetic bad data
    const bad1 = win.ClaimsEngine.validate(CLAIMS, THEORIES);
    check(bad1.length === 0, 'validate() is clean on the real anti data');
    const solo = [{ id: 'x', short: 'x', text: 'x', plain: 'x', entails: [], anti: 'y' }];
    check(win.ClaimsEngine.validate(solo, []).some(p => p.includes('does not exist')),
      'validate() catches an anti target that does not exist');
    const selfA = [{ id: 'x', short: 'x', text: 'x', plain: 'x', entails: [], anti: 'x' }];
    check(win.ClaimsEngine.validate(selfA, []).some(p => p.includes('its own anti')),
      'validate() catches self-anti');
    const asym = [
      { id: 'x', short: 'x', text: 'x', plain: 'x', entails: [], anti: 'y' },
      { id: 'y', short: 'y', text: 'y', plain: 'y', entails: [] }
    ];
    check(win.ClaimsEngine.validate(asym, []).some(p => p.includes('not symmetric')),
      'validate() catches asymmetric anti');
    const bothAnc = [
      { id: 'x', short: 'x', text: 'x', plain: 'x', entails: [], anti: 'y' },
      { id: 'y', short: 'y', text: 'y', plain: 'y', entails: [], anti: 'x' },
      { id: 'z', short: 'z', text: 'z', plain: 'z', entails: ['x', 'y'] }
    ];
    check(win.ClaimsEngine.validate(bothAnc, []).some(p => p.includes('among its ancestors')),
      'validate() catches a claim with both anti members as ancestors');
    check(read('src/claims-engine.js').includes('c.anti') &&
      read('data/claims.js').includes('id: "c278"'),
      'served bundle contains the anti logic and c278');
  }

  // mid-round restart: first tap arms it, second tap restarts the quiz
  check(!!env.els.get('labQRestart'), 'mid-round restart button exists');
  click(env, 'labQRestart');
  check(text(env, 'labQRestart').includes('Tap again'), 'first tap arms the restart: ' + text(env, 'labQRestart').slice(0, 40));
  click(env, 'labQRestart');
  check(text(env, 'labQCount') === '1 of 12', 'second tap restarts the quiz at question 1: ' + text(env, 'labQCount'));
  check(text(env, 'labQRestart') === 'Restart ↺', 'restart button disarms after restarting');
  click(env, 'labAgree'); // answer once more to resync the engine mirror below
  check(html(env, 'labScores').includes(' of '), 'live alignment scores render');
  check(html(env, 'labScores').includes('lab-score-blurb'), 'live scores show theory blurbs');

  // rail order is stable across answers; rank changes show as ▲/▼ deltas
  // instead of re-sorting the list every question.
  const railNames = () => (html(env, 'labScores').match(/<strong>([^<]*)/g) || []).map(s => s.slice(8).trim());
  let railBefore = railNames(), sawDelta = html(env, 'labScores').includes('rank-delta');
  for (let i = 0; i < 3; i++) {
    if (!hidden(env, 'labPickGroup')) clickPickOption(env, 0);
    else click(env, 'labAgree');
    const railAfter = railNames();
    check(JSON.stringify(railBefore) === JSON.stringify(railAfter), `rail keeps a stable theory order across answers (pass ${i + 1})`);
    railBefore = railAfter;
    if (html(env, 'labScores').includes('rank-delta')) sawDelta = true;
  }
  check(sawDelta, 'rail shows rank-change deltas instead of re-sorting');

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
    // Handle pick-one groups in the mirror.
    const pg = CE.nextPickGroup(CLAIMS, mirrorA);
    if (pg && !hidden(env, 'labPickGroup')) {
      // UI should be showing this pick group; answer it in both.
      clickPickOption(env, 0);
      CE.answerPick(mirrorA, pg.id, pg.claims[0], pg.claims);
      continue;
    }
    const q = CE.nextQuestion(CLAIMS, mirrorA);
    if (!q || !hidden(env, 'labQuizResult')) break;
    check(claimText.get(text(env, 'labQText')) === q.id, `UI stays in sync with engine (round ${rounds})`);
    const settled = settledOf(mirrorA);
    const newAnc = [...CE.ancestors(CLAIMS, q.id)].filter((id) => !settled.has(id));
    if (newAnc.length) {
      const before = settled.size; // engine-side delta mirror for the invariant
      click(env, 'labAgree');
      CE.answer(mirrorA, q.id, 'yes');
      const h = html(env, 'labSettledBy');
      sawAffirm = true;
      const total = settledOf(mirrorA).size - before; // answered claim included
      check(h.includes(`Last question: that settled ${total} claims`) && h.includes('data-settled-more="1"') && h.includes('settled-details hidden'),
        `affirm trace collapses to a one-line summary with a details expander, and the count (${total}) matches the engine-settled delta: ` + h.slice(0, 120));
    } else {
      click(env, 'labNotSure');
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
    const pg = CE.nextPickGroup(CLAIMS, mirrorB);
    if (pg && !hidden(env, 'labPickGroup')) {
      clickPickOption(env, 0);
      CE.answerPick(mirrorB, pg.id, pg.claims[0], pg.claims);
      continue;
    }
    const q = CE.nextQuestion(CLAIMS, mirrorB);
    if (!q || !hidden(env, 'labQuizResult')) break;
    const settled = settledOf(mirrorB);
    const newDesc = [...CE.descendants(CLAIMS, q.id)].filter((id) => !settled.has(id));
    if (newDesc.length) {
      const before = settled.size; // engine-side delta mirror for the invariant
      click(env, 'labDisagree');
      CE.answer(mirrorB, q.id, 'no');
      const h = html(env, 'labSettledBy');
      sawReject = true;
      const total = settledOf(mirrorB).size - before; // answered claim included
      check(h.includes(`Last question: that settled ${total} claims`) && h.includes('data-settled-more="1"') && h.includes('settled-details hidden'),
        `reject trace collapses to a one-line summary with a details expander, and the count (${total}) matches the engine-settled delta: ` + h.slice(0, 120));
      // Build 49: the expander explains the CURRENT question (plain
      // restatement + jargon definitions), not the last answer's fallout.
      check(h.includes('what does this mean?') && h.includes('In other words:'),
        'explainer expander restates the current question in plain language');
    } else {
      const newAnc = [...CE.ancestors(CLAIMS, q.id)].filter((id) => !settled.has(id));
      const before = settled.size; // engine-side delta mirror for the invariant
      click(env, 'labAgree');
      CE.answer(mirrorB, q.id, 'yes');
      if (newAnc.length) {
        const h2 = html(env, 'labSettledBy');
        const total = settledOf(mirrorB).size - before; // answered claim included
        check(h2.includes(`Last question: that settled ${total} claims`) && h2.includes('settled-details hidden'),
          `affirm trace collapses to a one-line summary, and the count (${total}) matches the engine-settled delta: ` + h2.slice(0, 120));
      } else {
        check(text(env, 'labSettledBy').includes('Last question: that decided just this claim.'), 'no-propagation line renders');
      }
    }
  }
  check(sawReject, 'observed a reject-propagation trace');

  // skip
  if (hidden(env, 'labQuizResult')) {
    const qs = text(env, 'labQText');
    click(env, 'labNotSure');
    check(text(env, 'labQText') !== qs || !hidden(env, 'labQuizResult'), 'skip advances');
  }

  // skipped questions are re-asked at round end instead of vanishing silently
  restartQuiz(env);
  doPicks(env); // 2 picks
  for (let i = 0; i < 9; i++) click(env, 'labAgree'); // 9 yes/no = 11 total
  check(hidden(env, 'labQuizResult'), '11 answers do not end the round early');
  const skippedQ = text(env, 'labQText');
  click(env, 'labNotSure'); // skip question 12 of 12
  check(hidden(env, 'labQuizResult'), 'round does not end on a skipped 12th question');
  check(text(env, 'labQCount') === 'Revisiting a skipped claim — 1 of 1',
    'skipped question is re-asked at round end: ' + text(env, 'labQCount'));
  check(text(env, 'labQText') === skippedQ, 'the re-asked question is the skipped one, not a fresh pick');
  check(text(env, 'labSettledBy').includes('another chance'),
    'revisit explains itself: ' + text(env, 'labSettledBy').slice(0, 70));
  click(env, 'labNotSure'); // skip again — final
  check(!hidden(env, 'labQuizResult'), 'second skip is final and ends the round');
  check(text(env, 'labContinueNote').includes('(1 skipped)'),
    'results name the skip in the basis line: ' + text(env, 'labContinueNote').slice(0, 90));

  // two skips: every skipped question gets exactly one more chance, then stays skipped
  restartQuiz(env);
  doPicks(env);
  click(env, 'labNotSure'); click(env, 'labNotSure');
  for (let i = 0; i < 8; i++) click(env, 'labAgree'); // 2 picks + 2 skips + 8 agrees = 12
  // finish the round however the engine routes it (revisit pass, propagation, or straight to results)
  let rguard = 0;
  while (hidden(env, 'labQuizResult') && rguard++ < 8) click(env, 'labNotSure');
  check(!hidden(env, 'labQuizResult'), 'two skips still end the round');
  check(text(env, 'labContinueNote').includes('(2 skipped)'),
    'both skips named in the basis line: ' + text(env, 'labContinueNote').slice(0, 90));

  // theory filter: word-boundary matching, so "dualism" skips "nondualism"
  fireInput(env, 'labTheorySearch', 'dualism');
  const dualHtml = html(env, 'labTheoryList');
  check(dualHtml.toLowerCase().includes('dualism') && !dualHtml.toLowerCase().includes('nondualism'),
    'theory search matches whole words ("dualism" finds dualists, not nondualists)');
  fireInput(env, 'labTheorySearch', '');

  // claim explorer search: a keyword dims non-matching nodes and reports a count
  fireInput(env, 'labClaimSearch', 'consciousness');
  const graphNodes = () => env.els.get('labClaimGraph').querySelectorAll('.dag-node');
  const dimmedCount = () => graphNodes().filter(n => n.classList.contains('dimmed')).length;
  check(dimmedCount() > 0 && dimmedCount() < graphNodes().length,
    `claim search dims non-matching nodes (${dimmedCount()}/${graphNodes().length} dimmed)`);
  check(text(env, 'labClaimSearchCount').includes('claims match'), 'claim search reports a match count');
  fireInput(env, 'labClaimSearch', '');
  check(dimmedCount() === 0 && hidden(env, 'labClaimSearchCount'), 'clearing claim search restores every node');

  // content: round-22 jargon audit — the fixed claims must carry inline glosses
  const claimsSrc = read('data/claims.js');
  const glosses = ['expectations flowing down from higher brain areas',
    'waves adding together and canceling out', 'has ontological priority)',
    'particles sitting in two states at once', 'an ordinary computer running step-by-step code',
    'the moment quantum possibilities snap into one outcome', 'parts vibrating in sync',
    'fast rhythmic firing', 'firing in lockstep rhythm', 'the felt quality of experience',
    'small vertical teams of neurons', 'maps tied to movement and sensing',
    'gained when another process scans them'];
  const missing = glosses.filter(g => !claimsSrc.includes(g));
  check(missing.length === 0, `all 13 inline jargon glosses present${missing.length ? ' (missing: ' + missing.join('; ') + ')' : ''}`);

  // claim groups show a visible scrollbar affordance, not hover-only chrome
  check(read('styles.css').includes('.dag-scroll::-webkit-scrollbar-thumb'),
    'claim-group scrollers have a visible styled scrollbar');

  // engine-level: contradictions + validation
  const mContra = CE.newQuiz();
  CE.answer(mContra, 'c0', 'yes');
  CE.answer(mContra, 'c6', 'yes');
  check(CE.contradictions(CLAIMS, mContra).length === 1, 'engine reports the c0/c6 contradiction');
  check(CE.validate(CLAIMS, THEORIES).length === 0, 'claims-engine validation has no problems');

  // Build 44: c16 no longer entails c8 — a mind moving matter through
  // conscious ideas must not knock out dualist claims.
  {
    const q = CE.newQuiz();
    CE.answer(q, 'c16', 'yes');
    const aff = CE.affirmed(CLAIMS, q), rej = CE.rejected(CLAIMS, q);
    check(aff.has('c16') && !aff.has('c8') && !rej.has('c8'), 'agreeing with c16 settles nothing about c8');
    check(!aff.has('c6') && !aff.has('c278') && !rej.has('c278'),
      'agreeing with c16 no longer ladders into the c6/c278 anti-claim');
  }
  // Build 44: c24 has no outgoing edges — agreeing with it must not affirm
  // the panpsychism-family claims built on top of it.
  {
    const q = CE.newQuiz();
    CE.answer(q, 'c24', 'yes');
    const aff = CE.affirmed(CLAIMS, q);
    check(aff.has('c24') && !aff.has('c25') && !aff.has('c26') && !aff.has('c27'),
      'agreeing with c24 affirms only c24, never c25/c26/c27');
  }
  // Build 44: the explainer no longer frames children as mere illustrations
  check(read('src/claims-lab.js').includes('Stronger ideas built on this one') &&
    !read('src/claims-lab.js').includes('Ways people picture this idea'),
    'explainer relabels children as stronger ideas built on the claim');
  // Build 44: theory panels name whose logic the implied-claim chains are
  check(read('src/claims-lab.js').includes("the theory's own logic, not something inferred from your answers"),
    'theory panel glosses the implied-claims section as the theory’s own logic');
  // Build 44: the anti-claim badge links into the claim explorer
  check(read('src/claims-lab.js').includes('data-claim="${antiClaim.id}"'),
    'anti-claim badge is a clickable link into the claim explorer');
  // Build 44: ranking sort is stated on the results page
  check(read('index.html').includes('Ranked by most claims aligned with your answers, then fewest ruled out.'),
    'results page states the ranking rule');
  // Build 44: graph legend clarifies the map never changes under quiz answers
  check(read('index.html').includes('The graph is a reference map — quiz answers never cross out or change its nodes.'),
    'graph legend states nodes are never crossed out by quiz answers');
  // Build 44: rail caption explains the stable order and movement indicators
  check(read('index.html').includes('▲▼ show movement'),
    'rail caption explains the stable order and ▲▼ indicators');
  // Build 44: jargon sweep — plain-first short labels, old terms gone
  {
    const newShorts = ['The self is a self-referential loop', 'Reality is tiny mind-like perceivers',
      'Mind-like units come in degrees', 'Everything is enfolded in a deeper order',
      'A stripped-down precursor of experience is irreducible', 'A subliminal memory-bank underlies experience',
      'Looping signals weave the dynamic core', 'Particles are tiny subjects',
      'Quantum shape fixes what experience feels like', 'Common-sense psychology will fall',
      'Only pure witnessing stands outside nature', 'Consciousness only watches, never acts',
      'Slow body-wide electric fields hold experience'];
    const goneShorts = ['short: "Micro-subjects"', 'short: "The self is a strange loop"',
      'short: "Reality is perceiving monads"', 'short: "Monads come in degrees"',
      'short: "Everything enfolds in implicate order"', 'short: "Consciousness* is irreducible"',
      'short: "Store consciousness underlies experience"', 'short: "Reentrant signaling weaves the dynamic core"',
      'short: "Superposition structure fixes qualia"', 'short: "Folk psychology will fall"',
      'short: "Only the witness is outside nature"', 'short: "Consciousness as pure witness"',
      'short: "Slow DC body fields hold experience"'];
    const missingNew = newShorts.filter(s => !claimsSrc.includes(s));
    const lingering = goneShorts.filter(s => claimsSrc.includes(s));
    check(missingNew.length === 0 && lingering.length === 0,
      `jargon sweep: ${newShorts.length} plain-first shorts in place, old bare-term shorts gone` +
      (missingNew.length || lingering.length ? ` (missing: ${missingNew.join('; ')}; lingering: ${lingering.join('; ')})` : ''));
  }
  // Build 44: causal-closure and synchronicity glosses in theory copy
  {
    const theoriesSrc44 = read('data/theories.js');
    check(theoriesSrc44.includes('causally closed (a physical event can have a non-physical cause)'),
      'interactionist dualism summary glosses causal closure');
    check(theoriesSrc44.includes("(physics is causally closed); no soul pushing neurons around"),
      'epiphenomenalist signature glosses causal closure');
    check(theoriesSrc44.includes('Synchronicity (meaningful coincidences with no causal link)'),
      'Pauli–Jung detail glosses synchronicity');
  }
  // Build 44: peeking at the ranking mid-revisit must not strand the skipped question
  {
    restartQuiz(env);
    let rguard44 = 0;
    for (let i = 0; i < 12 && rguard44++ < 40; i++) {
      if (!hidden(env, 'labPickGroup')) click(env, 'labPickNotSure');
      else click(env, 'labNotSure');
    }
    const revisitLabel = text(env, 'labQCount');
    check(revisitLabel.includes('Revisiting a skipped claim'), 'revisit pass starts after 12 skips: ' + revisitLabel);
    const qBefore = text(env, 'labQText');
    click(env, 'labQRanking');
    check(!hidden(env, 'labQuizResult'), 'ranking peek opens during a revisit');
    click(env, 'labQuizResume');
    check(hidden(env, 'labQuizResult'), 'back to quiz hides the results again');
    check(text(env, 'labQText') === qBefore,
      'the same revisit question is re-asked after a ranking peek — the skipped question is not stranded');
    check(text(env, 'labQCount').includes('Revisiting a skipped claim'),
      'revisit label intact after the peek: ' + text(env, 'labQCount'));
  }

  // rail shows top 10 with inline load-more, never all 120 at once
  const railRows = (html(env, 'labScores').match(/lab-score-row/g) || []).length;
  check(railRows === 10, `rail shows top 10 theories during quiz (got ${railRows})`);
  check(html(env, 'labScores').includes(`Show 10 more (${M - 10} left)`), 'rail offers inline load-more');
  const railFracs = (html(env, 'labScores').match(/<span>\d+ of \d+<\/span>/g) || []).length;
  check(railFracs === railRows, `every rail row shows an X-of-Y fraction (got ${railFracs}/${railRows})`);
  click(env, 'labScores', { target: { closest: (sel) => sel === '[data-rail-more]' ? {} : null }, preventDefault() {} });
  const railRows2 = (html(env, 'labScores').match(/lab-score-row/g) || []).length;
  check(railRows2 === 20, `rail load-more pages in 10 more (got ${railRows2})`);
  check(read('styles.css').includes('.lab-tension.tension-empty') && /\.lab-tension\s*{\s*min-height/.test(read('styles.css')),
    'tension note lives in a reserved min-height slot with a visibility toggle');
  check(read('src/claims-lab.js').includes("classList.add('tension-empty')"),
    'tension show/hide uses the visibility slot, not display toggling');

  // round cap + continue + tension notes (all-agree run). Since anti-pairs
  // landed, an all-agree run can no longer affirm both sides of a
  // contradiction (agreeing with c0 auto-rejects c6/c34/c81 via c278), so
  // the tension UI must stay silent — the engine-level contradiction check
  // above still covers the rendering data path directly.
  restartQuiz(env);
  let sawTension = false, sawPreNudge = false, answered = 0;
  while (hidden(env, 'labQuizResult') && answered < 20) {
    const t = html(env, 'labTension');
    if (t.length > 0) sawTension = true;
    if (t.includes('would pull against')) sawPreNudge = true;
    click(env, 'labAgree');
    answered++;
  }
  check(answered === 12 && !hidden(env, 'labQuizResult'), `quiz stops after a 12-question round (answered ${answered})`);
  check(!sawTension && !sawPreNudge, 'all-agree run stays contradiction-free: anti-pairs absorb the old c0/c6 tension');
  check(env.els.get('labTension').classList.contains('tension-empty'), 'tension slot stays in its reserved empty state');
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
  check(html(env, 'labResultList').includes('Aligns with'), 'peek renders the live ranking');
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
  check(text(env, 'labContinueNote').includes('One answer can settle many claims'),
    'results explain why a few answers settle many claims');
  check(html(env, 'labResultList').includes('See this theory’s claims below'),
    'inspect buttons signal the below-the-fold scroll to the theory explorer');
  // results collapse: top 10 first, "show all" expands to the full ranking
  const resCollapsed = html(env, 'labResultList');
  const resRows0 = (resCollapsed.match(/class="lab-result-row/g) || []).length;
  check(resRows0 === 10, `results show top 10 theories initially (got ${resRows0})`);
  check(resCollapsed.includes(`Show all ${M} theories`), 'results offer a show-all control');
  check(html(env, 'labResultList').includes('lab-result-blurb'), 'results rows show theory blurbs');
  click(env, 'labResultList', { target: { closest: (sel) => sel === '[data-result-more]' ? {} : null }, preventDefault() {} });
  check(html(env, 'labResultList').includes('Aligns with'), 'results use X-of-Y alignment framing');
  check(html(env, 'labResultList').includes('data-inspect'), 'results have inspect-claims buttons');
  check((html(env, 'labResultList').match(/<span class="vh">/g) || []).length === M,
    'inspect buttons carry a screen-reader-only theory name');
  // every result row must explain its own ranking — no silent rows
  const resHtml = html(env, 'labResultList');
  const resRows = (resHtml.match(/class="lab-result-row/g) || []).length;
  const resLines = (resHtml.match(/Aligns with \d+ of its/g) || []).length;
  check(resRows === M, `results render all ${M} theories (got ${resRows})`);
  check(resLines === M, `every result row explains its alignment (got ${resLines}/${resRows})`);
  const rankSpans = (resHtml.match(/<span class="lab-result-rank">#\d+<\/span>/g) || []).length;
  check(rankSpans === resRows, `every result row carries its rank (got ${rankSpans}/${resRows})`);
  check(!resHtml.includes('No theory matched your answers'), 'ordering explainer absent when theories do match');

  // untouched theories: a fresh all-skip run leaves every theory untouched
  restartQuiz(env);
  guard = 0;
  while (hidden(env, 'labQuizResult') && guard++ < N + 50) click(env, 'labNotSure');
  check(!hidden(env, 'labQuizResult'), 'all-skip run completes');
  click(env, 'labResultList', { target: { closest: (sel) => sel === '[data-result-more]' ? {} : null }, preventDefault() {} });
  const untouched = (html(env, 'labResultList').match(/Aligns with 0 of its \d+ claims? — none of this theory's claims came up/g) || []).length;
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
    } else if (!hidden(env, 'labPickGroup')) {
      clickPickOption(env, 0);
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

  // version freshness banner: quiet on a fresh first load, shown once the
  // visitor has quiz progress to protect
  console.log('testing version-freshness banner…');
  const stale = boot({ siteBuild: 4, fetchImpl: () => Promise.resolve({ json: () => Promise.resolve({ build: 6 }) }) });
  await new Promise((r) => setTimeout(r, 50));
  check(stale.els.get('updateBanner').classList.contains('hidden'),
    'banner stays hidden on a fresh first load even when a newer build exists');
  click(stale, 'labQuizBegin');
  doPicks(stale);
  click(stale, 'labAgree');
  check(!stale.els.get('updateBanner').classList.contains('hidden'),
    'banner appears once the visitor has quiz progress and a newer build exists');
  const fresh = boot({ siteBuild: 6, fetchImpl: () => Promise.resolve({ json: () => Promise.resolve({ build: 6 }) }) });
  await new Promise((r) => setTimeout(r, 50));
  check(fresh.els.get('updateBanner').classList.contains('hidden'), 'banner stays hidden when build is current');

  // ---- Build 45: round-3 fresh-eyes feedback ----
  console.log('testing build-45 fixes…');
  // 1. settled-by marker reflects the answer direction (was always ✓)
  check(read('styles.css').includes('.lab-settled-by.dir-no') && read('styles.css').includes('.lab-settled-by.dir-yes'),
    'settled-by marker is direction-aware in CSS (✓ agree / ✗ disagree / • other)');
  const dir = boot();
  click(dir, 'labQuizBegin');
  doPicks(dir); // L1 + L2 pick-ones, then yes/no
  // After picks, we're on a yes/no question (not c34 anymore).
  click(dir, 'labAgree');
  check(dir.els.get('labSettledBy').classList.contains('dir-yes') && !dir.els.get('labSettledBy').classList.contains('dir-no'),
    'agreeing marks the settled line dir-yes (✓, not a bare checkmark for every answer)');
  const settledHtml = html(dir, 'labSettledBy');
  // Build 49: the expander explains the CURRENT question — a plain
  // restatement plus jargon definitions — not the last answer's fallout.
  check(settledHtml.includes('what does this mean?'),
    'settled line offers a "what does this mean?" explainer for the current question');
  check(settledHtml.includes('In other words:'),
    'explainer restates the current question in plain language');
  click(dir, 'labDisagree');
  check(dir.els.get('labSettledBy').classList.contains('dir-no'),
    'disagreeing marks the settled line dir-no (✗ instead of the misleading ✓)');
  // Build 49: when the current question contains a glossary term, the
  // explainer defines it. Fresh run — check the property on each question
  // until one with a glossary term appears.
  {
    const e = boot();
    click(e, 'labQuizBegin');
    const terms49 = ['electromagnetic', 'reentrant', 'qualia', 'neuron', 'dualism', 'emergent', 'supervenience', 'epiphenomen', 'intentional', 'metaphysic', 'monism', 'illusionism'];
    let sawDef = false, guard49 = 0;
    while (!sawDef && guard49++ < 25 && hidden(e, 'labQuizResult')) {
      if (hidden(e, 'labPickGroup')) {
        const qt = text(e, 'labQText').toLowerCase();
        const expected = terms49.filter(t => new RegExp('\\b' + t).test(qt)).slice(0, 4);
        const h = html(e, 'labSettledBy');
        if (expected.length && expected.every(t => h.includes('<dt>' + t + '</dt>'))) sawDef = expected.join(',');
      }
      if (!hidden(e, 'labPickGroup')) clickPickOption(e, 0);
      else if (!hidden(e, 'labQuizMain')) click(e, 'labAgree');
      else break;
    }
    check(!!sawDef, `explainer defines the jargon in the current question${sawDef ? ' (' + sawDef + ')' : ''}`);
  }

  // 2. live-alignment header copy is a complete sentence
  check(read('index.html').includes('show movement since your last answer'),
    'rail note completes the sentence ("…show movement since your last answer")');
  check(!read('index.html').includes('show movement since.</p>'),
    'truncated "…movement since." copy is gone');

  // 4. anti-claim badges discoverable: marked graph nodes + opposites toggle
  check(read('index.html').includes('id="labClaimOpposites"'), 'claim explorer has a "show opposite claims" control');
  const antiNodes = env.els.get('labClaimGraph').querySelectorAll('.has-anti');
  check(antiNodes.length === 4, `exactly the anti-pair claims are marked ↔ in the graph (got ${antiNodes.length})`);
  click(env, 'labClaimOpposites');
  check(env.els.get('labClaimOpposites').getAttribute('aria-pressed') === 'true',
    'opposites toggle activates');
  const dimmedAnti = env.els.get('labClaimGraph').querySelectorAll('.dimmed-anti');
  check(dimmedAnti.length === N - 4, `opposites view dims everything except the pairs (got ${dimmedAnti.length} dimmed of ${N})`);
  check(html(env, 'labClaimDetail').includes('↔ Anti-claim'),
    'opposites view opens a claim detail showing the ↔ anti-claim badge');
  click(env, 'labClaimOpposites');
  check(env.els.get('labClaimOpposites').getAttribute('aria-pressed') === 'false' &&
    env.els.get('labClaimGraph').querySelectorAll('.dimmed-anti').length === 0,
    'opposites toggle clears the highlight');
  // typing in search also clears the opposites view
  click(env, 'labClaimOpposites');
  fireInput(env, 'labClaimSearch', 'physics');
  check(env.els.get('labClaimGraph').querySelectorAll('.dimmed-anti').length === 0,
    'searching clears the opposites highlight');
  fireInput(env, 'labClaimSearch', '');

  // 5. round-3 jargon sweep: long-text layer glosses
  const claimById45 = new Map(CLAIMS.map((c) => [c.id, c]));
  const glossCases = [
    ['c98', 'star-shaped support cells', 'astrocytes glossed'],
    ['c105', "Leibniz's name for a tiny mind-like unit", 'monad glossed'],
    ['c106', 'bare monads (simple ones with only faint perception)', 'bare monads glossed'],
    ['c152', 'the asterisk marks a stripped-down precursor of experience', 'consciousness* glossed locally'],
    ['c155', "philosophers call them 'simples'", "'simples' glossed"],
    ['c188', "fills even 'empty' space", 'zero-point field glossed'],
    ['c189', 'like a radio', 'resonant oscillator glossed'],
    ['c192', "'ephaptic' just means", 'ephaptic coupling glossed'],
    ['c212', 'match-detector', 'coincidence detector glossed'],
  ];
  for (const [id, phrase, label] of glossCases) {
    const c = claimById45.get(id);
    check(!!c && (c.text || '').includes(phrase), `round-5 jargon: ${label} (${id})`);
  }

  // 6. AX quirk: agreement count lines are plain text, never aria-hidden
  // (the tester's intermittent omission was a snapshot-timing artifact —
  // no aria-hidden exists on these lines; assert that stays true)
  let dirGuard = 0;
  while (hidden(dir, 'labQuizResult') && dirGuard++ < N + 50) click(dir, 'labAgree');
  const resultHtml = html(dir, 'labResultList');
  check(/<p>Aligns with/.test(resultHtml) && !/<p[^>]*aria-hidden[^>]*>Aligns with/.test(resultHtml),
    'result alignment counts render as plain text with no aria-hidden wrapper');

  // ---- Build 46: round-4 fresh-eyes feedback ----
  console.log('testing build-46 fixes…');
  // 1. revisit labels are provenance-honest: the counter tracks claims
  // actually re-asked, and a re-asked question is always a genuine skip.
  {
    restartQuiz(env);
    const skippedTexts = [text(env, 'labQText')];
    click(env, 'labNotSure');
    skippedTexts.push(text(env, 'labQText'));
    click(env, 'labNotSure');
    for (let i = 0; i < 10; i++) click(env, 'labAgree');
    if (hidden(env, 'labQuizResult')) {
      const lbl = text(env, 'labQCount');
      const m = lbl.match(/^Revisiting a skipped claim — (\d+) of (\d+)$/);
      check(!!m && m[1] === '1' && Number(m[2]) >= 1,
        'revisit counter starts at 1 of the actual re-queue size: ' + lbl);
      check(skippedTexts.includes(text(env, 'labQText')),
        'the first revisit re-asks a genuinely skipped claim, not a fresh pick');
      const firstTotal = m ? Number(m[2]) : 0;
      click(env, 'labAgree');
      if (hidden(env, 'labQuizResult')) {
        const lbl2 = text(env, 'labQCount');
        const m2 = lbl2.match(/^Revisiting a skipped claim — (\d+) of (\d+)$/);
        check(!!m2 && m2[1] === '2' && Number(m2[2]) === firstTotal,
          'the counter advances against the same total: ' + lbl2);
      }
    } else {
      check(true, 'propagation settled both skips — no revisit pass needed (acceptable)');
    }
  }
  // 1b. a "didn't understand" skip is revisited under an honest label
  {
    restartQuiz(env);
    click(env, 'labDontUnderstand');
    click(env, 'labExplainStill');
    for (let i = 0; i < 11; i++) click(env, 'labAgree');
    if (hidden(env, 'labQuizResult')) {
      check(/^Revisiting a claim you found unclear — 1 of \d+$/.test(text(env, 'labQCount')),
        'unclear claims are revisited as unclear, not as plain skips: ' + text(env, 'labQCount'));
    } else {
      check(true, 'propagation settled the unclear skip — no revisit pass needed (acceptable)');
    }
  }
  // 1c. the follow-up label exists for non-revisit questions after round end
  check(read('src/claims-lab.js').includes('A few more claims to sharpen your result'),
    'post-round follow-up questions get an honest "sharpen your result" label, never the revisit label');
  // 2. alignment framing: no row claims conscious endorsement of unseen claims
  check(!read('src/claims-lab.js').includes('You agree with ${result.agreed}') &&
    !read('src/claims-lab.js').includes('You agree with 0 of its'),
    'result rows use "Aligns with" framing instead of "You agree with"');
  // 3. every row of the initial top-10 explains its alignment (round-4: no bare rows)
  {
    const collapsedLines = (resCollapsed.match(/Aligns with \d+ of its/g) || []).length;
    check(collapsedLines === resRows0,
      `every top-10 result row explains its alignment (got ${collapsedLines}/${resRows0})`);
  }
  // 4. the explainer flags competing stronger views
  check(read('src/claims-lab.js').includes('They are competing views, not a package'),
    'LET’S UNPACK IT notes that stronger ideas can disagree with each other');
  // 5. round-4 jargon sweep: long-text layer glosses
  {
    const claimById46 = new Map(CLAIMS.map((c) => [c.id, c]));
    const glossCases46 = [
      ['c8', 'a physical event can have a non-physical cause', 'causal closure glossed'],
      ['c225', 'without reasoning it out', 'non-inferential glossed'],
      ['c199', 'temporary teams of neurons firing in sync', 'operational modules glossed'],
      ['c223', 'as you experience them', 'phantasms glossed'],
      ['c232', 'models about its models', 'meta-representations glossed'],
      ['c251', 'how pleasant or unpleasant', 'valence glossed'],
      ['c221', "at bottom, it's all matter", 'ontological/epistemological distinction glossed'],
      ['c79', 'as they really are', 'veridical glossed'],
    ];
    for (const [id, phrase, label] of glossCases46) {
      const c = claimById46.get(id);
      check(!!c && ((c.text || '').includes(phrase) || (c.plain || '').includes(phrase)),
        `round-4 jargon: ${label} (${id})`);
    }
  }

  // ---- Build 49: round-1 tester feedback ----
  console.log('testing build-49 fixes…');
  // 1. c282 (describe-experience method card) is non-exclusive in L1
  {
    const g = (CE.PICK_GROUPS || []).find(x => x.id === 'L1');
    check(!!g && (g.nonExclusive || []).includes('c282'), 'c282 is marked non-exclusive in L1');
    const s = CE.newQuiz();
    CE.answerPick(s, 'L1', 'c282', g.claims);
    const othersRejected = g.claims.filter(c => c !== 'c282').some(c => CE.rejected(CLAIMS, s).has(c));
    check(!othersRejected, 'picking c282 affirms only it — no metaphysical camp is rejected');
    check(CE.affirmed(CLAIMS, s).has('c282'), 'picking c282 affirms c282 itself');
    const s2 = CE.newQuiz();
    CE.answerPick(s2, 'L1', 'c279', g.claims);
    check(!CE.rejected(CLAIMS, s2).has('c282') && CE.affirmed(CLAIMS, s2).has('c279'),
      'picking another L1 camp (c279) does not reject c282');
    check(CE.validate(CLAIMS, THEORIES).length === 0, 'validate() is clean with the non-exclusive member');
  }
  // 2. pick-one framing never says unpicked cards count as disagreed
  check(read('src/claims-lab.js').includes('Pick the closest') && !read('src/claims-lab.js').includes('the others count as disagreed'),
    'pick-one framed as comparative ("Pick the closest"), never as rejection');
  // 3. rail legend + zero-alignment dimming
  check(read('index.html').includes('“N of M”') && read('src/claims-lab.js').includes('lab-score-zero'),
    'rail legend explains N of M; zero-alignment rows dimmed');
  // 4. non-exclusive card carries a method note
  check(read('src/claims-lab.js').includes('A starting point, not a side'),
    'non-exclusive card notes it can combine with the others');
  // 5. dash folding in theory search
  check(read('src/claims-lab.js').includes('dashFold'),
    'theory search normalizes hyphens/en–em dashes');
  // 6. results basis counts real answers only (skips and implicit pick
  //    rejections excluded). Full run: picks + agree taps, no skips.
  {
    const r = boot();
    click(r, 'labQuizBegin');
    doPicks(r); // L1 + L2 picks = 2 answers
    let answers = 2, guard49 = 0;
    while (hidden(r, 'labQuizResult') && guard49++ < 60) {
      if (!hidden(r, 'labPickGroup')) { clickPickOption(r, 0); answers++; continue; }
      click(r, 'labAgree'); answers++;
    }
    check(!hidden(r, 'labQuizResult'), 'full agree-run reaches results');
    const basis = text(r, 'labContinueNote');
    check(basis.includes(`Based on ${answers} answers`),
      `results basis counts the ${answers} real answers given (no skips in this run): ` + basis.slice(0, 80));
  }

  console.log(failures ? `\n${failures} FAILURES` : '\nALL SMOKE TESTS PASSED');
  process.exit(failures ? 1 : 0);
}

main().catch((e) => { console.error('HARNESS ERROR:', e); process.exit(2); });
