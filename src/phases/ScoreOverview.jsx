import C from '../theme';
import { DAYS } from '../data/days';
import { getSRStats, getAllSR, getSRLevel } from '../engine/spaced';
import { getStreak } from '../engine/streak';
import Card from '../components/Card';
import Tag from '../components/Tag';
import SectionHead from '../components/SectionHead';

export default function ScoreOverview({ dayScores, weakWords }) {
  const stats = getSRStats();
  const streak = getStreak();
  const allSR = getAllSR();
  const allWords = DAYS.flatMap(d => d.words);

  // Group words by SR level
  const levels = { 'Mastered': [], 'Strong': [], 'Familiar': [], 'Learning': [], 'Weak': [], 'New': [] };
  allWords.forEach(w => {
    const sr = getSRLevel(w.w);
    if (levels[sr.label]) levels[sr.label].push(w.w);
    else levels['New'].push(w.w);
  });

  return (
    <div>
      <SectionHead label="Progress Dashboard" count={`${allWords.length} total words`} color={C.greenBr}/>

      {/* Streak & Session Stats */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:24}}>
        {[
          { label: 'Current Streak', val: `${streak.current}`, icon: '🔥', color: C.gold },
          { label: 'Longest Streak', val: `${streak.longest}`, icon: '🏆', color: C.goldBr },
          { label: 'Total Sessions', val: `${streak.totalSessions}`, icon: '📝', color: C.blue },
          { label: 'Days Practiced', val: `${streak.totalDays}`, icon: '📅', color: C.greenBr },
        ].map(s => (
          <Card key={s.label} style={{textAlign:'center', padding:'16px 10px'}}>
            <p style={{fontSize:24, margin:'0 0 4px'}}>{s.icon}</p>
            <p style={{fontFamily:'Courier New,monospace', fontSize:24, fontWeight:700, color:s.color, margin:0}}>{s.val}</p>
            <p style={{fontSize:10, color:C.textDim, margin:'4px 0 0', textTransform:'uppercase', letterSpacing:'0.05em'}}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Mastery Breakdown */}
      <Card style={{marginBottom:24, padding:20}}>
        <p style={{fontSize:12, color:C.textDim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16, fontWeight:700}}>
          Vocabulary Mastery
        </p>

        {/* Stacked bar */}
        <div style={{display:'flex', height:24, borderRadius:6, overflow:'hidden', marginBottom:16, background:C.border}}>
          {[
            { key: 'Mastered', color: C.greenBr },
            { key: 'Strong', color: C.green },
            { key: 'Familiar', color: C.gold },
            { key: 'Learning', color: C.blue },
            { key: 'Weak', color: C.red },
            { key: 'New', color: C.textDim },
          ].map(l => {
            const pct = (levels[l.key].length / Math.max(allWords.length, 1)) * 100;
            if (pct === 0) return null;
            return (
              <div key={l.key} style={{
                width: `${pct}%`, background: l.color, transition: 'width 0.4s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#07090F', minWidth: pct > 5 ? 'auto' : 0,
              }}>
                {pct > 8 ? `${Math.round(pct)}%` : ''}
              </div>
            );
          })}
        </div>

        {/* Level breakdown */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10}}>
          {[
            { key: 'Mastered', color: C.greenBr, icon: '✅' },
            { key: 'Strong', color: C.green, icon: '💪' },
            { key: 'Familiar', color: C.gold, icon: '📗' },
            { key: 'Learning', color: C.blue, icon: '📘' },
            { key: 'Weak', color: C.red, icon: '⚠️' },
            { key: 'New', color: C.textDim, icon: '🆕' },
          ].map(l => (
            <div key={l.key} style={{
              background: C.surface, borderRadius: 8, padding: '10px 12px',
              borderLeft: `3px solid ${l.color}`,
            }}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span style={{fontSize:12, color:l.color, fontWeight:700}}>{l.icon} {l.key}</span>
                <span style={{fontFamily:'Courier New,monospace', fontSize:16, fontWeight:700, color:l.color}}>{levels[l.key].length}</span>
              </div>
              {levels[l.key].length > 0 && levels[l.key].length <= 8 && (
                <p style={{fontSize:10, color:C.textDim, margin:'6px 0 0', fontFamily:'Courier New,monospace', lineHeight:1.4}}>
                  {levels[l.key].join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Day-by-Day Scores */}
      <Card style={{marginBottom:24, padding:20}}>
        <p style={{fontSize:12, color:C.textDim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16, fontWeight:700}}>
          Day-by-Day Performance
        </p>
        <div style={{display:'grid', gap:10}}>
          {DAYS.map(d => {
            const sc = dayScores[d.day];
            if (!sc || Object.keys(sc).length === 0) return (
              <div key={d.day} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:C.surface, borderRadius:8, opacity:0.5}}>
                <span style={{fontFamily:'Courier New,monospace', fontWeight:700, color:C.textDim, width:24}}>D{d.day}</span>
                <span style={{color:C.textDim, fontSize:12}}>{d.theme}</span>
                <span style={{marginLeft:'auto', color:C.textDim, fontSize:11}}>Not practiced</span>
              </div>
            );
            return (
              <div key={d.day} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:C.surface, borderRadius:8}}>
                <span style={{fontFamily:'Courier New,monospace', fontWeight:700, color:C.greenBr, width:24}}>D{d.day}</span>
                <span style={{color:C.text, fontSize:12, flex:1}}>{d.theme}</span>
                <div style={{display:'flex', gap:6}}>
                  {sc.contrast!=null && <Tag color={C.goldBr}>Match: {sc.contrast}/{sc.contrastTotal}</Tag>}
                  {sc.drill!=null && <Tag color={C.gold}>Recall: {sc.drill}/{sc.drillTotal}</Tag>}
                  {sc.tc!=null && <Tag color={C.blue}>TC: {sc.tc}/{sc.tcTotal}</Tag>}
                  {sc.se!=null && <Tag color={C.green}>SE: {sc.se}/{sc.seTotal}</Tag>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Weak Words */}
      {weakWords.length > 0 && (
        <Card style={{padding:20, borderLeft:`3px solid ${C.red}`}}>
          <p style={{fontSize:12, color:C.red, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12, fontWeight:700}}>
            ⚠️ Words Needing Attention ({weakWords.length})
          </p>
          <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
            {weakWords.map(w => {
              const sr = getSRLevel(w);
              return (
                <span key={w} style={{
                  padding:'6px 14px', borderRadius:6, fontSize:12,
                  fontFamily:'Courier New,monospace', fontWeight:700,
                  background:C.redBg, border:`1px solid ${C.red}44`, color:sr.color,
                }}>{w}</span>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
