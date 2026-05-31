// Shared GRE prompt fragments for all API routes

export const GRE_VERBAL_REGISTER = `
AUTHENTIC GRE REGISTER REQUIREMENTS:
- Stems must read like excerpts from academic writing: literary criticism, scientific reviews, historical analysis, philosophical treatises, economic commentary, or art criticism
- Use subordinate clauses, appositives, and parallel constructions — never simple subject-verb sentences
- Avoid first-person, contractions, colloquialisms, and pop-culture references
- Character/subject types authentic to GRE: historians, scientists, philosophers, critics, economists, novelists, biographers, politicians
- Sentence openers authentic to GRE: "Although long celebrated for...", "Despite her reputation for...", "Critics who dismissed X as... failed to recognize...", "The author's insistence on... belied...", "What distinguished X from contemporaries was not... but rather..."
`;

export const TC_RULES = `
TEXT COMPLETION RULES (mirror real ETS standards):
1. SINGLE-BLANK (5 options A-E): The stem must contain either:
   (a) A PIVOT WORD signaling contrast: despite, although, yet, however, while, nevertheless, paradoxically, surprisingly, ironically, in spite of
   (b) A SUPPORT/CONTINUATION signal: as expected, indeed, not surprisingly, characteristically, accordingly, consequently
   (c) A DEFINITIONAL CLUE: the blank is explained or illustrated by the surrounding text
   — The correct answer must be derivable from the stem ALONE, not from general knowledge
   — Wrong answers must be from the SAME SEMANTIC FIELD
   
2. DOUBLE-BLANK (3 options per blank, A-C for blank 1, D-F for blank 2):
   — Each blank must have INDEPENDENT evidence in the stem
   — The two blanks should NOT be simple opposites of each other
   — Correct answer for each blank must work WITH the other correct answer
   
3. DIFFICULTY CALIBRATION:
   — Easy: single pivot word, unambiguous direction, correct answer is the most common word
   — Medium: requires understanding a nuance between similar words
   — Hard: abstract academic context, correct answer hinges on a precise distinction between near-synonyms
`;

export const SE_RULES = `
SENTENCE EQUIVALENCE RULES (mirror real ETS standards):
1. The 6 options must include: 2 correct answers + 2 plausible-but-wrong + 2 clearly-wrong
2. The 2 correct answers must be genuine synonyms OR produce sentences with the same logical meaning
3. CRITICAL TEST: read the sentence with ONLY Word 1. Read it with ONLY Word 2. The resulting meanings must be essentially the same.
4. Difficulty calibration:
   — Easy: 2 correct words are obvious near-synonyms
   — Medium: all 6 words are somewhat related, correct pair requires knowing nuanced difference
   — Hard: correct pair shares only contextual meaning
`;

export const RC_RULES = `
READING COMPREHENSION RULES (mirror real ETS standards):
PASSAGE REQUIREMENTS:
- Academic register throughout
- Passages must take a discernible POSITION or present a TENSION
- Topics: natural sciences, humanities, social sciences
- Each passage should contain at least one statement the student could confuse with another

QUESTION TYPE DISTRIBUTION (for 3 questions per passage):
Q1: MAIN IDEA or PRIMARY PURPOSE
Q2: INFERENCE
Q3: VOCABULARY IN CONTEXT or SPECIFIC DETAIL

WRONG ANSWER CONSTRUCTION:
- Main idea wrongs: too narrow, too broad, or opposite to author's stance
- Inference wrongs: too strong, goes beyond passage, contradicts passage
- Vocabulary wrongs: most common everyday meaning vs contextual meaning
`;

export function getGeminiKey(req) {
  // Priority: request header (user-supplied) → environment variable
  return req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY || '';
}
