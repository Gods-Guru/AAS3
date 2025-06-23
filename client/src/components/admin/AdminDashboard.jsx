import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiDollarSign, 
  FiCalendar,
  FiInbox,
  FiRefreshCw,
  FiStar,
  FiAlertTriangle,
  FiAlertCircle,
  FiSettings,
  FiUser,
  FiLogOut,
  FiBarChart2,
  FiTag,
  FiPlus,
  FiList,
  FiTruck
} from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/adminstyle/AdminDashboard.scss';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
    salesThisMonth: 0,
    pendingOrders: 0,
    returnRequests: 0,
    mostViewedProduct: { name: "N/A", views: 0 },
    topRatedProduct: { name: "N/A", rating: 0 }
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentSignups, setRecentSignups] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, usersRes, productsRes, analyticsRes] = await Promise.all([
          axios.get('/api/admin/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/orders/admin?sortBy=createdAt&order=desc&limit=5', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/users?sortBy=createdAt&order=desc&limit=5', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/products?sortBy=createdAt&order=desc&limit=5', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/api/analytics', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        const statsData = statsRes.data || {};
        setStats({
          totalProducts: statsData.other?.totalProducts ?? 0,
          totalOrders: statsData.orders?.totalOrders ?? 0,
          totalUsers: statsData.other?.totalCustomers ?? 0,
          totalSales: statsData.sales?.totalSales ?? 0,
          salesThisMonth: statsData.sales?.monthlySales ?? 0,
          pendingOrders: statsData.orders?.pendingOrders ?? 0,
          returnRequests: statsData.other?.returnRequests ?? 0,
          mostViewedProduct: statsData.products?.mostViewed ?? { name: "N/A", views: 0 },
          topRatedProduct: statsData.products?.topRated ?? { name: "N/A", rating: 0 }
        });
        setRecentOrders(Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 5) : []);
        setRecentSignups(Array.isArray(usersRes.data) ? usersRes.data.slice(0, 5) : []);
        const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.products || []);
        setRecentProducts(products.slice(0, 5));

        // Process monthly sales for chart
        const salesArr = Array(12).fill(0);
        if (analyticsRes.data && Array.isArray(analyticsRes.data.monthlySales)) {
          analyticsRes.data.monthlySales.forEach(({ month, total }) => {
            const idx = [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ].indexOf(month);
            if (idx !== -1) salesArr[idx] = total;
          });
        }
        setMonthlySales(salesArr);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales ($)',
        data: monthlySales,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Annual Sales Performance',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const adminProfile = {
    name: "Admin User",
    role: "Superadmin",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=3498db&color=fff"
  };

  const alerts = [
    { type: "warning", message: "Low stock: Widget Pro (3 left)", icon: <FiAlertTriangle /> },
    { type: "danger", message: "Order #123 flagged for refund", icon: <FiAlertCircle /> },
    { type: "info", message: "New feature: Bulk order processing available", icon: <FiInbox /> }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-content">
        {/* Header with Profile and Toggle Button */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard Overview</h1>
          </div>
          <div className="profile-container" ref={profileMenuRef}>
            <div 
              className="profile-info"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="profile-role">{adminProfile.role}</span>
              <img src={adminProfile.avatar} alt="Admin" className="profile-avatar" />
            </div>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <img src={adminProfile.avatar} alt="Admin" />
                  <div>
                    <h4>{adminProfile.name}</h4>
                    <p>{adminProfile.role}</p>
                  </div>
                </div>
                <Link to="/admin/profile" className="dropdown-item">
                  <FiUser /> My Profile
                </Link>
                <Link to="/admin/settings" className="dropdown-item">
                  <FiSettings /> Settings
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  <FiLogOut /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FiPackage />
            </div>
            <div className="stat-info">
              <h3>Total Products</h3>
              <p>{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiShoppingCart />
            </div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p>{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-info">
              <h3>Total Sales</h3>
              <p>{formatCurrency(stats.totalSales)}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiCalendar />
            </div>
            <div className="stat-info">
              <h3>Monthly Sales</h3>
              <p>{formatCurrency(stats.salesThisMonth)}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiInbox />
            </div>
            <div className="stat-info">
              <h3>Pending Orders</h3>
              <p>{stats.pendingOrders.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiRefreshCw />
            </div>
            <div className="stat-info">
              <h3>Return Requests</h3>
              <p>{stats.returnRequests.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiStar />
            </div>
            <div className="stat-info">
              <h3>Top Rated Product</h3>
              <p>{stats.topRatedProduct.name} ({stats.topRatedProduct.rating}/5)</p>
            </div>
          </div>
        </section>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <section className="alerts-section">
            <h2>Alerts & Notifications</h2>
            <div className="alerts-grid">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`alert alert-${alert.type}`}>
                  <div className="alert-icon">{alert.icon}</div>
                  <p>{alert.message}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content Area */}
        <div className="dashboard-content">
          {/* Left Column - Chart */}
          <section className="chart-section">
            <h2>Sales Performance</h2>
            <div className="chart-container">
              <Bar data={salesChartData} options={chartOptions} />
            </div>
          </section>

          {/* Right Column - Recent Activities */}
          <section className="recent-activities">
            <h2>Recent Activities</h2>
            <div className="activity-card1">
              <h3><FiUsers /> New Customers</h3>
              {recentSignups.length === 0 ? (
                <p className="no-data">No recent signups</p>
              ) : (
                <ul>
                  {recentSignups.map(user => (
                    <li key={user._id}>
                      <div className="activity-item">
                        <span className="activity-main">
                          {user.name || user.email.split('@')[0]}
                        </span>
                        <span className="activity-date">{formatDate(user.createdAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/admin/users" className="view-all">View All Customers →</Link>
            </div>
          </section>
          <section className="recent-activities2">
            <div className="activity-card2">
            <h3><FiShoppingCart /> Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p className="no-data">No recent orders</p>
            ) : (
              <ul>
                {recentOrders.map(order => (
                  <li key={order._id}>
                    <div className="activity-item">
                      <span className="activity-main">
                        #{order.orderNumber || order._id.slice(-6).toUpperCase()} - 
                        {formatCurrency(order.total)}
                      </span>
                      <span className={`activity-status status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                      <span className="activity-date">{formatDate(order.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/admin/orders" className="view-all">View All Orders →</Link>
          </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products/" className="action-card">
              <FiPlus /> Add New Product
            </Link>
            <Link to="/admin/orders" className="action-card">
              <FiList /> Manage Orders
            </Link>
            <Link to="/admin/return-requests" className="action-card">
              <FiRefreshCw /> Process Returns
            </Link>
            <Link to="/admin/users" className="action-card">
              <FiUser /> View Customers
            </Link>
            <Link to="/admin/discounts" className="action-card">
              <FiTag /> Create Discount
            </Link>
            <Link to="/admin/analytics" className="action-card">
              <FiBarChart2 /> View Analytics
            </Link>
            {/* <Link to="/admin/shipping" className="action-card">
              <FiTruck /> Shipping Settings
            </Link>
            <Link to="/admin/settings" className="action-card">
              <FiSettings /> System Settings
            </Link> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;