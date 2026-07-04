import { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch, hasGeminiKey } from '../lib/gemini';
import { getDifficultyProfile } from '../engine/adaptive';
import { addScoreEntry } from '../engine/history';
import C from '../theme';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import StemRenderer from '../components/StemRenderer';
import Btn from '../components/Btn';
import Tag from '../components/Tag';

// ─── EXAM TIMER ────────────────────────────────────────────────────────────────
function ExamTimer({ totalSeconds, onTimeUp, active }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    ref.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(ref.current); onTimeUp?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [active, onTimeUp]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / totalSeconds) * 100;
  const urgent = pct < 17;   // < 5 min
  const warning = pct < 33;  // < 10 min

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: urgent ? C.redBg : C.surface,
      border: `1px solid ${urgent ? C.red + '44' : C.border}`,
      borderRadius: 8, padding: '8px 16px',
    }}>
      <span style={{ fontSize: 13, color: C.textDim }}>⏱</span>
      <div style={{
        flex: 1, height: 4, background: C.border,
        borderRadius: 2, overflow: 'hidden', minWidth: 80,
      }}>
        <div style={{
          height: '100%', borderRadius: 2, width: `${pct}%`,
          background: urgent ? C.red : warning ? C.gold : C.green,
          transition: 'width 1s linear',
        }} />
      </div>
      <span style={{
        fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700,
        color: urgent ? C.red : warning ? C.gold : C.greenBr,
        minWidth: 50,
      }}>
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

