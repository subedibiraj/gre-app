import { useState, useEffect } from 'react';
import C from '../theme';
import Card from '../components/Card';
import Btn from '../components/Btn';
import Tag from '../components/Tag';
import StemRenderer from '../components/StemRenderer';
import ChartRenderer from '../components/ChartRenderer';
import { getErrorLog, resolveMistake } from '../engine/error-log';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, ChevronRight, Filter, AlertTriangle } from 'lucide-react';

export default function ErrorLogView() {
  const [log, setLog] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('all'); // all, verbal, quant
  const [statusFilter, setStatusFilter] = useState('unresolved'); // unresolved, resolved
  
  useEffect(() => {
    setLog(getErrorLog(subjectFilter, statusFilter === 'resolved'));
    const handleUpdate = () => setLog(getErrorLog(subjectFilter, statusFilter === 'resolved'));
    window.addEventListener('gre_errorLog_updated', handleUpdate);
    return () => window.removeEventListener('gre_errorLog_updated', handleUpdate);
  }, [subjectFilter, statusFilter]);

  const unresolvedCount = getErrorLog('all', false).length;

  return (
    <div style={{ padding: '0 20px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: C.gold, margin: 0 }}>The Black Book</h2>
          <p style={{ color: C.textMid, fontSize: 14, margin: '4px 0 0' }}>
            Review and resolve your mistakes. High-scorers never make the same mistake twice.
          </p>
        </div>
        {unresolvedCount > 0 && (
          <div style={{ background: `${C.red}18`, border: `1px solid ${C.red}44`, borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} color={C.red} />
            <span style={{ color: C.red, fontWeight: 700, fontSize: 13 }}>{unresolvedCount} Unresolved</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {['unresolved', 'resolved'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
            border: `1px solid ${statusFilter === f ? C.gold : C.border}`,
            background: statusFilter === f ? C.gold + '22' : C.surface,
            color: statusFilter === f ? C.gold : C.textMid, fontWeight: statusFilter === f ? 700 : 400,
            textTransform: 'capitalize',
          }}>
            {f}
          </button>
        ))}
        <div style={{ width: 1, background: C.border, margin: '0 4px' }} />
        {['all', 'verbal', 'quant'].map(f => (
          <button key={f} onClick={() => setSubjectFilter(f)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
            border: `1px solid ${subjectFilter === f ? C.blue : C.border}`,
            background: subjectFilter === f ? C.blue + '22' : C.surface,
            color: subjectFilter === f ? C.blue : C.textMid, fontWeight: subjectFilter === f ? 700 : 400,
            textTransform: 'capitalize',
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Log Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {log.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '40px 20px', borderStyle: 'dashed' }}>
            <span style={{ fontSize: 40, opacity: 0.5 }}>✨</span>
            <p style={{ color: C.textMid, fontSize: 15, fontWeight: 700, marginTop: 12 }}>
              No {statusFilter} mistakes found.
            </p>
            <p style={{ color: C.textDim, fontSize: 13 }}>
              Keep practicing to generate data for your error log.
            </p>
          </Card>
        ) : (
          log.map(entry => (
            <ErrorLogEntry key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}

function ErrorLogEntry({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const q = entry.q;
  const isVerbal = entry.subject === 'verbal';
  
  // Format user answer preview
  let userAnsPreview = String(entry.userAnswer);
  if (Array.isArray(entry.userAnswer)) userAnsPreview = entry.userAnswer.join(', ');
  
  return (
    <Card style={{ padding: 0, overflow: 'hidden', borderLeft: `4px solid ${entry.resolved ? C.green : C.red}` }}>
      {/* Header (Always visible) */}
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{ 
          padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', background: expanded ? C.surface : 'transparent'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Tag color={isVerbal ? C.blue : C.gold}>{entry.topic.toUpperCase()}</Tag>
            <span style={{ color: C.textDim, fontSize: 11 }}>
              {new Date(entry.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p style={{ 
            color: C.text, fontSize: 14, margin: 0, fontFamily: 'Georgia,serif',
            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' 
          }}>
            {q.stem || q.q || q.qtyA || q.question}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {!expanded && (
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: C.red, fontSize: 11, fontWeight: 700 }}>You: {userAnsPreview}</span>
            </div>
          )}
          <ChevronRight size={20} color={C.textDim} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.border}` }}>
              {/* Question Context */}
              {q.passageText && (
                <div style={{ background: C.surface, padding: 16, borderRadius: 8, marginTop: 16, marginBottom: 16 }}>
                  <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Passage</p>
                  <p style={{ color: C.text, fontSize: 13, lineHeight: 1.6, margin: 0, fontFamily: 'Georgia,serif' }}>
                    {q.passageText.substring(0, 300)}... <span style={{ color: C.gold }}>(truncated)</span>
                  </p>
                </div>
              )}
              {q.chart && (
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <ChartRenderer data={q.chart} type={q.chart.type || 'bar'} height={200} />
                </div>
              )}

              {/* Full Question */}
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                {q.qtyA ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 0, marginBottom: 12 }}>
                    <div style={{ background: `${C.blue}12`, borderRadius: '8px 0 0 8px', padding: '12px 14px', textAlign: 'center' }}>
                      <p style={{ color: C.blue, fontSize: 9, textTransform: 'uppercase' }}>Qty A</p>
                      <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{q.qtyA}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.surface }}>
                      <span style={{ color: C.textDim, fontSize: 10, fontWeight: 700 }}>vs</span>
                    </div>
                    <div style={{ background: `${C.gold}12`, borderRadius: '0 8px 8px 0', padding: '12px 14px', textAlign: 'center' }}>
                      <p style={{ color: C.gold, fontSize: 9, textTransform: 'uppercase' }}>Qty B</p>
                      <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{q.qtyB}</p>
                    </div>
                  </div>
                ) : q.stem && q.blanks ? (
                  <div style={{ marginBottom: 16 }}>
                    <StemRenderer stem={q.stem} blanks={q.blanks} selections={q.blanks.map(b => b.answer)} isChecked={true} />
                  </div>
                ) : (
                  <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6, fontFamily: 'Georgia,serif', marginBottom: 12 }}>
                    {q.q || q.question}
                  </p>
                )}
              </div>

              {/* Options / Answers */}
              {q.opts && (
                <div style={{ display: 'grid', gap: 6, marginBottom: 16 }}>
                  {q.opts.map((opt) => {
                    const l = opt.l || opt[0];
                    const t = opt.t || opt.substring(3) || opt;
                    const isCorrect = q.answers ? q.answers.includes(l) : l === q.answer;
                    const isUserAns = Array.isArray(entry.userAnswer) ? entry.userAnswer.includes(l) : entry.userAnswer === l;
                    
                    return (
                      <div key={l} style={{
                        padding: '10px 14px', borderRadius: 8, fontSize: 13,
                        border: `1px solid ${isCorrect ? C.green : isUserAns ? C.red : C.border}`,
                        background: isCorrect ? C.green + '18' : isUserAns ? C.red + '18' : C.surface,
                        color: isCorrect ? C.greenBr : isUserAns ? C.red : C.textMid,
                        display: 'flex', justifyContent: 'space-between'
                      }}>
                        <span><span style={{ opacity: 0.5, marginRight: 8 }}>{l}.</span>{t}</span>
                        {isCorrect && <span>✓ Correct</span>}
                        {isUserAns && !isCorrect && <span>✗ Your Answer</span>}
                      </div>
                    )
                  })}
                </div>
              )}
              
              {!q.opts && q.answer && !q.blanks && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div style={{ flex: 1, padding: 12, background: C.red + '18', border: `1px solid ${C.red}`, borderRadius: 8 }}>
                    <p style={{ color: C.red, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}>Your Answer</p>
                    <p style={{ color: C.red, fontSize: 14, fontWeight: 700, margin: 0 }}>{entry.userAnswer || '(Blank)'}</p>
                  </div>
                  <div style={{ flex: 1, padding: 12, background: C.green + '18', border: `1px solid ${C.green}`, borderRadius: 8 }}>
                    <p style={{ color: C.greenBr, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}>Correct Answer</p>
                    <p style={{ color: C.greenBr, fontSize: 14, fontWeight: 700, margin: 0 }}>{q.answer}</p>
                  </div>
                </div>
              )}

              {/* Explanation */}
              {q.explain && (
                <div style={{ background: `linear-gradient(135deg, ${C.gold}10, transparent)`, borderRadius: 8, padding: '14px 16px', borderLeft: `3px solid ${C.gold}`, marginBottom: 16 }}>
                  <p style={{ fontSize: 10, color: C.gold, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>💡 Explanation</p>
                  <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{q.explain}</p>
                </div>
              )}

              {/* Actions */}
              {!entry.resolved && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <Btn small onClick={(e) => { e.stopPropagation(); resolveMistake(entry.id); }}>
                    <CheckCircle2 size={16} style={{ marginRight: 6 }} /> Mark as Resolved
                  </Btn>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
