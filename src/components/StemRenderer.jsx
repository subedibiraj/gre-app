import C from '../theme';

export default function StemRenderer({ stem, blanks, selections, isChecked }) {
  const parts = [];
  let remaining = stem;
  let blankIdx  = 0;

  while (remaining) {
    const b1 = remaining.indexOf('[B1]');
    const b2 = remaining.indexOf('[B2]');
    const us = remaining.search(/_+/);

    const cands = [
      b1>=0 ? {pos:b1, len:4, idx:0} : null,
      b2>=0 ? {pos:b2, len:4, idx:1} : null,
      us>=0 ? {pos:us, len:remaining.match(/_+/)[0].length, idx:blankIdx} : null,
    ].filter(Boolean).sort((a,b)=>a.pos-b.pos);

    if (!cands.length) { parts.push({type:'text', content:remaining}); break; }
    const {pos, len, idx} = cands[0];
    if (pos > 0) parts.push({type:'text', content:remaining.slice(0,pos)});
    parts.push({type:'blank', idx});
    blankIdx = Math.max(blankIdx, idx+1);
    remaining = remaining.slice(pos+len);
  }

  return (
    <p style={{color:C.text, fontSize:15, lineHeight:1.9, marginBottom:16}}>
      {parts.map((p,i) => {
        if (p.type==='text') return <span key={i}>{p.content}</span>;
        const blank   = blanks[p.idx];
        const sel     = selections?.[p.idx];
        const selOpt  = blank?.opts?.find(o=>o.l===sel);
        const correct = isChecked && sel===blank?.answer;
        const wrong   = isChecked && sel && sel!==blank?.answer;
        return (
          <span key={i} style={{
            display:'inline-block', minWidth: 90, textAlign:'center',
            background: !isChecked ? C.cardHi : correct ? C.greenBg : wrong ? C.redBg : C.cardHi,
            border:`1px solid ${!isChecked ? C.borderHi : correct ? C.green : wrong ? C.red : C.borderHi}`,
            borderRadius:4, padding:'2px 12px', margin:'0 3px',
            color: correct ? C.greenBr : wrong ? C.red : selOpt ? C.gold : C.textDim,
            fontFamily:'Courier New,monospace', fontWeight:700, fontSize:13,
            transition:'all 0.2s',
          }}>
            {selOpt ? selOpt.t : blank?.label || `Blank ${p.idx+1}`}
            {correct && ' ✓'}{wrong && ' ✗'}
          </span>
        );
      })}
    </p>
  );
}
