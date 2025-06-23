import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FavouritesAdmin = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/favourites/customers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setTopCustomers(res.data || []));
    axios.get('http://localhost:5000/api/admin/favourites/products', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setTopProducts(res.data || []));
  }, []);

  return (
    <div className="favourites-admin-page">
      <h2>Favourite Customers</h2>
      <ul>
        {topCustomers.map(c => <li key={c._id}>{c.name} - {c.favouritesCount} favourites</li>)}
      </ul>
      <h2>Top-Favourited Products</h2>
      <ul>
        {topProducts.map(p => <li key={p._id}>{p.name} - {p.favouritesCount} favourites</li>)}
      </ul>
    </div>
  );
};

export default FavouritesAdmin;
