import { useState } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { clusterColor } from '../utils';
import { getSRLevel } from '../engine/spaced';
import Card from '../components/Card';
import Tag from '../components/Tag';
import SectionHead from '../components/SectionHead';
import Btn from '../components/Btn';

// ─── Tab Switcher ─────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div className="tab-scroll" style={{
      display: 'flex', gap: 2, background: C.surface,
      borderRadius: 10, padding: 4, marginBottom: 20,
      width: '100%', overflowX: 'auto',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontWeight: 700, fontSize: 11, transition: 'all 0.18s', whiteSpace: 'nowrap',
          background: active === t.id
            ? `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`
            : 'transparent',
          color: active === t.id ? '#07090F' : C.textMid,
          boxShadow: active === t.id ? `0 2px 8px ${C.gold}33` : 'none',
        }}>{t.icon} {t.label}</button>
      ))}
    </div>
  );
}

// ─── TC Patterns Panel ────────────────────────────────────────────────────────
function TCPatternsPanel({ day }) {
  const d = DAYS[day - 1];
  if (!d?.patterns?.length) return (
    <p style={{ color: C.textDim, fontSize: 13, padding: '20px 0' }}>No TC patterns available for this day.</p>
  );
  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${C.blue}10, transparent)`,
        border: `1px solid ${C.blue}22`, borderRadius: 10,
        padding: '12px 16px', marginBottom: 20,
      }}>
        <p style={{ color: C.blue, fontSize: 12, fontWeight: 700, margin: '0 0 4px' }}>
          🎯 Text Completion Strategy
        </p>
        <p style={{ color: C.textMid, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
          Spot the <strong style={{ color: C.gold }}>pivot word</strong> first (despite/although/yet/surprisingly/while),
          determine blank direction (+/−), then find the word from this cluster that fits.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {d.patterns.map((p, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, padding: '14px 16px',
            background: C.card, borderRadius: 10,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.gold}`,
          }}>
            <span style={{
              fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 800,
              color: C.goldDim, minWidth: 24, lineHeight: 1.4,
            }}>{i + 1}</span>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.75, margin: 0 }}>{p}</p>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 16, background: C.surface, borderRadius: 8,
        padding: '10px 14px', border: `1px solid ${C.border}`,
      }}>
        <p style={{ color: C.textDim, fontSize: 11, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: C.gold }}>Practice tip:</strong> Switch to the ⚔️ Practice tab
          and attempt the TC section. These patterns are the blueprint for every blank.
        </p>
      </div>
    </div>
  );
}

