import { Clock, Flame, Leaf, Zap } from 'lucide-react';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <Clock size={16} className="text-cyan" />,
      title: '12+ Hour Marinade',
      desc: "Every piece of chicken is marinated for a minimum of 12 hours — often overnight. This isn't just for flavour. The acids and enzymes in the marinade break down the muscle fibres, making the meat more tender and allowing the spices to fully infuse into the chicken rather than just coating the surface."
    },
    {
      icon: <Flame size={16} className="text-orange" />,
      title: 'High-Heat Grilling',
      desc: 'We grill on high heat to create the Maillard reaction — the chemical process that gives grilled meat its deep, complex, slightly charred flavour. This seals the outside quickly while keeping the inside moist. No boiling, no steaming. Real grill marks, real flavour.'
    },
    {
      icon: <Leaf size={16} style={{ color: '#4ade80' }} />,
      title: 'Clean Ingredients Only',
      desc: 'No industrial seed oils. No MSG. No artificial flavours, colours or preservatives. Every marinade is built from whole ingredients — yoghurt, citrus, herbs, spices, pastes. What you taste is exactly what went in.'
    },
    {
      icon: <Zap size={16} style={{ color: '#818cf8' }} />,
      title: 'Macro-First Build',
      desc: 'Every N2 meal is engineered around protein first. 150g of grilled chicken delivers 38-42g of protein per meal. Paired with 200g of jasmine rice for sustainable carbs and a vegetable mix of cabbage, spinach and carrot for fibre and micronutrients.'
    }
  ];

  return (
    <div className="about-page container">
      <header className="about-header text-center">
        <div className="about-badge text-cyan">ABOUT N2</div>
        <h1 className="about-title">How We Cook.</h1>
        <p className="about-subtitle text-gray">
          No shortcuts. No fillers. N2 is built on real food principles — global flavours, clean ingredients and a method that actually makes a difference to how the food tastes and how it fuels you.
        </p>
      </header>
      
      <div className="features-grid">
        {features.map((feat, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon-wrapper">
              {feat.icon}
            </div>
            <h3 className="feature-title">{feat.title}</h3>
            <p className="feature-desc text-gray">{feat.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="about-footer text-center text-gray">
        <p className="about-note">TAP TO SEE EACH FLAVOUR'S FULL INGREDIENTS</p>
      </div>
    </div>
  );
};

export default About;
