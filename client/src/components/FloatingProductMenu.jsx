import React, { useState } from 'react';
import '../styles/FloatingMenu.scss';
import { useCart } from '../context/CartContext';

const FloatingProductMenu = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const { addToCart } = useCart();;

  const handleAdd = async () => {
    if (product.inStock === 0) {
      setAlert({ show: true, message: 'This product is out of stock and cannot be added to cart.', type: 'error' });
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
        onClose();
      }, 2000);
      return;
    }
    try {
      await addToCart(product, quantity);
      setAlert({ show: true, message: 'Added to cart!', type: 'success' });
    } catch (err) {
      let msg = 'Add to cart failed.';
      if (err.response && err.response.data && err.response.data.message) {
        msg = `Add to cart failed: ${err.response.data.message}`;
      } else if (err.message) {
        msg = `Add to cart failed: ${err.message}`;
      }
      setAlert({ show: true, message: msg, type: 'error' });
      console.error('Add to cart error:', err);
    }
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
      onClose();
    }, 2000);
  };

  if (!product) return null;

  return (
    <div className="floating-menu-backdrop" onClick={onClose}>
      <div className="floating-menu" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        <div style={{ fontWeight: 500, color: '#232946', marginBottom: 8 }}>
          Total: ${ (product.price * quantity).toFixed(2) }
        </div>
        <p>{product.description}</p>
        <div className="quantity-picker">
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            style={{ width: '60px', marginLeft: '0.5rem' }}
          />
        </div>
        <button className="add-btn" onClick={handleAdd} disabled={product.inStock === 0}>
          {product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        {alert.show && (
          <div className={`cart-alert ${alert.type}`}>
            {alert.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingProductMenu;