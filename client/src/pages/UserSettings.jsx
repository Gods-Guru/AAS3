import React, { useState } from 'react';
import axios from 'axios';

const UserSettings = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [password, setPassword] = useState({ old: '', new: '' });
  const [message, setMessage] = useState('');

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated!');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/password', password, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Password changed!');
    } catch (err) {
      setMessage('Failed to change password.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/users/delete', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Account deleted!');
      // Optionally redirect or log out
    } catch (err) {
      setMessage('Failed to delete account.');
    }
  };

  return (
    <div className="user-settings-page">
      <h2>User Settings</h2>
      {message && <div>{message}</div>}
      <form onSubmit={e => { e.preventDefault(); handleProfileUpdate(); }}>
        <input placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        <input placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
        <input placeholder="Phone" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
        <input placeholder="Address" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
        <button type="submit">Update Profile</button>
      </form>
      <form onSubmit={e => { e.preventDefault(); handlePasswordChange(); }}>
        <input type="password" placeholder="Old Password" value={password.old} onChange={e => setPassword({ ...password, old: e.target.value })} />
        <input type="password" placeholder="New Password" value={password.new} onChange={e => setPassword({ ...password, new: e.target.value })} />
        <button type="submit">Change Password</button>
      </form>
      <button style={{ color: 'red' }} onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default UserSettings;
