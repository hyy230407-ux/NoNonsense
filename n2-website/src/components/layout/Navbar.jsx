import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
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
          <Link to="/grab-go" className={location.pathname === '/grab-go' ? 'active' : ''} onClick={closeMenu}>Grab & Go</Link>
          <Link to="/pre-order" className={location.pathname === '/pre-order' ? 'active' : ''} onClick={closeMenu}>Pre-order</Link>
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''} onClick={closeMenu}>Welcome</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>About</Link>
          <Link to="/track" className={location.pathname === '/track' ? 'active' : ''} onClick={closeMenu}>Track</Link>
          
          <div className="mobile-actions">
            <button className="btn-login" onClick={closeMenu}>
              <User size={16} className="icon-mr" /> Login
            </button>
            <button className="btn-order" onClick={closeMenu}>
              <span className="sparkle">✦</span> Order Now
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
            
            <button className="btn-order">
              <span className="sparkle">✦</span> Order Now
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
