// Fichier à placer dans : api/slide.js
// Relais iPad ↔ PC via Upstash Redis (gratuit)

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd, ...args) {
  const res = await fetch(`${UPSTASH_URL}/${cmd}/${args.join('/')}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const index = parseInt(body.index) || 0;
    await redis('SET', 'sarange-slide', String(index));
    await redis('EXPIRE', 'sarange-slide', '3600');
    return res.status(200).json({ ok: true, index });
  }

  const data = await redis('GET', 'sarange-slide');
  const index = data.result !== null ? parseInt(data.result) : 0;
  return res.status(200).json({ index });
}
