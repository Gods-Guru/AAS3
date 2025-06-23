import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import '../styles/VerifyOTP.scss';

const VerifyOtp = () => {
  const [formData, setFormData] = useState({ email: '', otp: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email
      }));
    } else {
      navigate('/signup');
    }
  }, [location, navigate]);

  // Redirect after login context is updated
  useEffect(() => {
    if (user && success) {
      navigate('/user/welcome');
    }
  }, [user, success, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'otp') {
      // Only allow numbers, max 6 digits, and add dash after every three
      let digits = value.replace(/\D/g, '').slice(0, 6);
      if (digits.length > 3) {
        digits = digits.slice(0, 3) + '-' + digits.slice(3);
      }
      setFormData(prev => ({
        ...prev,
        [name]: digits
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Remove dash before sending to backend
      const cleanFormData = {
        ...formData,
        otp: formData.otp.replace(/-/g, '')
      };
      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, cleanFormData);
      const { message, user, token } = res.data;

      setSuccess(message);

      // ✅ Log the user in
      await login(user, token);

      // Remove navigate here, let useEffect handle it
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      {error
        ? <p style={{ color: 'red' }}>{error}</p>
        : success && <p style={{ color: 'green' }}>{success}</p>
      }
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          disabled
        />
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={handleChange}
          maxLength={7}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading || !formData.otp}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;