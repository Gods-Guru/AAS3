// src/pages/UserHome.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/OldUser.scss';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchFeaturedWebsiteReviews } from '../api/websiteReviews';

const UserHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [userStats, setUserStats] = useState({
    orders: 0,
    cartItems: 0,
    coupons: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredReviews, setFeaturedReviews] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.isFirstLogin) {
      navigate('/user/welcome');
    } else {
      fetchUserData();
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchFeaturedWebsiteReviews()
      .then(setFeaturedReviews)
      .catch(() => setFeaturedReviews([]));
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Simulate fetching user stats and trending products
      const [statsRes, productsRes] = await Promise.all([
        axios.get('/api/user/stats'),
        axios.get('/api/products/trending')
      ]);
      
      setUserStats({
        orders: statsRes.data.orders || 0,
        cartItems: statsRes.data.cartItems || 0,
        coupons: statsRes.data.coupons || 0
      });

      setTrendingProducts(productsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickLinks = [
    { icon: '🛠', title: 'Shop Accessories', path: '/catalogue' },
    { icon: '📦', title: 'Your Orders', path: '/user/orders' },
    { icon: '💖', title: 'Wishlist', path: '/wishlist' },
    { icon: '🔄', title: 'Return Requests', path: '/user/return-request' },
    { icon: '🔧', title: 'Installation Services', path: '/services' },
    { icon: '🏆', title: 'Rewards', path: '/user/rewards' }
  ];

  if (loading || !user || user.isFirstLogin) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="user-home">
      {/* Header */}
      <header className="user-home-header">
        <div className="logo" onClick={() => navigate('/')}>AutoHub</div>
        
        <form onSubmit={handleSearch} className="search-container">
          <input 
            type="text" 
            placeholder="Search accessories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="header-actions">
          <button 
            className="icon-btn" 
            onClick={() => navigate('/user/wishlist')}
            aria-label="Wishlist"
          >
            ❤<span className="badge">{userStats.wishlistItems || 0}</span>
          </button>
          <button 
            className="icon-btn" 
            onClick={() => navigate('/user/cart')}
            aria-label="Cart"
          >
            🛒<span className="badge">{userStats.cartItems || 0}</span>
          </button>
          <div className="profile-dropdown">
            <button className="profile-btn" aria-label="User menu">
              <img 
                src={user.photoUrl || '/default-avatar.jpg'} 
                alt={user.name} 
                className="profile-pic"
              />
            </button>
            <div className="dropdown-content">
              <span>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={() => navigate('/user/settings')}>Settings ⚙</button>
              <button onClick={() => navigate('/user/orders')}>My Orders</button>
              <button onClick={logout}>Log Out</button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome back, {user.name || 'Friend'}!</h2>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-value">{userStats.orders}</span>
              <span className="stat-label">Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.cartItems}</span>
              <span className="stat-label">Cart Items</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.coupons}</span>
              <span className="stat-label">Coupons</span>
            </div>
          </div>
        </div>
        <div className="welcome-image"></div>
      </section>

      {/* Quick Links Grid */}
      <section className="quick-links-section">
        <h3>Quick Access</h3>
        <div className="quick-links-grid">
          {quickLinks.map((link, index) => (
            <div 
              key={index} 
              className="quick-link-card"
              onClick={() => navigate(link.path)}
            >
              <span className="link-icon">{link.icon}</span>
              <span className="link-title">{link.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending-section">
        <div className="section-header">
          <h3>🔥 Trending for Your {user.vehicle?.model || 'Vehicle'}</h3>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/catalogue')}
          >
            View All →
          </button>
        </div>
        
        {trendingProducts.length > 0 ? (
          <div className="products-grid">
            {trendingProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No trending products found</p>
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="banner-content">
          <h4>🚗 Weekend Special: 20% Off All Interior Accessories!</h4>
          <p>Limited time offer until Sunday</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/catalogue?category=Interior')}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Support Section */}
      <section className="support-section">
        <div className="support-card">
          <h5>Need Help?</h5>
          <p>Our support team is available 24/7</p>
          <button 
            className="outline-button"
            onClick={() => navigate('/user/support')}
          >
            Contact Support
          </button>
        </div>
        <div className="support-card">
          <h5>Installation Services</h5>
          <p>Book professional installation for your purchases</p>
          <button 
            className="outline-button"
            onClick={() => navigate('/services')}
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="testimonial-slider">
            {featuredReviews.length > 0 ? featuredReviews.map((review, index) => (
              <div
                key={review._id}
                className={`testimonial-card`}
              >
                <div className="testimonial-content">
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round((review.experience + review.quality + review.price) / 3) ? "star-filled" : "star-empty"}>
                        {i < Math.round((review.experience + review.quality + review.price) / 3) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <p className="testimonial-text">{review.comment}</p>
                  <div className="testimonial-author">
                    {review.user?.profilePicture && (
                      <img src={review.user.profilePicture} alt={review.user.name || 'User'} className="testimonial-profile-pic" style={{width:32,height:32,borderRadius:'50%',objectFit:'cover',marginRight:8}} />
                    )}
                    <span>{review.user?.name || 'Anonymous'}</span>
                  </div>
                </div>
              </div>
            )) : <p>No featured reviews yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserHome;