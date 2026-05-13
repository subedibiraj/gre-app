import { useState } from 'react';
import C from '../theme';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import Btn from '../components/Btn';
import Timer from '../components/Timer';

export default function SESection({ questions, onComplete, timed = false }) {
  const [qIdx, setQIdx]        = useState(0);
  const [selected, setSelected] = useState(questions.map(()=>[]));
  const [checked, setChecked]   = useState(questions.map(()=>false));
  const [timedOut, setTimedOut]  = useState(questions.map(()=>false));

  const q = questions[qIdx], sel = selected[qIdx], isChecked = checked[qIdx];

  const toggle = l => {
    if (isChecked || timedOut[qIdx]) return;
    setSelected(s=>{
      const n=s.map(x=>[...x]);
      n[qIdx]=n[qIdx].includes(l)?n[qIdx].filter(x=>x!==l):n[qIdx].length<2?[...n[qIdx],l]:n[qIdx];
      return n;
    });
  };

  const checkQ = () => {
    const newChecked = checked.map((c,i)=>i===qIdx?true:c);
    setChecked(newChecked);
    if (newChecked.every(Boolean)) {
      const correct = questions.filter((qq,i)=>{
        const s = i===qIdx ? sel : selected[i];
        return qq.answers.every(a=>s.includes(a)) && s.length===2;
      }).length;
      setTimeout(()=>onComplete(correct, questions.length), 400);
    }
  };

  const handleTimeUp = () => {
    setTimedOut(t=>{const n=[...t];n[qIdx]=true;return n;});
    checkQ();
  };

  const optState = l => {
    if (!isChecked) return sel.includes(l)?'selected':'idle';
    if (q.answers.includes(l)) return 'correct';
    if (sel.includes(l) && !q.answers.includes(l)) return 'wrong';
    return 'idle';
  };

  const stStyle = st => {
    if (st==='correct') return {border:`1px solid ${C.green}`, background:C.greenBg, color:C.greenBr};
    if (st==='wrong')   return {border:`1px solid ${C.red}`,   background:C.redBg,   color:C.red};
    if (st==='selected')return {border:`1px solid ${C.gold}`,  background:C.goldDim+'44', color:C.gold};
    return {border:`1px solid ${C.border}`, background:C.surface, color:C.textMid};
  };

  return (
    <div>
      <SectionHead label="Sentence Equivalence" count={`${questions.length} questions · AI adaptive`} color={C.gold}/>
      <div style={{background:C.goldDim+'33', border:`1px solid ${C.goldDim}`, borderRadius:8, padding:'10px 14px', marginBottom:16}}>
        <span style={{color:C.gold, fontSize:12, fontWeight:700}}>SE RULE  </span>
        <span style={{color:C.goldBr, fontSize:12}}>Select EXACTLY 2 answers. Both must fit AND produce sentences alike in meaning. 1 answer = 0 points on the real GRE.</span>
      </div>
      <div style={{display:'flex', gap:8, marginBottom:16, alignItems:'center'}}>
        {questions.map((_,i) => (
          <button key={i} onClick={()=>setQIdx(i)} style={{
            width:36, height:36, borderRadius:6, border:'none', cursor:'pointer',
            fontWeight:700, fontSize:13, transition:'all 0.15s',
            background: i===qIdx?C.gold:checked[i]?C.green+'33':C.surface,
            color: i===qIdx?'#07090F':checked[i]?C.greenBr:C.textMid,
          }}>Q{i+1}</button>
        ))}
        {timed && !isChecked && (
          <div style={{marginLeft:'auto'}}>
            <Timer key={qIdx} seconds={60} onTimeUp={handleTimeUp} label="⏱" />
          </div>
        )}
      </div>
      <Card>
        {timedOut[qIdx] && !checked[qIdx] && (
          <div style={{background:C.redBg, border:`1px solid ${C.red}44`, borderRadius:6, padding:'8px 12px', marginBottom:12}}>
            <span style={{color:C.red, fontSize:12, fontWeight:700}}>⏱ Time's up! Answer auto-submitted.</span>
          </div>
        )}
        <p style={{color:C.text, fontSize:15, lineHeight:1.9, marginBottom:16}}>{q.stem}</p>
        <p style={{color:C.textMid, fontSize:12, marginBottom:12}}>
          Select 2 words · <strong style={{color:sel.length===2?C.gold:C.textDim}}>{sel.length}/2 chosen</strong>
        </p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16}}>
          {q.opts.map(opt => {
            const st = optState(opt.l);
            return (
              <button key={opt.l} onClick={()=>toggle(opt.l)} style={{
                padding:'10px 14px', borderRadius:6, cursor:isChecked?'default':'pointer',
                textAlign:'left', transition:'all 0.15s', fontSize:13,
                fontFamily:'Courier New,monospace', fontWeight:st!=='idle'?700:400, ...stStyle(st),
              }}>
                <span style={{color:C.textDim, marginRight:8}}>{opt.l}.</span>{opt.t}
                {st==='correct'&&' ✓'}{st==='wrong'&&' ✗'}
              </button>
            );
          })}
        </div>
        {isChecked && (
          <div style={{background:C.surface, borderRadius:8, padding:14, borderLeft:`3px solid ${C.gold}`, marginBottom:12}}>
            <p style={{fontSize:10, color:C.gold, fontWeight:700, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em'}}>Explanation</p>
            <p style={{color:C.text, fontSize:13, lineHeight:1.8, margin:0, whiteSpace:'pre-line'}}>{q.explain}</p>
          </div>
        )}
        <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
          {!isChecked && <Btn onClick={checkQ} disabled={sel.length!==2}>{sel.length===2?'Check Answers →':`Need ${2-sel.length} more`}</Btn>}
          {isChecked && qIdx < questions.length-1 && <Btn variant="ghost" onClick={()=>setQIdx(i=>i+1)}>Next Question →</Btn>}
        </div>
      </Card>
    </div>
  );
}
