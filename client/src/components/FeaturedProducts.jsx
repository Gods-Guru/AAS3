// src/components/FeaturedProducts.jsx
import React from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const FeaturedProducts = ({ products, addToCart }) => {
  // Defensive: ensure products is always an array
  if (!Array.isArray(products) || products.length === 0) return null;

//   console.log("first 4 products:", products.slice(0, 4));

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE_URL}/cart`,
        { productId: product._id, quantity: 1 },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // Optionally show a success alert here
    } catch (err) {
      // Optionally show an error alert here
      console.error('Error adding to cart:', err);
    }
  };

  return (
    <section className="featured-products">
      <h2 className="featured-title">Featured Products</h2>
      <div className="product-grid">
        {products.slice(0, 4).map(product => (
          <div className="product-card" key={product._id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category?.name}</p>
            <p className="product-price">${product.price}</p>
            <button className="product-btn">View Details</button>
            <button
              className="product-btn"
              onClick={() => {
                if (product.inStock === 0) {
                  alert('This product is out of stock and cannot be added to cart.');
                  return;
                }
                handleAddToCart(product);
              }}
              disabled={product.inStock === 0}
            >
              {product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;