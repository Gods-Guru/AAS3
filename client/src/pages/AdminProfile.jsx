import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/profile/ProfileCard';
import EditProfileForm from '../components/profile/EditProfileForm';
import { getAdminProfile, getAdminAnalytics, getAllUsers, getAdminOrders } from '../services/profileService';
import { updateAdminProfile } from '../services/updateAdminProfile';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.scss';
import AdminNavbar from '../components/AdminNavbar';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assume adminId is stored in localStorage or context
        const adminId = localStorage.getItem('adminId');
        if (!adminId) {
          setError('Admin ID not found. Please log in again.');
          setLoading(false);
          return;
        }
        const adminData = await getAdminProfile(adminId);
        const analyticsData = await getAdminAnalytics();
        const usersData = await getAllUsers();
        const adminOrders = await getAdminOrders();
        setAdmin(adminData);
        setAnalytics(analyticsData);
        setUsers(usersData);
        setOrders(adminOrders);
      } catch (err) {
        setError('Failed to load admin profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    navigate('/login');
  };

  const handleDelete = () => {
    alert('Admin account deletion is not allowed from this page.');
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleSave = async (data) => {
    setSaving(true);
    try {
      const updated = await updateAdminProfile(admin._id, data);
      setAdmin(updated.user || updated);
      setEditing(false);
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-main">Loading...</div>;
  if (error) return <div className="profile-main">{error}</div>;
  if (!admin) return null;

  return (
    <>
      <AdminNavbar />
      <div className="profile-layout">
        <main className="profile-main">
          {editing ? (
            <EditProfileForm user={admin} onSave={handleSave} onCancel={handleCancel} loading={saving} />
          ) : (
            <ProfileCard user={admin} isAdmin={true} onLogout={handleLogout} onDelete={handleDelete} onEdit={handleEdit} />
          )}
          <section className="admin-analytics">
            <h3>Dashboard Analytics</h3>
            {analytics && (
              <ul>
                <li><strong>Total Sales:</strong> {analytics.totalSales}</li>
                <li><strong>Total Orders:</strong> {analytics.totalOrders}</li>
                <li><strong>Pending Orders:</strong> {analytics.pendingOrders}</li>
                <li><strong>Total Customers:</strong> {analytics.totalCustomers}</li>
                <li><strong>Products In Stock:</strong> {analytics.productsInStock}</li>
                <li><strong>Return Requests:</strong> {analytics.returnRequests}</li>
              </ul>
            )}
          </section>
          <section className="admin-users">
            <h3>All Users</h3>
            <ul>
              {users.map(u => (
                <li key={u._id}>{u.name} ({u.email})</li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminProfile;
