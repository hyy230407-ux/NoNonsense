import './Pill.css';

const Pill = ({ text, dotColor = '#00f1d9', icon: Icon }) => {
  return (
    <div className="pill">
      {Icon ? (
        <Icon size={14} className="pill-icon" style={{ color: dotColor }} />
      ) : (
        <span className="pill-dot" style={{ backgroundColor: dotColor }}></span>
      )}
      <span className="pill-text">{text}</span>
    </div>
  );
};

export default Pill;
