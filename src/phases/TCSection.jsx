import { useState } from 'react';
import C from '../theme';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import StemRenderer from '../components/StemRenderer';
import Btn from '../components/Btn';

export default function TCSection({ questions, onComplete }) {
  const [qIdx, setQIdx]       = useState(0);
  const [selections, setSel]  = useState(questions.map(q=>q.blanks.map(()=>null)));
  const [checked, setChecked] = useState(questions.map(()=>false));
  const [partScores, setPart] = useState(questions.map(()=>0));

  const q = questions[qIdx], sel = selections[qIdx], isChecked = checked[qIdx];

  const select = (bIdx, l) => {
    if (isChecked) return;
    setSel(s=>{const n=s.map(x=>[...x]);n[qIdx][bIdx]=l;return n;});
  };

  const checkQ = () => {
    const score = q.blanks.filter((b,i)=>sel[i]===b.answer).length;
    setChecked(c=>{const n=[...c];n[qIdx]=true;return n;});
    setPart(p=>{const n=[...p];n[qIdx]=score;return n;});
    const newChecked = checked.map((c,i)=>i===qIdx?true:c);
    if (newChecked.every(Boolean)) {
      const total = questions.reduce((a,qq)=>a+qq.blanks.length,0);
      const correct = [...partScores.slice(0,qIdx), score, ...partScores.slice(qIdx+1)].reduce((a,b)=>a+b,0);
      setTimeout(()=>onComplete(correct, total), 400);
    }
  };

  return (
    <div>
      <SectionHead label="Text Completion" count={`${questions.length} questions · AI adaptive`} color={C.blue}/>
      <div style={{display:'flex', gap:8, marginBottom:16}}>
        {questions.map((_,i) => (
          <button key={i} onClick={()=>setQIdx(i)} style={{
            width:36, height:36, borderRadius:6, border:'none', cursor:'pointer',
            fontWeight:700, fontSize:13, transition:'all 0.15s',
            background: i===qIdx?C.blue:checked[i]?C.green+'33':C.surface,
            color: i===qIdx?'#fff':checked[i]?C.greenBr:C.textMid,
          }}>Q{i+1}</button>
        ))}
      </div>
      <Card>
        <p style={{fontSize:11, color:C.textDim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:14}}>
          ◆ Find the pivot word or clue phrase — then pick each option
        </p>
        <StemRenderer stem={q.stem} blanks={q.blanks} selections={sel} isChecked={isChecked}/>
        {q.blanks.map((blank, bIdx) => (
          <div key={bIdx} style={{marginBottom:14}}>
            <p style={{color:C.textMid, fontSize:12, marginBottom:8, fontWeight:700}}>{blank.label}</p>
            <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
              {blank.opts.map(opt => {
                const isSel = sel[bIdx]===opt.l;
                const correct = isChecked && opt.l===blank.answer;
                const wrong = isChecked && isSel && opt.l!==blank.answer;
                return (
                  <button key={opt.l} onClick={()=>select(bIdx, opt.l)} style={{
                    padding:'8px 16px', borderRadius:6, cursor:isChecked?'default':'pointer',
                    border:`1px solid ${correct?C.green:wrong?C.red:isSel?C.gold:C.border}`,
                    background: correct?C.greenBg:wrong?C.redBg:isSel?C.goldDim+'44':C.surface,
                    color: correct?C.greenBr:wrong?C.red:isSel?C.gold:C.textMid,
                    fontWeight:isSel||correct?700:400, fontSize:13, transition:'all 0.15s',
                    fontFamily:'Courier New,monospace',
                  }}>
                    <span style={{color:C.textDim, marginRight:6}}>{opt.l}.</span>
                    {opt.t}{correct?' ✓':wrong?' ✗':''}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {isChecked && (
          <div style={{marginTop:14, background:C.surface, borderRadius:8, padding:14, borderLeft:`3px solid ${C.blue}`}}>
            <p style={{fontSize:10, color:C.blue, fontWeight:700, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em'}}>Explanation</p>
            <p style={{color:C.text, fontSize:13, lineHeight:1.8, margin:0}}>{q.explain}</p>
          </div>
        )}
        <div style={{marginTop:14, display:'flex', justifyContent:'flex-end', gap:10}}>
          {!isChecked && <Btn onClick={checkQ} disabled={!sel.every(s=>s!==null)}>{sel.every(s=>s!==null)?'Check Answer →':'Select all blanks first'}</Btn>}
          {isChecked && qIdx < questions.length-1 && <Btn variant="ghost" onClick={()=>setQIdx(i=>i+1)}>Next Question →</Btn>}
        </div>
      </Card>
    </div>
  );
}
