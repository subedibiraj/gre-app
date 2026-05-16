import { useState, useCallback } from 'react';
import C from '../../theme';
import { QUANT_TOPICS } from '../../data/quant-topics';

// ─── Shared Styles ────────────────────────────────────────────────────────────
const card = (extra={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', marginBottom:14, transition:'all 0.2s', ...extra });
const tag = (color, extra={}) => ({ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', background:color+'22', color, ...extra });
const sectionLabel = (color) => ({ display:'flex', alignItems:'center', gap:8, marginBottom:12, marginTop:20 });

// ─── QC Question ──────────────────────────────────────────────────────────────
function QCCard({ q, num, answer, onAnswer, checked }) {
  const opts = [
    { l:'A', t:'Quantity A is greater', short:'A > B' },
    { l:'B', t:'Quantity B is greater', short:'A < B' },
    { l:'C', t:'The two quantities are equal', short:'A = B' },
    { l:'D', t:'Cannot be determined', short:'???' },
  ];
  const correct = checked && answer === q.answer;
  const wrong = checked && answer !== q.answer;

  return (
    <div style={card({ borderLeft:`3px solid ${checked ? (correct?C.green:C.red) : C.blue}` })}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <span style={{ fontFamily:'Courier New,monospace', fontSize:20, fontWeight:800, color:C.blue, opacity:0.4 }}>{String(num).padStart(2,'0')}</span>
        <span style={tag(C.blue)}>Quantitative Comparison</span>
        {checked && <span style={tag(correct?C.green:C.red)}>{correct?'✓ Correct':'✗ Wrong'}</span>}
      </div>

      {q.info && (
        <div style={{ background:C.bg, borderRadius:8, padding:'10px 14px', marginBottom:14, borderLeft:`3px solid ${C.textDim}` }}>
          <p style={{ color:C.textMid, fontSize:12, margin:0, lineHeight:1.7, fontStyle:'italic' }}>{q.info}</p>
        </div>
      )}

      {/* Qty A vs B */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 50px 1fr', gap:0, marginBottom:16, alignItems:'stretch' }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.blue}15, ${C.blue}08)`,
          borderRadius:'10px 0 0 10px', padding:'16px 18px', textAlign:'center',
          border:`1px solid ${checked && q.answer==='A' ? C.green : C.blue}33`,
        }}>
          <p style={{ color:C.blue, fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>Quantity A</p>
          <p style={{ color:C.text, fontSize:16, fontWeight:700, margin:0, fontFamily:'Georgia,serif', lineHeight:1.4 }}>{q.qtyA}</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', background:C.surface }}>
          <span style={{ color:C.textDim, fontSize:12, fontWeight:700, fontFamily:'Georgia,serif' }}>vs</span>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${C.gold}15, ${C.gold}08)`,
          borderRadius:'0 10px 10px 0', padding:'16px 18px', textAlign:'center',
          border:`1px solid ${checked && q.answer==='B' ? C.green : C.gold}33`,
        }}>
          <p style={{ color:C.gold, fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>Quantity B</p>
          <p style={{ color:C.text, fontSize:16, fontWeight:700, margin:0, fontFamily:'Georgia,serif', lineHeight:1.4 }}>{q.qtyB}</p>
        </div>
      </div>

      {/* Options */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
        {opts.map(o => {
          const sel = answer===o.l;
          const isCorrect = checked && o.l===q.answer;
          const isWrong = checked && sel && o.l!==q.answer;
          return (
            <button key={o.l} onClick={()=>!checked && onAnswer(o.l)} disabled={checked} style={{
              padding:'10px 14px', borderRadius:8, textAlign:'left', fontSize:12, lineHeight:1.4,
              cursor:checked?'default':'pointer', transition:'all 0.15s',
              border:`1.5px solid ${isCorrect?C.green:isWrong?C.red:sel?C.gold:C.border}`,
              background: isCorrect?C.green+'18':isWrong?C.red+'18':sel?C.gold+'18':C.surface,
              color: isCorrect?C.greenBr:isWrong?C.red:sel?C.gold:C.textMid,
              fontWeight: sel||isCorrect?700:400,
              boxShadow: sel&&!checked?`0 0 0 1px ${C.gold}44`:'none',
            }}>
              <span style={{ fontFamily:'Courier New,monospace', marginRight:8, opacity:0.5 }}>{o.l}</span>
              {o.t}
              {isCorrect&&' ✓'}{isWrong&&' ✗'}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {checked && q.explain && (
        <div style={{ marginTop:14, background:`linear-gradient(135deg, ${C.blue}10, transparent)`, borderRadius:8, padding:'14px 16px', borderLeft:`3px solid ${C.blue}` }}>
          <p style={{ fontSize:10, color:C.blue, fontWeight:700, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.1em' }}>💡 Solution</p>
          <p style={{ color:C.text, fontSize:12, lineHeight:1.8, margin:0, whiteSpace:'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </div>
  );
}

// ─── MC Question ──────────────────────────────────────────────────────────────
function MCCard({ q, num, answer, onAnswer, checked }) {
  const correct = checked && answer===q.answer;
  return (
    <div style={card({ borderLeft:`3px solid ${checked?(correct?C.green:C.red):C.gold}` })}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <span style={{ fontFamily:'Courier New,monospace', fontSize:20, fontWeight:800, color:C.gold, opacity:0.4 }}>{String(num).padStart(2,'0')}</span>
        <span style={tag(C.gold)}>Multiple Choice</span>
        {checked && <span style={tag(correct?C.green:C.red)}>{correct?'✓ Correct':'✗ Wrong'}</span>}
      </div>
      <p style={{ color:C.text, fontSize:14, lineHeight:1.9, marginBottom:14, fontFamily:'Georgia,serif' }}>{q.q}</p>
      <div style={{ display:'grid', gap:6 }}>
        {q.opts.map(o => {
          const sel = answer===o.l;
          const isC = checked && o.l===q.answer;
          const isW = checked && sel && o.l!==q.answer;
          return (
            <button key={o.l} onClick={()=>!checked&&onAnswer(o.l)} disabled={checked} style={{
              padding:'11px 16px', borderRadius:8, textAlign:'left', fontSize:13, lineHeight:1.5,
              cursor:checked?'default':'pointer', transition:'all 0.15s',
              border:`1.5px solid ${isC?C.green:isW?C.red:sel?C.gold:C.border}`,
              background:isC?C.green+'18':isW?C.red+'18':sel?C.gold+'18':C.surface,
              color:isC?C.greenBr:isW?C.red:sel?C.gold:C.textMid,
              fontWeight:sel||isC?700:400,
            }}>
              <span style={{ fontFamily:'Courier New,monospace', marginRight:10, fontSize:12, opacity:0.5 }}>{o.l}.</span>{o.t}
              {isC&&' ✓'}{isW&&' ✗'}
            </button>
          );
        })}
      </div>
      {checked && q.explain && (
        <div style={{ marginTop:14, background:`linear-gradient(135deg, ${C.gold}10, transparent)`, borderRadius:8, padding:'14px 16px', borderLeft:`3px solid ${C.gold}` }}>
          <p style={{ fontSize:10, color:C.gold, fontWeight:700, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.1em' }}>💡 Solution</p>
          <p style={{ color:C.text, fontSize:12, lineHeight:1.8, margin:0, whiteSpace:'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </div>
  );
}

// ─── Numeric Entry ────────────────────────────────────────────────────────────
function NECard({ q, num, answer, onAnswer, checked }) {
  const isCorrect = checked && String(answer).trim()===String(q.answer).trim();
  return (
    <div style={card({ borderLeft:`3px solid ${checked?(isCorrect?C.green:C.red):C.greenBr}` })}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <span style={{ fontFamily:'Courier New,monospace', fontSize:20, fontWeight:800, color:C.greenBr, opacity:0.4 }}>{String(num).padStart(2,'0')}</span>
        <span style={tag(C.greenBr)}>Numeric Entry</span>
        {checked && <span style={tag(isCorrect?C.green:C.red)}>{isCorrect?'✓ Correct':'✗ Wrong'}</span>}
      </div>
      <p style={{ color:C.text, fontSize:14, lineHeight:1.9, marginBottom:14, fontFamily:'Georgia,serif' }}>{q.q}</p>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ position:'relative' }}>
          <input type="text" value={answer||''} onChange={e=>!checked&&onAnswer(e.target.value)}
            placeholder="Your answer" disabled={checked} style={{
              padding:'12px 18px', borderRadius:8, fontSize:18, fontWeight:700,
              fontFamily:'Courier New,monospace', width:180,
              border:`2px solid ${checked?(isCorrect?C.green:C.red):C.border}`,
              background:checked?(isCorrect?C.green+'18':C.red+'18'):C.surface,
              color:checked?(isCorrect?C.greenBr:C.red):C.text, outline:'none',
              transition:'all 0.2s',
            }}/>
          {checked && !isCorrect && (
            <div style={{ position:'absolute', top:'100%', left:0, marginTop:4 }}>
              <span style={{ color:C.greenBr, fontSize:13, fontWeight:700, fontFamily:'Courier New,monospace' }}>
                ✓ {q.answer}
              </span>
            </div>
          )}
        </div>
      </div>
      {checked && q.explain && (
        <div style={{ marginTop:isCorrect?14:28, background:`linear-gradient(135deg, ${C.greenBr}10, transparent)`, borderRadius:8, padding:'14px 16px', borderLeft:`3px solid ${C.greenBr}` }}>
          <p style={{ fontSize:10, color:C.greenBr, fontWeight:700, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.1em' }}>💡 Solution</p>
          <p style={{ color:C.text, fontSize:12, lineHeight:1.8, margin:0, whiteSpace:'pre-line' }}>{q.explain}</p>
        </div>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressRing({ correct, total }) {
  const pct = total>0 ? Math.round(correct/total*100) : 0;
  const color = pct>=80?C.greenBr:pct>=50?C.gold:C.red;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background:`linear-gradient(135deg, ${color}12, transparent)`, borderRadius:10, border:`1px solid ${color}33` }}>
      <div style={{ position:'relative', width:48, height:48 }}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke={C.border} strokeWidth="4"/>
          <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${pct*1.257} 125.7`} strokeLinecap="round"
            transform="rotate(-90 24 24)" style={{ transition:'stroke-dasharray 0.6s ease' }}/>
        </svg>
        <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Courier New,monospace', fontSize:13, fontWeight:700, color }}>{pct}%</span>
      </div>
      <div>
        <p style={{ color, fontSize:16, fontWeight:700, margin:0, fontFamily:'Courier New,monospace' }}>{correct}/{total}</p>
        <p style={{ color:C.textDim, fontSize:11, margin:0 }}>correct answers</p>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuantPractice({ topic, onScoreUpdate }) {
  const topicData = QUANT_TOPICS.find(t=>t.id===topic);
  const [qs, setQs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [qcA, setQCA] = useState({});
  const [mcA, setMCA] = useState({});
  const [neA, setNEA] = useState({});

  const generate = useCallback(async () => {
    setLoading(true); setError(null); setQs(null); setChecked(false);
    setQCA({}); setMCA({}); setNEA({});
    try {
      const res = await fetch('/api/quant-generate', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ topicId:topicData.id, topicLabel:topicData.label, subtopics:topicData.subtopics }),
      });
      if(!res.ok){ const e=await res.json().catch(()=>({})); throw new Error(e.error||`Error: ${res.status}`); }
      setQs(await res.json());
    } catch(e){ setError(e.message); }
    setLoading(false);
  }, [topicData]);

  const submit = () => {
    setChecked(true);
    let c=0, t=0;
    qs.qc.forEach(q=>{ t++; if(qcA[q.id]===q.answer)c++; });
    qs.mc.forEach(q=>{ t++; if(mcA[q.id]===q.answer)c++; });
    qs.ne.forEach(q=>{ t++; if(String(neA[q.id]).trim()===String(q.answer).trim())c++; });
    onScoreUpdate?.(topicData.id, c, t);
  };

  // ─── LANDING ───
  if(!qs && !loading) return (
    <div style={{ maxWidth:520, margin:'0 auto', padding:'30px 0' }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <span style={{ fontSize:48 }}>{topicData.icon}</span>
        <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:C.gold, margin:'8px 0 6px' }}>{topicData.label} Practice</h3>
        <p style={{ color:C.textMid, fontSize:13, lineHeight:1.6 }}>AI-generated GRE-difficulty questions with step-by-step solutions</p>
      </div>

      {/* Format preview */}
      <div style={card()}>
        <p style={{ color:C.textDim, fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12, fontWeight:700 }}>Question Format</p>
        {[
          { icon:'⚖️', label:'Quantitative Comparison', count:5, color:C.blue },
          { icon:'📝', label:'Multiple Choice', count:3, color:C.gold },
          { icon:'✏️', label:'Numeric Entry', count:2, color:C.greenBr },
        ].map(s=>(
          <div key={s.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:18, width:28 }}>{s.icon}</span>
            <span style={{ color:C.text, fontSize:13, flex:1 }}>{s.label}</span>
            <span style={tag(s.color)}>{s.count} Qs</span>
          </div>
        ))}
      </div>

      {/* Traps warning */}
      <div style={card({ borderLeft:`3px solid ${C.red}`, background:`linear-gradient(135deg, ${C.red}08, ${C.card})` })}>
        <p style={{ color:C.red, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>⚠️ Watch Out For</p>
        {topicData.traps.slice(0,3).map((t,i)=>(
          <p key={i} style={{ color:C.textMid, fontSize:12, margin:'5px 0', lineHeight:1.5 }}>• {t}</p>
        ))}
      </div>

      {error && <p style={{ color:C.red, textAlign:'center', margin:'12px 0' }}>{error}</p>}
      <div style={{ textAlign:'center', marginTop:16 }}>
        <button onClick={generate} style={{
          padding:'12px 32px', borderRadius:10, border:'none', cursor:'pointer',
          background:`linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color:'#07090F',
          fontWeight:700, fontSize:14, fontFamily:'Georgia,serif', letterSpacing:'0.02em',
          boxShadow:`0 4px 16px ${C.gold}44`, transition:'all 0.2s',
        }}>Generate Practice ⚡</button>
      </div>
    </div>
  );

  // ─── LOADING ───
  if(loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 20px', gap:16 }}>
      <div style={{ width:52, height:52, border:`3px solid ${C.border}`, borderTop:`3px solid ${C.gold}`, borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
      <p style={{ color:C.gold, fontSize:16, fontWeight:700, fontFamily:'Georgia,serif' }}>Generating {topicData.label}...</p>
      <div style={{ display:'flex', gap:8 }}>
        {['⚖️ 5 QC','📝 3 MC','✏️ 2 NE'].map(s=>(
          <span key={s} style={tag(C.textDim)}>{s}</span>
        ))}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ─── Score calc ───
  let correct=0, total=0;
  if(checked){
    qs.qc.forEach(q=>{ total++; if(qcA[q.id]===q.answer)correct++; });
    qs.mc.forEach(q=>{ total++; if(mcA[q.id]===q.answer)correct++; });
    qs.ne.forEach(q=>{ total++; if(String(neA[q.id]).trim()===String(q.answer).trim())correct++; });
  }
  let qNum=0;

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:22 }}>{topicData.icon}</span>
            <h3 style={{ fontFamily:'Georgia,serif', fontSize:18, color:C.gold, margin:0 }}>{topicData.label}</h3>
          </div>
          <p style={{ color:C.textDim, fontSize:11, margin:'2px 0 0' }}>AI-generated · {qs.qc.length+qs.mc.length+qs.ne.length} questions</p>
        </div>
        {checked ? <ProgressRing correct={correct} total={total}/> : (
          <button onClick={()=>{ setQs(null); }} style={{ padding:'6px 16px', borderRadius:6, border:`1px solid ${C.border}`, background:'transparent', color:C.textMid, cursor:'pointer', fontSize:12 }}>↺ New Set</button>
        )}
      </div>

      {/* QC Section */}
      <div style={sectionLabel(C.blue)}>
        <span style={{ fontSize:16 }}>⚖️</span>
        <span style={{ color:C.blue, fontSize:13, fontWeight:700 }}>Quantitative Comparison</span>
        <span style={{ color:C.textDim, fontSize:11, marginLeft:4 }}>({qs.qc.length})</span>
      </div>
      {qs.qc.map(q=>{ qNum++; return <QCCard key={q.id} q={q} num={qNum} answer={qcA[q.id]} onAnswer={a=>setQCA(p=>({...p,[q.id]:a}))} checked={checked}/>; })}

      {/* MC Section */}
      <div style={sectionLabel(C.gold)}>
        <span style={{ fontSize:16 }}>📝</span>
        <span style={{ color:C.gold, fontSize:13, fontWeight:700 }}>Multiple Choice</span>
        <span style={{ color:C.textDim, fontSize:11, marginLeft:4 }}>({qs.mc.length})</span>
      </div>
      {qs.mc.map(q=>{ qNum++; return <MCCard key={q.id} q={q} num={qNum} answer={mcA[q.id]} onAnswer={a=>setMCA(p=>({...p,[q.id]:a}))} checked={checked}/>; })}

      {/* NE Section */}
      <div style={sectionLabel(C.greenBr)}>
        <span style={{ fontSize:16 }}>✏️</span>
        <span style={{ color:C.greenBr, fontSize:13, fontWeight:700 }}>Numeric Entry</span>
        <span style={{ color:C.textDim, fontSize:11, marginLeft:4 }}>({qs.ne.length})</span>
      </div>
      {qs.ne.map(q=>{ qNum++; return <NECard key={q.id} q={q} num={qNum} answer={neA[q.id]} onAnswer={a=>setNEA(p=>({...p,[q.id]:a}))} checked={checked}/>; })}

      {/* Submit / Results */}
      <div style={{ textAlign:'center', padding:'28px 0 40px' }}>
        {!checked ? (
          <button onClick={submit} style={{
            padding:'14px 40px', borderRadius:10, border:'none', cursor:'pointer',
            background:`linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color:'#07090F',
            fontWeight:700, fontSize:15, fontFamily:'Georgia,serif',
            boxShadow:`0 4px 16px ${C.gold}44`, transition:'all 0.2s',
          }}>Check All Answers →</button>
        ) : (
          <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
            <button onClick={generate} style={{
              padding:'12px 28px', borderRadius:8, border:`1px solid ${C.border}`,
              background:'transparent', color:C.textMid, cursor:'pointer', fontSize:13, fontWeight:600,
            }}>↺ New Practice</button>
            <button style={{
              padding:'12px 28px', borderRadius:8, border:'none',
              background:correct/total>=0.8?C.green+'33':correct/total>=0.5?C.gold+'33':C.red+'33',
              color:correct/total>=0.8?C.greenBr:correct/total>=0.5?C.gold:C.red,
              fontSize:13, fontWeight:700, cursor:'default',
            }}>✓ {correct}/{total} correct — {Math.round(correct/total*100)}%</button>
          </div>
        )}
      </div>
    </div>
  );
}
