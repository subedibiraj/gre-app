import { useState, useMemo } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { QUANT_TOPICS } from '../data/quant-topics';
import { getStreak } from '../engine/streak';
import { getXP, getLevel } from '../engine/xp';
import { getSRStats, getDueWords } from '../engine/spaced';
import { getQuantStats, getQuantWeakAreas } from '../engine/QuantErrorEngine';

// ─── helpers ──────────────────────────────────────────────────────────────────
const loadJSON = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };

function getTodayPlan(studyDay) {
  // Verbal days cycle through all 30; quant rotates through 4 topics
  const verbalDay = ((studyDay - 1) % 30) + 1;
  const quantCycle = ['arithmetic', 'algebra', 'geometry', 'data'];
  const quantTopic = quantCycle[(studyDay - 1) % 4];
  const isMockDay = studyDay % 10 === 0; // mock every 10 days
  return { verbalDay, quantTopic, isMockDay };
}

function getStudyDay() {
  const start = loadJSON('gre_study_start', null);
  if (!start) return 1;
  const diff = Math.floor((Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

function setStudyStart() {
  if (!localStorage.getItem('gre_study_start')) {
    localStorage.setItem('gre_study_start', new Date().toISOString());
  }
}

// ─── Time Block Card ───────────────────────────────────────────────────────────
function TimeBlock({ icon, duration, title, desc, color, done, onClick, tag }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      background: done ? `${C.green}10` : `${color}08`,
      border: `1px solid ${done ? C.green + '44' : color + '33'}`,
      borderRadius: 10, cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
      opacity: done ? 0.75 : 1,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: done ? `${C.green}22` : `${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}>{done ? '✅' : icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ color: done ? C.greenBr : C.text, fontSize: 13, fontWeight: 700, textDecoration: done ? 'line-through' : 'none' }}>{title}</span>
          {tag && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, background: color + '22', color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tag}</span>}
        </div>
        <p style={{ color: C.textDim, fontSize: 11, margin: 0, lineHeight: 1.4 }}>{desc}</p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontFamily: 'Courier New,monospace', fontSize: 13, fontWeight: 700, color, margin: 0 }}>{duration}</p>
        <p style={{ color: C.textDim, fontSize: 9, margin: '2px 0 0' }}>min</p>
      </div>
    </div>
  );
}

// ─── 30-Day Plan view ─────────────────────────────────────────────────────────
function ThirtyDayPlan({ currentDay }) {
  const [expanded, setExpanded] = useState(null);
  const weeks = [
    {
      week: 1, title: 'Foundation Week', color: C.blue, days: '1–7',
      focus: 'Build vocabulary base (Days 1-3), master arithmetic & algebra concepts',
      daily: '☀️ Morning Drill → 📖 Vocab Day 1-3 → ✍️ VIC+TC practice → 🔢 Arithmetic concepts → 📐 Algebra basics',
      milestones: ['Complete Days 1-3 vocabulary', 'Finish Arithmetic concept cards', 'Beat Boss after Day 2', '10-day drill streak'],
    },
    {
      week: 2, title: 'Expansion Week', color: C.gold, days: '8–14',
      focus: 'Vocab Days 4-5, Geometry, SE/RC practice, first Verbal Mock',
      daily: '☀️ Morning Drill → 📖 Vocab Day 4-5 → ⚔️ SE+RC sections → 📏 Geometry concepts → 📊 Data Analysis',
      milestones: ['Days 1-5 vocabulary solid', 'First Verbal Mock (target 155+)', 'Beat Boss after Day 4', 'Formula sheet 50% mastered'],
    },
    {
      week: 3, title: 'Acceleration Week', color: '#9B6BDB', days: '15–21',
      focus: 'Vocab Days 6-7, full Quant mock, roots mastery, timed practice',
      daily: '☀️ Morning Drill → 📖 Vocab Day 6-7 → ⏱ Timed TC+SE → 🧮 Quant Mock → 🌱 Roots module',
      milestones: ['All 7 verbal days studied', 'First Quant Mock (target 158+)', 'Beat Grand Lexiconer boss', 'Roots quiz 80%+'],
    },
    {
      week: 4, title: 'Mastery Week', color: C.greenBr, days: '22–28',
      focus: 'Review all weak words, Weak Word Blitz daily, full mocks, error pattern drill',
      daily: '☀️ Morning Drill → ⚡ Weak Word Blitz → 🎯 Full Verbal Mock → 🧮 Quant by weak subtopic → 📊 Score analysis',
      milestones: ['Weak word list < 10', 'Verbal Mock 160+', 'Quant Mock 162+', 'Formula sheet 80%+ mastered'],
    },
    {
      week: 5, title: 'Peak Performance', color: C.gold, days: '29–30+',
      focus: 'Timed mocks only, review errors, light vocab review, exam-day simulation',
      daily: '☀️ Morning Drill (10 min) → 🎯 Full Mock Exam (60 min) → 🔍 Error review (30 min) → 📖 Light vocab (20 min)',
      milestones: ['Both mocks 163+', 'All bosses defeated', 'Zero weak words', 'Ready for exam day'],
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: C.gold, margin: '0 0 4px' }}>📅 30-Day Path to 330+</h3>
        <p style={{ color: C.textMid, fontSize: 12 }}>Study Day {currentDay} of 30 · 1–2 hours daily</p>
      </div>

      {/* Progress bar across weeks */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
        {weeks.map(w => {
          const startDay = (w.week - 1) * 7 + 1;
          const endDay   = w.week * 7;
          const active   = currentDay >= startDay && currentDay <= endDay;
          const done     = currentDay > endDay;
          return (
            <div key={w.week} style={{ flex: 1 }}>
              <div style={{ height: 5, borderRadius: 3, background: done ? w.color : active ? w.color + '66' : C.border, transition: 'all 0.3s' }} />
              <p style={{ color: done ? w.color : active ? w.color : C.textDim, fontSize: 9, margin: '4px 0 0', fontWeight: active || done ? 700 : 400, textAlign: 'center' }}>W{w.week}</p>
            </div>
          );
        })}
      </div>

      {/* Week cards */}
      {weeks.map(w => {
        const startDay  = (w.week - 1) * 7 + 1;
        const endDay    = w.week * 7;
        const isActive  = currentDay >= startDay && currentDay <= endDay;
        const isDone    = currentDay > endDay;
        const isOpen    = expanded === w.week;

        return (
          <div key={w.week} onClick={() => setExpanded(isOpen ? null : w.week)} style={{
            background: isActive ? `linear-gradient(135deg, ${w.color}15, ${C.card})` : C.card,
            border: `1px solid ${isActive ? w.color + '44' : isDone ? C.green + '22' : C.border}`,
            borderRadius: 12, marginBottom: 10, overflow: 'hidden',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: isDone ? `${C.green}22` : `${w.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>
                {isDone ? '✅' : isActive ? '🔥' : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: isActive ? w.color : isDone ? C.greenBr : C.textMid, fontSize: 13, fontWeight: 700 }}>
                    Week {w.week}: {w.title}
                  </span>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, background: w.color + '22', color: w.color, fontWeight: 700 }}>Days {w.days}</span>
                  {isActive && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, background: `${C.gold}22`, color: C.gold, fontWeight: 700 }}>CURRENT</span>}
                </div>
                <p style={{ color: C.textDim, fontSize: 11, margin: '3px 0 0' }}>{w.focus}</p>
              </div>
              <span style={{ color: C.textDim, fontSize: 13, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </div>

            {isOpen && (
              <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}>
                {/* Daily routine */}
                <div style={{ background: C.surface, borderRadius: 8, padding: '12px 14px', marginTop: 12, marginBottom: 12 }}>
                  <p style={{ color: w.color, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Daily Routine</p>
                  <p style={{ color: C.textMid, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{w.daily}</p>
                </div>
                {/* Milestones */}
                <p style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Milestones</p>
                {w.milestones.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: i < w.milestones.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ color: isDone ? C.greenBr : w.color, fontSize: 12 }}>{isDone ? '✓' : '○'}</span>
                    <span style={{ color: isDone ? C.greenBr : C.textMid, fontSize: 12, textDecoration: isDone ? 'line-through' : 'none' }}>{m}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function DailyRoadmap({ currentDay: verbalCurrentDay, onNavigate }) {
  setStudyStart();
  const studyDay = getStudyDay();
  const streak   = getStreak();
  const xp       = getXP();
  const level    = getLevel(xp.total);
  const srStats  = getSRStats();
  const quantStats = getQuantStats();
  const dueWords = getDueWords();
  const weakAreas = getQuantWeakAreas().slice(0, 3);

  const [view, setView] = useState('today'); // today | plan

  const { verbalDay, quantTopic, isMockDay } = getTodayPlan(studyDay);
  const quantTopicData = QUANT_TOPICS.find(t => t.id === quantTopic);

  // Track which blocks are done today
  const todayKey  = new Date().toDateString();
  const drillDone = !!sessionStorage.getItem(`gre_drill_${todayKey}`);
  const sessionDone = !!localStorage.getItem(`gre_session_${todayKey}`);

  // Build today's time blocks
  const isMock = isMockDay;
  const todayBlocks = isMock ? [
    { icon: '☀️', duration: '10', title: 'Morning Drill', desc: 'Quick 5-question vocab blitz to warm up', color: C.gold, done: drillDone, nav: 'drill', tag: 'Habit' },
    { icon: '📖', duration: '10', title: `Vocab Review: All Days`, desc: 'Skim weak words, SR-flagged items', color: C.blue, done: false, nav: 'verbal_vocab' },
    { icon: '🎯', duration: '30', title: 'Full Verbal Mock', desc: 'TC + SE + RC — treat it like the real test', color: C.red, done: false, nav: 'verbal_mock', tag: 'Mock Day' },
    { icon: '🧮', duration: '35', title: 'Quant Mock', desc: '20 questions, timed, full navigator', color: C.greenBr, done: false, nav: 'quant_mock', tag: 'Mock Day' },
    { icon: '🔍', duration: '15', title: 'Error Review', desc: 'Go through every wrong answer — understand why', color: '#9B6BDB', done: false },
  ] : [
    { icon: '☀️', duration: '5',  title: 'Morning Drill', desc: 'Quick 5-question vocab blitz', color: C.gold, done: drillDone, nav: 'drill', tag: 'Habit' },
    { icon: '📖', duration: '15', title: `Vocab: Day ${verbalDay} Words`, desc: `Study + expand ${DAYS[verbalDay - 1]?.words.length || 0} words. Use TC Patterns & SE Strategy tabs.`, color: C.blue, done: false, nav: `verbal_vocab_${verbalDay}` },
    { icon: '✍️', duration: '20', title: 'Verbal Practice', desc: 'VIC + TC + SE (AI-generated, adaptive)', color: '#9B6BDB', done: false, nav: 'verbal_practice' },
    { icon: `${quantTopicData?.icon || '🔢'}`, duration: '15', title: `Learn: ${quantTopicData?.label}`, desc: 'Concept cards → worked examples → traps', color: C.greenBr, done: false, nav: 'quant_learn' },
    { icon: '📝', duration: '20', title: `Practice: ${quantTopicData?.label}`, desc: 'AI questions adapted to your weak subtopics', color: C.gold, done: false, nav: 'quant_practice' },
    ...(dueWords.length > 3 ? [{ icon: '⚡', duration: '10', title: `Weak Word Blitz (${dueWords.length} due)`, desc: 'Targeted drill on your weakest words', color: C.red, done: false, nav: 'blitz', tag: 'Priority' }] : []),
  ];

  const totalTime = todayBlocks.reduce((a, b) => a + parseInt(b.duration), 0);
  const doneCount = todayBlocks.filter(b => b.done).length;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Top stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { icon: level.icon, label: 'Level', val: level.name, color: C.gold },
          { icon: '🔥', label: 'Streak', val: `${streak.current}d`, color: '#FF6B35' },
          { icon: '📅', label: 'Study Day', val: `Day ${studyDay}`, color: C.blue },
          { icon: '📚', label: 'SR Due', val: `${dueWords.length}`, color: dueWords.length > 5 ? C.red : C.greenBr },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, minWidth: 90, textAlign: 'center', padding: '10px 8px',
            background: `${s.color}12`, borderRadius: 10, border: `1px solid ${s.color}22`,
          }}>
            <p style={{ fontSize: 18, margin: '0 0 2px' }}>{s.icon}</p>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 15, fontWeight: 700, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ color: C.textDim, fontSize: 9, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', background: C.surface, borderRadius: 10, padding: 4, gap: 3, marginBottom: 20 }}>
        {[
          { id: 'today', label: "☀️ Today's Plan" },
          { id: 'plan', label: '📅 30-Day Path' },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 12, transition: 'all 0.2s',
            background: view === t.id ? `linear-gradient(135deg, ${C.gold}, ${C.goldBr})` : 'transparent',
            color: view === t.id ? '#07090F' : C.textMid,
            boxShadow: view === t.id ? `0 2px 8px ${C.gold}33` : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {view === 'today' ? (
        <>
          {/* Today header */}
          <div style={{
            background: isMock
              ? `linear-gradient(135deg, ${C.red}18, ${C.card})`
              : `linear-gradient(135deg, ${C.gold}14, ${C.card})`,
            border: `1px solid ${isMock ? C.red + '33' : C.gold + '22'}`,
            borderRadius: 12, padding: '16px 18px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: isMock ? C.red : C.gold, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>
                  {isMock ? '🎯 Mock Exam Day' : `☀️ ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}
                </p>
                <h2 style={{ fontFamily: 'Georgia,serif', color: C.text, fontSize: 18, margin: '0 0 4px' }}>
                  {isMock ? 'Full Mock Day — Simulate the Real GRE' : `Study Day ${studyDay}: ${DAYS[verbalDay - 1]?.theme}`}
                </h2>
                <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>
                  {doneCount}/{todayBlocks.length} blocks done · {totalTime} min total
                </p>
              </div>
              <div style={{
                textAlign: 'center', background: C.surface, borderRadius: 8, padding: '8px 14px',
                border: `1px solid ${C.border}`,
              }}>
                <p style={{ fontFamily: 'Courier New,monospace', fontSize: 22, fontWeight: 700, color: doneCount === todayBlocks.length ? C.greenBr : C.gold, margin: 0 }}>
                  {Math.round(doneCount / todayBlocks.length * 100)}%
                </p>
                <p style={{ color: C.textDim, fontSize: 9, margin: '2px 0 0', textTransform: 'uppercase' }}>Done</p>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: 'hidden', marginTop: 12 }}>
              <div style={{
                height: '100%', borderRadius: 3, transition: 'width 0.6s ease',
                background: `linear-gradient(90deg, ${isMock ? C.red : C.gold}, ${isMock ? '#D4504A' : C.goldBr})`,
                width: `${(doneCount / todayBlocks.length) * 100}%`,
              }} />
            </div>
          </div>

          {/* Urgency callout if SR due */}
          {dueWords.length > 0 && (
            <div style={{
              background: `${C.red}10`, border: `1px solid ${C.red}22`,
              borderRadius: 8, padding: '10px 14px', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>🔴</span>
              <p style={{ color: C.red, fontSize: 12, margin: 0 }}>
                <strong>{dueWords.length} words</strong> are due for spaced repetition review today. Do the Weak Word Blitz first.
              </p>
            </div>
          )}

          {/* Weak quant areas */}
          {weakAreas.length > 0 && (
            <div style={{
              background: `${C.gold}08`, border: `1px solid ${C.gold}22`,
              borderRadius: 8, padding: '10px 14px', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 14 }}>📊</span>
              <span style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>Quant focus:</span>
              {weakAreas.map(w => (
                <span key={w.subtopic} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: `${C.red}22`, color: C.red, fontWeight: 700 }}>{w.subtopic} ({w.accuracy}%)</span>
              ))}
            </div>
          )}

          {/* Time blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {todayBlocks.map((block, i) => (
              <TimeBlock key={i} {...block} onClick={block.nav ? () => onNavigate?.(block.nav) : undefined} />
            ))}
          </div>

          {/* Motivational footer */}
          <div style={{
            background: `linear-gradient(135deg, ${C.gold}10, ${C.surface})`,
            border: `1px solid ${C.gold}22`, borderRadius: 10, padding: '14px 18px',
          }}>
            <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, margin: '0 0 4px', fontFamily: 'Georgia,serif' }}>
              {streak.current >= 7 ? '🔥 You\'re on a serious streak.' : streak.current >= 3 ? '💪 Building momentum.' : '🌱 Every expert was once a beginner.'}
            </p>
            <p style={{ color: C.textMid, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              {studyDay <= 7
                ? 'Week 1 is about building habits, not perfection. Show up every day.'
                : studyDay <= 14
                ? 'Week 2: Your vocabulary is starting to compound. Push through the hard sessions.'
                : studyDay <= 21
                ? 'Week 3: You\'re halfway there. The students who stay consistent now will score 330+.'
                : studyDay <= 28
                ? 'Week 4: Your work is about to show. Mock scores tell the truth — review every error.'
                : 'Final stretch. Maintain your edge. You\'ve already done the hard work.'}
            </p>
          </div>
        </>
      ) : (
        <ThirtyDayPlan currentDay={studyDay} />
      )}
    </div>
  );
}
