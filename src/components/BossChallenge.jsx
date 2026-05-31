import { useState, useMemo, useEffect } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { updateWordSR } from '../engine/spaced';
import { addXP, XP_VALUES } from '../engine/xp';
import Card from '../components/Card';
import Tag from '../components/Tag';
import Btn from '../components/Btn';

// ─── helpers ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Boss config ──────────────────────────────────────────────────────────────
export const BOSSES = [
  { id: 'boss_2', afterDay: 2, name: 'The Silence Keeper',   emoji: '🤫', days: [1, 2], xp: 150 },
  { id: 'boss_4', afterDay: 4, name: 'The Word Weaver',      emoji: '🕸️', days: [1, 2, 3, 4], xp: 200 },
  { id: 'boss_7', afterDay: 7, name: 'The Grand Lexiconer',  emoji: '📜', days: [1, 2, 3, 4, 5, 6, 7], xp: 350 },
];

export function getBossStatus(dayNum) {
  // Returns bosses that are available (dayNum reached) but not yet beaten
  return BOSSES.filter(b => {
    if (dayNum < b.afterDay) return false;
    try {
      const result = JSON.parse(localStorage.getItem(`gre_boss_${b.id}`));
      return !result?.beaten;
    } catch { return true; }
  });
}

export function markBossBeaten(bossId, score, total) {
  localStorage.setItem(`gre_boss_${bossId}`, JSON.stringify({
    beaten: score / total >= 0.8,
    score, total,
    date: new Date().toISOString(),
  }));
}

export function getBossResult(bossId) {
  try { return JSON.parse(localStorage.getItem(`gre_boss_${bossId}`)); }
  catch { return null; }
}

// ─── Build 10 mixed questions from boss's day range ───────────────────────────
function buildBossQuestions(boss) {
  const words = shuffle(DAYS.filter(d => boss.days.includes(d.day)).flatMap(d => d.words));
  const pool  = words.slice(0, 10);
  const all   = DAYS.flatMap(d => d.words);

  return pool.map((word, i) => {
    // Mix question types: def recall, SE-style (2 synonyms), TC-style (fill in)
    const type = i % 3 === 0 ? 'se_pair' : i % 3 === 1 ? 'definition' : 'definition';
    const distractors = shuffle(all.filter(w => w.w !== word.w)).slice(0, 3);

    if (type === 'se_pair') {
      // Find a real synonym from same cluster
      const synonym = all.find(w => w.cluster === word.cluster && w.w !== word.w);
      if (!synonym) {
        // fall back to definition
        const opts = shuffle([
          { l: 'A', t: word.def, correct: true },
          ...distractors.map((d, di) => ({ l: String.fromCharCode(66 + di), t: d.def, correct: false })),
        ]).map((o, idx) => ({ ...o, l: String.fromCharCode(65 + idx) }));
        return { id: i, type: 'definition', word: word.w, cluster: word.cluster, answer: opts.find(o => o.correct).l, opts, tip: word.tip };
      }
      const pool2 = shuffle(all.filter(w => w.cluster !== word.cluster)).slice(0, 4);
      const opts = shuffle([
        { l: 'A', t: word.w, correct: true },
        { l: 'B', t: synonym.w, correct: true },
        ...pool2.slice(0, 4).map((w, di) => ({ l: String.fromCharCode(67 + di), t: w.w, correct: false })),
      ]).slice(0, 6).map((o, idx) => ({ ...o, l: String.fromCharCode(65 + idx) }));
      const answers = opts.filter(o => o.correct).map(o => o.l);
      return { id: i, type: 'se_pair', word: word.w, cluster: word.cluster, stem: word.def, answers, opts, tip: word.tip };
    }

    // definition question
    const opts = shuffle([
      { l: 'A', t: word.def, correct: true },
      ...distractors.map((d, di) => ({ l: String.fromCharCode(66 + di), t: d.def, correct: false })),
    ]).map((o, idx) => ({ ...o, l: String.fromCharCode(65 + idx) }));
    return { id: i, type: 'definition', word: word.w, cluster: word.cluster, answer: opts.find(o => o.correct).l, opts, tip: word.tip };
  });
}

