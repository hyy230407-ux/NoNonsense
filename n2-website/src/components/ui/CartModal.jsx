import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Calendar, AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from './Button';
import './CartModal.css';

const CartModal = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart
  } = useCart();

  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          items: cartItems,
          totalPrice: totalPrice,
          notes: ''
        })
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to create payment. Please try again.');
      }

      // Clear cart and close modal before redirect
      clearCart();
      setIsCartOpen(false);
      setStep('cart');
      setFormData({ name: '', email: '', phone: '' });

      // Redirect to HitPay PayNow payment page
      window.location.href = data.url;

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={20} className="text-cyan" />
            <h2>{step === 'cart' ? 'Your Cart' : 'Your Details'}</h2>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="cart-content">

          {/* ── CART STEP ── */}
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="empty-cart flex-center flex-column">
                  <div className="empty-icon">🛒</div>
                  <p className="text-gray">Your cart is empty</p>
                  <Button variant="primary" className="mt-20" onClick={() => setIsCartOpen(false)}>
                    Go to Menu
                  </Button>
                </div>
              ) : (
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.cartId} className="cart-item">
                      <div className="cart-item-img">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="cart-item-info">
                        <h3>{item.title}</h3>
                        {item.customizations && (
                          <div className="cart-item-customs">
                            {item.customizations.riceSize && (
                              <span className="custom-tag rice-tag">{item.customizations.riceSize}</span>
                            )}
                            {item.customizations.collectionDay && (
                              <span className="custom-tag day-tag">
                                <Calendar size={12} className="icon-mr-xs" />
                                {item.customizations.collectionDay}
                              </span>
                            )}
                            {item.customizations.addons.map((addon, idx) => (
                              <span key={idx} className="custom-tag">{addon}</span>
                            ))}
                          </div>
                        )}
                        <p className="text-cyan price-tag">{item.price}</p>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.cartId, -1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.cartId)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── CHECKOUT STEP ── */}
          {step === 'checkout' && (
            <form className="checkout-form" onSubmit={handleProceedToPayment}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9123 4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <div className="collection-reminder mt-20">
                <AlertTriangle size={18} className="text-cyan" />
                <p>
                  <strong>Collection:</strong> Your selected day(s), 11 AM – 3 PM at N2 Kiosk, North Canteen.
                </p>
              </div>

              <div className="order-summary-mini mt-20">
                <div className="summary-item">
                  <span>Items ({cartItems.length})</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="summary-item total">
                  <span>Total</span>
                  <span className="text-cyan">${totalPrice}</span>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="text-gray">Total Amount</span>
              <span className="total-price">${totalPrice}</span>
            </div>

            {step === 'cart' ? (
              <Button variant="primary" className="btn-full" onClick={() => setStep('checkout')}>
                Checkout Now
              </Button>
            ) : (
              <div className="checkout-actions">
                <Button variant="secondary" onClick={() => setStep('cart')} disabled={isSubmitting}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleProceedToPayment} disabled={isSubmitting}>
                  {isSubmitting ? 'Redirecting...' : 'Pay with PayNow'}
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CartModal;
