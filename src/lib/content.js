import { DEFAULT_CONTENT } from '../content/defaultContent.js';

const LOCAL_KEY = 'sr_content_local'; // admin edits when there is no backend (npm run dev)
const CACHE_KEY = 'sr_content_cache'; // last published content, for instant repeat visits

export const uid = () => Math.random().toString(36).slice(2, 9);

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or blocked */ } };

// Merge saved content over the defaults so a missing field never breaks the page.
function merge(base, saved) {
  if (Array.isArray(base)) {
    return Array.isArray(saved)
      ? saved.filter(isObj).map((item) => ({ id: uid(), ...item }))
      : base;
  }
  if (isObj(base)) {
    const out = {};
    for (const k of Object.keys(base)) {
      out[k] = isObj(saved) && saved[k] !== undefined ? merge(base[k], saved[k]) : base[k];
    }
    return out;
  }
  return saved === undefined || saved === null ? base : saved;
}

export const withDefaults = (saved) => merge(structuredClone(DEFAULT_CONTENT), saved);
export const getCached = () => read(CACHE_KEY);

// ---- backend (api/content.js) -------------------------------------------------
async function api(method, { body, password, fresh } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch('/api/content' + (fresh ? `?t=${Date.now()}` : ''), {
      method,
      cache: 'no-store',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(password ? { 'x-admin-password': password } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    // The Vite dev server answers unknown URLs with HTML: that means "no backend here".
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    if (!isJson) return { ok: false, offline: true };
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchContent({ fresh = false } = {}) {
  try {
    const r = await api('GET', { fresh });
    if (r.ok && r.data) {
      const { content = null, configured = true } = r.data;
      if (content) write(CACHE_KEY, content);
      return { content: withDefaults(content), source: 'server', configured };
    }
    if (r.offline) {
      return { content: withDefaults(read(LOCAL_KEY)), source: 'local', configured: false, offline: true };
    }
  } catch { /* network error: fall through to the cached copy */ }
  const cached = read(CACHE_KEY);
  return { content: withDefaults(cached), source: cached ? 'cache' : 'default', configured: true };
}

export async function verifyPassword(password) {
  try {
    const r = await api('POST', { body: { action: 'verify' }, password });
    if (r.offline) return { ok: true, offline: true };
    return { ok: r.ok, error: r.data?.error };
  } catch {
    return { ok: false, error: 'Could not reach the server. Check your internet connection.' };
  }
}

export async function publishContent(content, password, offline) {
  if (offline) {
    write(LOCAL_KEY, content);
    return { ok: true };
  }
  try {
    const r = await api('PUT', { body: { content }, password });
    if (r.ok) write(CACHE_KEY, content);
    return { ok: r.ok, error: r.data?.error || (r.offline ? 'Backend not found.' : undefined) };
  } catch {
    return { ok: false, error: 'Network error. Nothing was saved.' };
  }
}

// ---- small helpers ---------------------------------------------------------------
export const digits = (s = '') => String(s).replace(/\D/g, '');
export const waNumber = (phone) => { const d = digits(phone); return d.length === 10 ? '91' + d : d; };
export const waLink = (phone, text = '') =>
  `https://wa.me/${waNumber(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const telLink = (phone) => `tel:+${waNumber(phone)}`;
export const splitTags = (s = '') => String(s).split(',').map((t) => t.trim()).filter(Boolean);

// Only allow http(s), site-relative and image data links in admin-entered URLs.
export function safeUrl(u = '') {
  const s = String(u).trim();
  if (!s) return '';
  if (/^(https?:)?\/\//i.test(s) || s.startsWith('/') || s.startsWith('data:image/')) return s;
  return 'https://' + s;
}
