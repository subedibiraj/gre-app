// ─── STREAK TRACKER ───────────────────────────────────────────────────────────

const STREAK_KEY = 'gre_streak';

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY)) || {}; }
  catch { return {}; }
}

function saveStreak(data) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

// Call this when user completes any practice section
export function recordPractice() {
  const data = loadStreak();
  const t = today();

  if (data.lastDate === t) {
    // Already practiced today — increment session count
    data.sessionsToday = (data.sessionsToday || 0) + 1;
  } else if (data.lastDate === yesterday()) {
    // Consecutive day — extend streak
    data.current = (data.current || 0) + 1;
    data.sessionsToday = 1;
  } else if (!data.lastDate) {
    // First ever practice
    data.current = 1;
    data.sessionsToday = 1;
  } else {
    // Streak broken
    data.current = 1;
    data.sessionsToday = 1;
  }

  data.lastDate = t;
  data.longest = Math.max(data.longest || 0, data.current);
  data.totalDays = (data.totalDays || 0) + (data.sessionsToday === 1 ? 1 : 0);
  data.totalSessions = (data.totalSessions || 0) + 1;

  saveStreak(data);
  return data;
}

// Get current streak info
export function getStreak() {
  const data = loadStreak();
  const t = today();
  const y = yesterday();

  // Check if streak is still alive
  if (data.lastDate && data.lastDate !== t && data.lastDate !== y) {
    // Streak is broken
    data.current = 0;
    saveStreak(data);
  }

  return {
    current: data.current || 0,
    longest: data.longest || 0,
    lastDate: data.lastDate || null,
    practicedToday: data.lastDate === t,
    totalDays: data.totalDays || 0,
    totalSessions: data.totalSessions || 0,
    sessionsToday: data.lastDate === t ? (data.sessionsToday || 0) : 0,
  };
}
