import { GoogleGenAI } from '@google/genai';
import {
  getGeminiKey, GRE_VERBAL_REGISTER, getDifficultyRules,
  TC_RULES, SE_RULES, RC_RULES, QUANT_RULES, EXPLANATION_FORMAT
} from './_prompts.js';
import { verifyProStatus } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = getGeminiKey(req);
    if (!apiKey) return res.status(400).json({ error: 'No Gemini API key configured.' });

    const isAuthorized = await verifyProStatus(req);
    if (!isAuthorized) return res.status(402).json({ error: 'Payment Required: Custom Drills require a Pro subscription.' });

    const { verbalCounts = {}, quantCounts = {}, difficulty = 'Medium', words = [] } = req.body;
    
    // Map difficulty string to level 1-5
    const diffMap = { 'Easy': 2, 'Medium': 3, 'Hard': 4, 'Adaptive': 3 };
    const level = diffMap[difficulty] || 3;

    const ai = new GoogleGenAI({ apiKey });
    const promises = [];

    // --- VERBAL GENERATION ---
    let vtc = verbalCounts.tc || 0;
    let vse = verbalCounts.se || 0;
    let vvic = verbalCounts.vic || 0;
    let vrc = verbalCounts.rc || 0;

    if (vtc > 0 || vse > 0 || vvic > 0 || vrc > 0) {
      const wordLines = words.slice(0, 30).map(w => `${w.w}: ${w.def}`).join('\n');
      const vSystem = `You are a senior ETS question developer with 20 years of experience writing GRE Verbal questions.
ABSOLUTE RULES:
1. Return ONLY valid JSON. Zero text outside the JSON object. Zero markdown.
2. Every explanation must follow the required format exactly.
3. Questions must read as if they appeared in an actual GRE test booklet.

${GRE_VERBAL_REGISTER}
${TC_RULES}
${SE_RULES}
${RC_RULES}
${EXPLANATION_FORMAT}`;

      let vUser = `Generate a CUSTOM GRE Verbal practice set. Difficulty Level: ${difficulty} (Level ${level}/5)\n\n`;
      if (words.length > 0) vUser += `USE THESE WORDS FOR FILL-IN ANSWERS:\n${wordLines}\n\n`;
      
      vUser += `${getDifficultyRules(level)}\n\n`;
      
      if (vvic > 0) vUser += `GENERATE ${vvic} VIC (Vocabulary-in-Context) questions.\nFormat:\n{"id": 1, "type":"vic", "word": "TACITURN", "sentence": "The ambassador, long known for his taciturn demeanor, surprised observers when he delivered a two-hour speech.", "answer": "B", "opts": [{"l":"A","t":"excessively talkative"}, {"l":"B","t":"habitually silent or reserved"}], "explain": "..."}\n\n`;
      if (vtc > 0) vUser += `GENERATE ${vtc} TC (Text Completion) questions.\nFormat for single blank:\n{"id": 1, "type":"tc", "stem": "...", "blanks": [{"label":"Blank 1","answer":"C","opts":[{"l":"A","t":"..."},...]}], "explain": "..."}\n\n`;
      if (vse > 0) vUser += `GENERATE ${vse} SE (Sentence Equivalence) questions.\nFormat:\n{"id": 1, "type":"se", "stem": "...", "answers": ["A","C"], "opts": [{"l":"A","t":"..."},...], "explain": "..."}\n\n`;
      if (vrc > 0) vUser += `GENERATE ${vrc} RC (Reading Comprehension) passages (each with 3 questions).\nFormat:\n{"id": 1, "type":"rc", "topic": "...", "passage": "...", "questions": [{"id": 1, "type": "primary_purpose", "q": "...", "answer": "B", "opts": [{"l":"A","t":"..."},...], "explain": "..."}]}\n\n`;

      vUser += `RETURN EXACTLY THIS JSON STRUCTURE:
{"vic":[...],"tc":[...],"se":[...],"rc":[...]}`;

      promises.push(
        ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: vUser }] }],
          config: { systemInstruction: vSystem, temperature: 0.7, maxOutputTokens: 8192, responseMimeType: 'application/json' }
        }).then(r => {
          const clean = (r.text || '').replace(/```json|```/g, '').trim();
          return JSON.parse(clean);
        }).catch(e => { console.error('Verbal generation failed', e); return null; })
      );
    } else {
      promises.push(Promise.resolve({ vic: [], tc: [], se: [], rc: [] }));
    }

    // --- QUANT GENERATION ---
    let qArith = quantCounts.arithmetic || 0;
    let qAlg = quantCounts.algebra || 0;
    let qGeom = quantCounts.geometry || 0;
    let qData = quantCounts.data || 0;
    
    let totalQuant = qArith + qAlg + qGeom + qData;

    if (totalQuant > 0) {
      const qSystem = `You are a senior ETS quantitative question developer.
ABSOLUTE RULES:
1. Return ONLY valid JSON. Zero text outside the JSON object.
2. Every explanation must follow the required format exactly.
3. Quant questions must be rigorously checked for mathematical accuracy.

${QUANT_RULES}
${EXPLANATION_FORMAT}`;

      let qUser = `Generate a CUSTOM GRE Quantitative practice set. Difficulty Level: ${difficulty} (Level ${level}/5)\n\n`;
      if (qArith > 0) qUser += `GENERATE ${qArith} questions on Arithmetic.\n`;
      if (qAlg > 0) qUser += `GENERATE ${qAlg} questions on Algebra.\n`;
      if (qGeom > 0) qUser += `GENERATE ${qGeom} questions on Geometry.\n`;
      if (qData > 0) qUser += `GENERATE ${qData} questions on Data Analysis.\n`;

      qUser += `\nInclude a mix of 'qc' (Quantitative Comparison) and 'mc' (Multiple Choice) formats. 
Format for QC:
{"id": 1, "type": "qc", "topic": "Algebra", "qtyA": "x^2", "qtyB": "x^3", "condition": "x > 1", "answer": "B", "explain": "..."}
Format for MC:
{"id": 2, "type": "mc", "topic": "Geometry", "q": "What is the area...", "answer": "C", "opts": [{"l":"A","t":"10"},...], "explain": "..."}

RETURN EXACTLY THIS JSON STRUCTURE:
{"quant":[...]}`;

      promises.push(
        ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: qUser }] }],
          config: { systemInstruction: qSystem, temperature: 0.7, maxOutputTokens: 8192, responseMimeType: 'application/json' }
        }).then(r => {
          const clean = (r.text || '').replace(/```json|```/g, '').trim();
          return JSON.parse(clean);
        }).catch(e => { console.error('Quant generation failed', e); return null; })
      );
    } else {
      promises.push(Promise.resolve({ quant: [] }));
    }

    const [verbalData, quantData] = await Promise.all(promises);

    if (!verbalData || !quantData) {
      return res.status(500).json({ error: 'AI generation failed due to malformed response.' });
    }

    // Merge into unified exam object
    const exam = {
      vic: verbalData.vic || [],
      tc: verbalData.tc || [],
      se: verbalData.se || [],
      rc: verbalData.rc || [],
      quant: quantData.quant || []
    };

    // Assign consistent IDs
    let idCounter = 1;
    ['vic', 'tc', 'se', 'quant'].forEach(section => {
      exam[section].forEach(q => { q.id = idCounter++; });
    });
    exam.rc.forEach(p => {
      p.id = `passage_${idCounter++}`;
      p.questions.forEach(q => { q.id = idCounter++; });
    });

    res.json(exam);
  } catch (err) {
    const msg = err.message || 'Generation failed';
    if (msg.includes('429')) return res.status(429).json({ error: 'Rate limit reached. Wait 30 seconds and try again.' });
    res.status(500).json({ error: msg });
  }
}
