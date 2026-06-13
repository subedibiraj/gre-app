import React, { useState, useEffect, useCallback, useRef } from 'react';
import C from '../theme';
import Card from '../components/Card';
import StemRenderer from '../components/StemRenderer';
import ChartRenderer from '../components/ChartRenderer';
import Tag from '../components/Tag';
import { addScoreEntry } from '../engine/history';

export default function CustomDrill({ exam, onExit }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const totalTimeRef = useRef(0);

  // Initialize timer based on number of questions (approx 1.5 mins per question)
  useEffect(() => {
    let totalQs = 0;
    if (exam.vic) totalQs += exam.vic.length;
    if (exam.tc) totalQs += exam.tc.length;
    if (exam.se) totalQs += exam.se.length;
    if (exam.rc) totalQs += exam.rc.reduce((acc, p) => acc + p.questions.length, 0);
    if (exam.quant) totalQs += exam.quant.length;
    const time = totalQs * 90;
    setTimeLeft(time);
    totalTimeRef.current = time;
  }, [exam]);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  // Auto-submit
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleAnswer = (qId, ans) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const handleSubmit = () => {
    import('../engine/error-log').then(({ logMistake }) => {
      // Log verbal mistakes
      if (exam.vic) exam.vic.forEach(q => { if (answers[q.id] !== q.answer) logMistake(q, answers[q.id], 'verbal'); });
      if (exam.tc) exam.tc.forEach(q => {
        const ans = answers[q.id] || [];
        if (!q.blanks.every((b, i) => ans[i] === b.answer)) logMistake(q, ans, 'verbal');
      });
      if (exam.se) exam.se.forEach(q => {
        const ans = answers[q.id] || [];
        if (!(ans.length === 2 && q.answers.every(a => ans.includes(a)))) logMistake(q, ans, 'verbal');
      });
      if (exam.rc) exam.rc.forEach(p => {
        p.questions.forEach(q => {
          if (answers[q.id] !== q.answer) logMistake({ ...q, passageText: p.passage || p.text }, answers[q.id], 'verbal');
        });
      });
      // Log quant mistakes
      if (exam.quant) exam.quant.forEach(q => {
        if (answers[q.id] !== q.answer) logMistake(q, answers[q.id], 'quant');
      });
    }).catch(e => console.error('Error logging mistakes:', e));
    
    // Calculate Score for Custom Session
    let vCorr = 0, vTotal = 0;
    if (exam.vic) { vTotal += exam.vic.length; vCorr += exam.vic.filter(q => answers[q.id] === q.answer).length; }
    if (exam.tc) { vTotal += exam.tc.length; vCorr += exam.tc.filter(q => q.blanks.every((b, i) => (answers[q.id]||[])[i] === b.answer)).length; }
    if (exam.se) { vTotal += exam.se.length; vCorr += exam.se.filter(q => { const a = answers[q.id]||[]; return a.length === 2 && q.answers.every(x => a.includes(x)); }).length; }
    if (exam.rc) { 
      exam.rc.forEach(p => { vTotal += p.questions.length; vCorr += p.questions.filter(q => answers[q.id] === q.answer).length; }); 
    }

    let qCorr = 0, qTotal = 0;
    const topicCount = {};
    if (exam.quant) {
      exam.quant.forEach(q => {
        qTotal++;
        const isCorrect = answers[q.id] === q.answer;
        if (isCorrect) qCorr++;
        const t = (q.topic || 'arithmetic').toLowerCase();
        if (!topicCount[t]) topicCount[t] = { correct: 0, total: 0 };
        topicCount[t].total++;
        if (isCorrect) topicCount[t].correct++;
      });
    }

    // Custom drills aren't real mocks, so we record them as practice sessions to keep stats accurate
    if (vTotal > 0) {
      addScoreEntry({ type: 'verbal-practice', correct: vCorr, total: vTotal, timeTaken: totalTimeRef.current - timeLeft });
    }
    if (qTotal > 0) {
      addScoreEntry({ type: 'quant-practice', correct: qCorr, total: qTotal, timeTaken: totalTimeRef.current - timeLeft, topics: topicCount });
    }

    setSubmitted(true);
  };

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, position: 'sticky', top: 52, background: C.bg, zIndex: 10, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onExit} style={{ background: 'none', border: 'none', color: C.textMid, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          ← Exit Drill
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {!submitted && (
            <div style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 700, color: timeLeft < 120 ? C.red : C.gold }}>
              {m}:{s.toString().padStart(2, '0')}
            </div>
          )}
          <button onClick={submitted ? onExit : handleSubmit} style={{
            padding: '8px 24px', borderRadius: 20, border: 'none',
            background: submitted ? C.surface : C.gold, color: submitted ? C.text : '#000',
            fontWeight: 700, cursor: 'pointer'
          }}>
            {submitted ? 'Finish Review' : 'Submit Exam'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* VIC */}
        {exam.vic && exam.vic.map(q => (
          <GenericMC key={q.id} q={q} answer={answers[q.id]} onAnswer={ans => handleAnswer(q.id, ans)} checked={submitted} tag="VIC" color={C.blue} />
        ))}
        {/* TC */}
        {exam.tc && exam.tc.map(q => (
          <TCQuestion key={q.id} q={q} answer={answers[q.id]} onAnswer={ans => handleAnswer(q.id, ans)} checked={submitted} />
        ))}
        {/* SE */}
        {exam.se && exam.se.map(q => (
          <SEQuestion key={q.id} q={q} answer={answers[q.id]} onAnswer={ans => handleAnswer(q.id, ans)} checked={submitted} />
        ))}
        {/* RC */}
        {exam.rc && exam.rc.map(p => (
          <RCPassage key={p.id} passage={p} answers={answers} onAnswer={handleAnswer} checked={submitted} />
        ))}
        {/* Quant */}
        {exam.quant && exam.quant.map(q => (
          q.type === 'qc' 
            ? <QCQuestion key={q.id} q={q} answer={answers[q.id]} onAnswer={ans => handleAnswer(q.id, ans)} checked={submitted} />
            : <GenericMC key={q.id} q={q} answer={answers[q.id]} onAnswer={ans => handleAnswer(q.id, ans)} checked={submitted} tag="MC" color={C.greenBr} />
        ))}
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function GenericMC({ q, answer, onAnswer, checked, tag, color }) {
  const isCorrect = checked && answer === q.answer;
  const isWrong = checked && answer && answer !== q.answer;
  
  return (
    <Card>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Tag color={color}>{tag}</Tag>
        {checked && <Tag color={isCorrect ? C.green : isWrong ? C.red : C.textDim}>{isCorrect ? '✓ Correct' : isWrong ? '✗ Incorrect' : '— Skipped'}</Tag>}
      </div>
      <p style={{ color: C.text, fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{q.sentence || q.q || q.question}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.opts.map(opt => {
          const l = opt.l || opt[0];
          const t = opt.t || opt.substring(3) || opt;
          const isSel = answer === l;
          const correct = checked && l === q.answer;
          const wrong = checked && isSel && l !== q.answer;
          
          return (
            <button key={l} onClick={() => onAnswer(l)} style={{
              textAlign: 'left', padding: '10px 14px', borderRadius: 8,
              border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? color : C.border}`,
              background: correct ? C.greenBg : wrong ? C.redBg : isSel ? `${color}22` : C.surface,
              color: correct ? C.greenBr : wrong ? C.red : C.text, cursor: checked ? 'default' : 'pointer'
            }}>
              <span style={{ color: C.textDim, marginRight: 8 }}>{l}.</span>{t}
            </button>
          )
        })}
      </div>
      {checked && q.explain && (
        <div style={{ marginTop: 16, padding: 16, background: `${C.gold}11`, borderLeft: `3px solid ${C.gold}`, borderRadius: 4 }}>
          <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase' }}>Explanation</p>
          <p style={{ color: C.textMid, fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>{q.explain}</p>
        </div>
      )}
    </Card>
  )
}

function QCQuestion({ q, answer, onAnswer, checked }) {
  const isCorrect = checked && answer === q.answer;
  const isWrong = checked && answer && answer !== q.answer;

  return (
    <Card>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Tag color={C.greenBr}>QC</Tag>
        <Tag color={C.textDim}>{q.topic}</Tag>
        {checked && <Tag color={isCorrect ? C.green : isWrong ? C.red : C.textDim}>{isCorrect ? '✓ Correct' : isWrong ? '✗ Incorrect' : '— Skipped'}</Tag>}
      </div>

      {q.condition && <p style={{ textAlign: 'center', color: C.text, fontSize: 14, marginBottom: 16 }}>{q.condition}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 10px', textAlign: 'center' }}>
          <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', margin: '0 0 8px' }}>Quantity A</p>
          <p style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: 0 }}>{q.qtyA}</p>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 10px', textAlign: 'center' }}>
          <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', margin: '0 0 8px' }}>Quantity B</p>
          <p style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: 0 }}>{q.qtyB}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { l: 'A', t: 'Quantity A is greater' },
          { l: 'B', t: 'Quantity B is greater' },
          { l: 'C', t: 'The two quantities are equal' },
          { l: 'D', t: 'The relationship cannot be determined' }
        ].map(opt => {
          const isSel = answer === opt.l;
          const correct = checked && opt.l === q.answer;
          const wrong = checked && isSel && opt.l !== q.answer;
          
          return (
            <button key={opt.l} onClick={() => onAnswer(opt.l)} style={{
              textAlign: 'center', padding: '10px', borderRadius: 8,
              border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.greenBr : C.border}`,
              background: correct ? C.greenBg : wrong ? C.redBg : isSel ? `${C.greenBr}22` : C.surface,
              color: correct ? C.greenBr : wrong ? C.red : C.text, cursor: checked ? 'default' : 'pointer'
            }}>
              {opt.t}
            </button>
          )
        })}
      </div>
      {checked && q.explain && (
        <div style={{ marginTop: 16, padding: 16, background: `${C.gold}11`, borderLeft: `3px solid ${C.gold}`, borderRadius: 4 }}>
          <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase' }}>Explanation</p>
          <p style={{ color: C.textMid, fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>{q.explain}</p>
        </div>
      )}
    </Card>
  )
}

function TCQuestion({ q, answer, onAnswer, checked }) {
  const sel = answer || q.blanks.map(() => null);
  const select = (bIdx, l) => { if (checked) return; const n = [...sel]; n[bIdx] = l; onAnswer(n); };
  const blankScore = checked ? q.blanks.filter((b, i) => sel[i] === b.answer).length : null;
  const allCorrect = checked && blankScore === q.blanks.length;
  const skipped = checked && sel.every(s => s === null);

  return (
    <Card>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Tag color={C.blue}>TC</Tag>
        {checked && <Tag color={skipped ? C.textDim : allCorrect ? C.green : C.red}>{skipped ? '— Skipped' : `${blankScore}/${q.blanks.length}`}</Tag>}
      </div>
      <StemRenderer stem={q.stem} blanks={q.blanks} selections={sel} isChecked={checked} />
      {q.blanks.map((blank, bIdx) => (
        <div key={bIdx} style={{ marginBottom: 10, marginTop: 10 }}>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 6, fontWeight: 700 }}>{blank.label}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {blank.opts.map(opt => {
              const isSel = sel[bIdx] === opt.l;
              const correct = checked && opt.l === blank.answer;
              const wrong = checked && isSel && opt.l !== blank.answer;
              return (
                <button key={opt.l} onClick={() => select(bIdx, opt.l)} style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: isSel || correct ? 700 : 400,
                  border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.blue : C.border}`,
                  background: correct ? C.greenBg : wrong ? C.redBg : isSel ? `${C.blue}22` : C.surface,
                  color: correct ? C.greenBr : wrong ? C.red : C.text, cursor: checked ? 'default' : 'pointer'
                }}>
                  <span style={{ color: C.textDim, marginRight: 4 }}>{opt.l}.</span>{opt.t}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {checked && q.explain && (
        <div style={{ marginTop: 16, padding: 16, background: `${C.gold}11`, borderLeft: `3px solid ${C.gold}`, borderRadius: 4 }}>
          <p style={{ color: C.textMid, fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>{q.explain}</p>
        </div>
      )}
    </Card>
  )
}

function SEQuestion({ q, answer, onAnswer, checked }) {
  const sel = answer || [];
  const toggle = l => {
    if (checked) return;
    const n = sel.includes(l) ? sel.filter(x => x !== l) : sel.length < 2 ? [...sel, l] : sel;
    onAnswer(n);
  };
  const isFullyCorrect = checked && sel.length === 2 && q.answers.every(a => sel.includes(a));
  
  return (
    <Card>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Tag color={C.gold}>SE</Tag>
        <Tag color={C.textDim}>Select 2</Tag>
        {checked && <Tag color={isFullyCorrect ? C.green : C.red}>{isFullyCorrect ? '✓ Correct' : '✗ Incorrect'}</Tag>}
      </div>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>{q.stem}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6 }}>
        {q.opts.map(opt => {
          const isSel = sel.includes(opt.l);
          const correct = checked && q.answers.includes(opt.l);
          const wrong = checked && isSel && !q.answers.includes(opt.l);
          return (
            <button key={opt.l} onClick={() => toggle(opt.l)} style={{
              padding: '8px 12px', borderRadius: 6, textAlign: 'left', fontSize: 12, fontWeight: isSel || correct ? 700 : 400,
              border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
              background: correct ? C.greenBg : wrong ? C.redBg : isSel ? `${C.gold}22` : C.surface,
              color: correct ? C.greenBr : wrong ? C.red : C.text, cursor: checked ? 'default' : 'pointer'
            }}>
              <span style={{ color: C.textDim, marginRight: 6 }}>{opt.l}.</span>{opt.t}
            </button>
          );
        })}
      </div>
      {checked && q.explain && (
        <div style={{ marginTop: 16, padding: 16, background: `${C.gold}11`, borderLeft: `3px solid ${C.gold}`, borderRadius: 4 }}>
          <p style={{ color: C.textMid, fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>{q.explain}</p>
        </div>
      )}
    </Card>
  )
}

function RCPassage({ passage, answers, onAnswer, checked }) {
  return (
    <Card>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Tag color={C.greenBr}>RC</Tag>
        <Tag color={C.textDim}>{passage.topic}</Tag>
      </div>
      <div style={{ background: C.surface, borderRadius: 8, padding: '16px 18px', borderLeft: `3px solid ${C.greenBr}`, marginBottom: 16 }}>
        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, fontFamily: 'Georgia,serif', margin: 0, whiteSpace: 'pre-wrap' }}>
          {passage.passage || passage.text}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {passage.questions.map((q, i) => (
          <GenericMC key={q.id} q={q} answer={answers[q.id]} onAnswer={ans => onAnswer(q.id, ans)} checked={checked} tag={`Q${i+1}`} color={C.blue} />
        ))}
      </div>
    </Card>
  )
}
