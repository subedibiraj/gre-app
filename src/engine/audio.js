// Zero-Dependency Synthesized Audio Engine
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  // Resume context if suspended (browser policy)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// ─── Tone Generator ───────────────────────────────────────────────────────────
function playTone(freq, type = 'sine', duration = 0.1, vol = 0.1, slideFreq = null) {
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  
  // Envelope
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Frequency
  osc.frequency.setValueAtTime(freq, now);
  if (slideFreq) {
    osc.frequency.exponentialRampToValueAtTime(slideFreq, now + duration);
  }

  osc.start(now);
  osc.stop(now + duration);
}

// ─── Haptics ──────────────────────────────────────────────────────────────────
function vibrate(pattern) {
  if (navigator && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (e) { /* ignore */ }
  }
}

// ─── Sound Library ────────────────────────────────────────────────────────────

export function playTap() {
  vibrate(10);
  playTone(600, 'sine', 0.05, 0.05, 400);
}

export function playSuccess() {
  vibrate([20, 30, 20]);
  // Nice major 3rd chord (C5 + E5)
  playTone(523.25, 'sine', 0.3, 0.1);
  setTimeout(() => playTone(659.25, 'sine', 0.4, 0.1), 100);
}

export function playError() {
  vibrate([40, 40, 40]);
  // Low thud
  playTone(150, 'square', 0.2, 0.08, 50);
}

export function playMilestone() {
  vibrate([30, 50, 30, 50, 60]);
  // Arpeggio
  playTone(440.00, 'sine', 0.2, 0.1); // A4
  setTimeout(() => playTone(554.37, 'sine', 0.2, 0.1), 100); // C#5
  setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 200); // E5
  setTimeout(() => playTone(880.00, 'sine', 0.6, 0.15), 300); // A5
}

// ─── Toggle Settings ──────────────────────────────────────────────────────────
export function isAudioEnabled() {
  return localStorage.getItem('gre_sound') !== '0';
}

export function toggleAudio() {
  const current = isAudioEnabled();
  localStorage.setItem('gre_sound', current ? '0' : '1');
  return !current;
}

// Wrapper to obey settings
export const Sound = {
  tap: () => { if (isAudioEnabled()) playTap(); },
  success: () => { if (isAudioEnabled()) playSuccess(); },
  error: () => { if (isAudioEnabled()) playError(); },
  milestone: () => { if (isAudioEnabled()) playMilestone(); },
  toggle: toggleAudio,
  isEnabled: isAudioEnabled
};
