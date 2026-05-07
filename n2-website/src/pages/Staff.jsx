import { useState, useEffect, useRef } from 'react';

const GAS_URL = 'https://script.google.com/macros/s/AKfycby6C0UpDwRp4MmU-PocEKJMSHZ4EkLNPAPjqHKR5N6oZmTgnBL_p5f4B3RwvNGGsAt15w/exec';

const LOCATIONS = [
  { id: 'lv-store',     value: 'Louis Vuitton Store (Lvl 2, ION Orchard) — 12:00 PM', name: 'Louis Vuitton Store',    sub: 'Level 2, ION Orchard · 12:00 PM' },
  { id: 'vcna',         value: 'Van Cleef and Arpels Store (Lvl 2, ION Orchard) — 12:00 PM', name: 'Van Cleef and Arpels', sub: 'Level 2, ION Orchard · 12:00 PM' },
  { id: 'lv-office',    value: 'Louis Vuitton Office, Ngee Ann City — 12:10 PM',        name: 'Louis Vuitton Office',   sub: 'Ngee Ann City · 12:10 PM' },
  { id: 'lv-nac-store', value: 'Louis Vuitton Store, Ngee Ann City — 12:10 PM',         name: 'Louis Vuitton Store',    sub: 'Ngee Ann City · 12:10 PM' },
];

const BASES = [
  { id: 'r150',   value: '150g Rice (Cutting)',            name: '150g Rice',                    sub: 'Cutting',           price: 0,    label: 'Included' },
  { id: 'r200',   value: '200g Rice (Maintaining)',        name: '200g Rice',                    sub: 'Maintaining',       price: 0,    label: 'Included' },
  { id: 'r250',   value: '250g Rice (Bulking)',            name: '250g Rice',                    sub: 'Bulking',           price: 0,    label: 'Included' },
  { id: 'r350',   value: '350g Rice (+$1.00)',             name: '350g Rice',                    sub: 'Max Bulk',          price: 1.00, label: '+$1.00' },
  { id: 'veg200', value: '200g Vegetables Base (+$1.00)',  name: 'Replace with 200g Vegetables', sub: 'No rice — vegetable base', price: 1.00, label: '+$1.00' },
];

const SAUCES = [
  { id: 's-bc',    value: 'In-house Butter Chicken Sauce', name: 'In-house Butter Chicken Sauce', sub: 'Cashew nut paste, cottage cheese, real spices' },
  { id: 's-ranch', value: 'In-house Creamy Ranch Sauce',   name: 'In-house Creamy Ranch Sauce',   sub: 'Cool, herbaceous, house recipe' },
  { id: 's-none',  value: 'No Sauce',                      name: 'No Sauce',                      sub: 'Plain' },
];

const ADDONS = [
  { key: 'xcf-bc',    label: 'Extra 100g Butter Chicken',          sub: '+100g premium grilled chicken', price: 2.30 },
  { key: 'xcf-nh',    label: 'Extra 100g Nashville Hot Honey',      sub: '+100g premium grilled chicken', price: 2.30 },
  { key: 'xcf-med',   label: 'Extra 100g Mediterranean',            sub: '+100g premium grilled chicken', price: 2.30 },
  { key: 'xs-bc',     label: 'Extra In-house Butter Chicken Sauce', sub: 'Extra serving, in-house recipe', price: 1.00 },
  { key: 'xs-ranch',  label: 'Extra In-house Creamy Ranch Sauce',   sub: 'Extra serving, in-house recipe', price: 1.00 },
  { key: 'xveg',      label: 'Extra Vegetables',                    sub: 'Serving of vegetable of the day', price: 1.00 },
];

const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getSGTDates() {
  const nowSGT = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
  const pastCutoff = nowSGT.getHours() > 9 || (nowSGT.getHours() === 9 && nowSGT.getMinutes() >= 30);
  const startOffset = pastCutoff ? 1 : 0;
  const dates = [];
  for (let i = startOffset; i <= 14 && dates.length < 5; i++) {
    const d = new Date(nowSGT);
    d.setDate(nowSGT.getDate() + i);
    const day = DAYS[d.getDay()];
    if (day === 'SAT' || day === 'SUN') continue;
    dates.push({ iso: d.toISOString().slice(0, 10), day, num: d.getDate(), month: MONTHS[d.getMonth()] });
  }
  return { dates, pastCutoff };
}

