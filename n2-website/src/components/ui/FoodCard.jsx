import React from 'react';
import Button from './Button';
import { useCart } from '../../context/CartContext';
import './FoodCard.css';

const FoodCard = ({ 
  id,
  image, 
  title, 
  badge,
  location,
  price,
  features = [],
  subtitle,
  description,
  footerIcon = '🔥',
  footerText,
  buttonText,
  isSnack = false,
  isDisabled = false
}) => {
  const { openCustomizationModal } = useCart();

  const handleOrder = () => {
    if (isDisabled) return;
    console.log('Opening customization modal for:', title);
    openCustomizationModal({ id, title, price, image, badge, isSnack });
  };

  return (
    <div className="food-card">
      <div className="food-card-image">
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className="food-card-placeholder flex-center text-gray">
            <span>Image</span>
          </div>
        )}
      </div>
      
      <div className="food-card-content">
        <div className="food-card-header">
          <div className="food-card-meta">
            {badge && <span className="tag tag-highlight">{badge}</span>}
            {location && <span className="tag location-tag">{location}</span>}
          </div>
          <div className="food-card-price">{price}</div>
        </div>

        {features.length > 0 && (
          <div className="food-card-features">
            {features.map((feat, idx) => (
              <span key={idx} className="feature-tag">{feat}</span>
            ))}
          </div>
        )}
        
        <h3 className="food-card-title">{title}</h3>
        {subtitle && <p className="food-card-subtitle text-gray">{subtitle}</p>}
        
        <p className="food-card-desc">{description}</p>
        
        {footerText && (
          <div className="food-card-warning">
            <span className="warning-emoji">{footerIcon}</span>
            <span>{footerText}</span>
          </div>
        )}
        
        <div style={{ marginTop: 'auto' }}>
          <Button 
            variant={isDisabled ? 'secondary' : (isSnack ? 'secondary' : 'primary')} 
            className={`food-card-btn btn-full ${isDisabled ? 'btn-disabled' : ''}`}
            onClick={handleOrder}
            disabled={isDisabled}
          >
            <span>{isDisabled ? 'Coming Soon' : buttonText}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;


