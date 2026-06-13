import { useState, useCallback, useEffect, useRef } from 'react';
import { apiFetch, hasGeminiKey } from '../../lib/gemini';
import C from '../../theme';
import { recordQuantResults, saveLastSessionWrong, getQuantWeakAreas } from '../../engine/QuantErrorEngine';
import { recordScoreSnapshot } from '../../components/ScoreGraph';
import Tag from '../../components/Tag';

// ─── Exam Timer ────────────────────────────────────────────────────────────────
function ExamTimer({ totalSeconds, onTimeUp, active, onRef }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    ref.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(ref.current); onTimeUp?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [active, onTimeUp]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct  = remaining / totalSeconds * 100;
  const urgent = pct < 14;
  const warn   = pct < 33;
  const color  = urgent ? C.red : warn ? C.gold : C.greenBr;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: urgent ? C.redBg : C.surface, border: `1px solid ${urgent ? C.red + '44' : C.border}`, borderRadius: 8, padding: '8px 16px' }}>
      <span style={{ fontSize: 13, color: C.textDim }}>⏱</span>
      <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden', minWidth: 80 }}>
        <div style={{ height: '100%', borderRadius: 2, width: `${pct}%`, background: color, transition: 'width 1s linear' }} />
      </div>
      <span style={{ fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700, color, minWidth: 50 }}>
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

