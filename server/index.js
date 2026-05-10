import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50kb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── QUESTION GENERATION ENDPOINT ─────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  try {
    const { dayNum, theme, currentWords, allWords, weakWords, scores } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const bankLines = allWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');
    const weakNote = weakWords?.length
      ? `\n\nIMPORTANT — These words the student consistently gets WRONG. Weight them heavily:\n${weakWords.slice(0,12).join(', ')}`
      : '';
    const scoreNote = scores
      ? `\nPrevious session scores: ${JSON.stringify(scores)}`
      : '';

    const systemPrompt = `You are an elite GRE Verbal question writer with 15+ years of experience creating official ETS-quality questions. You produce questions indistinguishable from real GRE items.

ABSOLUTE RULES — VIOLATION OF ANY RULE INVALIDATES YOUR OUTPUT:
1. Return ONLY valid JSON. No markdown fences, no backticks, no commentary outside the JSON object.
2. Use ONLY words from the provided word bank. Never invent words not in the bank.
3. Never use the answer word in the question stem or context clue.
4. Every question must have exactly ONE unambiguous correct answer derivable from the stem alone.
5. TC stems must contain a clear pivot word (despite, although, yet, however, while, surprisingly, nevertheless) OR a clear definitional clue that points to exactly one answer.
6. SE pairs must produce sentences that are alike in meaning — not just both grammatically correct.
7. Distractors must be plausible but clearly wrong upon careful analysis.

QUALITY STANDARDS:
- Write stems that feel like actual GRE passages — sophisticated syntax, academic register
- Vary sentence structures: some with subordinate clauses, some with appositives, some with parallel construction
- Include cross-day words to test cumulative knowledge
- Mix difficulty: 2 easy, 3 medium, 2 hard for drill; 1 easy, 1 medium, 1 hard for TC
- For weak words: create questions that test the EXACT nuance the student likely confused`;

    const currentWordsList = currentWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');

    const userPrompt = `Generate adaptive GRE Verbal practice for Day ${dayNum}: "${theme}"

═══ SECTION 1: DAY RECALL (current day words) ═══
Word pool: Use ONLY these Day ${dayNum} words. Give a vivid definition/scenario — student must type the word.
${currentWordsList}
${weakNote}
${scoreNote}

═══ SECTION 2: TEXT COMPLETION (current day words ONLY) ═══
Word pool for TC: Use ONLY these Day ${dayNum} words as correct answers and distractors.
${currentWordsList}

═══ SECTION 3: SENTENCE EQUIVALENCE (current day words ONLY) ═══
Word pool for SE: Use ONLY Day ${dayNum} words. The 2 correct answers must be from today's word list.
${currentWordsList}

═══ GENERATION REQUIREMENTS ═══
• 7 day recall questions — Day ${dayNum} words ONLY, give definition/scenario, student types the word
• 3 text completion questions — Day ${dayNum} words ONLY (1 easy single-blank, 1 medium single-blank, 1 hard double-blank)
• 2 sentence equivalence questions — Day ${dayNum} words ONLY (select exactly 2 synonymous answers from 6 options)

FORMAT RULES:
- Drill: {"id":N, "q":"vivid scenario description that does NOT contain the answer word", "a":"WORD"}
- TC single-blank: use [B1] marker in stem, provide 5 options A-E
- TC double-blank: use [B1] and [B2] markers in stem, provide A-C for blank 1, D-F for blank 2
- SE: provide 6 options A-F, exactly 2 correct that produce equivalent meaning
- Each TC/SE must include an "explain" field with step-by-step reasoning

Return this EXACT JSON structure (no other text):
{
  "drill": [
    {"id": 1, "q": "description", "a": "WORD"}
  ],
  "tc": [
    {
      "id": 1,
      "stem": "sentence with [B1] marker",
      "blanks": [
        {
          "label": "Blank 1",
          "answer": "B",
          "opts": [{"l":"A","t":"word1"},{"l":"B","t":"word2"},{"l":"C","t":"word3"},{"l":"D","t":"word4"},{"l":"E","t":"word5"}]
        }
      ],
      "explain": "Step-by-step: The clue word X signals Y. Therefore Z is correct because..."
    }
  ],
  "se": [
    {
      "id": 1,
      "stem": "sentence with _______ blank",
      "answers": ["C","D"],
      "opts": [{"l":"A","t":"word1"},{"l":"B","t":"word2"},{"l":"C","t":"word3"},{"l":"D","t":"word4"},{"l":"E","t":"word5"},{"l":"F","t":"word6"}],
      "explain": "Both X and Y mean Z in this context. Test: 'sentence with X' ✓ 'sentence with Y' ✓ Same meaning."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const clean = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseErr) {
      console.error('JSON parse failed. Length:', clean.length, 'Last 100 chars:', clean.substring(clean.length - 100));
      console.error('Full response:', clean.substring(0, 500));
      return res.status(500).json({ error: 'AI returned incomplete response. Try again.' });
    }

    // Validate structure
    if (!parsed.drill || !parsed.tc || !parsed.se) {
      return res.status(500).json({ error: 'AI response missing required sections.' });
    }

    res.json(parsed);
  } catch (error) {
    console.error('Generation error:', error.message);
    let msg = error.message || 'Failed to generate questions';
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      msg = 'API rate limit reached. Please wait 30 seconds and try again.';
      return res.status(429).json({ error: msg });
    }
    res.status(500).json({ error: msg });
  }
});

// ─── CHAT ENDPOINT (AI TUTOR) ─────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt || 'You are a helpful GRE tutor.',
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    res.json({ response: response.text || 'No response generated.' });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  🤖 GRE API server on http://localhost:${PORT}`);
  console.log(`  📡 POST /api/generate — AI question generation`);
  console.log(`  💬 POST /api/chat    — AI tutor chat\n`);
});
