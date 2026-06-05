// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signInWithGoogle, signOut, pullProgressFromCloud, pushProgressToCloud } from './supabase.js';
import { syncPlanFromCloud } from './subscription.js';
import C from '../theme.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [syncing, setSyncing]   = useState(false);
  const [synced, setSynced]     = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && newUser) {
        setSyncing(true);
        const restored = await pullProgressFromCloud(newUser.id);
        if (restored) {
          setSynced(true);
          setTimeout(() => setSynced(false), 3000);
        } else if (event === 'SIGNED_IN') {
          // Push local progress to cloud only on active sign in, not on every page load
          await pushProgressToCloud(newUser.id);
        }
        
        // Sync subscription plan from cloud (pro / free)
        await syncPlanFromCloud(newUser.id, newUser.email);
        setSyncing(false);
        
        const isStuckOnOnboarding = localStorage.getItem('gre_onboarded') !== '1';
        
        if (event === 'SIGNED_IN' || restored || isStuckOnOnboarding) {
          localStorage.setItem('gre_onboarded', '1');
          
          // Small delay to ensure localStorage is flushed before reload
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      }

      if (event === 'SIGNED_OUT') {
        setSynced(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Periodically push progress to cloud when logged in
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      pushProgressToCloud(user.id).catch(() => {});
    }, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, [user]);

  const handleSignIn = async () => {
    try { await signInWithGoogle(); }
    catch (e) { console.error('Sign in error:', e); }
  };

  const handleSignOut = async () => {
    if (user) await pushProgressToCloud(user.id); // final push
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, syncing, synced, signIn: handleSignIn, signOut: handleSignOut }}>
      {children}
      {syncing && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 300,
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold, animation: 'pulse 1s infinite' }} />
          <span style={{ color: C.textMid, fontSize: 12 }}>Syncing progress...</span>
        </div>
      )}
      {synced && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 300,
          background: C.card, border: `1px solid ${C.green}44`, borderRadius: 10,
          padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          <span style={{ color: C.greenBr, fontSize: 12 }}>✓ Progress restored from cloud</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ─── INLINE SIGN-IN BUTTON (used in header) ──────────────────────────────────
export function AuthButton({ compact = false }) {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <button onClick={signIn} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: compact ? '5px 12px' : '7px 16px',
        borderRadius: 8, border: `1px solid ${C.border}`,
        background: C.surface, color: C.text,
        cursor: 'pointer', fontSize: compact ? 11 : 13,
        fontWeight: 600, transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
        onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {compact ? 'Sign in' : 'Sign in with Google'}
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {user.user_metadata?.avatar_url && (
        <img
          src={user.user_metadata.avatar_url}
          alt="avatar"
          style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}` }}
        />
      )}
      {!compact && (
        <span style={{ color: C.textMid, fontSize: 11, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
        </span>
      )}
      <button onClick={signOut} style={{
        padding: '4px 10px', borderRadius: 6, border: `1px solid ${C.border}`,
        background: 'transparent', color: C.textDim, cursor: 'pointer',
        fontSize: 11, transition: 'all 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = C.red}
        onMouseLeave={e => e.currentTarget.style.color = C.textDim}
      >
        Sign out
      </button>
    </div>
  );
}
