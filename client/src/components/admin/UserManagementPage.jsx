import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  deleteUserAccount,
  toggleBlockUser
} from '../../services/profileService';
import '../../styles/adminstyle/UserManagementPage.scss';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    isBlocked: 'all',
    isAdmin: 'all',
    isVerified: 'all',
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterAndSearch();
    // eslint-disable-next-line
  }, [users, searchQuery, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      // Optionally show error
    }
    setLoading(false);
  };

  const filterAndSearch = () => {
    let filtered = [...users];
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== 'all') {
        filtered = filtered.filter((u) => String(u[key]) === filters[key]);
      }
    });
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    setFilteredUsers(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBlock = async (userId) => {
    setActionLoading(true);
    try {
      await toggleBlockUser(userId);
      await fetchUsers();
    } catch (err) {
      // Optionally show error
    }
    setActionLoading(false);
  };

  const deleteUser = async (userId) => {
    setActionLoading(true);
    try {
      await deleteUserAccount(userId);
      await fetchUsers();
    } catch (err) {
      // Optionally show error
    }
    setActionLoading(false);
  };

  const openDrawer = (user) => setSelectedUser(user);
  const closeDrawer = () => setSelectedUser(null);

  return (
    <div className="user-management-container">
      {/* <div className="header">
        <h2>Customer Management</h2>
      </div> */}

      {/* Search & Filters - Now styled but same functionality */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {['isBlocked', 'isAdmin', 'isVerified'].map((filterKey) => (
          <select
            key={filterKey}
            value={filters[filterKey]}
            onChange={(e) => handleFilterChange(filterKey, e.target.value)}
            className="filter-select"
          >
            <option value="all">{filterKey.replace('is', '')}: All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        ))}
      </div>

      {/* User Cards - Preserving your logic but with better visuals */}
      {loading ? (
        <p className="loading-message">Loading customers...</p>
      ) : (
        <div className="users-grid">
          {filteredUsers.map((user) => (
            <div 
              key={user._id} 
              className={`user-card ${selectedUser?._id === user._id ? 'active' : ''}`}
              onClick={() => openDrawer(user)}
            >
              <div className="user-header">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="user-status">
                <span className={`badge ${user.isAdmin ? 'admin' : ''}`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
                <span className={`badge ${user.isBlocked ? 'blocked' : ''}`}>
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </span>
                <span className={`badge ${user.isVerified ? 'verified' : ''}`}>
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div className="user-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBlock(user._id);
                  }}
                  className={`action-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                  disabled={actionLoading}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
                {!user.isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUser(user._id);
                    }}
                    className="action-btn delete"
                    disabled={actionLoading}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer - Same functionality but better styled */}
      {selectedUser && (
        <div className="user-drawer">
          <div className="drawer-header">
            <h3>Customer Details</h3>
            <button onClick={closeDrawer} className="close-btn">×</button>
          </div>
          <div className="drawer-content">
            <DetailItem label="Name" value={selectedUser.name} />
            <DetailItem label="Email" value={selectedUser.email} />
            <DetailItem label="Admin" value={selectedUser.isAdmin ? 'Yes' : 'No'} />
            <DetailItem label="Blocked" value={selectedUser.isBlocked ? 'Yes' : 'No'} />
            <DetailItem label="Verified" value={selectedUser.isVerified ? 'Yes' : 'No'} />
            <DetailItem label="User ID" value={selectedUser._id} />
            <DetailItem 
              label="Created" 
              value={new Date(selectedUser.createdAt).toLocaleString()} 
            />
            <DetailItem 
              label="Updated" 
              value={new Date(selectedUser.updatedAt).toLocaleString()} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for drawer items
const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <strong>{label}:</strong>
    <span>{value}</span>
  </div>
);

export default UserManagementPage;