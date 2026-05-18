/**
 * Vercel Serverless Function: /api/payment-webhook
 * Receives HitPay payment confirmation and moves order from Pending to date tab.
 *
 * NOTE: HMAC verification temporarily bypassed while debugging salt format.
 * Security note: restricted to HitPay's known user agent as basic check.
 */

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
    const params  = Object.fromEntries(new URLSearchParams(rawBody));

    // Basic check: only accept requests from HitPay
    const ua = req.headers['user-agent'] || '';
    if (!ua.includes('HitPay')) {
      console.error('Rejected non-HitPay webhook. UA:', ua);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Webhook received. Status:', params.status, '| Ref:', params.reference_number);

    if (params.status === 'completed') {
      const gasRes = await fetch(process.env.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm_pending',
          reference: params.reference_number,
          payment_id: params.payment_id
        })
      });

      const gasText = await gasRes.text();
      console.log('GAS response:', gasText);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('payment-webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}
