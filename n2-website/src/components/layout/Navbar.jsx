import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.png" alt="N2 Logo" className="logo-img" />
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Menu</Link>
          <Link to="/grab-go" className={location.pathname === '/grab-go' ? 'active' : ''}>Grab & Go</Link>
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Welcome</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          <Link to="/track" className={location.pathname === '/track' ? 'active' : ''}>Track</Link>
        </div>

        <div className="navbar-actions">
          <button className="btn-login">
            <User size={16} className="icon-mr" /> Login
          </button>
          
          <button className="btn-cart" onClick={() => setIsCartOpen(true)}>
            <div className="cart-icon-wrapper">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </button>

          <button className="btn-order">
            <span className="sparkle">✦</span> Order Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
