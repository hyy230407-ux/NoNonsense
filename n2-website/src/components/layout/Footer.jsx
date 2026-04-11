import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link to="/" className="footer-logo">
          <img src="/images/logo.png" alt="N2 Logo" className="logo-img-footer" />
        </Link>
        
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
