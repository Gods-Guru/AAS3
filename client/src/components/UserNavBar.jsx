import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaHeart, FaHome, FaBook, FaUser, FaTags, FaLuggageCart } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import '../styles/UserNavbar.scss';
import logo from '../assets/logo.png';

const getShortDisplayName = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
};

const UserNavBar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = getShortDisplayName(user?.name || user?.user?.name);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setNavOpen(false);
  };

  // Always render the navbar, but adjust links if not logged in
  const navLinks = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    { to: '/catalogue', label: 'Catalogue', icon: <FaBook /> },
    { to: '/wishlist', label: 'Wishlist', icon: <FaHeart /> },
    { to: '/user/favourites', label: 'Favourites', icon: <FaTags /> },
    { to: '/cart', label: 'Cart', icon: <FaShoppingCart />, badge: cartCount > 0 ? cartCount : null },
    { to: user ? '/my-orders' : '/login', label: 'Orders', icon: <FaLuggageCart /> },
  ];

  // Use profilePicture for user photo
  const profilePicUrl = user.profilePicture || user.profilePic || '';

  return (
    <header className={`header professional-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="main-header container">
        <div className="logos">
          <Link to="/" className="header-logo" onClick={() => setNavOpen(false)}>
            <img 
              src={logo} 
              alt="AutoLux Logo" 
              className="logo-img" 
              loading="lazy"
            />
            <span className="brand-name">AutoLux</span>
          </Link>
        </div>

        {/* Mobile navigation toggle */}
        <div className="nav-mobile-icons">
          <button
            className="hamburger"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
          >
            {navOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
          <Link 
            to="/profile" 
            className="mobile-profile-link"
            onClick={() => setNavOpen(false)}
          >
            {profilePicUrl ? (
              <img 
                src={profilePicUrl} 
                alt={`${displayName}'s profile`} 
                className="profile-pic mobile-profile-pic" 
                loading="lazy"
              />
            ) : (
              <div className="profile-pic profile-letter mobile-profile-pic">
                <FaUser size={16} />
              </div>
            )}
          </Link>
        </div>

        {/* Main navigation */}
        <nav className={`header-nav${navOpen ? ' show' : ''}`}>
          <ul className="nav-list">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`header-link${location.pathname === link.to ? ' active' : ''}`}
                  onClick={() => setNavOpen(false)}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                  {link.badge && (
                    <span className="cart-badge">{link.badge}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile logout button */}
          <div className="auth-btns hamburger-auth-btns">
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Desktop user info and logout */}
        <div className="buttons">
          <div className="user-info">
            {user ? (
              <Link className="user-info-small" to="/my-profile" onClick={() => setNavOpen(false)}>
                {profilePicUrl ? (
                  <img 
                    src={profilePicUrl} 
                    alt={`${displayName}'s profile`} 
                    className="profile-pic" 
                    loading="lazy"
                  />
                ) : (
                  <div className="profile-pic profile-letter">
                    {(displayName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hello-user desktop-only">
                  Hello - <strong> {displayName}</strong>
                </span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="header-link">Login</Link>
                <Link to="/register" className="header-link">Register</Link>
              </>
            )}
            {user && (
              <button 
                className="logout-btn desktop-only" 
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNavBar;