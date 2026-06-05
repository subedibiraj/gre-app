import { useState } from 'react';
import C from '../theme';
import { recordSectionResult } from '../engine/adaptive';
import { updateWordSR } from '../engine/spaced';
import { useAuth } from '../lib/auth.jsx';

// ─── DIAGNOSTIC QUESTIONS ─────────────────────────────────────────────────────
// 10 questions: 3 VIC, 3 TC, 2 SE, 2 QC
// Seeded from common GRE words so new users get a real calibration signal

const DIAGNOSTIC = [
  // ── VIC ──
  {
    id: 1, type: 'vic', section: 'vic',
    q: 'Despite the scientist\'s ___ manner in interviews, her published work revealed a mind of extraordinary subtlety.',
    opts: ['A. erudite','B. voluble','C. laconic','D. bombastic','E. effusive'],
    answer: 'C',
    explain: 'Laconic means brief/silent. "Despite" signals contrast with the complexity of her work — she speaks little but thinks deeply.',
  },
  {
    id: 2, type: 'vic', section: 'vic',
    q: 'The committee praised the proposal not for its originality but for its ___ — each recommendation was supported by three independent studies.',
    opts: ['A. prolixity','B. temerity','C. veracity','D. equivocation','E. grandiloquence'],
    answer: 'C',
    explain: 'Veracity means truthfulness/accuracy. The clue is "supported by three independent studies" — the praise is about being factually sound.',
  },
  {
    id: 3, type: 'vic', section: 'vic',
    q: 'Far from being ___, the new tax policy was welcomed by economists across the political spectrum as a rare example of bipartisan wisdom.',
    opts: ['A. propitious','B. contentious','C. laudatory','D. judicious','E. equitable'],
    answer: 'B',
    explain: 'Contentious means controversial/divisive. "Far from being ___" + "welcomed across the spectrum" = the blank must be something like divisive.',
  },

  // ── TC ──
  {
    id: 4, type: 'tc', section: 'tc',
    stem: 'The author\'s prose style is relentlessly [B1]: she uses forty words where four would suffice, and subordinate clauses where a simple sentence would communicate more effectively.',
    blank: 'B1',
    opts: ['A. terse','B. incisive','C. prolix','D. pellucid','E. trenchant'],
    answer: 'C',
    explain: '"Forty words where four would suffice" — the blank must mean wordy/excessive. Prolix = tediously long-winded. Terse and incisive are opposites.',
  },
  {
    id: 5, type: 'tc', section: 'tc',
    stem: 'Although the general was celebrated for his ___ on the battlefield, his subordinates privately noted that his strategies were often reckless and his victories more fortunate than planned.',
    blank: 'B1',
    opts: ['A. audacity','B. sagacity','C. temerity','D. equanimity','E. magnanimity'],
    answer: 'B',
    explain: '"Although" signals contrast: celebrated for X, but actually reckless. So X must be a positive quality like wisdom/judgment. Sagacity = wise judgment.',
  },
  {
    id: 6, type: 'tc', section: 'tc',
    stem: 'The reviewer noted that the biography, though exhaustively researched, was ultimately ___ — the author so admired her subject that every flaw was minimized and every achievement amplified beyond recognition.',
    blank: 'B1',
    opts: ['A. trenchant','B. dispassionate','C. hagiographic','D. perspicacious','E. tendentious'],
    answer: 'C',
    explain: 'Hagiographic = uncritical worshipful biography. The clue is "admired her subject... every flaw minimized... every achievement amplified." Tendentious is close but means biased toward a viewpoint, not specifically worshipful.',
  },

  // ── SE ──
  {
    id: 7, type: 'se', section: 'se',
    stem: 'The diplomat\'s response was masterfully ___: she neither confirmed nor denied the allegations, leaving all parties uncertain of her actual position.',
    opts: ['A. forthright','B. equivocal','C. candid','D. ambiguous','E. reticent','F. verbose'],
    answers: ['B','D'],
    explain: 'Twin test: "equivocal" = deliberately unclear (both meanings possible). "Ambiguous" = unclear, open to interpretation. Both produce: "the response was [unclear]." Reticent means reluctant to speak (different — she did speak). Forthright and candid are opposites.',
  },
  {
    id: 8, type: 'se', section: 'se',
    stem: 'Historians have long debated whether the collapse was inevitable or whether a more ___ leader might have averted catastrophe through timely compromise.',
    opts: ['A. bellicose','B. intransigent','C. truculent','D. conciliatory','E. pragmatic','F. obsequious'],
    answers: ['D','E'],
    explain: 'Twin test: a leader who "averts catastrophe through compromise" must be someone willing to deal practically. Conciliatory (D) = seeking to end conflict. Pragmatic (E) = practical, results-focused. Both produce: "a more [reasonable/deal-making] leader." Bellicose, intransigent, truculent are all opposites.',
  },

  // ── QC ──
  {
    id: 9, type: 'qc', section: 'qc',
    qtyA: 'x²',
    qtyB: 'x',
    info: 'x is a real number',
    opts: ['A. Quantity A is greater','B. Quantity B is greater','C. The two quantities are equal','D. Cannot be determined'],
    answer: 'D',
    explain: 'Test cases: x=2 → A=4 > B=2. x=0.5 → A=0.25 < B=0.5. x=1 → A=1 = B=1. x=-1 → A=1 > B=-1. Different results → D. The trap is assuming x is a positive integer greater than 1.',
  },
  {
    id: 10, type: 'qc', section: 'qc',
    qtyA: 'The number of factors of 36',
    qtyB: '8',
    info: '',
    opts: ['A. Quantity A is greater','B. Quantity B is greater','C. The two quantities are equal','D. Cannot be determined'],
    answer: 'C',
    explain: '36 = 2² × 3². Factors = (2+1)(2+1) = 9. Wait — that\'s 9, not 8. Re-check: factors of 36 are 1,2,3,4,6,9,12,18,36 = 9 factors. QtyA=9 > QtyB=8 → A. The trap is miscounting and getting 8.',
  },
];

