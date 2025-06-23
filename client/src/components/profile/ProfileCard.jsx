import React from 'react';

const ProfileCard = ({ user, isAdmin, onLogout, onDelete, onEdit }) => (
  <section className="profile-card">
    <div className="profile-card-header">
      <img src={user.profilePicture || '/default-profile.png'} alt="Profile" className="profile-card-avatar" />
      <div>
        <h2>{user.fullName}</h2>
        <p>@{user.username || user.adminId}</p>
        <p>{user.email}</p>
        {isAdmin && <p className="profile-admin-role">{user.role}</p>}
      </div>
    </div>
    <div className="profile-card-body">
      {!isAdmin && (
        <>
          <p><strong>Bio:</strong> {user.bio || 'No bio provided.'}</p>
          <p><strong>Location:</strong> {user.location || 'N/A'}</p>
          <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
        </>
      )}
      {isAdmin && (
        <>
          <p><strong>Last Login:</strong> {user.lastLogin}</p>
          <p><strong>Last IP:</strong> {user.lastIP}</p>
        </>
      )}
    </div>
    <div className="profile-card-actions">
      <button className="btn-primary" onClick={onEdit}>Edit Profile</button>
      <button className="btn-secondary" onClick={onLogout}>Logout</button>
      <button className="btn-danger" onClick={onDelete}>Delete Account</button>
    </div>
  </section>
);

export default ProfileCard;
