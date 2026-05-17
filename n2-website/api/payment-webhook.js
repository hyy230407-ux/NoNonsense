/**
 * Vercel Serverless Function: /api/payment-webhook
 * Receives HitPay payment confirmation.
 * Verifies HMAC, retrieves order data from HitPay, logs to Google Sheets.
 * Order only enters Google Sheets AFTER payment is confirmed.
 *
 * Environment variables required:
 *   HITPAY_API_KEY      — live HitPay API key
 *   HITPAY_SALT         — API salt (from HitPay API Keys page)
 *   HITPAY_WEBHOOK_SALT — Event webhook salt (from HitPay Webhook Endpoints page)
 *   GAS_URL             — Google Apps Script deployment URL
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
  const sortedStr = Object.keys(rest)
    .sort()
    .map(k => `${k}=${rest[k]}`)
    .join('|');
  const expected = crypto.createHmac('sha256', salt).update(sortedStr).digest('hex');
  return hmac === expected;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const rawBody = await getRawBody(req);
    const params = Object.fromEntries(new URLSearchParams(rawBody));

    // Try API salt first, then event webhook salt
    const apiSalt = process.env.HITPAY_SALT || '';
    const webhookSalt = process.env.HITPAY_WEBHOOK_SALT || '';

    const validApiSalt     = apiSalt     && verifyHmac(params, apiSalt);
    const validWebhookSalt = webhookSalt && verifyHmac(params, webhookSalt);

    if (!validApiSalt && !validWebhookSalt) {
      console.error('HMAC mismatch — rejected webhook');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Webhook verified. Status:', params.status, 'Ref:', params.reference_number);

    if (params.status === 'completed') {
      // Retrieve full payment request from HitPay to get the encoded order data
      const paymentReqRes = await fetch(
        `https://api.hit-pay.com/v1/payment-requests/${params.payment_request_id}`,
        { headers: { 'X-BUSINESS-API-KEY': process.env.HITPAY_API_KEY } }
      );

      let orderData = null;
      if (paymentReqRes.ok) {
        const paymentReq = await paymentReqRes.json();
        try {
          orderData = JSON.parse(Buffer.from(paymentReq.purpose, 'base64').toString());
        } catch (e) {
          console.error('Failed to decode order data from purpose:', e);
        }
      }

      if (orderData) {
        // Log confirmed order to Google Sheets
        await fetch(process.env.GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'confirmed_order',
            reference: params.reference_number,
            payment_id: params.payment_id,
            ...orderData
          })
        });
        console.log('Order logged to Sheets:', params.reference_number);
      } else {
        // Fallback: log with just the reference if order data unavailable
        console.log('Order data unavailable, logging reference only');
        await fetch(process.env.GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'confirmed_order',
            reference: params.reference_number,
            payment_id: params.payment_id,
            name: params.name || 'Unknown',
            items: [],
            totalPrice: params.amount || '0'
          })
        });
      }
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('payment-webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}
