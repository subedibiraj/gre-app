import { useState } from 'react';
import C from '../../theme';
import { FORMULAS } from '../../data/formulas';
import Card from '../../components/Card';
import SectionHead from '../../components/SectionHead';

const catColors = { Arithmetic: '#2B6FBF', Algebra: '#E4A060', Geometry: '#2EBB80', 'Data Analysis': '#9B6BDB' };

export default function FormulaSheet() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const categories = ['All', ...FORMULAS.map(f => f.category)];
  const visible = FORMULAS
    .filter(g => filter === 'All' || g.category === filter)
    .map(g => ({
      ...g,
      formulas: g.formulas.filter(f =>
        !search || f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.formula.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(g => g.formulas.length > 0);

  return (
    <div>
      <SectionHead label="Formula Sheet" count={`${FORMULAS.reduce((a, g) => a + g.formulas.length, 0)} formulas`} color={C.goldBr} />
      <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
        Every formula you need for GRE Quant. Tap any card to see usage notes.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            background: filter === cat ? C.gold : C.surface,
            color: filter === cat ? '#07090F' : C.textMid,
          }}>{cat}</button>
        ))}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search formulas..."
          style={{
            marginLeft: 'auto', padding: '6px 14px', borderRadius: 6,
            border: `1px solid ${C.border}`, background: C.surface, color: C.text,
            fontSize: 12, outline: 'none', width: 180,
          }}
        />
      </div>

      {/* Formula cards */}
      {visible.map(group => {
        const color = catColors[group.category] || C.gold;
        return (
          <div key={group.category} style={{ marginBottom: 24 }}>
            <p style={{ color, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              {group.category}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
              {group.formulas.map(f => {
                const isOpen = expanded === f.name;
                return (
                  <Card key={f.name}
                    onClick={() => setExpanded(isOpen ? null : f.name)}
                    style={{
                      cursor: 'pointer', borderLeft: `3px solid ${color}`,
                      background: isOpen ? C.cardHi : C.card, transition: 'all 0.2s',
                    }}>
                    <p style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{f.name}</p>
                    <p style={{
                      fontFamily: 'Courier New,monospace', fontSize: 14, color,
                      fontWeight: 700, margin: 0, lineHeight: 1.5,
                    }}>{f.formula}</p>
                    {isOpen && (
                      <p style={{
                        marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`,
                        color: C.textMid, fontSize: 12, lineHeight: 1.5, margin: '8px 0 0',
                      }}>
                        💡 {f.note}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
