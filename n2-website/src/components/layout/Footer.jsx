import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-icon footer-logo">N2</div>
        <div className="footer-title text-cyan">HIGH PROTEIN GLOBAL FLAVOURS</div>
        <div className="footer-subtitle text-gray">Real Food. Real Flavour. Real Fuel.</div>
        
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/about">About</Link>
          <Link to="/track">Track</Link>
        </div>
        
        <div className="footer-copyright text-gray">
          © 2026 N2. Nanyang Polytechnic.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
