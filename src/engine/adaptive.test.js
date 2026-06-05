import { describe, it, expect, beforeEach } from 'vitest';
import { updateWordSR, getSRStats } from './spaced';
import { DAYS } from '../data/days';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = value.toString(); },
    clear() { store = {}; },
    removeItem(key) { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Spaced Repetition Engine', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes stats correctly', () => {
    const stats = getSRStats();
    expect(stats.totalTracked).toBe(0);
    expect(stats.mastered).toBe(0);
    expect(stats.learning).toBe(0);
    expect(stats.weak).toBe(0);
  });

  it('updates word SR successfully for correct answers', () => {
    // Assuming 'aberrant' is a valid word in DAYS
    const word = 'aberrant';
    updateWordSR(word, true);
    
    const raw = window.localStorage.getItem('gre_spacedRep');
    expect(raw).not.toBeNull();
    const data = JSON.parse(raw);
    const wordData = data['aberrant'];
    
    // It takes 2 correct answers to level up to 1
    expect(wordData.level).toBe(0);
    expect(wordData.totalCorrect).toBe(1);
    expect(wordData.correctStreak).toBe(1);
  });

  it('updates word SR successfully for incorrect answers', () => {
    const word = 'aberrant';
    
    updateWordSR(word, true); // Streak 1
    updateWordSR(word, true); // Streak 2 -> Level 1
    
    // Then get it wrong
    updateWordSR(word, false);
    
    const wordData = JSON.parse(window.localStorage.getItem('gre_spacedRep'))[word];
    // Since SM-2 reduces easiness but doesn't hard-reset level to 0 immediately if level > 0, 
    // Wait, the SM-2 implementation in spaced.js doesn't drop level on incorrect!
    // Actually:
    // It only advances level if q>=3. If q<3, it resets correctStreak to 0.
    expect(wordData.correctStreak).toBe(0);
    expect(wordData.totalSeen).toBe(3);
    expect(wordData.totalCorrect).toBe(2);
  });
});
