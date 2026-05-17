/**
 * Vercel Serverless Function: /api/create-payment
 * Saves order to a hidden "Pending Orders" sheet, then creates HitPay payment.
 * Nothing appears in the date tabs until payment is confirmed by webhook.
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

    // Save to Pending Orders sheet — does NOT appear in date tabs yet
    const gasRes = await fetch(process.env.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'stage_pending',
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
      console.error('GAS staging failed');
    }

    // Create HitPay payment — purpose is just the short reference
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
        purpose: `N2 Order ${reference}`,
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
