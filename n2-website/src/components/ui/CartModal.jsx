import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
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

  const [step, setStep] = useState('cart'); // 'cart', 'payment', 'checkout', 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // -------------------------------------------------------------------------
    // IMPORTANT: STEP-BY-STEP FOR GOOGLE APPS SCRIPT
    // -------------------------------------------------------------------------
    // 1. Open gas-code.js in this project.
    // 2. Open a Google Sheet, go to Extensions > Apps Script.
    // 3. Paste the code from gas-code.js there and save.
    // 4. Click 'Deploy' > 'New Deployment' > 'Web App'.
    // 5. 'Execute as: Me' and 'Who has access: Anyone'.
    // 6. Copy the Deployment URL and paste it below:
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbyTAzaqqyN9e6Wkn0gLVHGp9Q1WIn9Vu81iZFJDR_LUlcbh49fster28bQgeNfM46tkrg/exec'; 
    // -------------------------------------------------------------------------

    const orderData = {
      ...formData,
      items: cartItems,
      totalPrice: totalPrice,
      timestamp: new Date().toISOString()
    };

    try {
      // Using fetch with no-cors might be needed for GAS, 
      // but standard fetch often works if GAS is set up correctly.
      // However, GAS redirected responses can be tricky.
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors', // Essential for GAS to avoid CORS preflight issues
        headers: {
          'Content-Type': 'text/plain', // Use text/plain to avoid preflight
        },
        body: JSON.stringify(orderData),
      });

      // Since mode is 'no-cors', we won't get a proper response body,
      // but if it doesn't throw, it likely succeeded.
      setStep('success');
      setTimeout(() => {
        clearCart();
        setIsCartOpen(false);
        setStep('cart');
        setFormData({ name: '', email: '', phone: '' });
      }, 3000);

    } catch (err) {
      console.error('Checkout error:', err);
      setError('Something went wrong. Please try again or contact us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={20} className="text-cyan" />
            <h2>
              {step === 'cart' && 'Your Cart'}
              {step === 'payment' && 'Payment Verification'}
              {step === 'checkout' && 'Checkout Details'}
              {step === 'success' && 'Order Received!'}
            </h2>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="empty-cart flex-center flex-column">
                  <div className="empty-icon">🛒</div>
                  <p className="text-gray">Your cart is empty</p>
                  <Button 
                    variant="primary" 
                    className="mt-20" 
                    onClick={() => setIsCartOpen(false)}
                  >
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
          
          {step === 'payment' && (
            <div className="payment-step">
              <div className="payment-instructions">
                <p className="instruction-text">
                  Please scan the QR code below to pay the total amount of <strong className="text-cyan">${totalPrice}</strong> using PayNow.
                </p>
                <div className="qr-container">
                  <img src="/images/paynow_qr.png" alt="PayNow QR Code" className="payment-qr" />
                </div>
                
                <div className="payment-warning-box">
                  <AlertTriangle size={20} className="text-orange" />
                  <div className="warning-text">
                    <strong>IMPORTANT:</strong> You must enter your personal details in the <strong>next step</strong> after payment to confirm your order.
                  </div>
                </div>
                <div className="whatsapp-box">
                  <p>After payment, please send a screenshot to:</p>
                  <a 
                    href={`https://wa.me/6585852055?text=Hi, here is my payment screenshot for my order total of S$${totalPrice}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="whatsapp-btn"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="20" />
                    <span>+65 8585 2055</span>
                  </a>
                  <p className="note text-gray mt-10">
                    Your order will be processed once payment is verified.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'checkout' && (
            <form className="checkout-form" onSubmit={handleSubmit}>
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
                  placeholder="+1 234 567 890"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              {error && <div className="form-error">{error}</div>}
              
              <div className="collection-reminder mt-20">
                <AlertTriangle size={18} className="text-cyan" />
                <p><strong>Collection Day:</strong> Your meals will be ready for pickup on your selected day(s) between 11 AM – 3 PM at N2 Kiosk (North Canteen).</p>
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

          {step === 'success' && (
            <div className="success-message flex-center flex-column">
              <CheckCircle2 size={64} className="text-cyan mb-20 animation-bounce" />
              <h3>Thank You, {formData.name.split(' ')[0]}!</h3>
              <p className="text-gray text-center mt-10">
                Your order for ${totalPrice} has been placed.<br />
                <strong>Collection:</strong> On your selected day(s), 11 AM – 3 PM.<br />
                We'll contact you shortly.
              </p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && step !== 'success' && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="text-gray">Total Amount</span>
              <span className="total-price">${totalPrice}</span>
            </div>
            {step === 'cart' ? (
              <Button 
                variant="primary" 
                className="btn-full" 
                onClick={() => setStep('payment')}
              >
                Checkout Now
              </Button>
            ) : step === 'payment' ? (
              <div className="checkout-actions">
                <Button 
                  variant="secondary" 
                  onClick={() => setStep('cart')}
                >
                  Back to Cart
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setStep('checkout')}
                >
                  Proceed: My Details
                </Button>
              </div>
            ) : (
              <div className="checkout-actions">
                <Button 
                  variant="secondary" 
                  onClick={() => setStep('payment')}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                  {!isSubmitting && <Send size={16} className="icon-ml" />}
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
