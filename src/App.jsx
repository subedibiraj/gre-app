import { useState, useCallback, useEffect } from 'react';
import C from './theme';
import { DAYS } from './data/days';
import { QUANT_TOPICS } from './data/quant-topics';
import { getStreak } from './engine/streak';
import { getSRStats } from './engine/spaced';
import { getOverallStats } from './engine/history';
import Tag from './components/Tag';
import AiTutor from './components/AiTutor';
import WarmupModal from './components/WarmupModal';
import ErrorBoundary from './components/ErrorBoundary';
import SettingsPanel from './components/SettingsPanel';
import XPBar from './components/XPBar';
import AchievementToast from './components/AchievementToast';
import { addXP, checkAchievements, XP_VALUES } from './engine/xp';
import VocabView from './phases/VocabView';
import PracticeView from './phases/PracticeView';
import ScoreOverview from './phases/ScoreOverview';
import ProgressDashboard from './phases/ProgressDashboard';
import MockExam from './phases/MockExam';
import WordRelations from './phases/WordRelations';
import RootsModule from './phases/RootsModule';
import QuantPractice from './phases/quant/QuantPractice';
import QuantMock from './phases/quant/QuantMock';
import FormulaSheet from './phases/quant/FormulaSheet';
import ConceptLearn from './phases/quant/ConceptLearn';
import DailySession from './components/DailySession';

