// ─── GRE PROMPT FRAGMENTS — PRODUCTION QUALITY ───────────────────────────────
// Every fragment here is precision-engineered to produce authentic GRE questions.
// These are the same standards real ETS item writers use.

export function getGeminiKey(req) {
  const userKey = (req.headers['x-gemini-key'] || '').trim();
  const envKey  = (process.env.GEMINI_API_KEY || '').trim();
  return userKey || envKey;
}

// ─── ACADEMIC REGISTER ────────────────────────────────────────────────────────
export const GRE_VERBAL_REGISTER = `
ACADEMIC REGISTER REQUIREMENTS (non-negotiable):
• Stems must read like excerpts from: literary criticism, scientific reviews, historical analysis,
  philosophical treatises, economic commentary, art criticism, or social science writing
• Use subordinate clauses, appositives, and parallel constructions — never simple subject-verb
• Avoid: first-person, contractions, colloquialisms, brand names, social media references
• Authentic GRE subjects: historians, scientists, philosophers, critics, economists,
  novelists, biographers, politicians, archaeologists, psychologists
• Authentic GRE openers: "Although long celebrated for...", "Despite her reputation for...",
  "Critics who dismissed X as... failed to recognize...", "The author's insistence on... belied...",
  "What distinguished X from contemporaries was not... but rather...", "Far from being merely...",
  "Scholars have long debated whether...", "The conventional view that... overlooks..."
`;

// ─── DIFFICULTY CALIBRATION ────────────────────────────────────────────────────
// Maps difficulty level (1-5) to concrete construction rules
export function getDifficultyRules(level) {
  const rules = {
    1: `DIFFICULTY LEVEL 1 (Easy):
• Vocabulary: common GRE words (from first 100 high-frequency list)
• TC stems: single pivot word, unambiguous direction, correct answer is most common synonym
• Distractor quality: clearly wrong, different semantic field
• SE: correct pair are obvious synonyms (e.g., loquacious/garrulous)
• RC: 130-160 words, single clear thesis, main idea question only
• Wrong answers: only 1 plausible distractor per question`,

    2: `DIFFICULTY LEVEL 2 (Medium-Easy):
• Vocabulary: standard GRE words, no rare obscurities
• TC stems: clear pivot word, slight ambiguity in blank direction
• Distractor quality: 2 plausible distractors per question
• SE: correct pair are synonyms but one near-synonym distractor present
• RC: 180-220 words, 2 questions (main idea + specific detail)
• Wrong answers: 1-2 answers that fit tone but not meaning`,

    3: `DIFFICULTY LEVEL 3 (Medium — Standard GRE):
• Vocabulary: full GRE range including less common words
• TC stems: pivot words present but require careful parsing, 2-3 sentence stems
• Distractor quality: 2-3 strong distractors per question, same semantic field as answer
• SE: correct pair share contextual meaning; distractors share positive/negative tone but different meaning
• RC: 220-280 words, 3 questions (main idea + inference + vocabulary-in-context)
• Wrong answers: all 4 wrong answers must be defensible to a naive reader`,

    4: `DIFFICULTY LEVEL 4 (Hard):
• Vocabulary: rare GRE words; nuanced distinction between near-synonyms required
• TC stems: no obvious pivot word; meaning extracted from context alone; 3-4 sentence stems
• Distractor quality: 3-4 strong distractors; correct answer requires precise word knowledge
• SE: correct pair share ONLY contextual meaning (not dictionary synonyms); distractors look like twins
• RC: 280-350 words, 3 questions including inference and "most accurately describes the author's attitude"
• Wrong answers: every wrong answer must be immediately plausible to a test-taker who doesn't know the word`,

    5: `DIFFICULTY LEVEL 5 (Very Hard — 165+):
• Vocabulary: most obscure GRE words; correct answer requires knowing precise nuance
• TC stems: abstract academic contexts; correct answer requires knowing BOTH word AND nuance
• Distractor quality: 4 strong distractors; incorrect answers are words the test-taker likely knows
• SE: correct pair are NOT dictionary synonyms but produce sentences with the same logical meaning
• RC: 320-400 words, 3 questions; all inference-based; "The passage suggests... but NOT..."
• Wrong answers: designed to fool 70% of test-takers who know the vocabulary`,
  };
  return rules[level] || rules[3];
}

// ─── TC RULES ─────────────────────────────────────────────────────────────────
export const TC_RULES = `
TEXT COMPLETION CONSTRUCTION RULES:
SINGLE-BLANK (5 options A-E):
  1. The blank must have EVIDENCE in the stem — derivable from surrounding text alone
  2. PIVOT WORDS signal contrast: despite, although, yet, however, while, nevertheless,
     paradoxically, surprisingly, ironically, in spite of, notwithstanding, far from
  3. SUPPORT WORDS signal continuation: indeed, as expected, not surprisingly, characteristically,
     accordingly, consequently, fittingly, understandably
  4. Wrong answers must be from the SAME semantic field as the correct answer
  5. NEVER put the answer word in the stem
  6. The stem must make grammatical sense with the correct answer only

DOUBLE-BLANK (3 options per blank, A-C for Blank 1, D-F for Blank 2):
  1. Each blank MUST have independent evidence — do not make one blank dependent on the other
  2. The two blanks should NOT be simple antonyms of each other
  3. Correct answer combination must work together logically
  4. Wrong combinations: one correct + one wrong = must produce nonsensical meaning
  5. ALL 4 wrong combinations must fail (not just some)

TRIPLE-BLANK: Do not generate unless specifically requested.
`;

