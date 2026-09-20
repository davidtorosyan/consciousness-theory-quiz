/*
  Release-gating content checks. A failing rule throws before the quiz boots,
  so the required post-build audit cannot pass with incomplete or placeholder copy.
*/
(function () {
  'use strict';

  const REQUIRED_LAYERS = [
    'title', 'subtitle', 'answers', 'putSimply',
    'whyItMatters', 'examples', 'definitions'
  ];
  const BANNED_PHRASES = [
    'choose the side that best matches your view',
    'choose the answer that comes closest to your view',
    'this choice separates two families of theories that explain the same experience in different ways',
    'lorem ipsum',
    'placeholder text',
    'todo:'
  ];

  const normalize = value => String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}\s]+/gu, ' ')
    .trim();

  const textValues = value => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(textValues);
    if (value && typeof value === 'object') return Object.values(value).flatMap(textValues);
    return [];
  };

  window.runQuizContentLint = function runQuizContentLint(content = window.QUIZ_CONTENT) {
    const errors = [];
    if (!Array.isArray(content) || content.length === 0) {
      throw new Error('[content-lint] QUIZ_CONTENT must be a non-empty array.');
    }

    const ids = new Set();
    const putSimplyOwners = new Map();

    content.forEach((entry, index) => {
      const at = `entry ${index + 1}${entry && entry.id ? ` (${entry.id})` : ''}`;
      if (!entry || typeof entry !== 'object') {
        errors.push(`${at}: must be an object`);
        return;
      }
      if (typeof entry.id !== 'string' || !entry.id.trim()) errors.push(`${at}: missing id`);
      else if (ids.has(entry.id)) errors.push(`${at}: duplicate id`);
      else ids.add(entry.id);

      REQUIRED_LAYERS.forEach(layer => {
        if (!(layer in entry)) errors.push(`${at}: missing ${layer}`);
      });

      ['title', 'subtitle', 'putSimply', 'whyItMatters'].forEach(field => {
        if (typeof entry[field] !== 'string' || !entry[field].trim()) errors.push(`${at}: ${field} must contain question-specific text`);
      });

      const first = entry.answers && entry.answers.first;
      const second = entry.answers && entry.answers.second;
      ['label', 'hint'].forEach(field => {
        if (!first || typeof first[field] !== 'string' || !first[field].trim()) errors.push(`${at}: answers.first.${field} is required`);
        if (!second || typeof second[field] !== 'string' || !second[field].trim()) errors.push(`${at}: answers.second.${field} is required`);
      });

      if (!Array.isArray(entry.scope) || entry.scope.length < 2) errors.push(`${at}: scope must contain at least two theory ids`);
      if (!Array.isArray(entry.yesTheoryIds) || entry.yesTheoryIds.length === 0) errors.push(`${at}: yesTheoryIds must not be empty`);
      if (Array.isArray(entry.scope) && Array.isArray(entry.yesTheoryIds)) {
        const scope = new Set(entry.scope);
        if (entry.yesTheoryIds.some(id => !scope.has(id))) errors.push(`${at}: yesTheoryIds must be a subset of scope`);
        if (entry.scope.every(id => entry.yesTheoryIds.includes(id))) errors.push(`${at}: the second route must not be empty`);
      }

      const examples = entry.examples;
      if (!examples || !Array.isArray(examples.firstRouteTheoryIds) || examples.firstRouteTheoryIds.length === 0) {
        errors.push(`${at}: examples.firstRouteTheoryIds must not be empty`);
      }
      if (!examples || !Array.isArray(examples.secondRouteTheoryIds) || examples.secondRouteTheoryIds.length === 0) {
        errors.push(`${at}: examples.secondRouteTheoryIds must not be empty`);
      }
      if (!Array.isArray(entry.definitions)) errors.push(`${at}: definitions must be an array (use [] when no term needs defining)`);
      else if (entry.definitions.some(value => typeof value !== 'string' || !value.trim())) errors.push(`${at}: definitions may contain only non-empty text`);

      const putSimply = normalize(entry.putSimply || '');
      if (putSimply) {
        if (putSimplyOwners.has(putSimply)) errors.push(`${at}: putSimply duplicates ${putSimplyOwners.get(putSimply)}`);
        else putSimplyOwners.set(putSimply, at);
        if (putSimply === normalize(entry.title || '')) errors.push(`${at}: putSimply duplicates title`);
        if (putSimply === normalize(entry.subtitle || '')) errors.push(`${at}: putSimply duplicates subtitle`);
      }

      const haystack = normalize(textValues(entry).join(' '));
      BANNED_PHRASES.forEach(phrase => {
        if (haystack.includes(normalize(phrase))) errors.push(`${at}: contains banned placeholder phrase “${phrase}”`);
      });
    });

    const report = window.QUIZ_CONTENT_CHANGE_REPORT;
    if (!report || report.contentVersion !== window.QUIZ_CONTENT_VERSION) {
      errors.push('change report is missing or does not match QUIZ_CONTENT_VERSION');
    } else {
      const classified = new Set([
        ...Object.keys(report.rewritten || {}),
        ...Object.keys(report.carriedOverUnchanged || {}),
        ...Object.keys(report.migratedWithoutCopyChanges || {})
      ]);
      REQUIRED_LAYERS.forEach(layer => {
        if (!classified.has(layer)) errors.push(`change report does not classify the ${layer} layer`);
      });
    }

    if (errors.length) {
      throw new Error(`[content-lint] ${errors.length} failure${errors.length === 1 ? '' : 's'}:\n- ${errors.join('\n- ')}`);
    }

    return Object.freeze({
      status: 'passed',
      version: window.QUIZ_CONTENT_VERSION,
      questions: content.length,
      rules: Object.freeze({
        requiredLayers: REQUIRED_LAYERS.length,
        uniquePutSimply: true,
        putSimplyDiffersFromTitleAndSubtitle: true,
        bannedPhrases: BANNED_PHRASES.length,
        changeReportComplete: true
      })
    });
  };

  window.QUIZ_CONTENT_LINT_REPORT = window.runQuizContentLint();
  document.documentElement.dataset.contentLint = 'passed';
}());
