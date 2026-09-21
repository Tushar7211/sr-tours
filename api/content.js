// Vercel serverless function: GET /api/content (public), POST = check password, PUT = save.
// Storage: Upstash Redis over plain HTTP, so there are no extra npm packages.
import { timingSafeEqual } from 'node:crypto';

const KEY = 'sr_tour_content_v1';
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || `Redis error ${r.status}`);
  return j.result;
}

function passwordOk(input) {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected || typeof input !== 'string') return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!REDIS_URL || !REDIS_TOKEN) return res.status(200).json({ content: null, configured: false });
      const raw = await redis(['GET', KEY]);
      const fresh = req.query && 't' in req.query; // the admin page asks for an uncached copy
      res.setHeader('Cache-Control', fresh ? 'no-store' : 'public, s-maxage=10, stale-while-revalidate=50');
      return res.status(200).json({ content: raw ? JSON.parse(raw) : null, configured: true });
    }

    if (req.method !== 'POST' && req.method !== 'PUT') {
      res.setHeader('Allow', 'GET, POST, PUT');
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'ADMIN_PASSWORD is not set. Add it in Vercel > Settings > Environment Variables, then redeploy.' });
    }
    if (!passwordOk(req.headers['x-admin-password'])) {
      await new Promise((r) => setTimeout(r, 500)); // slow down guessing
      return res.status(401).json({ error: 'Wrong password.' });
    }

    if (req.method === 'POST') return res.status(200).json({ ok: true }); // login check

    // PUT: save
    if (!REDIS_URL || !REDIS_TOKEN) {
      return res.status(500).json({ error: 'Database not connected. In Vercel open Storage, add Upstash Redis and connect it to this project, then redeploy.' });
    }
    const content = req.body && req.body.content;
    if (!content || typeof content !== 'object') return res.status(400).json({ error: 'Invalid content.' });
    const text = JSON.stringify(content);
    if (text.length > 900000) return res.status(413).json({ error: 'Content is too large. Use image links instead of embedded images.' });
    await redis(['SET', KEY, text]);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}
