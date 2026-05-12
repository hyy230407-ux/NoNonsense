import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M5 16L12 23L27 8" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={s.title}>Payment Confirmed!</h1>
        <p style={s.sub}>Your order has been received and paid for. A confirmation email is on its way.</p>
        {ref && <p style={s.ref}>Order Reference: <strong>{ref}</strong></p>}
        <div style={s.infoBox}>
          <p style={s.infoLine}><strong>Collection:</strong> 11:00 AM – 3:00 PM</p>
          <p style={s.infoLine}><strong>Location:</strong> N2 Kiosk, NYP North Canteen</p>
        </div>
        <a href="/" style={s.btn}>Back to Menu</a>
      </div>
    </div>
  );
}

const TEAL = '#00f1d9';
const s = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: '#0a0a0a' },
  card: { maxWidth: '480px', width: '100%', background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '48px 32px', textAlign: 'center' },
  icon: { width: '64px', height: '64px', borderRadius: '50%', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  title: { fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px' },
  sub: { fontSize: '15px', color: '#aaa', lineHeight: 1.6, marginBottom: '16px' },
  ref: { fontSize: '13px', color: '#666', marginBottom: '24px' },
  infoBox: { background: '#0f0f0f', border: '1px solid #222', borderLeft: `3px solid ${TEAL}`, borderRadius: '8px', padding: '16px', marginBottom: '28px', textAlign: 'left' },
  infoLine: { fontSize: '14px', color: '#aaa', margin: '4px 0' },
  btn: { display: 'inline-block', padding: '12px 28px', background: TEAL, color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }
};
