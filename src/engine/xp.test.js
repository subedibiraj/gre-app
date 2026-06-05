import { describe, it, expect, beforeEach } from 'vitest';
import { getXP, addXP, getLevel } from './xp';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = value.toString(); },
    clear() { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('XP and Level Engine', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts at 0 XP and level 1', () => {
    expect(getXP().total).toBe(0);
    const stats = getLevel(0);
    expect(stats.name).toBe('Novice');
    expect(stats.progress).toBe(0);
  });

  it('adds XP correctly', () => {
    addXP(100, 'Test reason');
    expect(getXP().total).toBe(100);
    
    // Add more
    addXP(50, 'Another reason');
    expect(getXP().total).toBe(150);
  });

  it('calculates levels correctly', () => {
    let stats = getLevel(50);
    expect(stats.name).toBe('Novice');

    stats = getLevel(250);
    expect(stats.name).toBe('Learner');
  });
});
