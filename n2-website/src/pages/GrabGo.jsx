import React, { useEffect } from 'react';
import { MapPin, Clock, Info, CheckCircle2, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';
import './GrabGo.css';

const GrabGo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meals = [
    {
      id: 'mediterranean',
      title: 'Mediterranean',
      subtitle: 'FUEL BOX',
      image: '/images/mediterranean_chicken.png',
      color: '#60a5fa'
    },
    {
      id: 'mexican',
      title: 'Mexican Jalapeño',
      subtitle: 'FUEL BOX',
      image: '/images/mexican_chicken.png',
      color: 'var(--accent-orange)'
    }
  ];

  return (
    <div className="grabgo-page">

      <section className="grabgo-how container">
        <div className="how-card glass">
          <h2 className="section-title">How it Works</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">01</div>
              <h3>Visit North Canteen</h3>
              <p className="text-gray">Head over to the N2 Kiosk at NYP North Canteen during lunch hours.</p>
            </div>
            <div className="step-item">
              <div className="step-number">02</div>
              <h3>Pick Your Fuel</h3>
              <p className="text-gray">Select from our daily available Fuel Boxes. No customizations — just pure performance.</p>
            </div>
            <div className="step-item">
              <div className="step-number">03</div>
              <h3>Grab & Pay</h3>
              <p className="text-gray">Fast checkout via PayNow. Ask staff for your preferred sauce on the side.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grabgo-products container">
        <div className="products-grid">
          {meals.map((meal) => (
            <div key={meal.id} className="product-card">
              <div className="product-image-container">
                <img src={meal.image} alt={meal.title} className="product-image" />
              </div>
              <div className="product-info">
                <div className="product-label">{meal.subtitle}</div>
                <h2 className="product-name">{meal.title}</h2>
                <div className="product-details">
                  <div className="detail-item">
                    <CheckCircle2 size={16} className="text-cyan" />
                    <span>150g Grilled Chicken</span>
                  </div>
                  <div className="detail-item">
                    <CheckCircle2 size={16} className="text-cyan" />
                    <span>200g Fluffy Rice</span>
                  </div>
                  <div className="detail-item">
                    <CheckCircle2 size={16} className="text-cyan" />
                    <span>Fresh Veggies</span>
                  </div>
                </div>
                <div className="sauce-note">
                  <Info size={14} />
                  <span>Ask staff for sauce options</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grabgo-footer container">
        <div className="info-strip">
          <div className="info-block">
            <MapPin size={20} className="text-cyan" />
            <div>
              <div className="info-label">LOCATION</div>
              <div className="info-value">NYP North Canteen</div>
            </div>
          </div>
          <div className="info-block">
            <Clock size={20} className="text-cyan" />
            <div>
              <div className="info-label">AVALIABILITY</div>
              <div className="info-value">11:00 AM – 3:00 PM</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GrabGo;
