/**
 * Vercel Serverless Function: /api/payment-webhook
 * Receives HitPay payment confirmation, verifies HMAC signature,
 * then calls GAS to confirm the order and send the customer email.
 */

import crypto from 'crypto';

export const config = {
  api: { bodyParser: false }
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk.toString(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const rawBody = await getRawBody(req);
    const params = Object.fromEntries(new URLSearchParams(rawBody));

    const { hmac, ...rest } = params;

    // Verify HMAC signature
    const sortedStr = Object.keys(rest)
      .sort()
      .map(k => `${k}=${rest[k]}`)
      .join('|');

    const expectedHmac = crypto
      .createHmac('sha256', process.env.HITPAY_SALT)
      .update(sortedStr)
      .digest('hex');

    if (hmac !== expectedHmac) {
      console.error('HMAC mismatch — possible spoofed webhook');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Only confirm on completed payment
    if (params.status === 'completed') {
      await fetch(process.env.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          reference: params.reference_number,
          payment_id: params.payment_id
        })
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('payment-webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}
