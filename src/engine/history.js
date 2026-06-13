// ─── SCORE HISTORY ENGINE ─────────────────────────────────────────────────────
// Tracks every practice session with section-level granularity.
// Powers trend analysis, adaptive difficulty, and progress dashboard.

const HISTORY_KEY = 'gre_scoreHistory';
const MAX_ENTRIES = 300;

export function getScoreHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

export function addScoreEntry(entry) {
  const history = getScoreHistory();
  const full = {
    ...entry,
    timestamp: Date.now(),
    date: new Date().toLocaleDateString(),
    hour: new Date().getHours(),
  };
  history.push(full);
  if (history.length > MAX_ENTRIES) history.splice(0, history.length - MAX_ENTRIES);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ─── AWA HISTORY ──────────────────────────────────────────────────────────────
const AWA_HISTORY_KEY = 'gre_awaHistory';

export function getAwaHistory() {
  try { return JSON.parse(localStorage.getItem(AWA_HISTORY_KEY)) || []; }
  catch { return []; }
}

export function addAwaEntry(entry) {
  const history = getAwaHistory();
  const full = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
    date: new Date().toLocaleDateString(),
  };
  history.push(full);
  if (history.length > 50) history.splice(0, history.length - 50);
  localStorage.setItem(AWA_HISTORY_KEY, JSON.stringify(history));
}

// ─── Section-level trend ──────────────────────────────────────────────────────
export function getSectionTrend(type, section, count = 8) {
  return getScoreHistory()
    .filter(e => e.type === type && e.sections?.[section] != null)
    .slice(-count)
    .map(e => ({
      date: e.date,
      acc: Math.round(e.sections[section].correct / e.sections[section].total * 100),
    }));
}

// ─── Overall stats ────────────────────────────────────────────────────────────
export function getOverallStats() {
  const history       = getScoreHistory();
  const verbalMocks   = history.filter(e => e.type === 'verbal-mock');
  const quantMocks    = history.filter(e => e.type === 'quant-mock');
  const verbalPrac    = history.filter(e => e.type === 'verbal-practice');
  const quantPrac     = history.filter(e => e.type === 'quant-practice');
  const today         = new Date().toLocaleDateString();
  const todayEntries  = history.filter(e => e.date === today);

  // Section-level accuracy from practice sessions
  const sectionAccuracy = {};
  ['vic', 'tc', 'se', 'rc'].forEach(sec => {
    const entries = verbalPrac.filter(e => e.sections?.[sec]);
    if (entries.length) {
      const total   = entries.reduce((s, e) => s + e.sections[sec].total, 0);
      const correct = entries.reduce((s, e) => s + e.sections[sec].correct, 0);
      sectionAccuracy[sec] = total > 0 ? Math.round(correct / total * 100) : null;
    } else {
      sectionAccuracy[sec] = null;
    }
  });

  ['qc', 'mc', 'ne'].forEach(sec => {
    const entries = quantPrac.filter(e => e.sections?.[sec]);
    if (entries.length) {
      const total   = entries.reduce((s, e) => s + e.sections[sec].total, 0);
      const correct = entries.reduce((s, e) => s + e.sections[sec].correct, 0);
      sectionAccuracy[sec] = total > 0 ? Math.round(correct / total * 100) : null;
    } else {
      sectionAccuracy[sec] = null;
    }
  });

  // Score trends (last 6 mocks)
  const verbalTrend = verbalMocks.slice(-6).map(e => ({ date: e.date, score: e.scaledScore }));
  const quantTrend  = quantMocks.slice(-6).map(e => ({ date: e.date, score: e.scaledScore }));

  // Quant Topic-level accuracy (from both quant-practice AND quant-mock)
  const topicAccuracy = {};
  const allQuantWithTopics = [...quantPrac, ...quantMocks].filter(e => e.topics);
  ['arithmetic', 'algebra', 'geometry', 'data'].forEach(topic => {
    const entries = allQuantWithTopics.filter(e => e.topics?.[topic]);
    if (entries.length) {
      const total   = entries.reduce((s, e) => s + e.topics[topic].total, 0);
      const correct = entries.reduce((s, e) => s + e.topics[topic].correct, 0);
      topicAccuracy[topic] = total > 0 ? Math.round(correct / total * 100) : null;
    } else {
      topicAccuracy[topic] = null;
    }
  });

  // Pacing analytics
  const quantPacing = quantMocks.filter(e => e.timeTaken > 0);
  const verbalPacing = verbalMocks.filter(e => e.timeTaken > 0);
  const avgQuantPace = quantPacing.length
    ? Math.round(quantPacing.reduce((a, e) => {
        const totalQs = Object.values(e.sections || {}).reduce((s, sec) => s + (sec.total || 0), 0) || 1;
        return a + e.timeTaken / totalQs;
      }, 0) / quantPacing.length)
    : null;
  const avgVerbalPace = verbalPacing.length
    ? Math.round(verbalPacing.reduce((a, e) => {
        const totalQs = Object.values(e.sections || {}).reduce((s, sec) => s + (sec.total || 0), 0) || 1;
        return a + e.timeTaken / totalQs;
      }, 0) / verbalPacing.length)
    : null;

  // Total questions and overall accuracy (handles both section-based and flat entries)
  let totalQuestions = 0, totalCorrect = 0;
  history.forEach(e => {
    if (e.sections) {
      Object.values(e.sections).forEach(sec => {
        totalQuestions += sec.total || 0;
        totalCorrect  += sec.correct || 0;
      });
    } else if (e.total) {
      totalQuestions += e.total;
      totalCorrect  += e.correct || 0;
    }
  });

  return {
    totalSessions:   history.length,
    todaySessions:   todayEntries.length,
    totalQuestions,
    overallAccuracy: totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : null,
    verbalMockAvg:   verbalMocks.length ? Math.round(verbalMocks.reduce((a, e) => a + e.scaledScore, 0) / verbalMocks.length) : null,
    quantMockAvg:    quantMocks.length  ? Math.round(quantMocks.reduce((a, e) => a + e.scaledScore, 0) / quantMocks.length) : null,
    verbalMockBest:  verbalMocks.length ? Math.max(...verbalMocks.map(e => e.scaledScore)) : null,
    quantMockBest:   quantMocks.length  ? Math.max(...quantMocks.map(e => e.scaledScore)) : null,
    lastVerbalMock:  verbalMocks[verbalMocks.length - 1] || null,
    lastQuantMock:   quantMocks[quantMocks.length - 1] || null,
    sectionAccuracy,
    topicAccuracy,
    verbalTrend,
    quantTrend,
    avgQuantPace,
    avgVerbalPace,
    recentSessions:  history.slice(-10),
  };
}

export function getRecentTrend(type, count = 5) {
  return getScoreHistory().filter(e => e.type === type).slice(-count);
}
