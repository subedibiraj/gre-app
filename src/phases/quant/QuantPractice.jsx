import { useState, useCallback } from 'react';
import C from '../../theme';
import { QUANT_TOPICS } from '../../data/quant-topics';
import Card from '../../components/Card';
import SectionHead from '../../components/SectionHead';
import Btn from '../../components/Btn';
import Tag from '../../components/Tag';

// ─── QC Question ──────────────────────────────────────────────────────────────
function QCQuestion({ q, answer, onAnswer, checked }) {
  const options = [
    { l: 'A', t: 'Quantity A is greater' },
    { l: 'B', t: 'Quantity B is greater' },
    { l: 'C', t: 'The two quantities are equal' },
    { l: 'D', t: 'The relationship cannot be determined' },
  ];

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Tag color={C.blue}>QC</Tag>
        {checked && <Tag color={answer === q.answer ? C.green : C.red}>{answer === q.answer ? '✓' : '✗'}</Tag>}
      </div>

      {q.info && (
        <div style={{ background: C.surface, borderRadius: 6, padding: '8px 12px', marginBottom: 10, borderLeft: `3px solid ${C.textDim}` }}>
          <p style={{ color: C.textMid, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{q.info}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, marginBottom: 14, alignItems: 'center' }}>
        <div style={{
          background: C.surface, borderRadius: 8, padding: '14px 16px', textAlign: 'center',
          border: `1px solid ${checked && q.answer === 'A' ? C.green : C.border}`,
        }}>
          <p style={{ color: C.textDim, fontSize: 10, marginBottom: 4, textTransform: 'uppercase' }}>Quantity A</p>
          <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'Courier New,monospace' }}>{q.qtyA}</p>
        </div>
        <span style={{ color: C.textDim, fontSize: 18, fontWeight: 700 }}>vs</span>
        <div style={{
          background: C.surface, borderRadius: 8, padding: '14px 16px', textAlign: 'center',
          border: `1px solid ${checked && q.answer === 'B' ? C.green : C.border}`,
        }}>
          <p style={{ color: C.textDim, fontSize: 10, marginBottom: 4, textTransform: 'uppercase' }}>Quantity B</p>
          <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'Courier New,monospace' }}>{q.qtyB}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {options.map(opt => {
          const isSel = answer === opt.l;
          const correct = checked && opt.l === q.answer;
          const wrong = checked && isSel && opt.l !== q.answer;
          return (
            <button key={opt.l} onClick={() => !checked && onAnswer(opt.l)} style={{
              padding: '8px 12px', borderRadius: 6, textAlign: 'left', fontSize: 12,
              cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
              border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
              background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
              color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
              fontWeight: isSel || correct ? 700 : 400,
            }}>
              <span style={{ color: C.textDim, marginRight: 6 }}>{opt.l}.</span>{opt.t}
              {correct ? ' ✓' : wrong ? ' ✗' : ''}
            </button>
          );
        })}
      </div>

      {checked && q.explain && (
        <div style={{ background: C.surface, borderRadius: 6, padding: 12, borderLeft: `3px solid ${C.blue}`, marginTop: 10 }}>
          <p style={{ fontSize: 10, color: C.blue, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Solution</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </Card>
  );
}

// ─── MC Question ──────────────────────────────────────────────────────────────
function MCQuestion({ q, answer, onAnswer, checked }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Tag color={C.gold}>MC</Tag>
        {checked && <Tag color={answer === q.answer ? C.green : C.red}>{answer === q.answer ? '✓' : '✗'}</Tag>}
      </div>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>{q.q}</p>
      <div style={{ display: 'grid', gap: 6 }}>
        {q.opts.map(opt => {
          const isSel = answer === opt.l;
          const correct = checked && opt.l === q.answer;
          const wrong = checked && isSel && opt.l !== q.answer;
          return (
            <button key={opt.l} onClick={() => !checked && onAnswer(opt.l)} style={{
              padding: '9px 14px', borderRadius: 6, textAlign: 'left', fontSize: 13,
              cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
              border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
              background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
              color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
              fontWeight: isSel || correct ? 700 : 400,
            }}>
              <span style={{ color: C.textDim, marginRight: 8, fontFamily: 'Courier New,monospace' }}>{opt.l}.</span>
              {opt.t}{correct ? ' ✓' : wrong ? ' ✗' : ''}
            </button>
          );
        })}
      </div>
      {checked && q.explain && (
        <div style={{ background: C.surface, borderRadius: 6, padding: 12, borderLeft: `3px solid ${C.gold}`, marginTop: 10 }}>
          <p style={{ fontSize: 10, color: C.gold, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Solution</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </Card>
  );
}

// ─── Numeric Entry ────────────────────────────────────────────────────────────
function NEQuestion({ q, answer, onAnswer, checked }) {
  const isCorrect = checked && String(answer).trim() === String(q.answer).trim();

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Tag color={C.greenBr}>NE</Tag>
        {checked && <Tag color={isCorrect ? C.green : C.red}>{isCorrect ? '✓' : '✗'}</Tag>}
      </div>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>{q.q}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="text"
          value={answer || ''}
          onChange={e => !checked && onAnswer(e.target.value)}
          placeholder="Type your answer"
          disabled={checked}
          style={{
            padding: '10px 16px', borderRadius: 6, fontSize: 16, fontWeight: 700,
            fontFamily: 'Courier New,monospace', width: 160,
            border: `2px solid ${checked ? (isCorrect ? C.green : C.red) : C.border}`,
            background: checked ? (isCorrect ? C.greenBg : C.redBg) : C.surface,
            color: checked ? (isCorrect ? C.greenBr : C.red) : C.text,
            outline: 'none',
          }}
        />
        {checked && !isCorrect && (
          <span style={{ color: C.greenBr, fontSize: 14, fontWeight: 700, fontFamily: 'Courier New,monospace' }}>
            Correct: {q.answer}
          </span>
        )}
      </div>
      {checked && q.explain && (
        <div style={{ background: C.surface, borderRadius: 6, padding: 12, borderLeft: `3px solid ${C.greenBr}`, marginTop: 10 }}>
          <p style={{ fontSize: 10, color: C.greenBr, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Solution</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </Card>
  );
}

// ─── MAIN QUANT PRACTICE ──────────────────────────────────────────────────────
export default function QuantPractice({ topic, onScoreUpdate }) {
  const topicData = QUANT_TOPICS.find(t => t.id === topic);
  const [qs, setQs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [qcAnswers, setQCAnswers] = useState({});
  const [mcAnswers, setMCAnswers] = useState({});
  const [neAnswers, setNEAnswers] = useState({});

  const generate = useCallback(async () => {
    setLoading(true); setError(null); setQs(null); setChecked(false);
    setQCAnswers({}); setMCAnswers({}); setNEAnswers({});
    try {
      const res = await fetch('/api/quant-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topicData.id,
          topicLabel: topicData.label,
          subtopics: topicData.subtopics,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error: ${res.status}`);
      }
      setQs(await res.json());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [topicData]);

  const submit = () => {
    setChecked(true);
    let correct = 0, total = 0;
    qs.qc.forEach(q => { total++; if (qcAnswers[q.id] === q.answer) correct++; });
    qs.mc.forEach(q => { total++; if (mcAnswers[q.id] === q.answer) correct++; });
    qs.ne.forEach(q => { total++; if (String(neAnswers[q.id]).trim() === String(q.answer).trim()) correct++; });
    onScoreUpdate?.(topicData.id, correct, total);
  };

  if (!qs && !loading) return (
    <div style={{ padding: 30, textAlign: 'center' }}>
      <p style={{ fontSize: 40, marginBottom: 8 }}>{topicData.icon}</p>
      <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: C.gold, marginBottom: 8 }}>{topicData.label}</h3>
      <p style={{ color: C.textMid, fontSize: 13, marginBottom: 16 }}>
        5 QC + 3 MC + 2 Numeric Entry = 10 questions
      </p>

      <Card style={{ textAlign: 'left', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
        <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Subtopics covered</p>
        {topicData.subtopics.map(s => (
          <p key={s} style={{ color: C.textMid, fontSize: 12, margin: '4px 0', lineHeight: 1.5 }}>• {s}</p>
        ))}
      </Card>

      <Card style={{ textAlign: 'left', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px', borderLeft: `3px solid ${C.red}` }}>
        <p style={{ color: C.red, fontSize: 10, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>⚠️ Common Traps</p>
        {topicData.traps.map(t => (
          <p key={t} style={{ color: C.textMid, fontSize: 12, margin: '4px 0', lineHeight: 1.5 }}>• {t}</p>
        ))}
      </Card>

      {error && <p style={{ color: C.red, marginBottom: 12 }}>{error}</p>}
      <Btn onClick={generate}>Generate Practice ⚡</Btn>
    </div>
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 20px', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: C.gold, fontSize: 15, fontWeight: 700 }}>Generating {topicData.label} questions...</p>
      <p style={{ color: C.textDim, fontSize: 12 }}>5 QC + 3 MC + 2 Numeric Entry</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionHead label={topicData.label} count="AI-generated practice" color={C.gold} />
        {!checked && <Btn small variant="ghost" onClick={() => { setQs(null); }}>↺ New Set</Btn>}
      </div>

      {/* QC Section */}
      <p style={{ color: C.blue, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Quantitative Comparison ({qs.qc.length})</p>
      {qs.qc.map(q => (
        <QCQuestion key={q.id} q={q} answer={qcAnswers[q.id]} onAnswer={a => setQCAnswers(p => ({ ...p, [q.id]: a }))} checked={checked} />
      ))}

      {/* MC Section */}
      <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Multiple Choice ({qs.mc.length})</p>
      {qs.mc.map(q => (
        <MCQuestion key={q.id} q={q} answer={mcAnswers[q.id]} onAnswer={a => setMCAnswers(p => ({ ...p, [q.id]: a }))} checked={checked} />
      ))}

      {/* NE Section */}
      <p style={{ color: C.greenBr, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Numeric Entry ({qs.ne.length})</p>
      {qs.ne.map(q => (
        <NEQuestion key={q.id} q={q} answer={neAnswers[q.id]} onAnswer={a => setNEAnswers(p => ({ ...p, [q.id]: a }))} checked={checked} />
      ))}

      {/* Submit */}
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        {!checked ? (
          <Btn onClick={submit}>Check All Answers →</Btn>
        ) : (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Btn variant="ghost" onClick={generate}>↺ New Practice</Btn>
            <Btn variant="success">
              ✓ {
                qs.qc.filter(q => qcAnswers[q.id] === q.answer).length +
                qs.mc.filter(q => mcAnswers[q.id] === q.answer).length +
                qs.ne.filter(q => String(neAnswers[q.id]).trim() === String(q.answer).trim()).length
              }/{qs.qc.length + qs.mc.length + qs.ne.length} correct
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
