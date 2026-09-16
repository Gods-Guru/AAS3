import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { addToFavourites } from '../services/favourites';
import '../styles/Favourites.scss';

const FavouritesPage = () => {
  const [manualFavourites, setManualFavourites] = useState([]);
  const [topViewedProducts, setTopViewedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Helper to get guest favourites from localStorage
  const getGuestFavourites = () => {
    try {
      return JSON.parse(localStorage.getItem('favourites') || '[]');
    } catch {
      return [];
    }
  };

  // Fetch both manual favourites and auto top-viewed
  const fetchFavourites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // For guests, use localStorage for manual favourites
        const guestFavIds = getGuestFavourites();
        if (guestFavIds.length === 0) {
          setManualFavourites([]);
        } else {
          // Fetch all products and filter
          const res = await axios.get('http://localhost:5002/api/products');
          const allProducts = Array.isArray(res.data)
            ? res.data
            : res.data.products || [];
          setManualFavourites(allProducts.filter((p) => guestFavIds.includes(p._id)));
        }
        setTopViewedProducts([]); // No auto-tracking for guests
        setLoading(false);
        return;
      }
      const [manualRes, viewedRes] = await Promise.all([
        axios.get('http://localhost:5002/api/favourites', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5002/api/views', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Manual favourites: flatten to product objects if needed
      const manualProducts = Array.isArray(manualRes.data)
        ? manualRes.data.map(fav => fav.product || fav)
        : [];

      // Top viewed: flatten to product objects if needed
      // FIX: Some APIs return {product, count}, some just product. Try to normalize.
      let viewedProducts = [];
      if (Array.isArray(viewedRes.data)) {
        viewedProducts = viewedRes.data.flatMap(view => {
          // If view.product exists and is an object, use it
          if (view.product && typeof view.product === 'object') return [view.product];
          // If view.productData exists and is an object, use it
          if (view.productData && typeof view.productData === 'object') return [view.productData];
          // If view itself looks like a product (has _id or id), use it
          if (view && (view._id || view.id)) return [view];
          // If view is an array (bad API), flatten it
          if (Array.isArray(view)) return view;
          return [];
        });
      }

      setManualFavourites(manualProducts);
      setTopViewedProducts(viewedProducts);
    } catch (error) {
      setManualFavourites([]);
      setTopViewedProducts([]);
      console.error('Error fetching favourites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleRemoveFavourite = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Remove from guest favourites in localStorage
      const guestFavIds = getGuestFavourites().filter((id) => id !== productId);
      localStorage.setItem('favourites', JSON.stringify(guestFavIds));
      setManualFavourites((prev) => prev.filter((item) => (item._id || item.id) !== productId));
      return;
    }
    try {
      await axios.delete(`http://localhost:5002/api/favourites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManualFavourites((prev) => prev.filter((item) => (item._id || item.id) !== productId));
    } catch (error) {
      console.error('Error removing favourite:', error);
    }
  };

  // Add to Favourites handler
  const handleAddToFavourites = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Add to guest favourites in localStorage
      const guestFavIds = getGuestFavourites();
      if (!guestFavIds.includes(productId)) {
        guestFavIds.push(productId);
        localStorage.setItem('favourites', JSON.stringify(guestFavIds));
        // Optionally, update state
        setManualFavourites((prev) => [
          ...prev,
          topViewedProducts.find((p) => (p._id || p.id) === productId)
        ]);
      }
      return;
    }
    try {
      await addToFavourites(productId, token);
      setManualFavourites((prev) => [
        ...prev,
        topViewedProducts.find((p) => (p._id || p.id) === productId)
      ]);
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  // Add handleView function
  const handleView = (product) => {
    setSelectedProduct(product);
    // Track the view in the backend
    const token = localStorage.getItem('token');
    axios.post(
      `http://localhost:5002/api/views/${product._id}`,
      {},
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    ).then(() => {
    // Refetch favourites after tracking the view
    fetchFavourites();
    }).catch(() => {});
  };

  // Helper: check if a product is in manual favourites
  const isInManualFavourites = (productId) =>
    manualFavourites.some((item) => (item._id || item.id) === productId);

  // Remove from favourites from auto-tracked section
  const handleRemoveFromAutoFavourites = async (productId) => {
    await handleRemoveFavourite(productId);
  };

  if (loading) return (
    <div className="favourites-loading">
      <div>Loading your favourites...</div>
    </div>
  );

  return (
    <div className="favourites-bg">
      <div className="favourites-container">
        <h1 className="favourites-title">
          Your Favourites
        </h1>

        <section className="favourites-section favourites-section--manual">
          <h2 className="favourites-section-title favourites-section-title--manual">
            <span className="favourites-icon">❤</span> Your Favourite Picks
          </h2>
          {manualFavourites.length === 0 ? (
            <p className="favourites-empty">You haven’t added any favourites manually yet.</p>
          ) : (
            <div className="favourites-grid">
              {manualFavourites.map((product) => (
                <div key={product._id || product.id} className="favourites-card-wrapper">
                  <ProductCard
                    product={product}
                    showRemove={true}
                    onRemoveFavourite={() => handleRemoveFavourite(product._id || product.id)}
                    showCart={true}
                    showDetails={true}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="favourites-section favourites-section--viewed">
          <h2 className="favourites-section-title favourites-section-title--viewed">
            <span className="favourites-icon">🔁</span> Frequently Viewed by You
          </h2>
          {topViewedProducts.length === 0 ? (
            <p className="favourites-empty">No frequently viewed products yet.</p>
          ) : (
            <div className="favourites-grid">
              {topViewedProducts.map((product) => {
                const productId = product._id || product.id;
                return (
                  <div key={productId} className="favourites-card-wrapper">
                    <ProductCard
                      product={product}
                      showCart={true}
                      showDetails={true}
                      onClick={() => handleView(product)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FavouritesPage;