// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── AUTH HELPERS ─────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ─── PROGRESS SYNC ────────────────────────────────────────────────────────────
// Reads from localStorage (source of truth locally) and syncs to Supabase
// on login so progress is preserved across devices.

const SYNC_KEYS = [
  'gre_dayScores', 'gre_quantScores', 'gre_weakWords',
  'gre_spacedRep', 'gre_streak', 'gre_xp', 'gre_achievements',
  'gre_scoreHistory', 'gre_testDate', 'gre_dailyGoal', 'gre_onboarded'
];

export async function pushProgressToCloud(userId) {
  if (!userId) return;
  const payload = {};
  SYNC_KEYS.forEach(k => {
    try {
      const v = localStorage.getItem(k);
      if (v) payload[k] = JSON.parse(v);
    } catch { /* skip */ }
  });

  const { error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, data: payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

  if (error) console.warn('Progress sync failed:', error.message);
}

export async function pullProgressFromCloud(userId) {
  if (!userId) return false;
  const { data, error } = await supabase
    .from('user_progress')
    .select('data, updated_at')
    .eq('user_id', userId)
    .single();

  if (error || !data?.data) return false;

  // Only overwrite if cloud is newer than local (compare timestamps)
  const cloudUpdated = new Date(data.updated_at).getTime();
  const localUpdated = parseInt(localStorage.getItem('gre_lastSync') || '0');

  if (cloudUpdated > localUpdated) {
    Object.entries(data.data).forEach(([k, v]) => {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* skip */ }
    });
    localStorage.setItem('gre_lastSync', String(cloudUpdated));
    return true; // data was restored
  }
  return false;
}
