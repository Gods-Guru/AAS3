import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/adminstyle/DiscountPage.scss';

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    expiryDate: '',
    usageLimit: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };

  const fetchDiscounts = async () => {
    setListLoading(true);
    try {
      const res = await axios.get('/api/discounts', config);
      setDiscounts(res.data);
    } catch (err) {
      setMessage('Failed to fetch discounts');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/discounts/${editingId}`, formData, config);
        setMessage('Discount updated successfully');
      } else {
        await axios.post('/api/discounts', formData, config);
        setMessage('Discount created successfully');
      }
      setFormData({ code: '', discountPercentage: '', expiryDate: '', usageLimit: '' });
      setEditingId(null);
      await fetchDiscounts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (discount) => {
    setFormData({
      code: discount.code,
      discountPercentage: discount.discountPercentage,
      expiryDate: discount.expiryDate.split('T')[0],
      usageLimit: discount.usageLimit,
    });
    setEditingId(discount._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this discount code?')) return;
    try {
      await axios.delete(`/api/discounts/${id}/delete`, config);
      fetchDiscounts();
    } catch (err) {
      setMessage('Failed to delete');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.put(`/api/discounts/${id}/toggle`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      fetchDiscounts();
    } catch (err) {
      setMessage('Failed to toggle status');
    }
  };

  return (
    <div className="admin-discounts">
      <h2>Discount Management</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="discount-form">
        <input
          type="text"
          name="code"
          placeholder="Discount Code"
          value={formData.code}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="discountPercentage"
          placeholder="Discount %"
          min="0"
          max="90"
          value={formData.discountPercentage}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="usageLimit"
          placeholder="Usage Limit (optional)"
          value={formData.usageLimit}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {editingId ? 'Update Discount' : 'Create Discount'}
        </button>
      </form>

      <div className="discount-list">
        {listLoading ? <div>Loading discounts...</div> : discounts.map((discount) => (
          <div key={discount._id} className="discount-card">
            <h4>{discount.code}</h4>
            <p>{discount.discountPercentage}% off</p>
            <p>Expires: {new Date(discount.expiryDate).toLocaleDateString()}</p>
            <p>Used: {discount.usedCount} / {discount.usageLimit || '∞'}</p>
            <p>Status: <strong>{discount.active ? 'Active' : 'Inactive'}</strong></p>
            <div className="actions">
              <button onClick={() => handleEdit(discount)}>Edit</button>
              <button onClick={() => toggleStatus(discount._id)}>
                {discount.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(discount._id)} className="danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountPage;