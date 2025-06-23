import React, { useEffect, useState } from 'react';
import { getAdminProfile, updateAdminProfile } from '../../services/profileService';
import '../../styles/profile.scss';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', bio: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const adminId = localStorage.getItem('adminId');
        const data = await getAdminProfile(adminId);
        setAdmin(data);
        setForm({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          profilePicture: data.profilePicture || ''
        });
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateAdminProfile(admin._id, form);
      setAdmin(updated.user || updated);
      setEditing(false);
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-main">Loading...</div>;
  if (!admin) return <div className="profile-main">Failed to load profile.</div>;

  return (
    <div className="profile-layout">
      <aside className="profile-sidebar">Admin</aside>
      <main className="profile-main">
        {editing ? (
          <form className="edit-profile-form" onSubmit={handleSave}>
            <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
            <label>Bio<textarea name="bio" value={form.bio} onChange={handleChange} /></label>
            <label>Profile Picture<input name="profilePicture" value={form.profilePicture} onChange={handleChange} placeholder="Image URL" /></label>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <section className="profile-card">
            <img src={admin.profilePicture || '/default-profile.png'} alt="Profile" className="profile-card-avatar" />
            <h2>{admin.name}</h2>
            <p>{admin.email}</p>
            <p>{admin.bio}</p>
            <button className="btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminProfile;
