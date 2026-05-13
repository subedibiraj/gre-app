import { useState, useEffect, useRef, useCallback } from 'react';
import C from '../theme';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import StemRenderer from '../components/StemRenderer';
import Btn from '../components/Btn';
import Tag from '../components/Tag';

// ─── EXAM TIMER ────────────────────────────────────────────────────────────────
function ExamTimer({ totalSeconds, onTimeUp, active }) {
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
  const pct = (remaining / totalSeconds) * 100;
  const urgent = pct < 17; // <5min
  const warning = pct < 33; // <10min

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: urgent ? C.redBg : C.surface,
      border: `1px solid ${urgent ? C.red + '44' : C.border}`,
      borderRadius: 8, padding: '8px 16px',
    }}>
      <span style={{ fontSize: 13, color: C.textDim }}>⏱</span>
      <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden', minWidth: 80 }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${pct}%`,
          background: urgent ? C.red : warning ? C.gold : C.green,
          transition: 'width 1s linear',
        }} />
      </div>
      <span style={{
        fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700,
        color: urgent ? C.red : warning ? C.gold : C.greenBr,
        minWidth: 50,
      }}>
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

// ─── QUESTION RENDERERS ────────────────────────────────────────────────────────
function TCQuestion({ q, answer, onAnswer, checked }) {
  const sel = answer || q.blanks.map(() => null);
  const select = (bIdx, l) => {
    if (checked) return;
    const n = [...sel]; n[bIdx] = l;
    onAnswer(n);
  };
  const score = checked ? q.blanks.filter((b, i) => sel[i] === b.answer).length : null;

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Tag color={C.blue}>TC</Tag>
        {checked && <Tag color={score === q.blanks.length ? C.green : C.red}>{score}/{q.blanks.length}</Tag>}
      </div>
      <StemRenderer stem={q.stem} blanks={q.blanks} selections={sel} isChecked={checked} />
      {q.blanks.map((blank, bIdx) => (
        <div key={bIdx} style={{ marginBottom: 10 }}>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 6, fontWeight: 700 }}>{blank.label}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {blank.opts.map(opt => {
              const isSel = sel[bIdx] === opt.l;
              const correct = checked && opt.l === blank.answer;
              const wrong = checked && isSel && opt.l !== blank.answer;
              return (
                <button key={opt.l} onClick={() => select(bIdx, opt.l)} style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 12,
                  fontFamily: 'Courier New,monospace', fontWeight: isSel || correct ? 700 : 400,
                  cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
                  border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                  background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                  color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                }}>
                  <span style={{ color: C.textDim, marginRight: 4 }}>{opt.l}.</span>{opt.t}{correct ? ' ✓' : wrong ? ' ✗' : ''}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {checked && (
        <div style={{ background: C.surface, borderRadius: 6, padding: 12, borderLeft: `3px solid ${C.blue}`, marginTop: 8 }}>
          <p style={{ fontSize: 10, color: C.blue, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Explanation</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{q.explain}</p>
        </div>
      )}
    </Card>
  );
}

function SEQuestion({ q, answer, onAnswer, checked }) {
  const sel = answer || [];
  const toggle = l => {
    if (checked) return;
    const n = sel.includes(l) ? sel.filter(x => x !== l) : sel.length < 2 ? [...sel, l] : sel;
    onAnswer(n);
  };
  const correct = checked && q.answers.every(a => sel.includes(a)) && sel.length === 2;

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Tag color={C.gold}>SE</Tag>
        <span style={{ color: C.textDim, fontSize: 11 }}>Select 2 · {sel.length}/2</span>
        {checked && <Tag color={correct ? C.green : C.red}>{correct ? '✓' : '✗'}</Tag>}
      </div>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>{q.stem}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {q.opts.map(opt => {
          const isSel = sel.includes(opt.l);
          const isCorrect = checked && q.answers.includes(opt.l);
          const isWrong = checked && isSel && !q.answers.includes(opt.l);
          return (
            <button key={opt.l} onClick={() => toggle(opt.l)} style={{
              padding: '8px 12px', borderRadius: 6, textAlign: 'left', fontSize: 12,
              fontFamily: 'Courier New,monospace', fontWeight: isSel || isCorrect ? 700 : 400,
              cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
              border: `1px solid ${isCorrect ? C.green : isWrong ? C.red : isSel ? C.gold : C.border}`,
              background: isCorrect ? C.greenBg : isWrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
              color: isCorrect ? C.greenBr : isWrong ? C.red : isSel ? C.gold : C.textMid,
            }}>
              <span style={{ color: C.textDim, marginRight: 6 }}>{opt.l}.</span>{opt.t}
              {isCorrect ? ' ✓' : isWrong ? ' ✗' : ''}
            </button>
          );
        })}
      </div>
      {checked && (
        <div style={{ background: C.surface, borderRadius: 6, padding: 12, borderLeft: `3px solid ${C.gold}`, marginTop: 8 }}>
          <p style={{ fontSize: 10, color: C.gold, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Explanation</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{q.explain}</p>
        </div>
      )}
    </Card>
  );
}

function RCPassage({ passage, answers, onAnswer, checked }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Tag color={C.greenBr}>RC</Tag>
        <Tag color={C.textDim}>{passage.topic}</Tag>
      </div>
      <div style={{
        background: C.surface, borderRadius: 8, padding: '16px 18px',
        borderLeft: `3px solid ${C.greenBr}`, marginBottom: 16,
      }}>
        <p style={{ color: C.text, fontSize: 13, lineHeight: 2, margin: 0, textAlign: 'justify' }}>
          {passage.passage}
        </p>
      </div>
      {passage.questions.map((q, qi) => {
        const sel = answers?.[qi] || null;
        const isCorrect = checked && sel === q.answer;
        const isWrong = checked && sel && sel !== q.answer;
        return (
          <div key={q.id} style={{ marginBottom: 14 }}>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.6, marginBottom: 8, fontWeight: 600 }}>
              {qi + 1}. {q.q}
            </p>
            <div style={{ display: 'grid', gap: 6 }}>
              {q.opts.map(opt => {
                const isSel = sel === opt.l;
                const correct = checked && opt.l === q.answer;
                const wrong = checked && isSel && opt.l !== q.answer;
                return (
                  <button key={opt.l} onClick={() => {
                    if (checked) return;
                    const n = [...(answers || passage.questions.map(() => null))];
                    n[qi] = opt.l;
                    onAnswer(n);
                  }} style={{
                    padding: '8px 14px', borderRadius: 6, textAlign: 'left', fontSize: 12,
                    cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
                    border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                    background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                    color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                    fontWeight: isSel || correct ? 700 : 400,
                  }}>
                    <span style={{ color: C.textDim, marginRight: 8 }}>{opt.l}.</span>{opt.t}
                    {correct ? ' ✓' : wrong ? ' ✗' : ''}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div style={{ background: C.surface, borderRadius: 6, padding: 10, borderLeft: `3px solid ${C.greenBr}`, marginTop: 6 }}>
                <p style={{ color: C.text, fontSize: 11, lineHeight: 1.6, margin: 0 }}>{q.explain}</p>
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
}

// ─── MAIN MOCK EXAM COMPONENT ──────────────────────────────────────────────────
export default function MockExam() {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Answers state
  const [tcAnswers, setTCAnswers] = useState({});
  const [seAnswers, setSEAnswers] = useState({});
  const [rcAnswers, setRCAnswers] = useState({});

  const EXAM_TIME = 30 * 60; // 30 minutes

  const generate = useCallback(async () => {
    setLoading(true); setError(null);
    setExam(null); setSubmitted(false);
    setTCAnswers({}); setSEAnswers({}); setRCAnswers({});
    try {
      const res = await fetch('/api/mock-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setExam(data);
      setTimerActive(true);
    } catch (e) {
      let msg = e.message;
      if (msg.includes('429')) msg = 'API rate limit. Wait 30 seconds and try again.';
      setError(msg);
    }
    setLoading(false);
  }, []);

  const submit = useCallback(() => {
    setSubmitted(true);
    setTimerActive(false);
  }, []);

  const handleTimeUp = useCallback(() => {
    submit();
  }, [submit]);

  // Calculate scores
  const calcScore = () => {
    if (!exam) return { tc: 0, tcMax: 0, se: 0, seMax: 0, rc: 0, rcMax: 0 };
    let tc = 0, tcMax = 0;
    exam.tc.forEach(q => {
      const ans = tcAnswers[q.id];
      q.blanks.forEach((b, i) => {
        tcMax++;
        if (ans?.[i] === b.answer) tc++;
      });
    });
    let se = 0, seMax = exam.se.length;
    exam.se.forEach(q => {
      const ans = seAnswers[q.id] || [];
      if (q.answers.every(a => ans.includes(a)) && ans.length === 2) se++;
    });
    let rc = 0, rcMax = 0;
    exam.rc.forEach(p => {
      const ans = rcAnswers[p.id] || [];
      p.questions.forEach((q, qi) => {
        rcMax++;
        if (ans[qi] === q.answer) rc++;
      });
    });
    const total = tc + se + rc;
    const max = tcMax + seMax + rcMax;
    // Rough GRE score conversion (130-170 scale)
    const pct = max > 0 ? total / max : 0;
    const scaledScore = Math.round(130 + pct * 40);
    return { tc, tcMax, se, seMax, rc, rcMax, total, max, pct, scaledScore };
  };

  // ─── LANDING (no exam yet) ─────────────────────────────────────────────────
  if (!exam && !loading) return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: 48, marginBottom: 8 }}>🎯</p>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: C.gold, marginBottom: 8 }}>
          GRE Verbal Mock Exam
        </h2>
        <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          A full GRE Verbal Reasoning section with 20 questions in 30 minutes.
          <br />Uses any GRE-level vocabulary — not limited to your study list.
        </p>

        <Card style={{ textAlign: 'left', marginBottom: 24 }}>
          <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700 }}>
            Exam Format
          </p>
          {[
            { section: 'Text Completion', count: '6 questions', desc: '2 easy + 2 medium + 1 double + 1 triple blank', color: C.blue },
            { section: 'Sentence Equivalence', count: '4 questions', desc: 'Select 2 synonymous answers from 6 options', color: C.gold },
            { section: 'Reading Comprehension', count: '2 passages, 5 questions', desc: 'Short academic passages with analytical questions', color: C.greenBr },
          ].map(s => (
            <div key={s.section} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ width: 4, height: 32, background: s.color, borderRadius: 2 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>{s.section}</p>
                <p style={{ color: C.textDim, fontSize: 11, margin: '2px 0 0' }}>{s.desc}</p>
              </div>
              <Tag color={s.color}>{s.count}</Tag>
            </div>
          ))}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, marginTop: 4,
          }}>
            <span style={{ fontSize: 16 }}>⏱</span>
            <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, margin: 0 }}>30 minutes · Auto-submits when time runs out</p>
          </div>
        </Card>

        {error && (
          <div style={{ background: C.redBg, border: `1px solid ${C.red}44`, borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
            <p style={{ color: C.red, fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        <Btn onClick={generate}>Start Mock Exam ⚡</Btn>
        <p style={{ color: C.textDim, fontSize: 11, marginTop: 12 }}>
          This will make one API call to generate your exam.
        </p>
      </div>
    </div>
  );

  // ─── LOADING ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>Generating your GRE Mock Exam...</p>
      <p style={{ color: C.textMid, fontSize: 13 }}>Creating 6 TC + 4 SE + 2 RC passages</p>
      <p style={{ color: C.textDim, fontSize: 12 }}>This may take 10-20 seconds</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const score = submitted ? calcScore() : null;

  // ─── RESULTS ───────────────────────────────────────────────────────────────
  if (submitted) return (
    <div>
      {/* Score Card */}
      <Card style={{ marginBottom: 24, padding: 24, textAlign: 'center', borderTop: `3px solid ${C.gold}` }}>
        <p style={{ fontSize: 14, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Your Estimated Score</p>
        <p style={{
          fontFamily: 'Courier New,monospace', fontSize: 56, fontWeight: 700, margin: '0 0 8px',
          color: score.scaledScore >= 165 ? C.greenBr : score.scaledScore >= 155 ? C.gold : C.red,
        }}>
          {score.scaledScore}
        </p>
        <p style={{ color: C.textMid, fontSize: 13, marginBottom: 16 }}>
          out of 170 · {score.total}/{score.max} correct ({Math.round(score.pct * 100)}%)
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Tag color={C.blue}>TC: {score.tc}/{score.tcMax}</Tag>
          <Tag color={C.gold}>SE: {score.se}/{score.seMax}</Tag>
          <Tag color={C.greenBr}>RC: {score.rc}/{score.rcMax}</Tag>
        </div>
        <div style={{ marginTop: 20 }}>
          <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.6 }}>
            {score.scaledScore >= 165 ? '🎯 Outstanding! You\'re in the 165+ zone. Keep polishing edge cases.'
              : score.scaledScore >= 160 ? '💪 Strong performance! Focus on your weak areas to push past 165.'
                : score.scaledScore >= 155 ? '📈 Good foundation. Daily practice will get you to 160+.'
                  : '📚 Keep building your vocabulary and practice daily. You\'ve got this!'}
          </p>
        </div>
      </Card>

      {/* Review all questions */}
      <SectionHead label="Review Answers" count="Scroll through all questions" color={C.textMid} />

      <p style={{ color: C.blue, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Text Completion ({score.tc}/{score.tcMax})</p>
      {exam.tc.map(q => <TCQuestion key={q.id} q={q} answer={tcAnswers[q.id]} onAnswer={() => { }} checked={true} />)}

      <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Sentence Equivalence ({score.se}/{score.seMax})</p>
      {exam.se.map(q => <SEQuestion key={q.id} q={q} answer={seAnswers[q.id]} onAnswer={() => { }} checked={true} />)}

      <p style={{ color: C.greenBr, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Reading Comprehension ({score.rc}/{score.rcMax})</p>
      {exam.rc.map(p => <RCPassage key={p.id} passage={p} answers={rcAnswers[p.id]} onAnswer={() => { }} checked={true} />)}

      <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 40 }}>
        <Btn onClick={generate}>Take Another Exam ↺</Btn>
      </div>
    </div>
  );

  // ─── EXAM IN PROGRESS ──────────────────────────────────────────────────────
  const totalAnswered = Object.keys(tcAnswers).length + Object.keys(seAnswers).length + Object.keys(rcAnswers).length;
  const totalQuestions = (exam.tc?.length || 0) + (exam.se?.length || 0) + (exam.rc?.length || 0);

  return (
    <div>
      {/* Sticky header with timer */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 15,
        background: C.bg, padding: '12px 0', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
      }}>
        <div style={{ flex: 1 }}>
          <ExamTimer totalSeconds={EXAM_TIME} onTimeUp={handleTimeUp} active={timerActive} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: C.textDim, fontSize: 12 }}>Progress:</span>
          <Tag color={C.gold}>{totalAnswered}/{totalQuestions}</Tag>
          <Btn small variant="danger" onClick={submit}>Submit Exam</Btn>
        </div>
      </div>

      {/* TC Section */}
      <SectionHead label="Text Completion" count={`${exam.tc.length} questions`} color={C.blue} />
      <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16 }}>Select the best word(s) for each blank.</p>
      {exam.tc.map(q => (
        <TCQuestion key={q.id} q={q} answer={tcAnswers[q.id]}
          onAnswer={a => setTCAnswers(p => ({ ...p, [q.id]: a }))} checked={false} />
      ))}

      {/* SE Section */}
      <div style={{ marginTop: 24 }}>
        <SectionHead label="Sentence Equivalence" count={`${exam.se.length} questions`} color={C.gold} />
        <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16 }}>Select exactly 2 answers that produce equivalent meaning.</p>
        {exam.se.map(q => (
          <SEQuestion key={q.id} q={q} answer={seAnswers[q.id]}
            onAnswer={a => setSEAnswers(p => ({ ...p, [q.id]: a }))} checked={false} />
        ))}
      </div>

      {/* RC Section */}
      <div style={{ marginTop: 24 }}>
        <SectionHead label="Reading Comprehension" count={`${exam.rc.length} passages`} color={C.greenBr} />
        <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16 }}>Read each passage carefully, then answer the questions.</p>
        {exam.rc.map(p => (
          <RCPassage key={p.id} passage={p} answers={rcAnswers[p.id]}
            onAnswer={a => setRCAnswers(prev => ({ ...prev, [p.id]: a }))} checked={false} />
        ))}
      </div>

      {/* Submit */}
      <div style={{ textAlign: 'center', padding: '32px 0 60px' }}>
        <Btn onClick={submit}>Submit Exam →</Btn>
        <p style={{ color: C.textDim, fontSize: 11, marginTop: 8 }}>
          You can submit anytime. Unanswered questions count as incorrect.
        </p>
      </div>
    </div>
  );
}
