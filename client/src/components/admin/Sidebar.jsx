import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingBag, 
  FiRefreshCw,
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiBarChart2,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import '../../styles/adminstyle/Sidebar.scss';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    products: !isCollapsed,
    customers: !isCollapsed
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    {
      type: 'item',
      path: '/admin/dashboard',
      icon: <FiHome className="nav-icon" />,
      label: 'Dashboard'
    },
    {
      type: 'section',
      key: 'products',
      icon: <FiPackage className="section-icon" />,
      label: 'Products',
      subItems: [
        { path: '/admin/products/list', label: 'All Products' },
        { path: '/admin/products/add', label: 'Add New' },
        { path: '/admin/products/categories', label: 'Categories' }
      ]
    },
    {
      type: 'item',
      path: '/admin/orders',
      icon: <FiShoppingBag className="nav-icon" />,
      label: 'Orders'
    },
    {
      type: 'item',
      path: '/admin/return-requests',
      icon: <FiRefreshCw className="nav-icon" />,
      label: 'Returns',
      badge: 5
    },
    {
      type: 'section',
      key: 'customers',
      icon: <FiUsers className="section-icon" />,
      label: 'Customers',
      subItems: [
        { path: '/admin/customers/list', label: 'All Customers' },
        { path: '/admin/customers/segments', label: 'Segments' }
      ]
    },
    {
      type: 'item',
      path: '/admin/staff',
      icon: <FiUserPlus className="nav-icon" />,
      label: 'Staff'
    },
    {
      type: 'item',
      path: '/admin/analytics',
      icon: <FiBarChart2 className="nav-icon" />,
      label: 'Analytics'
    },
    {
      type: 'item',
      path: '/admin/settings',
      icon: <FiSettings className="nav-icon" />,
      label: 'Settings'
    }
  ];

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
        <button 
          className="sidebar-toggle-button" 
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav"> 
        <ul className="nav-menu">
          {menuItems.map((item) => {
            if (item.type === 'item') {
              return (
                <li 
                  key={item.path} 
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </Link>
                </li>
              );
            }

            if (item.type === 'section') {
              return (
                <li key={item.key} className="nav-section">
                  <div 
                    className="section-header" 
                    onClick={() => toggleSection(item.key)}
                    aria-expanded={expandedSections[item.key]}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {expandedSections[item.key] ? <FiChevronDown /> : <FiChevronRight />}
                  </div>
                  {expandedSections[item.key] && (
                    <ul className="sub-menu">
                      {item.subItems.map((subItem) => (
                        <li 
                          key={subItem.path} 
                          className={`sub-item ${isActive(subItem.path) ? 'active' : ''}`}
                        >
                          <Link to={subItem.path}>{subItem.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return null;
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;