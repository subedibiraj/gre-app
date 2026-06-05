// ─── STREAK TRACKER + STREAK SHIELD ──────────────────────────────────────────

const STREAK_KEY = 'gre_streak';
const SHIELD_KEY = 'gre_streakShield';

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function dayBefore(dateStr) {
  const d = new Date(dateStr);
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

// ─── STREAK SHIELD ────────────────────────────────────────────────────────────
// 1 free shield per week. Auto-activates if you miss exactly 1 day.
// Resets 7 days after last use.

function loadShield() {
  try { return JSON.parse(localStorage.getItem(SHIELD_KEY)) || { lastUsed: null, shieldedDate: null }; }
  catch { return { lastUsed: null, shieldedDate: null }; }
}

function saveShield(data) {
  localStorage.setItem(SHIELD_KEY, JSON.stringify(data));
}

export function getShieldStatus() {
  const shield = loadShield();
  const now = Date.now();
  const cooldown = 7 * 24 * 60 * 60 * 1000; // 7 days

  const available = !shield.lastUsed || (now - shield.lastUsed > cooldown);
  const daysUntilReset = shield.lastUsed
    ? Math.max(0, Math.ceil((shield.lastUsed + cooldown - now) / 86400000))
    : 0;

  return {
    available,
    lastUsed: shield.lastUsed,
    shieldedDate: shield.shieldedDate,
    daysUntilReset,
    justUsed: shield.shieldedDate === yesterday(), // was shield used to save yesterday?
  };
}

function tryUseShield(streakData) {
  // Shield activates if: user had a streak, missed exactly 1 day, shield is available
  if (!streakData.lastDate || !streakData.current || streakData.current === 0) return false;

  const t = today();
  const y = yesterday();
  const missedDate = dayBefore(t); // the day they missed

  // Only activate if they missed exactly 1 day (lastDate is 2 days ago)
  if (streakData.lastDate === dayBefore(y)) {
    const shield = loadShield();
    const now = Date.now();
    const cooldown = 7 * 24 * 60 * 60 * 1000;
    const available = !shield.lastUsed || (now - shield.lastUsed > cooldown);

    if (available) {
      // Use shield — preserve streak
      saveShield({ lastUsed: now, shieldedDate: missedDate });
      return true;
    }
  }
  return false;
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
    // Potential streak break — try shield
    if (tryUseShield(data)) {
      // Shield saved the streak! Extend by 1 (today counts)
      data.current = (data.current || 0) + 1;
      data.sessionsToday = 1;
    } else {
      // Streak broken for real
      data.current = 1;
      data.sessionsToday = 1;
    }
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
    // Check if shield can save it
    if (!tryUseShield(data)) {
      data.current = 0;
      saveStreak(data);
    }
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
