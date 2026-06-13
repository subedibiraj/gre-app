// ─── AUDIO SYNTHESIS FOR UI FEEDBACK ──────────────────────────────────────────

const audioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext) 
  ? new (window.AudioContext || window.webkitAudioContext)() 
  : null;

function playTone(freq, type, duration, vol = 0.1) {
  if (!audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

export const playPop = () => playTone(600, 'sine', 0.1, 0.05);
export const playCorrect = () => {
  playTone(440, 'sine', 0.1, 0.05);
  setTimeout(() => playTone(880, 'sine', 0.2, 0.05), 100);
};
export const playWrong = () => {
  playTone(200, 'sawtooth', 0.15, 0.05);
  setTimeout(() => playTone(150, 'sawtooth', 0.2, 0.05), 100);
};
export const playBossHit = () => {
  playTone(100, 'square', 0.3, 0.1);
};
export const playLevelUp = () => {
  playTone(440, 'sine', 0.1, 0.05);
  setTimeout(() => playTone(554, 'sine', 0.1, 0.05), 100);
  setTimeout(() => playTone(659, 'sine', 0.1, 0.05), 200);
  setTimeout(() => playTone(880, 'sine', 0.4, 0.05), 300);
};

// Haptic helpers
export const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (e) { /* ignore */ }
  }
};
export const hapticTap = () => vibrate(15);
export const hapticCorrect = () => vibrate([30, 50, 30]);
export const hapticWrong = () => vibrate([50, 50, 100]);
