import React, { useEffect, useState } from 'react';
import { getUserProfile, deleteUserAccount, updateUserProfile } from '../services/profileService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/profile.scss';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user: authUser, login } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUserAccount(user._id);
        localStorage.removeItem('token');
        navigate('/signup');
      } catch {
        alert('Failed to delete account.');
      }
    }
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleSave = async (data) => {
    setSaving(true);
    try {
      const updated = await updateUserProfile(data);
      const updatedUser = updated.user || updated;
      setUser(updatedUser);
      // Update AuthContext and localStorage so navbar updates
      login(updatedUser, localStorage.getItem('token'));
      setEditing(false);
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user, profilePicture: res.data.imageUrl });
    } catch (err) {
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="profile-main">Loading...</div>;
  if (error) return <div className="profile-main">{error}</div>;
  if (!user) return null;

  return (
    <div className="profile-layout">
      <main className="profile-main">
        {editing ? (
          <form className="edit-profile-form" onSubmit={e => { e.preventDefault(); handleSave({ name: user.name, email: user.email, bio: user.bio, profilePicture: user.profilePicture }); }}>
            <label>Name<input name="name" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} required /></label>
            <label>Email<input name="email" type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} required /></label>
            <label>Bio<textarea name="bio" value={user.bio || ''} onChange={e => setUser({ ...user, bio: e.target.value })} /></label>
            <label>Profile Picture (URL)<input name="profilePicture" value={user.profilePicture || ''} onChange={e => setUser({ ...user, profilePicture: e.target.value })} placeholder="Image URL" /></label>
            <label>Or Upload Photo
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
              {uploading && <span>Uploading...</span>}
            </label>
            {user.profilePicture && <img src={user.profilePicture} alt="Preview" className="profile-card-avatar" style={{ maxWidth: 80, borderRadius: '50%', margin: '0.5rem 0' }} />}
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <section className="profile-card">
            <img src={user.profilePicture || '/default-profile.png'} alt="Profile" className="profile-card-avatar" />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{user.bio}</p>
            <button className="btn-primary" onClick={handleEdit}>Edit Profile</button>
            <button className="btn-danger" onClick={handleDelete}>Delete Account</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
