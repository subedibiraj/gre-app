// ─── ADAPTIVE DIFFICULTY ENGINE ───────────────────────────────────────────────
// Computes a real performance profile from history and SR data.
// This is the single source of truth for "how hard should the next session be?"

const PERF_KEY = 'gre_performance';

function load() {
  try { return JSON.parse(localStorage.getItem(PERF_KEY)) || {}; }
  catch { return {}; }
}

function save(data) {
  localStorage.setItem(PERF_KEY, JSON.stringify(data));
}

// ─── Section-level accuracy tracking ─────────────────────────────────────────
// sections: 'vic' | 'tc' | 'tc_single' | 'tc_double' | 'se' | 'rc' | 'qc' | 'mc' | 'ne'

export function recordSectionResult(section, correct, total) {
  if (!total) return;
  const data = load();
  if (!data[section]) data[section] = { attempts: 0, correct: 0, sessions: [] };
  data[section].attempts += total;
  data[section].correct  += correct;
  // Keep last 10 session accuracies for trend
  const acc = Math.round(correct / total * 100);
  data[section].sessions = [...(data[section].sessions || []).slice(-9), { acc, date: Date.now() }];
  save(data);
}

export function getSectionAccuracy(section) {
  const data = load();
  const d = data[section];
  if (!d || d.attempts === 0) return null;
  return Math.round(d.correct / d.attempts * 100);
}

// ─── Compute full difficulty profile ─────────────────────────────────────────
// Returns a profile object used to build adaptive prompts

export function getDifficultyProfile() {
  const data = load();

  const acc = (sec) => {
    const d = data[sec];
    if (!d || d.attempts < 3) return null; // need at least 3 attempts
    return Math.round(d.correct / d.attempts * 100);
  };

  const classify = (pct) => {
    if (pct === null) return 'calibrating';
    if (pct < 40)  return 'struggling';
    if (pct < 60)  return 'developing';
    if (pct < 75)  return 'competent';
    if (pct < 88)  return 'proficient';
    return 'advanced';
  };

  // Map section accuracy to GRE difficulty level (1-5)
  const toLevel = (pct) => {
    if (pct === null) return 2; // start medium
    if (pct < 40)  return 1;
    if (pct < 60)  return 2;
    if (pct < 75)  return 3;
    if (pct < 88)  return 4;
    return 5;
  };

  const vicAcc  = acc('vic');
  const tcAcc   = acc('tc');
  const seAcc   = acc('se');
  const rcAcc   = acc('rc');
  const qcAcc   = acc('qc');
  const mcAcc   = acc('mc');
  const neAcc   = acc('ne');

  // Overall verbal: weighted average (TC+SE are harder, worth more)
  const verbalPcts = [vicAcc, tcAcc, seAcc, rcAcc].filter(x => x !== null);
  const verbalAvg  = verbalPcts.length ? Math.round(verbalPcts.reduce((a,b) => a+b,0) / verbalPcts.length) : null;

  const quantPcts  = [qcAcc, mcAcc, neAcc].filter(x => x !== null);
  const quantAvg   = quantPcts.length ? Math.round(quantPcts.reduce((a,b) => a+b,0) / quantPcts.length) : null;

  return {
    verbal: {
      overall:  { acc: verbalAvg, level: toLevel(verbalAvg), status: classify(verbalAvg) },
      vic:      { acc: vicAcc,  level: toLevel(vicAcc),  status: classify(vicAcc) },
      tc:       { acc: tcAcc,   level: toLevel(tcAcc),   status: classify(tcAcc) },
      se:       { acc: seAcc,   level: toLevel(seAcc),   status: classify(seAcc) },
      rc:       { acc: rcAcc,   level: toLevel(rcAcc),   status: classify(rcAcc) },
    },
    quant: {
      overall:  { acc: quantAvg, level: toLevel(quantAvg), status: classify(quantAvg) },
      qc:       { acc: qcAcc,  level: toLevel(qcAcc),  status: classify(qcAcc) },
      mc:       { acc: mcAcc,  level: toLevel(mcAcc),  status: classify(mcAcc) },
      ne:       { acc: neAcc,  level: toLevel(neAcc),  status: classify(neAcc) },
    },
  };
}

