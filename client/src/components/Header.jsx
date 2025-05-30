import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';
import AuthForm from '../components/AuthForm';
import '../styles/AuthForm.scss';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="header">
      <div className="main-header">
        <div className="logos">
          <Link to="/" className="header-logo">
            <p className="logo"></p>
            <p className="logo-p">AutoLux</p>
          </Link>
        </div>
        {/* <nav className="header-nav">
          <Link to="/" className="header-link">Home</Link>
          <Link to="/products" className="header-link">Products</Link>
          <Link to="/cart" className="header-link">Cart</Link>
          <Link to="/account" className="header-link">Account</Link>
        </nav> */}
        <nav className="header-nav">
          <Link to="/explore" className="header-link">View Products</Link>
        </nav>
        <div className="buttons">
          <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
          <button className="signup-btn" onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>
        {/* Floating Login Modal */}
        {showLogin && (
          <div className="auth-modal-overlay" onClick={() => setShowLogin(false)}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowLogin(false)}>&times;</button>
              <AuthForm type="login" />
            </div>
          </div>
        )}
        {/* Floating Signup Modal */}
        {showSignup && (
          <div className="auth-modal-overlay" onClick={() => setShowSignup(false)}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowSignup(false)}>&times;</button>
              <AuthForm type="signup" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;