// ─── Question Navigator ────────────────────────────────────────────────────────
function QuestionNav({ questions, currentQ, answers, flagged, onJump }) {
  const getStatus = (q) => {
    if (flagged.has(q._navId)) return 'flagged';
    if (answers[q._navId] !== undefined && answers[q._navId] !== null) return 'answered';
    return 'unanswered';
  };
  const colors = { answered: C.greenBr, flagged: C.gold, unanswered: C.border };
  const labels = { answered: C.greenBr, flagged: C.gold, unanswered: C.textDim };

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Questions</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ label: '✓', color: C.greenBr }, { label: '⚑', color: C.gold }, { label: '○', color: C.textDim }].map((s, i) => (
            <span key={i} style={{ fontSize: 10, color: s.color, fontWeight: 700 }}>{s.label}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {questions.map((q, i) => {
          const st = getStatus(q);
          const isCurr = q._navId === currentQ;
          return (
            <button key={q._navId} onClick={() => onJump(q._navId)} style={{
              width: 30, height: 30, borderRadius: 6, border: `2px solid ${isCurr ? C.gold : colors[st]}`,
              background: isCurr ? C.gold + '33' : st === 'answered' ? C.green + '22' : st === 'flagged' ? C.gold + '22' : 'transparent',
              color: isCurr ? C.gold : labels[st],
              fontFamily: 'Courier New,monospace', fontSize: 10, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>{i + 1}</button>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: C.textDim }}>
        <span>✓ {questions.filter(q => getStatus(q) === 'answered').length} answered</span>
        <span>⚑ {flagged.size} flagged</span>
        <span>○ {questions.filter(q => getStatus(q) === 'unanswered').length} left</span>
      </div>
    </div>
  );
}

// ─── Post-exam analysis ────────────────────────────────────────────────────────
function ExamAnalysis({ exam, allAnswers, score, sessionSeconds, onRetake }) {
  const weakAreas = getQuantWeakAreas().slice(0, 5);
  const topicBreakdown = {};

  // Group wrong answers by topic
  [...(exam.qc || []), ...(exam.mc || []), ...(exam.mcm || []), ...(exam.ne || [])].forEach(q => {
    const t = q.topic || 'General';
    if (!topicBreakdown[t]) topicBreakdown[t] = { correct: 0, total: 0 };
    topicBreakdown[t].total++;
    const navId = `qc_${q.id}` || `mc_${q.id}` || `ne_${q.id}`;
    // check answer
  });

  const band = score.scaledScore >= 168 ? { label: 'Elite', color: C.greenBr, msg: 'Top 2%. Maintain consistency and ace the real thing.' } :
               score.scaledScore >= 163 ? { label: 'Excellent', color: C.greenBr, msg: 'Top 8%. A few more targeted sessions will push you to 168+.' } :
               score.scaledScore >= 158 ? { label: 'Strong', color: C.gold, msg: 'Top 18%. Focus on your weak subtopics to break 163.' } :
               score.scaledScore >= 152 ? { label: 'Developing', color: C.gold, msg: 'Keep going. Consistent daily practice will get you to 158+ in 2 weeks.' } :
               { label: 'Building', color: C.red, msg: 'Focus on concept learning first, then retry practice questions.' };

  return (
    <div>
      {/* Score hero */}
      <div style={{
        background: `linear-gradient(135deg, ${band.color}18, ${C.card})`,
        border: `1px solid ${band.color}33`, borderRadius: 16, padding: '28px 24px', marginBottom: 20, textAlign: 'center',
      }}>
        <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 8px' }}>GRE Quant Estimated Score</p>
        <p style={{ fontFamily: 'Courier New,monospace', fontSize: 64, fontWeight: 700, color: band.color, margin: '0 0 4px', lineHeight: 1 }}>{score.scaledScore}</p>
        <p style={{ color: C.textDim, fontSize: 12, margin: '0 0 8px' }}>out of 170 · {score.total}/{score.max} correct ({Math.round(score.pct * 100)}%)</p>
        <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, background: `${band.color}22`, color: band.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{band.label}</span>
        <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>{band.msg}</p>

        {/* Quant Pacing */}
        {sessionSeconds > 0 && score.max > 0 && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${band.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontSize: 16 }}>⏱</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: C.textMid, fontSize: 12, margin: '0 0 4px' }}>Average Pacing</p>
              <p style={{ fontFamily: 'Courier New,monospace', fontSize: 14, fontWeight: 700, margin: 0, color: (sessionSeconds / score.max) <= 105 ? C.greenBr : (sessionSeconds / score.max) <= 135 ? C.gold : C.red }}>
                {Math.round(sessionSeconds / score.max)}s per question
              </p>
            </div>
            <div style={{ width: 1, height: 30, background: `${band.color}33`, margin: '0 8px' }} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: C.textMid, fontSize: 12, margin: '0 0 4px' }}>Target</p>
              <p style={{ color: C.textDim, fontSize: 13, margin: 0, fontWeight: 700 }}>~105s avg</p>
            </div>
          </div>
        )}
      </div>

      {/* Section breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'QC', got: score.qc, max: score.qcMax, color: C.blue },
          { label: 'MC', got: score.mc, max: score.mcMax, color: C.gold },
          { label: 'MCM', got: score.mcm, max: score.mcmMax, color: '#9B6BDB' },
          { label: 'NE', got: score.ne, max: score.neMax, color: C.greenBr },
        ].map(s => {
          const pct = s.max > 0 ? s.got / s.max : 0;
          const c   = pct >= 0.8 ? C.greenBr : pct >= 0.6 ? C.gold : C.red;
          return (
            <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
              <p style={{ color: C.textDim, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>{s.label}</p>
              <p style={{ fontFamily: 'Courier New,monospace', fontSize: 20, fontWeight: 700, color: s.color, margin: 0 }}>{s.got}/{s.max}</p>
              <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
                <div style={{ height: '100%', width: `${pct * 100}%`, background: c, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cumulative weak areas */}
      {weakAreas.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
          <p style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>📊 Your Weak Subtopics (all-time)</p>
          {weakAreas.map(w => (
            <div key={w.subtopic} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ color: C.text, fontSize: 12, flex: 1 }}>{w.subtopic}</span>
              <div style={{ width: 100, height: 5, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, width: `${w.accuracy}%`, background: w.accuracy >= 80 ? C.green : w.accuracy >= 60 ? C.gold : C.red }} />
              </div>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 11, fontWeight: 700, color: w.accuracy >= 80 ? C.greenBr : w.accuracy >= 60 ? C.gold : C.red, minWidth: 36, textAlign: 'right' }}>
                {w.accuracy}%
              </span>
              <span style={{ color: C.textDim, fontSize: 10 }}>({w.attempts} attempts)</span>
            </div>
          ))}
          <p style={{ color: C.textDim, fontSize: 11, marginTop: 10 }}>
            💡 Study the concepts for your weakest subtopics before taking another mock.
          </p>
        </div>
      )}

      {/* Full review toggle */}
      <FullReview exam={exam} allAnswers={allAnswers} score={score} />

      <div style={{ textAlign: 'center', padding: '24px 0 40px' }}>
        <button onClick={onRetake} style={{
          padding: '13px 36px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color: '#07090F',
          fontWeight: 700, fontSize: 14, fontFamily: 'Georgia,serif',
          boxShadow: `0 4px 16px ${C.gold}44`,
        }}>Take Another Exam ↺</button>
      </div>
    </div>
  );
}