// ─── Build human-readable profile string for prompts ─────────────────────────
export function buildVerbalProfileString(profile) {
  const p = profile.verbal;
  const lines = [];

  const desc = {
    calibrating: 'not yet calibrated (first session — start medium)',
    struggling:  'struggling (<40% accuracy) — use simpler vocabulary, obvious distractors, clear pivot words',
    developing:  'developing (40-59%) — medium difficulty, 1-2 tricky distractors',
    competent:   'competent (60-74%) — standard GRE difficulty, 2-3 strong distractors',
    proficient:  'proficient (75-87%) — above-average difficulty, near-synonym distractors',
    advanced:    'advanced (88%+) — hardest GRE level, subtle near-synonym traps, complex stems',
  };

  lines.push(`STUDENT PERFORMANCE PROFILE (use this to calibrate difficulty):`);
  lines.push(`• VIC: ${desc[p.vic.status]}`);
  lines.push(`• TC:  ${desc[p.tc.status]}`);
  lines.push(`• SE:  ${desc[p.se.status]}`);
  lines.push(`• RC:  ${desc[p.rc.status]}`);
  lines.push(`• Overall verbal level: ${p.overall.level}/5`);

  if (p.tc.level < p.se.level) {
    lines.push(`NOTE: TC is weaker than SE — prioritize TC difficulty calibration`);
  }
  if (p.se.level < p.tc.level) {
    lines.push(`NOTE: SE is weaker than TC — prioritize SE with clear twin-pair distractors`);
  }
  if (p.rc.status === 'struggling') {
    lines.push(`NOTE: RC is very weak — use shorter passage (150-200 words), straightforward main idea question`);
  } else if (p.rc.status === 'advanced') {
    lines.push(`NOTE: RC is strong — use longer passage (300-400 words), inference + vocabulary-in-context questions`);
  }

  return lines.join('\n');
}

export function buildQuantProfileString(profile) {
  const p = profile.quant;
  const lines = [];

  const desc = {
    calibrating: 'not yet calibrated — mix of easy/medium',
    struggling:  'struggling (<40%) — basic computation, single-step problems',
    developing:  'developing (40-59%) — standard difficulty',
    competent:   'competent (60-74%) — GRE standard',
    proficient:  'proficient (75-87%) — above average, multi-step',
    advanced:    'advanced (88%+) — hardest GRE, abstract constraints',
  };

  lines.push(`STUDENT QUANT PERFORMANCE PROFILE:`);
  lines.push(`• QC: ${desc[p.qc.status]}`);
  lines.push(`• MC: ${desc[p.mc.status]}`);
  lines.push(`• NE: ${desc[p.ne.status]}`);
  lines.push(`• Overall quant level: ${p.overall.level}/5`);

  if (p.qc.status === 'struggling') {
    lines.push(`NOTE: QC is weak — use concrete numbers, test obvious cases, avoid variable-only constraints`);
  }
  if (p.qc.status === 'advanced') {
    lines.push(`NOTE: QC is strong — use abstract algebraic constraints, 0/negative/fraction traps`);
  }

  return lines.join('\n');
}

// ─── Difficulty-specific question count distribution ─────────────────────────
export function getVerbalDistribution(profile) {
  const level = profile.verbal.overall.level; // 1-5
  // Returns [easy, medium, hard] counts for TC (4 total)
  const tcDist = [
    [3, 1, 0], // level 1: 3 easy, 1 medium
    [2, 2, 0], // level 2: 2 easy, 2 medium
    [1, 2, 1], // level 3: standard GRE mix
    [0, 2, 2], // level 4: harder
    [0, 1, 3], // level 5: very hard
  ][level - 1] || [1, 2, 1];

  // SE difficulty
  const seLevel = profile.verbal.se.level;
  const seDiff = seLevel <= 2 ? 'easy' : seLevel <= 3 ? 'medium' : seLevel <= 4 ? 'hard' : 'very hard';

  // RC length
  const rcLevel = profile.verbal.rc.level;
  const rcLength = rcLevel <= 2 ? 150 : rcLevel <= 3 ? 220 : rcLevel <= 4 ? 300 : 380;

  return { tcDist, seDiff, rcLength };
}
