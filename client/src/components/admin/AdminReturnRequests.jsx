import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import '../../styles/adminstyle/adminUserReturns.scss';

const AdminReturnRequests = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({});
  const [adminNotes, setAdminNotes] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5002/api/returns', {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      setReturns(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch return requests');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleStatusChange = (returnId, value) => {
    setSelectedStatus(prev => ({ ...prev, [returnId]: value }));
  };

  const handleNoteChange = (returnId, value) => {
    setAdminNotes(prev => ({ ...prev, [returnId]: value }));
  };

  const updateStatus = async (returnId) => {
    try {
      await axios.patch(
        `http://localhost:5002/api/returns/${returnId}/status`,
        {
          status: selectedStatus[returnId],
          adminNote: adminNotes[returnId] || '',
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      fetchReturns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const markRefunded = async (returnId) => {
    try {
      await axios.patch(
        `http://localhost:5002/api/returns/${returnId}/refund`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      fetchReturns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as refunded');
    }
  };

  const markRestocked = async (returnId) => {
    try {
      await axios.patch(
        `http://localhost:5002/api/returns/${returnId}/restock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      fetchReturns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as restocked');
    }
  };

  const filteredReturns = returns.filter(returnReq => {
    // Filter by status
    if (filter !== 'all' && returnReq.status !== filter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        returnReq.user?.name?.toLowerCase().includes(searchLower) ||
        returnReq.user?.email?.toLowerCase().includes(searchLower) ||
        returnReq.order?._id?.toLowerCase().includes(searchLower) ||
        returnReq.reason.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-returns-container">
      <h1>Return Requests Management</h1>
      
      <div className="controls">
        <div className="filter-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Received">Received</option>
            <option value="Refunded">Refunded</option>
          </select>
          
          <input
            type="text"
            placeholder="Search returns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="returns-list">
        {filteredReturns.length === 0 ? (
          <p>No return requests found</p>
        ) : (
          filteredReturns.map(returnReq => (
            <div key={returnReq._id} className={`return-card status-${returnReq.status.toLowerCase()}`}>
              <div className="return-header">
                <h3>Return #{returnReq._id.slice(-6).toUpperCase()}</h3>
                <span className="status-badge">{returnReq.status}</span>
              </div>
              
              <div className="return-details">
                <div className="user-info">
                  <p><strong>User:</strong> {returnReq.user?.name} ({returnReq.user?.email})</p>
                  <p><strong>Order ID:</strong> {returnReq.order?._id}</p>
                  <p><strong>Request Date:</strong> {format(new Date(returnReq.createdAt), 'PPpp')}</p>
                </div>
                
                <div className="return-items">
                  <h4>Items to Return:</h4>
                  <ul>
                    {returnReq.items.map((item, index) => (
                      <li key={index}>
                        {item.qty}x {item.name} (${item.price ? item.price.toLocaleString() : "0"} each)
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="return-reason">
                  <p><strong>Reason:</strong> {returnReq.reason}</p>
                  {returnReq.description && (
                    <p><strong>Description:</strong> {returnReq.description}</p>
                  )}
                  <p><strong>Refund Amount (50%):</strong> ${(() => {
                    const paid = returnReq.order?.totalPrice || 0;
                    const discount = returnReq.order?.discountAmount || 0;
                    const refund = Math.max(0, (paid - discount) * 0.5);
                    return refund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  })()}</p>
                  <p><strong>Refund Amount (raw):</strong> ${returnReq.refundAmount ? returnReq.refundAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</p>
                </div>
                
                <div className="admin-actions">
                  <div className="status-update">
                    <select
                      value={selectedStatus[returnReq._id] || returnReq.status}
                      onChange={(e) => handleStatusChange(returnReq._id, e.target.value)}
                    >
                      {['Pending', 'Approved', 'Rejected', 'Received', 'Refunded'].map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => updateStatus(returnReq._id)}
                      disabled={selectedStatus[returnReq._id] === returnReq.status || !selectedStatus[returnReq._id]}
                    >
                      Update Status
                    </button>
                  </div>
                  
                  <div className="admin-notes">
                    <textarea
                      placeholder="Add admin note..."
                      value={adminNotes[returnReq._id] || returnReq.adminNote || ''}
                      onChange={(e) => handleNoteChange(returnReq._id, e.target.value)}
                    />
                  </div>
                  
                  <div className="action-buttons">
                    <button
                      onClick={() => markRefunded(returnReq._id)}
                      disabled={returnReq.isRefunded}
                      className={returnReq.isRefunded ? 'disabled' : ''}
                    >
                      {returnReq.isRefunded ? 'Refunded' : 'Mark as Refunded'}
                    </button>
                    <button
                      onClick={() => markRestocked(returnReq._id)}
                      disabled={returnReq.restocked}
                      className={returnReq.restocked ? 'disabled' : ''}
                    >
                      {returnReq.restocked ? 'Restocked' : 'Mark as Restocked'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReturnRequests;