// ─── SPACED REPETITION ENGINE ─────────────────────────────────────────────────
// SM-2 inspired algorithm adapted for GRE vocabulary
// Intervals: 1 → 3 → 7 → 14 → 30 days (well-known spaced repetition schedule)

const SR_KEY = 'gre_spacedRep';
const INTERVALS = [1, 3, 7, 14, 30]; // days

function loadSR() {
  try { return JSON.parse(localStorage.getItem(SR_KEY)) || {}; }
  catch { return {}; }
}

function saveSR(data) {
  localStorage.setItem(SR_KEY, JSON.stringify(data));
}

// Get or create a word's SR record
function getWordRecord(word) {
  const data = loadSR();
  return data[word] || {
    word,
    level: 0,           // index into INTERVALS
    correctStreak: 0,
    totalSeen: 0,
    totalCorrect: 0,
    lastSeen: null,
    nextDue: null,
    mastered: false,
  };
}

// Update a word after answering (correct or wrong)
export function updateWordSR(word, isCorrect) {
  const data = loadSR();
  const rec = data[word] || getWordRecord(word);

  rec.totalSeen++;
  rec.lastSeen = Date.now();

  if (isCorrect) {
    rec.totalCorrect++;
    rec.correctStreak++;
    if (rec.correctStreak >= 2 && rec.level < INTERVALS.length - 1) {
      rec.level++;
    }
    if (rec.level >= INTERVALS.length - 1 && rec.correctStreak >= 3) {
      rec.mastered = true;
    }
  } else {
    rec.correctStreak = 0;
    rec.level = 0; // Reset to shortest interval
    rec.mastered = false;
  }

  const intervalDays = INTERVALS[rec.level];
  rec.nextDue = Date.now() + intervalDays * 24 * 60 * 60 * 1000;

  data[word] = rec;
  saveSR(data);
  return rec;
}

// Batch update multiple words
export function updateWordsSR(words, isCorrectFn) {
  words.forEach(w => updateWordSR(w, isCorrectFn(w)));
}

// Get all words that are due for review
export function getDueWords() {
  const data = loadSR();
  const now = Date.now();
  return Object.values(data)
    .filter(r => !r.mastered && r.nextDue && r.nextDue <= now)
    .sort((a, b) => a.nextDue - b.nextDue);
}

// Get words that are "weak" (level 0 or 1 and seen at least once)
export function getWeakWordsSR() {
  const data = loadSR();
  return Object.values(data)
    .filter(r => r.level <= 1 && r.totalSeen > 0 && !r.mastered)
    .sort((a, b) => a.correctStreak - b.correctStreak);
}

// Get mastery stats
export function getSRStats() {
  const data = loadSR();
  const all = Object.values(data);
  return {
    totalTracked: all.length,
    mastered: all.filter(r => r.mastered).length,
    learning: all.filter(r => !r.mastered && r.totalSeen > 0).length,
    due: all.filter(r => !r.mastered && r.nextDue && r.nextDue <= Date.now()).length,
    weak: all.filter(r => r.level <= 1 && r.totalSeen > 0).length,
    avgAccuracy: all.length > 0
      ? Math.round(all.reduce((s, r) => s + (r.totalSeen > 0 ? r.totalCorrect / r.totalSeen : 0), 0) / all.length * 100)
      : 0,
  };
}

// Get the SR level label for display
export function getSRLevel(word) {
  const data = loadSR();
  const rec = data[word];
  if (!rec || rec.totalSeen === 0) return { label: 'New', color: '#3A4E68', level: -1 };
  if (rec.mastered) return { label: 'Mastered', color: '#2EBB80', level: 5 };
  const labels = ['Weak', 'Learning', 'Familiar', 'Strong', 'Almost'];
  const colors = ['#B53028', '#E4A060', '#C8A535', '#24976A', '#2EBB80'];
  return { label: labels[rec.level] || 'Learning', color: colors[rec.level] || '#C8A535', level: rec.level };
}

// Get all SR data (for progress display)
export function getAllSR() {
  return loadSR();
}
