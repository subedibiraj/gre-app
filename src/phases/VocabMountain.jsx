import React, { useState, useEffect } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { getSRStats } from '../engine/spaced';
import { Lock, CheckCircle2, ChevronRight, Mountain, Star, Zap } from 'lucide-react';
import { isPro } from '../lib/subscription';
import VocabView from './VocabView';

const loadJSON = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };

export default function VocabMountain({ setUpsellFeature }) {
  const [dayScores, setDayScores] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  
  useEffect(() => {
    setDayScores(loadJSON('gre_dayScores', {}));
  }, []);

  if (selectedDay) {
    return (
      <div style={{ animation: 'fadeIn 0.3s' }}>
        <button
          onClick={() => setSelectedDay(null)}
          style={{
            background: 'transparent', border: 'none', color: C.textMid,
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            marginBottom: 20, fontSize: 13, fontWeight: 600, padding: 0
          }}
        >
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Mountain
        </button>
        <VocabView day={selectedDay} />
      </div>
    );
  }

  // Calculate highest day practiced
  const daysPracticed = Object.keys(dayScores).map(Number).filter(d => !isNaN(d));
  const currentClimb = daysPracticed.length > 0 ? Math.max(...daysPracticed) : 0;
  
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 80, position: 'relative' }}>
      
      {/* Mountain Header */}
      <div style={{ 
        textAlign: 'center', marginBottom: 40, 
        background: `linear-gradient(180deg, ${C.gold}11, transparent)`,
        padding: '30px 20px', borderRadius: '0 0 24px 24px',
        borderBottom: `1px solid ${C.gold}33`
      }}>
        <div style={{ 
          width: 60, height: 60, borderRadius: 30, background: C.gold, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', color: '#07090F', boxShadow: `0 8px 24px ${C.gold}66`
        }}>
          <Mountain size={32} />
        </div>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: C.text, margin: '0 0 8px' }}>
          The Vocab Mountain
        </h2>
        <p style={{ color: C.textMid, fontSize: 14, margin: '0 0 16px', lineHeight: 1.5 }}>
          Master 900+ high-frequency GRE words by climbing the mountain. 
          Each tier unlocks harder vocabulary and complex sentence structures.
        </p>
        
        {/* Progress Bar */}
        <div style={{ background: C.surface, borderRadius: 12, padding: '16px', border: `1px solid ${C.border}`, display: 'inline-block', minWidth: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: C.textMid, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Basecamp
            </span>
            <span style={{ fontSize: 12, color: C.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Summit
            </span>
          </div>
          <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', width: `${(currentClimb / 30) * 100}%`, 
              background: `linear-gradient(90deg, ${C.goldDim}, ${C.gold})`, 
              borderRadius: 4, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' 
            }} />
          </div>
          <p style={{ color: C.textDim, fontSize: 11, margin: '8px 0 0', fontFamily: 'Courier New,monospace' }}>
            {currentClimb} / 30 Days Mastered
          </p>
        </div>
      </div>

      {/* The Mountain Track */}
      <div style={{ position: 'relative', padding: '0 20px' }}>
        {/* Winding trail background */}
        <div style={{ 
          position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, 
          background: `linear-gradient(180deg, ${C.gold}22, ${C.gold}88, ${C.gold}22)`,
          transform: 'translateX(-50%)', zIndex: 0 
        }} />

        {/* Nodes (Reverse order so 30 is at top) */}
        {[...DAYS].reverse().map((d, index) => {
          const isReversedIndex = 30 - index; 
          const isMastered = dayScores[d.day] && Object.keys(dayScores[d.day]).length > 0;
          const isNext = d.day === currentClimb + 1;
          const isLocked = !isPro() && d.day > 3; // Free tier limits to Day 3
          
          // Calculate alternating zigzag layout
          const isLeft = isReversedIndex % 2 === 0;
          const offsetX = isLeft ? -80 : 80;
          
          return (
            <div key={d.day} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 40, position: 'relative', zIndex: 1,
            }}>
              {/* Connector line to center */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', height: 2, width: 80,
                background: isMastered ? C.gold : C.border, zIndex: -1,
                transform: `translate(${isLeft ? '-100%' : '0%'}, -50%)`,
                opacity: 0.5
              }} />

              {/* Node Card */}
              <button 
                onClick={() => {
                  if (isLocked) setUpsellFeature('Vocab Mountain Tier 2');
                  else setSelectedDay(d.day);
                }}
                className="hover-lift"
                style={{
                  transform: `translateX(${offsetX}px)`,
                  background: isNext ? `${C.gold}11` : isMastered ? `${C.greenBr}11` : C.card,
                  border: `2px solid ${isNext ? C.gold : isMastered ? C.greenBr : C.border}`,
                  borderRadius: 16, padding: '16px 20px', width: 160,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: isNext ? `0 0 20px ${C.gold}33` : 'none',
                  opacity: isLocked && !isNext ? 0.6 : 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative'
                }}
              >
                {/* Node Icon */}
                <div style={{ 
                  width: 32, height: 32, borderRadius: 16, marginBottom: 8,
                  background: isNext ? C.gold : isMastered ? C.greenBr : C.surface,
                  color: isNext || isMastered ? '#07090F' : C.textDim,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${isNext || isMastered ? 'transparent' : C.border}`
                }}>
                  {isMastered ? <CheckCircle2 size={16} /> : isLocked ? <Lock size={14} /> : <span style={{ fontFamily: 'Courier New,monospace', fontSize: 13, fontWeight: 700 }}>{d.day}</span>}
                </div>

                <span style={{ color: C.text, fontSize: 13, fontWeight: 700, fontFamily: 'Georgia,serif', marginBottom: 4, textAlign: 'center' }}>
                  {d.theme.split(':')[0]}
                </span>
                
                <span style={{ color: C.textDim, fontSize: 11, fontFamily: 'Courier New,monospace' }}>
                  {d.wordCount} words
                </span>
                
                {isNext && (
                  <div style={{ position: 'absolute', top: -10, background: C.gold, color: '#07090F', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    Next Climb
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
