import FoodCard from '../components/ui/FoodCard';
import { CONFIG } from '../config';
import './Menu.css';

const Menu = () => {
  const meals = [
    {
      id: 'm1',
      title: 'Butter Chicken',
      badge: '⭐ Best Seller',
      location: 'North India',
      price: '$6.50',
      features: ['Creamy', 'Bold', 'Aromatic'],
      subtitle: 'Inspired by the spice houses of Old Delhi.',
      description: 'Rich, velvety and deeply aromatic. Slow-cooked spices layered with a bold in-house butter chicken sauce — made with cashew nut paste and premium cottage cheese. Comforting, indulgent and clean.',
      footerIcon: '🍛',
      footerText: 'In-house butter chicken sauce — cashew nut paste, premium cottage cheese, real spices. Thick, rich and made from scratch.',
      buttonText: 'Order Meal — $6.50',
      image: '/images/butter_chicken.png'
    },
    {
      id: 'm3',
      title: 'Nashville Hot Honey',
      location: 'Southern USA',
      price: '$6.50',
      features: ['Sweet', 'Spicy', 'Addictive'],
      subtitle: 'A southern American classic.',
      description: 'Sweet honey glaze meets bold chilli heat. Sticky, smoky and dangerously addictive — a perfect contrast of sweet and fire.',
      footerIcon: '🔥',
      footerText: 'Grilled fresh daily · extra virgin olive oil · real ingredients',
      buttonText: 'Order Meal — $6.50',
      image: '/images/nashville_chicken.png'
    },
    {
      id: 'm5',
      title: 'Jamaican Jerk',
      badge: '🔥 New',
      location: 'Kingston, Jamaica',
      price: '$6.50',
      features: ['Smoky', 'Fiery', 'Caribbean'],
      subtitle: 'Inspired by the bold jerk pits of Kingston.',
      description: 'Fiery scotch bonnet heat with allspice, thyme and a smoky char. Punchy, deeply Caribbean and unapologetically bold.',
      footerIcon: '🔥',
      footerText: 'Grilled fresh daily · extra virgin olive oil · real ingredients',
      buttonText: 'Order Meal — $6.50',
      image: '/images/jerk_chicken.png'
    }
  ];

  return (
    <div className="menu-page">
      <div className="container pt-60">
        {CONFIG.ORDERS_PAUSED && (
          <div className="orders-paused-banner">
            <div className="banner-content">
              <span className="banner-icon">🔔</span>
              <p>{CONFIG.PAUSE_MESSAGE}</p>
            </div>
          </div>
        )}

        <section className="menu-section">
          <div className="section-header">
            <span className="section-badge text-cyan bg-cyan-alpha">From $6.50</span>
            <h2>High Protein Meals</h2>
          </div>

          <div className="menu-grid">
            {meals.filter(meal => !meal.isSoldOut).map(meal => (
              <FoodCard key={meal.id} {...meal} isDisabled={CONFIG.ORDERS_PAUSED} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Menu;
