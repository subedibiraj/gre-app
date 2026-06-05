// ─── SPACED REPETITION ENGINE (SM-2 proper) ───────────────────────────────────
// Proper SM-2: wrong answer drops 1-2 levels (not reset to 0)
// Intervals: 1 → 3 → 7 → 14 → 30 → 60 days
// Easiness factor adjusts per word based on history

const SR_KEY   = 'gre_spacedRep';
const INTERVALS = [1, 3, 7, 14, 30, 60];

function loadSR() {
  try { return JSON.parse(localStorage.getItem(SR_KEY)) || {}; }
  catch { return {}; }
}

function saveSR(data) {
  try { localStorage.setItem(SR_KEY, JSON.stringify(data)); }
  catch { /* storage full — skip */ }
}

function newRecord(word) {
  return {
    word,
    level:         0,
    easiness:      2.5,   // SM-2 easiness factor (2.5 default)
    correctStreak: 0,
    totalSeen:     0,
    totalCorrect:  0,
    lastSeen:      null,
    nextDue:       null,
    mastered:      false,
  };
}

// ─── Core update — proper SM-2 ────────────────────────────────────────────────
export function updateWordSR(word, isCorrect, quality = null) {
  // quality: 0-5 (SM-2 grade). If null, we infer from isCorrect (5=correct, 2=wrong)
  const q = quality !== null ? quality : (isCorrect ? 5 : 2);

  const data = loadSR();
  const rec  = data[word] || newRecord(word);

  rec.totalSeen++;
  rec.lastSeen = Date.now();

  if (q >= 3) {
    // Correct (quality 3-5)
    rec.totalCorrect++;
    rec.correctStreak++;

    // Advance level every 2 correct answers
    if (rec.correctStreak >= 2 && rec.level < INTERVALS.length - 1) {
      rec.level++;
      rec.correctStreak = 0;
    }

    // Update SM-2 easiness factor
    rec.easiness = Math.max(1.3,
      rec.easiness + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
    );

    // Mastered = level 5 (60-day interval) + 3+ correct streak
    if (rec.level >= INTERVALS.length - 1 && rec.totalCorrect / rec.totalSeen >= 0.85) {
      rec.mastered = true;
    }
  } else {
    // Wrong (quality 0-2) — SM-2 proper: drop 1-2 levels, don't reset to 0
    rec.correctStreak = 0;
    rec.mastered      = false;

    // Penalize easiness
    rec.easiness = Math.max(1.3, rec.easiness - 0.2);

    // Drop level (min 0)
    const drop = q === 0 ? 2 : 1;  // catastrophic wrong: drop 2; close: drop 1
    rec.level = Math.max(0, rec.level - drop);
  }

  // Compute next due date using easiness-adjusted interval
  const baseDays    = INTERVALS[rec.level];
  const adjustedDays = rec.level === 0 ? baseDays : Math.round(baseDays * rec.easiness / 2.5);
  rec.nextDue = Date.now() + adjustedDays * 24 * 60 * 60 * 1000;

  data[word] = rec;
  saveSR(data);
  return rec;
}

export function updateWordsSR(words, isCorrectFn) {
  words.forEach(w => updateWordSR(w, isCorrectFn(w)));
}

// ─── Due words ────────────────────────────────────────────────────────────────
export function getDueWords() {
  const data = loadSR();
  const now  = Date.now();
  return Object.values(data)
    .filter(r => !r.mastered && r.nextDue && r.nextDue <= now)
    .sort((a, b) => a.nextDue - b.nextDue);
}

// ─── Weak words (level 0-1, seen at least once) ───────────────────────────────
export function getWeakWordsSR() {
  const data = loadSR();
  return Object.values(data)
    .filter(r => r.level <= 1 && r.totalSeen > 0 && !r.mastered)
    .sort((a, b) => (a.totalCorrect / Math.max(a.totalSeen, 1)) - (b.totalCorrect / Math.max(b.totalSeen, 1)));
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export function getSRStats() {
  const data  = loadSR();
  const all   = Object.values(data);
  const seen  = all.filter(r => r.totalSeen > 0);
  return {
    totalTracked: all.length,
    mastered:     all.filter(r => r.mastered).length,
    learning:     seen.filter(r => !r.mastered).length,
    due:          all.filter(r => !r.mastered && r.nextDue && r.nextDue <= Date.now()).length,
    weak:         all.filter(r => r.level <= 1 && r.totalSeen > 0 && !r.mastered).length,
    avgAccuracy:  seen.length
      ? Math.round(seen.reduce((s, r) => s + r.totalCorrect / r.totalSeen, 0) / seen.length * 100)
      : 0,
  };
}

// ─── Level label ──────────────────────────────────────────────────────────────
export function getSRLevel(word) {
  const data = loadSR();
  const rec  = data[word];
  if (!rec || rec.totalSeen === 0) return { label: 'New',      color: '#3A4E68', level: -1 };
  if (rec.mastered)                return { label: 'Mastered', color: '#2EBB80', level: 5  };
  const labels = ['Weak', 'Learning', 'Familiar', 'Strong', 'Almost', 'Mastered'];
  const colors = ['#B53028', '#E4A060', '#C8A535', '#24976A', '#2EBB80', '#2EBB80'];
  return { label: labels[rec.level] || 'Learning', color: colors[rec.level] || '#C8A535', level: rec.level };
}

export function getAllSR() { return loadSR(); }