// ─── PERSISTENCE HELPERS ──────────────────────────────────────────────────────
const loadJSON = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const saveJSON = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export default function App() {
  const [section, setSection]       = useState('verbal'); // verbal | quant
  const [currentDay, setCurrentDay] = useState(7);
  const [tab, setTab]               = useState('vocab');
  const [weakWords, setWeakWords]   = useState(() => loadJSON('gre_weakWords', []));
  const [dayScores, setDayScores]   = useState(() => loadJSON('gre_dayScores', {}));
  const [cachedQs, setCachedQs]     = useState({});
  const [quantPage, setQuantPage]   = useState(null);
  const [quantScores, setQuantScores] = useState(() => loadJSON('gre_quantScores', {}));
  const [quantTab, setQuantTab]     = useState('learn'); // learn | practice
  const [achToast, setAchToast]     = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDailySession, setShowDailySession] = useState(false);
  const [showWarmup, setShowWarmup] = useState(() => {
    const key = `gre_warmup_${new Date().toDateString()}`;
    if (sessionStorage.getItem(key)) return false;
    return true;
  });

  // Dynamic page title
  useEffect(() => {
    const base = 'GRE Complete';
    if (section === 'verbal') {
      if (currentDay > 0) document.title = `${base} — Day ${currentDay}: ${DAYS[currentDay-1]?.theme}`;
      else if (currentDay === -1) document.title = `${base} — Verbal Mock`;
      else document.title = `${base} — Verbal`;
    } else {
      if (quantPage === 'mock') document.title = `${base} — Quant Mock`;
      else if (quantPage) document.title = `${base} — ${quantPage}`;
      else document.title = `${base} — Quant`;
    }
  }, [section, currentDay, quantPage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'escape') { setShowSettings(false); return; }
      if (key === 'v') { setSection('verbal'); setCurrentDay(7); setTab('vocab'); return; }
      if (key === 'q') { setSection('quant'); setQuantPage(null); return; }
      if (key === 'p' && section === 'verbal' && currentDay > 0) { setTab('practice'); return; }
      if (key >= '1' && key <= '7' && section === 'verbal') { setCurrentDay(parseInt(key)); setTab('vocab'); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [section, currentDay]);

  const closeWarmup = () => {
    sessionStorage.setItem(`gre_warmup_${new Date().toDateString()}`, '1');
    setShowWarmup(false);
  };

  const streak = getStreak();
  const srStats = getSRStats();
  const totalWords = DAYS.flatMap(d => d.words).length;
  const day = currentDay > 0 ? DAYS[currentDay-1] : null;

  // ─── Verbal callbacks ───
  const addWeakWords = useCallback((words) => {
    setWeakWords(prev => {
      const s = new Set([...prev, ...words]);
      const next = [...s];
      saveJSON('gre_weakWords', next);
      return next;
    });
  }, []);

  const updateScore = useCallback((dayNum, section, correct, total) => {
    setDayScores(prev => {
      const next = { ...prev, [dayNum]: { ...prev[dayNum], [section]: correct, [`${section}Total`]: total } };
      saveJSON('gre_dayScores', next);
      return next;
    });
    // Award XP
    addXP(correct * XP_VALUES.practice_correct + (total-correct) * XP_VALUES.practice_wrong, 'Verbal practice');
    addXP(XP_VALUES.complete_practice, 'Practice completed');
    const achs = checkAchievements({ practiceCompleted:true, streak:streak.current, wordsStudied:totalWords, perfectScore:correct===total });
    if(achs.length) setAchToast(achs[0]);
  }, [streak, totalWords]);

  const cacheQuestionsForDay = useCallback((dayNum, qs) => {
    setCachedQs(prev => ({ ...prev, [dayNum]: qs }));
  }, []);

  // ─── Quant callbacks ───
  const updateQuantScore = useCallback((topicId, correct, total) => {
    setQuantScores(prev => {
      const next = { ...prev, [topicId]: { correct, total, date: new Date().toISOString() } };
      saveJSON('gre_quantScores', next);
      return next;
    });
    addXP(correct * XP_VALUES.practice_correct + (total-correct) * XP_VALUES.practice_wrong, 'Quant practice');
    addXP(XP_VALUES.complete_practice, 'Practice completed');
    const practiceTopics = Object.keys({...quantScores, [topicId]:true});
    const achs = checkAchievements({ practiceCompleted:true, streak:streak.current, allQuantTopics:practiceTopics.length>=4, perfectScore:correct===total });
    if(achs.length) setAchToast(achs[0]);
  }, [streak, quantScores]);

  const mainContent = (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:'100vh', color:C.text, display:'flex', flexDirection:'column'}}>

      {showWarmup && <WarmupModal onClose={closeWarmup}/>}

      {/* Header */}
      <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 20px', display:'flex', alignItems:'center', gap:16, position:'sticky', top:0, zIndex:20}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span style={{fontFamily:'Georgia,serif', fontSize:18, fontWeight:700, color:C.gold, letterSpacing:'0.03em'}}>GRE Complete</span>
            {/* Section Switcher */}
            <div style={{display:'flex', background:C.bg, borderRadius:6, border:`1px solid ${C.border}`, overflow:'hidden'}}>
              {[{id:'verbal',label:'V'},{id:'quant',label:'Q'}].map(s=>(
                <button key={s.id} onClick={()=>{setSection(s.id);if(s.id==='quant')setQuantPage(null);if(s.id==='verbal'){setCurrentDay(7);setTab('vocab');}}} style={{
                  padding:'4px 14px', border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                  background: section===s.id?C.gold:'transparent',
                  color: section===s.id?'#07090F':C.textMid, transition:'all 0.15s',
                }}>{s.label}</button>
              ))}
            </div>
            {section==='verbal' && day && <Tag color={C.gold}>Day {currentDay}</Tag>}
            {section==='verbal' && <Tag color={C.blue}>{totalWords} words</Tag>}
            {section==='verbal' && srStats.due > 0 && <Tag color={C.red}>{srStats.due} due</Tag>}
          </div>
          <p style={{color:C.textMid, fontSize:11, margin:'2px 0 0'}}>
            {section==='verbal'
              ? `${day ? `${day.theme}  ·  ` : ''}Target: 165+ Verbal${srStats.mastered > 0 ? `  ·  ${srStats.mastered} mastered` : ''}`
              : 'Target: 165+ Quant  ·  Master all 4 topics'
            }
          </p>
        </div>
        <div style={{marginLeft:'auto', display:'flex', gap:12, alignItems:'center'}}>
          {streak.current > 0 && (
            <div style={{display:'flex', alignItems:'center', gap:6, background:C.goldDim+'33', border:`1px solid ${C.goldDim}`, borderRadius:20, padding:'4px 12px'}}>
              <span style={{fontSize:16}}>🔥</span>
              <span style={{fontFamily:'Courier New,monospace', fontWeight:700, fontSize:14, color:C.gold}}>{streak.current}</span>
              <span style={{color:C.textDim, fontSize:10}}>day{streak.current!==1?'s':''}</span>
            </div>
          )}
          <button onClick={()=>setShowDailySession(true)} style={{padding:'5px 12px', borderRadius:6, border:`1px solid ${C.gold}33`, background:`${C.gold}15`, color:C.gold, cursor:'pointer', fontSize:11, fontWeight:700, transition:'all 0.15s'}}>📅 Study</button>
          <XPBar/>
          {section==='verbal' && (
            <div style={{textAlign:'right'}}>
              <div style={{width:80, height:4, background:C.border, borderRadius:3, overflow:'hidden', marginBottom:2}}>
                <div style={{height:'100%', background:C.gold, borderRadius:3, width:`${(srStats.mastered/Math.max(totalWords,1))*100}%`, transition:'width 0.4s'}}/>
              </div>
              <span style={{color:C.textDim, fontSize:10}}>{srStats.mastered}/{totalWords} mastered</span>
            </div>
          )}
          {/* Sidebar toggle for mobile */}
          <button onClick={()=>setSidebarOpen(s=>!s)} style={{display:'none', padding:'4px 8px', borderRadius:4, border:'none', cursor:'pointer', background:C.surface, color:C.textMid, fontSize:16}} className='sidebar-toggle'>☰</button>
          {/* Settings gear */}
          <button onClick={()=>setShowSettings(true)} style={{padding:'4px 8px', borderRadius:4, border:'none', cursor:'pointer', background:'transparent', color:C.textDim, fontSize:16, transition:'all 0.15s'}} title='Settings & Study Plan'>⚙️</button>
        </div>
      </div>

      <div style={{display:'flex', flex:1, overflow:'hidden'}}>

        {/* ═══ SIDEBAR ═══ */}
        <div className='app-sidebar' style={{width:sidebarOpen?190:0, borderRight:sidebarOpen?`1px solid ${C.border}`:'none', padding:sidebarOpen?'16px 10px':'0', overflowY:'auto', overflowX:'hidden', flexShrink:0, background:C.surface, display:'flex', flexDirection:'column', gap:4, transition:'width 0.2s ease, padding 0.2s ease'}}>

          {section === 'verbal' ? (
            <>
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
                <button onClick={()=>{setCurrentDay(-1);setTab('mock');}} style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s', background:currentDay===-1?C.gold+'33':'transparent', color:currentDay===-1?C.gold:C.textMid}}>
                  <span style={{fontSize:13}}>🎯  Mock Exam</span>
                </button>
                <button onClick={()=>{setCurrentDay(-2);setTab('relations');}} style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s', background:currentDay===-2?C.gold+'33':'transparent', color:currentDay===-2?C.gold:C.textMid}}>
                  <span style={{fontSize:13}}>🔗  Word Map</span>
                </button>
                <button onClick={()=>{setCurrentDay(-3);setTab('roots');}} style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s', background:currentDay===-3?C.gold+'33':'transparent', color:currentDay===-3?C.gold:C.textMid}}>
                  <span style={{fontSize:13}}>🌱  Roots</span>
                </button>
                <button onClick={()=>{setCurrentDay(0);setTab('overview');}} style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s', background:currentDay===0?C.green+'33':'transparent', color:currentDay===0?C.greenBr:C.textMid}}>
                  <span style={{fontSize:13}}>📊  Progress</span>
                </button>
              </div>
            </>
          ) : (
            /* ─── QUANT SIDEBAR ─── */
            <>
              <p style={{fontSize:10, color:C.textDim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8, paddingLeft:8}}>Topics</p>
              {QUANT_TOPICS.map(t => {
                const sc = quantScores[t.id];
                const isCurrent = quantPage===t.id;
                return (
                  <button key={t.id} onClick={()=>setQuantPage(t.id)} style={{
                    width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8,
                    border:'none', cursor:'pointer', transition:'all 0.15s',
                    background: isCurrent?C.gold:'transparent',
                    color: isCurrent?'#07090F':sc?C.greenBr:C.textMid,
                  }}>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <span style={{fontSize:16}}>{t.icon}</span>
                      <div>
                        <p style={{fontSize:11, fontWeight:isCurrent?700:400, margin:0}}>{t.label}</p>
                        <p style={{fontSize:10, margin:0, opacity:0.7}}>{t.subtopics.length} subtopics</p>
                      </div>
                    </div>
                  </button>
                );
              })}
              <div style={{marginTop:'auto', paddingTop:16, display:'flex', flexDirection:'column', gap:4}}>
                <button onClick={()=>setQuantPage('mock')} style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s', background:quantPage==='mock'?C.gold+'33':'transparent', color:quantPage==='mock'?C.gold:C.textMid}}>
                  <span style={{fontSize:13}}>🧮  Mock Exam</span>
                </button>
                <button onClick={()=>setQuantPage('formulas')} style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s', background:quantPage==='formulas'?C.gold+'33':'transparent', color:quantPage==='formulas'?C.gold:C.textMid}}>
                  <span style={{fontSize:13}}>📐  Formulas</span>
                </button>
                <button onClick={()=>setQuantPage('progress')} style={{width:'100%', textAlign:'left', padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s', background:quantPage==='progress'?C.green+'33':'transparent', color:quantPage==='progress'?C.greenBr:C.textMid}}>
                  <span style={{fontSize:13}}>📊  Progress</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        <div style={{flex:1, overflow:'auto', padding:'24px 28px 100px'}}>
         <ErrorBoundary>

          {section === 'verbal' ? (
            /* ─── VERBAL CONTENT ─── */
            <>
              {currentDay===-1 ? (
                <MockExam/>
              ) : currentDay===-2 ? (
                <WordRelations day={DAYS.length}/>
              ) : currentDay===-3 ? (
                <RootsModule/>
              ) : currentDay===0 ? (
                <ProgressDashboard dayScores={dayScores} quantScores={quantScores} weakWords={weakWords} currentDay={currentDay}/>
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
            </>
          ) : (
            /* ─── QUANT CONTENT ─── */
            <>
              {quantPage === 'mock' ? (
                <QuantMock/>
              ) : quantPage === 'formulas' ? (
                <FormulaSheet/>
              ) : quantPage === 'progress' ? (
                <ProgressDashboard dayScores={dayScores} quantScores={quantScores} weakWords={weakWords} currentDay={currentDay}/>
              ) : quantPage && QUANT_TOPICS.find(t=>t.id===quantPage) ? (
                <div>
                  <div style={{display:'flex', gap:8, marginBottom:20, borderBottom:`1px solid ${C.border}`, paddingBottom:0}}>
                    {[{id:'learn',label:'📚  Learn'},{id:'practice',label:'⚔️  Practice'}].map(t=>(
                      <button key={t.id} onClick={()=>setQuantTab(t.id)} style={{
                        padding:'10px 20px', border:'none', cursor:'pointer',
                        fontFamily:'Georgia,serif', fontWeight:700, fontSize:13,
                        background:'transparent', transition:'all 0.15s',
                        borderBottom: quantTab===t.id?`2px solid ${C.gold}`:'2px solid transparent',
                        color: quantTab===t.id?C.gold:C.textMid, marginBottom:-1,
                      }}>{t.label}</button>
                    ))}
                  </div>
                  {quantTab==='learn' ? (
                    <ConceptLearn topicId={quantPage}/>
                  ) : (
                    <QuantPractice topic={quantPage} onScoreUpdate={updateQuantScore}/>
                  )}
                </div>
              ) : (
                <QuantLanding onSelectTopic={setQuantPage} scores={quantScores}/>
              )}
            </>
          )}
         </ErrorBoundary>
        </div>
      </div>

      <SettingsPanel open={showSettings} onClose={()=>setShowSettings(false)}/>
      <AchievementToast achievement={achToast} onDone={()=>setAchToast(null)}/>
      <AiTutor/>
    </div>
  );
}

// ─── QUANT LANDING PAGE ───────────────────────────────────────────────────────
function QuantLanding({ onSelectTopic, scores }) {
  return (
    <div>
      <div style={{textAlign:'center', marginBottom:24}}>
        <p style={{fontSize:40, marginBottom:4}}>🧮</p>
        <h2 style={{fontFamily:'Georgia,serif', fontSize:22, color:C.gold, marginBottom:8}}>GRE Quantitative Reasoning</h2>
        <p style={{color:C.textMid, fontSize:13}}>Master all 4 topics. Practice with AI-generated questions.</p>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:16}}>
        {QUANT_TOPICS.map(t => {
          const sc = scores[t.id];
          return (
            <div key={t.id} onClick={()=>onSelectTopic(t.id)} style={{
              background:C.card, border:`1px solid ${C.border}`, borderRadius:12,
              padding:'20px 16px', cursor:'pointer', transition:'all 0.2s',
              borderLeft:`4px solid ${C.gold}`,
            }}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
                <span style={{fontSize:28}}>{t.icon}</span>
                <div>
                  <p style={{fontFamily:'Georgia,serif', fontSize:16, fontWeight:700, color:C.text, margin:0}}>{t.label}</p>
                  <p style={{color:C.textDim, fontSize:11, margin:0}}>{t.subtopics.length} subtopics</p>
                </div>
                {sc && <Tag color={C.greenBr} style={{marginLeft:'auto'}}>{sc.correct}/{sc.total}</Tag>}
              </div>
              <div style={{display:'flex', flexWrap:'wrap', gap:4}}>
                {t.subtopics.slice(0,3).map(s=>(
                  <span key={s} style={{fontSize:10, color:C.textDim, background:C.surface, padding:'2px 8px', borderRadius:4}}>{s}</span>
                ))}
                {t.subtopics.length>3 && <span style={{fontSize:10, color:C.textDim}}>+{t.subtopics.length-3} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ─── DailySession modal ───
  const sessionModal = showDailySession && (
    <DailySession
      onNavigate={(sec, t) => { setSection(sec); if(sec==='verbal') setTab(t); else setQuantTab(t==='learn'?'learn':'practice'); }}
      onClose={() => setShowDailySession(false)}
    />
  );

  return (
    <>
      {mainContent}
      {sessionModal}
    </>
  );
}

