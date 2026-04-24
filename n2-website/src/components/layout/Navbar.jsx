import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CONFIG } from '../../config';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${isMenuOpen ? 'nav-open' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/images/logo.png" alt="N2 Logo" className="logo-img" />
        </Link>
        
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>Menu</Link>
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''} onClick={closeMenu}>Welcome</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>About</Link>
          <Link to="/track" className={location.pathname === '/track' ? 'active' : ''} onClick={closeMenu}>Track</Link>
          
          <div className="mobile-actions">
            <button className="btn-login" onClick={closeMenu}>
              <User size={16} className="icon-mr" /> Login
            </button>
            <button 
              className={`btn-order ${CONFIG.ORDERS_PAUSED ? 'btn-disabled' : ''}`} 
              onClick={closeMenu}
              disabled={CONFIG.ORDERS_PAUSED}
            >
              <span className="sparkle">✦</span> {CONFIG.ORDERS_PAUSED ? 'Orders Paused' : 'Order Now'}
            </button>
          </div>
        </div>

        <div className="navbar-actions-desktop">
          <button className="btn-cart" onClick={() => setIsCartOpen(true)}>
            <div className="cart-icon-wrapper">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </button>

          <div className="desktop-only-actions">
            <button className="btn-login">
              <User size={16} className="icon-mr" /> Login
            </button>
            
            <button 
              className={`btn-order ${CONFIG.ORDERS_PAUSED ? 'btn-disabled' : ''}`}
              disabled={CONFIG.ORDERS_PAUSED}
            >
              <span className="sparkle">✦</span> {CONFIG.ORDERS_PAUSED ? 'Orders Paused' : 'Order Now'}
            </button>
          </div>

          <button className="mobile-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
