import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSRLevel, updateWordSR, getSRStats, getDueWords } from './spaced';

describe('Spaced Repetition Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize a new word with New status', () => {
    const sr = getSRLevel('aberrant');
    expect(sr.label).toBe('New');
    expect(sr.level).toBe(-1);
  });

  it('should advance level after 2 consecutive correct answers (SM-2 spec)', () => {
    // SM-2 advances 1 level per 2 correct answers
    updateWordSR('aberrant', true, 5); // correctStreak=1, level stays 0
    let sr = getSRLevel('aberrant');
    expect(sr.label).toBe('Weak'); // level 0

    updateWordSR('aberrant', true, 5); // correctStreak=2 → advance to level 1, reset streak
    sr = getSRLevel('aberrant');
    expect(sr.label).toBe('Learning'); // level 1
  });

  it('should promote a word to Mastered after enough correct answers', () => {
    // Need 2 correct per level, 6 levels (0..5) = ~10-12 correct answers
    for (let i = 0; i < 12; i++) {
      updateWordSR('aberrant', true, 5);
    }
    const sr = getSRLevel('aberrant');
    expect(sr.label).toBe('Mastered');
    expect(sr.level).toBe(5);
  });

  it('should demote a word upon incorrect answer', () => {
    // Get to level 1 (Learning)
    updateWordSR('aberrant', true, 5);
    updateWordSR('aberrant', true, 5);
    let sr = getSRLevel('aberrant');
    expect(sr.label).toBe('Learning'); // level 1

    // Incorrect with quality=2 drops 1 level
    updateWordSR('aberrant', false, 2);
    sr = getSRLevel('aberrant');
    expect(sr.label).toBe('Weak'); // level 0
  });

  it('should report due words when nextDue is in the past', () => {
    // Manually manipulate localStorage to set a word as due
    updateWordSR('capricious', true, 5);

    // Overwrite nextDue to be in the past
    const srData = JSON.parse(localStorage.getItem('gre_spacedRep'));
    srData['capricious'].nextDue = Date.now() - 1000;
    srData['capricious'].mastered = false;
    localStorage.setItem('gre_spacedRep', JSON.stringify(srData));

    const due = getDueWords();
    expect(due.length).toBe(1);
    expect(due[0].word).toBe('capricious');
  });

  it('should correctly calculate SR stats', () => {
    updateWordSR('w1', true, 5);
    updateWordSR('w2', true, 5);

    // Manually set one as due
    const srData = JSON.parse(localStorage.getItem('gre_spacedRep'));
    srData['w2'].nextDue = Date.now() - 1000;
    localStorage.setItem('gre_spacedRep', JSON.stringify(srData));

    const stats = getSRStats();
    expect(stats.totalTracked).toBe(2);
    expect(stats.due).toBe(1);
  });

  it('should catastrophic drop 2 levels for quality=0', () => {
    // Get to level 2 (Familiar)
    for (let i = 0; i < 4; i++) {
      updateWordSR('tricky', true, 5);
    }
    let sr = getSRLevel('tricky');
    expect(sr.label).toBe('Familiar'); // level 2

    // quality=0 should drop 2 levels
    updateWordSR('tricky', false, 0);
    sr = getSRLevel('tricky');
    expect(sr.label).toBe('Weak'); // level 0
  });
});
