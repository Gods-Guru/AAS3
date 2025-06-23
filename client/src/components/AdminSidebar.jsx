import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.scss';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/discounts', label: 'Discounts' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/website-reviews', label: 'Reviews' },
  { to: '/admin/return-requests', label: 'Returns' },
];

const validLinks = adminLinks.filter(link => link.to && link.label);

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <div className="sidebar-title">Admin Panel</div>
    <ul>
      {validLinks.length > 0 ? validLinks.map(link => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {link.label}
          </NavLink>
        </li>
      )) : <li>No links available</li>}
    </ul>
  </aside>
);

export default AdminSidebar;
