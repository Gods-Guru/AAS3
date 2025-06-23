import '../styles/ProductList.scss';
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext'; // Adjust the path as necessary
import { fetchProducts } from '../api/endpoints';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(res => setProducts(res.data || res))
      .catch(() => setError('Failed to fetch products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="product-list">
      <h2>Popular Products</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      <div className="products" style={{display:'flex',flexWrap:'wrap',gap:'1rem'}}>
        {products.map(product => (
          <div key={product._id} className="product-card" style={{border:'1px solid #ccc',padding:'1rem',borderRadius:'8px',width:'220px'}}>
            <h4>{product.name}</h4>
            <div>Price: ${product.price?.toFixed(2)}</div>
            <div>{product.description}</div>
            <button
              onClick={() => {
                if (product.inStock === 0) {
                  alert('This product is out of stock and cannot be added to cart.');
                  return;
                }
                addToCart(product);
              }}
              disabled={product.inStock === 0}
              style={{ background: product.inStock === 0 ? '#ccc' : '#e67e22', color: '#fff', cursor: product.inStock === 0 ? 'not-allowed' : 'pointer' }}
            >
              {product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              className="view-reviews-btn"
              onClick={() => window.location.href = `/product/${product._id}`}
              style={{ marginTop: '0.5rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5em 1em', cursor: 'pointer', width: '100%' }}
            >
              <span role="img" aria-label="reviews" style={{marginRight: '8px'}}>📝</span>
              View Reviews
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}