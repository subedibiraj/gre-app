import { useState, useCallback } from 'react';
import C from '../../theme';
import Card from '../../components/Card';
import SectionHead from '../../components/SectionHead';
import Btn from '../../components/Btn';
import Tag from '../../components/Tag';

function ExamTimer({ totalSeconds, onTimeUp, active }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const ref = { current: null };

  useState(() => {
    if (!active) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(id); onTimeUp?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    ref.current = id;
    return () => clearInterval(id);
  });

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / totalSeconds) * 100;
  const urgent = pct < 14;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: urgent ? C.redBg : C.surface, border: `1px solid ${urgent ? C.red + '44' : C.border}`, borderRadius: 8, padding: '8px 16px' }}>
      <span style={{ fontSize: 13, color: C.textDim }}>⏱</span>
      <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden', minWidth: 80 }}>
        <div style={{ height: '100%', borderRadius: 2, width: `${pct}%`, background: urgent ? C.red : pct < 33 ? C.gold : C.green, transition: 'width 1s linear' }} />
      </div>
      <span style={{ fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700, color: urgent ? C.red : C.greenBr, minWidth: 50 }}>
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

export default function QuantMock() {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [qcA, setQCA] = useState({});
  const [mcA, setMCA] = useState({});
  const [mcmA, setMCMA] = useState({});
  const [neA, setNEA] = useState({});

  const EXAM_TIME = 35 * 60;

  const generate = useCallback(async () => {
    setLoading(true); setError(null); setExam(null); setSubmitted(false);
    setQCA({}); setMCA({}); setMCMA({}); setNEA({});
    try {
      const res = await fetch('/api/quant-mock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Error: ${res.status}`); }
      setExam(await res.json());
      setTimerActive(true);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  const submit = useCallback(() => { setSubmitted(true); setTimerActive(false); }, []);

  const calcScore = () => {
    if (!exam) return {};
    let qc = 0, mc = 0, mcm = 0, ne = 0;
    exam.qc?.forEach(q => { if (qcA[q.id] === q.answer) qc++; });
    exam.mc?.forEach(q => { if (mcA[q.id] === q.answer) mc++; });
    exam.mcm?.forEach(q => {
      const ans = mcmA[q.id] || [];
      if (q.answers.length === ans.length && q.answers.every(a => ans.includes(a))) mcm++;
    });
    exam.ne?.forEach(q => { if (String(neA[q.id]).trim() === String(q.answer).trim()) ne++; });
    const total = qc + mc + mcm + ne;
    const max = (exam.qc?.length || 0) + (exam.mc?.length || 0) + (exam.mcm?.length || 0) + (exam.ne?.length || 0);
    const pct = max > 0 ? total / max : 0;
    const scaledScore = Math.round(130 + pct * 40);
    return { qc, mc, mcm, ne, total, max, pct, scaledScore, qcMax: exam.qc?.length || 0, mcMax: exam.mc?.length || 0, mcmMax: exam.mcm?.length || 0, neMax: exam.ne?.length || 0 };
  };

  // LANDING
  if (!exam && !loading) return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      <p style={{ fontSize: 48, marginBottom: 8 }}>🧮</p>
      <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: C.gold, marginBottom: 8 }}>GRE Quant Mock Exam</h2>
      <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
        Full GRE Quantitative Reasoning section — 20 questions in 35 minutes.
      </p>
      <Card style={{ textAlign: 'left', marginBottom: 24 }}>
        <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700 }}>Exam Format</p>
        {[
          { s: 'Quantitative Comparison', c: '8 questions', color: C.blue },
          { s: 'Multiple Choice (Single)', c: '7 questions', color: C.gold },
          { s: 'Multiple Choice (Multi)', c: '2 questions', color: '#9B6BDB' },
          { s: 'Numeric Entry', c: '3 questions', color: C.greenBr },
        ].map(s => (
          <div key={s.s} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 4, height: 28, background: s.color, borderRadius: 2 }} />
            <span style={{ color: C.text, fontSize: 13, flex: 1 }}>{s.s}</span>
            <Tag color={s.color}>{s.c}</Tag>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
          <span style={{ fontSize: 16 }}>⏱</span>
          <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, margin: 0 }}>35 minutes · Auto-submits when time runs out</p>
        </div>
      </Card>
      {error && <p style={{ color: C.red, marginBottom: 12 }}>{error}</p>}
      <Btn onClick={generate}>Start Quant Mock ⚡</Btn>
    </div>
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>Generating Quant Mock Exam...</p>
      <p style={{ color: C.textDim, fontSize: 12 }}>8 QC + 7 MC + 2 MCM + 3 NE = 20 questions</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const score = submitted ? calcScore() : null;

  // RESULTS
  if (submitted) return (
    <div>
      <Card style={{ marginBottom: 24, padding: 24, textAlign: 'center', borderTop: `3px solid ${C.gold}` }}>
        <p style={{ fontSize: 14, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Estimated Quant Score</p>
        <p style={{ fontFamily: 'Courier New,monospace', fontSize: 56, fontWeight: 700, margin: '0 0 8px', color: score.scaledScore >= 165 ? C.greenBr : score.scaledScore >= 155 ? C.gold : C.red }}>
          {score.scaledScore}
        </p>
        <p style={{ color: C.textMid, fontSize: 13, marginBottom: 16 }}>{score.total}/{score.max} correct ({Math.round(score.pct * 100)}%)</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Tag color={C.blue}>QC: {score.qc}/{score.qcMax}</Tag>
          <Tag color={C.gold}>MC: {score.mc}/{score.mcMax}</Tag>
          {score.mcmMax > 0 && <Tag color={'#9B6BDB'}>MCM: {score.mcm}/{score.mcmMax}</Tag>}
          <Tag color={C.greenBr}>NE: {score.ne}/{score.neMax}</Tag>
        </div>
      </Card>

      <SectionHead label="Review Answers" count="All questions with solutions" color={C.textMid} />

      {/* QC Review */}
      <p style={{ color: C.blue, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Quantitative Comparison</p>
      {exam.qc?.map(q => {
        const ans = qcA[q.id];
        const correct = ans === q.answer;
        return (
          <Card key={q.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><Tag color={C.blue}>QC</Tag><Tag color={correct ? C.green : C.red}>{correct ? '✓' : '✗'}</Tag>{q.topic && <Tag color={C.textDim}>{q.topic}</Tag>}</div>
            {q.info && <p style={{ color: C.textMid, fontSize: 12, marginBottom: 6 }}>{q.info}</p>}
            <p style={{ color: C.text, fontSize: 13 }}><strong>A:</strong> {q.qtyA} &nbsp;vs&nbsp; <strong>B:</strong> {q.qtyB}</p>
            <p style={{ color: C.textMid, fontSize: 12 }}>Your answer: <strong style={{ color: correct ? C.greenBr : C.red }}>{ans || 'none'}</strong> — Correct: <strong style={{ color: C.greenBr }}>{q.answer}</strong></p>
            {q.explain && <div style={{ background: C.surface, borderRadius: 6, padding: 10, borderLeft: `3px solid ${C.blue}`, marginTop: 8 }}><p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p></div>}
          </Card>
        );
      })}

      {/* MC Review */}
      <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Multiple Choice</p>
      {exam.mc?.map(q => {
        const correct = mcA[q.id] === q.answer;
        return (
          <Card key={q.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><Tag color={C.gold}>MC</Tag><Tag color={correct ? C.green : C.red}>{correct ? '✓' : '✗'}</Tag></div>
            <p style={{ color: C.text, fontSize: 13, marginBottom: 8 }}>{q.q}</p>
            <p style={{ color: C.textMid, fontSize: 12 }}>Your: <strong style={{ color: correct ? C.greenBr : C.red }}>{mcA[q.id] || '-'}</strong> Correct: <strong style={{ color: C.greenBr }}>{q.answer}</strong></p>
            {q.explain && <div style={{ background: C.surface, borderRadius: 6, padding: 10, borderLeft: `3px solid ${C.gold}`, marginTop: 8 }}><p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p></div>}
          </Card>
        );
      })}

      {/* NE Review */}
      <p style={{ color: C.greenBr, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Numeric Entry</p>
      {exam.ne?.map(q => {
        const correct = String(neA[q.id]).trim() === String(q.answer).trim();
        return (
          <Card key={q.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><Tag color={C.greenBr}>NE</Tag><Tag color={correct ? C.green : C.red}>{correct ? '✓' : '✗'}</Tag></div>
            <p style={{ color: C.text, fontSize: 13, marginBottom: 8 }}>{q.q}</p>
            <p style={{ color: C.textMid, fontSize: 12 }}>Your: <strong style={{ color: correct ? C.greenBr : C.red }}>{neA[q.id] || '-'}</strong> Correct: <strong style={{ color: C.greenBr }}>{q.answer}</strong></p>
            {q.explain && <div style={{ background: C.surface, borderRadius: 6, padding: 10, borderLeft: `3px solid ${C.greenBr}`, marginTop: 8 }}><p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p></div>}
          </Card>
        );
      })}

      <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 40 }}>
        <Btn onClick={generate}>Take Another Exam ↺</Btn>
      </div>
    </div>
  );

  // EXAM IN PROGRESS
  return (
    <div>
      <div style={{ position: 'sticky', top: 56, zIndex: 15, background: C.bg, padding: '12px 0', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1 }}><ExamTimer totalSeconds={EXAM_TIME} onTimeUp={submit} active={timerActive} /></div>
        <Btn small variant="danger" onClick={submit}>Submit Exam</Btn>
      </div>

      {/* QC */}
      <SectionHead label="Quantitative Comparison" count={`${exam.qc?.length || 0} questions`} color={C.blue} />
      {exam.qc?.map(q => {
        const options = [
          { l: 'A', t: 'Quantity A is greater' }, { l: 'B', t: 'Quantity B is greater' },
          { l: 'C', t: 'Equal' }, { l: 'D', t: 'Cannot be determined' },
        ];
        return (
          <Card key={q.id} style={{ marginBottom: 10 }}>
            {q.info && <p style={{ color: C.textMid, fontSize: 12, marginBottom: 8, background: C.surface, padding: '6px 10px', borderRadius: 4 }}>{q.info}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, marginBottom: 10, alignItems: 'center' }}>
              <div style={{ background: C.surface, borderRadius: 6, padding: '10px 14px', textAlign: 'center' }}>
                <p style={{ color: C.textDim, fontSize: 9, marginBottom: 2 }}>QTY A</p>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'Courier New,monospace' }}>{q.qtyA}</p>
              </div>
              <span style={{ color: C.textDim, fontWeight: 700 }}>vs</span>
              <div style={{ background: C.surface, borderRadius: 6, padding: '10px 14px', textAlign: 'center' }}>
                <p style={{ color: C.textDim, fontSize: 9, marginBottom: 2 }}>QTY B</p>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'Courier New,monospace' }}>{q.qtyB}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {options.map(o => (
                <button key={o.l} onClick={() => setQCA(p => ({ ...p, [q.id]: o.l }))} style={{
                  padding: '6px 10px', borderRadius: 4, fontSize: 11, textAlign: 'left', cursor: 'pointer',
                  border: `1px solid ${qcA[q.id] === o.l ? C.gold : C.border}`,
                  background: qcA[q.id] === o.l ? C.goldDim + '44' : C.surface,
                  color: qcA[q.id] === o.l ? C.gold : C.textMid, fontWeight: qcA[q.id] === o.l ? 700 : 400,
                }}>{o.l}. {o.t}</button>
              ))}
            </div>
          </Card>
        );
      })}

      {/* MC */}
      <div style={{ marginTop: 20 }}>
        <SectionHead label="Multiple Choice" count={`${(exam.mc?.length || 0) + (exam.mcm?.length || 0)} questions`} color={C.gold} />
        {exam.mc?.map(q => (
          <Card key={q.id} style={{ marginBottom: 10 }}>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>{q.q}</p>
            <div style={{ display: 'grid', gap: 4 }}>
              {q.opts.map(o => (
                <button key={o.l} onClick={() => setMCA(p => ({ ...p, [q.id]: o.l }))} style={{
                  padding: '8px 12px', borderRadius: 6, textAlign: 'left', fontSize: 12, cursor: 'pointer',
                  border: `1px solid ${mcA[q.id] === o.l ? C.gold : C.border}`,
                  background: mcA[q.id] === o.l ? C.goldDim + '44' : C.surface,
                  color: mcA[q.id] === o.l ? C.gold : C.textMid, fontWeight: mcA[q.id] === o.l ? 700 : 400,
                }}><span style={{ color: C.textDim, marginRight: 6 }}>{o.l}.</span>{o.t}</button>
              ))}
            </div>
          </Card>
        ))}
        {exam.mcm?.map(q => {
          const sel = mcmA[q.id] || [];
          const toggle = l => setMCMA(p => {
            const curr = p[q.id] || [];
            return { ...p, [q.id]: curr.includes(l) ? curr.filter(x => x !== l) : [...curr, l] };
          });
          return (
            <Card key={q.id} style={{ marginBottom: 10 }}>
              <Tag color={'#9B6BDB'}>Select ALL</Tag>
              <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, margin: '8px 0 10px' }}>{q.q}</p>
              <div style={{ display: 'grid', gap: 4 }}>
                {q.opts.map(o => (
                  <button key={o.l} onClick={() => toggle(o.l)} style={{
                    padding: '8px 12px', borderRadius: 6, textAlign: 'left', fontSize: 12, cursor: 'pointer',
                    border: `1px solid ${sel.includes(o.l) ? C.gold : C.border}`,
                    background: sel.includes(o.l) ? C.goldDim + '44' : C.surface,
                    color: sel.includes(o.l) ? C.gold : C.textMid, fontWeight: sel.includes(o.l) ? 700 : 400,
                  }}><span style={{ color: C.textDim, marginRight: 6 }}>{o.l}.</span>{o.t}</button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* NE */}
      <div style={{ marginTop: 20 }}>
        <SectionHead label="Numeric Entry" count={`${exam.ne?.length || 0} questions`} color={C.greenBr} />
        {exam.ne?.map(q => (
          <Card key={q.id} style={{ marginBottom: 10 }}>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>{q.q}</p>
            <input type="text" value={neA[q.id] || ''} onChange={e => setNEA(p => ({ ...p, [q.id]: e.target.value }))}
              placeholder="Type answer" style={{
                padding: '10px 16px', borderRadius: 6, fontSize: 16, fontWeight: 700,
                fontFamily: 'Courier New,monospace', width: 160,
                border: `2px solid ${C.border}`, background: C.surface, color: C.text, outline: 'none',
              }} />
          </Card>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '32px 0 60px' }}>
        <Btn onClick={submit}>Submit Exam →</Btn>
      </div>
    </div>
  );
}
