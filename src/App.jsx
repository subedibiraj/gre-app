import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, CalendarDays, Zap, Menu, WifiOff, LayoutDashboard, PenTool, Calculator, Target, Network, Sprout, Sun, Lock, Trophy, Swords, ShieldAlert } from 'lucide-react';
import C from './theme';
import { DAYS } from './data/days';
import { QUANT_TOPICS } from './data/quant-topics';
import { getStreak, getShieldStatus } from './engine/streak';
import { getSRStats } from './engine/spaced';
import SessionComplete from './components/SessionComplete';
import PaywallModal from './components/PaywallModal';
import { canAccessDay, canGenerate, isPro } from './lib/subscription';
import Tag from './components/Tag';
import AiTutor from './components/AiTutor';
import ErrorBoundary from './components/ErrorBoundary';
import SettingsPanel from './components/SettingsPanel';
import { AuthButton, useAuth } from './lib/auth.jsx';
import ExamWeekBanner from './components/ExamWeekBanner';
import ExamWeekDashboard from './components/ExamWeekDashboard';
import XPBar from './components/XPBar';
import AchievementToast from './components/AchievementToast';
import Toast from './components/Toast';
import { addXP, checkAchievements, XP_VALUES } from './engine/xp';
import { apiFetch, getGeminiKey } from './lib/gemini';
import VocabView from './phases/VocabView';
import ScoreOverview from './phases/ScoreOverview';
import ProgressDashboard from './phases/ProgressDashboard';
import DailyRoadmap from './phases/DailyRoadmap';
import WordRelations from './phases/WordRelations';
import RootsModule from './phases/RootsModule';
import FormulaSheet from './phases/quant/FormulaSheet';
import ConceptLearn from './phases/quant/ConceptLearn';
import MorningDrill from './components/MorningDrill';
import { getBossStatus, getBossResult, BOSSES } from './components/BossChallenge';
import WeakWordBlitz from './components/WeakWordBlitz';

// ─── LAZY LOADED COMPONENTS (Code Splitting) ──────────────────────────────────
const Onboarding = lazy(() => import('./phases/Onboarding'));
const PracticeView = lazy(() => import('./phases/PracticeView'));
const MockExam = lazy(() => import('./phases/MockExam'));
const QuantPractice = lazy(() => import('./phases/quant/QuantPractice'));
const QuantMock = lazy(() => import('./phases/quant/QuantMock'));
const BossChallenge = lazy(() => import('./components/BossChallenge'));
const DailySession = lazy(() => import('./components/DailySession'));
const AdminDashboard = lazy(() => import('./phases/AdminDashboard'));
import AwaView from './phases/AwaView';
import ScoreGraph, { recordActivity } from './components/ScoreGraph';
import Icon from './components/Icon';

