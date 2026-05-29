import { useState, useCallback, useEffect, useRef } from 'react';
import C from '../../theme';
import { QUANT_TOPICS } from '../../data/quant-topics';
import { recordQuantResults, saveLastSessionWrong, getLastSessionWrong, getWeakSubtopics, getQuantWeakAreas } from '../../engine/QuantErrorEngine';
import Tag from '../../components/Tag';
import Timer from '../../components/Timer';

// ─── Shared style helpers ──────────────────────────────────────────────────────
const card  = (extra = {}) => ({ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', marginBottom: 14, transition: 'all 0.2s', ...extra });
const stag  = (color)      => ({ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: color + '22', color });

// ─── Tonight's 3 Review Card ──────────────────────────────────────────────────
function TonightReview({ onDismiss }) {
  const items = getLastSessionWrong();
  if (!items.length) return null;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.red}12, ${C.card})`,
      border: `1px solid ${C.red}33`, borderRadius: 12, padding: '16px 18px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🌙</span>
          <span style={{ color: C.red, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tonight's 3 — From Last Session</span>
        </div>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>
      <p style={{ color: C.textMid, fontSize: 12, marginBottom: 10 }}>These subtopics tripped you up. Review them before generating new questions.</p>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 10px', background: C.surface, borderRadius: 8, marginBottom: 6, borderLeft: `3px solid ${C.red}` }}>
          <span style={{ color: C.red, fontSize: 12, fontWeight: 700, fontFamily: 'Courier New,monospace', minWidth: 16 }}>{i + 1}.</span>
          <div>
            <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: '0 0 2px' }}>{item.subtopic}</p>
            {item.question && <p style={{ color: C.textMid, fontSize: 11, margin: 0, lineHeight: 1.5 }}>{item.question}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Weak Area Banner ─────────────────────────────────────────────────────────
function WeakAreaBanner({ topicId }) {
  const weak = getQuantWeakAreas().filter(w => {
    const topic = QUANT_TOPICS.find(t => t.id === topicId);
    return topic?.subtopics?.includes(w.subtopic);
  }).slice(0, 3);
  if (!weak.length) return null;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
      <span style={{ color: C.textDim, fontSize: 11, alignSelf: 'center' }}>Weak areas:</span>
      {weak.map(w => (
        <span key={w.subtopic} style={stag(w.accuracy < 50 ? C.red : C.gold)}>
          {w.subtopic} · {w.accuracy}%
        </span>
      ))}
    </div>
  );
}

// ─── QC Card ──────────────────────────────────────────────────────────────────
function QCCard({ q, num, answer, onAnswer, checked, timed }) {
  const opts = [
    { l: 'A', t: 'Quantity A is greater' },
    { l: 'B', t: 'Quantity B is greater' },
    { l: 'C', t: 'The two quantities are equal' },
    { l: 'D', t: 'Cannot be determined' },
  ];
  const correct = checked && answer === q.answer;
  const wrong   = checked && answer && answer !== q.answer;

  return (
    <div style={card({ borderLeft: `3px solid ${checked ? (correct ? C.green : wrong ? C.red : C.border) : C.blue}` })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 800, color: C.blue, opacity: 0.4 }}>{String(num).padStart(2, '0')}</span>
        <span style={stag(C.blue)}>QC</span>
        {q.topic && <span style={stag(C.textDim)}>{q.topic}</span>}
        {checked && <span style={stag(correct ? C.green : wrong ? C.red : C.textDim)}>{correct ? '✓ Correct' : wrong ? '✗ Wrong' : '— Skipped'}</span>}
        {timed && !checked && <div style={{ marginLeft: 'auto' }}><Timer key={q.id} seconds={90} onTimeUp={() => onAnswer('__timeout__')} label="⏱" /></div>}
      </div>

      {q.info && (
        <div style={{ background: C.bg, borderRadius: 8, padding: '10px 14px', marginBottom: 14, borderLeft: `3px solid ${C.textDim}` }}>
          <p style={{ color: C.textMid, fontSize: 12, margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>{q.info}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 44px 1fr', gap: 0, marginBottom: 16, alignItems: 'stretch' }}>
        <div style={{ background: `linear-gradient(135deg, ${C.blue}15, ${C.blue}06)`, borderRadius: '10px 0 0 10px', padding: '16px 18px', textAlign: 'center', border: `1px solid ${checked && q.answer === 'A' ? C.green : C.blue}22` }}>
          <p style={{ color: C.blue, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Quantity A</p>
          <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'Georgia,serif', lineHeight: 1.5 }}>{q.qtyA}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.surface }}>
          <span style={{ color: C.textDim, fontSize: 11, fontWeight: 700 }}>vs</span>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${C.gold}15, ${C.gold}06)`, borderRadius: '0 10px 10px 0', padding: '16px 18px', textAlign: 'center', border: `1px solid ${checked && q.answer === 'B' ? C.green : C.gold}22` }}>
          <p style={{ color: C.gold, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Quantity B</p>
          <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'Georgia,serif', lineHeight: 1.5 }}>{q.qtyB}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {opts.map(o => {
          const sel = answer === o.l;
          const isC = checked && o.l === q.answer;
          const isW = checked && sel && o.l !== q.answer;
          return (
            <button key={o.l} onClick={() => !checked && onAnswer(o.l)} disabled={checked} style={{
              padding: '10px 14px', borderRadius: 8, textAlign: 'left', fontSize: 12, lineHeight: 1.4,
              cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
              border: `1.5px solid ${isC ? C.green : isW ? C.red : sel ? C.gold : C.border}`,
              background: isC ? C.green + '18' : isW ? C.red + '18' : sel ? C.gold + '18' : C.surface,
              color: isC ? C.greenBr : isW ? C.red : sel ? C.gold : C.textMid,
              fontWeight: sel || isC ? 700 : 400,
            }}>
              <span style={{ fontFamily: 'Courier New,monospace', marginRight: 8, opacity: 0.5 }}>{o.l}</span>{o.t}
              {isC && ' ✓'}{isW && ' ✗'}
            </button>
          );
        })}
      </div>

      {checked && q.explain && (
        <div style={{ marginTop: 14, background: `linear-gradient(135deg, ${C.blue}10, transparent)`, borderRadius: 8, padding: '14px 16px', borderLeft: `3px solid ${C.blue}` }}>
          <p style={{ fontSize: 10, color: C.blue, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>💡 Solution</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.9, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </div>
  );
}

// ─── MC Card ──────────────────────────────────────────────────────────────────
function MCCard({ q, num, answer, onAnswer, checked, timed }) {
  const correct = checked && answer === q.answer;
  const wrong   = checked && answer && answer !== q.answer;
  return (
    <div style={card({ borderLeft: `3px solid ${checked ? (correct ? C.green : wrong ? C.red : C.border) : C.gold}` })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 800, color: C.gold, opacity: 0.4 }}>{String(num).padStart(2, '0')}</span>
        <span style={stag(C.gold)}>MC</span>
        {q.topic && <span style={stag(C.textDim)}>{q.topic}</span>}
        {checked && <span style={stag(correct ? C.green : wrong ? C.red : C.textDim)}>{correct ? '✓ Correct' : wrong ? '✗ Wrong' : '— Skipped'}</span>}
        {timed && !checked && <div style={{ marginLeft: 'auto' }}><Timer key={q.id} seconds={120} onTimeUp={() => onAnswer('__timeout__')} label="⏱" /></div>}
      </div>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.9, marginBottom: 14, fontFamily: 'Georgia,serif' }}>{q.q}</p>
      <div style={{ display: 'grid', gap: 6 }}>
        {q.opts.map(o => {
          const sel = answer === o.l;
          const isC = checked && o.l === q.answer;
          const isW = checked && sel && o.l !== q.answer;
          return (
            <button key={o.l} onClick={() => !checked && onAnswer(o.l)} disabled={checked} style={{
              padding: '11px 16px', borderRadius: 8, textAlign: 'left', fontSize: 13, lineHeight: 1.5,
              cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
              border: `1.5px solid ${isC ? C.green : isW ? C.red : sel ? C.gold : C.border}`,
              background: isC ? C.green + '18' : isW ? C.red + '18' : sel ? C.gold + '18' : C.surface,
              color: isC ? C.greenBr : isW ? C.red : sel ? C.gold : C.textMid,
              fontWeight: sel || isC ? 700 : 400,
            }}>
              <span style={{ fontFamily: 'Courier New,monospace', marginRight: 10, fontSize: 12, opacity: 0.5 }}>{o.l}.</span>{o.t}
              {isC && ' ✓'}{isW && ' ✗'}
            </button>
          );
        })}
      </div>
      {checked && q.explain && (
        <div style={{ marginTop: 14, background: `linear-gradient(135deg, ${C.gold}10, transparent)`, borderRadius: 8, padding: '14px 16px', borderLeft: `3px solid ${C.gold}` }}>
          <p style={{ fontSize: 10, color: C.gold, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>💡 Solution</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.9, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </div>
  );
}

// ─── NE Card ──────────────────────────────────────────────────────────────────
function NECard({ q, num, answer, onAnswer, checked }) {
  const isCorrect = checked && String(answer || '').trim() === String(q.answer).trim();
  const isWrong   = checked && answer && !isCorrect;
  return (
    <div style={card({ borderLeft: `3px solid ${checked ? (isCorrect ? C.green : isWrong ? C.red : C.border) : C.greenBr}` })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 800, color: C.greenBr, opacity: 0.4 }}>{String(num).padStart(2, '0')}</span>
        <span style={stag(C.greenBr)}>Numeric Entry</span>
        {q.topic && <span style={stag(C.textDim)}>{q.topic}</span>}
        {checked && <span style={stag(isCorrect ? C.green : isWrong ? C.red : C.textDim)}>{isCorrect ? '✓ Correct' : isWrong ? '✗ Wrong' : '— Skipped'}</span>}
      </div>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.9, marginBottom: 14, fontFamily: 'Georgia,serif' }}>{q.q}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <input type="text" value={answer || ''} onChange={e => !checked && onAnswer(e.target.value)}
          placeholder="Type answer" disabled={checked}
          style={{
            padding: '12px 18px', borderRadius: 8, fontSize: 18, fontWeight: 700,
            fontFamily: 'Courier New,monospace', width: 180,
            border: `2px solid ${checked ? (isCorrect ? C.green : isWrong ? C.red : C.border) : C.border}`,
            background: checked ? (isCorrect ? C.green + '18' : isWrong ? C.red + '18' : C.surface) : C.surface,
            color: checked ? (isCorrect ? C.greenBr : isWrong ? C.red : C.text) : C.text,
            outline: 'none', transition: 'all 0.2s',
          }} />
        {checked && !isCorrect && (
          <span style={{ color: C.greenBr, fontSize: 14, fontWeight: 700, fontFamily: 'Courier New,monospace' }}>
            ✓ {q.answer}
          </span>
        )}
      </div>
      {checked && q.explain && (
        <div style={{ marginTop: isCorrect ? 14 : 24, background: `linear-gradient(135deg, ${C.greenBr}10, transparent)`, borderRadius: 8, padding: '14px 16px', borderLeft: `3px solid ${C.greenBr}` }}>
          <p style={{ fontSize: 10, color: C.greenBr, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>💡 Solution</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.9, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </div>
  );
}

// ─── Post-session analysis ─────────────────────────────────────────────────────
function SessionAnalysis({ qs, qcA, mcA, neA, topicData, onNewSet }) {
  let correct = 0, total = 0;
  const wrongItems = [];

  qs.qc.forEach(q => {
    total++;
    const c = qcA[q.id] === q.answer;
    if (c) correct++;
    else wrongItems.push({ subtopic: q.topic || topicData.id, question: q.qtyA + ' vs ' + q.qtyB });
  });
  qs.mc.forEach(q => {
    total++;
    const c = mcA[q.id] === q.answer;
    if (c) correct++;
    else wrongItems.push({ subtopic: q.topic || topicData.id, question: q.q?.slice(0, 60) + '...' });
  });
  qs.ne.forEach(q => {
    total++;
    const c = String(neA[q.id] || '').trim() === String(q.answer).trim();
    if (c) correct++;
    else wrongItems.push({ subtopic: q.topic || topicData.id, question: q.q?.slice(0, 60) + '...' });
  });

  const pct   = total > 0 ? Math.round(correct / total * 100) : 0;
  const color = pct >= 80 ? C.greenBr : pct >= 60 ? C.gold : C.red;
  const allWeakAreas = getQuantWeakAreas().filter(w => {
    return topicData.subtopics?.includes(w.subtopic);
  }).slice(0, 4);

  return (
    <div>
      {/* Score card */}
      <div style={{
        background: `linear-gradient(135deg, ${color}15, ${C.card})`,
        border: `1px solid ${color}33`, borderRadius: 14, padding: '24px', marginBottom: 20, textAlign: 'center',
      }}>
        <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 8px' }}>Session Score</p>
        <p style={{ fontFamily: 'Courier New,monospace', fontSize: 52, fontWeight: 700, color, margin: '0 0 4px', lineHeight: 1 }}>{pct}%</p>
        <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 16px' }}>{correct}/{total} correct</p>

        {/* Type breakdown */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            { label: 'QC', got: qs.qc.filter(q => qcA[q.id] === q.answer).length, max: qs.qc.length, color: C.blue },
            { label: 'MC', got: qs.mc.filter(q => mcA[q.id] === q.answer).length, max: qs.mc.length, color: C.gold },
            { label: 'NE', got: qs.ne.filter(q => String(neA[q.id] || '').trim() === String(q.answer).trim()).length, max: qs.ne.length, color: C.greenBr },
          ].map(s => (
            <div key={s.label} style={{
              padding: '8px 16px', borderRadius: 8,
              background: `${s.color}15`, border: `1px solid ${s.color}33`,
            }}>
              <span style={stag(s.color)}>{s.label}</span>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 14, fontWeight: 700, color: s.color, marginLeft: 8 }}>{s.got}/{s.max}</span>
            </div>
          ))}
        </div>

        <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.6 }}>
          {pct >= 80 ? '🎯 Excellent! You\'ve got this topic down. Keep it sharp with occasional review.' :
           pct >= 60 ? '💪 Good progress. The errors above are your focus areas for next session.' :
           '📚 This topic needs more work. Study the concepts first, then retry.'}
        </p>
      </div>

      {/* Wrong items — Tonight's 3 */}
      {wrongItems.length > 0 && (
        <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}22`, borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
          <p style={{ color: C.red, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            🌙 Remember These Tonight ({wrongItems.length} missed)
          </p>
          {wrongItems.slice(0, 5).map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: i < Math.min(wrongItems.length, 5) - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ color: C.red, fontWeight: 700, fontSize: 11, minWidth: 16 }}>{i + 1}.</span>
              <div>
                <span style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>{w.subtopic}</span>
                <p style={{ color: C.textMid, fontSize: 11, margin: '2px 0 0', lineHeight: 1.4 }}>{w.question}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtopic weak areas */}
      {allWeakAreas.length > 0 && (
        <div style={{ background: C.surface, borderRadius: 12, padding: '16px 18px', marginBottom: 20, border: `1px solid ${C.border}` }}>
          <p style={{ color: C.textDim, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            📊 Cumulative Accuracy by Subtopic
          </p>
          {allWeakAreas.map(w => (
            <div key={w.subtopic} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ color: C.text, fontSize: 12, flex: 1 }}>{w.subtopic}</span>
              <div style={{ width: 80, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${w.accuracy}%`, background: w.accuracy >= 80 ? C.green : w.accuracy >= 60 ? C.gold : C.red }} />
              </div>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 11, fontWeight: 700, color: w.accuracy >= 80 ? C.greenBr : w.accuracy >= 60 ? C.gold : C.red, minWidth: 32 }}>
                {w.accuracy}%
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onNewSet} style={{
          flex: 1, padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color: '#07090F',
          fontWeight: 700, fontSize: 14, fontFamily: 'Georgia,serif',
          boxShadow: `0 4px 16px ${C.gold}44`,
        }}>↺ New Practice Set</button>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuantPractice({ topic, onScoreUpdate }) {
  const topicData  = QUANT_TOPICS.find(t => t.id === topic);
  const [qs, setQs]          = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [checked, setChecked] = useState(false);
  const [qcA, setQCA]        = useState({});
  const [mcA, setMCA]        = useState({});
  const [neA, setNEA]        = useState({});
  const [timed, setTimed]    = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showTonights, setShowTonights] = useState(true);

  const generate = useCallback(async () => {
    setLoading(true); setError(null); setQs(null);
    setChecked(false); setQCA({}); setMCA({}); setNEA({});
    setShowReview(false);
    try {
      const weakAreas = getWeakSubtopics(4);
      const res = await fetch('/api/quant-generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topicData.id, topicLabel: topicData.label,
          subtopics: topicData.subtopics, weakAreas,
        }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Error: ${res.status}`); }
      setQs(await res.json());
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [topicData]);

  const submit = () => {
    setChecked(true);
    setShowReview(true);

    // Score
    let c = 0, t = 0;
    const results = [];
    qs.qc.forEach(q => {
      t++; const correct = qcA[q.id] === q.answer;
      if (correct) c++;
      results.push({ id: q.id, topic: topicData.id, subtopic: q.topic || topicData.id, correct });
    });
    qs.mc.forEach(q => {
      t++; const correct = mcA[q.id] === q.answer;
      if (correct) c++;
      results.push({ id: q.id, topic: topicData.id, subtopic: q.topic || topicData.id, correct });
    });
    qs.ne.forEach(q => {
      t++; const correct = String(neA[q.id] || '').trim() === String(q.answer).trim();
      if (correct) c++;
      results.push({ id: q.id, topic: topicData.id, subtopic: q.topic || topicData.id, correct });
    });

    // Record errors
    recordQuantResults(results);
    const wrongItems = results.filter(r => !r.correct).map(r => ({
      subtopic: r.subtopic,
      question: [...qs.qc, ...qs.mc, ...qs.ne].find(q => q.id === r.id)?.q?.slice(0, 60) || '',
    }));
    saveLastSessionWrong(wrongItems);
    onScoreUpdate?.(topicData.id, c, t);
  };

  // ─── LANDING ──────────────────────────────────────────────────────────────
  if (!qs && !loading) return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '24px 0' }}>
      {showTonights && <TonightReview onDismiss={() => setShowTonights(false)} />}

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span style={{ fontSize: 44 }}>{topicData.icon}</span>
        <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 21, color: C.gold, margin: '10px 0 6px' }}>{topicData.label}</h3>
        <p style={{ color: C.textMid, fontSize: 13 }}>AI-generated · adaptive to your weak areas · full explanations</p>
      </div>

      <WeakAreaBanner topicId={topic} />

      {/* Format */}
      <div style={card()}>
        <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700 }}>Question Format</p>
        {[
          { icon: '⚖️', label: 'Quantitative Comparison', count: 5, color: C.blue },
          { icon: '📝', label: 'Multiple Choice', count: 3, color: C.gold },
          { icon: '✏️', label: 'Numeric Entry', count: 2, color: C.greenBr },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ color: C.text, fontSize: 13, flex: 1 }}>{s.label}</span>
            <span style={stag(s.color)}>{s.count} Qs</span>
          </div>
        ))}
        {/* Timed toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 }}>
          <span style={{ color: C.textMid, fontSize: 12 }}>⏱ Timed Mode (per question)</span>
          <button onClick={() => setTimed(t => !t)} style={{
            padding: '4px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: timed ? C.gold : C.surface,
            color: timed ? '#07090F' : C.textMid,
            fontSize: 11, fontWeight: 700, transition: 'all 0.2s',
          }}>{timed ? 'ON' : 'OFF'}</button>
        </div>
      </div>

      {/* Traps */}
      <div style={card({ borderLeft: `3px solid ${C.red}`, background: `linear-gradient(135deg, ${C.red}08, ${C.card})` })}>
        <p style={{ color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>⚠️ Common Traps</p>
        {topicData.traps.slice(0, 3).map((t, i) => (
          <p key={i} style={{ color: C.textMid, fontSize: 12, margin: '5px 0', lineHeight: 1.5 }}>• {t}</p>
        ))}
      </div>

      {error && <p style={{ color: C.red, textAlign: 'center', margin: '12px 0' }}>{error}</p>}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={generate} style={{
          padding: '13px 36px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color: '#07090F',
          fontWeight: 700, fontSize: 14, fontFamily: 'Georgia,serif',
          boxShadow: `0 4px 20px ${C.gold}44`, letterSpacing: '0.02em',
        }}>Generate Practice ⚡</button>
      </div>
    </div>
  );

  // ─── LOADING ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 16 }}>
      <div style={{ width: 52, height: 52, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: C.gold, fontSize: 16, fontWeight: 700, fontFamily: 'Georgia,serif' }}>Generating {topicData.label}...</p>
      <p style={{ color: C.textDim, fontSize: 12 }}>Adapting to your weak areas</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ─── RESULTS VIEW ─────────────────────────────────────────────────────────
  if (showReview && checked) return (
    <SessionAnalysis
      qs={qs} qcA={qcA} mcA={mcA} neA={neA} topicData={topicData}
      onNewSet={() => { setQs(null); setShowReview(false); setShowTonights(false); }}
    />
  );

  // ─── PRACTICE VIEW ────────────────────────────────────────────────────────
  let qNum = 0;
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{topicData.icon}</span>
          <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: C.gold, margin: 0 }}>{topicData.label}</h3>
          <span style={stag(C.textDim)}>{qs.qc.length + qs.mc.length + qs.ne.length} questions</span>
          {timed && <span style={stag(C.blue)}>⏱ Timed</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setTimed(t => !t)} style={{
            padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`,
            background: timed ? `${C.blue}22` : 'transparent', color: timed ? C.blue : C.textMid,
            cursor: 'pointer', fontSize: 11, fontWeight: 700,
          }}>{timed ? '⏱ Timed' : '⏱ Untimed'}</button>
          <button onClick={() => setQs(null)} style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', color: C.textMid, cursor: 'pointer', fontSize: 12 }}>↺ New Set</button>
        </div>
      </div>

      {/* QC */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 4 }}>
        <span style={{ fontSize: 14 }}>⚖️</span>
        <span style={{ color: C.blue, fontSize: 13, fontWeight: 700 }}>Quantitative Comparison</span>
        <span style={{ color: C.textDim, fontSize: 11 }}>({qs.qc.length})</span>
      </div>
      {qs.qc.map(q => { qNum++; return <QCCard key={q.id} q={q} num={qNum} answer={qcA[q.id]} onAnswer={a => setQCA(p => ({ ...p, [q.id]: a }))} checked={checked} timed={timed} />; })}

      {/* MC */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 20 }}>
        <span style={{ fontSize: 14 }}>📝</span>
        <span style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>Multiple Choice</span>
        <span style={{ color: C.textDim, fontSize: 11 }}>({qs.mc.length})</span>
      </div>
      {qs.mc.map(q => { qNum++; return <MCCard key={q.id} q={q} num={qNum} answer={mcA[q.id]} onAnswer={a => setMCA(p => ({ ...p, [q.id]: a }))} checked={checked} timed={timed} />; })}

      {/* NE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 20 }}>
        <span style={{ fontSize: 14 }}>✏️</span>
        <span style={{ color: C.greenBr, fontSize: 13, fontWeight: 700 }}>Numeric Entry</span>
        <span style={{ color: C.textDim, fontSize: 11 }}>({qs.ne.length})</span>
      </div>
      {qs.ne.map(q => { qNum++; return <NECard key={q.id} q={q} num={qNum} answer={neA[q.id]} onAnswer={a => setNEA(p => ({ ...p, [q.id]: a }))} checked={checked} />; })}

      {/* Submit */}
      <div style={{ textAlign: 'center', padding: '28px 0 40px' }}>
        {!checked ? (
          <button onClick={submit} style={{
            padding: '14px 44px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color: '#07090F',
            fontWeight: 700, fontSize: 15, fontFamily: 'Georgia,serif',
            boxShadow: `0 4px 16px ${C.gold}44`,
          }}>Check All Answers →</button>
        ) : (
          <button onClick={() => setShowReview(true)} style={{
            padding: '12px 28px', borderRadius: 8, border: 'none',
            background: C.gold, color: '#07090F', cursor: 'pointer', fontSize: 13, fontWeight: 700,
          }}>View Session Analysis →</button>
        )}
      </div>
    </div>
  );
}
