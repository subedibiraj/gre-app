import confetti from 'canvas-confetti';
import { playMilestone } from './audio';

export function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;

  // Play milestone sound in sync with visuals
  playMilestone();

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#C8A535', '#24976A', '#ffffff']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#C8A535', '#24976A', '#ffffff']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

export function fireSmallConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#C8A535', '#24976A']
  });
}