export default function Staff() {
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [location, setLocation]   = useState('');
  const [flavour, setFlavour]     = useState('');
  const [base, setBase]           = useState('');
  const [sauce, setSauce]         = useState('');
  const [selectedDate, setDate]   = useState('');
  const [qty, setQty]             = useState(1);
  const [addons, setAddons]       = useState({ 'xcf-bc': 0, 'xcf-nh': 0, 'xcf-med': 0, 'xs-bc': 0, 'xs-ranch': 0, xveg: 0 });
  const [notes, setNotes]         = useState('');
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [modal, setModal]         = useState(null); // { amount, ref, waUrl }

  const { dates, pastCutoff } = getSGTDates();

  useEffect(() => {
    // Inject Barlow Condensed font
    if (!document.getElementById('barlow-font')) {
      const link = document.createElement('link');
      link.id = 'barlow-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  function adj(key, delta) {
    setAddons(a => ({ ...a, [key]: Math.max(0, (a[key] || 0) + delta) }));
  }

  function getBasePrice() {
    const b = BASES.find(x => x.id === base);
    return b ? b.price : 0;
  }

  function getTotal() {
    const basePrice = 8.50 + getBasePrice();
    const addonTotal = (addons['xcf-bc'] + addons['xcf-nh'] + addons['xcf-med']) * 2.30
                     + (addons['xs-bc'] + addons['xs-ranch'] + addons.xveg) * 1.00;
    return (basePrice + addonTotal) * qty;
  }

  async function submit() {
    const errs = {};
    if (!name)         errs.name     = 'Please enter your name.';
    if (!phone)        errs.phone    = 'Please enter your mobile number.';
    if (!location)     errs.location = 'Please select a delivery location.';
    if (!flavour)      errs.flavour  = 'Please choose a flavour.';
    if (!base)         errs.base     = 'Please select a base.';
    if (!sauce)        errs.sauce    = 'Please select a sauce option.';
    if (!selectedDate) errs.date     = 'Please select a date.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const total = getTotal();
    const payload = {
      timestamp: new Date().toISOString(),
      name, phone,
      location,
      date: selectedDate,
      flavour,
      base: BASES.find(x => x.id === base)?.value || base,
      sauce,
      quantity: qty,
      extraChickenBC: addons['xcf-bc'],
      extraChickenNH: addons['xcf-nh'],
      extraChickenMed: addons['xcf-med'],
      extraSauceBC: addons['xs-bc'],
      extraSauceRanch: addons['xs-ranch'],
      extraVeg: addons.xveg,
      total: '$' + total.toFixed(2),
      notes: notes || '—',
    };

    try {
      await fetch(GAS_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (e) { console.log('GAS error:', e); }

    const waMsg = encodeURIComponent(
      'Hi Damien, I have paid for my N2 meal order.\n\n' +
      'Name: ' + name + '\nDate: ' + selectedDate + '\nLocation: ' + location +
      '\nFlavour: ' + flavour + '\nAmount Paid: $' + total.toFixed(2) +
      '\n\nPayNow reference: ' + name + ' ' + selectedDate
    );

    setModal({
      amount: '$' + total.toFixed(2),
      ref: name + ' ' + selectedDate,
      waUrl: 'https://wa.me/6587977961?text=' + waMsg,
    });
    setLoading(false);
  }

  const s = {
    page: { background: '#0a0a0a', minHeight: '100vh', fontFamily: "'Barlow', sans-serif", color: '#fff', paddingBottom: 120 },
    banner: { background: '#00e8c6', color: '#0a0a0a', textAlign: 'center', padding: '10px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' },
    infoBox: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderLeft: '3px solid #00e8c6', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', maxWidth: 560, margin: '20px auto 0', padding2: '0 16px' },
    main: { maxWidth: 560, margin: '0 auto', padding: '24px 16px 0' },
    sectionLabel: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: 10, marginTop: 28 },
    field: { marginBottom: 12 },
    input: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none', fontFamily: "'Barlow', sans-serif" },
    optionGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
    optionRow: (sel) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#141414', border: `2px solid ${sel ? '#00e8c6' : '#2a2a2a'}`, borderRadius: 12, cursor: 'pointer', transition: 'border-color 0.2s' }),
    optName: { fontSize: 14, fontWeight: 600 },
    optSub: { fontSize: 12, color: '#888', marginTop: 2 },
    checkIcon: { width: 22, height: 22, borderRadius: '50%', background: '#00e8c6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    mealCard: (sel) => ({ background: '#141414', border: `2px solid ${sel ? '#00e8c6' : '#2a2a2a'}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s', marginBottom: 12 }),
    mealImg: { width: '100%', height: 160, objectFit: 'cover', display: 'block' },
    mealBody: { padding: '14px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
    mealName: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: '0.02em' },
    tag: { fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20, border: '1px solid #2a2a2a', color: '#ccc' },
    tagCyan: { fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20, border: '1px solid #00e8c6', color: '#00e8c6' },
    priceStrike: { fontSize: 13, color: '#888', textDecoration: 'line-through', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    priceCurrent: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: '#00e8c6' },
    dateGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 },
    dateBtn: (sel) => ({ background: '#141414', border: `2px solid ${sel ? '#00e8c6' : '#2a2a2a'}`, borderRadius: 10, padding: '10px 6px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }),
    dateBtnDay: { fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888', marginBottom: 4 },
    dateBtnNum: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800 },
    dateBtnMonth: { fontSize: 10, color: '#888' },
    stepper: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 16px', marginBottom: 8 },
    stepperInfo: { flex: 1 },
    stepperName: { fontSize: 14, fontWeight: 600 },
    stepperSub: { fontSize: 12, color: '#888', marginTop: 2 },
    stepperPrice: { fontSize: 12, color: '#00e8c6', marginTop: 4, fontWeight: 600 },
    stepperControls: { display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 },
    stepBtn: { width: 36, height: 36, background: '#2a2a2a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 },
    stepCount: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, minWidth: 20, textAlign: 'center' },
    textarea: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none', fontFamily: "'Barlow', sans-serif", height: 80, resize: 'vertical' },
    divider: { borderTop: '1px solid #2a2a2a', margin: '24px 0' },
    error: { fontSize: 12, color: '#ff5c5c', marginTop: 6 },
    totalBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,10,10,0.97)', borderTop: '1px solid #2a2a2a', backdropFilter: 'blur(12px)', zIndex: 200 },
    totalBarInner: { maxWidth: 560, margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
    totalLabel: { fontSize: 12, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" },
    totalValue: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: '#00e8c6' },
    submitBtn: { background: '#00e8c6', color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '14px 28px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0 },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 500, padding: '0 0 0' },
    modalBox: { background: '#141414', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 560, padding: '32px 24px 40px', textAlign: 'center' },
    successIcon: { width: 56, height: 56, borderRadius: '50%', background: '#00e8c6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
    modalTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 6 },
    modalSub: { fontSize: 14, color: '#888', marginBottom: 20 },
    payAmount: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 800, color: '#00e8c6', margin: '0 0 16px' },
    qrImg: { width: 180, height: 180, margin: '0 auto 16px', display: 'block' },
    refLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 },
    refValue: { fontSize: 16, fontWeight: 600, marginBottom: 16 },
    payNote: { fontSize: 12, color: '#888', lineHeight: 1.6, marginBottom: 20 },
    waBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 24px', width: '100%', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, textDecoration: 'none', marginBottom: 12, cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase' },
    modalClose: { width: '100%', background: '#2a2a2a', color: '#888', border: 'none', borderRadius: 10, padding: '14px', fontFamily: "'Barlow', sans-serif", fontSize: 14, cursor: 'pointer' },
  };

  const Checkmark = () => (
    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
      <path d="M1 4L4.5 7.5L11 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={s.page}>
      {/* Delivery Banner */}
      <div style={s.banner}>
        Staff Exclusive &nbsp;·&nbsp; Free Delivery &nbsp;·&nbsp; Orders close 9:30 AM daily
      </div>

      {/* Info block */}
      <div style={{ maxWidth: 560, margin: '20px auto 0', padding: '0 16px' }}>
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderLeft: '3px solid #00e8c6', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00e8c6', marginBottom: 4 }}>
              Staff Exclusive Pricing — $1 Off
            </div>
            <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>
              This page and its pricing are reserved for N2 staff contacts only. Bowls are priced at $8.50 here — $1 off the usual $9.50. Free delivery to ION Orchard and Ngee Ann City locations.
            </div>
            <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5, marginTop: 8 }}>🥩 No pork, no lard.</div>
          </div>
        </div>
      </div>

      <div style={s.main}>

        {/* Contact */}
        <div style={s.sectionLabel}>Your Details <span style={{ color: '#00e8c6' }}>*</span></div>
        <div style={s.field}>
          <input style={s.input} placeholder="Name" value={name} onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: '' })); }} />
          {errors.name && <div style={s.error}>{errors.name}</div>}
        </div>
        <div style={s.field}>
          <input style={s.input} placeholder="Mobile Number e.g. 9123 4567" type="tel" value={phone} onChange={e => { setPhone(e.target.value); setErrors(er => ({ ...er, phone: '' })); }} />
          {errors.phone && <div style={s.error}>{errors.phone}</div>}
        </div>

        {/* Location */}
        <div style={s.sectionLabel}>Delivery Location <span style={{ color: '#00e8c6' }}>*</span></div>
        <div style={s.optionGroup}>
          {LOCATIONS.map(loc => {
            const sel = location === loc.value;
            return (
              <div key={loc.id} style={s.optionRow(sel)} onClick={() => { setLocation(loc.value); setErrors(er => ({ ...er, location: '' })); }}>
                <div>
                  <div style={s.optName}>{loc.name}</div>
                  <div style={s.optSub}>{loc.sub}</div>
                </div>
                {sel && <div style={s.checkIcon}><Checkmark /></div>}
              </div>
            );
          })}
        </div>
        {errors.location && <div style={s.error}>{errors.location}</div>}

        {/* Date */}
        <div style={s.sectionLabel}>Delivery Date <span style={{ color: '#00e8c6' }}>*</span></div>
        <div style={s.dateGrid}>
          {dates.map(d => (
            <div key={d.iso} style={s.dateBtn(selectedDate === d.iso)} onClick={() => { setDate(d.iso); setErrors(er => ({ ...er, date: '' })); }}>
              <div style={s.dateBtnDay}>{d.day}</div>
              <div style={s.dateBtnNum}>{d.num}</div>
              <div style={s.dateBtnMonth}>{d.month}</div>
            </div>
          ))}
        </div>
        {pastCutoff && <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Orders for today are closed (past 9:30 AM). Showing next available days.</div>}
        {errors.date && <div style={s.error}>{errors.date}</div>}

        <div style={s.divider} />

        {/* Flavour */}
        <div style={s.sectionLabel}>Choose Flavour <span style={{ color: '#00e8c6' }}>*</span></div>

        {[
          { id: 'butter', value: 'Butter Chicken', origin: 'North India', tags: ['Creamy', 'Bold', 'Aromatic'], tagType: 'normal', sub: 'Inspired by the spice houses of Old Delhi.', bestseller: true, img: '/images/butter-chicken.jpg' },
          { id: 'nashville', value: 'Nashville Hot Honey', origin: 'Southern USA', tags: ['Sweet', 'Spicy', 'Addictive'], tagType: 'cyan', sub: 'A southern American classic.', img: '/images/nashville.jpg' },
          { id: 'med', value: 'Mediterranean', origin: 'Mediterranean', tags: ['Herbs', 'Spices', 'Clean'], tagType: 'normal', sub: 'Grilled with fresh herbs and spices.', img: '/images/mediterranean.jpg' },
        ].map(meal => {
          const sel = flavour === meal.value;
          return (
            <div key={meal.id} style={s.mealCard(sel)} onClick={() => { setFlavour(meal.value); setErrors(er => ({ ...er, flavour: '' })); }}>
              <img style={s.mealImg} src={meal.img} alt={meal.value} onError={e => { e.target.style.display = 'none'; }} />
              <div style={s.mealBody}>
                <div style={{ flex: 1 }}>
                  {meal.bestseller && <div style={{ fontSize: 11, color: '#f5a623', fontWeight: 700, marginBottom: 4 }}>⭐ Best Seller</div>}
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{meal.origin}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
                    {meal.tags.map(t => <span key={t} style={meal.tagType === 'cyan' ? s.tagCyan : s.tag}>{t}</span>)}
                  </div>
                  <div style={s.mealName}>{meal.value}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{meal.sub}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div><span style={s.priceStrike}>$9.50</span> <span style={{ fontSize: 11, color: '#00e8c6', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Staff</span></div>
                    <div style={s.priceCurrent}>$8.50</div>
                  </div>
                  {sel && <div style={s.checkIcon}><Checkmark /></div>}
                </div>
              </div>
            </div>
          );
        })}
        {errors.flavour && <div style={s.error}>{errors.flavour}</div>}

        {/* Base */}
        <div style={s.sectionLabel}>Base <span style={{ color: '#00e8c6' }}>*</span></div>
        <div style={s.optionGroup}>
          {BASES.map(b => {
            const sel = base === b.id;
            return (
              <div key={b.id} style={s.optionRow(sel)} onClick={() => { setBase(b.id); setErrors(er => ({ ...er, base: '' })); }}>
                <div>
                  <div style={s.optName}>{b.name}</div>
                  <div style={s.optSub}>{b.sub}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, color: b.price > 0 ? '#00e8c6' : '#888', fontWeight: 600 }}>{b.label}</span>
                  {sel && <div style={s.checkIcon}><Checkmark /></div>}
                </div>
              </div>
            );
          })}
        </div>
        {errors.base && <div style={s.error}>{errors.base}</div>}

        {/* Sauce */}
        <div style={s.sectionLabel}>Choose Sauce <span style={{ color: '#00e8c6' }}>*</span></div>
        <div style={s.optionGroup}>
          {SAUCES.map(sc => {
            const sel = sauce === sc.value;
            return (
              <div key={sc.id} style={s.optionRow(sel)} onClick={() => { setSauce(sc.value); setErrors(er => ({ ...er, sauce: '' })); }}>
                <div>
                  <div style={s.optName}>{sc.name}</div>
                  <div style={s.optSub}>{sc.sub}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, color: '#888' }}>Included</span>
                  {sel && <div style={s.checkIcon}><Checkmark /></div>}
                </div>
              </div>
            );
          })}
        </div>
        {errors.sauce && <div style={s.error}>{errors.sauce}</div>}

        {/* Quantity */}
        <div style={s.sectionLabel}>Quantity</div>
        <div style={s.stepper}>
          <div style={s.stepperInfo}>
            <div style={s.stepperName}>Number of Boxes</div>
            <div style={s.stepperSub}>Same flavour and base configuration</div>
          </div>
          <div style={s.stepperControls}>
            <button style={s.stepBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <div style={s.stepCount}>{qty}</div>
            <button style={{ ...s.stepBtn, background: '#00e8c6', color: '#000' }} onClick={() => setQty(q => q + 1)}>+</button>
          </div>
        </div>

        <div style={s.divider} />
        <div style={s.sectionLabel}>Add-ons</div>

        {ADDONS.map(a => (
          <div key={a.key} style={s.stepper}>
            <div style={s.stepperInfo}>
              <div style={s.stepperName}>{a.label}</div>
              <div style={s.stepperSub}>{a.sub}</div>
              <div style={s.stepperPrice}>+${a.price.toFixed(2)} each</div>
            </div>
            <div style={s.stepperControls}>
              <button style={s.stepBtn} onClick={() => adj(a.key, -1)}>−</button>
              <div style={s.stepCount}>{addons[a.key]}</div>
              <button style={{ ...s.stepBtn, background: '#00e8c6', color: '#000' }} onClick={() => adj(a.key, 1)}>+</button>
            </div>
          </div>
        ))}

        {/* Notes */}
        <div style={{ ...s.sectionLabel, marginTop: 28 }}>Special Requests</div>
        <textarea style={s.textarea} placeholder="Allergies, dietary needs, or anything else..." value={notes} onChange={e => setNotes(e.target.value)} />

      </div>

      {/* Total Bar */}
      <div style={s.totalBar}>
        <div style={s.totalBarInner}>
          <div>
            <div style={s.totalLabel}>Total</div>
            <div style={s.totalValue}>${getTotal().toFixed(2)}</div>
          </div>
          <button style={s.submitBtn} onClick={submit} disabled={loading}>
            {loading ? 'Sending...' : 'Place Order'}
          </button>
        </div>
      </div>

      {/* PayNow Modal */}
      {modal && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={s.modalBox}>
            <div style={s.successIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 14L11 20L23 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={s.modalTitle}>Order Placed!</div>
            <div style={s.modalSub}>Complete your payment via PayNow</div>
            <div style={s.payAmount}>{modal.amount}</div>
            <div style={s.refLabel}>Payment Reference</div>
            <div style={s.refValue}>{modal.ref}</div>
            <p style={s.payNote}>
              Scan the PayNow QR of the person who took your order and enter the exact amount.<br />
              Use your name as the payment reference so we can match your order.
            </p>
            <a style={s.waBtn} href={modal.waUrl} target="_blank" rel="noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirm Payment on WhatsApp
            </a>
            <button style={s.modalClose} onClick={() => setModal(null)}>Done — I've paid</button>
          </div>
        </div>
      )}
    </div>
  );
}
