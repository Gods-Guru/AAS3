import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Settings.scss';

const SettingsPage = () => {
  const [user, setUser] = useState({ username: '', email: '' });
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5002/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setForm({ username: res.data.username, email: res.data.email, password: '' });
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load user info.' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      // Update profile (username/email)
      await axios.put(
        'http://localhost:5002/api/users/update-profile',
        { username: form.username, email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Change password if provided
      if (form.password) {
        await axios.post(
          'http://localhost:5002/api/users/change-password',
          { password: form.password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setUser({ username: form.username, email: form.email });
      setForm({ ...form, password: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-bg">
        <div className="settings-card">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-bg">
      <form className="settings-card" onSubmit={handleSave}>
        <h2 className="settings-title">Account Settings</h2>
        {message.text && (
          <div className={`settings-message ${message.type}`}>{message.text}</div>
        )}
        <div className="settings-section">
          <label className="settings-label">Username</label>
          <input
            className="settings-input"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="settings-section">
          <label className="settings-label">Email</label>
          <input
            className="settings-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="settings-section">
          <label className="settings-label">Change Password</label>
          <input
            className="settings-input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New password"
            autoComplete="new-password"
          />
        </div>
        <button className="settings-btn" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
