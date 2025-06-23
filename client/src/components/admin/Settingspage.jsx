import React, { useState } from 'react';
import axios from 'axios';

const SettingsPage = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ old: '', new: '' });
  const [global, setGlobal] = useState({ tax: '', shipping: '', support: '', branding: '' });
  const [message, setMessage] = useState('');

  const handleProfileUpdate = async () => {
    // Implement API call
    setMessage('Profile updated!');
  };
  const handlePasswordChange = async () => {
    // Implement API call
    setMessage('Password changed!');
  };
  const handleGlobalUpdate = async () => {
    // Implement API call
    setMessage('Global settings updated!');
  };

  return (
    <div>
      <h2>Admin Settings</h2>
      {message && <div>{message}</div>}
      <form onSubmit={e => { e.preventDefault(); handleProfileUpdate(); }}>
        <input placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        <input placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
        <button type="submit">Update Profile</button>
      </form>
      <form onSubmit={e => { e.preventDefault(); handlePasswordChange(); }}>
        <input type="password" placeholder="Old Password" value={password.old} onChange={e => setPassword({ ...password, old: e.target.value })} />
        <input type="password" placeholder="New Password" value={password.new} onChange={e => setPassword({ ...password, new: e.target.value })} />
        <button type="submit">Change Password</button>
      </form>
      <form onSubmit={e => { e.preventDefault(); handleGlobalUpdate(); }}>
        <input placeholder="Platform Tax (%)" value={global.tax} onChange={e => setGlobal({ ...global, tax: e.target.value })} />
        <input placeholder="Shipping Fee" value={global.shipping} onChange={e => setGlobal({ ...global, shipping: e.target.value })} />
        <input placeholder="Support Contact" value={global.support} onChange={e => setGlobal({ ...global, support: e.target.value })} />
        <input placeholder="Branding" value={global.branding} onChange={e => setGlobal({ ...global, branding: e.target.value })} />
        <button type="submit">Update Global Settings</button>
      </form>
    </div>
  );
};

export default SettingsPage;