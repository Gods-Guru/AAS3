import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.scss';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const AuthForm = ({ type, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = type === 'signup' || type === 'register';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignup) {
      if (formData.password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      try {
        await axios.post(`${API_BASE_URL}/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        // ✅ Navigate to OTP verification
        navigate('/verify-otp', { state: { email: formData.email } });
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }

      return;
    }

    // Login flow
    if (type === 'login') {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to process request.');
        }

        login(data.user, data.token); // Store in context

        const lastPage = localStorage.getItem('lastPage');
        if (data.user?.isFirstLogin) {
          navigate('/user/welcome');
        } else if (
          lastPage &&
          !['/login', '/signup', '/reset-password', '/'].includes(lastPage)
        ) {
          navigate(lastPage);
        } else {
          navigate('/user/home');
        }

        if (onClose) onClose();
      } catch (err) {
        setError(err.message);
        console.error('AuthForm submission error:', err);
      } finally {
        setLoading(false);
      }
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
            <a href="/forgot-password" className="fp">
              Forgot your password?
            </a>
          </div>
          <div className="signup-link">
            <span>Don't have an account?{' '}
              <button
                type="button"
                className="open-signup-btn"
                onClick={() => {
                  navigate('/signup');
                  if (onClose) onClose();
                }}
              >
                Sign Up
              </button>
            </span>
          </div>
        </div>
      )}

      {isSignup && (
        <div className="auth-links">
          <div className="login-link">
            <span>Already have an account?{' '}
              <button
                type="button"
                className="open-login-btn"
                onClick={() => {
                  navigate('/login');
                  if (onClose) onClose();
                }}
              >
                Login
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;