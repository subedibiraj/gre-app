import React, { useState } from 'react';
import C from '../../theme';
import { FORMULAS } from '../../data/formulas';
import { InlineMath, BlockMath } from 'react-katex';

// ─── Formula Quick-Test Mode ───────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

function QuickTest({ formulas, onExit }) {
  const pool = shuffle(formulas.filter(f => f.note));
  const [idx, setIdx] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const done = idx >= pool.length;
  const f = pool[idx];

  const answer = (knew) => {
    setResults(r => [...r, { name: f.name, knew }]);
    setRevealed(false);
    setIdx(i => i+1);
  };

  if (done) {
    const score = results.filter(r=>r.knew).length;
    const pct = Math.round(score/results.length*100);
    const forgot = results.filter(r=>!r.knew).map(r=>r.name);
    return (
      <div style={{ maxWidth:520, margin:'0 auto', textAlign:'center', padding:'20px 0' }}>
        <p style={{ fontSize:44, margin:'0 0 12px' }}>{pct>=80?'🎯':pct>=60?'💪':'📚'}</p>
        <p style={{ fontFamily:'Courier New,monospace', fontSize:36, fontWeight:700, color:C.gold, margin:'0 0 6px' }}>
          {score}/{results.length}
        </p>
        <p style={{ color:C.textMid, fontSize:13, marginBottom:20 }}>
          {pct>=80?'Formula recall is strong. Keep it there.':pct>=60?'Good base. The missed ones need one more pass.':'Focus on the missed formulas before the exam.'}
        </p>
        {forgot.length > 0 && (
          <div style={{ background:`${C.red}10`, border:`1px solid ${C.red}22`, borderRadius:10, padding:'14px 18px', marginBottom:20, textAlign:'left' }}>
            <p style={{ color:C.red, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Review These</p>
            {forgot.map(n=>(
              <p key={n} style={{ color:C.textMid, fontSize:12, margin:'4px 0' }}>• {n}</p>
            ))}
          </div>
        )}
        <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
          <button onClick={onExit} style={{ padding:'10px 24px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.textMid, cursor:'pointer', fontSize:13 }}>Back to Sheet</button>
        </div>
      </div>
    );
  }

  const catColors = { Arithmetic:'#2B6FBF', Algebra:'#E4A060', Geometry:'#2EBB80', 'Data Analysis':'#9B6BDB' };
  const fc = catColors[f._category] || C.gold;

  return (
    <div style={{ maxWidth:540, margin:'0 auto' }}>
      {/* Progress */}
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {pool.map((_,i) => (
          <div key={i} style={{
            flex:1, height:4, borderRadius:2, transition:'all 0.2s',
            background: i<idx ? (results[i]?.knew ? C.green : C.red) : i===idx ? C.gold : C.border,
          }}/>
        ))}
      </div>

      <div style={{ background:C.card, border:`1px solid ${revealed?fc+'44':C.border}`, borderRadius:14, padding:'28px 24px', textAlign:'center', minHeight:200, display:'flex', flexDirection:'column', justifyContent:'center', transition:'border-color 0.2s' }}>
        {!revealed ? (
          <>
            <p style={{ color:C.textDim, fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>
              What is the formula for...
            </p>
            <p style={{ color:C.text, fontSize:22, fontWeight:700, fontFamily:'Georgia,serif', margin:'0 0 20px', lineHeight:1.4 }}>
              {f.name}
            </p>
            <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:20, fontSize:10, fontWeight:700, background:fc+'22', color:fc, marginBottom:20 }}>
              {f._category}
            </span>
            <div style={{ display:'flex', justifyContent:'center' }}>
              <button onClick={()=>setRevealed(true)} style={{ padding:'11px 32px', borderRadius:8, border:'none', cursor:'pointer', background:`linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color:'#07090F', fontWeight:700, fontSize:14 }}>
                Reveal Formula
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color:C.textDim, fontSize:12, marginBottom:6 }}>{f.name}</p>
            <p style={{ fontFamily:'Courier New,monospace', fontSize:18, fontWeight:700, color:fc, lineHeight:1.6, margin:'0 0 12px' }}>
              {f.formula}
            </p>
            {f.note && (
              <p style={{ color:C.gold, fontSize:12, fontStyle:'italic', margin:'0 0 20px', lineHeight:1.6 }}>
                💡 {f.note}
              </p>
            )}
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={()=>answer(false)} style={{ padding:'10px 22px', borderRadius:8, border:`1px solid ${C.red}44`, background:`${C.red}18`, color:C.red, cursor:'pointer', fontSize:13, fontWeight:700 }}>✗ Missed it</button>
              <button onClick={()=>answer(true)}  style={{ padding:'10px 22px', borderRadius:8, border:`1px solid ${C.green}44`, background:`${C.green}18`, color:C.greenBr, cursor:'pointer', fontSize:13, fontWeight:700 }}>✓ Got it</button>
            </div>
          </>
        )}
      </div>
      <p style={{ textAlign:'center', color:C.textDim, fontSize:11, marginTop:12 }}>
        {idx+1} of {pool.length} formulas
      </p>
    </div>
  );
}

const catColors = { Arithmetic:'#2B6FBF', Algebra:'#E4A060', Geometry:'#2EBB80', 'Data Analysis':'#9B6BDB' };
const catIcons = { Arithmetic:'🔢', Algebra:'📐', Geometry:'📏', 'Data Analysis':'📊' };

export default function FormulaSheet() {
  const [testMode, setTestMode] = useState(false);

  // For QuickTest: flatten all formulas with category tag
  const allFormulasFlat = FORMULAS.flatMap(g => g.formulas.map(f => ({ ...f, _category: g.category })));

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [mastered, setMastered] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gre_formulaMastered')) || []; }
    catch { return []; }
  });

  const toggleMastered = (name, e) => {
    e.stopPropagation();
    setMastered(prev => {
      const next = prev.includes(name) ? prev.filter(n=>n!==name) : [...prev, name];
      localStorage.setItem('gre_formulaMastered', JSON.stringify(next));
      return next;
    });
  };

  const categories = ['All', ...FORMULAS.map(f => f.category)];
  const totalFormulas = FORMULAS.reduce((a,g) => a+g.formulas.length, 0);
  const visible = FORMULAS
    .filter(g => filter==='All' || g.category===filter)
    .map(g => ({
      ...g,
      formulas: g.formulas.filter(f =>
        !search || f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.formula.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(g => g.formulas.length > 0);

  const visibleCount = visible.reduce((a,g) => a+g.formulas.length, 0);

  if (testMode) return <QuickTest formulas={allFormulasFlat} onExit={() => setTestMode(false)} />;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
          <span style={{ fontSize:28 }}>📋</span>
          <div>
            <h3 style={{ fontFamily:'Georgia,serif', fontSize:20, color:C.gold, margin:0 }}>GRE Quant Formula Sheet</h3>
            <p style={{ color:C.textMid, fontSize:12, margin:0 }}>
              {totalFormulas} formulas · {mastered.length} mastered · {totalFormulas-mastered.length} remaining
            </p>
          </div>
          <button onClick={() => setTestMode(true)} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${C.gold}44`, background:`${C.gold}15`, color:C.gold, cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap', flexShrink:0 }}>
            🧪 Quick Test
          </button>
        </div>
        {/* Progress bar */}
        <div style={{ height:6, background:C.border, borderRadius:3, overflow:'hidden', marginTop:8 }}>
          <div style={{
            height:'100%', borderRadius:3, transition:'width 0.4s',
            background:`linear-gradient(90deg, ${C.green}, ${C.greenBr})`,
            width:`${(mastered.length/Math.max(totalFormulas,1))*100}%`,
          }}/>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        {categories.map(cat => {
          const color = catColors[cat] || C.gold;
          const icon = catIcons[cat] || '';
          return (
            <button key={cat} onClick={()=>setFilter(cat)} style={{
              padding:'6px 14px', borderRadius:8, fontSize:11, fontWeight:700,
              cursor:'pointer', border:'none', transition:'all 0.2s',
              background: filter===cat ? `linear-gradient(135deg, ${color}, ${color}CC)` : C.surface,
              color: filter===cat ? '#fff' : C.textMid,
              boxShadow: filter===cat ? `0 2px 8px ${color}44` : 'none',
            }}>{icon} {cat}</button>
          );
        })}
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Search formulas..."
          style={{
            marginLeft:'auto', padding:'8px 14px', borderRadius:8,
            border:`1px solid ${C.border}`, background:C.surface, color:C.text,
            fontSize:12, outline:'none', width:200, transition:'border-color 0.2s',
          }}
        />
      </div>

      <p style={{ color:C.textDim, fontSize:11, marginBottom:14 }}>
        Showing {visibleCount} formula{visibleCount!==1?'s':''} · Click to expand · ✓ to mark mastered
      </p>

      {/* Formula cards */}
      {visible.map(group => {
        const color = catColors[group.category] || C.gold;
        const icon = catIcons[group.category] || '';
        const groupMastered = group.formulas.filter(f=>mastered.includes(f.name)).length;
        return (
          <div key={group.category} style={{ marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ fontSize:16 }}>{icon}</span>
              <span style={{ color, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>{group.category}</span>
              <span style={{ color:C.textDim, fontSize:10 }}>({groupMastered}/{group.formulas.length} mastered)</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:10 }}>
              {group.formulas.map(f => {
                const isOpen = expanded===f.name;
                const isMastered = mastered.includes(f.name);
                return (
                  <div key={f.name}
                    onClick={()=>setExpanded(isOpen?null:f.name)}
                    style={{
                      background: isOpen ? `linear-gradient(135deg, ${color}12, transparent)` : C.card,
                      border:`1px solid ${isOpen?color+'55':isMastered?C.green+'33':C.border}`,
                      borderLeft:`3px solid ${isMastered?C.green:color}`,
                      borderRadius:10, padding:'14px 16px', cursor:'pointer',
                      transition:'all 0.25s',
                      boxShadow: isOpen?`0 4px 16px ${color}12`:'none',
                      opacity: isMastered&&!isOpen ? 0.7 : 1,
                    }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1 }}>
                        <p style={{ color:isMastered?C.green:C.text, fontSize:13, fontWeight:700, margin:'0 0 4px', textDecoration:isMastered?'line-through':'none' }}>{f.name}</p>
                        {f.latex ? (
                          <div style={{ color, padding: '8px 0' }}>
                            <BlockMath math={f.latex} />
                          </div>
                        ) : (
                          <p style={{ fontFamily:'Courier New,monospace', fontSize:15, color, fontWeight:700, margin:0, lineHeight:1.4 }}>{f.formula}</p>
                        )}
                      </div>
                      <button onClick={(e)=>toggleMastered(f.name,e)} style={{
                        width:32, height:32, borderRadius:8, border:`1px solid ${isMastered?C.green:C.border}`,
                        background:isMastered?C.green+'22':'transparent', cursor:'pointer',
                        color:isMastered?C.greenBr:C.textDim, fontSize:14, transition:'all 0.15s',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>{isMastered?'✓':'○'}</button>
                    </div>
                    {isOpen && f.note && (
                      <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                        <p style={{ color:C.gold, fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>💡 When to Use</p>
                        <p style={{ color:C.textMid, fontSize:12, lineHeight:1.7, margin:0 }}>{f.note}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
