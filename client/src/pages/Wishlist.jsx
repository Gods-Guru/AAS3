import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Wishlist.scss';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Helper to get wishlist from localStorage
  const getWishlistIds = () => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const wishlistIds = getWishlistIds();
    if (wishlistIds.length === 0) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    axios
      .get('http://localhost:5002/api/products')
      .then((res) => {
        const allProducts = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];
        setWishlist(allProducts.filter((p) => wishlistIds.includes(p._id)));
      })
      .catch((err) => {
        console.error('Failed to fetch wishlist', err);
        setWishlist([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist.map((item) => item._id)));
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="wishlist-page" style={{ minHeight: '80vh', background: '#f7f7fa', padding: '2rem 0' }}>
      <div className="wishlist-container" style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', color: '#2E2E2E' }}>Your Wishlist</h2>
        {loading ? (
          <p>Loading...</p>
        ) : wishlist.length ? (
          <div className="wishlist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {wishlist.map((product) => (
              <div className="wishlist-card" key={product._id} style={{ background: '#fafbfc', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.04)', padding: 16, position: 'relative' }}>
                <ProductCard
                  product={product}
                  showRemove={true}
                  onRemoveFavourite={() => removeFromWishlist(product._id)}
                  showCart={true}
                  showDetails={true}
                  extraButton={null}
                />
                <button
                  className="remove-btn"
                  style={{ position: 'absolute', top: 10, right: 10, background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontWeight: 700 }}
                  onClick={() => removeFromWishlist(product._id)}
                  title="Remove from wishlist"
                >
                  ×
                </button>
                <button
                  className="add-cart-btn"
                  style={{ marginTop: 12, width: '100%', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 0', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.inStock === 0}
                >
                  {product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#888', fontSize: '1.1rem' }}>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;