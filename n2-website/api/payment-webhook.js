/**
 * Vercel Serverless Function: /api/payment-webhook
 * Verifies HitPay payment, then moves order from Pending Orders to date tab as CONFIRMED.
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

function verifyHmac(params, salt) {
  const { hmac, ...rest } = params;
  const sortedStr = Object.keys(rest).sort().map(k => `${k}=${rest[k]}`).join('|');
  const expected = crypto.createHmac('sha256', salt).update(sortedStr).digest('hex');
  return hmac === expected;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const rawBody = await getRawBody(req);
    const params = Object.fromEntries(new URLSearchParams(rawBody));

    const apiSalt     = process.env.HITPAY_SALT || '';
    const webhookSalt = process.env.HITPAY_WEBHOOK_SALT || '';

    const valid = (apiSalt && verifyHmac(params, apiSalt)) ||
                  (webhookSalt && verifyHmac(params, webhookSalt));

    if (!valid) {
      console.error('HMAC mismatch');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Webhook verified. Status:', params.status, 'Ref:', params.reference_number);

    if (params.status === 'completed') {
      // Tell GAS to move order from Pending Orders to the correct date tab as CONFIRMED
      await fetch(process.env.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm_pending',
          reference: params.reference_number,
          payment_id: params.payment_id
        })
      });
      console.log('Confirmed:', params.reference_number);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('payment-webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}
