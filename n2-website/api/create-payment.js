/**
 * Vercel Serverless Function: /api/create-payment
 * Creates a HitPay PayNow payment request and stages the order in GAS as PENDING.
 * 
 * Environment variables required in Vercel:
 *   HITPAY_API_KEY  — your live HitPay API key
 *   HITPAY_SALT     — your HitPay salt
 *   GAS_URL         — your Google Apps Script deployment URL
 *   SITE_URL        — https://nononsense.sg (or your current Vercel URL)
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

    // 1. Stage the order in GAS as PENDING
    const gasRes = await fetch(process.env.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'stage',
        reference,
        name,
        email: email || '',
        phone: phone || '',
        items,
        totalPrice: amount,
        notes: notes || ''
      })
    });

    if (!gasRes.ok) {
      console.error('GAS staging failed:', await gasRes.text());
      return res.status(500).json({ error: 'Failed to stage order' });
    }

    // 2. Create HitPay payment request
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
        redirect_url: `${process.env.SITE_URL}/order-success?ref=${reference}`,
        webhook: `${process.env.SITE_URL}/api/payment-webhook`
      })
    });

    const hitpayData = await hitpayRes.json();

    if (!hitpayRes.ok) {
      console.error('HitPay error:', hitpayData);
      return res.status(500).json({ error: 'Failed to create payment', details: hitpayData });
    }

    return res.status(200).json({
      url: hitpayData.url,
      reference
    });

  } catch (err) {
    console.error('create-payment error:', err);
    return res.status(500).json({ error: err.message });
  }
}
