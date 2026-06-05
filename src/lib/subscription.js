// ─── SUBSCRIPTION GATING ─────────────────────────────────────────────────────
// Controls free vs pro access. Reads from Supabase (if logged in) or localStorage.

const PLAN_KEY    = 'gre_plan';
const LIMITS_KEY  = 'gre_dailyLimits';

// ─── Plan status ──────────────────────────────────────────────────────────────
export function getPlan() {
  try {
    const plan = localStorage.getItem(PLAN_KEY);
    if (!plan) return 'free';
    const parsed = JSON.parse(plan);
    // Check expiry
    if (parsed.expires && new Date(parsed.expires) < new Date()) {
      localStorage.removeItem(PLAN_KEY);
      return 'free';
    }
    return parsed.plan || 'free';
  } catch { return 'free'; }
}

export function isPro() {
  return getPlan() === 'pro';
}

export function setPlan(plan, expires = null) {
  localStorage.setItem(PLAN_KEY, JSON.stringify({ plan, expires, updatedAt: Date.now() }));
}

// ─── Daily limits for free tier ───────────────────────────────────────────────
function loadLimits() {
  try {
    const data = JSON.parse(localStorage.getItem(LIMITS_KEY) || '{}');
    const today = new Date().toDateString();
    if (data.date !== today) {
      // Reset daily limits
      return { date: today, aiGenerations: 0, mockExams: 0 };
    }
    return data;
  } catch { return { date: new Date().toDateString(), aiGenerations: 0, mockExams: 0 }; }
}

function saveLimits(data) {
  localStorage.setItem(LIMITS_KEY, JSON.stringify(data));
}

// ─── Feature limits ───────────────────────────────────────────────────────────
export const FREE_LIMITS = {
  maxDay: 7,                // Days 1-7 vocabulary
  aiGenerationsPerDay: 3,   // 3 AI practice sessions/day
  mockExamsPerMonth: 1,     // 1 mock/month
};

export function canAccessDay(dayNum) {
  if (isPro()) return true;
  if (hasOwnKey()) return true; // BYOK users get vocab access
  
  if (dayNum === 0 || dayNum === -1) return true; // Roadmap and Mock Exam
  if (dayNum === -2 || dayNum === -3) return false; // Premium features
  
  return dayNum > 0 && dayNum <= FREE_LIMITS.maxDay;
}

export function canGenerate() {
  if (isPro()) return true;
  if (hasOwnKey()) return true; // BYOK = unlimited AI
  const limits = loadLimits();
  return limits.aiGenerations < FREE_LIMITS.aiGenerationsPerDay;
}

export function recordGeneration() {
  if (isPro() || hasOwnKey()) return;
  const limits = loadLimits();
  limits.aiGenerations++;
  saveLimits(limits);
}

export function getGenerationsLeft() {
  if (isPro() || hasOwnKey()) return Infinity;
  const limits = loadLimits();
  return Math.max(0, FREE_LIMITS.aiGenerationsPerDay - limits.aiGenerations);
}

export function canTakeMock() {
  if (isPro()) return true;
  if (hasOwnKey()) return true;
  // Check monthly mock limit
  try {
    const lastMock = localStorage.getItem('gre_lastMockDate');
    if (!lastMock) return true;
    const lastDate = new Date(lastMock);
    const now = new Date();
    // Same month = already used
    return lastDate.getMonth() !== now.getMonth() || lastDate.getFullYear() !== now.getFullYear();
  } catch { return true; }
}

export function recordMock() {
  localStorage.setItem('gre_lastMockDate', new Date().toISOString());
}

// ─── BYOK check ───────────────────────────────────────────────────────────────
function hasOwnKey() {
  try {
    const key = localStorage.getItem('gre_gemini_key');
    return key && key.trim().length > 10;
  } catch { return false; }
}

// ─── Cloud plan sync ─────────────────────────────────────────────────────────
import { supabase } from './supabase.js';

/**
 * Fetch plan status from Supabase user_progress and update localStorage
 * if the cloud plan is 'pro' and not expired.
 */
export async function syncPlanFromCloud(userId, userEmail) {
  if (!userId) return;
  try {
    // 1. Check local override FIRST
    const override = localStorage.getItem('gre_admin_override');
    if (override === 'free') {
      setPlan('free');
      return;
    } else if (override === 'pro') {
      setPlan('pro');
      return;
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('plan, plan_expires')
      .eq('user_id', userId)
      .single();

    if (error || !data) return;

    if (data.plan === 'pro') {
      // Check expiry — if plan_expires is set and in the past, treat as free
      if (data.plan_expires && new Date(data.plan_expires) < new Date()) {
        setPlan('free');
        return;
      }
      // Cloud says pro and not expired — update localStorage
      setPlan('pro', data.plan_expires || null);
    }
  } catch (e) {
    console.warn('syncPlanFromCloud failed:', e);
  }
}

/**
 * Redirect the user to Stripe Checkout for a given price type.
 * Calls /api/create-checkout which returns { url }.
 */
export async function checkoutRedirect(priceType, userId, email) {
  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceType,     // 'monthly' | 'annual'
        userId,
        email,
        returnUrl: window.location.origin,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Checkout failed (${res.status})`);
    }

    const { url } = await res.json();
    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (e) {
    console.error('checkoutRedirect error:', e);
    throw e;
  }
}

// ─── Feature access summary ──────────────────────────────────────────────────
export function getAccessSummary() {
  const plan = getPlan();
  const pro = isPro();
  const byok = hasOwnKey();
  const gensLeft = getGenerationsLeft();

  return {
    plan,
    isPro: pro,
    hasByok: byok,
    canAccessAllDays: pro || byok,
    generationsLeft: gensLeft,
    generationsTotal: pro || byok ? Infinity : FREE_LIMITS.aiGenerationsPerDay,
    canMock: canTakeMock(),
    canAiTutor: pro,
    canCloudSync: pro,
  };
}
