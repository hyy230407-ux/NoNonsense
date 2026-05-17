/**
 * Vercel Serverless Function: /api/create-payment
 * Creates a HitPay PayNow payment request.
 * Order data is encoded in the payment purpose field — nothing is logged to
 * Google Sheets until HitPay confirms payment via webhook.
 *
 * Environment variables required in Vercel:
 *   HITPAY_API_KEY  — live HitPay API key
 *   HITPAY_SALT     — API salt (from HitPay API Keys page)
 *   SITE_URL        — https://no-nonsense-five.vercel.app (or nononsense.sg once DNS fixed)
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, phone, items, totalPrice, notes } = req.body;

    if (!name || !items || !totalPrice) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const reference = `N2-${Date.now()}`;
    const amount = parseFloat(String(totalPrice).replace(/[^0-9.]/g, '')).toFixed(2);

    // Encode full order data in the purpose field so the webhook can retrieve it
    const orderPayload = { name, email: email || '', phone: phone || '', items, totalPrice: amount, notes: notes || '' };
    const encodedOrder = Buffer.from(JSON.stringify(orderPayload)).toString('base64');

    // Create HitPay payment request — order is NOT logged to Sheets yet
    const hitpayRes = await fetch('https://api.hit-pay.com/v1/payment-requests', {
      method: 'POST',
      headers: {
        'X-BUSINESS-API-KEY': process.env.HITPAY_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency: 'SGD',
        payment_methods: ['paynow_online'],
        name,
        email: email || undefined,
        phone: phone || undefined,
        reference_number: reference,
        purpose: encodedOrder,
        redirect_url: `${process.env.SITE_URL}/order-success?ref=${reference}`,
        webhook: `${process.env.SITE_URL}/api/payment-webhook`
      })
    });

    const hitpayData = await hitpayRes.json();

    if (!hitpayRes.ok) {
      console.error('HitPay error:', JSON.stringify(hitpayData));
      return res.status(500).json({ error: 'Failed to create payment', details: hitpayData });
    }

    return res.status(200).json({ url: hitpayData.url, reference });

  } catch (err) {
    console.error('create-payment error:', err);
    return res.status(500).json({ error: err.message });
  }
}
