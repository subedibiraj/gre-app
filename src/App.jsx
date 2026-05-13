import { useState, useCallback, useEffect } from 'react';
import C from './theme';
import { DAYS } from './data/days';
import { getStreak } from './engine/streak';
import { getSRStats } from './engine/spaced';
import Tag from './components/Tag';
import AiTutor from './components/AiTutor';
import WarmupModal from './components/WarmupModal';
import VocabView from './phases/VocabView';
import PracticeView from './phases/PracticeView';
import ScoreOverview from './phases/ScoreOverview';
import MockExam from './phases/MockExam';

// ─── PERSISTENCE HELPERS ──────────────────────────────────────────────────────
const loadJSON = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const saveJSON = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export default function App() {
  const [currentDay, setCurrentDay] = useState(7);
  const [tab, setTab]               = useState('vocab');
  const [weakWords, setWeakWords]   = useState(() => loadJSON('gre_weakWords', []));
  const [dayScores, setDayScores]   = useState(() => loadJSON('gre_dayScores', {}));
  const [cachedQs, setCachedQs]     = useState({});
  const [showWarmup, setShowWarmup] = useState(() => {
    // Show warm-up once per session
    const shown = sessionStorage.getItem('gre_warmupShown');
    return !shown;
  });

  const [streak, setStreak]   = useState(getStreak());
  const [srStats, setSRStats] = useState(getSRStats());

  // Refresh streak/SR display periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStreak(getStreak());
      setSRStats(getSRStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => saveJSON('gre_weakWords', weakWords), [weakWords]);
  useEffect(() => saveJSON('gre_dayScores', dayScores), [dayScores]);

  const totalWords = DAYS.reduce((a,d)=>a+d.words.length, 0);

  const addWeakWords = useCallback((words) => {
    setWeakWords(prev => [...new Set([...prev, ...words])].slice(0, 20));
  }, []);

  const updateScore = useCallback((day, section, correct, total) => {
    setDayScores(prev => ({
      ...prev,
      [day]: {...(prev[day]||{}), [section]: correct, [`${section}Total`]: total}
    }));
    // Refresh stats after score update
    setTimeout(() => {
      setStreak(getStreak());
      setSRStats(getSRStats());
    }, 100);
  }, []);

  const cacheQuestionsForDay = useCallback((day, questions) => {
    setCachedQs(prev => ({...prev, [day]: questions}));
  }, []);

  const closeWarmup = () => {
    setShowWarmup(false);
    sessionStorage.setItem('gre_warmupShown', 'true');
  };

  const day = currentDay > 0 ? DAYS[currentDay-1] : null;

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:'100vh', color:C.text, display:'flex', flexDirection:'column'}}>

      {/* Warm-up Modal */}
      {showWarmup && <WarmupModal onClose={closeWarmup}/>}

      {/* Header */}
      <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 20px', display:'flex', alignItems:'center', gap:16, position:'sticky', top:0, zIndex:20}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span style={{fontFamily:'Georgia,serif', fontSize:18, fontWeight:700, color:C.gold, letterSpacing:'0.03em'}}>GRE Verbal</span>
            {day && <Tag color={C.gold}>Day {currentDay}</Tag>}
            <Tag color={C.blue}>{totalWords} words</Tag>
            {srStats.due > 0 && <Tag color={C.red}>{srStats.due} due</Tag>}
            {weakWords.length>0 && <Tag color={'#E4A060'}>{weakWords.length} weak</Tag>}
          </div>
          <p style={{color:C.textMid, fontSize:11, margin:'2px 0 0'}}>
            {day ? `${day.theme}  ·  ` : ''}Target: 160 floor · 165 stretch
            {srStats.mastered > 0 && `  ·  ${srStats.mastered} mastered`}
          </p>
        </div>
        <div style={{marginLeft:'auto', display:'flex', gap:12, alignItems:'center'}}>
          {/* Streak */}
          {streak.current > 0 && (
            <div style={{
              display:'flex', alignItems:'center', gap:6,
              background:C.goldDim+'33', border:`1px solid ${C.goldDim}`,
              borderRadius:20, padding:'4px 12px',
            }}>
              <span style={{fontSize:16}}>🔥</span>
              <span style={{fontFamily:'Courier New,monospace', fontWeight:700, fontSize:14, color:C.gold}}>
                {streak.current}
              </span>
              <span style={{color:C.textDim, fontSize:10}}>day{streak.current!==1?'s':''}</span>
            </div>
          )}
          {/* Progress bar */}
          <div style={{textAlign:'right'}}>
            <div style={{width:80, height:4, background:C.border, borderRadius:3, overflow:'hidden', marginBottom:2}}>
              <div style={{height:'100%', background:C.gold, borderRadius:3, width:`${(srStats.mastered/Math.max(totalWords,1))*100}%`, transition:'width 0.4s'}}/>
            </div>
            <span style={{color:C.textDim, fontSize:10}}>{srStats.mastered}/{totalWords} mastered</span>
          </div>
        </div>
      </div>

      <div style={{display:'flex', flex:1, overflow:'hidden'}}>

        {/* Sidebar */}
        <div style={{width:190, borderRight:`1px solid ${C.border}`, padding:'16px 10px', overflowY:'auto', flexShrink:0, background:C.surface, display:'flex', flexDirection:'column', gap:4}}>
          <p style={{fontSize:10, color:C.textDim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8, paddingLeft:8}}>Days</p>
          {DAYS.map(d => {
            const sc = dayScores[d.day];
            const hasSc = sc && Object.keys(sc).length > 0;
            const isCurrent = currentDay===d.day;
            return (
              <button key={d.day} onClick={()=>{setCurrentDay(d.day);setTab('vocab');}} style={{
                width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8,
                border:'none', cursor:'pointer', transition:'all 0.15s',
                background: isCurrent?C.gold:'transparent',
                color: isCurrent?'#07090F':hasSc?C.greenBr:C.textMid,
              }}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <span style={{fontSize:13, fontWeight:700, width:20}}>{hasSc?'✓':`D${d.day}`}</span>
                  <div>
                    <p style={{fontSize:11, fontWeight:isCurrent?700:400, margin:0}}>{d.theme}</p>
                    <p style={{fontSize:10, margin:0, opacity:0.7}}>{d.words.length} words</p>
                  </div>
                </div>
              </button>
            );
          })}
          <div style={{marginTop:'auto', paddingTop:16, display:'flex', flexDirection:'column', gap:4}}>
            <button onClick={()=>{setCurrentDay(-1);setTab('mock');}}
              style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8,
                border:'none', cursor:'pointer', transition:'all 0.15s',
                background: currentDay===-1?C.gold+'33':'transparent',
                color: currentDay===-1?C.gold:C.textMid}}>
              <span style={{fontSize:13}}>🎯  Mock Exam</span>
            </button>
            <button onClick={()=>{setCurrentDay(0);setTab('overview');}}
              style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8,
                border:'none', cursor:'pointer', transition:'all 0.15s',
                background: currentDay===0?C.green+'33':'transparent',
                color: currentDay===0?C.greenBr:C.textMid}}>
              <span style={{fontSize:13}}>📊  Progress</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{flex:1, overflow:'auto', padding:'24px 28px 100px'}}>
          {currentDay===-1 ? (
            <MockExam/>
          ) : currentDay===0 ? (
            <ScoreOverview dayScores={dayScores} weakWords={weakWords}/>
          ) : (
            <>
              <div style={{display:'flex', gap:8, marginBottom:24, borderBottom:`1px solid ${C.border}`, paddingBottom:0}}>
                {[{id:'vocab',label:'📖  Vocabulary'},{id:'practice',label:'⚔️  Practice'}].map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{
                    padding:'10px 20px', border:'none', cursor:'pointer',
                    fontFamily:'Georgia,serif', fontWeight:700, fontSize:13,
                    background:'transparent', transition:'all 0.15s',
                    borderBottom: tab===t.id?`2px solid ${C.gold}`:'2px solid transparent',
                    color: tab===t.id?C.gold:C.textMid, marginBottom:-1,
                  }}>{t.label}</button>
                ))}
              </div>
              {tab==='vocab' && <VocabView day={currentDay}/>}
              {tab==='practice' && (
                <PracticeView
                  day={currentDay}
                  weakWords={weakWords}
                  onWeakUpdate={addWeakWords}
                  onScoreUpdate={updateScore}
                  dayScores={dayScores[currentDay]}
                  cachedQuestions={cachedQs[currentDay] || null}
                  onCacheQuestions={(qs) => cacheQuestionsForDay(currentDay, qs)}
                />
              )}
            </>
          )}
        </div>
      </div>

      <AiTutor/>
    </div>
  );
}
