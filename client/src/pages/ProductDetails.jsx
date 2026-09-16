import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { fetchReviews, addReview } from '../api/reviews';
import { useAuth } from '../context/AuthContext';
import '../styles/ProductDetails.scss';

const ProductDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/products/${id}`);
        if (!res.ok) {
          setProduct(null);
          return;
        }
        const data = await res.json();
        setProduct(data.product || data);
      } catch (err) {
        setProduct(null);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchReviews(id).then(setReviews).catch(() => setReviews([]));
  }, [id, reviewRefresh]);

  useEffect(() => {
    const trackView = async () => {
      if (!token) return; // Only track if logged in
      try {
        await axios.post(
          `http://localhost:5002/api/auto-favourites/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };
    if (id) trackView();
  }, [id, token]);

  // Dummy wishlist toggle logic for demo
  const handleWishlistToggle = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!product || !product._id)
      throw new Error('Cannot review a product that does not exist.');
    const token = localStorage.getItem('token');
    if (!token) throw new Error('You must be logged in to review.');
    try {
      await addReview(id, { rating, comment, productId: id }, token);
      setReviewRefresh((r) => r + 1);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new Error('This product no longer exists.');
      }
      throw err;
    }
  };

  if (product === null)
    return <div className="p-6 text-red-600 font-bold">Product not found.</div>;

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="product-details-page">
      <div className="product-details-page__image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-details-page__image"
        />
      </div>
      
      <div className="product-details-page__content">
        <h1 className="product-details-page__title">{product.name}</h1>
        <p className="product-details-page__price">${product.price}</p>
        <p className="product-details-page__description">{product.description}</p>
        
        <button
          className={`product-details-page__wishlist-btn${
            wishlist.includes(product._id) ? ' active' : ''
          }`}
          onClick={() => handleWishlistToggle(product._id)}
        >
          ❤️
        </button>
        
        <h3 className="product-details-page__reviews-title">
          Reviews for {product?.name}
        </h3>
        <ReviewList reviews={reviews} />
        <ReviewForm productId={id} onReviewSubmit={handleReviewSubmit} />
      </div>
    </div>
  );
};

export default ProductDetails;