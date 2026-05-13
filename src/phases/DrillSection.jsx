import { useState } from 'react';
import C from '../theme';
import { chk } from '../utils';
import { updateWordSR } from '../engine/spaced';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import Btn from '../components/Btn';

export default function DrillSection({ questions, onComplete }) {
  const [vals, setVals]       = useState(questions.map(()=>''));
  const [checked, setChecked] = useState(false);

  const submit = () => {
    const results = questions.map((q, i) => ({ word: q.a, correct: chk(vals[i], q.a) }));
    const wrong = results.filter(r => !r.correct).map(r => r.word);
    const correct = results.filter(r => r.correct).length;

    // Update spaced repetition for each word
    results.forEach(r => updateWordSR(r.word, r.correct));

    setChecked(true);
    onComplete(correct, questions.length, wrong);
  };

  return (
    <div>
      <SectionHead label="Day Recall" count={`${questions.length} questions · AI generated`} color={C.goldBr}/>
      <p style={{color:C.textMid, fontSize:12, marginBottom:18, lineHeight:1.6}}>
        Today's words only. Type the word that best matches each description.
      </p>
      {questions.map((q, i) => {
        const correct = chk(vals[i], q.a);
        return (
          <Card key={q.id} style={{marginBottom:10}}>
            <p style={{color:C.textMid, fontSize:11, marginBottom:4}}>Q{i+1} of {questions.length}</p>
            <p style={{color:C.text, fontSize:14, marginBottom:10, lineHeight:1.6}}>{q.q}</p>
            <input value={vals[i]} onChange={e=>{const n=[...vals];n[i]=e.target.value;setVals(n);}}
              placeholder="Your answer..."
              disabled={checked}
              style={{width:'100%', background:!checked?C.surface:correct?C.greenBg:C.redBg,
                border:`1px solid ${!checked?C.border:correct?C.green:C.red}`,
                borderRadius:6, padding:'8px 12px', color:C.text,
                fontFamily:'Courier New,monospace', fontSize:13, fontWeight:700,
                letterSpacing:'0.1em', outline:'none', textTransform:'uppercase',
                boxSizing:'border-box', transition:'all 0.2s'}}/>
            {checked && (
              <div style={{marginTop:6}}>
                {correct
                  ? <span style={{color:C.greenBr, fontSize:12, fontWeight:700}}>✓ Correct</span>
                  : <span style={{color:C.textMid, fontSize:12}}>✗ → <strong style={{color:C.goldBr, fontFamily:'Courier New,monospace'}}>{q.a}</strong></span>
                }
              </div>
            )}
          </Card>
        );
      })}
      {!checked ? (
        <div style={{textAlign:'right', marginTop:12}}>
          <Btn onClick={submit}>Check Answers →</Btn>
        </div>
      ) : (
        <div style={{textAlign:'right', marginTop:12}}>
          <Btn variant="success" onClick={()=>{}}>
            ✓ {questions.filter((q,i)=>chk(vals[i],q.a)).length}/{questions.length} correct — scroll to TC ↓
          </Btn>
        </div>
      )}
    </div>
  );
}
