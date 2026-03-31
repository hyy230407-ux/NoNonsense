import React, { useState } from 'react';
import { X, Calendar, Minus, Plus, ShoppingBag } from 'lucide-react';
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
    extraChicken: 0,
    extraRanch: 0,
    softBoiledEgg: 0,
    extraRice: 0
  });

  if (!meal) return null;

  const addonPrices = {
    extraChicken: 1.90,
    extraRanch: 1.00,
    softBoiledEgg: 0.80,
    extraRice: 1.00
  };

  const getBasePrice = () => parseFloat(meal.price.replace('$', ''));
  
  const calculateTotal = () => {
    let total = getBasePrice();
    total += addons.extraChicken * addonPrices.extraChicken;
    total += addons.extraRanch * addonPrices.extraRanch;
    total += addons.softBoiledEgg * addonPrices.softBoiledEgg;
    total += addons.extraRice * addonPrices.extraRice;
    return (total * totalQuantity).toFixed(2);
  };

  const updateAddon = (addon, delta) => {
    setAddons(prev => ({
      ...prev,
      [addon]: Math.max(0, prev[addon] + delta)
    }));
  };

  const handleAddToCart = () => {
    const selectedAddons = Object.entries(addons)
      .filter(([_, qty]) => qty > 0)
      .map(([key, qty]) => {
        const labels = {
          extraChicken: 'Extra Chicken',
          extraRanch: 'Extra Ranch Sauce',
          softBoiledEgg: 'Soft Boiled Egg',
          extraRice: 'Extra Rice'
        };
        return `${labels[key]} (x${qty})`;
      });

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

            {/* Add-ons Section */}
            <section className="modal-section">
              <h3 className="section-label">ADD-ONS</h3>
              <div className="addon-modern-list">
                <div className={`addon-modern-item ${addons.extraChicken > 0 ? 'active' : ''}`}>
                  <div className="addon-icon-box">🍗</div>
                  <div className="addon-details">
                    <span className="addon-title">Extra Chicken</span>
                    <span className="addon-info">+100g grilled · (~25g protein)</span>
                  </div>
                  <div className="addon-right">
                    <span className="addon-cost">+$1.90</span>
                    <div className="addon-qty-controls">
                      <button onClick={() => updateAddon('extraChicken', -1)}><Minus size={16} /></button>
                      <span>{addons.extraChicken}</span>
                      <button className="plus-btn" onClick={() => updateAddon('extraChicken', 1)}><Plus size={16} /></button>
                    </div>
                  </div>
                </div>

                <div className={`addon-modern-item ${addons.extraRanch > 0 ? 'active' : ''}`}>
                  <div className="addon-icon-box">🥫</div>
                  <div className="addon-details">
                    <span className="addon-title">Extra Ranch Sauce</span>
                    <span className="addon-info">Scratch-made · no seed oils · no artificials</span>
                  </div>
                  <div className="addon-right">
                    <span className="addon-cost">+$1.00</span>
                    <div className="addon-qty-controls">
                      <button onClick={() => updateAddon('extraRanch', -1)}><Minus size={16} /></button>
                      <span>{addons.extraRanch}</span>
                      <button className="plus-btn" onClick={() => updateAddon('extraRanch', 1)}><Plus size={16} /></button>
                    </div>
                  </div>
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
