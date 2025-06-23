import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminNavbar from '../components/AdminNavbar';
// import '../styles/AdminPanel.scss';

const AdminPanel = () => (
  <>
    <AdminNavbar />
    <div className="admin-panel-page" style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <AdminDashboard />
      </div>
    </div>
  </>
);

export default AdminPanel;