import React, { useState } from 'react';
import { Flame, Plus, X } from 'lucide-react';
import './Track.css';

const Track = () => {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [loggedMeals, setLoggedMeals] = useState([]);

  const pastOrders = [
    { 
      id: 1,
      title: 'Butter Chicken', 
      extras: '200g (Maintaining)', 
      cals: 580, protein: 42, carbs: 62, fat: 10 
    },
    { 
      id: 2,
      title: 'Nashville Hot Chicken', 
      extras: '250g (Bulking)', 
      cals: 580, protein: 42, carbs: 62, fat: 10 
    },
    { 
      id: 3,
      title: 'Mediterranean Herbs', 
      extras: '150g (Cutting)', 
      cals: 580, protein: 42, carbs: 62, fat: 10 
    },
    { 
      id: 4,
      title: 'Jerk Chicken Snack', 
      extras: 'Standard', 
      cals: 165, protein: 28, carbs: 1, fat: 4 
    },
    { 
      id: 5,
      title: 'Beef & Broccoli', 
      extras: '200g (Maintaining)', 
      cals: 580, protein: 42, carbs: 62, fat: 10 
    }
  ];

  const handleLogMeal = (meal) => {
    const newLog = {
      ...meal,
      logId: Date.now()
    };
    setLoggedMeals([newLog, ...loggedMeals]);
  };

  const handleRemoveMeal = (logId) => {
    setLoggedMeals(loggedMeals.filter(m => m.logId !== logId));
  };

  const totals = loggedMeals.reduce((acc, meal) => ({
    cals: acc.cals + meal.cals,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { cals: 0, protein: 0, carbs: 0, fat: 0 });

  const calsLeft = Math.max(0, dailyGoal - totals.cals);
  const progressPercent = Math.min(100, (totals.cals / dailyGoal) * 100);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="track-page container">
      <header className="track-header text-center">
        <div className="track-badge text-cyan">CALORIE TRACKER</div>
        <h1 className="track-title">Track Your Fuel</h1>
        <p className="track-subtitle text-gray">
          Set your daily calorie goal and log N2 meals directly from your order history.
        </p>
      </header>

      <div className="track-content">
        <section className="tracker-dashboard">
          <div className="dashboard-header">
            <div className="dashboard-title-flex">
              <div className="circle-icon"><Flame size={12} className="text-cyan" /></div>
              <div>
                <h3 className="dashboard-title">Daily Goal</h3>
                <p className="dashboard-desc text-gray">{dailyGoal} kcal target</p>
              </div>
            </div>
            <button className="btn-edit-goal text-cyan">EDIT GOAL</button>
          </div>

          <div className="dashboard-stats">
            <div className="pie-chart-container">
              <div className="pie-chart" style={{ '--progress': `${progressPercent}%` }}>
                <div className="pie-inner">
                  <div className="pie-value">{totals.cals}</div>
                  <div className="pie-label">KCAL EATEN</div>
                  <div className="pie-left text-cyan">{calsLeft} left</div>
                </div>
              </div>
            </div>

            <div className="macros-list">
              <div className="macro-item">
                <span className="macro-label text-gray">Protein</span>
                <span className="macro-value">{totals.protein}g / 130g</span>
              </div>
              <div className="macro-item border-tb">
                <span className="macro-label text-gray">Carbs</span>
                <span className="macro-value">{totals.carbs}g / 220g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label text-gray">Fat</span>
                <span className="macro-value">{totals.fat}g / 70g</span>
              </div>
            </div>
          </div>
        </section>

        <section className="todays-log">
          <h3 className="section-title">Today's Log</h3>
          <p className="section-subtitle text-gray">{today}</p>
          
          {loggedMeals.length === 0 ? (
            <div className="empty-log flex-center">
              <Flame size={24} className="text-gray empty-icon" />
              <p className="text-gray">No meals logged today yet.</p>
              <p className="text-gray">Add from your order history below.</p>
            </div>
          ) : (
            <div className="log-list">
              {loggedMeals.map((meal) => (
                <div key={meal.logId} className="log-item">
                  <div className="log-item-info">
                    <span className="log-item-title">{meal.title}</span>
                    <span className="log-item-macros text-gray">
                      {meal.cals} kcal · {meal.protein}g P
                    </span>
                  </div>
                  <button 
                    className="btn-remove" 
                    onClick={() => handleRemoveMeal(meal.logId)}
                    title="Remove from log"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="order-history">
          <div className="history-header">
            <h3 className="section-title">Add From Your Orders</h3>
            <p className="section-subtitle text-gray">Log any of your past N2 orders to today's tracker</p>
          </div>

          <div className="history-list">
            {pastOrders.map((order) => (
              <div key={order.id} className="history-item">
                <div className="history-item-details">
                  <div className="history-item-title">
                    {order.title} <span className="text-gray">({order.extras})</span>
                  </div>
                  <div className="history-item-macros">
                    <span className="text-cyan">{order.cals} kcal</span>
                    <span className="text-cyan mx-2">·</span>
                    <span className="text-gray">{order.protein}g P</span>
                    <span className="text-gray mx-2">·</span>
                    <span className="text-gray">{order.carbs}g C</span>
                    <span className="text-gray mx-2">·</span>
                    <span className="text-gray">{order.fat}g F</span>
                  </div>
                </div>
                <button className="btn-add" onClick={() => handleLogMeal(order)}>
                  <Plus size={12} /> Add
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Track;