// ─── SE Strategy Panel ────────────────────────────────────────────────────────
function SEStrategyPanel({ day }) {
  const d = DAYS[day - 1];

  return (
    <div>
      {/* Rule box */}
      <div style={{
        background: `linear-gradient(135deg, ${C.gold}15, transparent)`,
        border: `1px solid ${C.gold}33`,
        borderRadius: 10, padding: '14px 18px', marginBottom: 20,
      }}>
        <p style={{ color: C.gold, fontSize: 12, fontWeight: 700, margin: '0 0 6px' }}>
          ⚡ The SE Rule — Read This Every Day
        </p>
        <p style={{ color: C.textMid, fontSize: 12, margin: 0, lineHeight: 1.7 }}>
          Sentence Equivalence requires <strong style={{ color: C.text }}>exactly 2 answers</strong> that are
          semantic twins — both fit grammatically AND produce sentences alike in meaning.{' '}
          <strong style={{ color: C.red }}>1 correct answer = 0 points.</strong> You must find the pair.
        </p>
      </div>

      {/* Twin pairs */}
      {d?.seStrategy?.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {d.seStrategy.map((s, i) => {
            const isTwinPair = s.includes('↔');
            const isTrap = s.toLowerCase().includes('not ') || s.toLowerCase().includes('never') || s.toLowerCase().includes('trap');
            const borderColor = isTrap ? C.red : isTwinPair ? C.greenBr : C.blue;
            const icon = isTrap ? '⚠️' : isTwinPair ? '✓' : '💡';

            return (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '14px 18px',
                background: C.card, borderRadius: 10,
                border: `1px solid ${borderColor}22`,
                borderLeft: `3px solid ${borderColor}`,
              }}>
                <span style={{ fontSize: 16, minWidth: 22, lineHeight: 1.4 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  {isTwinPair ? (
                    <p style={{ color: C.text, fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                      {s.split('↔').map((part, pi) => {
                        const trimmed = part.trim();
                        const wordMatch = trimmed.match(/^([A-Z][A-Za-z/\s-]+)/);
                        const rest = wordMatch ? trimmed.slice(wordMatch[0].length) : trimmed;
                        return (
                          <span key={pi}>
                            {pi > 0 && (
                              <span style={{ color: C.gold, fontWeight: 700, margin: '0 8px', fontSize: 14 }}>↔</span>
                            )}
                            {wordMatch && (
                              <span style={{
                                fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 13,
                                color: C.greenBr, background: C.green + '15',
                                padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em',
                              }}>{wordMatch[0].trim()}</span>
                            )}
                            <span style={{ color: C.textMid, fontSize: 12 }}>{rest}</span>
                          </span>
                        );
                      })}
                    </p>
                  ) : (
                    <p style={{ color: C.text, fontSize: 13, lineHeight: 1.75, margin: 0 }}>{s}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 16px', color: C.textDim, fontSize: 13 }}>
          <p>SE strategy notes will appear here once available for this day.</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>The core rule above always applies.</p>
        </div>
      )}

      <div style={{
        marginTop: 16, background: C.surface, borderRadius: 8,
        padding: '10px 14px', border: `1px solid ${C.border}`,
      }}>
        <p style={{ color: C.textDim, fontSize: 11, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: C.gold }}>Test yourself:</strong> Before looking at SE answer choices,
          predict what kind of word fills the blank. If you can name the twin pair in advance,
          you'll solve the question in seconds.
        </p>
      </div>
    </div>
  );
}

// ─── Word Card ────────────────────────────────────────────────────────────────
function WordCard({ v, displayDay, isOpen, onToggle }) {
  const cc = clusterColor(v.cluster);
  const isToday = displayDay.words.some(w => w.w === v.w);
  const sr = getSRLevel(v.w);

  return (
    <div onClick={onToggle} style={{ marginBottom: 8, cursor: 'pointer' }}>
      <div style={{
        background: isOpen ? C.cardHi : C.card,
        border: `1px solid ${isOpen ? cc + '66' : C.border}`,
        borderRadius: 10, padding: '14px 14px', transition: 'all 0.2s',
        minHeight: 56,  // mobile tap target
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 34, background: cc, borderRadius: 2, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'Courier New,monospace', fontSize: 15, fontWeight: 700,
                color: cc, letterSpacing: '0.08em',
              }}>{v.w}</span>
              <Tag color={cc}>{v.pos}</Tag>
              <Tag color={cc}>{v.cluster}</Tag>
              {!isToday && (
                <Tag color={C.textDim}>
                  Day {DAYS.findIndex(d => d.words.some(w => w.w === v.w)) + 1}
                </Tag>
              )}
              <Tag color={sr.color}>{sr.label}</Tag>
            </div>
            {!isOpen && (
              <p style={{ color: C.textMid, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{v.def}</p>
            )}
          </div>
          <span style={{ color: C.textDim, fontSize: 16, flexShrink: 0, padding: '4px 6px', minHeight: 36, display: 'flex', alignItems: 'center' }}>
            {isOpen ? '▲' : '▼'}
          </span>
        </div>

        {isOpen && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
            <p style={{ color: C.text, fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>{v.def}</p>

            <div style={{
              background: C.surface, borderRadius: 8, padding: '12px 14px', marginBottom: 10,
            }}>
              <p style={{
                fontSize: 10, color: C.textDim, textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: 6,
              }}>Example Sentence</p>
              <p style={{
                color: C.text, fontSize: 13, fontStyle: 'italic',
                lineHeight: 1.75, margin: 0,
              }}>"{v.ex}"</p>
            </div>

            {v.tip && (
              <div style={{
                background: C.goldDim + '28', borderRadius: 8, padding: '10px 14px',
                borderLeft: `3px solid ${C.gold}`,
              }}>
                <span style={{ fontSize: 10, color: C.gold, fontWeight: 700 }}>★ GRE TIP  </span>
                <span style={{ color: C.goldBr, fontSize: 12, lineHeight: 1.65 }}>{v.tip}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Words Panel ─────────────────────────────────────────────────────────────
function WordsPanel({ day, showAll, setShowAll }) {
  const [expanded, setExpanded] = useState(null);
  const [clusterFilter, setFilter] = useState('All');

  const displayDay = DAYS[day - 1];
  const prevWords = DAYS.slice(0, day - 1).flatMap(d => d.words);
  const words = showAll ? [...displayDay.words, ...prevWords] : displayDay.words;
  const clusters = ['All', ...new Set(words.map(w => w.cluster))];
  const visible = clusterFilter === 'All' ? words : words.filter(w => w.cluster === clusterFilter);

  return (
    <>
      {/* Cluster filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {clusters.map(cl => (
          <button key={cl} onClick={() => setFilter(cl)} style={{
            padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            background: clusterFilter === cl ? C.gold : C.surface,
            color: clusterFilter === cl ? '#07090F' : C.textMid,
          }}>{cl}</button>
        ))}
      </div>

      {visible.map(v => (
        <WordCard
          key={v.w}
          v={v}
          displayDay={displayDay}
          isOpen={expanded === v.w}
          onToggle={() => setExpanded(expanded === v.w ? null : v.w)}
        />
      ))}
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function VocabView({ day }) {
  const [tab, setTab] = useState('words');
  const [showAll, setShowAll] = useState(false);

  const displayDay = DAYS[day - 1];

  const TABS = [
    { id: 'words',    icon: '📖', label: 'Words' },
    { id: 'patterns', icon: '🎯', label: 'TC Patterns' },
    { id: 'se',       icon: '⚡', label: 'SE Strategy' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <SectionHead
            label={`Day ${day}: ${displayDay?.theme}`}
            count={`${displayDay?.words?.length || 0} words`}
            color={C.goldBr}
          />
          {displayDay?.date && (
            <p style={{ color: C.textDim, fontSize: 11, margin: '4px 0 0' }}>{displayDay.date}</p>
          )}
        </div>
        {day > 1 && (
          <Btn small variant={showAll ? 'blue' : 'ghost'}
            onClick={() => { setShowAll(s => !s); setTab('words'); }}>
            {showAll ? `All ${DAYS.slice(0, day).flatMap(d => d.words).length} words` : '+ All prev days'}
          </Btn>
        )}
      </div>

      {/* Panel tabs */}
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {/* Content */}
      {tab === 'words'    && <WordsPanel day={day} showAll={showAll} setShowAll={setShowAll} />}
      {tab === 'patterns' && <TCPatternsPanel day={day} />}
      {tab === 'se'       && <SEStrategyPanel day={day} />}
    </div>
  );
}
