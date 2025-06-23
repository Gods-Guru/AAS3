import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminWebsiteReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/website-reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      setMessage('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleReply = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/website-reviews/${id}/reply`, { reply }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Reply sent');
      setReply('');
      setSelectedId(null);
      fetchReviews();
    } catch {
      setMessage('Failed to send reply');
    }
  };

  const handleFeature = async (id, featured) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/website-reviews/${id}/feature`, { featured }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch {
      setMessage('Failed to update featured status');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Website Reviews (User Feedback)</h2>
      {message && <div style={{ color: 'red', marginBottom: 8 }}>{message}</div>}
      {loading ? <div>Loading...</div> : (
        <div>
          {reviews.map(r => (
            <div key={r._id} style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 16, padding: 16, background: r.featured ? '#f5f5d1' : '#fafafa' }}>
              <div><strong>User:</strong> {r.user?.name || 'Anonymous'} ({r.user?.email || 'N/A'})</div>
              <div><strong>Experience:</strong> {r.experience} ★</div>
              <div><strong>Quality:</strong> {r.quality} ★</div>
              <div><strong>Price:</strong> {r.price} ★</div>
              <div><strong>Comment:</strong> {r.comment}</div>
              <div><strong>Submitted:</strong> {new Date(r.createdAt).toLocaleString()}</div>
              {r.reply && <div style={{ color: 'green' }}><strong>Admin Reply:</strong> {r.reply}</div>}
              <div style={{ marginTop: 8 }}>
                <button onClick={() => handleFeature(r._id, !r.featured)} style={{ marginRight: 8 }}>
                  {r.featured ? 'Unfeature' : 'Feature on Landing Page'}
                </button>
                <button onClick={() => setSelectedId(r._id)} style={{ marginRight: 8 }}>
                  Reply
                </button>
              </div>
              {selectedId === r._id && (
                <div style={{ marginTop: 8 }}>
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    rows={2}
                    style={{ width: '100%' }}
                  />
                  <button onClick={() => handleReply(r._id)} style={{ marginTop: 4 }}>Send Reply</button>
                  <button onClick={() => setSelectedId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWebsiteReviewsPage;
