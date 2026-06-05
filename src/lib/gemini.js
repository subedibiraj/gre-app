// ─── GEMINI API KEY MANAGEMENT ────────────────────────────────────────────────
const GEMINI_KEY_STORAGE = 'gre_gemini_key';

export function getGeminiKey() {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE)?.trim() || '';
  } catch { return ''; }
}

export function setGeminiKey(key) {
  try {
    const trimmed = (key || '').trim();
    if (trimmed) {
      localStorage.setItem(GEMINI_KEY_STORAGE, trimmed);
    } else {
      localStorage.removeItem(GEMINI_KEY_STORAGE);
    }
  } catch (e) { console.error('Failed to save Gemini key:', e); }
}

export function hasGeminiKey() {
  return Boolean(getGeminiKey());
}

// ─── API FETCH HELPER ─────────────────────────────────────────────────────────
export async function apiFetch(endpoint, body) {
  const key = getGeminiKey();

  const headers = { 'Content-Type': 'application/json' };
  if (key) headers['x-gemini-key'] = key;

  // Add Supabase auth token so backend can verify Pro status
  const sessionString = localStorage.getItem('sb-' + import.meta.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token');
  if (sessionString) {
    try {
      const session = JSON.parse(sessionString);
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch(e){}
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}
