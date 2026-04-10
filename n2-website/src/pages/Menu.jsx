import FoodCard from '../components/ui/FoodCard';
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
      id: 'm2',
      title: 'Mediterranean Herbs & Spices',
      location: 'Mediterranean Coast',
      price: '$6.50',
      features: ['Fresh', 'Fragrant', 'Balanced'],
      subtitle: 'Inspired by the coastal kitchens of the Mediterranean.',
      description: 'Garlic, oregano, lemon zest and warm herbs create a clean, bright and deeply savoury profile. Fresh, fragrant and incredibly balanced.',
      footerIcon: '🔥',
      footerText: 'Grilled fresh daily · extra virgin olive oil · real ingredients',
      buttonText: 'Order Meal — $6.50',
      image: '/images/mediterranean_chicken.png'
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
      id: 'm4',
      title: 'Mexican Jalapeño',
      location: 'Mexico',
      price: '$6.50',
      features: ['Smoky', 'Zesty', 'Bold'],
      subtitle: 'Bright heat, bold smokiness, real Mexican soul.',
      description: 'Jalapeño, chipotle and lime-forward marinade with a punchy, vibrant bite. Smoky, zesty and full of character.',
      footerIcon: '🔥',
      footerText: 'Grilled fresh daily · extra virgin olive oil · real ingredients',
      buttonText: 'Order Meal — $6.50',
      image: '/images/mexican_chicken.png'
    },
    {
      id: 'm5',
      title: 'Jerk Chicken',
      badge: '👑 Premium',
      location: 'Kingston, Jamaica',
      price: '$7.00',
      features: ['Smoky', 'Fiery', 'Caribbean'],
      subtitle: 'Inspired by the bold jerk pits of Kingston.',
      description: 'Fiery scotch bonnet heat with allspice, thyme and a smoky char. Punchy, deeply Caribbean and unapologetically bold.',
      footerIcon: '🔥',
      footerText: 'Grilled fresh daily · extra virgin olive oil · real ingredients',
      buttonText: 'Order Meal — $7.00',
      image: '/images/jerk_chicken.png'
    }
  ];

  const snacks = [
    {
      id: 's1',
      title: 'Butter Chicken',
      badge: '⭐ Best Seller',
      location: 'North India',
      price: '$3.30',
      features: ['Creamy', 'Bold', 'Aromatic'],
      subtitle: 'Inspired by the spice houses of Old Delhi.',
      description: 'Rich, velvety and deeply aromatic. Slow-cooked spices layered with a bold in-house butter chicken sauce — made with cashew nut paste and premium cottage cheese. Comforting, indulgent and clean.',
      footerIcon: '🍛',
      footerText: 'In-house butter chicken sauce — cashew nut paste, premium cottage cheese, real spices. Thick, rich and made from scratch.',
      buttonText: 'Order Snack — $3.30',
      isSnack: true,
      image: '/images/butter_chicken.png'
    },
    {
      id: 's2',
      title: 'Mediterranean Herbs & Spices',
      location: 'Mediterranean Coast',
      price: '$3.30',
      features: ['Fresh', 'Fragrant', 'Balanced'],
      subtitle: 'Inspired by the coastal kitchens of the Mediterranean.',
      description: 'Garlic, oregano, lemon zest and warm herbs create a clean, bright and deeply savoury profile. Fresh, fragrant and incredibly balanced.',
      buttonText: 'Order Snack — $3.30',
      isSnack: true,
      image: '/images/mediterranean_chicken.png'
    },
    {
      id: 's3',
      title: 'Nashville Hot Honey',
      location: 'Southern USA',
      price: '$3.30',
      features: ['Sweet', 'Spicy', 'Addictive'],
      subtitle: 'A southern American classic.',
      description: 'Sweet honey glaze meets bold chilli heat. Sticky, smoky and dangerously addictive — a perfect contrast of sweet and fire.',
      buttonText: 'Order Snack — $3.30',
      isSnack: true,
      image: '/images/nashville_chicken.png'
    },
    {
      id: 's4',
      title: 'Mexican Jalapeño',
      location: 'Mexico',
      price: '$3.30',
      features: ['Smoky', 'Zesty', 'Bold'],
      subtitle: 'Bright heat, bold smokiness, real Mexican soul.',
      description: 'Jalapeño, chipotle and lime-forward marinade with a punchy, vibrant bite. Smoky, zesty and full of character.',
      buttonText: 'Order Snack — $3.30',
      isSnack: true,
      image: '/images/mexican_chicken.png'
    },
    {
      id: 's5',
      title: 'Jerk Chicken',
      badge: '👑 Premium',
      location: 'Kingston, Jamaica',
      price: '$3.30',
      features: ['Smoky', 'Fiery', 'Caribbean'],
      subtitle: 'Inspired by the bold jerk pits of Kingston.',
      description: 'Fiery scotch bonnet heat with allspice, thyme and a smoky char. Punchy, deeply Caribbean and unapologetically bold.',
      buttonText: 'Order Snack — $3.30',
      isSnack: true,
      image: '/images/jerk_chicken.png'
    }
  ];

  return (
    <div className="menu-page">
      <div className="container pt-60">
        <section className="menu-section">
          <div className="section-header">
            <span className="section-badge text-cyan bg-cyan-alpha">From $6.50</span>
            <h2>High Protein Meals</h2>
          </div>

          <div className="menu-grid">
            {meals.map(meal => (
              <FoodCard key={meal.id} {...meal} />
            ))}
          </div>
        </section>

        <section className="menu-section mt-80">
          <div className="section-header">
            <span className="section-badge text-cyan bg-cyan-alpha">From $3.30</span>
            <h2>Protein Snacks</h2>
            <p className="section-desc text-gray">
              100g grilled chicken. Pure performance fuel. No rice, no fillers — just clean grilled protein. Perfect post-gym, between classes or any time you need real fuel fast.
            </p>
            
            <div className="section-features">
              <span className="highlight-box">100g grilled chicken</span>
              <span className="highlight-box">Post-gym</span>
              <span className="highlight-box">Mid-day boost</span>
              <span className="highlight-box">In-house ranch base</span>
            </div>
            
            <div className="section-warning text-gray">
              🔥 Never fried — only grilled. Extra virgin olive oil.<br />
              No industrial seed oils · no artificial preservatives · real ingredients only.
            </div>
          </div>

          <div className="menu-grid">
            {snacks.map(snack => (
              <FoodCard key={snack.id} {...snack} isDisabled={true} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Menu;
