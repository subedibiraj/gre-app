import { useState } from 'react';
import C from '../../theme';
import { CONCEPTS, STRATEGIES } from '../../data/quant-concepts';
import { playPop, hapticTap } from '../../lib/audio';

const freqColor = { 'Very High': C.red, 'High': C.gold, 'Medium': C.blue };
const tag = (color) => ({ display:'inline-flex', padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', background:color+'22', color });

function ConceptCard({ concept, idx }) {
  const [open, setOpen] = useState(false);
  const [exIdx, setExIdx] = useState(0);
  const fc = freqColor[concept.freq] || C.gold;

  return (
    <div className="glass-hover" style={{
      background: C.card, border:`1px solid ${open?fc+'55':C.border}`,
      borderRadius:12, marginBottom:14, overflow:'hidden',
      transition:'all 0.25s', boxShadow: open?`0 4px 20px ${fc}15`:'none',
    }}>
      {/* Header — always visible */}
      <div onClick={()=>{ playPop(); hapticTap(); setOpen(o=>!o); }} style={{
        padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:14,
        background: open?`linear-gradient(135deg, ${fc}12, transparent)`:'transparent',
        transition:'background 0.2s',
      }}>
        <div style={{
          width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
          background:`linear-gradient(135deg, ${fc}33, ${fc}11)`, fontSize:16, fontWeight:700,
          fontFamily:'Courier New,monospace', color:fc,
        }}>{idx+1}</div>
        <div style={{ flex:1 }}>
          <p style={{ color:C.text, fontSize:15, fontWeight:700, margin:0 }}>{concept.title}</p>
          <p style={{ color:C.textMid, fontSize:11, margin:'3px 0 0', lineHeight:1.4 }}>{concept.core.slice(0,90)}...</p>
        </div>
        <span style={tag(fc)}>{concept.freq}</span>
        <span style={{ color:C.textDim, fontSize:14, transition:'transform 0.25s', transform:open?'rotate(180deg)':'', lineHeight:1 }}>▾</span>
      </div>

      {/* Expanded content */}
      {open && (
        <div style={{ padding:'0 20px 20px', animation:'fadeIn 0.25s ease-out' }}>
          {/* Full description */}
          <p style={{ color:C.text, fontSize:13, lineHeight:1.9, marginBottom:16, paddingTop:4 }}>{concept.core}</p>

          {/* Key Rules */}
          <div style={{
            background:`linear-gradient(135deg, ${C.blue}10, transparent)`,
            borderRadius:10, padding:'14px 16px', marginBottom:16,
            border:`1px solid ${C.blue}22`,
          }}>
            <p style={{ color:C.blue, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:14 }}>📐</span> Key Rules
            </p>
            {concept.rules.map((r,i) => (
              <div key={i} style={{ display:'flex', gap:10, marginBottom:6 }}>
                <span style={{ color:C.blue, fontSize:11, fontWeight:700, fontFamily:'Courier New,monospace', minWidth:16, opacity:0.5 }}>{i+1}.</span>
                <p style={{ color:C.text, fontSize:12, lineHeight:1.7, margin:0 }}>{r}</p>
              </div>
            ))}
          </div>

          {/* Worked Examples */}
          <div style={{
            background:C.bg, borderRadius:10, padding:'16px 18px', marginBottom:16,
            border:`1px solid ${C.border}`,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span style={{ fontSize:14 }}>✎</span>
              <p style={{ color:C.greenBr, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', margin:0 }}>Worked Examples</p>
              <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
                {concept.examples.map((_,i) => (
                  <button key={i} onClick={e=>{e.stopPropagation();setExIdx(i)}} style={{
                    width:28, height:28, borderRadius:8, border:'none', cursor:'pointer',
                    fontFamily:'Courier New,monospace', fontSize:12, fontWeight:700, transition:'all 0.15s',
                    background: exIdx===i?`linear-gradient(135deg, ${C.gold}, ${C.goldBr})`:C.surface,
                    color: exIdx===i?'#07090F':C.textMid,
                    boxShadow: exIdx===i?`0 2px 8px ${C.gold}44`:'none',
                  }}>{i+1}</button>
                ))}
              </div>
            </div>

            {concept.examples[exIdx] && (()=>{
              const ex = concept.examples[exIdx];
              return (
                <div>
                  {/* Question */}
                  <div style={{ background:C.card, borderRadius:8, padding:'12px 16px', marginBottom:12, borderLeft:`3px solid ${C.gold}` }}>
                    <p style={{ color:C.gold, fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Question</p>
                    <p style={{ color:C.text, fontSize:14, fontWeight:600, lineHeight:1.7, margin:0, fontFamily:'Georgia,serif' }}>{ex.q}</p>
                  </div>

                  {/* Step-by-step */}
                  <div style={{ background:C.card, borderRadius:8, padding:'12px 16px', marginBottom:12, borderLeft:`3px solid ${C.textDim}` }}>
                    <p style={{ color:C.textDim, fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Step-by-Step</p>
                    <p style={{ color:C.textMid, fontSize:13, lineHeight:1.8, margin:0, whiteSpace:'pre-line' }}>{ex.work}</p>
                  </div>

                  {/* Answer + Trick */}
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'stretch' }}>
                    <div style={{ background:`${C.green}18`, borderRadius:8, padding:'10px 16px', flex:'0 0 auto', display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ color:C.greenBr, fontSize:10, fontWeight:700 }}>ANSWER:</span>
                      <span style={{ color:C.greenBr, fontSize:14, fontWeight:700, fontFamily:'Courier New,monospace' }}>{ex.ans}</span>
                    </div>
                    <div style={{ background:`${C.gold}12`, borderRadius:8, padding:'10px 14px', flex:1, display:'flex', alignItems:'center', gap:6, minWidth:200 }}>
                      <span style={{ fontSize:14 }}>💡</span>
                      <p style={{ color:C.gold, fontSize:12, margin:0, lineHeight:1.5, fontStyle:'italic' }}>{ex.trick}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Traps */}
          <div style={{
            background:`linear-gradient(135deg, ${C.red}10, transparent)`,
            borderRadius:10, padding:'14px 16px',
            border:`1px solid ${C.red}22`,
          }}>
            <p style={{ color:C.red, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:14 }}>⚠️</span> Common GRE Traps
            </p>
            {concept.traps.map((t,i)=>(
              <div key={i} style={{ display:'flex', gap:8, marginBottom:4 }}>
                <span style={{ color:C.red, fontSize:11 }}>✗</span>
                <p style={{ color:C.textMid, fontSize:12, lineHeight:1.6, margin:0 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StrategyCard({ strategy }) {
  const [open, setOpen] = useState(false);
  const isEss = strategy.level==='170 essential';
  const color = isEss?C.greenBr:strategy.level==='Time saver'?C.gold:C.blue;

  return (
    <div className="glass-hover" onClick={()=>{ playPop(); hapticTap(); setOpen(o=>!o); }} style={{
      background:C.card, border:`1px solid ${open?color+'55':C.border}`,
      borderRadius:12, marginBottom:12, cursor:'pointer', overflow:'hidden',
      transition:'all 0.25s', boxShadow:open?`0 4px 20px ${color}15`:'none',
    }}>
      <div style={{
        padding:'16px 20px', display:'flex', alignItems:'center', gap:12,
        background:open?`linear-gradient(135deg, ${color}12, transparent)`:'transparent',
      }}>
        <div style={{
          width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
          background:`linear-gradient(135deg, ${color}33, ${color}11)`, fontSize:16,
        }}>{isEss?'⚡':'💡'}</div>
        <p style={{ color:C.text, fontSize:15, fontWeight:700, margin:0, flex:1 }}>{strategy.name}</p>
        <span style={tag(color)}>{strategy.level}</span>
        <span style={{ color:C.textDim, fontSize:14, transition:'transform 0.25s', transform:open?'rotate(180deg)':'', lineHeight:1 }}>▾</span>
      </div>

      {open && (
        <div style={{ padding:'0 20px 20px', animation:'fadeIn 0.25s ease-out' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {/* When */}
            <div style={{ background:`linear-gradient(135deg, ${C.gold}12, transparent)`, borderRadius:10, padding:'12px 14px', border:`1px solid ${C.gold}22` }}>
              <p style={{ color:C.gold, fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 6px', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14 }}>🎯</span> When to Use
              </p>
              <p style={{ color:C.text, fontSize:13, margin:0, lineHeight:1.5 }}>{strategy.when}</p>
            </div>

            {/* How */}
            <div style={{ background:`linear-gradient(135deg, ${C.blue}12, transparent)`, borderRadius:10, padding:'12px 14px', border:`1px solid ${C.blue}22` }}>
              <p style={{ color:C.blue, fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 6px', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14 }}>🛠️</span> The Playbook
              </p>
              <p style={{ color:C.text, fontSize:13, margin:0, lineHeight:1.5 }}>{strategy.how}</p>
            </div>
          </div>

          {/* Example */}
          <div style={{ background:C.surface, borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
            <p style={{ color:C.greenBr, fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:14 }}>✎</span> Action Breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {strategy.example.split('\n').map((line, i) => {
                if (line.startsWith('Q:') || line.startsWith('Qty ')) {
                  return (
                    <div key={i} style={{ background: C.card, padding: '12px 16px', borderRadius: 8, borderLeft: `3px solid ${C.text}` }}>
                      <p style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: C.text, margin: 0, fontWeight: 600 }}>{line}</p>
                    </div>
                  );
                }
                if (line.includes('Answer:')) {
                  const parts = line.split('Answer:');
                  return (
                    <div key={i} style={{ background: `${C.green}18`, padding: '10px 16px', borderRadius: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                      <p style={{ color: C.textMid, fontSize: 13, margin: 0, flex: 1 }}>{parts[0]}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: C.greenBr, fontSize: 10, fontWeight: 800 }}>ANSWER:</span>
                        <span style={{ color: C.greenBr, fontSize: 14, fontWeight: 700, fontFamily: 'Courier New,monospace' }}>{parts[1].trim()}</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} style={{ padding: '0 8px', borderLeft: `2px dashed ${C.border}`, marginLeft: 8 }}>
                    <p style={{ color: C.textMid, fontSize: 13, margin: 0, lineHeight: 1.6, fontFamily: 'Courier New,monospace' }}>{line}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConceptLearn({ topicId }) {
  const concepts = CONCEPTS[topicId] || [];
  const [mode, setMode] = useState('concepts');

  const topicMap = { arithmetic:'🔢 Arithmetic', algebra:'📐 Algebra', geometry:'📏 Geometry', data:'📊 Data Analysis' };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h3 style={{ fontFamily:'Georgia,serif', fontSize:18, color:C.gold, margin:'0 0 6px' }}>
          {topicMap[topicId]||topicId} — Master the Concepts
        </h3>
        <p style={{ color:C.textMid, fontSize:12, lineHeight:1.6, margin:0 }}>
          Each card contains rules, worked examples with tricks, and common traps. Expand to study.
        </p>
      </div>

      {/* Toggle */}
      <div style={{ display:'flex', gap:6, marginBottom:20, background:C.surface, borderRadius:10, padding:4, width:'fit-content' }}>
        {[
          { id:'concepts', label:`📚 Concepts (${concepts.length})` },
          { id:'strategies', label:`⚡ 170 Strategies (${STRATEGIES.length})` },
        ].map(t=>(
          <button key={t.id} onClick={()=>setMode(t.id)} style={{
            padding:'8px 18px', borderRadius:8, border:'none', cursor:'pointer',
            fontWeight:700, fontSize:12, transition:'all 0.2s',
            background: mode===t.id?`linear-gradient(135deg, ${C.gold}, ${C.goldBr})`:'transparent',
            color: mode===t.id?'#07090F':C.textMid,
            boxShadow: mode===t.id?`0 2px 8px ${C.gold}33`:'none',
          }}>{t.label}</button>
        ))}
      </div>

      {mode==='concepts' ? (
        concepts.map((c,i)=><ConceptCard key={c.title} concept={c} idx={i}/>)
      ) : (
        <>
          <div style={{ background:`linear-gradient(135deg, ${C.greenBr}10, transparent)`, borderRadius:10, padding:'14px 18px', marginBottom:16, border:`1px solid ${C.greenBr}22` }}>
            <p style={{ color:C.greenBr, fontSize:13, fontWeight:600, margin:0, lineHeight:1.6 }}>
              💎 These strategies separate 160-scorers from 170-scorers. They work on every GRE Quant question type.
            </p>
          </div>
          {STRATEGIES.map(s=><StrategyCard key={s.name} strategy={s}/>)}
        </>
      )}
    </div>
  );
}
