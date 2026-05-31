import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../lib/gemini';
import C from '../theme';
import { DAYS } from '../data/days';

const ALL_WORDS = DAYS.flatMap(d => d.words);

const SYSTEM_PROMPT = `You are an expert GRE Verbal tutor — precise, engaging, and deeply knowledgeable about etymology, usage patterns, and test strategy. Your teaching style is structured and conversational, combining intellectual rigor with memorable explanations.

CORE RULES:
1. Always explain GRE words with: etymology (root language), precise definition, usage context, and how the GRE specifically tests it.
2. When comparing words, highlight the EXACT nuance that separates them — GRE loves testing subtle distinctions.
3. Use vivid examples and memorable mental images to make words stick.
4. When asked about sentence completion or text completion strategy, explain the "clue word → prediction → match" approach.
5. Keep responses focused and structured — use bullet points, bold for key terms, and clear headers when appropriate.
6. If a student gets something wrong, don't just correct — explain WHY the wrong answer is tempting and HOW to avoid the trap.
7. You know all ${ALL_WORDS.length} words the student has studied across 7 days: ${ALL_WORDS.map(v => v.w).join(', ')}.
8. The 7 day themes are: ${DAYS.map(d => `Day ${d.day}: ${d.theme}`).join(', ')}.

STYLE: Think of yourself as a knowledgeable friend who happens to have scored 170V — warm but rigorous, never condescending, always pushing for deeper understanding. Use dashes and parenthetical asides for personality. Keep it concise but thorough.`;

export default function AiTutor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your GRE Verbal tutor. Ask me about any word, compare confusing pairs, or get strategy tips for TC/SE questions. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { label: '🔍 Explain a word', prompt: 'Explain the word HUBRIS — etymology, definition, GRE usage, and a memorable tip.' },
    { label: '⚖️ Compare words', prompt: 'What is the exact difference between HAUGHTY and SUPERCILIOUS? When would GRE use one vs the other?' },
    { label: '🧠 Quiz me', prompt: 'Give me a quick 3-question quiz on today\'s Arrogance & Boldness words. Make them GRE-style.' },
    { label: '💡 TC Strategy', prompt: 'Walk me through the best strategy for solving Text Completion questions on the GRE.' },
  ];

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${err.message}. Make sure the server is running (\`node server/index.js\`) and your GEMINI_API_KEY is set in .env` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position:'fixed', bottom:80, right:28, width:56, height:56,
        borderRadius:'50%', border:'none', cursor:'pointer',
        background:`linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
        color:'#07090F', fontSize:24, fontWeight:700,
        boxShadow:`0 4px 20px ${C.gold}44`, zIndex:100,
        transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center',
      }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        🤖
      </button>
    );
  }

  return (
    <div style={{
      position:'fixed', bottom:80, right:28, width:420, height:560,
      background:C.surface, border:`1px solid ${C.border}`, borderRadius:16,
      display:'flex', flexDirection:'column', zIndex:100,
      boxShadow:`0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${C.border}`,
      backdropFilter:'blur(20px)',
    }}>
      {/* Header */}
      <div style={{
        padding:'14px 16px', borderBottom:`1px solid ${C.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderRadius:'16px 16px 0 0',
        background:`linear-gradient(135deg, ${C.goldDim}33, transparent)`,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>🤖</span>
          <div>
            <span style={{ color:C.gold, fontWeight:700, fontSize:14, fontFamily:'Georgia,serif' }}>GRE Tutor</span>
            <p style={{ color:C.textDim, fontSize:10, margin:0 }}>Powered by Gemini</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} style={{
          background:'transparent', border:'none', color:C.textMid, fontSize:18, cursor:'pointer',
          padding:'4px 8px', borderRadius:6, transition:'all 0.15s',
        }}
          onMouseOver={e => e.currentTarget.style.color = C.text}
          onMouseOut={e => e.currentTarget.style.color = C.textMid}
        >✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
          }}>
            <div style={{
              padding:'10px 14px', borderRadius:12, fontSize:13, lineHeight:1.7,
              whiteSpace:'pre-wrap', wordBreak:'break-word',
              background: msg.role === 'user' ? C.gold+'22' : C.card,
              color: msg.role === 'user' ? C.goldBr : C.text,
              border: `1px solid ${msg.role === 'user' ? C.gold+'44' : C.border}`,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf:'flex-start', maxWidth:'85%' }}>
            <div style={{
              padding:'10px 14px', borderRadius:12, fontSize:13,
              background:C.card, border:`1px solid ${C.border}`, color:C.textMid,
            }}>
              <span className="typing-dots">Thinking</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div style={{ padding:'0 16px 8px', display:'flex', flexWrap:'wrap', gap:6 }}>
          {quickActions.map((qa, i) => (
            <button key={i} onClick={() => sendMessage(qa.prompt)} style={{
              padding:'6px 10px', borderRadius:8, fontSize:11, cursor:'pointer',
              background:C.card, border:`1px solid ${C.border}`, color:C.textMid,
              transition:'all 0.15s', whiteSpace:'nowrap',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMid; }}
            >{qa.label}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding:12, borderTop:`1px solid ${C.border}`, display:'flex', gap:8 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a word, strategy, or concept..."
          style={{
            flex:1, background:C.card, border:`1px solid ${C.border}`,
            borderRadius:8, padding:'10px 12px', color:C.text, fontSize:13,
            outline:'none', fontFamily:'inherit',
          }}
        />
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{
          background: loading || !input.trim() ? C.textDim : C.gold,
          border:'none', borderRadius:8, padding:'10px 14px', cursor: loading ? 'wait' : 'pointer',
          color:'#07090F', fontWeight:700, fontSize:13, transition:'all 0.15s',
          opacity: loading || !input.trim() ? 0.4 : 1,
        }}>→</button>
      </div>
    </div>
  );
}
