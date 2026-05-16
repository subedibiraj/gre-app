import { useState } from 'react';
import C from '../../theme';
import { CONCEPTS, STRATEGIES } from '../../data/quant-concepts';
import Card from '../../components/Card';
import Tag from '../../components/Tag';

const freqColor = { 'Very High': C.red, 'High': C.gold, 'Medium': C.blue };

function ConceptCard({ concept, idx }) {
  const [open, setOpen] = useState(false);
  const [exIdx, setExIdx] = useState(0);

  return (
    <Card style={{ marginBottom: 14, borderLeft: `3px solid ${freqColor[concept.freq] || C.gold}`, cursor: 'pointer' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, color: C.textDim, width: 20 }}>{idx + 1}</span>
        <div style={{ flex: 1 }}>
          <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{concept.title}</p>
          <p style={{ color: C.textMid, fontSize: 11, margin: '2px 0 0' }}>{concept.core.slice(0, 80)}...</p>
        </div>
        <Tag color={freqColor[concept.freq]}>{concept.freq}</Tag>
        <span style={{ color: C.textDim, fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : '' }}>▼</span>
      </div>

      {open && (
        <div style={{ marginTop: 14, animation: 'fadeIn 0.2s ease-out' }}>
          {/* Core Concept */}
          <p style={{ color: C.text, fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>{concept.core}</p>

          {/* Key Rules */}
          <div style={{ background: C.surface, borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>📐 Key Rules</p>
            {concept.rules.map((r, i) => (
              <p key={i} style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: '4px 0', paddingLeft: 12, borderLeft: `2px solid ${C.border}` }}>{r}</p>
            ))}
          </div>

          {/* Worked Examples */}
          <div style={{ background: C.bg, borderRadius: 8, padding: 14, marginBottom: 12, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <p style={{ color: C.greenBr, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>✎ Worked Examples</p>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                {concept.examples.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setExIdx(i); }} style={{
                    width: 24, height: 24, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    fontFamily: 'Courier New,monospace', fontSize: 11, fontWeight: 700,
                    background: exIdx === i ? C.gold : C.surface, color: exIdx === i ? '#07090F' : C.textMid,
                  }}>{i + 1}</button>
                ))}
              </div>
            </div>

            {concept.examples[exIdx] && (() => {
              const ex = concept.examples[exIdx];
              return (
                <div>
                  <p style={{ color: C.text, fontSize: 13, fontWeight: 600, lineHeight: 1.7, marginBottom: 8 }}>Q: {ex.q}</p>
                  <div style={{ background: C.surface, borderRadius: 6, padding: 10, marginBottom: 8 }}>
                    <p style={{ color: C.textMid, fontSize: 12, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>{ex.work}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Tag color={C.greenBr}>Answer: {ex.ans}</Tag>
                    <p style={{ color: C.gold, fontSize: 11, margin: 0, fontStyle: 'italic' }}>💡 {ex.trick}</p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Traps */}
          <div style={{ background: C.redBg, borderRadius: 8, padding: 12, border: `1px solid ${C.red}22` }}>
            <p style={{ color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>⚠️ Common Traps</p>
            {concept.traps.map((t, i) => (
              <p key={i} style={{ color: C.textMid, fontSize: 12, lineHeight: 1.6, margin: '4px 0' }}>• {t}</p>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function StrategyCard({ strategy }) {
  const [open, setOpen] = useState(false);
  return (
    <Card onClick={() => setOpen(o => !o)} style={{ marginBottom: 10, cursor: 'pointer', borderLeft: `3px solid ${C.gold}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0, flex: 1 }}>{strategy.name}</p>
        <Tag color={strategy.level === '170 essential' ? C.greenBr : C.blue}>{strategy.level}</Tag>
        <span style={{ color: C.textDim, fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : '' }}>▼</span>
      </div>
      {open && (
        <div style={{ marginTop: 10, animation: 'fadeIn 0.2s ease-out' }}>
          <p style={{ color: C.gold, fontSize: 11, fontWeight: 600, marginBottom: 6 }}>When to use: {strategy.when}</p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>{strategy.how}</p>
          <div style={{ background: C.surface, borderRadius: 6, padding: 10 }}>
            <p style={{ color: C.textDim, fontSize: 10, marginBottom: 4, fontWeight: 700 }}>EXAMPLE</p>
            <pre style={{ color: C.text, fontSize: 12, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'Courier New,monospace' }}>{strategy.example}</pre>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ConceptLearn({ topicId }) {
  const concepts = CONCEPTS[topicId] || [];
  const [showStrategies, setShowStrategies] = useState(false);

  return (
    <div>
      {/* Strategy toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setShowStrategies(false)} style={{
          padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
          fontWeight: 700, fontSize: 12, transition: 'all 0.15s',
          background: !showStrategies ? C.gold : C.surface, color: !showStrategies ? '#07090F' : C.textMid,
        }}>📚 Concepts ({concepts.length})</button>
        <button onClick={() => setShowStrategies(true)} style={{
          padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
          fontWeight: 700, fontSize: 12, transition: 'all 0.15s',
          background: showStrategies ? C.gold : C.surface, color: showStrategies ? '#07090F' : C.textMid,
        }}>⚡ 170 Strategies ({STRATEGIES.length})</button>
      </div>

      {!showStrategies ? (
        <>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 14, lineHeight: 1.6 }}>
            Tap each concept to expand. Study the rules, work through examples, and memorize the traps.
          </p>
          {concepts.map((c, i) => <ConceptCard key={c.title} concept={c} idx={i} />)}
        </>
      ) : (
        <>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 14, lineHeight: 1.6 }}>
            These strategies separate 160 scorers from 170 scorers. Master all of them.
          </p>
          {STRATEGIES.map(s => <StrategyCard key={s.name} strategy={s} />)}
        </>
      )}
    </div>
  );
}
