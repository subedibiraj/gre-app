// ─── XP & GAMIFICATION ENGINE ─────────────────────────────────────────────────
const XP_KEY = 'gre_xp';
const ACH_KEY = 'gre_achievements';

const LEVELS = [
  { name: 'Novice', min: 0, icon: 'Sprout' },
  { name: 'Learner', min: 200, icon: 'BookOpen' },
  { name: 'Scholar', min: 600, icon: 'GraduationCap' },
  { name: 'Strategist', min: 1500, icon: 'Brain' },
  { name: 'Expert', min: 3000, icon: 'Zap' },
  { name: 'Master', min: 5500, icon: 'Crown' },
  { name: '170 Club', min: 9000, icon: 'Gem' },
];

const ACHIEVEMENTS = [
  { id: 'first_practice', name: 'First Steps', desc: 'Complete your first practice session', icon: 'Target', xp: 50 },
  { id: 'first_mock', name: 'Brave Soul', desc: 'Take your first mock exam', icon: 'Award', xp: 100 },
  { id: 'streak_3', name: 'Building Momentum', desc: 'Reach a 3-day streak', icon: 'Flame', xp: 75 },
  { id: 'streak_7', name: 'One Week Strong', desc: '7-day study streak', icon: 'Zap', xp: 150 },
  { id: 'streak_14', name: 'Unstoppable', desc: '14-day study streak', icon: 'Waves', xp: 300 },
  { id: 'streak_30', name: 'Iron Will', desc: '30-day study streak', icon: 'Trophy', xp: 500 },
  { id: 'words_50', name: 'Word Collector', desc: 'Study 50 vocabulary words', icon: 'Library', xp: 100 },
  { id: 'words_200', name: 'Lexicon Builder', desc: 'Study 200 vocabulary words', icon: 'BookOpen', xp: 250 },
  { id: 'words_400', name: 'Vocabulary Master', desc: 'Study 400+ vocabulary words', icon: 'Medal', xp: 500 },
  { id: 'score_160v', name: 'Verbal 160+', desc: 'Score 160+ on a verbal mock', icon: 'Sparkles', xp: 200 },
  { id: 'score_165v', name: 'Verbal 165+', desc: 'Score 165+ on a verbal mock', icon: 'Star', xp: 400 },
  { id: 'score_160q', name: 'Quant 160+', desc: 'Score 160+ on a quant mock', icon: 'Binary', xp: 200 },
  { id: 'score_165q', name: 'Quant 165+', desc: 'Score 165+ on a quant mock', icon: 'Calculator', xp: 400 },
  { id: 'perfect_set', name: 'Flawless', desc: 'Get 100% on any practice set', icon: 'CheckCircle', xp: 200 },
  { id: 'all_topics', name: 'Well Rounded', desc: 'Practice all 4 quant topics', icon: 'Target', xp: 150 },
  { id: 'night_owl', name: 'Night Owl', desc: 'Study after 10 PM', icon: 'Moon', xp: 50 },
  { id: 'early_bird', name: 'Early Bird', desc: 'Study before 7 AM', icon: 'Sun', xp: 50 },
];

// XP values for actions
const XP_VALUES = {
  study_word: 2,
  expand_concept: 3,
  practice_correct: 10,
  practice_wrong: 3,
  complete_practice: 25,
  complete_mock: 50,
  mock_bonus_160: 30,
  mock_bonus_165: 60,
  daily_streak: 15,
};

export function getXP() {
  try { return JSON.parse(localStorage.getItem(XP_KEY)) || { total: 0, today: 0, todayDate: '' }; }
  catch { return { total: 0, today: 0, todayDate: '' }; }
}

function saveXP(data) {
  localStorage.setItem(XP_KEY, JSON.stringify(data));
}

export function addXP(amount, reason) {
  const data = getXP();
  const today = new Date().toDateString();
  if (data.todayDate !== today) { data.today = 0; data.todayDate = today; }
  data.total += amount;
  data.today += amount;
  saveXP(data);
  return { total: data.total, gained: amount, reason };
}

export function getLevel(totalXP) {
  let current = LEVELS[0];
  let nextLevel = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].min) {
      current = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
      break;
    }
  }
  const progress = nextLevel
    ? (totalXP - current.min) / (nextLevel.min - current.min)
    : 1;
  return { ...current, progress: Math.min(progress, 1), nextLevel, totalXP };
}

export function getUnlockedAchievements() {
  try { return JSON.parse(localStorage.getItem(ACH_KEY)) || []; }
  catch { return []; }
}

export function unlockAchievement(id) {
  const unlocked = getUnlockedAchievements();
  if (unlocked.includes(id)) return null;
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return null;
  unlocked.push(id);
  localStorage.setItem(ACH_KEY, JSON.stringify(unlocked));
  addXP(ach.xp, `Achievement: ${ach.name}`);
  return ach;
}

export function checkAchievements(context) {
  const newAchs = [];
  const check = (id) => {
    const result = unlockAchievement(id);
    if (result) newAchs.push(result);
  };

  if (context.practiceCompleted) check('first_practice');
  if (context.mockCompleted) check('first_mock');
  if (context.streak >= 3) check('streak_3');
  if (context.streak >= 7) check('streak_7');
  if (context.streak >= 14) check('streak_14');
  if (context.streak >= 30) check('streak_30');
  if (context.wordsStudied >= 50) check('words_50');
  if (context.wordsStudied >= 200) check('words_200');
  if (context.wordsStudied >= 400) check('words_400');
  if (context.verbalScore >= 160) check('score_160v');
  if (context.verbalScore >= 165) check('score_165v');
  if (context.quantScore >= 160) check('score_160q');
  if (context.quantScore >= 165) check('score_165q');
  if (context.perfectScore) check('perfect_set');
  if (context.allQuantTopics) check('all_topics');

  const hour = new Date().getHours();
  if (hour >= 22 || hour < 4) check('night_owl');
  if (hour >= 4 && hour < 7) check('early_bird');

  return newAchs;
}

export { LEVELS, ACHIEVEMENTS, XP_VALUES };
