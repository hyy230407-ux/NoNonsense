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
    extraRice: 0
  });

  const [extraChickenFlavors, setExtraChickenFlavors] = useState({
    butter: 0,
    pepper: 0
  });

  const sauceData = [
    { id: 'pepper', name: 'Black Pepper', icon: '/images/black_pepper_sauce.png', color: '#555' },
    { id: 'butter', name: 'Butter Chicken', icon: '/images/butter_chicken.png', color: '#ffb347' },
    { id: 'ranch', name: 'Creamy Ranch', icon: '🍶', color: '#f8f9fa' }
  ];

  const getDefaultSauce = () => {
    if (!meal) return 'ranch';
    const title = meal.title.toLowerCase();
    if (title.includes('butter')) return 'butter';
    if (title.includes('pepper')) return 'pepper';
    return 'ranch';
  };

  const [selectedBaseSauce, setSelectedBaseSauce] = useState(getDefaultSauce());
  const [extraSauces, setExtraSauces] = useState({
    butter: 0,
    pepper: 0,
    ranch: 0
  });

  const [isExtraChickenOpen, setIsExtraChickenOpen] = useState(true);

  if (!meal) return null;

  const addonPrices = {
    extraChicken: 1.90,
    sauce: 1.00,
    softBoiledEgg: 0.80,
    extraRice: 1.00
  };

  const getBasePrice = () => parseFloat(meal.price.replace('$', ''));

  const calculateTotal = () => {
    let total = getBasePrice();
    
    // Addons
    total += addons.softBoiledEgg * addonPrices.softBoiledEgg;
    total += addons.extraRice * addonPrices.extraRice;
    
    // Extra Sauces
    const totalExtraSauces = Object.values(extraSauces).reduce((a, b) => a + b, 0);
    total += totalExtraSauces * addonPrices.sauce;
    
    // Flavors
    const totalExtraChickens = Object.values(extraChickenFlavors).reduce((a, b) => a + b, 0);
    total += totalExtraChickens * addonPrices.extraChicken;
    
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
    const selectedAddons = [
      `Base Sauce: ${sauceData.find(s => s.id === selectedBaseSauce).name}`,
      ...Object.entries(addons)
        .filter(([_, qty]) => qty > 0)
        .map(([key, qty]) => {
          const labels = {
            softBoiledEgg: 'Soft Boiled Egg',
            extraRice: 'Extra Rice'
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
          const flavor = sauceData.find(f => f.id === id);
          return `Extra ${flavor.name} (x${qty})`;
        })
    ];

    const customizedItem = {
      ...meal,
      price: `$${(parseFloat(calculateTotal()) / totalQuantity).toFixed(2)}`,
      quantity: totalQuantity,
      customizations: {
        riceSize: isSnack ? null : riceSize,
        addons: selectedAddons
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

  const macros = isSnack ? {
    kcal: 165,
    protein: '28g',
    carbs: '1g',
    fat: '4g'
  } : {
    kcal: 580,
    protein: '42g',
    carbs: '62g',
    fat: '10g'
  };

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
            {/* Collection Alert */}
            <div className="collection-alert">
              <Calendar size={20} className="text-cyan" />
              <div className="alert-text">
                <strong>Pre-order for next-day collection</strong>
                <span>Order today → collect tomorrow · 11 AM – 3 PM</span>
              </div>
            </div>

            {/* Macros Section */}
            <section className="modal-section">
              <h3 className="section-label">MACROS · ×1 SERVING</h3>
              <div className="macros-modern-grid">
                <div className="macro-card">
                  <span className="macro-num text-orange">{macros.kcal}</span>
                  <span className="macro-unit">Calories</span>
                </div>
                <div className="macro-card border-left">
                  <span className="macro-num text-green">{macros.protein}</span>
                  <span className="macro-unit">Protein</span>
                </div>
                <div className="macro-card border-left">
                  <span className="macro-num text-blue">{macros.carbs}</span>
                  <span className="macro-unit">Carbs</span>
                </div>
                <div className="macro-card border-left">
                  <span className="macro-num text-pink">{macros.fat}</span>
                  <span className="macro-unit">Fat</span>
                </div>
              </div>
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
                      {sauce.id === 'ranch' ? sauce.icon : <img src={sauce.icon} alt={sauce.name} />}
                    </div>
                    <span className="sauce-name">{sauce.name}</span>
                  </div>
                ))}
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
                        {sauce.id === 'ranch' ? sauce.icon : <img src={sauce.icon} alt={sauce.name} />}
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
                {/* Extra Chicken Accordion */}
                <div className={`addon-modern-item flavor-accordion ${isExtraChickenOpen ? 'expanded' : ''}`}>
                  <div className="accordion-header" onClick={() => setIsExtraChickenOpen(!isExtraChickenOpen)}>
                    <div className="addon-icon-box">🍗</div>
                    <div className="addon-details">
                      <span className="addon-title">Extra Chicken</span>
                      <span className="addon-info">+80g grilled · (~20g protein)</span>
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
                        {sauceData.filter(s => s.id !== 'ranch').map(flavor => (
                          <div key={flavor.id} className="flavor-item">
                            <div className="flavor-left">
                              <div className="flavor-img">
                                <img src={flavor.icon} alt={flavor.name} />
                              </div>
                              <div className="flavor-info">
                                <div className="flavor-name">{flavor.name}</div>
                                <div className="flavor-meta" style={{ color: flavor.color }}>
                                  +$1.90 · 80g (~20g protein)
                                </div>
                              </div>
                            </div>
                            <div className="flavor-right">
                              <div className="flavor-qty-controls">
                                <button 
                                  className="flavor-qty-btn minus"
                                  onClick={() => updateFlavor(flavor.id, -1)}
                                  disabled={extraChickenFlavors[flavor.id] === 0}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="flavor-qty-val">{extraChickenFlavors[flavor.id]}</span>
                                <button 
                                  className="flavor-qty-btn plus"
                                  style={{ backgroundColor: flavor.color }}
                                  onClick={() => updateFlavor(flavor.id, 1)}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>


                <div className={`addon-modern-item ${addons.softBoiledEgg > 0 ? 'active' : ''}`}>
                  <div className="addon-icon-box">🥚</div>
                  <div className="addon-details">
                    <span className="addon-title">Soft Boiled Egg</span>
                    <span className="addon-info">~6g protein · soft, jammy centre</span>
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
              </div>
            </section>

            {/* Collection Details */}
            <section className="modal-section collection-section">
              <h3 className="section-label">COLLECTION DETAILS</h3>
              <div className="collection-card">
                <strong>{dateStr}</strong>
                <span>11:00 AM – 3:00 PM · N2 Kiosk, NYP North Canteen</span>
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
