import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminNavbar.scss';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/discounts', label: 'Discounts' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/returns', label: 'Returns' },
  // Add more links as needed
];

const AdminNavbar = () => {
  const { user } = useAuth();
  if (!user || !user.isAdmin) return null;

  if(user.isAdmin)
  return (
    <nav className="admin-navbar">
      <ul>
        {adminLinks.map(link => (
          <li key={link.to}>
            <NavLink to={link.to} activeClassName="active">
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