const TOTAL = DIAGNOSTIC.length;

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i < current ? C.gold : i === current ? C.gold + '66' : C.border,
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

// ─── SINGLE QUESTION ──────────────────────────────────────────────────────────
function DiagnosticQuestion({ q, onAnswer, answered }) {
  const [selected, setSelected]   = useState(null);
  const [revealed, setRevealed]   = useState(false);
  const [seSelected, setSeSelected] = useState([]);

  const handleCheck = () => {
    if (!revealed) setRevealed(true);
  };

  const handleNext = () => {
    if (q.type === 'se') {
      const correct = q.answers.every(a => seSelected.includes(a)) && seSelected.length === 2;
      onAnswer(correct);
    } else {
      onAnswer(selected === q.answer);
    }
    setSelected(null);
    setRevealed(false);
    setSeSelected([]);
  };

  const toggleSE = (l) => {
    if (revealed) return;
    setSeSelected(prev =>
      prev.includes(l) ? prev.filter(x => x !== l) : prev.length < 2 ? [...prev, l] : prev
    );
  };

  const typeLabel = { vic: 'Vocabulary in Context', tc: 'Text Completion', se: 'Sentence Equivalence', qc: 'Quantitative Comparison' };

  return (
    <div className="fade-in">
      {/* Question type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
          color: C.gold, background: C.gold + '18', border: `1px solid ${C.gold}33`,
          padding: '3px 10px', borderRadius: 20,
        }}>{typeLabel[q.type]}</span>
      </div>

      {/* Stem / QtyA+B */}
      {q.type === 'qc' ? (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 10, marginBottom: 10 }}>
            {[{ label: 'Quantity A', val: q.qtyA }, { label: 'Quantity B', val: q.qtyB }].map((side, i) => (
              <>
                <div key={side.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{side.label}</p>
                  <p style={{ color: C.text, fontSize: 14, fontFamily: 'Georgia,serif', fontWeight: 700, margin: 0 }}>{side.val}</p>
                </div>
                {i === 0 && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: C.textDim, fontSize: 12, fontWeight: 700 }}>vs</span></div>}
              </>
            ))}
          </div>
          {q.info && <p style={{ color: C.textDim, fontSize: 12, textAlign: 'center', fontStyle: 'italic' }}>{q.info}</p>}
        </div>
      ) : (
        <div style={{ background: C.surface, borderRadius: 10, padding: '16px 18px', marginBottom: 20, borderLeft: `3px solid ${C.gold}` }}>
          <p style={{ color: C.text, fontSize: 15, lineHeight: 1.8, margin: 0, fontFamily: 'Georgia,serif' }}>
            {q.type === 'tc'
              ? q.stem.replace('[B1]', '________')
              : q.q || q.stem}
          </p>
        </div>
      )}

      {/* SE instruction */}
      {q.type === 'se' && (
        <p style={{ color: C.textDim, fontSize: 11, marginBottom: 10, textAlign: 'center' }}>
          Select exactly 2 words that both complete the sentence with the same meaning
        </p>
      )}

      {/* Answer options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {(q.opts || []).map((opt, i) => {
          const letter = opt[0];
          const text   = opt.slice(3);
          const isSel  = q.type === 'se' ? seSelected.includes(letter) : selected === letter;
          const isCorrect = q.type === 'se' ? q.answers.includes(letter) : letter === q.answer;

          let bg = C.surface, border = C.border, color = C.textMid;
          if (revealed && isCorrect)    { bg = C.green + '22'; border = C.green;   color = C.greenBr; }
          else if (revealed && isSel)   { bg = C.red   + '18'; border = C.red;     color = C.red; }
          else if (isSel)               { bg = C.gold  + '18'; border = C.gold;    color = C.gold; }

          return (
            <button key={letter} onClick={() => q.type === 'se' ? toggleSE(letter) : (!revealed && setSelected(letter))} style={{
              background: bg, border: `1.5px solid ${border}`, borderRadius: 8,
              padding: '12px 14px', textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
              color, fontSize: 13, lineHeight: 1.5, minHeight: 48,
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 12, flexShrink: 0, width: 20 }}>{letter}</span>
              <span>{text}</span>
              {revealed && isCorrect && <span style={{ marginLeft: 'auto', fontSize: 14 }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className="slide-up" style={{ background: C.surface, borderRadius: 8, padding: '14px 16px', marginBottom: 16, borderLeft: `3px solid ${C.gold}` }}>
          <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Explanation</p>
          <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{q.explain}</p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        {!revealed ? (
          <button onClick={handleCheck}
            disabled={q.type === 'se' ? seSelected.length !== 2 : !selected}
            style={{
              padding: '12px 28px', borderRadius: 8, border: 'none',
              background: (q.type === 'se' ? seSelected.length === 2 : selected) ? `linear-gradient(135deg, ${C.gold}, ${C.goldBr})` : C.surface,
              color: (q.type === 'se' ? seSelected.length === 2 : selected) ? '#07090F' : C.textDim,
              fontWeight: 700, fontSize: 14, cursor: 'pointer', minHeight: 46,
              transition: 'all 0.2s',
            }}>Check Answer</button>
        ) : (
          <button onClick={handleNext} style={{
            padding: '12px 28px', borderRadius: 8, border: 'none',
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
            color: '#07090F', fontWeight: 700, fontSize: 14, cursor: 'pointer', minHeight: 46,
          }}>
            {answered < TOTAL - 1 ? 'Next Question →' : 'See Results →'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SETUP SCREENS ────────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  const { signIn } = useAuth();
  
  return (
    <div style={{ textAlign: 'center', padding: '10px 0 20px' }} className="fade-in">
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
      <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: C.gold, marginBottom: 8 }}>
        GRE Complete
      </h1>
      <p style={{ color: C.textMid, fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 340, margin: '0 auto 28px' }}>
        AI-powered prep that adapts to exactly where you are.
        Takes 3 minutes to set up — then every session is calibrated to your level.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300, margin: '0 auto' }}>
        {[
          { icon: '🧠', text: '30-day vocabulary curriculum with SE twin-pair strategy' },
          { icon: '⚡', text: 'AI questions that get harder as you improve' },
          { icon: '📊', text: 'Track weakness by question type — not just overall score' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left', padding: '10px 14px', background: C.card, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
            <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{f.text}</p>
          </div>
        ))}
      </div>
      <button onClick={onStart} style={{
        marginTop: 28, padding: '14px 40px', borderRadius: 10, border: 'none',
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
        color: '#07090F', fontWeight: 700, fontSize: 16, cursor: 'pointer',
        boxShadow: `0 4px 20px ${C.gold}44`, minHeight: 52, width: '100%', maxWidth: 300,
      }}>
        Get Started →
      </button>

      <button onClick={signIn} style={{
        marginTop: 16, padding: '10px', borderRadius: 8, border: 'none',
        background: 'transparent', color: C.textMid, fontSize: 13, cursor: 'pointer',
        textDecoration: 'underline', width: '100%', maxWidth: 300,
      }}>
        Already have an account? Sign in
      </button>
    </div>
  );
}

function SetupScreen({ onComplete }) {
  const [testDate, setTestDate]   = useState('');
  const [dailyGoal, setDailyGoal] = useState(30);
  const [target, setTarget]       = useState('165');

  const save = () => {
    if (testDate) localStorage.setItem('gre_testDate', JSON.stringify(testDate));
    localStorage.setItem('gre_dailyGoal', JSON.stringify(dailyGoal));
    localStorage.setItem('gre_targetScore', JSON.stringify(parseInt(target)));
    onComplete();
  };

  const daysLeft = testDate
    ? Math.max(0, Math.ceil((new Date(testDate) - new Date()) / 86400000))
    : null;

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: C.gold, marginBottom: 6 }}>Quick Setup</h2>
      <p style={{ color: C.textDim, fontSize: 13, marginBottom: 24 }}>Takes 30 seconds. Helps us personalize your plan.</p>

      {/* Test date */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: C.textMid, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>When is your GRE? (optional)</p>
        <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1.5px solid ${testDate ? C.gold : C.border}`, background: C.surface, color: C.text, fontSize: 16, boxSizing: 'border-box' }} />
        {daysLeft !== null && (
          <p style={{ color: daysLeft <= 30 ? C.gold : C.textDim, fontSize: 12, marginTop: 6 }}>
            {daysLeft} days to go — {daysLeft <= 30 ? '⚡ Focus on weak areas and mocks' : daysLeft <= 60 ? '📈 Build consistency now' : '📚 You have time — learn deeply'}
          </p>
        )}
      </div>

      {/* Target score */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: C.textMid, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Target Verbal Score</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {['155', '158', '160', '163', '165', '167', '170'].map(s => (
            <button key={s} onClick={() => setTarget(s)} style={{
              flex: 1, padding: '10px 4px', borderRadius: 8, border: `1.5px solid ${target === s ? C.gold : C.border}`,
              background: target === s ? C.gold + '22' : C.surface,
              color: target === s ? C.gold : C.textMid,
              fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', minHeight: 44,
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Daily goal */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: C.textMid, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Daily Study Goal</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {[15, 30, 45, 60, 90].map(m => (
            <button key={m} onClick={() => setDailyGoal(m)} style={{
              flex: 1, padding: '10px 4px', borderRadius: 8, border: `1.5px solid ${dailyGoal === m ? C.gold : C.border}`,
              background: dailyGoal === m ? C.gold + '22' : C.surface,
              color: dailyGoal === m ? C.gold : C.textMid,
              fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', minHeight: 44,
            }}>{m}m</button>
          ))}
        </div>
      </div>

      <button onClick={save} style={{
        width: '100%', padding: '14px', borderRadius: 10, border: 'none',
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
        color: '#07090F', fontWeight: 700, fontSize: 15, cursor: 'pointer', minHeight: 52,
      }}>
        Continue to Diagnostic →
      </button>
    </div>
  );
}

function ResultsScreen({ score, total, breakdown, onComplete }) {
  const pct   = Math.round(score / total * 100);
  const level = pct >= 80 ? 5 : pct >= 65 ? 4 : pct >= 50 ? 3 : pct >= 35 ? 2 : 1;
  const labels = { 1: 'Building Foundation', 2: 'Developing', 3: 'Competent', 4: 'Proficient', 5: 'Advanced' };
  const colors = { 1: C.red, 2: '#E4A060', 3: C.gold, 4: C.green, 5: C.greenBr };
  const color  = colors[level];

  return (
    <div style={{ textAlign: 'center' }} className="bounce-in">
      <div style={{ fontSize: 48, marginBottom: 12 }}>
        {pct >= 80 ? '🎯' : pct >= 60 ? '💪' : pct >= 40 ? '📚' : '🌱'}
      </div>
      <p style={{ fontFamily: 'Courier New,monospace', fontSize: 42, fontWeight: 700, color, margin: '0 0 4px' }}>
        {score}/{total}
      </p>
      <p style={{ fontSize: 14, color, fontWeight: 700, marginBottom: 4 }}>{labels[level]}</p>
      <p style={{ color: C.textDim, fontSize: 13, marginBottom: 24 }}>
        Your first session will be calibrated to Level {level}/5
      </p>

      {/* Section breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginBottom: 24, textAlign: 'left' }}>
        {Object.entries(breakdown).map(([sec, { correct, total: t }]) => {
          const secColor = correct / t >= 0.67 ? C.greenBr : correct / t >= 0.34 ? C.gold : C.red;
          const labels2 = { vic: 'Vocabulary', tc: 'Text Completion', se: 'Sentence Equiv.', qc: 'Quant Comparison' };
          return (
            <div key={sec} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, color: C.textDim, margin: '0 0 4px' }}>{labels2[sec]}</p>
              <p style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 700, color: secColor, margin: 0 }}>
                {correct}/{t}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ background: C.surface, borderRadius: 10, padding: '14px 16px', marginBottom: 24, textAlign: 'left' }}>
        <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Your personalized plan
        </p>
        <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          {level <= 2
            ? 'Start with Days 1-3 vocabulary. Focus on TC pivot words and SE twin-pair logic before moving to harder questions.'
            : level <= 3
              ? 'Your foundation is solid. Push into harder TC double-blanks and practice identifying SE traps.'
              : 'You are already competitive. Target the question types where you dropped points in this diagnostic.'}
        </p>
      </div>

      <button onClick={onComplete} style={{
        width: '100%', padding: '14px', borderRadius: 10, border: 'none',
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
        color: '#07090F', fontWeight: 700, fontSize: 15, cursor: 'pointer', minHeight: 52,
      }}>
        Start Studying →
      </button>
    </div>
  );
}

// ─── MAIN ONBOARDING COMPONENT ─────────────────────────────────────────────────
export default function Onboarding({ onComplete }) {
  const [step, setStep]         = useState('welcome'); // welcome | setup | diagnostic | results
  const [qIdx, setQIdx]         = useState(0);
  const [answers, setAnswers]   = useState([]);
  const [breakdown, setBreakdown] = useState({ vic:{ correct:0,total:0 }, tc:{ correct:0,total:0 }, se:{ correct:0,total:0 }, qc:{ correct:0,total:0 } });

  const handleAnswer = (correct) => {
    const q = DIAGNOSTIC[qIdx];
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);

    // Update breakdown
    setBreakdown(prev => ({
      ...prev,
      [q.section]: {
        correct: prev[q.section].correct + (correct ? 1 : 0),
        total: prev[q.section].total + 1,
      },
    }));

    if (qIdx < DIAGNOSTIC.length - 1) {
      setQIdx(i => i + 1);
    } else {
      // Seed adaptive engine with diagnostic results
      const finalBreakdown = { ...breakdown };
      finalBreakdown[q.section] = {
        correct: finalBreakdown[q.section].correct + (correct ? 1 : 0),
        total: finalBreakdown[q.section].total + 1,
      };
      Object.entries(finalBreakdown).forEach(([sec, { correct: c, total: t }]) => {
        if (t > 0) recordSectionResult(sec, c, t);
      });
      setBreakdown(finalBreakdown);
      setStep('results');
    }
  };

  const score = answers.filter(Boolean).length;

  const containerStyle = {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: C.bg,
    padding: '16px',
    overflowY: 'auto',
  };

  const panelStyle = {
    width: '100%', maxWidth: 520, margin: '40px auto',
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 18, padding: '28px 24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  };

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        {step === 'welcome' && <WelcomeScreen onStart={() => setStep('setup')} />}

        {step === 'setup' && <SetupScreen onComplete={() => setStep('diagnostic')} />}

        {step === 'diagnostic' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: C.gold, margin: 0 }}>Diagnostic</h2>
                <p style={{ color: C.textDim, fontSize: 11, margin: '3px 0 0' }}>Calibrates your starting difficulty level</p>
              </div>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 13, color: C.textDim }}>
                {qIdx + 1}/{TOTAL}
              </span>
            </div>
            <ProgressBar current={qIdx} total={TOTAL} />
            <DiagnosticQuestion
              key={qIdx}
              q={DIAGNOSTIC[qIdx]}
              onAnswer={handleAnswer}
              answered={qIdx}
            />
          </>
        )}

        {step === 'results' && (
          <ResultsScreen
            score={score}
            total={TOTAL}
            breakdown={breakdown}
            onComplete={() => {
              localStorage.setItem('gre_onboarded', '1');
              onComplete();
            }}
          />
        )}
      </div>
    </div>
  );
}