import React, { useEffect, useState } from 'react';
import '../styles/Catalogue.scss';
import axios from 'axios';
import FloatingProductMenu from '../components/FloatingProductMenu';
import { useCart } from '../context/CartContext';
import { FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import API_BASE_URL from '../api/config';
import { useNavigate } from 'react-router-dom';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [favourites, setFavourites] = useState(() => {
    const stored = localStorage.getItem('favourites');
    return stored ? JSON.parse(stored) : [];
  });
  const [showWishlistAlert, setShowWishlistAlert] = useState(false);
  const [wishlistAlertMsg, setWishlistAlertMsg] = useState('');
  const [cartAlert, setCartAlert] = useState({ show: false, message: '', type: '' });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    axios.get('http://localhost:5002/api/categories')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          setCategories([]);
        }
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
        setCategories([]);
      });
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (inStock) params.append('inStock', true);

    axios.get(`http://localhost:5002/api/products`, { params })
      .then((res) => {
        let allProducts = [];
        if (Array.isArray(res.data)) {
          allProducts = res.data;
        } else if (Array.isArray(res.data.products)) {
          allProducts = res.data.products;
        }
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setProducts([]);
        setFilteredProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Listen for changes in filter, sort, and search and auto-fetch/filter
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [selectedCategory, minPrice, maxPrice, inStock]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, [searchTerm]);

  useEffect(() => {
    let sorted = [...filteredProducts];
    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredProducts(sorted);
    // eslint-disable-next-line
  }, [sortOption]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e && e.preventDefault();
    const term = searchTerm.toLowerCase();
    if (!term) {
      setFilteredProducts(products);
      return;
    }
    const results = products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
    setFilteredProducts(results);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    const token = localStorage.getItem('token');
    axios.post(
    `http://localhost:5002/api/views/${product._id}`,
    {},
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  ).catch(() => {});
  };

  const closeFloatingMenu = () => {
    setSelectedProduct(null);
  };

  const handleWishlistToggle = async (productId) => {
    const token = localStorage.getItem('token');
    setWishlist((prev) => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
        setWishlistAlertMsg('Item has been removed from wishlist');
        setShowWishlistAlert(true);
        setTimeout(() => setShowWishlistAlert(false), 2000);
        axios.delete(`http://localhost:5002/api/wishlist/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      } else {
        updated = [...prev, productId];
        setWishlistAlertMsg('Item has been added to wishlist.');
        setShowWishlistAlert(true);
        setTimeout(() => setShowWishlistAlert(false), 2000);
        axios.post(`http://localhost:5002/api/wishlist`, { productId }, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      }
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleFavouritesToggle = async (productId) => {
    const token = localStorage.getItem('token');
    setFavourites((prev) => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
        setWishlistAlertMsg('Item has been removed from favourites');
        setShowWishlistAlert(true);
        setTimeout(() => setShowWishlistAlert(false), 2000);
        axios.delete(`http://localhost:5002/api/favourites/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      } else {
        updated = [...prev, productId];
        setWishlistAlertMsg('Item has been added to favourites');
        setShowWishlistAlert(true);
        setTimeout(() => setShowWishlistAlert(false), 2000);
        axios.post(`http://localhost:5002/api/favourites`, { productId }, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      }
      localStorage.setItem('favourites', JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = async (product, quantity = 1) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE_URL}/cart`,
        { productId: product._id, quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      refreshCart();
      setCartAlert({ show: true, message: `${product.name} added to cart!`, type: 'success' });
      setTimeout(() => setCartAlert({ show: false, message: '', type: '' }), 2000);
    } catch (err) {
      // Show more descriptive error if available
      let msg = 'Failed to add to cart.';
      if (err.response && err.response.data && err.response.data.message) {
        msg = `Add to cart failed: ${err.response.data.message}`;
      }
      setCartAlert({ show: true, message: msg, type: 'error' });
      setTimeout(() => setCartAlert({ show: false, message: '', type: '' }), 3000);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [filteredProducts]);

  return (
    <div className="catalogue-modern-page" style={{ background: "#f7f8fa", minHeight: "100vh", paddingBottom: 40 }}>
      <header style={{
        padding: "3rem 0 2rem 0",
        textAlign: "center",
        background: "linear-gradient(90deg, #f7f8fa 60%, #e3e9f7 100%)"
      }}>
        <h1 style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          letterSpacing: "-1px",
          color: "#232946",
          marginBottom: 8
        }}>Discover Our Catalogue</h1>
        <p style={{
          color: "#6b7280",
          fontSize: "1.2rem",
          fontWeight: 400,
          margin: 0
        }}>Browse premium auto accessories and essentials</p>
      </header>

      <div className="catalogue-controls-modern" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        margin: "2rem 0 1.5rem 0"
      }}>
        <form style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchInput}
            style={{
              padding: "0.7rem 1rem",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              background: "#fff",
              minWidth: 220,
              outline: "none",
              transition: "border 0.2s"
            }}
          />
        </form>
        <form className="filters-modern" onSubmit={handleFilter} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 20,
              border: "1px solid #d1d5db",
              background: "#fff",
              fontSize: "1rem"
            }}
          >
            <option value="">All Categories</option>
            {Array.isArray(categories) && categories.map(cat => (
              <option key={cat._id || cat.id || cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            min="0"
            step="0.01"
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              width: 90,
              padding: "0.6rem 0.7rem",
              borderRadius: 20,
              border: "1px solid #d1d5db",
              background: "#fff",
              fontSize: "1rem"
            }}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            min="0"
            step="0.01"
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              width: 90,
              padding: "0.6rem 0.7rem",
              borderRadius: 20,
              border: "1px solid #d1d5db",
              background: "#fff",
              fontSize: "1rem"
            }}
          />
          {/* <label style={{ display: "flex", alignItems: "center", fontSize: "1rem", color: "#232946" }}>
            <input
              type="checkbox"
              checked={inStock}
              onChange={() => setInStock(!inStock)}
              style={{ marginRight: 6 }}
            />
            In Stock
          </label> */}
        </form>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label htmlFor="sort" style={{ color: "#232946", fontWeight: 500 }}>Sort:</label>
          <select
            id="sort"
            onChange={handleSortChange}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 20,
              border: "1px solid #d1d5db",
              background: "#fff",
              fontSize: "1rem"
            }}
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {showWishlistAlert && (
        <div style={{
          position: "fixed",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#232946",
          color: "#fff",
          padding: "0.8rem 2rem",
          borderRadius: 4,
          boxShadow: "0 2px 16px rgba(35,41,70,0.13)",
          zIndex: 1000,
          fontWeight: 500,
          fontSize: "1.1rem"
        }}>
          {wishlistAlertMsg}
        </div>
      )}
      {cartAlert.show && (
        <div style={{
          position: "fixed",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
          background: cartAlert.type === "success" ? "#eebbc3" : "#ffb4b4",
          color: "#232946",
          padding: "0.8rem 2rem",
          borderRadius: 4,
          boxShadow: "0 2px 16px rgba(35,41,70,0.13)",
          zIndex: 1000,
          fontWeight: 500,
          fontSize: "1.1rem"
        }}>
          {cartAlert.message}
        </div>
      )}

      <div className="modern-product-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "2rem",
        padding: "2rem 1rem",
        maxWidth: 1200,
        margin: "0 auto"
      }}>
        {loading ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 0" }}>
            <div className="spinner" style={{
              width: 48, height: 48, border: "5px solid #eebbc3", borderTop: "5px solid #232946",
              borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto"
            }} />
            <style>
              {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
            </style>
            <p style={{ color: "#6b7280", marginTop: 16 }}>Loading products...</p>
          </div>
        ) : paginatedProducts.length ? (
          paginatedProducts.map(product => (
            <div
              className="modern-product-card"
              key={product._id}
              style={{
                background: "#fff",
                borderRadius: 4,
                boxShadow: "0 4px 24px rgba(35,41,70,0.07)",
                padding: "1.5rem 1.2rem 1.2rem 1.2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
                animation: "fadeIn 0.7s"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(35,41,70,0.13)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 24px rgba(35,41,70,0.07)"}
            >
              {/* Wishlist button */}
              <button
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  color: wishlist.includes(product._id) ? "#e63946" : "#b0b3c6",
                  cursor: "pointer",
                  transition: "color 0.2s"
                }}
                onClick={() => handleWishlistToggle(product._id)}
                aria-label="Add to wishlist"
              >
                {wishlist.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
              </button>
              {/* Favourites button */}
              <button
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  color: favourites.includes(product._id) ? "#fbbf24" : "#b0b3c6",
                  cursor: "pointer",
                  transition: "color 0.2s"
                }}
                onClick={() => handleFavouritesToggle(product._id)}
                aria-label="Add to favourites"
              >
                <FaRegStar />
              </button>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  maxWidth: 180,
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 16,
                  marginBottom: 18,
                  boxShadow: "0 2px 8px rgba(35,41,70,0.07)"
                }}
              />
              <h4 style={{
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "#232946",
                margin: "0 0 0.5rem 0",
                textAlign: "center"
              }}>{product.name}</h4>
              <p style={{
                color: "#6b7280",
                fontSize: "0.98rem",
                margin: "0 0 0.7rem 0",
                textAlign: "center",
                minHeight: 36
              }}>{product.description?.slice(0, 60)}{product.description?.length > 60 ? "..." : ""}</p>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "auto"
              }}>
                <span style={{
                  fontWeight: 700,
                  color: "#e63946",
                  fontSize: "1.1rem"
                }}>${product.price}</span>
                {product.inStock === 0 ? (
                  <span style={{
                    color: '#b91c1c',
                    fontWeight: 600,
                    fontSize: '1rem',
                    marginLeft: 10
                  }}>Out of Stock</span>
                ) : (
                  <button
                    className="modern-view-btn"
                    onClick={() => handleView(product)}
                    style={{
                      padding: "0.5rem 1.1rem",
                      borderRadius: 18,
                      border: "none",
                      background: "#232946",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "1rem",
                      marginLeft: 10,
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                  >View</button>
                )}
              </div>
              <button
                className="modern-reviews-btn"
                onClick={() => navigate(`/products/${product._id}`)}
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: 18,
                  border: "2px solid #3498db",
                  background: "#3498db",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginLeft: 10,
                  marginTop: 0,
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                  width: '100%'
                }}
              >
                <span role="img" aria-label="reviews" style={{marginRight: '8px'}}>📝</span>
                View Reviews
              </button>
              <style>
                {`@keyframes fadeIn { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }`}
              </style>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem 0" }}>
            <p style={{ color: "#6b7280", fontSize: "1.2rem" }}>No products found.</p>
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '2rem 0' }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&laquo; Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{ fontWeight: currentPage === i + 1 ? 700 : 400 }}
            >{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next &raquo;</button>
        </div>
      )}
      {/* Floating Product Menu */}
      {selectedProduct && (
        <FloatingProductMenu
          product={selectedProduct}
          onClose={closeFloatingMenu}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default CatalogPage;