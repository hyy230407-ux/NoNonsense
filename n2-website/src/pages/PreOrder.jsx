import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './PreOrder.css';

const PreOrder = () => {
  const calendarData = [
    { day: 'Mon', date: 13, status: 'closed' },
    { day: 'Tue', date: 14, status: 'closed' },
    { day: 'Wed', date: 15, status: 'open' },
    { day: 'Thu', date: 16, status: 'open' },
    { day: 'Fri', date: 17, status: 'open' },
    { day: 'Sat', date: 18, status: 'closed' },
    { day: 'Sun', date: 19, status: 'closed' }
  ];

  return (
    <div className="preorder-page animate-fadeIn">
      <div className="preorder-hero">
        <div className="container">
          <span className="hero-badge">Next Week Schedule</span>
          <h1>Lunch Pre-orders</h1>
          <p className="hero-subtitle">Plan your high-protein fuel for next week.</p>
        </div>
      </div>

      <div className="preorder-container">
        <div className="preorder-card">
          <div className="card-header">
            <Calendar size={24} className="text-cyan" />
            <h2>Collection Calendar</h2>
          </div>
          
          <div className="calendar-grid">
            {calendarData.map((item, idx) => (
              <div key={idx} className={`calendar-day ${item.status}`}>
                <span className="day-name">{item.day}</span>
                <span className="day-date">{item.date}</span>
                <span className="day-status">{item.status === 'open' ? 'OPEN' : 'CLOSED'}</span>
              </div>
            ))}
          </div>

          <div className="calendar-info">
            <p className="info-main">
              Next week, we are open for pre-orders on <strong>Wednesday (15th)</strong>, 
              <strong>Thursday (16th)</strong>, and <strong>Friday (17th)</strong> only.
            </p>
            <div className="info-details">
              <div className="detail-item">
                <Clock size={18} className="text-cyan" />
                <span>Collection: 11:00 AM – 3:00 PM</span>
              </div>
              <div className="detail-item">
                <MapPin size={18} className="text-cyan" />
                <span>Location: N2 Kiosk, NYP North Canteen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="preorder-guide">
          <h3>How to Pre-order</h3>
          <div className="guide-steps">
            <div className="step">
              <span className="step-num">01</span>
              <h4>Select Your Meals</h4>
              <p>Browse our menu and customize your fuel boxes.</p>
            </div>
            <div className="step">
              <span className="step-num">02</span>
              <h4>Secure Your Order</h4>
              <p>Place your order today to secure your meal for tomorrow.</p>
            </div>
            <div className="step">
              <span className="step-num">03</span>
              <h4>Fast Collection</h4>
              <p>Skip the queue and collect during lunch hours.</p>
            </div>
          </div>
          
          <div className="guide-action">
            <Link to="/menu">
              <Button variant="primary" className="btn-full">
                Go to Menu <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrder;