const Pricing = lazy(() => import('./phases/Pricing'));
const Terms = lazy(() => import('./phases/legal/Terms'));
const Privacy = lazy(() => import('./phases/legal/Privacy'));
const Refund = lazy(() => import('./phases/legal/Refund'));

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const loadJSON = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const saveJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ─── MOBILE DETECTION ─────────────────────────────────────────────────────────
const isMobile = () => window.innerWidth < 768;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection]       = useState('verbal');
  const [currentDay, setCurrentDay] = useState(1);
  const [tab, setTab]               = useState('vocab');
  const [weakWords, setWeakWords]   = useState(() => loadJSON('gre_weakWords', []));
  const [dayScores, setDayScores]   = useState(() => loadJSON('gre_dayScores', {}));
  const [cachedQs, setCachedQs]     = useState({});
  const [quantPage, setQuantPage]   = useState(null);
  const [quantScores, setQuantScores] = useState(() => loadJSON('gre_quantScores', {}));
  const [quantTab, setQuantTab]     = useState('learn');
  const [achToast, setAchToast]     = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDailySession, setShowDailySession] = useState(false);
  const [showMorningDrill, setShowMorningDrill] = useState(() => {
    const key = `gre_drill_${new Date().toDateString()}`;
    return !sessionStorage.getItem(key);
  });
  const [showBoss, setShowBoss]           = useState(null);
  const [showWeakBlitz, setShowWeakBlitz] = useState(false);
  const [showExamDashboard, setShowExamDashboard] = useState(false);
  const [drawerOpen, setDrawerOpen]       = useState(false); // mobile day/topic drawer
  const [offline, setOffline]             = useState(!navigator.onLine);
  const [onboarded, setOnboarded]         = useState(() => localStorage.getItem('gre_onboarded') === '1');
  const [showPaywall, setShowPaywall]     = useState(null); // null or reason string
  const [curriculumLoading, setCurriculumLoading] = useState(true);
  
  const { user, session } = useAuth();
  const isAdmin = user?.email === (import.meta.env.VITE_ADMIN_EMAIL || 'biraj.077bct031@acem.edu.np');

  const [sessionComplete, setSessionComplete] = useState(null); // null or { correct, total, ... }
  const [toast, setToast]                 = useState(null); // null or { message, type }
  const mainRef = useRef(null);

  useEffect(() => {
    window.showToast = (message, type = 'error') => setToast({ message, type });
  }, []);

  // ─── Listen for cloud sync events ─────────────────────────────────────────────
  useEffect(() => {
    const handleSync = () => {
      if (localStorage.getItem('gre_onboarded') === '1') {
        setOnboarded(true);
      }
      setWeakWords(loadJSON('gre_weakWords', []));
      setDayScores(loadJSON('gre_dayScores', {}));
      setQuantScores(loadJSON('gre_quantScores', {}));
    };
    window.addEventListener('gre_progress_synced', handleSync);
    return () => window.removeEventListener('gre_progress_synced', handleSync);
  }, []);

  // ─── Fetch Secure Curriculum ──────────────────────────────────────────────────
  useEffect(() => {
    async function fetchCurriculum() {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        
        const body = JSON.stringify({ geminiKey: getGeminiKey() });
        const res = await fetch('/api/index-meta', { method: 'POST', headers, body });
        if (!res.ok) throw new Error('Failed to fetch curriculum');
        
        const data = await res.json();
        window.__GRE_DAYS = data.DAYS;
        window.__GRE_QUANT_TOPICS = data.QUANT_TOPICS;
        setCurriculumLoading(false);
      } catch (err) {
        console.error('Curriculum fetch error:', err);
        // Fallback or retry logic could go here
      } finally {
        setCurriculumLoading(false);
      }
    }
    
    // Only fetch once, but refetch if user logs in to get premium data
    fetchCurriculum();
  }, [user?.id]);

  // ─── Test date countdown ──────────────────────────────────────────────────────
  const testDate = loadJSON('gre_testDate', null);
  const daysUntilTest = testDate ? Math.max(0, Math.ceil((new Date(testDate) - new Date()) / 86400000)) : null;
  const shield = getShieldStatus();

  // ─── CHUNKED FETCHING ────────────────────────────────────────────────────────
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    if (section === 'verbal' && currentDay > 0) {
      const dayData = window.__GRE_DAYS?.[currentDay - 1];
      if (dayData && (!dayData.words || dayData.words.length === 0) && isPro()) {
        const fetchDay = async () => {
          try {
            const headers = { 'Content-Type': 'application/json' };
            if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
            const res = await fetch('/api/day', {
              method: 'POST',
              headers,
              body: JSON.stringify({ geminiKey: getGeminiKey(), day: currentDay })
            });
            const data = await res.json();
            if (data.day) {
              window.__GRE_DAYS[currentDay - 1] = data.day;
              setForceUpdate(n => n + 1); // Trigger re-render
            }
          } catch (e) { console.error('Failed to load day chunk', e); }
        };
        fetchDay();
      }
    }

    if (section === 'quant' && quantPage) {
      const topicIndex = window.__GRE_QUANT_TOPICS?.findIndex(t => t.id === quantPage);
      if (topicIndex >= 0) {
        const topic = window.__GRE_QUANT_TOPICS[topicIndex];
        if (!topic.questions || topic.questions.length === 0) {
          const fetchQuant = async () => {
            try {
              const headers = { 'Content-Type': 'application/json' };
              if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
              const res = await fetch('/api/quant', {
                method: 'POST',
                headers,
                body: JSON.stringify({ geminiKey: getGeminiKey(), topicId: quantPage })
              });
              const data = await res.json();
              if (data.topic) {
                window.__GRE_QUANT_TOPICS[topicIndex] = data.topic;
                setForceUpdate(n => n + 1);
              }
            } catch (e) { console.error('Failed to load quant chunk', e); }
          };
          fetchQuant();
        }
      }
    }
  }, [section, currentDay, quantPage, session]);

  // ─── Document title ──────────────────────────────────────────────────────────
  useEffect(() => {
    const base = 'GRE Complete';
    if (section === 'verbal') {
      if (currentDay > 0) document.title = `${base} — Day ${currentDay}: ${DAYS[currentDay-1]?.theme}`;
      else if (currentDay === -1) document.title = `${base} — Verbal Mock`;
      else document.title = base;
    } else if (section === 'quant') {
      document.title = quantPage ? `${base} — ${quantPage}` : `${base} — Quant`;
    } else if (section === 'awa') {
      document.title = `${base} — AWA Writing`;
    }
  }, [section, currentDay, quantPage]);

  // ─── Online/offline ───────────────────────────────────────────────────────────
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // ─── Scroll to top on navigation ─────────────────────────────────────────────
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [section, currentDay, tab, quantPage, quantTab]);

  // ─── Close drawer on navigation ──────────────────────────────────────────────
  useEffect(() => { setDrawerOpen(false); }, [section, currentDay, quantPage]);

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const k = e.key.toLowerCase();
      if (k === 'escape') { setShowSettings(false); setDrawerOpen(false); return; }
      if (k === 'v') { setSection('verbal'); setCurrentDay(1); setTab('vocab'); return; }
      if (k === 'q') { 
        if (!isPro()) { setShowPaywall('quant'); return; }
        setSection('quant'); setQuantPage(null); return; 
      }
      if (k === 'p' && section === 'verbal' && currentDay > 0) { setTab('practice'); return; }
      if (k >= '1' && k <= '9' && section === 'verbal') { setCurrentDay(parseInt(k)); setTab('vocab'); return; }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [section, currentDay]);

  const streak  = getStreak();
  const srStats = getSRStats();
  const totalWords = DAYS.reduce((sum, d) => sum + (d.wordCount || d.words?.length || 0), 0);
  const day = currentDay > 0 ? DAYS[currentDay-1] : null;

  const goQuant = useCallback((page = null, tab = null) => {
    if (!isPro()) {
      setShowPaywall('quant');
      return;
    }
    setSection('quant');
    if (page !== null) setQuantPage(page);
    if (tab !== null) setQuantTab(tab);
  }, []);

  // ─── Callbacks ────────────────────────────────────────────────────────────────
  const addWeakWords = useCallback((words) => {
    setWeakWords(prev => {
      const next = [...new Set([...prev, ...words])];
      saveJSON('gre_weakWords', next);
      return next;
    });
  }, []);

  const updateScore = useCallback((dayNum, sec, correct, total) => {
    setDayScores(prev => {
      const next = { ...prev, [dayNum]: { ...prev[dayNum], [sec]: correct, [`${sec}Total`]: total } };
      saveJSON('gre_dayScores', next);
      return next;
    });
    addXP(correct * XP_VALUES.practice_correct + (total - correct) * XP_VALUES.practice_wrong, 'Verbal practice');
    addXP(XP_VALUES.complete_practice, 'Practice completed');
    recordActivity(total);
    const studiedCount = Object.keys(loadJSON('gre_spacedRep', {})).length;
    const achs = checkAchievements({ practiceCompleted: true, streak: streak.current, wordsStudied: studiedCount, perfectScore: correct === total });
    if (achs.length) setAchToast(achs[0]);
  }, [streak]);

  const updateQuantScore = useCallback((topicId, correct, total) => {
    setQuantScores(prev => {
      const next = { ...prev, [topicId]: { correct, total, date: new Date().toISOString() } };
      saveJSON('gre_quantScores', next);
      return next;
    });
    addXP(correct * XP_VALUES.practice_correct + (total - correct) * XP_VALUES.practice_wrong, 'Quant practice');
    addXP(XP_VALUES.complete_practice, 'Practice completed');
    recordActivity(total);
    const practiceTopics = Object.keys({ ...quantScores, [topicId]: true });
    const achs = checkAchievements({ practiceCompleted: true, streak: streak.current, allQuantTopics: practiceTopics.length >= 4, perfectScore: correct === total });
    if (achs.length) setAchToast(achs[0]);
  }, [streak, quantScores]);

  const cacheQuestionsForDay = useCallback((dayNum, qs) => {
    setCachedQs(prev => ({ ...prev, [dayNum]: qs }));
  }, []);

  // ─── Navigate helper ──────────────────────────────────────────────────────────
  const navigate = (nav) => {
    if (!nav) return;
    if (nav.startsWith('verbal_vocab')) { const d = parseInt(nav.split('_')[2]) || 1; setSection('verbal'); setCurrentDay(d); setTab('vocab'); }
    else if (nav === 'verbal_practice') { setSection('verbal'); setCurrentDay(1); setTab('practice'); }
    else if (nav === 'verbal_mock') { setSection('verbal'); setCurrentDay(-1); }
    else if (nav === 'quant_learn') { goQuant('arithmetic', 'learn'); }
    else if (nav === 'quant_practice') { goQuant('arithmetic', 'practice'); }
    else if (nav === 'quant_mock') { goQuant('mock'); }
    else if (nav === 'blitz') setShowWeakBlitz(true);
    else if (nav === 'drill') { sessionStorage.removeItem(`gre_drill_${new Date().toDateString()}`); setShowMorningDrill(true); }
  };

  // ─── VERBAL CONTENT ───────────────────────────────────────────────────────────
  const verbalContent = currentDay === -1 ? <MockExam /> :
    currentDay === -2 ? <WordRelations day={DAYS.length} /> :
    currentDay === -3 ? <RootsModule /> :
    currentDay === 0  ? <DailyRoadmap currentDay={currentDay} onNavigate={navigate} /> :
    <>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: 20, gap: 0 }}>
        {[
          { id: 'vocab', label: 'Words', icon: 'BookOpen' },
          { id: 'practice', label: 'Practice', icon: 'PenTool' }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '12px 20px', border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 13, background: 'transparent',
            borderBottom: tab === t.id ? `2px solid ${C.gold}` : '2px solid transparent',
            color: tab === t.id ? C.gold : C.textMid,
            transition: 'all 0.15s', marginBottom: -1, minHeight: 44,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name={t.icon} size={16} color={tab === t.id ? C.gold : C.textDim} /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'vocab' && <VocabView day={currentDay} />}
      {tab === 'practice' && (
        <PracticeView
          day={currentDay} weakWords={weakWords}
          onWeakUpdate={addWeakWords} onScoreUpdate={updateScore}
          dayScores={dayScores[currentDay]}
          cachedQuestions={cachedQs[currentDay] || null}
          onCacheQuestions={(qs) => cacheQuestionsForDay(currentDay, qs)}
          onSessionComplete={(data) => setSessionComplete(data)}
        />
      )}
    </>;

  // ─── QUANT CONTENT ────────────────────────────────────────────────────────────
  const quantContent = quantPage === 'mock' ? <QuantMock /> :
    quantPage === 'formulas' ? <FormulaSheet /> :
    quantPage === 'progress' ? (
      <><ScoreGraph dayScores={dayScores} quantScores={quantScores} /><div style={{ marginTop: 24 }}><ProgressDashboard dayScores={dayScores} quantScores={quantScores} weakWords={weakWords} currentDay={currentDay} /></div></>
    ) :
    quantPage && QUANT_TOPICS.find(t => t.id === quantPage) ? (
      <>
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: 20, gap: 0 }}>
          {[
            { id: 'learn', label: 'Learn', icon: 'BookOpen' },
            { id: 'practice', label: 'Practice', icon: 'PenTool' }
          ].map(t => (
            <button key={t.id} onClick={() => setQuantTab(t.id)} style={{
              padding: '12px 20px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13, background: 'transparent',
              borderBottom: quantTab === t.id ? `2px solid ${C.gold}` : '2px solid transparent',
              color: quantTab === t.id ? C.gold : C.textMid,
              transition: 'all 0.15s', marginBottom: -1, minHeight: 44,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name={t.icon} size={16} color={quantTab === t.id ? C.gold : C.textDim} /> {t.label}
            </button>
          ))}
        </div>
        {quantTab === 'learn' ? <ConceptLearn topicId={quantPage} /> : <QuantPractice topic={quantPage} onScoreUpdate={updateQuantScore} />}
      </>
    ) :
    <QuantLanding onSelectTopic={setQuantPage} scores={quantScores} />;

  // ─── AWA CONTENT ──────────────────────────────────────────────────────────────
  const awaContent = (
    <div style={{ height: '100%', minHeight: 600 }}>
      <AwaView onSessionComplete={(res) => setSessionComplete(res)} />
    </div>
  );

  // ─── ADMIN CONTENT ────────────────────────────────────────────────────────────
  const adminContent = isAdmin ? <AdminDashboard /> : <div style={{color: C.red, padding: 40}}>Access Denied</div>;

  // ─── SIDEBAR CONTENT ─────────────────────────────────────────────────────────
  const BOSS_DAY_MAP = { 2: 'boss_2', 4: 'boss_4', 7: 'boss_7' };
  const sidebarContent = section === 'verbal' ? (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <p style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 4, fontWeight: 700 }}>30 Days</p>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {DAYS.map(d => {
          const sc = dayScores[d.day];
          const hasSc = sc && Object.keys(sc).length > 0;
          const isCurrent = currentDay === d.day;
          const bossId = BOSS_DAY_MAP[d.day];
          const bossResult = bossId ? getBossResult(bossId) : null;
          const bossAvailable = bossId && currentDay >= d.day && !bossResult?.beaten;
          const bossBeaten = bossResult?.beaten;
          return (
            <button key={d.day} onClick={() => {
              if (!canAccessDay(d.day)) { setShowPaywall('days'); return; }
              if (section !== 'verbal') setSection('verbal');
              setCurrentDay(d.day); setTab('vocab');
            }} style={{
              width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
              background: isCurrent ? C.gold : 'transparent',
              color: isCurrent ? '#07090F' : hasSc ? C.greenBr : !canAccessDay(d.day) ? C.textDim + '88' : C.textMid,
              opacity: canAccessDay(d.day) ? 1 : 0.6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, width: 22, flexShrink: 0, fontFamily: 'Courier New,monospace' }}>
                  {!canAccessDay(d.day) ? '🔒' : hasSc ? '✓' : `D${d.day}`}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.theme}</p>
                  <p style={{ fontSize: 10, margin: 0, opacity: 0.65 }}>{d.words.length} words</p>
                </div>
                {bossBeaten && <span style={{ fontSize: 11 }}>🏆</span>}
                {bossAvailable && <span style={{ fontSize: 11, animation: 'pulse 2s infinite' }}>⚔️</span>}
              </div>
            </button>
          );
        })}
      </div>
      {/* Bottom nav items */}
      <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
        {[
          { id: -1,  label: 'Mock Exam',    icon: <Target size={16} />,     tab: 'mock' },
          { id: -2,  label: 'Word Map',     icon: <Network size={16} />,    tab: 'relations' },
          { id: -3,  label: 'Roots',        icon: <Sprout size={16} />,     tab: 'roots' },
          { id: 0,   label: "Today's Plan", icon: <Sun size={16} />,        tab: 'overview', green: true },
        ].map(item => {
          const locked = !canAccessDay(item.id);
          return (
            <button key={item.id} onClick={() => {
              if (locked) { setShowPaywall('features'); return; }
              if (section !== 'verbal') setSection('verbal');
              setCurrentDay(item.id); setTab(item.tab);
            }} style={{
              width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
              background: currentDay === item.id ? (item.green ? C.green + '33' : C.gold + '22') : 'transparent',
              color: currentDay === item.id ? (item.green ? C.greenBr : C.gold) : locked ? C.textDim + '88' : C.textMid,
              fontSize: 13, fontWeight: 600, opacity: locked ? 0.6 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {locked ? <Lock size={16} opacity={0.6} /> : item.icon}
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      {isAdmin && (
        <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
          <button onClick={() => setSection('admin')} style={{
            width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
            background: section === 'admin' ? `${C.red}33` : 'transparent',
            color: section === 'admin' ? C.red : C.textMid,
            fontSize: 13, fontWeight: 600,
          }}>🛡️ Admin Panel</button>
        </div>
      )}
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <p style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 4, fontWeight: 700 }}>Topics</p>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {QUANT_TOPICS.map(t => {
          const sc = quantScores[t.id];
          const isCurrent = quantPage === t.id;
          return (
            <button key={t.id} onClick={() => setQuantPage(t.id)} style={{
              width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
              background: isCurrent ? C.gold : 'transparent',
              color: isCurrent ? '#07090F' : sc ? C.greenBr : C.textMid,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, margin: 0 }}>{t.label}</p>
                  <p style={{ fontSize: 10, margin: 0, opacity: 0.65 }}>{t.subtopics.length} subtopics</p>
                </div>
                {sc && <span style={{ fontSize: 10, color: isCurrent ? '#07090F' : C.greenBr }}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
        {[
          { id: 'mock',     label: '🧮 Mock Exam' },
          { id: 'formulas', label: '📐 Formulas' },
          { id: 'progress', label: '📊 Progress', green: true },
        ].map(item => (
          <button key={item.id} onClick={() => setQuantPage(item.id)} style={{
            width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
            background: quantPage === item.id ? (item.green ? C.green + '33' : C.gold + '22') : 'transparent',
            color: quantPage === item.id ? (item.green ? C.greenBr : C.gold) : C.textMid,
            fontSize: 13, fontWeight: 600,
          }}>{item.label}</button>
        ))}
      </div>
      {isAdmin && (
        <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
          <button onClick={() => setSection('admin')} style={{
            width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
            background: section === 'admin' ? `${C.red}33` : 'transparent',
            color: section === 'admin' ? C.red : C.textMid,
            fontSize: 13, fontWeight: 600,
          }}>🛡️ Admin Panel</button>
        </div>
      )}
    </div>
  );

  const sidebarContentRender = section === 'admin' ? (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <p style={{ fontSize: 10, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 4, fontWeight: 700 }}>Admin View</p>
      <button style={{
        width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
        border: `1px solid ${C.red}`, cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
        background: C.red + '22', color: C.red, fontSize: 13, fontWeight: 600,
      }}>
        🛡️ Dashboard
      </button>
    </div>
  ) : section === 'awa' ? (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <p style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 4, fontWeight: 700 }}>AWA Writing</p>
      <button 
        onClick={() => {}}
        style={{
          width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
          border: `1px solid ${C.gold}`, cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
          background: C.gold + '22', color: C.gold, fontSize: 13, fontWeight: 600,
        }}>
        ✍️ Issue Task
      </button>
    </div>
  ) : sidebarContent;

  // ─── MOBILE CONTEXT LABEL ─────────────────────────────────────────────────────
  const mobileContextLabel = section === 'verbal'
    ? (currentDay > 0 ? `Day ${currentDay}: ${day?.theme}` : currentDay === -1 ? 'Mock Exam' : currentDay === -2 ? 'Word Map' : currentDay === -3 ? 'Roots' : "Today's Plan")
    : section === 'quant' 
      ? (quantPage ? QUANT_TOPICS.find(t => t.id === quantPage)?.label || quantPage : 'Quant Overview')
      : 'Analytical Writing';

  // ─── ONBOARDING GATE ─────────────────────────────────────────────────────────
  if (!onboarded) {
    return (
      <Suspense fallback={<div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:C.gold}}>Loading...</div>}>
        <Onboarding onComplete={() => {
          setOnboarded(true);
          window.location.reload();
        }} />
      </Suspense>
    );
  }

  // ─── CURRICULUM LOADING GATE ──────────────────────────────────────────────────
  if (curriculumLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, color: C.gold }}>
        <div style={{ animation: 'spin 1s linear infinite', fontSize: 32, marginBottom: 16 }}>⏳</div>
        <p style={{ fontFamily: 'Georgia,serif', fontWeight: 700, margin: 0 }}>Syncing Curriculum securely...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ background: C.bg, minHeight: '100dvh', color: C.text, display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

      {/* ── Modals ── */}
      {showMorningDrill && (
        <MorningDrill onClose={() => {
          sessionStorage.setItem(`gre_drill_${new Date().toDateString()}`, '1');
          setShowMorningDrill(false);
          const bosses = getBossStatus(currentDay);
          if (bosses.length > 0) setTimeout(() => setShowBoss(bosses[0]), 900);
        }} />
      )}
      {showBoss && <BossChallenge boss={showBoss} onClose={() => setShowBoss(null)} />}
      {showWeakBlitz && (
        <WeakWordBlitz weakWords={weakWords} onClose={() => setShowWeakBlitz(false)}
          onWordGraduated={(word) => {
            setWeakWords(prev => { const next = prev.filter(w => w !== word); saveJSON('gre_weakWords', next); return next; });
          }} />
      )}
      {showExamDashboard && (
        <ExamWeekDashboard 
          weakWords={weakWords} 
          onClose={() => setShowExamDashboard(false)} 
          onNavigate={navigate} 
        />
      )}

      {/* ── HEADER ── */}
      <header style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: '0 16px', height: 52, display: 'flex', alignItems: 'center',
        gap: 12, position: 'sticky', top: 0, zIndex: 30, flexShrink: 0,
      }}>
        {/* Logo */}
        <span style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 700, color: C.gold, letterSpacing: '0.03em', flexShrink: 0 }}>
          GRE
        </span>

        {/* Section switcher */}
        <div style={{ display: 'flex', background: C.bg, borderRadius: 6, border: `1px solid ${C.border}`, overflow: 'hidden', flexShrink: 0 }}>
          {[{ id: 'verbal', label: 'Verbal' }, { id: 'quant', label: 'Quant' }, { id: 'awa', label: 'Writing' }].map(s => (
            <button key={s.id} onClick={() => { 
              if (s.id === 'awa' && !isPro()) { setShowPaywall('awa'); return; }
              setSection(s.id); 
              if (s.id === 'quant') setQuantPage(null); 
              if (s.id === 'verbal') { setCurrentDay(1); setTab('vocab'); } 
            }} style={{
              padding: '5px 12px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: section === s.id ? C.gold : 'transparent',
              color: section === s.id ? '#07090F' : C.textMid,
              transition: 'all 0.15s', minHeight: 32,
            }}>{s.label}</button>
          ))}
        </div>

        {/* Streak + Shield — desktop only */}
        {streak.current > 0 && (
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 5, background: C.goldDim + '33', border: `1px solid ${C.goldDim}`, borderRadius: 20, padding: '3px 10px' }}>
            <Flame size={16} color={C.gold} style={{ marginRight: 2 }} />
            <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 13, color: C.gold }}>{streak.current}</span>
            {shield.available && <Shield size={14} color={C.greenBr} title="Streak Shield ready" style={{ marginLeft: 4, opacity: 0.8 }} />}
          </div>
        )}

        {/* Test countdown — desktop only */}
        {daysUntilTest !== null && (
          <div className="hide-mobile" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 20,
            background: daysUntilTest <= 14 ? `${C.red}18` : daysUntilTest <= 30 ? `${C.gold}18` : `${C.green}18`,
            border: `1px solid ${daysUntilTest <= 14 ? C.red : daysUntilTest <= 30 ? C.gold : C.green}44`,
          }}>
            <CalendarDays size={14} color={daysUntilTest <= 14 ? C.red : daysUntilTest <= 30 ? C.gold : C.greenBr} />
            <span style={{
              fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 12,
              color: daysUntilTest <= 14 ? C.red : daysUntilTest <= 30 ? C.gold : C.greenBr,
            }}>{daysUntilTest}d</span>
          </div>
        )}

        {/* XP — desktop only */}
        <div className="hide-mobile"><XPBar /></div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Weak blitz button */}
        {weakWords.length > 0 && (
          <button onClick={() => setShowWeakBlitz(true)} style={{
            padding: '5px 10px', borderRadius: 6, border: `1px solid ${C.red}44`,
            background: `${C.red}18`, color: C.red, cursor: 'pointer',
            fontSize: 11, fontWeight: 700, flexShrink: 0, minHeight: 32,
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <Zap size={14} />
            {weakWords.length}
          </button>
        )}

        {/* Boss button */}
        {getBossStatus(currentDay).length > 0 && !showBoss && (
          <button onClick={() => { const b = getBossStatus(currentDay)[0]; setShowBoss(BOSSES.find(x => x.id === b.id)); }} style={{
            padding: '5px 10px', borderRadius: 6, border: `1px solid ${C.red}55`,
            background: `${C.red}22`, color: C.red, cursor: 'pointer',
            fontSize: 11, fontWeight: 700, flexShrink: 0, minHeight: 32,
            animation: 'pulse 2s ease-in-out infinite',
          }}>⚔️</button>
        )}

        {/* Settings */}
        <button onClick={() => setShowSettings(true)} style={{
          padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: 'transparent', color: C.textMid, fontSize: 18, flexShrink: 0, minHeight: 36,
        }}>⚙️</button>

        {/* Auth — desktop only */}
        <div className="hide-mobile"><AuthButton compact /></div>
      </header>

      {/* ── EXAM WEEK BANNER ── */}
      <ExamWeekBanner 
        daysUntilTest={daysUntilTest} 
        onActivate={() => setShowExamDashboard(true)} 
      />

      {/* ── BODY: sidebar + content ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* DESKTOP SIDEBAR */}
        <aside className="desktop-sidebar" style={{
          width: 200, flexShrink: 0, background: C.surface,
          borderRight: `1px solid ${C.border}`, padding: '16px 10px',
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          {sidebarContentRender}
        </aside>

        {/* MOBILE DRAWER BACKDROP */}
        {drawerOpen && (
          <div onClick={() => setDrawerOpen(false)} style={{
            position: 'fixed', inset: 0, top: 52, background: 'rgba(0,0,0,0.6)',
            zIndex: 40, backdropFilter: 'blur(3px)',
          }} />
        )}

        {/* MOBILE DRAWER */}
        <aside style={{
          position: 'fixed', left: 0, top: 52, bottom: 0, zIndex: 41,
          width: 260, background: C.surface, borderRight: `1px solid ${C.border}`,
          padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          // Only show as overlay on mobile — desktop-sidebar covers desktop
        }} className="mobile-drawer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <p style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 14, fontWeight: 700, margin: 0 }}>
              {section === 'verbal' ? '30 Days' : section === 'quant' ? 'Topics' : 'Writing'}
            </p>
            <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', color: C.textMid, cursor: 'pointer', fontSize: 20, padding: 4, minHeight: 36 }}>✕</button>
          </div>
          {sidebarContentRender}
        </aside>

        {/* MAIN CONTENT */}
        <main ref={mainRef} style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '20px 20px 80px',
          // On desktop, reduce padding since sidebar is visible
        }} className="main-content">

          {/* Mobile: context bar — shows current day/topic and drawer toggle */}
          <div className="mobile-context-bar" style={{
            display: 'none', alignItems: 'center', gap: 10,
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
          }}>
            <button onClick={() => setDrawerOpen(d => !d)} style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
              padding: '6px 10px', cursor: 'pointer', color: C.textMid,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 36, flexShrink: 0,
            }}>
              <Menu size={18} />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mobileContextLabel}
              </p>
              <p style={{ color: C.textDim, fontSize: 11, margin: '1px 0 0' }}>
                {section === 'verbal' ? `${totalWords} words · ${srStats.mastered} mastered` : 'Master all 4 topics'}
              </p>
            </div>
            {daysUntilTest !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, padding: '2px 6px', borderRadius: 8, background: `${C.gold}18` }}>
                <CalendarDays size={14} color={C.gold} />
                <span style={{ fontFamily: 'Courier New,monospace', fontSize: 12, fontWeight: 700, color: C.gold }}>{daysUntilTest}d</span>
              </div>
            )}
            {streak.current > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <Flame size={16} color={C.gold} />
                <span style={{ fontFamily: 'Courier New,monospace', fontSize: 13, fontWeight: 700, color: C.gold }}>{streak.current}</span>
              </div>
            )}
          </div>

          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${section}-${section === 'verbal' ? tab : quantTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {section === 'pricing' ? (
                  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px', color: C.gold }}><div style={{ animation: 'spin 1s linear infinite', fontSize: 24 }}>⏳</div></div>}><Pricing /></Suspense>
                ) : section === 'terms' ? (
                  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px', color: C.gold }}><div style={{ animation: 'spin 1s linear infinite', fontSize: 24 }}>⏳</div></div>}><Terms /></Suspense>
                ) : section === 'privacy' ? (
                  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px', color: C.gold }}><div style={{ animation: 'spin 1s linear infinite', fontSize: 24 }}>⏳</div></div>}><Privacy /></Suspense>
                ) : section === 'refund' ? (
                  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px', color: C.gold }}><div style={{ animation: 'spin 1s linear infinite', fontSize: 24 }}>⏳</div></div>}><Refund /></Suspense>
                ) : section === 'admin' ? (
                  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px', color: C.gold }}><div style={{ animation: 'spin 1s linear infinite', fontSize: 24 }}>⏳</div></div>}>
                    <AdminDashboard />
                  </Suspense>
                ) : (
                  <Suspense fallback={<div style={{height:'400px', display:'flex', alignItems:'center', justifyContent:'center', color:C.gold}}>Loading...</div>}>
                    {section === 'verbal' ? verbalContent : section === 'quant' ? quantContent : awaContent}
                  </Suspense>
                )}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>

          {/* APP FOOTER (for Paddle Compliance) */}
          <footer style={{
            marginTop: 60, paddingTop: 20, borderTop: `1px solid ${C.border}`,
            display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap',
            fontSize: 12, color: C.textDim
          }}>
            <button onClick={() => setSection('pricing')} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer' }}>Pricing</button>
            <button onClick={() => setSection('terms')} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer' }}>Terms of Service</button>
            <button onClick={() => setSection('privacy')} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer' }}>Privacy Policy</button>
            <button onClick={() => setSection('refund')} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer' }}>Refund Policy</button>
            <span style={{ color: C.textDim }}>© 2026 GRE Mastery</span>
          </footer>

        </main>
      </div>

      <nav className="mobile-bottom-nav">
        <button className={section === 'verbal' ? 'active' : ''} onClick={() => { setSection('verbal'); setCurrentDay(1); setTab('vocab'); }}>
          <span className="icon">📖</span>Verbal
        </button>
        <button className={section === 'quant' ? 'active' : ''} onClick={() => goQuant(null)}>
          <span className="icon">📐</span>Quant
        </button>
        <button className={section === 'awa' ? 'active' : ''} onClick={() => {
          if (!isPro()) { setShowPaywall('awa'); return; }
          setSection('awa');
        }}>
          <span className="icon">✍️</span>Writing
        </button>
        <button onClick={() => setDrawerOpen(d => !d)} className={drawerOpen ? 'active' : ''}>
          <span className="icon">☰</span>Menu
        </button>
        <button onClick={() => setShowSettings(true)}>
          <span className="icon">⚙️</span>Settings
        </button>
      </nav>

      {/* ── OVERLAYS ── */}
      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
      {/* Toasts & Modals */}
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <AchievementToast achievement={achToast} onDone={() => setAchToast(null)} />
      <AiTutor />
      {showPaywall && (
        <PaywallModal 
          reason={showPaywall} 
          onClose={() => setShowPaywall(null)} 
          onViewPricing={() => { setShowPaywall(null); setSection('pricing'); }}
        />
      )}
      {sessionComplete && (
        <SessionComplete
          {...sessionComplete}
          onClose={() => setSessionComplete(null)}
          onReview={() => setSessionComplete(null)}
          onNext={() => {
            setSessionComplete(null);
            if (section === 'verbal' && currentDay > 0 && currentDay < 30) {
              setCurrentDay(currentDay + 1); setTab('vocab');
            }
          }}
        />
      )}

      {offline && (
        <div style={{
          position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 500,
          background: '#1C0808', border: '1px solid #B5302844', borderRadius: 8,
          padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
        }}>
          <WifiOff size={16} color="#B53028" />
          <span style={{ color: '#B53028', fontSize: 12, fontWeight: 600 }}>No internet connection</span>
        </div>
      )}

      {/* Daily session modal */}
      {showDailySession && (
        <DailySession
          onNavigate={(sec, t, day) => {
            setSection(sec);
            if (sec === 'verbal') { if (day) setCurrentDay(day); setTab(t); }
            else setQuantTab(t === 'learn' ? 'learn' : 'practice');
            setShowDailySession(false);
          }}
          onClose={() => setShowDailySession(false)}
        />
      )}
    </motion.div>
  );
}

