import { useState } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { clusterColor } from '../utils';
import { getSRLevel } from '../engine/spaced';
import Card from '../components/Card';
import Tag from '../components/Tag';
import SectionHead from '../components/SectionHead';
import Btn from '../components/Btn';

export default function VocabView({ day }) {
  const [expanded, setExpanded]    = useState(null);
  const [showAll, setShowAll]      = useState(false);
  const [clusterFilter, setFilter] = useState('All');

  const displayDay = DAYS[day-1];
  const prevWords  = DAYS.slice(0, day-1).flatMap(d => d.words);
  const words      = showAll ? [...displayDay.words, ...prevWords] : displayDay.words;
  const clusters   = ['All', ...new Set(words.map(w=>w.cluster))];
  const visible    = clusterFilter==='All' ? words : words.filter(w=>w.cluster===clusterFilter);

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
        <SectionHead label={`Day ${day} Vocabulary`} count={`${displayDay.words.length} words`} color={C.goldBr}/>
        {day > 1 && (
          <Btn small variant={showAll?'blue':'ghost'} onClick={()=>{setShowAll(s=>!s);setFilter('All');}}>
            {showAll ? `Showing all ${words.length} words` : `+ Show all prev days`}
          </Btn>
        )}
      </div>

      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:16}}>
        {clusters.map(cl => (
          <button key={cl} onClick={()=>setFilter(cl)} style={{
            padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:700,
            cursor:'pointer', border:'none', transition:'all 0.15s',
            background: clusterFilter===cl ? C.gold : C.surface,
            color: clusterFilter===cl ? '#07090F' : C.textMid,
          }}>{cl}</button>
        ))}
      </div>

      {visible.map(v => {
        const cc = clusterColor(v.cluster);
        const isOpen = expanded===v.w;
        const isToday = displayDay.words.some(w=>w.w===v.w);
        const sr = getSRLevel(v.w);
        return (
          <div key={v.w} onClick={()=>setExpanded(isOpen?null:v.w)} style={{marginBottom:8, cursor:'pointer'}}>
            <Card style={{borderColor:isOpen?cc+'66':C.border, background:isOpen?C.cardHi:C.card, transition:'all 0.2s'}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{width:3, height:32, background:cc, borderRadius:2, flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:2, flexWrap:'wrap'}}>
                    <span style={{fontFamily:'Courier New,monospace', fontSize:15, fontWeight:700, color:cc, letterSpacing:'0.08em'}}>{v.w}</span>
                    <Tag color={cc}>{v.pos}</Tag>
                    <Tag color={cc}>{v.cluster}</Tag>
                    {!isToday && <Tag color={C.textDim}>Day {DAYS.findIndex(d=>d.words.some(w=>w.w===v.w))+1}</Tag>}
                    <Tag color={sr.color}>{sr.label}</Tag>
                  </div>
                  {!isOpen && <p style={{color:C.textMid, fontSize:12, margin:0, lineHeight:1.5}}>{v.def}</p>}
                </div>
                <span style={{color:C.textDim, fontSize:14, marginLeft:8}}>{isOpen?'▲':'▼'}</span>
              </div>
              {isOpen && (
                <div style={{marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`}}>
                  <p style={{color:C.text, fontSize:14, lineHeight:1.7, marginBottom:10}}>{v.def}</p>
                  <div style={{background:C.surface, borderRadius:6, padding:12, marginBottom:10}}>
                    <p style={{fontSize:10, color:C.textDim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>Example</p>
                    <p style={{color:C.text, fontSize:13, fontStyle:'italic', lineHeight:1.7, margin:0}}>"{v.ex}"</p>
                  </div>
                  <div style={{background:C.goldDim+'33', borderRadius:6, padding:10, borderLeft:`3px solid ${C.gold}`}}>
                    <span style={{fontSize:10, color:C.gold, fontWeight:700}}>★ GRE TIP  </span>
                    <span style={{color:C.goldBr, fontSize:12, lineHeight:1.6}}>{v.tip}</span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        );
      })}

      <Card style={{marginTop:16, background:C.surface}}>
        <p style={{fontSize:11, color:C.textDim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10}}>Key Patterns — Day {day}</p>
        {displayDay.patterns.map((p,i) => (
          <p key={i} style={{color:C.text, fontSize:13, lineHeight:1.6, marginBottom:6}}>
            <span style={{color:C.gold, marginRight:8}}>→</span>{p}
          </p>
        ))}
      </Card>
    </div>
  );
}