// ─── HP Bar ───────────────────────────────────────────────────────────────────
function HPBar({ hp, maxHp, color, label }) {
  const pct = hp / maxHp;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
        <span style={{ fontFamily: 'Courier New,monospace', fontSize: 11, color }}>{hp}/{maxHp}</span>
      </div>
      <div style={{ height: 10, background: C.border, borderRadius: 5, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 5,
          width: `${pct * 100}%`,
          background: `linear-gradient(90deg, ${color}, ${color}CC)`,
          transition: 'width 0.4s ease',
          boxShadow: `0 0 8px ${color}88`,
        }} />
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function BossChallenge({ boss, onClose }) {
  const questions = useMemo(() => buildBossQuestions(boss), [boss]);

  const [phase, setPhase]       = useState('intro'); // intro | fight | result
  const [qIdx, setQIdx]         = useState(0);
  const [seSelected, setSeSelected] = useState([]);
  const [defSelected, setDefSelected] = useState(null);
  const [answers, setAnswers]   = useState([]);
  const [bossHp, setBossHp]     = useState(10);
  const [playerHp, setPlayerHp] = useState(10);
  const [flash, setFlash]       = useState(null); // 'hit' | 'miss'
  const [combo, setCombo]       = useState(0);
  const [lastCombo, setLastCombo] = useState(0);

  const q = questions[qIdx];
  const PASS_THRESHOLD = 0.8;

  const submitAnswer = (isCorrect) => {
    const newAnswers = [...answers, { word: q.word, correct: isCorrect }];
    setAnswers(newAnswers);
    updateWordSR(q.word, isCorrect);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > lastCombo) setLastCombo(newCombo);
      setBossHp(hp => Math.max(0, hp - 1));
      setFlash('hit');
    } else {
      setCombo(0);
      setPlayerHp(hp => Math.max(0, hp - 1));
      setFlash('miss');
    }

    setTimeout(() => {
      setFlash(null);
      setDefSelected(null);
      setSeSelected([]);
      if (qIdx + 1 >= questions.length) {
        const score = newAnswers.filter(a => a.correct).length;
        const beaten = score / questions.length >= PASS_THRESHOLD;
        markBossBeaten(boss.id, score, questions.length);
        if (beaten) addXP(boss.xp, `Boss defeated: ${boss.name}`);
        setPhase('result');
      } else {
        setQIdx(i => i + 1);
      }
    }, beaten => { }, 650);
  };

  const handleDefAnswer = (l) => {
    if (defSelected !== null) return;
    setDefSelected(l);
    const correct = l === q.answer;
    setTimeout(() => submitAnswer(correct), 500);
  };

  const handleSeToggle = (l) => {
    if (seSelected.length === 2 && !seSelected.includes(l)) return;
    setSeSelected(s => s.includes(l) ? s.filter(x => x !== l) : [...s, l]);
  };

  const handleSeSubmit = () => {
    const correct = seSelected.length === q.answers.length &&
      q.answers.every(a => seSelected.includes(a)) &&
      seSelected.every(a => q.answers.includes(a));
    submitAnswer(correct);
  };

  const score = answers.filter(a => a.correct).length;
  const beaten = phase === 'result' && score / questions.length >= PASS_THRESHOLD;

  // ─── INTRO ────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    const prevResult = getBossResult(boss.id);
    return (
      <div style={overlay}>
        <div style={{ ...panel, maxWidth: 440 }}>
          <div style={{ padding: '28px 24px', textAlign: 'center' }}>
            {/* Boss reveal */}
            <div style={{
              width: 88, height: 88, borderRadius: '50%', margin: '0 auto 16px',
              background: `radial-gradient(circle, ${C.red}44, ${C.red}11)`,
              border: `2px solid ${C.red}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, boxShadow: `0 0 32px ${C.red}44`,
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              {boss.emoji}
            </div>
            <p style={{ color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' }}>
              Boss Challenge Unlocked
            </p>
            <h2 style={{ fontFamily: 'Georgia,serif', color: C.text, fontSize: 22, margin: '0 0 6px' }}>{boss.name}</h2>
            <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 20px' }}>
              Days {boss.days[0]}–{boss.days[boss.days.length - 1]} · {questions.length} questions · Need 80% to win
            </p>

            <div style={{ background: C.surface, borderRadius: 10, padding: '14px 16px', marginBottom: 20, textAlign: 'left' }}>
              <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>Challenge rules</p>
              {[
                '⚔️  Mixed question types: definitions + SE synonym pairs',
                '💥  Score 80%+ to defeat the boss and earn bonus XP',
                `🏆  Reward: +${boss.xp} XP + Boss Badge`,
                prevResult?.beaten ? '🔁  You\'ve beaten this boss — try again for fun!' : '⚠️  Falling below 80% means the boss wins — try again tomorrow',
              ].map((r, i) => (
                <p key={i} style={{ color: C.textMid, fontSize: 12, margin: '4px 0', lineHeight: 1.5 }}>{r}</p>
              ))}
            </div>

            {prevResult && (
              <div style={{
                background: prevResult.beaten ? `${C.green}15` : `${C.red}15`,
                border: `1px solid ${prevResult.beaten ? C.green : C.red}33`,
                borderRadius: 8, padding: '8px 14px', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>{prevResult.beaten ? '🏆' : '💀'}</span>
                <p style={{ color: prevResult.beaten ? C.greenBr : C.red, fontSize: 12, margin: 0 }}>
                  {prevResult.beaten ? `Previously beaten: ${prevResult.score}/${prevResult.total}` : `Last attempt: ${prevResult.score}/${prevResult.total} — Retry!`}
                </p>
              </div>
            )}

            <button onClick={() => setPhase('fight')} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.red}, #D4504A)`,
              color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'Georgia,serif',
              boxShadow: `0 4px 20px ${C.red}44`,
            }}>
              ⚔️ Fight {boss.name}
            </button>
            <button onClick={onClose} style={{ marginTop: 8, width: '100%', padding: 8, background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 12 }}>
              Not now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── FIGHT ────────────────────────────────────────────────────────────────
  if (phase === 'fight') {
    const bgFlash = flash === 'hit' ? `${C.green}22` : flash === 'miss' ? `${C.red}22` : C.card;
    const isSeType = q.type === 'se_pair';

    return (
      <div style={overlay}>
        <div style={{ ...panel, maxWidth: 520, transition: 'background 0.2s', background: bgFlash }}>
          {/* HP bars */}
          <div style={{
            padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
            background: `linear-gradient(135deg, ${C.red}10, transparent)`,
            display: 'flex', gap: 16, alignItems: 'center',
          }}>
            <span style={{ fontSize: 20 }}>{boss.emoji}</span>
            <HPBar hp={bossHp} maxHp={questions.length} color={C.red} label={boss.name} />
            <div style={{ width: 2, height: 32, background: C.border }} />
            <HPBar hp={playerHp} maxHp={questions.length} color={C.greenBr} label="You" />
            <span style={{ fontSize: 16 }}>🧠</span>
          </div>

          <div style={{ padding: '20px 24px' }}>
            {/* Progress + Combo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ color: C.textDim, fontSize: 12 }}>Q{qIdx + 1}/{questions.length}</span>
              <Tag color={C.gold}>{q.cluster}</Tag>
              {combo >= 3 && (
                <div style={{
                  marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                  background: `${C.gold}22`, border: `1px solid ${C.gold}44`,
                  borderRadius: 20, padding: '3px 10px',
                }}>
                  <span style={{ fontSize: 12 }}>🔥</span>
                  <span style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>{combo}× Combo!</span>
                </div>
              )}
            </div>

            {/* Question */}
            {isSeType ? (
              <>
                <div style={{
                  background: C.surface, borderRadius: 10, padding: '14px 16px', marginBottom: 14,
                  borderLeft: `3px solid ${C.gold}`,
                }}>
                  <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px', fontWeight: 700 }}>
                    SE Challenge · Select BOTH words matching:
                  </p>
                  <p style={{ color: C.text, fontSize: 15, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>"{q.stem}"</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {q.opts.map(opt => {
                    const isSel = seSelected.includes(opt.l);
                    return (
                      <button key={opt.l} onClick={() => handleSeToggle(opt.l)} style={{
                        padding: '10px 12px', borderRadius: 8, fontSize: 12,
                        fontFamily: 'Courier New,monospace', fontWeight: isSel ? 700 : 400,
                        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
                        border: `1px solid ${isSel ? C.gold : C.border}`,
                        background: isSel ? C.goldDim + '44' : C.surface,
                        color: isSel ? C.gold : C.textMid,
                      }}>{opt.t}</button>
                    );
                  })}
                </div>
                <button onClick={handleSeSubmit} disabled={seSelected.length !== 2} style={{
                  width: '100%', padding: '11px', borderRadius: 8, border: 'none',
                  cursor: seSelected.length === 2 ? 'pointer' : 'not-allowed',
                  background: seSelected.length === 2 ? `linear-gradient(135deg, ${C.gold}, ${C.goldBr})` : C.border,
                  color: seSelected.length === 2 ? '#07090F' : C.textDim,
                  fontWeight: 700, fontSize: 13,
                }}>
                  {seSelected.length === 2 ? 'Strike! ⚡' : `Select ${2 - seSelected.length} more`}
                </button>
              </>
            ) : (
              <>
                <div style={{
                  textAlign: 'center', padding: '20px 16px', marginBottom: 14,
                  background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
                }}>
                  <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>
                    What does this word mean?
                  </p>
                  <p style={{
                    fontFamily: 'Courier New,monospace', fontSize: 26, fontWeight: 700,
                    color: C.gold, letterSpacing: '0.1em', margin: 0,
                  }}>{q.word}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {q.opts.map((opt) => {
                    const isSel   = defSelected === opt.l;
                    const correct = defSelected !== null && opt.l === q.answer;
                    const wrong   = defSelected !== null && isSel && opt.l !== q.answer;
                    return (
                      <button key={opt.l} onClick={() => handleDefAnswer(opt.l)} disabled={defSelected !== null} style={{
                        padding: '10px 14px', borderRadius: 7, textAlign: 'left', fontSize: 13,
                        cursor: defSelected !== null ? 'default' : 'pointer', transition: 'all 0.15s',
                        border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                        background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                        color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                        fontWeight: isSel || correct ? 700 : 400,
                      }}>
                        <span style={{ color: C.textDim, fontFamily: 'Courier New,monospace', marginRight: 8, fontSize: 11 }}>{opt.l}.</span>
                        {opt.t}
                        {correct && ' ✓'}{wrong && ' ✗'}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Flash messages */}
            {flash === 'hit' && (
              <p style={{ color: C.greenBr, fontWeight: 700, fontSize: 14, textAlign: 'center', marginTop: 10, animation: 'fadeIn 0.1s' }}>
                ⚡ Hit! {combo >= 3 ? `${combo}× Combo!` : ''}
              </p>
            )}
            {flash === 'miss' && (
              <p style={{ color: C.red, fontWeight: 700, fontSize: 14, textAlign: 'center', marginTop: 10, animation: 'fadeIn 0.1s' }}>
                💀 Boss strikes back!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULT ────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const pct = score / questions.length;
    return (
      <div style={overlay}>
        <div style={{ ...panel, maxWidth: 440, textAlign: 'center' }}>
          <div style={{ padding: '28px 24px' }}>
            <p style={{ fontSize: 56, margin: '0 0 8px', animation: 'fadeIn 0.4s' }}>
              {beaten ? '🏆' : '💀'}
            </p>
            <h2 style={{
              fontFamily: 'Georgia,serif', fontSize: 22, margin: '0 0 6px',
              color: beaten ? C.gold : C.red,
            }}>
              {beaten ? `${boss.name} Defeated!` : `${boss.name} Wins...`}
            </h2>
            <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 16px' }}>
              {beaten
                ? `${score}/${questions.length} correct — Crushing performance!`
                : `${score}/${questions.length} — Need ${Math.ceil(questions.length * 0.8)} to win. Retry after more study!`}
            </p>

            {beaten && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: `${C.gold}18`, border: `1px solid ${C.gold}33`,
                borderRadius: 20, padding: '8px 20px', margin: '0 0 20px',
              }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: 16, fontFamily: 'Courier New,monospace' }}>+{boss.xp} XP</span>
              </div>
            )}

            {/* Per-answer breakdown */}
            <div style={{ background: C.surface, borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
              {answers.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: i < answers.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <span style={{ fontSize: 14 }}>{a.correct ? '✅' : '❌'}</span>
                  <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 12, color: a.correct ? C.greenBr : C.red }}>{a.word}</span>
                  {!a.correct && <span style={{ color: C.textDim, fontSize: 11, marginLeft: 'auto' }}>needs review</span>}
                </div>
              ))}
            </div>

            {lastCombo >= 3 && (
              <p style={{ color: C.gold, fontSize: 13, marginBottom: 16 }}>
                🔥 Best combo: {lastCombo}× streak
              </p>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {!beaten && (
                <button onClick={() => {
                  setPhase('fight');
                  setQIdx(0); setAnswers([]);
                  setBossHp(questions.length); setPlayerHp(questions.length);
                  setCombo(0); setLastCombo(0);
                  setDefSelected(null); setSeSelected([]);
                }} style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${C.border}`,
                  background: C.surface, color: C.text, cursor: 'pointer', fontWeight: 700, fontSize: 13,
                }}>Retry ↺</button>
              )}
              <button onClick={onClose} style={{
                flex: 2, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: beaten
                  ? `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`
                  : `${C.surface}`,
                color: beaten ? '#07090F' : C.textMid,
                fontWeight: 700, fontSize: 13,
              }}>
                {beaten ? '→ Back to Studying' : 'Study More First'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const overlay = {
  position: 'fixed', inset: 0, zIndex: 200,
  background: 'rgba(7,9,15,0.92)', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const panel = {
  background: '#111928',
  border: `1px solid #1C2E4A`,
  borderRadius: 16, width: '92%',
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  overflow: 'hidden',
};
