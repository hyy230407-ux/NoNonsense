import { ArrowRight, MapPin, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';
import './Home.css';

const Home = () => {
  const benefits = [
    'All grilled chicken',
    'Marinated minimum 12h',
    'Grilled fresh daily',
    'Real flavours',
    'In-house sauces',
    'No additional preservatives',
    'No industrial seed oils',
    'Guilt-free meal prep',
    'Delicious and clean',
    'Never fried — only grilled',
    'Extra virgin olive oil',
    'Real ingredients'
  ];

  return (
    <div className="home-page">
      <section className="hero-section container">
        <div className="hero-content">
          <div className="hero-badges">
            <img src="/images/logo.png" alt="N2 Logo" className="hero-logo-img" />
          </div>
          
          <h1 className="hero-headline">
            REAL<br/>
            FLAVOUR.<br/>
            REAL FUEL.
          </h1>
          
          <p className="hero-description text-gray">
            All grilled chicken. Deep global flavours. In-house sauces. Real ingredients, no industrial seed oils, no shortcuts — ever.
          </p>
          
          <div className="hero-actions">
            <Link to="/menu">
              <Button variant="primary" glow>
                View Menu <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary">
                Our Flavours
              </Button>
            </Link>
          </div>
          
          <div className="hero-scroll text-gray">
            <div className="scroll-line"></div>
            <span>SCROLL</span>
          </div>
        </div>

        <div className="hero-benefits">
          {benefits.map((benefit, idx) => (
            <Pill key={idx} text={benefit} dotColor="#00f1d9" />
          ))}
        </div>
        
        <div className="hero-info-cards">
          <div className="info-card">
            <MapPin size={16} className="text-cyan info-icon" />
            <div>
              <div className="info-label text-gray">LOCATION</div>
              <div className="info-value">NYP North Canteen – N2 Kiosk</div>
            </div>
          </div>
          
          <div className="info-card">
            <Clock size={16} className="text-cyan info-icon" />
            <div>
              <div className="info-label text-gray">COLLECTION</div>
              <div className="info-value">11:00 AM – 3:00 PM · Next-day</div>
            </div>
          </div>
        </div>
      </section>

      <section className="more-menu-section container flex-center">
         <Link to="/menu">
           <Button variant="secondary" className="view-full-menu-btn">See Full Menu & Order</Button>
         </Link>
      </section>
    </div>
  );
};

export default Home;
