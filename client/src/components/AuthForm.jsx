import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.scss';

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const [showSignup, setShowSignup] = useState(false); // New state to control signup modal

  const isSignup = type === 'signup';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmPasswordChange = (e) => { // New handler
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading

    // --- Signup Specific Validations ---
    if (isSignup) {
      if (formData.password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false); // Stop loading on validation error
        return;
      }
      // You might add more frontend validations here for name, email format etc.
    }
    // --- End Signup Specific Validations ---

    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      
      // Conditionally send 'name' only for signup
      const bodyToSend = isSignup
        ? JSON.stringify({ email: formData.email, password: formData.password, name: formData.name })
        : JSON.stringify({ email: formData.email, password: formData.password });

      const res = await fetch(`http://localhost:5000${endpoint}`, { // Replace with process.env.REACT_APP_BACKEND_URL in production
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        // Assuming backend sends { message: "Error details" }
        throw new Error(data.message || 'Failed to process request.');
      }

      // Backend should ideally return a user object or token upon successful signup/login
      // The `login` function from AuthContext will store this `data`
      login(data);
      navigate('/home');
    } catch (err) {
      setError(err.message);
      console.error("AuthForm submission error:", err);
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form-name">{isSignup ? 'Create Account' : 'Log In'}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="name-field"
            required
            disabled={loading}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="email-field"
          required
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="password-field"
          required
          disabled={loading}
        />
        {isSignup && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="cpassword-field"
            required
            disabled={loading}
          />
        )}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (isSignup ? 'Registering...' : 'Logging In...') : (isSignup ? 'Sign Up' : 'Login')}
        </button>
      </form>
      {!isSignup && (
        <div className="auth-links">
          <div className="forgot-password">
            <a href="/forgotPassword" className="fp">
              Forgot your password?
            </a>
          </div>
          <div className="signup-link">
            <span>Don't have an account?{' '}
              <button type="button" className="open-signup-btn" onClick={() => setShowSignup(true)}>
                Sign Up
              </button>
            </span>
          </div>
        </div>
      )}
      {showSignup && (
        <div className="signup-modal-overlay" onClick={() => setShowSignup(false)}>
          <div className="signup-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowSignup(false)}>&times;</button>
            <AuthForm type="signup" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;