import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../styles/adminstyle/ProductsPage.scss';
import AdminProductReviews from './AdminProductReviews';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  inStock: '',
  status: 'in stock',
  image: null,
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [form, setForm] = useState(initialForm);
  const [formImagePreview, setFormImagePreview] = useState('');
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkProducts, setBulkProducts] = useState([
    { ...initialForm }
  ]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const pollingRef = useRef();

  // Fetch categories for select dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // FIX: Fetch from /api/categories, not /api/products
        const res = await axios.get('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Real-time polling for products
  useEffect(() => {
    fetchProducts();
    pollingRef.current = setInterval(fetchProducts, 3000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = Array.isArray(res.data) ? res.data : res.data.products || [];
      setProducts(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch products.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.map(prod => {
    // Force status to 'out of stock' if inStock is 0
    const status = prod.inStock === 0 ? 'out of stock' : prod.status;
    return { ...prod, status };
  }).filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? prod.category?.name === categoryFilter : true;
    const matchesStock = stockFilter ? prod.status === stockFilter : true;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const uniqueCategories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];

  // Modal handlers
  const openAddModal = () => {
    setModalMode('add');
    setForm(initialForm);
    setFormImagePreview('');
    setShowModal(true);
    setEditId(null);
  };

  const openEditModal = (prod) => {
    setModalMode('edit');
    setForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category?._id || prod.category || '',
      inStock: prod.inStock,
      status: prod.status,
      image: null,
    });
    setFormImagePreview(prod.image || '');
    setShowModal(true);
    setEditId(prod._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setFormImagePreview('');
    setEditId(null);
  };

  // Bulk modal handlers
  const openBulkModal = () => {
    setBulkProducts([{ ...initialForm }]);
    setShowBulkModal(true);
  };

  const closeBulkModal = () => {
    setShowBulkModal(false);
    setBulkProducts([{ ...initialForm }]);
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
      setFormImagePreview(files[0] ? URL.createObjectURL(files[0]) : '');
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleBulkChange = (idx, e) => {
    const { name, value, files } = e.target;
    setBulkProducts(prev => prev.map((prod, i) =>
      i === idx ? {
        ...prod,
        [name]: name === 'image' ? files[0] : value
      } : prod
    ));
  };

  const addBulkRow = () => setBulkProducts(prev => [...prev, { ...initialForm }]);

  const removeBulkRow = idx => setBulkProducts(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res;
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== undefined) formData.append(key, val);
      });
      // Always ensure category is a string (category ID)
      formData.set('category', String(form.category));
      if (modalMode === 'add') {
        res = await axios.post('http://localhost:5000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        setMessage({ type: 'success', text: 'Product added successfully.' });
      } else {
        res = await axios.put(`http://localhost:5000/api/products/${editId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        setMessage({ type: 'success', text: 'Product updated successfully.' });
      }
      closeModal();
      await fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkLoading(true);
    let success = 0, fail = 0;
    for (const prod of bulkProducts) {
      try {
        const formData = new FormData();
        Object.entries(prod).forEach(([key, val]) => {
          if (val !== null && val !== undefined) formData.append(key, val);
        });
        formData.set('category', String(prod.category));
        await axios.post('http://localhost:5000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        success++;
      } catch {
        fail++;
      }
    }
    setBulkLoading(false);
    setShowBulkModal(false);
    setMessage({ type: fail === 0 ? 'success' : 'error', text: `${success} product(s) added, ${fail} failed.` });
    fetchProducts();
  };

  // Delete handlers
  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteId(null);
    setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/products/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage({ type: 'success', text: 'Product deleted.' });
      await fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed.' });
    } finally {
      setLoading(false);
      closeDeleteConfirm();
    }
  };

  // Status toggle
  const handleStatusToggle = async (prod) => {
    try {
      setLoading(true);
      const newStatus = prod.status === 'in stock' ? 'out of stock' : 'in stock';
      await axios.patch(`http://localhost:5000/api/products/${prod._id}/status`, { status: newStatus });
      setMessage({ type: 'success', text: 'Status updated.' });
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: 'Status update failed.' });
    } finally {
      setLoading(false);
    }
  };

  // Message auto-hide
  useEffect(() => {
    if (message.text) {
      const t = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const openReviewsModal = (productId) => {
    setSelectedProductId(productId);
    setShowReviewsModal(true);
  };

  const closeReviewsModal = () => {
    setShowReviewsModal(false);
    setSelectedProductId(null);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Product Management</h1>
        <button className="add-product-btn" onClick={openAddModal}>Add Product</button>
        <button className="bulk-add-btn" onClick={openBulkModal}>Bulk Add Products</button>
      </div>

      {message.text && (
        <div className={`message-bar ${message.type}`}>{message.text}</div>
      )}

      {/* Filters */}
      <div className="products-filters">
        <input
          type="text"
          placeholder="Search by name"
          className="filter-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="in stock">In Stock</option>
          <option value="out of stock">Out of Stock</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="products-grid">
        {filteredProducts.map(prod => (
          <div className="product-card" key={prod._id}>
            {prod.image && (
              <img src={prod.image} alt={prod.name} className="product-image" />
            )}
            <div className="product-title">{prod.name}</div>
            <div className="product-description">{prod.description}</div>
            <div className="product-meta">
              <span>${prod.price}</span> | <span>{prod.category?.name || 'N/A'}</span> | <span>{prod.inStock} pcs</span>
            </div>
            <div className="product-status">
              {prod.inStock === 0 && (
                <span className="out-of-stock-badge">Out of Stock</span>
              )}
              <span
                className={`status-toggle ${prod.status === 'in stock' ? 'in-stock' : 'out-stock'}`}
                onClick={() => prod.inStock > 0 && handleStatusToggle(prod)}
                title={prod.inStock === 0 ? 'Cannot set In Stock: No inventory' : 'Toggle status'}
                style={{ cursor: prod.inStock > 0 ? 'pointer' : 'not-allowed', opacity: prod.inStock > 0 ? 1 : 0.5 }}
              >
                {prod.status}
              </span>
            </div>
            <div className="product-actions">
              <button className="edit-btn" onClick={() => openEditModal(prod)}>Edit</button>
              <button className="delete-btn" onClick={() => openDeleteConfirm(prod._id)}>Delete</button>
              <button className="reviews-btn" onClick={() => openReviewsModal(prod._id)}>View Reviews</button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="no-products">No products found.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content sophisticated-modal">
            <button className="modal-close-btn" onClick={closeModal} title="Close">&times;</button>
            <h2>{modalMode === 'add' ? 'Add Product' : 'Edit Product'}</h2>
            <form className="product-form" onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleFormChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleFormChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleFormChange}
                required
                min="0"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="number"
                name="inStock"
                placeholder="Quantity"
                value={form.inStock}
                onChange={handleFormChange}
                required
                min="0"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                required
              >
                <option value="in stock">In Stock</option>
                <option value="out of stock">Out of Stock</option>
              </select>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFormChange}
              />
              {formImagePreview && (
                <img src={formImagePreview} alt="Preview" className="form-image-preview" />
              )}
              <div className="modal-actions">
                <button type="submit" className="modal-save-btn" disabled={loading}>
                  {loading ? 'Saving...' : modalMode === 'add' ? 'Add Product' : 'Update Product'}
                </button>
                <button type="button" className="modal-cancel-btn" onClick={closeModal} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="modal-overlay">
          <div className="modal-content sophisticated-modal">
            <button className="modal-close-btn" onClick={closeBulkModal} title="Close">&times;</button>
            <h2>Bulk Add Products</h2>
            <form className="product-form" onSubmit={handleBulkSubmit}>
              {bulkProducts.map((prod, idx) => (
                <div className="bulk-product-row" key={idx} style={{borderBottom:'1px solid #eee',marginBottom:8,paddingBottom:8}}>
                  <input type="text" name="name" placeholder="Product Name" value={prod.name} onChange={e=>handleBulkChange(idx,e)} required />
                  <textarea name="description" placeholder="Description" value={prod.description} onChange={e=>handleBulkChange(idx,e)} required />
                  <input type="number" name="price" placeholder="Price" value={prod.price} onChange={e=>handleBulkChange(idx,e)} required min="0" />
                  <select name="category" value={prod.category} onChange={e=>handleBulkChange(idx,e)} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <input type="number" name="inStock" placeholder="Quantity" value={prod.inStock} onChange={e=>handleBulkChange(idx,e)} required min="0" />
                  <select name="status" value={prod.status} onChange={e=>handleBulkChange(idx,e)} required>
                    <option value="in stock">In Stock</option>
                    <option value="out of stock">Out of Stock</option>
                  </select>
                  <input type="file" name="image" accept="image/*" onChange={e=>handleBulkChange(idx,e)} />
                  <button type="button" className="remove-bulk-row-btn" onClick={()=>removeBulkRow(idx)} disabled={bulkProducts.length===1}>Remove</button>
                </div>
              ))}
              <button type="button" className="add-bulk-row-btn" onClick={addBulkRow}>Add Another Product</button>
              <div className="modal-actions">
                <button type="submit" className="modal-save-btn" disabled={bulkLoading}>{bulkLoading ? 'Saving...' : 'Add All Products'}</button>
                <button type="button" className="modal-cancel-btn" onClick={closeBulkModal} disabled={bulkLoading}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Product</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="modal-actions">
              <button className="modal-delete-btn" onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button className="modal-cancel-btn" onClick={closeDeleteConfirm} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth:600}}>
            <button className="modal-close-btn" onClick={closeReviewsModal} title="Close">&times;</button>
            <AdminProductReviews productId={selectedProductId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;