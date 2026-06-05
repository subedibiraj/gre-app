import React, { useRef, useEffect, useState } from 'react';
import C from '../theme';

export default function ShareModal({ level, streak, estTotal, onClose }) {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Canvas dimensions (1200x630 is standard Twitter/OpenGraph card size)
    const W = 1200;
    const H = 630;
    canvas.width = W;
    canvas.height = H;

    // 1. Draw Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#07090F');
    grad.addColorStop(1, '#1A1D2D');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Grid pattern (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 60) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let j = 0; j < H; j += 60) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
    }

    // 2. Draw Glow behind stats
    const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 500);
    glow.addColorStop(0, `${C.gold}11`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // 3. Draw Branding
    ctx.fillStyle = C.gold;
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('GRE Complete', 80, 100);

    ctx.fillStyle = C.textDim;
    ctx.font = '28px "Segoe UI", sans-serif';
    ctx.fillText('My AI Prep Progress', 80, 140);

    // 4. Draw Stats Container
    const boxW = 1040;
    const boxH = 280;
    const boxX = 80;
    const boxY = 220;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)'; // Gold border
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 24);
    ctx.fill();
    ctx.stroke();

    // 5. Draw Individual Stats
    ctx.textAlign = 'center';
    
    // Streak
    ctx.fillStyle = '#FF6B35'; // orange
    ctx.font = 'bold 80px "Courier New", monospace';
    ctx.fillText(`${streak}d`, boxX + boxW * 0.16, boxY + 160);
    ctx.fillStyle = C.textDim;
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText('STREAK', boxX + boxW * 0.16, boxY + 220);

    // Level
    ctx.fillStyle = C.gold;
    ctx.font = 'bold 54px "Courier New", monospace';
    ctx.fillText(level.name, boxX + boxW * 0.5, boxY + 150);
    ctx.fillStyle = C.textDim;
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText('LEVEL', boxX + boxW * 0.5, boxY + 220);

    // Score
    const scoreStr = estTotal ? `${estTotal[0]}-${estTotal[1]}` : 'TBD';
    ctx.fillStyle = C.greenBr;
    ctx.font = 'bold 80px "Courier New", monospace';
    ctx.fillText(scoreStr, boxX + boxW * 0.84, boxY + 160);
    ctx.fillStyle = C.textDim;
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText('EST. SCORE', boxX + boxW * 0.84, boxY + 220);

    // 6. Draw URL footer
    ctx.fillStyle = C.textDim;
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('gre-complete.com', W - 80, H - 60);

    // Save Data URL
    setDataUrl(canvas.toDataURL('image/png'));
  }, [level, streak, estTotal]);

  const handleShare = async () => {
    if (!dataUrl) return;
    
    try {
      // Convert data URL to Blob for Web Share API
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'gre-progress.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My GRE Progress',
          text: `I'm on a ${streak} day streak in GRE Complete. Estimated score: ${estTotal ? `${estTotal[0]}-${estTotal[1]}` : 'TBD'}!`,
          files: [file],
        });
      } else {
        // Fallback to download
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'gre-progress.png';
        a.click();
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'gre-progress.png';
      a.click();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(7,9,15,0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', overflowY: 'auto'
    }}>
      <div className="scale-in" style={{
        width: '100%', maxWidth: 700, margin: 'auto',
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: '24px',
        boxShadow: `0 20px 80px rgba(0,0,0,0.8)`,
        position: 'relative'
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', color: C.textDim,
          fontSize: 24, cursor: 'pointer', padding: 4, lineHeight: 1, zIndex: 10
        }}>×</button>

        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: C.gold, margin: '0 0 16px' }}>
          Share Your Progress
        </h2>

        {/* Hidden Canvas used for drawing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Preview Image */}
        <div style={{
          width: '100%',
          aspectRatio: '1200/630',
          background: C.bg,
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 20,
          border: `1px solid ${C.border}`
        }}>
          {dataUrl ? (
            <img src={dataUrl} alt="Progress Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textDim }}>
              Generating...
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '12px 24px', borderRadius: 8, border: `1px solid ${C.border}`,
            background: 'transparent', color: C.textMid, cursor: 'pointer', fontWeight: 600
          }}>
            Cancel
          </button>
          
          <button onClick={handleShare} disabled={!dataUrl} style={{
            padding: '12px 24px', borderRadius: 8, border: 'none',
            background: `linear-gradient(135deg, ${C.blue}, #00bfff)`,
            color: '#fff', cursor: 'pointer', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: `0 4px 12px ${C.blue}44`
          }}>
            <span>↗</span> Share / Download
          </button>
        </div>
      </div>
    </div>
  );
}
