import { useState, useCallback, useEffect } from 'react';
import { apiFetch, hasGeminiKey } from '../lib/gemini';
import C from '../theme';
import { DAYS } from '../data/days';
import { recordPractice } from '../engine/streak';
import Tag from '../components/Tag';
import Btn from '../components/Btn';
import ContrastRecall from './ContrastRecall';
import { PracticeLoadingSkeleton } from '../components/LoadingSkeleton';
import VocabInContext from './VocabInContext';
import TCSection from './TCSection';
import SESection from './SESection';
import RCSection from './RCSection';

export default function PracticeView({ day, weakWords, onWeakUpdate, onScoreUpdate, dayScores, cachedQuestions, onCacheQuestions }) {
  const [qs, setQs]           = useState(cachedQuestions);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [sectionScores, setSectionScores] = useState({contrast:null, vic:null, tc:null, se:null, rc:null});
  const [timed, setTimed]     = useState(false);

  useEffect(() => {
    if (cachedQuestions && !qs) setQs(cachedQuestions);
  }, [cachedQuestions]);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const allWords = DAYS.slice(0, day).flatMap(d => d.words);
      const currentWords = DAYS[day-1].words;

      const result = await apiFetch('/api/generate', {
          dayNum: day,
          theme: DAYS[day-1].theme,
          currentWords,
          allWords,
          weakWords,
          scores: dayScores,
      });
      setQs(result);
      onCacheQuestions?.(result);
    } catch(e) {
      let msg = e.message || 'Failed to generate questions.';
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        msg = 'API rate limit reached. Please wait 30 seconds and try again.';
      } else if (msg.includes('fetch') || msg.includes('network')) {
        msg = 'Cannot reach the server. Make sure to run: npm run server';
      }
      setError(msg);
      console.error(e);
    }
    setLoading(false);
  }, [day, weakWords, dayScores, onCacheQuestions]);

  const handleContrastComplete = (correct, total) => {
    setSectionScores(s=>({...s, contrast:correct}));
    onScoreUpdate(day, 'contrast', correct, total);
    recordPractice();
  };

  const handleVICComplete = (correct, total, wrongWords) => {
    setSectionScores(s=>({...s, vic:correct}));
    if (wrongWords?.length) onWeakUpdate(wrongWords);
    onScoreUpdate(day, 'vic', correct, total);
    recordPractice();
  };

  const handleTCComplete = (correct, total) => {
    setSectionScores(s=>({...s, tc:correct}));
    onScoreUpdate(day, 'tc', correct, total);
    recordPractice();
  };

  const handleSEComplete = (correct, total) => {
    setSectionScores(s=>({...s, se:correct}));
    onScoreUpdate(day, 'se', correct, total);
    recordPractice();
  };

  const handleRCComplete = (correct, total) => {
    setSectionScores(s=>({...s, rc:correct}));
    onScoreUpdate(day, 'rc', correct, total);
    recordPractice();
  };

  const renderAISections = () => {
    if (loading) return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', gap:16}}>
        <div style={{width:40, height:40, border:`3px solid ${C.border}`, borderTop:`3px solid ${C.gold}`, borderRadius:'50%', animation:'spin 1s linear infinite'}}/>
        <p style={{color:C.textMid, fontSize:14}}>Gemini is crafting your practice for Day {day}...</p>
        <p style={{color:C.textDim, fontSize:12}}>5 Vocab in Context · 5 Text Completion · 3 Sentence Equivalence</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

    if (error) return (
      <div style={{padding:24, textAlign:'center'}}>
        <p style={{color:C.red, marginBottom:16}}>{error}</p>
        <p style={{color:C.textDim, fontSize:12, marginBottom:16}}>Make sure the server is running: <code style={{color:C.gold}}>npm run server</code></p>
        <Btn onClick={load}>Try Again</Btn>
      </div>
    );

    if (!hasGeminiKey()) return (
      <div style={{ textAlign:'center', padding:'40px 20px', background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
        <p style={{ fontSize:36, margin:'0 0 12px' }}>🔑</p>
        <h3 style={{ fontFamily:'Georgia,serif', color:C.gold, fontSize:18, marginBottom:8 }}>Gemini API Key Required</h3>
        <p style={{ color:C.textMid, fontSize:13, lineHeight:1.7, marginBottom:16, maxWidth:340, margin:'0 auto 16px' }}>
          AI question generation needs a free Gemini API key.
        </p>
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
          style={{ display:'inline-block', padding:'10px 20px', borderRadius:8, background:`${C.gold}22`, color:C.gold, border:`1px solid ${C.gold}44`, fontSize:13, fontWeight:700, marginBottom:12, textDecoration:'none' }}>
          Get Free API Key
        </a>
        <p style={{ color:C.textDim, fontSize:12, marginTop:8 }}>Then paste it in Settings</p>
      </div>
    );

    if (!qs) return (
      <div style={{padding:30, textAlign:'center'}}>
        <p style={{color:C.textMid, fontSize:14, marginBottom:8}}>AI-generated practice adapted to your performance</p>
        <p style={{color:C.textMid, fontSize:13, marginBottom:4}}>5 VIC + 4 TC + 3 SE + 1 RC passage</p>
        <p style={{color:C.textDim, fontSize:12, marginBottom:20}}>= 15 GRE-format questions per session</p>
        {weakWords.length > 0 && (
          <div style={{background:C.redBg, border:`1px solid ${C.red}44`, borderRadius:8, padding:'10px 16px', marginBottom:20, display:'inline-block'}}>
            <p style={{color:C.red, fontSize:12, marginBottom:4, fontWeight:700}}>Words being prioritized:</p>
            <p style={{color:C.textMid, fontSize:11, fontFamily:'Courier New,monospace'}}>{weakWords.slice(0,10).join(' · ')}</p>
          </div>
        )}
        <div><Btn onClick={load}>Generate AI Questions</Btn></div>
      </div>
    );

    return (
      <>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginBottom:16}}>
          <Btn small variant={timed?'blue':'ghost'} onClick={()=>setTimed(t=>!t)}>
            {timed ? '⏱ Timed ON' : '⏱ Timed OFF'}
          </Btn>
          <Btn small variant="ghost" onClick={()=>{setQs(null);onCacheQuestions?.(null);setSectionScores(s=>({...s,vic:null,tc:null,se:null,rc:null}));}}>↺ Regenerate</Btn>
        </div>
        <div style={{marginBottom:32}}><VocabInContext questions={qs.vic} onComplete={handleVICComplete} timed={timed}/></div>
        <div style={{marginBottom:32}}><TCSection questions={qs.tc} onComplete={handleTCComplete} timed={timed}/></div>
        <div style={{marginBottom:32}}><SESection questions={qs.se} onComplete={handleSEComplete} timed={timed}/></div>
        {qs.rc && qs.rc.length > 0 && <div style={{marginBottom:32}}><RCSection passages={qs.rc} onComplete={handleRCComplete} timed={timed}/></div>}
      </>
    );
  };

  return (
    <div>
      {Object.values(sectionScores).some(v => v !== null) && (
        <div style={{display:'flex', gap:10, marginBottom:20, flexWrap:'wrap'}}>
          {sectionScores.contrast!==null&&<Tag color={C.goldBr}>Match: {sectionScores.contrast}/5</Tag>}
          {sectionScores.vic!==null&&qs&&<Tag color={C.gold}>VIC: {sectionScores.vic}/{qs.vic.length}</Tag>}
          {sectionScores.tc!==null&&qs&&<Tag color={C.blue}>TC: {sectionScores.tc}/{qs.tc.reduce((a,q)=>a+q.blanks.length,0)}</Tag>}
          {sectionScores.se!==null&&qs&&<Tag color={C.green}>SE: {sectionScores.se}/{qs.se.length}</Tag>}
          {sectionScores.rc!==null&&qs&&qs.rc&&<Tag color={C.greenBr}>RC: {sectionScores.rc}/{qs.rc.reduce((a,p)=>a+p.questions.length,0)}</Tag>}
        </div>
      )}

      <div style={{marginBottom:32}}>
        <ContrastRecall day={day} onComplete={handleContrastComplete} />
      </div>

      <div style={{borderTop:`1px solid ${C.border}`, margin:'8px 0 24px', position:'relative'}}>
        <span style={{position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:C.bg, padding:'0 12px', fontSize:11, color:C.textDim, textTransform:'uppercase', letterSpacing:'0.1em'}}>AI-Generated Sections</span>
      </div>

      {renderAISections()}
    </div>
  );
}
