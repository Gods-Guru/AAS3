import React, { useState } from 'react';

const EditProfileForm = ({ user, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || '',
    file: null
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, file }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // If a new file is selected, upload it first (simulate or use your backend upload endpoint)
    let profilePicture = form.profilePicture;
    if (form.file) {
      // Simulate upload: in production, POST to /api/upload and get the URL
      // For now, just use a local URL
      profilePicture = URL.createObjectURL(form.file);
    }
    onSave({
      name: form.name,
      email: form.email,
      bio: form.bio,
      profilePicture
    });
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Bio
        <textarea name="bio" value={form.bio} onChange={handleChange} />
      </label>
      <label>
        Profile Picture
        <input name="profilePicture" type="text" value={form.profilePicture} onChange={handleChange} placeholder="Image URL or upload below" />
        <input name="file" type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default EditProfileForm;
