import React, { useState } from 'react';
import { X, Calendar, Minus, Plus, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';
import { useCart } from '../../context/CartContext';
import './CustomizationModal.css';

const CustomizationModal = () => {
  const { 
    activeCustomizationMeal: meal, 
    closeCustomizationModal: onClose, 
    addToCart,
    setIsCartOpen
  } = useCart();


  const isSnack = meal?.isSnack || false;
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [riceSize, setRiceSize] = useState('200g');
  const [addons, setAddons] = useState({
    softBoiledEgg: 0,
    extraRice: 0,
    extraVegetables: 0
  });

  const sauceData = [
    // { id: 'pepper', name: 'Black Pepper', icon: '/images/black_pepper_sauce_cup.png', color: '#555' },
    { id: 'butter', name: 'Butter Chicken', icon: '/images/butter_chicken_sauce_cup.png', color: '#ffb347' },
    { id: 'ranch', name: 'Creamy Ranch', icon: '/images/creamy_ranch_sauce_cup.png', color: '#f8f9fa' }
  ];

  const flavorData = [
    { id: 'butter', name: 'Butter Chicken', icon: '/images/butter_chicken_chicken_flavor.png', color: '#ffb347' },
    { id: 'jalapeno', name: 'Jalapeno', icon: '/images/jalapeno_chicken.png', color: '#4ade80' },
    { id: 'nashville', name: 'Nashville Hot Honey', icon: '/images/nashville_chicken.png', color: '#ef4444' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '/images/mediterranean_chicken.png', color: '#60a5fa' },
    { id: 'jerk', name: 'Jamaican Jerk', icon: '/images/jerk_chicken.png', color: '#fbbf24' }
  ];

  const getDefaultSauce = () => {
    if (!meal) return 'ranch';
    const title = meal.title.toLowerCase();
    if (title.includes('butter')) return 'butter';
    // if (title.includes('pepper')) return 'pepper';
    return 'ranch';
  };

  const [selectedBaseSauce, setSelectedBaseSauce] = useState(getDefaultSauce());
  const [extraChickenFlavors, setExtraChickenFlavors] = useState({
    butter: 0, jalapeno: 0, nashville: 0, mediterranean: 0, jerk: 0
  });
  const [extraSauces, setExtraSauces] = useState({
    butter: 0, ranch: 0
  });

  // Calendar Logic
  const getCurrentLaunchWeekDays = () => {
    const now = new Date();
    const weekDays = [];
    const dayNamesAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let checkDate = new Date(now);
    checkDate.setHours(0, 0, 0, 0);

    // Look for the next 5 available weekdays
    // An available day is a weekday whose cutoff (preceding day at 12:00 AM) has not passed.
    while (weekDays.length < 5) {
      const dayOfWeek = checkDate.getDay();
      
      // Only include Monday – Friday
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const cutoff = new Date(checkDate);
        cutoff.setHours(0, 0, 0, 0);

        const pauseStart = new Date(2026, 3, 27); // April 27
        const pauseEnd = new Date(2026, 4, 1);   // May 1
        const isPaused = checkDate >= pauseStart && checkDate <= pauseEnd;

        if (now < cutoff && !isPaused) {
          const dateStr = checkDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
          weekDays.push({
            id: `${dayNamesAbbr[dayOfWeek].toLowerCase()}-${checkDate.getDate()}-${checkDate.getMonth()}`,
            name: dayNamesAbbr[dayOfWeek],
            nameFull: dayNamesFull[dayOfWeek],
            date: dateStr,
            fullDate: new Date(checkDate),
            status: 'open'
          });
        }
      }
      checkDate.setDate(checkDate.getDate() + 1);
      
      // Safety break to prevent infinite loop
      if (weekDays.length === 0 && checkDate.getTime() > now.getTime() + 14 * 24 * 60 * 60 * 1000) break;
    }

    return weekDays;
  };

  const weekDays = getCurrentLaunchWeekDays();
  const firstOpenDay = weekDays.find(d => d.status === 'open')?.id || '';
  const [selectedDay, setSelectedDay] = useState(firstOpenDay);
  const [isExtraChickenOpen, setIsExtraChickenOpen] = useState(true);
  const [error, setError] = useState(null);

  if (!meal) return null;

  const addonPrices = {
    extraChicken: 1.90,
    sauce: 1.00,
    softBoiledEgg: 0.80,
    extraRice: 1.00,
    extraVegetables: 1.00
  };

  const getBasePrice = () => parseFloat(meal.price.replace('$', ''));

  const calculateTotal = () => {
    let total = getBasePrice();
    
    // Addons
    total += addons.softBoiledEgg * addonPrices.softBoiledEgg;
    total += addons.extraRice * addonPrices.extraRice;
    total += addons.extraVegetables * addonPrices.extraVegetables;
    
    // Extra Sauces
    const totalExtraSauces = Object.values(extraSauces).reduce((a, b) => a + b, 0);
    total += totalExtraSauces * addonPrices.sauce;
    
    // Flavors
    Object.entries(extraChickenFlavors).forEach(([id, qty]) => {
      if (qty > 0) {
        const price = id === 'jerk' ? 2.30 : 1.90;
        total += qty * price;
      }
    });
    
    return (total * totalQuantity).toFixed(2);
  };

  const updateAddon = (addon, delta) => {
    setAddons(prev => ({
      ...prev,
      [addon]: Math.max(0, prev[addon] + delta)
    }));
  };

  const updateFlavor = (id, delta) => {
    setExtraChickenFlavors(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const updateExtraSauce = (id, delta) => {
    setExtraSauces(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };
  const handleAddToCart = () => {
    if (!selectedDay) {
      setError('Please select a collection day');
      // Scroll to calendar
      document.querySelector('.collection-calendar-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const selectedAddons = [
      `Base Sauce: ${sauceData.find(s => s.id === selectedBaseSauce).name}`,
      ...Object.entries(addons)
        .filter(([_, qty]) => qty > 0)
        .map(([key, qty]) => {
          const labels = {
            softBoiledEgg: 'Soft Boiled Egg',
            extraRice: 'Extra Rice',
            extraVegetables: 'Extra Vegetables'
          };
          return `${labels[key]} (x${qty})`;
        }),
      ...Object.entries(extraSauces)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => {
          const sauce = sauceData.find(s => s.id === id);
          return `Extra ${sauce.name} Sauce (x${qty})`;
        }),
      ...Object.entries(extraChickenFlavors)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => {
          const flavor = flavorData.find(f => f.id === id);
          return `Extra ${flavor.name} (x${qty})`;
        })
    ];

    const dayInfo = weekDays.find(d => d.id === selectedDay);

    const customizedItem = {
      ...meal,
      price: `$${(parseFloat(calculateTotal()) / totalQuantity).toFixed(2)}`,
      quantity: totalQuantity,
      customizations: {
        riceSize: isSnack ? null : riceSize,
        addons: selectedAddons,
        collectionDay: `${dayInfo.nameFull || dayInfo.name} (${dayInfo.date})`
      }
    };

    addToCart(customizedItem);
    setIsCartOpen(true);
    onClose();
  };

  // Hardcoded collection details for demo based on screenshots
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateStr = nextDay.toLocaleDateString('en-US', options);


  return (
    <div className="modern-modal-overlay" onClick={onClose}>
      <div className="modern-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header-image">
          <img src={meal.image} alt={meal.title} />
          <div className="header-overlay">
            <span className="item-label">{meal.isSnack ? 'SNACK' : 'MEAL'}</span>
            <h2 className="item-title">{meal.title}</h2>
          </div>
        </div>

        <div className="modal-scroll-area">
          <div className="modal-body-padding">
            {/* Collection Calendar Logic */}
            <section className="modal-section collection-calendar-section">
              <h3 className="section-label">SELECT COLLECTION DAY</h3>
              <div className="calendar-selection-grid">
                {weekDays.map((day) => (
                  <button 
                    key={day.id}
                    className={`calendar-day-btn ${day.status} ${selectedDay === day.id ? 'active' : ''}`}
                    disabled={day.status === 'closed'}
                    onClick={() => {
                      setSelectedDay(day.id);
                      setError(null);
                    }}
                  >
                    <span className="day-abbr">{day.name}</span>
                    <span className="day-date">{day.date}</span>
                    <span className="day-badge">{day.status === 'open' ? 'OPEN' : 'CLOSED'}</span>
                  </button>
                ))}
              </div>
              <p className="calendar-instruction">
                Select your preferred collection day. Orders close at <strong>12:00 AM</strong> on the day before collection.
              </p>
              {error && <div className="selection-error-msg">{error}</div>}
            </section>

            {/* Global Quantity */}
            <section className="modal-section">
              <h3 className="section-label">QUANTITY</h3>
              <div className="global-quantity">
                <button onClick={() => setTotalQuantity(q => Math.max(1, q - 1))} className="qty-btn">
                  <Minus size={20} />
                </button>
                <span className="qty-val">{totalQuantity}</span>
                <button onClick={() => setTotalQuantity(q => q + 1)} className="qty-btn">
                  <Plus size={20} />
                </button>
              </div>
            </section>

            {/* Rice Size - Only for Meals */}
            {!isSnack && (
              <section className="modal-section">
                <h3 className="section-label">RICE SIZE</h3>
                <div className="rice-cards">
                  {[
                    { val: '150g', label: 'Cutting' },
                    { val: '200g', label: 'Maintaining' },
                    { val: '250g', label: 'Bulking' }
                  ].map(opt => (
                    <div 
                      key={opt.val}
                      className={`rice-card ${riceSize === opt.val ? 'active' : ''}`}
                      onClick={() => setRiceSize(opt.val)}
                    >
                      <span className="rice-val">{opt.val}</span>
                      <span className="rice-label">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Base Sauce Section */}
            <section className="modal-section">
              <h3 className="section-label">CHOOSE BASE SAUCE</h3>
              <div className="sauce-cards">
                {sauceData.map(sauce => (
                  <div 
                    key={sauce.id}
                    className={`sauce-card ${selectedBaseSauce === sauce.id ? 'active' : ''}`}
                    onClick={() => setSelectedBaseSauce(sauce.id)}
                  >
                    <div className="sauce-icon">
                      <img src={sauce.icon} alt={sauce.name} />
                    </div>
                    <span className="sauce-name">{sauce.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Extra Chicken Section (Moved between Base Sauce and Extra Sauces) */}
            <section className="modal-section chicken-promotion-section">
              <h3 className="section-label">ADD EXTRA CHICKEN</h3>
              <div className={`addon-modern-item flavor-accordion ${isExtraChickenOpen ? 'expanded' : ''}`}>
                <div className="accordion-header" onClick={() => setIsExtraChickenOpen(!isExtraChickenOpen)}>
                  <div className="addon-icon-box">
                    <img src="/images/grilled_chicken_serving.png" alt="Grilled Chicken" className="section-featured-img" />
                  </div>
                  <div className="addon-details">
                    <span className="addon-title">Extra Grilled Chicken</span>
                    <span className="addon-info">+100g premium grilled chicken</span>
                  </div>
                  <div className="addon-right">
                    <span className="addon-cost">+$1.90</span>
                    {isExtraChickenOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExtraChickenOpen && (
                  <div className="accordion-content">
                    <div className="flavor-selection-label">CHOOSE FLAVOUR</div>
                    <div className="flavor-list">
                      {flavorData
                        .filter(flavor => !['jerk', 'mediterranean'].includes(flavor.id))
                        .map(flavor => {
                          const isBlocked = false; // Always false now since we filter them out
                          return (
                          <div key={flavor.id} className={`flavor-item ${isBlocked ? 'disabled' : ''}`}>
                            <div className="flavor-left">
                              <div className="flavor-img">
                                <img src={flavor.icon} alt={flavor.name} />
                              </div>
                              <div className="flavor-info">
                                <div className="flavor-name">
                                  {flavor.name}
                                  {isBlocked && <span className="sold-out-badge">SOLD OUT</span>}
                                </div>
                                <div className="flavor-meta" style={{ color: isBlocked ? '#444' : flavor.color }}>
                                  +${flavor.id === 'jerk' ? '2.30' : '1.90'} · 100g serving
                                </div>
                              </div>
                            </div>
                            <div className="flavor-right">
                              <div className="flavor-qty-controls">
                                <button 
                                  className="flavor-qty-btn minus"
                                  onClick={() => updateFlavor(flavor.id, -1)}
                                  disabled={extraChickenFlavors[flavor.id] === 0 || isBlocked}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="flavor-qty-val">{extraChickenFlavors[flavor.id]}</span>
                                <button 
                                  className="flavor-qty-btn plus"
                                  style={{ 
                                    backgroundColor: isBlocked ? '#1a1a1c' : flavor.color,
                                    opacity: isBlocked ? 0.3 : 1,
                                    cursor: isBlocked ? 'not-allowed' : 'pointer'
                                  }}
                                  onClick={() => !isBlocked && updateFlavor(flavor.id, 1)}
                                  disabled={isBlocked}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Extra Sauces Section */}
            <section className="modal-section">
              <h3 className="section-label">EXTRA SAUCES</h3>
              <div className="extra-sauce-list">
                {sauceData.map(sauce => (
                  <div key={sauce.id} className={`extra-sauce-item ${extraSauces[sauce.id] > 0 ? 'active' : ''}`}>
                    <div className="extra-sauce-left">
                      <div className="extra-sauce-icon-box">
                        <img src={sauce.icon} alt={sauce.name} />
                      </div>
                      <div className="extra-sauce-details">
                        <span className="extra-sauce-title">{sauce.name} Sauce</span>
                        <span className="extra-sauce-info">Extra serving · in-house recipe</span>
                      </div>
                    </div>
                    <div className="extra-sauce-right">
                      <span className="extra-sauce-cost">+$1.00</span>
                      <div className="addon-qty-controls">
                        <button onClick={() => updateExtraSauce(sauce.id, -1)}><Minus size={16} /></button>
                        <span>{extraSauces[sauce.id]}</span>
                        <button className="plus-btn" onClick={() => updateExtraSauce(sauce.id, 1)}><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Add-ons Section */}
            <section className="modal-section">
              <h3 className="section-label">OTHER ADD-ONS</h3>
              <div className="addon-modern-list">


{/* 
                <div className={`addon-modern-item ${addons.softBoiledEgg > 0 ? 'active' : ''}`}>
                  <div className="addon-icon-box">🥚</div>
                  <div className="addon-details">
                    <span className="addon-title">Soft Boiled Egg</span>
                    <span className="addon-info">Soft, jammy centre</span>
                  </div>
                  <div className="addon-right">
                    <span className="addon-cost">+$0.80</span>
                    <div className="addon-qty-controls">
                      <button onClick={() => updateAddon('softBoiledEgg', -1)}><Minus size={16} /></button>
                      <span>{addons.softBoiledEgg}</span>
                      <button className="plus-btn" onClick={() => updateAddon('softBoiledEgg', 1)}><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
*/}

                <div className={`addon-modern-item ${addons.extraRice > 0 ? 'active' : ''}`}>
                  <div className="addon-icon-box">🍚</div>
                  <div className="addon-details">
                    <span className="addon-title">Extra Rice</span>
                    <span className="addon-info">+100g steamed rice</span>
                  </div>
                  <div className="addon-right">
                    <span className="addon-cost">+$1.00</span>
                    <div className="addon-qty-controls">
                      <button onClick={() => updateAddon('extraRice', -1)}><Minus size={16} /></button>
                      <span>{addons.extraRice}</span>
                      <button className="plus-btn" onClick={() => updateAddon('extraRice', 1)}><Plus size={16} /></button>
                    </div>
                  </div>
                </div>

                <div className={`addon-modern-item ${addons.extraVegetables > 0 ? 'active' : ''}`}>
                  <div className="addon-icon-box">🥦</div>
                  <div className="addon-details">
                    <span className="addon-title">Extra Vegetables</span>
                    <span className="addon-info">+Serving of fresh veg</span>
                  </div>
                  <div className="addon-right">
                    <span className="addon-cost">+$1.00</span>
                    <div className="addon-qty-controls">
                      <button onClick={() => updateAddon('extraVegetables', -1)}><Minus size={16} /></button>
                      <span>{addons.extraVegetables}</span>
                      <button className="plus-btn" onClick={() => updateAddon('extraVegetables', 1)}><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Collection Details Reminder */}
            <section className="modal-section collection-section">
              <h3 className="section-label">COLLECTION LOCATION</h3>
              <div className="collection-card">
                <strong>11:00 AM – 3:00 PM</strong>
                <span>N2 Kiosk, NYP North Canteen</span>
              </div>
            </section>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-modern-footer">
          <div className="price-summary">
            <span className="summary-label">Total Price</span>
            <span className="summary-total">${calculateTotal()}</span>
          </div>
          <Button 
            variant="primary" 
            className="btn-full checkout-btn"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={20} />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
