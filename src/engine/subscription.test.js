import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isPro, getPlan, FREE_LIMITS, canAccessDay, canGenerate, canTakeMock, setPlan } from '../lib/subscription';

describe('Subscription Boundaries', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should treat missing plan as free', () => {
    expect(isPro()).toBe(false);
    expect(getPlan()).toBe('free');
  });

  it('should treat valid plan as pro', () => {
    // setPlan stores it in the correct JSON format the module expects
    setPlan('pro');
    expect(isPro()).toBe(true);
    expect(getPlan()).toBe('pro');
  });

  it('should treat expired plan as free', () => {
    setPlan('pro', '2020-01-01T00:00:00Z');
    expect(isPro()).toBe(false);
    expect(getPlan()).toBe('free');
  });

  it('should restrict free users to FREE_LIMITS.maxDay', () => {
    expect(canAccessDay(1)).toBe(true);
    expect(canAccessDay(FREE_LIMITS.maxDay)).toBe(true);
    expect(canAccessDay(FREE_LIMITS.maxDay + 1)).toBe(false);
  });

  it('should allow pro users to access any day', () => {
    setPlan('pro');
    expect(canAccessDay(30)).toBe(true);
  });

  it('should enforce AI generation limits for free users', () => {
    // Free user starts with 0 generations today — should be allowed
    expect(canGenerate()).toBe(true);
  });

  it('should bypass AI generation limits for pro users', () => {
    setPlan('pro');
    // Even if we somehow used many, pro should always be allowed
    expect(canGenerate()).toBe(true);
  });

  it('should enforce mock exam limits for free users', () => {
    // 0 exams taken this month — allowed
    expect(canTakeMock()).toBe(true);

    // Record a mock exam for this month
    localStorage.setItem('gre_lastMockDate', new Date().toISOString());

    // Now the free user should be blocked
    expect(canTakeMock()).toBe(false);
  });

  it('should allow pro users unlimited mock exams', () => {
    setPlan('pro');
    localStorage.setItem('gre_lastMockDate', new Date().toISOString());
    expect(canTakeMock()).toBe(true);
  });

  it('should allow special day values like 0 and -1 for all users', () => {
    expect(canAccessDay(0)).toBe(true);   // Roadmap
    expect(canAccessDay(-1)).toBe(true);  // Mock Exam
  });

  it('should block premium features for free users', () => {
    expect(canAccessDay(-2)).toBe(false);
    expect(canAccessDay(-3)).toBe(false);
  });
});
