// ─── QUANT ERROR ENGINE ────────────────────────────────────────────────────────
// Tracks wrong answers by subtopic across ALL quant sessions.
// Powers adaptive question weighting and weak-area identification.

const KEY = 'gre_quant_errors';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Record results for a set of questions after a session
// questions: [{id, topic, subtopic, correct: bool}]
export function recordQuantResults(questions) {
  const data = load();
  const today = new Date().toDateString();

  questions.forEach(q => {
    const key = q.subtopic || q.topic || 'General';
    if (!data[key]) data[key] = { attempts: 0, wrong: 0, history: [] };
    data[key].attempts++;
    if (!q.correct) data[key].wrong++;
    // Keep last 20 attempts per subtopic
    data[key].history = [...(data[key].history || []).slice(-19), {
      correct: q.correct, date: today,
    }];
  });

  save(data);
}

// Get accuracy % per subtopic, sorted weakest first
export function getQuantWeakAreas() {
  const data = load();
  return Object.entries(data)
    .filter(([, v]) => v.attempts >= 2)
    .map(([subtopic, v]) => ({
      subtopic,
      attempts: v.attempts,
      wrong: v.wrong,
      accuracy: Math.round((1 - v.wrong / v.attempts) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

// Get top N weakest subtopics as strings (for API prompt)
export function getWeakSubtopics(n = 4) {
  return getQuantWeakAreas().slice(0, n).map(w => w.subtopic);
}

// Get full error data
export function getQuantErrorData() {
  return load();
}

// Get a weighted distribution for next session:
// returns subtopics to emphasize based on error rate
export function getWeightedTopicFocus(topicId, topicSubtopics) {
  const data = load();
  const weak = topicSubtopics.filter(sub => {
    const d = data[sub];
    if (!d || d.attempts < 2) return false;
    return (d.wrong / d.attempts) > 0.4; // >40% wrong rate
  });
  return weak;
}

// Get "tonight's 3" — top 3 wrong questions from last session
// Call this with the session's wrong items: [{subtopic, question}]
export function saveLastSessionWrong(items) {
  localStorage.setItem('gre_quant_last_wrong', JSON.stringify(
    items.slice(0, 3).map(i => ({ ...i, date: new Date().toDateString() }))
  ));
}

export function getLastSessionWrong() {
  try { return JSON.parse(localStorage.getItem('gre_quant_last_wrong')) || []; }
  catch { return []; }
}

// Overall quant stats summary
export function getQuantStats() {
  const data = load();
  const entries = Object.values(data);
  if (!entries.length) return { totalAttempts: 0, avgAccuracy: 0, weakCount: 0 };
  const totalAttempts = entries.reduce((a, v) => a + v.attempts, 0);
  const totalCorrect  = entries.reduce((a, v) => a + (v.attempts - v.wrong), 0);
  const avgAccuracy   = totalAttempts > 0 ? Math.round(totalCorrect / totalAttempts * 100) : 0;
  const weakCount     = entries.filter(v => v.attempts >= 2 && v.wrong / v.attempts > 0.4).length;
  return { totalAttempts, avgAccuracy, weakCount };
}

// Clear all error data (for settings/reset)
export function clearQuantErrors() {
  localStorage.removeItem(KEY);
  localStorage.removeItem('gre_quant_last_wrong');
}