// ─── SE RULES ─────────────────────────────────────────────────────────────────
export const SE_RULES = `
SENTENCE EQUIVALENCE CONSTRUCTION RULES:
1. 6 options: 2 correct (twins) + 2 plausible-but-wrong (same tone) + 2 clearly-wrong
2. THE TWIN TEST: Complete the sentence with Word 1 alone. Complete it with Word 2 alone.
   The resulting sentences must be essentially identical in meaning. If they differ even slightly,
   they are NOT valid twins. Use this test on every question.
3. FORBIDDEN: pairing words that are synonyms but produce different sentences
   (e.g., "cautious" vs "timid" — cautious is neutral, timid implies weakness — NOT twins)
4. REQUIRED: at least 1 distractor that is the same part of speech AND same positive/negative tone
   as the correct answer, but subtly wrong in meaning
5. EXPLANATION must: name the twins, explain why they are twins, explain why each wrong
   answer fails the twin test specifically
`;

// ─── RC RULES ─────────────────────────────────────────────────────────────────
export const RC_RULES = `
READING COMPREHENSION CONSTRUCTION RULES:
PASSAGE:
  • Must take a discernible POSITION or present a TENSION between two views
  • Every sentence must be necessary — no padding
  • Dense with meaning; every 50 words should contain at least one testable claim
  • Topics: natural sciences (evolution, physics, neuroscience), humanities (literary criticism,
    art history, philosophy), social sciences (economics, sociology, political science)

QUESTION TYPES (cycle through all 3):
  Q1 — PRIMARY PURPOSE: "The primary purpose of the passage is to..."
       Wrong answers: too narrow (describes one paragraph only), too broad, opposite tone
  Q2 — INFERENCE: "The passage implies/suggests that..."
       Must be derivable from the text but not explicitly stated
       Wrong answers: too strong (passage doesn't go that far), contradicts passage, not in passage
  Q3 — VOCABULARY IN CONTEXT: "The word X (line N) is used to mean..."
       Use a word with multiple meanings; correct answer is the contextual meaning, NOT the common meaning
       Wrong answers: the word's most common dictionary meaning (must be one of the wrong answers)

TONE TYPES: critical, analytical, qualified approval, measured skepticism, cautious endorsement,
scholarly neutrality — never enthusiastic praise or harsh condemnation
`;

// ─── QUANT RULES ──────────────────────────────────────────────────────────────
export const QUANT_RULES = `
QUANTITATIVE REASONING CONSTRUCTION RULES:

QC (Quantitative Comparison):
  • ALWAYS 4 choices: A="Qty A greater", B="Qty B greater", C="Equal", D="Cannot determine"
  • Distribute answers: roughly 25% each across a session
  • TRAP CONSTRUCTION — every QC must contain at least one of:
    (a) Variable sign trap: assumes x>0 but x could be negative
    (b) Fraction trap: assumes x>1 but 0<x<1 reverses inequality
    (c) Zero trap: x=0 makes both equal when you'd expect them different
    (d) Exponent trap: x²≥0 always; x^even vs x^odd behavior
    (e) Integer assumption trap: x is rational, not necessarily integer
  • Constraints: use sparingly; when present, test what happens at boundaries
  • EXPLANATION must include: (1) approach, (2) calculation, (3) the specific trap, (4) test case that proves D if applicable

MC (Multiple Choice):
  • All 5 wrong answers must be results of SPECIFIC identifiable errors:
    A: correct calculation, wrong formula
    B: correct formula, arithmetic error
    C: correct method, forgot constraint
    D: plausible estimate
    E: inverted fraction or opposite operation
  • EXPLANATION must identify which error produces each wrong answer

NE (Numeric Entry):
  • No options — must have UNIQUE numeric answer
  • Answer must be exact (integer or simple fraction)
  • Include unit label in the question if needed
`;

// ─── EXPLANATION FORMAT ────────────────────────────────────────────────────────
export const EXPLANATION_FORMAT = `
EXPLANATION FORMAT REQUIREMENTS:
Every explanation must have this structure:
APPROACH: [1 sentence — what strategy to use]
SOLUTION: [step-by-step work]
WHY CORRECT: [1 sentence — why the correct answer is provably right]
WRONG ANSWERS: [For each wrong answer: "X is wrong because..."]
TRAP: [The specific cognitive trap this question is testing]
`;
