import crypto from 'node:crypto';

function hash(value: string) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const expectedHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!expectedHash) {
    return res.status(503).json({
      ok: false,
      message: 'ADMIN_PASSWORD_HASH belum dikonfigurasi di Vercel.'
    });
  }

  const password = String(req.body?.password || '');
  const supplied = hash(password);
  const a = Buffer.from(supplied, 'hex');
  const b = Buffer.from(expectedHash, 'hex');
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    return res.status(401).json({ ok: false, message: 'Password admin salah.' });
  }

  return res.status(200).json({ ok: true });
}
