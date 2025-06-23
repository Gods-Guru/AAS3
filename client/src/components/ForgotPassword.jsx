// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import '../styles/AuthForm.scss'; // Reuse existing styles if appropriate
import API_BASE_URL from '../api/config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Add this line if you want a password field
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Password length check
    // if (password.length < 8) {
    //   setError('Password must be at least 8 characters.');
    //   setLoading(false);
    //   return;
    // }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to send reset email');

      setMessage('Password reset email sent successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        {/* Add password field for validation */}
        {/* <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        /> */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;