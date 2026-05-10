import C from '../theme';
import { DAYS } from '../data/days';
import Card from '../components/Card';
import Tag from '../components/Tag';
import SectionHead from '../components/SectionHead';

export default function ScoreOverview({ dayScores, weakWords }) {
  const totalWords = DAYS.reduce((a,d)=>a+d.words.length,0);
  const daysCompleted = Object.values(dayScores).filter(d=>Object.keys(d).length>0).length;

  return (
    <div>
      <SectionHead label="Progress Overview" color={C.greenBr}/>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24}}>
        {[
          {label:'Words Learned', val:totalWords, color:C.gold},
          {label:'Days Completed', val:`${daysCompleted}/7`, color:C.blue},
          {label:'Words to Drill', val:weakWords.length, color:weakWords.length>0?C.red:C.green},
        ].map(s=>(
          <Card key={s.label} style={{textAlign:'center'}}>
            <p style={{fontFamily:'Georgia,serif', fontSize:32, fontWeight:700, color:s.color, margin:0}}>{s.val}</p>
            <p style={{color:C.textMid, fontSize:12, marginTop:4}}>{s.label}</p>
          </Card>
        ))}
      </div>
      <table style={{width:'100%', borderCollapse:'collapse', marginBottom:20}}>
        <thead>
          <tr>{['Day','Theme','Drill','TC','SE'].map(h=>(
            <th key={h} style={{padding:'8px 10px', textAlign:'left', fontSize:10, color:C.textDim, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', borderBottom:`1px solid ${C.border}`}}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {DAYS.map((d,i)=>{
            const sc = dayScores[d.day]||{};
            return (
              <tr key={d.day} style={{background:i%2===0?'transparent':C.surface+'88'}}>
                <td style={{padding:'10px',color:C.gold,fontWeight:700,fontSize:13}}>D{d.day}</td>
                <td style={{padding:'10px',color:C.text,fontSize:12}}>{d.theme}</td>
                <td style={{padding:'10px',fontFamily:'Courier New,monospace',fontSize:12, color:sc.drill!=null?C.greenBr:C.textDim}}>{sc.drill!=null?`${sc.drill}/7`:'—'}</td>
                <td style={{padding:'10px',fontFamily:'Courier New,monospace',fontSize:12, color:sc.tc!=null?C.blue:C.textDim}}>{sc.tc!=null?`${sc.tc}`:'—'}</td>
                <td style={{padding:'10px',fontFamily:'Courier New,monospace',fontSize:12, color:sc.se!=null?C.gold:C.textDim}}>{sc.se!=null?`${sc.se}/2`:'—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {weakWords.length > 0 && (
        <Card style={{background:C.redBg, borderColor:C.red+'44'}}>
          <p style={{color:C.red, fontSize:12, fontWeight:700, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.1em'}}>Words to Keep Drilling ({weakWords.length})</p>
          <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
            {weakWords.map(w=><Tag key={w} color={C.red}>{w}</Tag>)}
          </div>
          <p style={{color:C.textDim, fontSize:11, marginTop:10}}>These words will be prioritized in your next practice session.</p>
        </Card>
      )}
    </div>
  );
}
