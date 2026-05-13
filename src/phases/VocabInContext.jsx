import { useState } from 'react';
import C from '../theme';
import { updateWordSR } from '../engine/spaced';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import Btn from '../components/Btn';
import Timer from '../components/Timer';

export default function VocabInContext({ questions, onComplete, timed = false }) {
  const [qIdx, setQIdx]       = useState(0);
  const [selected, setSelected] = useState(questions.map(()=>null));
  const [checked, setChecked]   = useState(questions.map(()=>false));
  const [timedOut, setTimedOut]  = useState(questions.map(()=>false));

  const q = questions[qIdx], sel = selected[qIdx], isChecked = checked[qIdx];

  const select = (letter) => {
    if (isChecked || timedOut[qIdx]) return;
    setSelected(s=>{const n=[...s];n[qIdx]=letter;return n;});
  };

  const checkQ = () => {
    const isCorrect = sel === q.answer;
    updateWordSR(q.word, isCorrect);
    const newChecked = checked.map((c,i)=>i===qIdx?true:c);
    setChecked(newChecked);
    if (newChecked.every(Boolean)) {
      const correct = questions.filter((qq,i)=>{
        const s = i===qIdx ? sel : selected[i];
        return s===qq.answer;
      }).length;
      const wrong = questions.filter((qq,i)=>{
        const s = i===qIdx ? sel : selected[i];
        return s!==qq.answer;
      }).map(qq=>qq.word);
      setTimeout(()=>onComplete(correct, questions.length, wrong), 400);
    }
  };

  const handleTimeUp = () => {
    setTimedOut(t=>{const n=[...t];n[qIdx]=true;return n;});
    checkQ();
  };

  return (
    <div>
      <SectionHead label="Vocab in Context" count={`${questions.length} questions · AI generated`} color={C.goldBr}/>
      <p style={{color:C.textMid, fontSize:12, marginBottom:16, lineHeight:1.6}}>
        Read the sentence carefully. What does the <strong style={{color:C.gold}}>highlighted word</strong> most nearly mean in this context?
      </p>

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
            <Timer key={qIdx} seconds={45} onTimeUp={handleTimeUp} label="⏱" />
          </div>
        )}
      </div>

      <Card>
        {timedOut[qIdx] && !checked[qIdx] && (
          <div style={{background:C.redBg, border:`1px solid ${C.red}44`, borderRadius:6, padding:'8px 12px', marginBottom:12}}>
            <span style={{color:C.red, fontSize:12, fontWeight:700}}>⏱ Time's up!</span>
          </div>
        )}

        {/* The sentence with highlighted word */}
        <div style={{background:C.surface, borderRadius:8, padding:'16px 18px', marginBottom:16, borderLeft:`3px solid ${C.gold}`}}>
          <p style={{color:C.text, fontSize:15, lineHeight:1.9, margin:0}}>
            {q.sentence.split(new RegExp(`(${q.word})`, 'i')).map((part, i) =>
              part.toUpperCase() === q.word.toUpperCase()
                ? <strong key={i} style={{color:C.gold, background:C.goldDim+'44', padding:'2px 6px', borderRadius:4, fontFamily:'Courier New,monospace'}}>{part}</strong>
                : <span key={i}>{part}</span>
            )}
          </p>
        </div>

        <p style={{color:C.textMid, fontSize:12, marginBottom:12, fontWeight:700}}>
          As used in the passage, "{q.word}" most nearly means:
        </p>

        <div style={{display:'grid', gap:8, marginBottom:16}}>
          {q.opts.map(opt => {
            const isSel = sel===opt.l;
            const correct = isChecked && opt.l===q.answer;
            const wrong = isChecked && isSel && opt.l!==q.answer;
            return (
              <button key={opt.l} onClick={()=>select(opt.l)} style={{
                padding:'10px 16px', borderRadius:6, textAlign:'left',
                cursor:isChecked?'default':'pointer', transition:'all 0.15s', fontSize:13,
                border:`1px solid ${correct?C.green:wrong?C.red:isSel?C.gold:C.border}`,
                background: correct?C.greenBg:wrong?C.redBg:isSel?C.goldDim+'44':C.surface,
                color: correct?C.greenBr:wrong?C.red:isSel?C.gold:C.textMid,
                fontWeight:isSel||correct?700:400,
              }}>
                <span style={{color:C.textDim, marginRight:10, fontFamily:'Courier New,monospace'}}>{opt.l}.</span>
                {opt.t}{correct?' ✓':wrong?' ✗':''}
              </button>
            );
          })}
        </div>

        {isChecked && (
          <div style={{background:C.surface, borderRadius:8, padding:14, borderLeft:`3px solid ${C.goldBr}`, marginBottom:12}}>
            <p style={{fontSize:10, color:C.goldBr, fontWeight:700, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em'}}>Why this answer</p>
            <p style={{color:C.text, fontSize:13, lineHeight:1.8, margin:0, whiteSpace:'pre-line'}}>{q.explain}</p>
          </div>
        )}

        <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
          {!isChecked && <Btn onClick={checkQ} disabled={!sel}>{sel?'Check →':'Select an answer'}</Btn>}
          {isChecked && qIdx < questions.length-1 && <Btn variant="ghost" onClick={()=>setQIdx(i=>i+1)}>Next →</Btn>}
        </div>
      </Card>
    </div>
  );
}