function FullReview({ exam, allAnswers, score }) {
  const [open, setOpen] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.border}`,
      background: C.surface, color: C.textMid, cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 16,
    }}>📋 Show Full Question Review ↓</button>
  );

  const qcAnswers  = allAnswers.qc  || {};
  const mcAnswers  = allAnswers.mc  || {};
  const mcmAnswers = allAnswers.mcm || {};
  const neAnswers  = allAnswers.ne  || {};

  const RevCard = ({ label, color, correct, children, explain }) => (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <span style={{ ...stag_fn(color) }}>{label}</span>
        <span style={{ ...stag_fn(correct ? C.green : C.red) }}>{correct ? '✓' : '✗'}</span>
      </div>
      {children}
      {explain && (
        <div style={{ background: C.surface, borderRadius: 6, padding: '10px 14px', borderLeft: `3px solid ${color}`, marginTop: 8 }}>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>{explain}</p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen(false)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, cursor: 'pointer', fontSize: 12, marginBottom: 12 }}>Hide Review ↑</button>

      <p style={{ color: C.blue, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Quantitative Comparison</p>
      {exam.qc?.map(q => {
        const ans = qcAnswers[q.id];
        const correct = ans === q.answer;
        return (
          <RevCard key={q.id} label="QC" color={C.blue} correct={correct} explain={q.explain}>
            {q.info && <p style={{ color: C.textMid, fontSize: 12, marginBottom: 6 }}>{q.info}</p>}
            <p style={{ color: C.text, fontSize: 13 }}><strong style={{ color: C.blue }}>A:</strong> {q.qtyA} &nbsp;<span style={{ color: C.textDim }}>vs</span>&nbsp; <strong style={{ color: C.gold }}>B:</strong> {q.qtyB}</p>
            <p style={{ color: C.textMid, fontSize: 12, marginTop: 4 }}>Your: <strong style={{ color: correct ? C.greenBr : C.red }}>{ans || '—'}</strong> · Correct: <strong style={{ color: C.greenBr }}>{q.answer}</strong></p>
          </RevCard>
        );
      })}

      <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Multiple Choice</p>
      {exam.mc?.map(q => {
        const correct = mcAnswers[q.id] === q.answer;
        return (
          <RevCard key={q.id} label="MC" color={C.gold} correct={correct} explain={q.explain}>
            <p style={{ color: C.text, fontSize: 13, marginBottom: 6 }}>{q.q}</p>
            <p style={{ color: C.textMid, fontSize: 12 }}>Your: <strong style={{ color: correct ? C.greenBr : C.red }}>{mcAnswers[q.id] || '—'}</strong> · Correct: <strong style={{ color: C.greenBr }}>{q.answer}</strong></p>
          </RevCard>
        );
      })}

      <p style={{ color: C.greenBr, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Numeric Entry</p>
      {exam.ne?.map(q => {
        const correct = String(neAnswers[q.id] || '').trim() === String(q.answer).trim();
        return (
          <RevCard key={q.id} label="NE" color={C.greenBr} correct={correct} explain={q.explain}>
            <p style={{ color: C.text, fontSize: 13, marginBottom: 6 }}>{q.q}</p>
            <p style={{ color: C.textMid, fontSize: 12 }}>Your: <strong style={{ color: correct ? C.greenBr : C.red }}>{neAnswers[q.id] || '—'}</strong> · Correct: <strong style={{ color: C.greenBr }}>{q.answer}</strong></p>
          </RevCard>
        );
      })}
    </div>
  );
}

const stag_fn = (color) => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: color + '22', color });

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuantMock() {
  const [exam, setExam]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Answers keyed by navId
  const [qcA, setQCA]   = useState({});
  const [mcA, setMCA]   = useState({});
  const [mcmA, setMCMA] = useState({});
  const [neA, setNEA]   = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [currentQ, setCurrentQ] = useState(null);
  
  const sessionStart = useRef(null);
  const sessionSeconds = useRef(0);

  const EXAM_TIME = 35 * 60;

  // Build flat question list for navigator
  const allQuestions = exam ? [
    ...(exam.qc  || []).map(q => ({ ...q, _type: 'qc',  _navId: `qc_${q.id}`  })),
    ...(exam.mc  || []).map(q => ({ ...q, _type: 'mc',  _navId: `mc_${q.id}`  })),
    ...(exam.mcm || []).map(q => ({ ...q, _type: 'mcm', _navId: `mcm_${q.id}` })),
    ...(exam.ne  || []).map(q => ({ ...q, _type: 'ne',  _navId: `ne_${q.id}`  })),
  ] : [];

  const questionRefs = useRef({});

  const generate = useCallback(async () => {
    setLoading(true); setError(null); setExam(null); setSubmitted(false);
    setQCA({}); setMCA({}); setMCMA({}); setNEA({});
    setFlagged(new Set()); setCurrentQ(null);
    try {
      const data = await apiFetch('/api/quant-mock', {});
      setExam(data);
      setTimerActive(true);
      sessionStart.current = Date.now();
      // set first Q
      const first = `qc_${data.qc?.[0]?.id}`;
      setCurrentQ(first);
    } catch (e) {
      if (window.showToast) window.showToast(e.message || 'Failed to generate mock exam.');
      else setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const jumpToQ = (navId) => {
    setCurrentQ(navId);
    const el = questionRefs.current[navId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleFlag = (navId) => {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(navId) ? next.delete(navId) : next.add(navId);
      return next;
    });
  };

  const getAnswer = (navId) => {
    const [type, ...rest] = navId.split('_');
    const id = parseInt(rest.join('_'));
    if (type === 'qc')  return qcA[id];
    if (type === 'mc')  return mcA[id];
    if (type === 'mcm') return mcmA[id];
    if (type === 'ne')  return neA[id];
  };

  const calcScore = () => {
    let qc = 0, mc = 0, mcm = 0, ne = 0;
    exam.qc?.forEach(q => { if (qcA[q.id] === q.answer) qc++; });
    exam.mc?.forEach(q => { if (mcA[q.id] === q.answer) mc++; });
    exam.mcm?.forEach(q => {
      const ans = mcmA[q.id] || [];
      if (q.answers.length === ans.length && q.answers.every(a => ans.includes(a))) mcm++;
    });
    exam.ne?.forEach(q => { if (String(neA[q.id] || '').trim() === String(q.answer).trim()) ne++; });
    const total = qc + mc + mcm + ne;
    const max   = (exam.qc?.length || 0) + (exam.mc?.length || 0) + (exam.mcm?.length || 0) + (exam.ne?.length || 0);
    const pct   = max > 0 ? total / max : 0;
    // Non-linear ETS GRE score scale
    const scalePct = (p) => {
      const bands = [
        [0.00,0.10,130,133],[0.10,0.18,133,136],[0.18,0.26,136,139],[0.26,0.34,139,142],
        [0.34,0.42,142,145],[0.42,0.50,145,148],[0.50,0.56,148,151],[0.56,0.62,151,153],
        [0.62,0.68,153,155],[0.68,0.73,155,157],[0.73,0.78,157,159],[0.78,0.82,159,161],
        [0.82,0.86,161,163],[0.86,0.90,163,165],[0.90,0.93,165,167],[0.93,0.96,167,168],
        [0.96,0.99,168,169],[0.99,1.01,169,170],
      ];
      const b = bands.find(([lo,hi])=>p>=lo&&p<hi)||bands[bands.length-1];
      const t = b[1]===b[0]?1:(p-b[0])/(b[1]-b[0]);
      return Math.round(b[2]+t*(b[3]-b[2]));
    };
    const scaledScore = scalePct(pct);
    return { qc, mc, mcm, ne, total, max, pct, scaledScore, qcMax: exam.qc?.length || 0, mcMax: exam.mc?.length || 0, mcmMax: exam.mcm?.length || 0, neMax: exam.ne?.length || 0 };
  };

  const submit = useCallback(() => {
    setSubmitted(true);
    setTimerActive(false);
    if (sessionStart.current) {
      sessionSeconds.current = Math.round((Date.now() - sessionStart.current) / 1000);
    }
    if (!exam) return;
    // Record results for error engine
    const results = [];
    exam.qc?.forEach(q => results.push({ topic: q.topic || 'QC', subtopic: q.topic || 'Quantitative Comparison', correct: qcA[q.id] === q.answer }));
    exam.mc?.forEach(q => results.push({ topic: q.topic || 'MC', subtopic: q.topic || 'Multiple Choice', correct: mcA[q.id] === q.answer }));
    exam.ne?.forEach(q => results.push({ topic: q.topic || 'NE', subtopic: q.topic || 'Numeric Entry', correct: String(neA[q.id] || '').trim() === String(q.answer).trim() }));
    recordQuantResults(results);
    const wrongItems = results.filter(r => !r.correct).slice(0, 3).map(r => ({ subtopic: r.subtopic, question: '' }));
    saveLastSessionWrong(wrongItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, qcA, mcA, neA]);

  const totalAnswered = Object.keys(qcA).length + Object.keys(mcA).length + Object.keys(mcmA).length + Object.keys(neA).length;
  const totalQs = allQuestions.length;

  // ─── LANDING ──────────────────────────────────────────────────────────────
  if (!exam && !loading) return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      <p style={{ fontSize: 52, marginBottom: 8 }}>🧮</p>
      <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: C.gold, marginBottom: 8 }}>GRE Quant Mock Exam</h2>
      <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Full GRE Quantitative Reasoning section. Question navigator, flag-for-review, adaptive analysis.</p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px', textAlign: 'left', marginBottom: 24 }}>
        <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontWeight: 700 }}>Exam Format</p>
        {[
          { s: 'Quantitative Comparison', c: '8 questions', color: C.blue, note: 'Compare two quantities' },
          { s: 'Multiple Choice (Single)', c: '7 questions', color: C.gold, note: 'One correct answer' },
          { s: 'Multiple Choice (Multi)',  c: '2 questions', color: '#9B6BDB', note: 'Select all that apply' },
          { s: 'Numeric Entry',           c: '3 questions', color: C.greenBr, note: 'Type the exact answer' },
        ].map(s => (
          <div key={s.s} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 4, height: 34, background: s.color, borderRadius: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>{s.s}</p>
              <p style={{ color: C.textDim, fontSize: 11, margin: '2px 0 0' }}>{s.note}</p>
            </div>
            <span style={{ ...stag_fn(s.color) }}>{s.c}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10 }}>
          <span style={{ fontSize: 16 }}>⏱</span>
          <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, margin: 0 }}>35 minutes · Question navigator · Flag for review</p>
        </div>
      </div>

      {error && <p style={{ color: C.red, marginBottom: 12 }}>{error}</p>}
      <button onClick={generate} style={{
        padding: '13px 36px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color: '#07090F',
        fontWeight: 700, fontSize: 15, fontFamily: 'Georgia,serif',
        boxShadow: `0 4px 20px ${C.gold}44`,
      }}>Start Quant Mock ⚡</button>
    </div>
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>Generating Quant Mock...</p>
      <p style={{ color: C.textDim, fontSize: 12 }}>8 QC + 7 MC + 2 MCM + 3 NE = 20 questions</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (submitted) {
    const score = calcScore();
    return <ExamAnalysis exam={exam} allAnswers={{ qc: qcA, mc: mcA, mcm: mcmA, ne: neA }} score={score} sessionSeconds={sessionSeconds.current} onRetake={generate} />;
  }

  // ─── EXAM IN PROGRESS ──────────────────────────────────────────────────────
  return (
    <div className="mock-exam-grid" style={{ gap: 20, alignItems: 'start' }}>
      {/* Main exam column */}
      <div>
        {/* Sticky header */}
        <div style={{ position: 'sticky', top: 56, zIndex: 15, background: C.bg, padding: '10px 0', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1 }}><ExamTimer totalSeconds={EXAM_TIME} onTimeUp={submit} active={timerActive} /></div>
          <span style={{ color: totalAnswered === totalQs ? C.greenBr : C.textDim, fontSize: 12 }}>{totalAnswered}/{totalQs}</span>
          <button onClick={submit} style={{ padding: '7px 16px', borderRadius: 6, border: `1px solid ${C.red}44`, background: `${C.red}18`, color: C.red, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Submit</button>
        </div>

        {/* QC */}
        <p style={{ color: C.blue, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>⚖️ Quantitative Comparison</p>
        {exam.qc?.map(q => {
          const navId = `qc_${q.id}`;
          const opts = [{ l: 'A', t: 'Quantity A is greater' }, { l: 'B', t: 'Quantity B is greater' }, { l: 'C', t: 'Equal' }, { l: 'D', t: 'Cannot be determined' }];
          return (
            <div key={q.id} ref={el => questionRefs.current[navId] = el} style={{
              background: C.card, border: `1px solid ${flagged.has(navId) ? C.gold + '55' : C.border}`,
              borderRadius: 12, padding: '16px 18px', marginBottom: 12,
              borderLeft: `3px solid ${qcA[q.id] ? C.blue : flagged.has(navId) ? C.gold : C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ color: C.blue, fontFamily: 'Courier New,monospace', fontSize: 11, fontWeight: 700 }}>QC</span>
                {q.topic && <span style={{ color: C.textDim, fontSize: 10 }}>{q.topic}</span>}
                <button onClick={() => toggleFlag(navId)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: flagged.has(navId) ? C.gold : C.textDim, cursor: 'pointer', fontSize: 14 }}>⚑</button>
              </div>
              {q.info && <p style={{ color: C.textMid, fontSize: 12, background: C.surface, padding: '6px 10px', borderRadius: 6, marginBottom: 10 }}>{q.info}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 0, marginBottom: 12, alignItems: 'stretch' }}>
                <div style={{ background: `${C.blue}12`, borderRadius: '8px 0 0 8px', padding: '12px 14px', textAlign: 'center' }}>
                  <p style={{ color: C.blue, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Qty A</p>
                  <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'Georgia,serif' }}>{q.qtyA}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.surface }}>
                  <span style={{ color: C.textDim, fontSize: 10, fontWeight: 700 }}>vs</span>
                </div>
                <div style={{ background: `${C.gold}12`, borderRadius: '0 8px 8px 0', padding: '12px 14px', textAlign: 'center' }}>
                  <p style={{ color: C.gold, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Qty B</p>
                  <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'Georgia,serif' }}>{q.qtyB}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                {opts.map(o => (
                  <button key={o.l} onClick={() => setQCA(p => ({ ...p, [q.id]: o.l }))} style={{
                    padding: '8px 12px', borderRadius: 6, textAlign: 'left', fontSize: 11, cursor: 'pointer',
                    border: `1px solid ${qcA[q.id] === o.l ? C.gold : C.border}`,
                    background: qcA[q.id] === o.l ? C.goldDim + '44' : C.surface,
                    color: qcA[q.id] === o.l ? C.gold : C.textMid,
                    fontWeight: qcA[q.id] === o.l ? 700 : 400,
                  }}><span style={{ fontFamily: 'Courier New,monospace', marginRight: 6, opacity: 0.5 }}>{o.l}</span>{o.t}</button>
                ))}
              </div>
            </div>
          );
        })}

        {/* MC */}
        <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 12, marginTop: 20 }}>📝 Multiple Choice</p>
        {[...(exam.mc || []).map(q => ({ ...q, _multi: false })), ...(exam.mcm || []).map(q => ({ ...q, _multi: true }))].map(q => {
          const navId = q._multi ? `mcm_${q.id}` : `mc_${q.id}`;
          const sel   = q._multi ? (mcmA[q.id] || []) : mcA[q.id];
          const toggle = (l) => {
            if (q._multi) {
              setMCMA(p => { const c = p[q.id] || []; return { ...p, [q.id]: c.includes(l) ? c.filter(x => x !== l) : [...c, l] }; });
            } else {
              setMCA(p => ({ ...p, [q.id]: l }));
            }
          };
          return (
            <div key={navId} ref={el => questionRefs.current[navId] = el} style={{
              background: C.card, border: `1px solid ${flagged.has(navId) ? C.gold + '55' : C.border}`,
              borderRadius: 12, padding: '16px 18px', marginBottom: 12,
              borderLeft: `3px solid ${(q._multi ? sel.length > 0 : !!sel) ? C.gold : flagged.has(navId) ? C.gold : C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {q._multi ? <span style={{ ...stag_fn('#9B6BDB') }}>Select All</span> : <span style={{ color: C.gold, fontFamily: 'Courier New,monospace', fontSize: 11, fontWeight: 700 }}>MC</span>}
                {q.topic && <span style={{ color: C.textDim, fontSize: 10 }}>{q.topic}</span>}
                <button onClick={() => toggleFlag(navId)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: flagged.has(navId) ? C.gold : C.textDim, cursor: 'pointer', fontSize: 14 }}>⚑</button>
              </div>
              <p style={{ color: C.text, fontSize: 13, lineHeight: 1.8, marginBottom: 10, fontFamily: 'Georgia,serif' }}>{q.q}</p>
              <div style={{ display: 'grid', gap: 5 }}>
                {q.opts.map(o => {
                  const isSel = q._multi ? sel.includes(o.l) : sel === o.l;
                  return (
                    <button key={o.l} onClick={() => toggle(o.l)} style={{
                      padding: '9px 14px', borderRadius: 6, textAlign: 'left', fontSize: 12, cursor: 'pointer',
                      border: `1px solid ${isSel ? C.gold : C.border}`, background: isSel ? C.goldDim + '44' : C.surface,
                      color: isSel ? C.gold : C.textMid, fontWeight: isSel ? 700 : 400,
                    }}><span style={{ fontFamily: 'Courier New,monospace', marginRight: 8, opacity: 0.5 }}>{o.l}.</span>{o.t}</button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* NE */}
        <p style={{ color: C.greenBr, fontSize: 13, fontWeight: 700, marginBottom: 12, marginTop: 20 }}>✏️ Numeric Entry</p>
        {exam.ne?.map(q => {
          const navId = `ne_${q.id}`;
          return (
            <div key={q.id} ref={el => questionRefs.current[navId] = el} style={{
              background: C.card, border: `1px solid ${flagged.has(navId) ? C.gold + '55' : C.border}`,
              borderRadius: 12, padding: '16px 18px', marginBottom: 12,
              borderLeft: `3px solid ${neA[q.id] ? C.greenBr : flagged.has(navId) ? C.gold : C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ color: C.greenBr, fontFamily: 'Courier New,monospace', fontSize: 11, fontWeight: 700 }}>NE</span>
                {q.topic && <span style={{ color: C.textDim, fontSize: 10 }}>{q.topic}</span>}
                <button onClick={() => toggleFlag(navId)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: flagged.has(navId) ? C.gold : C.textDim, cursor: 'pointer', fontSize: 14 }}>⚑</button>
              </div>
              <p style={{ color: C.text, fontSize: 13, lineHeight: 1.8, marginBottom: 12, fontFamily: 'Georgia,serif' }}>{q.q}</p>
              <input type="text" value={neA[q.id] || ''} onChange={e => setNEA(p => ({ ...p, [q.id]: e.target.value }))}
                placeholder="Type answer" style={{
                  padding: '11px 16px', borderRadius: 8, fontSize: 16, fontWeight: 700,
                  fontFamily: 'Courier New,monospace', width: 180,
                  border: `2px solid ${neA[q.id] ? C.greenBr : C.border}`,
                  background: C.surface, color: C.text, outline: 'none',
                }} />
            </div>
          );
        })}

        <div style={{ textAlign: 'center', padding: '28px 0 60px' }}>
          <button onClick={submit} style={{
            padding: '13px 40px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color: '#07090F',
            fontWeight: 700, fontSize: 14, fontFamily: 'Georgia,serif',
            boxShadow: `0 4px 16px ${C.gold}44`,
          }}>Submit Exam →</button>
          <p style={{ color: C.textDim, fontSize: 11, marginTop: 8 }}>Unanswered = incorrect. You can submit any time.</p>
        </div>
      </div>

      {/* Sticky right navigator */}
      <div style={{ position: 'sticky', top: 100 }}>
        <QuestionNav
          questions={allQuestions}
          currentQ={currentQ}
          answers={{ ...Object.fromEntries(Object.entries(qcA).map(([k, v]) => [`qc_${k}`, v])), ...Object.fromEntries(Object.entries(mcA).map(([k, v]) => [`mc_${k}`, v])), ...Object.fromEntries(Object.entries(neA).map(([k, v]) => [`ne_${k}`, v])) }}
          flagged={flagged}
          onJump={jumpToQ}
        />
      </div>
    </div>
  );
}
