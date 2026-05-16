// ─── SCORE HISTORY ENGINE ─────────────────────────────────────────────────────
// Tracks every practice session and mock exam for trend analysis

const HISTORY_KEY = 'gre_scoreHistory';

export function getScoreHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

export function addScoreEntry(entry) {
  const history = getScoreHistory();
  history.push({
    ...entry,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
  });
  // Keep last 200 entries
  if (history.length > 200) history.splice(0, history.length - 200);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Types:
// { type: 'verbal-practice', day: 1, correct: 10, total: 15, sections: { vic, tc, se, rc } }
// { type: 'verbal-mock', correct: 15, total: 20, scaledScore: 162 }
// { type: 'quant-practice', topic: 'algebra', correct: 7, total: 10 }
// { type: 'quant-mock', correct: 16, total: 20, scaledScore: 165 }

export function getRecentTrend(type, count = 5) {
  const history = getScoreHistory().filter(e => e.type === type);
  return history.slice(-count);
}

export function getOverallStats() {
  const history = getScoreHistory();
  const verbalMocks = history.filter(e => e.type === 'verbal-mock');
  const quantMocks = history.filter(e => e.type === 'quant-mock');
  const today = new Date().toLocaleDateString();
  const todayEntries = history.filter(e => e.date === today);

  return {
    totalSessions: history.length,
    todaySessions: todayEntries.length,
    verbalMockAvg: verbalMocks.length > 0
      ? Math.round(verbalMocks.reduce((a, e) => a + e.scaledScore, 0) / verbalMocks.length) : null,
    quantMockAvg: quantMocks.length > 0
      ? Math.round(quantMocks.reduce((a, e) => a + e.scaledScore, 0) / quantMocks.length) : null,
    verbalMockBest: verbalMocks.length > 0
      ? Math.max(...verbalMocks.map(e => e.scaledScore)) : null,
    quantMockBest: quantMocks.length > 0
      ? Math.max(...quantMocks.map(e => e.scaledScore)) : null,
    lastVerbalMock: verbalMocks[verbalMocks.length - 1] || null,
    lastQuantMock: quantMocks[quantMocks.length - 1] || null,
  };
}
