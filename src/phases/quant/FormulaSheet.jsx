import { useState } from 'react';
import C from '../../theme';
import { FORMULAS } from '../../data/formulas';

const catColors = { Arithmetic:'#2B6FBF', Algebra:'#E4A060', Geometry:'#2EBB80', 'Data Analysis':'#9B6BDB' };
const catIcons = { Arithmetic:'🔢', Algebra:'📐', Geometry:'📏', 'Data Analysis':'📊' };

export default function FormulaSheet() {
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
                        <p style={{ fontFamily:'Courier New,monospace', fontSize:15, color, fontWeight:700, margin:0, lineHeight:1.4 }}>{f.formula}</p>
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
