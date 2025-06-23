import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1 className="home-title">Welcome to Our Service</h1>
      <button
        className="settings-btn"
        onClick={() => navigate('/settings')}
      >
        Settings
      </button>
      {/* ...existing code... */}
    </div>
  );
};

export default Home;