// ─── TC QUESTION ───────────────────────────────────────────────────────────────
function TCQuestion({ q, answer, onAnswer, checked }) {
  const sel = answer || q.blanks.map(() => null);

  const select = (bIdx, l) => {
    if (checked) return;
    const n = [...sel];
    n[bIdx] = l;
    onAnswer(n);
  };

  const blankScore = checked
    ? q.blanks.filter((b, i) => sel[i] === b.answer).length
    : null;
  const allCorrect = checked && blankScore === q.blanks.length;
  const skipped    = checked && sel.every(s => s === null);

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
        <Tag color={C.blue}>TC</Tag>
        {checked && (
          <Tag color={skipped ? C.textDim : allCorrect ? C.green : C.red}>
            {skipped ? '— skipped' : `${blankScore}/${q.blanks.length}`}
          </Tag>
        )}
      </div>

      <StemRenderer
        stem={q.stem}
        blanks={q.blanks}
        selections={sel}
        isChecked={checked}
      />

      {q.blanks.map((blank, bIdx) => (
        <div key={bIdx} style={{ marginBottom: 10 }}>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 6, fontWeight: 700 }}>
            {blank.label}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {blank.opts.map(opt => {
              const isSel    = sel[bIdx] === opt.l;
              const correct  = checked && opt.l === blank.answer;
              const wrong    = checked && isSel && opt.l !== blank.answer;
              return (
                <button
                  key={opt.l}
                  onClick={() => select(bIdx, opt.l)}
                  style={{
                    padding: '6px 14px', borderRadius: 6, fontSize: 12,
                    fontFamily: 'Courier New,monospace',
                    fontWeight: isSel || correct ? 700 : 400,
                    cursor: checked ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                    background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                    color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                  }}
                >
                  <span style={{ color: C.textDim, marginRight: 4 }}>{opt.l}.</span>
                  {opt.t}
                  {correct ? ' ✓' : wrong ? ' ✗' : ''}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {checked && (
        <div style={{
          background: C.surface, borderRadius: 6, padding: 12,
          borderLeft: `3px solid ${C.blue}`, marginTop: 8,
        }}>
          <p style={{
            fontSize: 10, color: C.blue, fontWeight: 700,
            marginBottom: 4, textTransform: 'uppercase',
          }}>
            Explanation
          </p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
            {q.explain}
          </p>
        </div>
      )}
    </Card>
  );
}

// ─── SE QUESTION ───────────────────────────────────────────────────────────────
function SEQuestion({ q, answer, onAnswer, checked }) {
  const sel = answer || [];

  const toggle = l => {
    if (checked) return;
    const n = sel.includes(l)
      ? sel.filter(x => x !== l)
      : sel.length < 2 ? [...sel, l] : sel;
    onAnswer(n);
  };

  const skipped = checked && sel.length === 0;
  const isFullyCorrect = checked &&
    sel.length === 2 &&
    q.answers.every(a => sel.includes(a)) &&
    sel.every(a => q.answers.includes(a));

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
        <Tag color={C.gold}>SE</Tag>
        <span style={{ color: C.textDim, fontSize: 11 }}>
          Select 2 · {sel.length}/2
        </span>
        {checked && (
          <Tag color={skipped ? C.textDim : isFullyCorrect ? C.green : C.red}>
            {skipped ? '— skipped' : isFullyCorrect ? '✓ Correct' : '✗ Incorrect'}
          </Tag>
        )}
      </div>

      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>
        {q.stem}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6 }}>
        {q.opts.map(opt => {
          const isSel      = sel.includes(opt.l);
          const isCorrect  = checked && q.answers.includes(opt.l);   // always highlight correct answers
          const isWrong    = checked && isSel && !q.answers.includes(opt.l);
          return (
            <button
              key={opt.l}
              onClick={() => toggle(opt.l)}
              style={{
                padding: '8px 12px', borderRadius: 6, textAlign: 'left', fontSize: 12,
                fontFamily: 'Courier New,monospace',
                fontWeight: isSel || isCorrect ? 700 : 400,
                cursor: checked ? 'default' : 'pointer',
                transition: 'all 0.15s',
                border: `1px solid ${isCorrect ? C.green : isWrong ? C.red : isSel ? C.gold : C.border}`,
                background: isCorrect ? C.greenBg : isWrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                color: isCorrect ? C.greenBr : isWrong ? C.red : isSel ? C.gold : C.textMid,
              }}
            >
              <span style={{ color: C.textDim, marginRight: 6 }}>{opt.l}.</span>
              {opt.t}
              {isCorrect ? ' ✓' : isWrong ? ' ✗' : ''}
            </button>
          );
        })}
      </div>

      {checked && (
        <div style={{
          background: C.surface, borderRadius: 6, padding: 12,
          borderLeft: `3px solid ${C.gold}`, marginTop: 8,
        }}>
          <p style={{
            fontSize: 10, color: C.gold, fontWeight: 700,
            marginBottom: 4, textTransform: 'uppercase',
          }}>
            Explanation
          </p>
          <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
            {q.explain}
          </p>
        </div>
      )}
    </Card>
  );
}

// ─── RC PASSAGE ────────────────────────────────────────────────────────────────
function RCPassage({ passage, answers, onAnswer, checked }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Tag color={C.greenBr}>RC</Tag>
        <Tag color={C.textDim}>{passage.topic}</Tag>
      </div>

      {/* Passage text */}
      <div style={{
        background: C.surface, borderRadius: 8, padding: '16px 18px',
        borderLeft: `3px solid ${C.greenBr}`, marginBottom: 16,
      }}>
        <p style={{
          color: C.text, fontSize: 13, lineHeight: 2,
          margin: 0, textAlign: 'justify',
        }}>
          {passage.passage}
        </p>
      </div>

      {/* Questions */}
      {passage.questions.map((q, qi) => {
        const safeAnswers = answers ?? [];
        const sel         = safeAnswers[qi] ?? null;
        const skipped     = checked && sel === null;
        const isCorrect   = checked && sel === q.answer;
        const isWrong     = checked && sel !== null && sel !== q.answer;

        return (
          <div key={q.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <p style={{
                color: C.text, fontSize: 13, lineHeight: 1.6,
                fontWeight: 600, flex: 1, margin: 0,
              }}>
                {qi + 1}. {q.q}
              </p>
              {checked && (
                <Tag color={skipped ? C.textDim : isCorrect ? C.green : C.red}>
                  {skipped ? '—' : isCorrect ? '✓' : '✗'}
                </Tag>
              )}
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              {q.opts.map(opt => {
                const isSel   = sel === opt.l;
                const correct = checked && opt.l === q.answer;  // always highlight the right answer
                const wrong   = checked && isSel && opt.l !== q.answer;
                return (
                  <button
                    key={opt.l}
                    onClick={() => {
                      if (checked) return;
                      const n = [...(safeAnswers.length ? safeAnswers : passage.questions.map(() => null))];
                      n[qi] = opt.l;
                      onAnswer(n);
                    }}
                    style={{
                      padding: '8px 14px', borderRadius: 6, textAlign: 'left',
                      fontSize: 12, cursor: checked ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                      background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                      color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                      fontWeight: isSel || correct ? 700 : 400,
                    }}
                  >
                    <span style={{ color: C.textDim, marginRight: 8 }}>{opt.l}.</span>
                    {opt.t}
                    {correct ? ' ✓' : wrong ? ' ✗' : ''}
                  </button>
                );
              })}
            </div>

            {checked && (
              <div style={{
                background: C.surface, borderRadius: 6, padding: 10,
                borderLeft: `3px solid ${C.greenBr}`, marginTop: 6,
              }}>
                <p style={{ color: C.text, fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                  {q.explain}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
}

// ─── SCORE CALCULATION ─────────────────────────────────────────────────────────
function calcScore(exam, tcAnswers, seAnswers, rcAnswers) {
  if (!exam) return { tc: 0, tcMax: 0, se: 0, seMax: 0, rc: 0, rcMax: 0, total: 0, max: 0, pct: 0, scaledScore: 130 };

  // TC — 1 point per blank independently
  let tc = 0, tcMax = 0;
  exam.tc.forEach(q => {
    const ans = tcAnswers[q.id];
    q.blanks.forEach((b, i) => {
      tcMax++;
      if (ans?.[i] === b.answer) tc++;
    });
  });

  // SE — all-or-nothing per question (GRE standard)
  let se = 0;
  const seMax = exam.se.length;
  exam.se.forEach(q => {
    const ans = seAnswers[q.id] || [];
    const isFullyCorrect =
      ans.length === 2 &&
      q.answers.every(a => ans.includes(a)) &&
      ans.every(a => q.answers.includes(a));
    if (isFullyCorrect) se++;
  });

  // RC — 1 point per question
  let rc = 0, rcMax = 0;
  exam.rc.forEach(p => {
    const ans = rcAnswers[p.id] || [];
    p.questions.forEach((q, qi) => {
      rcMax++;
      if (ans[qi] === q.answer) rc++;
    });
  });

  const total = tc + se + rc;
  const max   = tcMax + seMax + rcMax;
  const pct   = max > 0 ? total / max : 0;

  // GRE Verbal raw→scaled — non-linear, calibrated to ETS score tables
  // The curve is steep in the 50-85% range and flatter at extremes
  const scaleMap = [
    { min: 0.00, max: 0.10, score: 130 },
    { min: 0.10, max: 0.18, score: 133 },
    { min: 0.18, max: 0.26, score: 136 },
    { min: 0.26, max: 0.34, score: 139 },
    { min: 0.34, max: 0.42, score: 142 },
    { min: 0.42, max: 0.50, score: 145 },
    { min: 0.50, max: 0.56, score: 148 },
    { min: 0.56, max: 0.62, score: 151 },
    { min: 0.62, max: 0.68, score: 153 },
    { min: 0.68, max: 0.73, score: 155 },
    { min: 0.73, max: 0.78, score: 157 },
    { min: 0.78, max: 0.82, score: 159 },
    { min: 0.82, max: 0.86, score: 161 },
    { min: 0.86, max: 0.90, score: 163 },
    { min: 0.90, max: 0.93, score: 165 },
    { min: 0.93, max: 0.96, score: 167 },
    { min: 0.96, max: 0.99, score: 168 },
    { min: 0.99, max: 1.01, score: 170 },
  ];

  const scaledScore = (scaleMap.find(b => pct >= b.min && pct < b.max) || scaleMap[0]).score;

  return { tc, tcMax, se, seMax, rc, rcMax, total, max, pct, scaledScore };
}

// ─── PERFORMANCE BAND MESSAGE ──────────────────────────────────────────────────
function bandMessage(score) {
  if (score >= 167) return '🔥 Elite. You\'re scoring in the top 2%. Maintain this and ace the real thing.';
  if (score >= 163) return '🎯 Outstanding — 163+ puts you in top 8%. Polish edge cases in SE.';
  if (score >= 160) return '💪 Strong performance. Focus on your weak question types to push past 163.';
  if (score >= 155) return '📈 Good foundation. Consistent daily practice will get you to 160+ in weeks.';
  if (score >= 148) return '📚 Solid start. Prioritize vocabulary depth and RC inference skills.';
  return '🌱 Keep building. Focus on the word bank and TC pivot-word strategy first.';
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MockExam() {
  const [exam, setExam]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [etsMode, setEtsMode]     = useState(false);

  const [currentSection, setCurrentSection] = useState(1);
  const [section1Score, setSection1Score] = useState(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [section1Exam, setSection1Exam] = useState(null);

  const EXAM_TIME = currentSection === 1 ? 18 * 60 : 23 * 60;

  // ─── GENERATE ───────────────────────────────────────────────────────────────
  const generate = useCallback(async (isSection2 = false, prevScore = null) => {
    setLoading(true);
    setError(null);
    setExam(null);
    setSubmitted(false);
    setTCAnswers({});
    setSEAnswers({});
    setRCAnswers({});

    try {
      const profile = getDifficultyProfile();
      const data = await apiFetch('/api/mock-exam', { 
        profile, 
        section: isSection2 ? 2 : 1,
        previousScore: prevScore
      });
      setExam(data);
      if (!isSection2) setSection1Exam(data);
      setTimerActive(true);
      setStarted(true);
      setStartTime(Date.now());
    } catch (e) {
      if (window.showToast) window.showToast(e.message || 'Failed to generate mock exam.');
      else setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── SUBMIT ─────────────────────────────────────────────────────────────────
  const submit = useCallback(() => {
    const score = calcScore(exam, tcAnswers, seAnswers, rcAnswers);
    let timeTaken = EXAM_TIME;
    if (startTime) timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    if (currentSection === 1) {
      setSection1Score(score);
      setTotalTimeTaken(timeTaken);
      setCurrentSection(2);
      generate(true, score.pct);
    } else {
      import('../engine/error-log').then(({ logMistake }) => {
        // Log mistakes for section 2
        exam.tc.forEach(q => {
          const ans = tcAnswers[q.id] || [];
          const correct = q.blanks.every((b, i) => ans[i] === b.answer);
          if (!correct) logMistake(q, ans, 'verbal');
        });
        exam.se.forEach(q => {
          const ans = seAnswers[q.id] || [];
          const isFullyCorrect = ans.length === 2 && q.answers.every(a => ans.includes(a));
          if (!isFullyCorrect) logMistake(q, ans, 'verbal');
        });
        exam.rc.forEach(p => {
          const ans = rcAnswers[p.id] || [];
          p.questions.forEach((q, qi) => {
            if (ans[qi] !== q.answer) logMistake({ ...q, passageText: p.text, passageTitle: p.title }, ans[qi], 'verbal');
          });
        });
      }).catch(e => console.error('Error logging mistakes:', e));
      
      const totalScore = {
        tc: score.tc + section1Score.tc,
        tcMax: score.tcMax + section1Score.tcMax,
        se: score.se + section1Score.se,
        seMax: score.seMax + section1Score.seMax,
        rc: score.rc + section1Score.rc,
        rcMax: score.rcMax + section1Score.rcMax,
        total: score.total + section1Score.total,
        max: score.max + section1Score.max,
      };
      totalScore.pct = totalScore.max > 0 ? totalScore.total / totalScore.max : 0;
      
      const scaleMap = [
        { min: 0.00, max: 0.10, score: 130 }, { min: 0.10, max: 0.18, score: 133 }, { min: 0.18, max: 0.26, score: 136 },
        { min: 0.26, max: 0.34, score: 139 }, { min: 0.34, max: 0.42, score: 142 }, { min: 0.42, max: 0.50, score: 145 },
        { min: 0.50, max: 0.56, score: 148 }, { min: 0.56, max: 0.62, score: 151 }, { min: 0.62, max: 0.68, score: 153 },
        { min: 0.68, max: 0.73, score: 155 }, { min: 0.73, max: 0.78, score: 157 }, { min: 0.78, max: 0.82, score: 159 },
        { min: 0.82, max: 0.86, score: 161 }, { min: 0.86, max: 0.90, score: 163 }, { min: 0.90, max: 0.93, score: 165 },
        { min: 0.93, max: 0.96, score: 167 }, { min: 0.96, max: 0.99, score: 168 }, { min: 0.99, max: 1.01, score: 170 },
      ];
      totalScore.scaledScore = (scaleMap.find(b => totalScore.pct >= b.min && totalScore.pct < b.max) || scaleMap[0]).score;

      addScoreEntry({
        type: 'verbal-mock',
        scaledScore: totalScore.scaledScore,
        timeTaken: totalTimeTaken + timeTaken,
        sections: {
          tc: { correct: totalScore.tc, total: totalScore.tcMax },
          se: { correct: totalScore.se, total: totalScore.seMax },
          rc: { correct: totalScore.rc, total: totalScore.rcMax }
        }
      });

      // Update local exam state so calcScore returns the total score on the results screen
      setExam({ tc: [...section1Exam.tc, ...exam.tc], se: [...section1Exam.se, ...exam.se], rc: [...section1Exam.rc, ...exam.rc] });
      setSubmitted(true);
      setTimerActive(false);
    }
  }, [exam, tcAnswers, seAnswers, rcAnswers, currentSection, section1Score, section1Exam, generate, startTime, totalTimeTaken, EXAM_TIME]);

  const handleTimeUp = useCallback(() => { submit(); }, [submit]);

  // ─── EXAM VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className={etsMode ? 'ets-mode' : ''} style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 80, transition: 'all 0.3s ease' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', background: C.card, borderRadius: 12,
        border: `1px solid ${C.border}`, marginBottom: 24,
        position: 'sticky', top: 16, zIndex: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: C.text, margin: '0 0 4px' }}>
            {submitted ? 'Mock Exam Results' : `Verbal Mock Exam — Section ${currentSection}`}
          </h2>
          <p style={{ color: C.textDim, fontSize: 12, margin: 0, fontFamily: 'Courier New,monospace' }}>
            {submitted ? 'Review your performance below' : `${currentSection === 1 ? 12 : 15} Questions`}
          </p>
        </div>
        {!submitted && <ExamTimer totalSeconds={EXAM_TIME} onTimeUp={handleTimeUp} active={timerActive} />}
        {submitted && <Tag color={C.greenBr}>Completed</Tag>}
      </div>

  // ─── LANDING ────────────────────────────────────────────────────────────────
  if (!exam && !loading) return (
    <div className={etsMode ? 'ets-mode' : ''} style={{ maxWidth: 600, margin: '0 auto', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: 48, marginBottom: 8 }}>🎯</p>
        <h2 style={{
          fontFamily: 'Georgia,serif', fontSize: 24,
          color: C.gold, marginBottom: 8,
        }}>
          GRE Verbal Mock Exam
        </h2>
        <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          A full 2-stage adaptive GRE Verbal Reasoning Mock Exam.
          <br />27 questions across 2 sections, fully adaptive routing.
        </p>

        <Card style={{ textAlign: 'left', marginBottom: 24 }}>
          <p style={{
            color: C.textDim, fontSize: 11, textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700,
          }}>
            Exam Format (New GRE)
          </p>
          {[
            { section: 'Section 1 (Medium)',   count: '12 questions',      desc: 'Sets your baseline difficulty',      color: C.blue    },
            { section: 'Section 2 (Adaptive)', count: '15 questions',      desc: 'Adapts to Easy, Medium, or Hard',     color: C.gold    },
          ].map(s => (
            <div key={s.section} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ width: 4, height: 32, background: s.color, borderRadius: 2 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>{s.section}</p>
                <p style={{ color: C.textDim, fontSize: 11, margin: '2px 0 0' }}>{s.desc}</p>
              </div>
              <Tag color={s.color}>{s.count}</Tag>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, marginTop: 4 }}>
            <span style={{ fontSize: 16 }}>⏱</span>
            <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, margin: 0 }}>
              18 mins (Sec 1) + 23 mins (Sec 2)
            </p>
          </div>
        </Card>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={etsMode} 
              onChange={e => setEtsMode(e.target.checked)} 
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <span style={{ color: C.textMid, fontSize: 13, fontWeight: 600 }}>Enable "ETS Authentic" Interface</span>
          </label>
        </div>

        {error && (
          <div style={{
            background: C.redBg, border: `1px solid ${C.red}44`,
            borderRadius: 8, padding: '12px 16px', marginBottom: 16,
          }}>
            <p style={{ color: C.red, fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        <Btn onClick={generate}>Start Mock Exam ⚡</Btn>
        <p style={{ color: C.textDim, fontSize: 11, marginTop: 12 }}>
          Makes one API call to generate your personalised exam.
        </p>
      </div>
    </div>
  );

  // ─── LOADING ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 140, height: 32, borderRadius: 6 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 12 }} />
          <div className="skeleton" style={{ width: 100, height: 28, borderRadius: 6 }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: 220, height: 24, borderRadius: 6, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: '80%', height: 14, borderRadius: 4, marginBottom: 24 }} />
      
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div className="skeleton" style={{ width: 32, height: 20, borderRadius: 4 }} />
          </div>
          <div style={{ padding: 16, background: C.surface, borderRadius: 8, marginBottom: 12 }}>
            <div className="skeleton" style={{ width: '100%', height: 16, borderRadius: 4, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '90%', height: 16, borderRadius: 4, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '60%', height: 16, borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4,5].map(j => (
              <div key={j} className="skeleton" style={{ width: '100%', height: 44, borderRadius: 6, opacity: 1 - j*0.1 }} />
            ))}
          </div>
        </div>
      ))}
      <div style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', background: C.card, padding: '12px 24px', borderRadius: 30, border: `1px solid ${C.gold}55`, boxShadow: `0 8px 32px ${C.bg}` }}>
        <p style={{ color: C.gold, fontSize: 14, fontWeight: 700, margin: 0, animation: 'pulse 1.5s infinite' }}>
          ✨ Generating Mock Exam...
        </p>
      </div>
    </div>
  );

  // ─── RESULTS ────────────────────────────────────────────────────────────────
  if (submitted) {
    const score = calcScore(exam, tcAnswers, seAnswers, rcAnswers);
    return (
      <div>
        {/* Score card */}
        <Card style={{
          marginBottom: 24, padding: 24,
          textAlign: 'center', borderTop: `3px solid ${C.gold}`,
        }}>
          <p style={{
            fontSize: 11, color: C.textDim, textTransform: 'uppercase',
            letterSpacing: '0.12em', marginBottom: 8,
          }}>
            Estimated GRE Verbal Score
          </p>
          <p style={{
            fontFamily: 'Courier New,monospace', fontSize: 64, fontWeight: 700,
            margin: '0 0 4px', lineHeight: 1,
            color: score.scaledScore >= 163 ? C.greenBr
                 : score.scaledScore >= 155 ? C.gold
                 : C.red,
          }}>
            {score.scaledScore}
          </p>
          <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
            out of 170
          </p>

          {/* Section breakdown */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 10, marginBottom: 16,
          }}>
            {[
              { label: 'Text Completion', got: score.tc, max: score.tcMax, color: C.blue,    note: 'per blank'  },
              { label: 'Sent. Equiv.',    got: score.se, max: score.seMax, color: C.gold,    note: 'all-or-none'},
              { label: 'Reading Comp.',   got: score.rc, max: score.rcMax, color: C.greenBr, note: 'per Q'      },
            ].map(s => (
              <div key={s.label} style={{
                background: C.surface, borderRadius: 8,
                padding: '10px 8px', border: `1px solid ${C.border}`,
              }}>
                <p style={{ fontSize: 10, color: C.textDim, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.label}
                </p>
                <p style={{ fontFamily: 'Courier New,monospace', fontSize: 22, fontWeight: 700, color: s.color, margin: 0 }}>
                  {s.got}/{s.max}
                </p>
                <p style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{s.note}</p>
              </div>
            ))}
          </div>

          {/* Raw score bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.textDim }}>Raw: {score.total}/{score.max}</span>
              <span style={{ fontSize: 11, color: C.textDim }}>{Math.round(score.pct * 100)}% correct</span>
            </div>
            <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${score.pct * 100}%`,
                background: score.scaledScore >= 163 ? C.green
                          : score.scaledScore >= 155 ? C.gold
                          : C.red,
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>

          <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.7 }}>
            {bandMessage(score.scaledScore)}
          </p>
        </Card>

        {/* Scoring key */}
        <Card style={{ marginBottom: 24, background: C.surface }}>
          <p style={{
            fontSize: 11, color: C.textDim, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
          }}>
            Scoring Rules Applied
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'TC blanks',    rule: '1 point each blank independently', color: C.blue    },
              { label: 'SE questions', rule: 'All-or-nothing — both correct words required', color: C.gold    },
              { label: 'RC questions', rule: '1 point per question',              color: C.greenBr },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Tag color={r.color}>{r.label}</Tag>
                <span style={{ color: C.textMid, fontSize: 12 }}>{r.rule}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Full review */}
        <SectionHead label="Full Review" count="All questions with explanations" color={C.textMid} />

        <p style={{ color: C.blue, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 20 }}>
          Text Completion — {score.tc}/{score.tcMax} blanks correct
        </p>
        {exam.tc.map(q => (
          <TCQuestion
            key={q.id} q={q}
            answer={tcAnswers[q.id]}
            onAnswer={() => {}}
            checked={true}
          />
        ))}

        <p style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>
          Sentence Equivalence — {score.se}/{score.seMax} correct
        </p>
        {exam.se.map(q => (
          <SEQuestion
            key={q.id} q={q}
            answer={seAnswers[q.id]}
            onAnswer={() => {}}
            checked={true}
          />
        ))}

        <p style={{ color: C.greenBr, fontSize: 13, fontWeight: 700, marginBottom: 8, marginTop: 24 }}>
          Reading Comprehension — {score.rc}/{score.rcMax} correct
        </p>
        {exam.rc.map(p => (
          <RCPassage
            key={p.id} passage={p}
            answers={rcAnswers[p.id]}
            onAnswer={() => {}}
            checked={true}
          />
        ))}

        <div style={{ textAlign: 'center', marginTop: 32, paddingBottom: 60 }}>
          <Btn onClick={generate}>Take Another Exam ↺</Btn>
        </div>
      </div>
    );
  }

  // ─── EXAM IN PROGRESS ───────────────────────────────────────────────────────
  const totalAnswered =
    Object.keys(tcAnswers).length +
    Object.keys(seAnswers).length +
    (exam.rc?.reduce((acc, p) => {
      const ans = rcAnswers[p.id] || [];
      return acc + ans.filter(a => a !== null && a !== undefined).length;
    }, 0) ?? 0);

  const totalQuestions =
    (exam.tc?.length ?? 0) +
    (exam.se?.length ?? 0) +
    (exam.rc?.reduce((acc, p) => acc + p.questions.length, 0) ?? 0);

  return (
    <div className={`mock-exam-grid ${etsMode ? 'ets-mode' : ''}`} style={{ minHeight: '100vh', padding: etsMode ? 20 : 0, transition: 'all 0.3s ease' }}>
      {etsMode && (
        <div className="ets-header" style={{ marginBottom: 20, borderRadius: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold' }}>GRE VERBAL REASONING</span>
          <span>Section 1 of 1</span>
        </div>
      )}
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: etsMode ? 0 : 56, zIndex: 15,
        background: C.bg, padding: '12px 0',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
      }}>
        <div style={{ flex: 1 }}>
          <ExamTimer
            totalSeconds={EXAM_TIME}
            onTimeUp={handleTimeUp}
            active={timerActive}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: C.textDim, fontSize: 12 }}>Answered:</span>
          <Tag color={totalAnswered === totalQuestions ? C.green : C.gold}>
            {totalAnswered}/{totalQuestions}
          </Tag>
          <Btn small variant="danger" onClick={submit}>Submit Exam</Btn>
        </div>
      </div>

      {/* TC Section */}
      <SectionHead label="Text Completion" count={`${exam.tc.length} questions`} color={C.blue} />
      <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16 }}>
        Select the best word(s) for each blank. Each blank is scored independently.
      </p>
      {exam.tc.map(q => (
        <TCQuestion
          key={q.id} q={q}
          answer={tcAnswers[q.id]}
          onAnswer={a => setTCAnswers(p => ({ ...p, [q.id]: a }))}
          checked={false}
        />
      ))}

      {/* SE Section */}
      <div style={{ marginTop: 28 }}>
        <SectionHead label="Sentence Equivalence" count={`${exam.se.length} questions`} color={C.gold} />
        <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16 }}>
          Select exactly 2 words that both fit the blank AND produce sentences alike in meaning.
          Both must be correct — partial credit is not awarded.
        </p>
        {exam.se.map(q => (
          <SEQuestion
            key={q.id} q={q}
            answer={seAnswers[q.id]}
            onAnswer={a => setSEAnswers(p => ({ ...p, [q.id]: a }))}
            checked={false}
          />
        ))}
      </div>

      {/* RC Section */}
      <div style={{ marginTop: 28 }}>
        <SectionHead label="Reading Comprehension" count={`${exam.rc.length} passages`} color={C.greenBr} />
        <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16 }}>
          Read each passage carefully before answering. Answers must be supported by the passage text.
        </p>
        {exam.rc.map(p => (
          <RCPassage
            key={p.id} passage={p}
            answers={rcAnswers[p.id]}
            onAnswer={a => setRCAnswers(prev => ({ ...prev, [p.id]: a }))}
            checked={false}
          />
        ))}
      </div>

      {/* Submit */}
      <div style={{ textAlign: 'center', padding: '36px 0 80px' }}>
        <Btn onClick={submit}>Submit Exam →</Btn>
        <p style={{ color: C.textDim, fontSize: 11, marginTop: 8 }}>
          Unanswered questions count as incorrect. You can submit at any time.
        </p>
      </div>
    </div>
  );
}