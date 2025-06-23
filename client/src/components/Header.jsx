import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaUserPlus, FaTimes, FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthForm from '../components/AuthForm';
import UserNavBar from './UserNavBar';
import '../styles/Header.scss';
import '../styles/AuthForm.scss';
import logo from '../assets/logo.png';

const getShortDisplayName = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts.length === 1 ? parts[0] : `${parts[0]} ${parts[1][0]}.`;
};

const Header = ({ homePath = "/", className = "" }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthSuccess = () => {
    setShowLogin(false);
    setShowSignup(false);
    navigate('/');
  };

  if (user) {
    return <UserNavBar user={user} logout={logout} />;
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/catalogue', label: 'Catalogue' },
    { to: '/about', label: 'About' },
    { to: '/faqs', label: 'FAQs' },
    { to: '/contact', label: 'Contact' },
    { to: '/cart', label: 'Cart', badge: cartCount > 0 ? cartCount : null },
  ];

  return (
    <header className={`header professional-header ${className} ${scrolled ? 'scrolled' : ''}`}>
      <div className="main-header container">
        <div className="logos">
          <Link to={homePath} className="header-logo">
            <img 
              src={logo} 
              alt="AutoLux Logo" 
              className="logo-img"
              loading="lazy"
            />
            <span className="brand-name">AutoLux</span>
          </Link>
        </div>

        <button
          className="hamburger"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
        >
          {navOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <nav className={`header-nav${navOpen ? ' show' : ''}`} aria-label="Main navigation">
          <ul className="nav-list">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`header-link${location.pathname === link.to ? ' active' : ''}`}
                  onClick={() => setNavOpen(false)}
                >
                  {link.label}
                  {link.badge && (
                    <span className="cart-badge">{link.badge}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="auth-btns hamburger-auth-btns">
            <button 
              className="login-btn" 
              onClick={() => { setShowLogin(true); setNavOpen(false); }}
              aria-label="Login"
            >
              <FaSignInAlt /> <span>Login</span>
            </button>
            <button 
              className="signup-btn" 
              onClick={() => { setShowSignup(true); setNavOpen(false); }}
              aria-label="Sign up"
            >
              <FaUserPlus /> <span>Sign Up</span>
            </button>
          </div>
        </nav>

        <div className="buttons">
          <div className="auth-btns desktop-auth-btns">
            <button 
              className="login-btn" 
              onClick={() => setShowLogin(true)}
              aria-label="Login"
            >
              <FaSignInAlt /> <span>Login</span>
            </button>
            <button 
              className="signup-btn" 
              onClick={() => setShowSignup(true)}
              aria-label="Sign up"
            >
              <FaUserPlus /> <span>Sign Up</span>
            </button>
          </div>
        </div>

        {/* Auth Modals */}
        {(showLogin || showSignup) && (
          <div className="auth-modal-overlay" onClick={() => {
            setShowLogin(false);
            setShowSignup(false);
          }}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
              <button 
                className="close-modal" 
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(false);
                }}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              <AuthForm 
                type={showLogin ? 'login' : 'signup'} 
                onSuccess={handleAuthSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;