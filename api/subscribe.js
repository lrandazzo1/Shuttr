// POST /api/subscribe — where the site's signup forms send an email address.
//
// Forwards it to Mailcheap (self-hosted, github.com/marclou/mailcheap) so the
// API key never reaches the browser. Set these on the Vercel project:
//
//   MAILCHEAP_URL         the Mailcheap app, e.g. https://mailcheap-xyz.vercel.app
//   MAILCHEAP_API_KEY     from Mailcheap's "API keys" page
//   MAILCHEAP_NEWSLETTER  the newsletter's slug
//
// Until all three are set this answers 503 and the forms say signup is not
// set up. Nothing here ever reports a signup that was not saved.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_SOURCE_LENGTH = 100; // Mailcheap's own limit

function visitorIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { MAILCHEAP_URL, MAILCHEAP_API_KEY, MAILCHEAP_NEWSLETTER } = process.env;
  if (!MAILCHEAP_URL || !MAILCHEAP_API_KEY || !MAILCHEAP_NEWSLETTER) {
    return res.status(503).json({ error: 'not_configured' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'invalid_email' });
  }
  const source =
    typeof body.source === 'string' && body.source.trim()
      ? body.source.trim().slice(0, MAX_SOURCE_LENGTH)
      : 'website';

  let upstream;
  try {
    upstream = await fetch(MAILCHEAP_URL.replace(/\/+$/, '') + '/api/v1/contacts', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + MAILCHEAP_API_KEY,
        'Content-Type': 'application/json',
      },
      // The visitor's IP lets Mailcheap apply its per-visitor signup limit.
      body: JSON.stringify({ newsletter: MAILCHEAP_NEWSLETTER, email, source, ip: visitorIp(req) }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.error('[subscribe] Mailcheap could not be reached:', error.message);
    return res.status(502).json({ error: 'upstream_unreachable' });
  }

  const data = await upstream.json().catch(() => ({}));

  if (upstream.status === 429) return res.status(429).json({ error: 'rate_limited' });
  if (upstream.status === 400 && /email/i.test(data.error || '')) {
    return res.status(400).json({ error: 'invalid_email' });
  }
  if (!upstream.ok) {
    // 401 = bad key, 404 = wrong newsletter slug. Both are ours to fix, not the reader's.
    console.error('[subscribe] Mailcheap answered', upstream.status, data.error || '');
    return res.status(502).json({ error: 'upstream_error' });
  }

  // "pending" means the newsletter asks readers to confirm by email first.
  return res.status(200).json({ ok: true, pending: data.status === 'pending' });
};
