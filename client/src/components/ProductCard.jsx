import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductCard = ({
  product,
  onRemoveFavourite = null,
  showRemove = false,
  showCart = true,
  showDetails = true,
  extraButton = null
}) => {
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const [showCartToast, setShowCartToast] = useState(false);

  const handleAddToCart = async () => {
    if (product.inStock === 0) {
      alert('This product is out of stock and cannot be added to cart.');
      return;
    }
    setLoading(true);
    try {
      await addToCart(product, 1);
      setShowCartToast(true);
      setTimeout(() => setShowCartToast(false), 2000);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to add to cart');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col"
      style={{ position: 'relative' }}
    >
      {showCartToast && (
        <div
          className="cart-toast"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: '#f8c6c8',
            color: '#2E2E2E',
            padding: '0.7rem 1.5rem',
            borderRadius: '1.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            zIndex: 10,
            animation: 'fadeOutCart 2s forwards',
          }}
        >
          Added to cart!
        </div>
      )}

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600 mb-2">${product.price}</p>

      {showCart && (
        <button
          onClick={handleAddToCart}
          disabled={loading || product.inStock === 0}
          className="mb-2 bg-pink-600 text-white text-center py-2 rounded hover:bg-pink-700 transition"
        >
          {product.inStock === 0 ? 'Out of Stock' : loading ? 'Adding...' : 'Add to Cart'}
        </button>
      )}

      {showDetails && (
        <Link
          to={`/products/${product._id}`}
          className="mt-auto bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      )}
      {showRemove && (
        <button
          onClick={onRemoveFavourite}
          className="mt-2 bg-red-600 text-white text-center py-2 rounded hover:bg-red-700"
        >
          Remove from Favourites
        </button>
      )}

      {/* Render extraButton if provided */}
      {extraButton && (
        <div style={{ marginTop: '0.5rem' }}>
          {extraButton}
        </div>
      )}
    </div>
  );
};

export default ProductCard;