// ─── QUANT LANDING ────────────────────────────────────────────────────────────
function QuantLanding({ onSelectTopic, scores }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ background: `${C.gold}22`, padding: 16, borderRadius: '50%' }}>
            <Calculator size={32} color={C.gold} />
          </div>
        </div>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: C.gold, marginBottom: 8 }}>Quantitative Reasoning</h2>
        <p style={{ color: C.textMid, fontSize: 13 }}>Master all 4 topics. AI-generated adaptive practice.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {QUANT_TOPICS.map(t => {
          const sc = scores[t.id];
          return (
            <button key={t.id} onClick={() => onSelectTopic(t.id)} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: '20px 16px', cursor: 'pointer', transition: 'all 0.2s',
              borderLeft: `4px solid ${C.gold}`, textAlign: 'left',
              minHeight: 80,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{t.label}</p>
                  <p style={{ color: C.textDim, fontSize: 11, margin: '2px 0 0' }}>{t.subtopics.length} subtopics</p>
                </div>
                {sc && <Tag color={C.greenBr}>{sc.correct}/{sc.total}</Tag>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {t.subtopics.slice(0, 3).map(s => (
                  <span key={s} style={{ fontSize: 10, color: C.textDim, background: C.surface, padding: '2px 8px', borderRadius: 4 }}>{s}</span>
                ))}
                {t.subtopics.length > 3 && <span style={{ fontSize: 10, color: C.textDim }}>+{t.subtopics.length - 3} more</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
