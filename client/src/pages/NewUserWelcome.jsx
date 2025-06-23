import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserNavBar from '../components/UserNavBar';
import '../styles/NewUserWelcome.scss';

const NewUserWelcome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name?.split(' ')[0] || 'there';

  const handleGoToCatalogue = () => navigate('/catalogue');
  const handleGoToDashboard = () => navigate('/user/home');
  const handlePersonalize = () => navigate('/user/settings');

  // Prevent access if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Ensure logout redirects to /
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-welcome-page">
      <UserNavBar user={user} logout={handleLogout} />
      <div className="welcome-box">
        {/* Optional: Add a hero/illustration image here */}
        {/* Use /assets/... for public folder images */}
        {/* <img src="/assets/welcome-illustration.jpg" alt="Welcome" className="welcome-hero-img" /> */}
        <h1>Welcome to AutoMate, {name}! 🎉</h1>
        <p className="intro-text">
          You're all set to explore top-quality accessories and personalize your ride.
        </p>

        <ul className="feature-list">
          <li>🔍 Browse thousands of accessories tailored to your needs</li>
          <li>🛒 Add items to your cart and checkout securely</li>
          <li>❤ Save your favourite products and wishlist items</li>
        </ul>

        <div className="btn-group">
          <button onClick={handleGoToCatalogue} className="welcome-btn primary">
            Explore Catalogue
          </button>
          <button onClick={handlePersonalize} className="welcome-btn secondary">
            Personalize My Ride
          </button>
          <button onClick={handleGoToDashboard} className="welcome-btn outline">
            Go to Dashboard
          </button>
        </div>

        <p className="help-text">
          Need help? Visit our <a href="/faqs">FAQs</a> or <a href="/contact">contact support</a>.
        </p>
      </div>
    </div>
  );
};

export default NewUserWelcome;