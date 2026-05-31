// ─── GEMINI API KEY MANAGEMENT ────────────────────────────────────────────────
// Key priority: localStorage (user-set in Settings) → env variable (Vercel)
// The key is sent in the x-gemini-key header to all API routes.
// The server reads it from that header, falling back to its own env var.

const GEMINI_KEY_STORAGE = 'gre_gemini_key';

export function getGeminiKey() {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
}

export function setGeminiKey(key) {
  if (key) {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  }
}

export function hasGeminiKey() {
  return Boolean(getGeminiKey());
}

// ─── API FETCH HELPER ─────────────────────────────────────────────────────────
// Wraps all API calls to inject the Gemini key header automatically.

export async function apiFetch(endpoint, body) {
  const key = getGeminiKey();
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers['x-gemini-key'] = key;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}
