import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import '../../styles/adminstyle/Analytics.scss'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00bcd4'];

const AdminAnalytics = () => {
  const [summary, setSummary] = useState({});
  const [ordersChartData, setOrdersChartData] = useState([]);
  const [productsChartData, setProductsChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('http://localhost:5002/api/analytics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setSummary(data.summary);
        setOrdersChartData(data.monthlyOrders);
        setProductsChartData(data.categoryDistribution);
        setTopProducts(data.topSellingProducts);
      } catch (error) {
        console.error('Analytics fetch failed:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="admin-analytics">
      <div className="analytics-header">Dashboard Analytics</div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h4>Total Users (Including admins)</h4>
          <p>{summary.totalUsers || 0}</p>
        </div>
        <div className="card">
          <h4>Total Products</h4>
          <p>{summary.totalProducts || 0}</p>
        </div>
        <div className="card">
          <h4>Total Orders</h4>
          <p>{summary.totalOrders || 0}</p>
        </div>
        <div className="card">
          <h4>Total Revenue</h4>
          <p>${summary.totalRevenue?.toLocaleString() || '0'}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-card">
          <h4>Monthly Orders</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Product Categories</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productsChartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {productsChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="top-products">
        <h4>Top Selling Products</h4>
        <ul>
          {topProducts?.length ? (
            topProducts.map((item, index) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <span>{item.totalSold}</span>
              </li>
            ))
          ) : (
            <p>No sales data available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminAnalytics;