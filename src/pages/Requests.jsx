import React, { useState, useEffect } from 'react';
import { requestsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Requests = ({ adminView }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [reason, setReason] = useState('');
  const [filter, setFilter] = useState('');

  const fetchRequests = () => {
    const params = {};
    if (filter) params.status = filter;
    requestsAPI.getAll(params).then(({ data }) => setRequests(data.requests)).catch(() => {});
  };

  useEffect(() => { fetchRequests(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestsAPI.create({ title, author, isbn, reason });
      setTitle('');
      setAuthor('');
      setIsbn('');
      setReason('');
      fetchRequests();
      alert('Book request submitted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const response = prompt('Admin response (optional):');
      await requestsAPI.updateStatus(id, { status, adminResponse: response || '' });
      fetchRequests();
    } catch (err) {
      alert('Failed to update request');
    }
  };

  return (
    <div className="requests-page">
      <h1>{adminView ? 'Book Requests (Admin)' : 'Request a Book'}</h1>

      {!adminView && (
        <form onSubmit={handleSubmit} className="request-form">
          <h2>Can't find a book? Let us know!</h2>
          <div className="form-group">
            <label>Book Title*</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
          </div>
          <button type="submit" className="btn-primary">Submit Request</button>
        </form>
      )}

      <div className="requests-list">
        <div className="filter-bar">
          <h2>All Requests</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {requests.length === 0 ? (
          <p className="text-muted">No requests found</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>User</th>
                <th>Status</th>
                <th>Response</th>
                {adminView && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.title}</td>
                  <td>{req.user?.name || 'N/A'}</td>
                  <td><span className={`status-badge ${req.status}`}>{req.status}</span></td>
                  <td>{req.adminResponse || '-'}</td>
                  {adminView && req.status === 'pending' && (
                    <td className="actions-cell">
                      <button onClick={() => handleStatus(req._id, 'approved')} className="btn-edit">Approve</button>
                      <button onClick={() => handleStatus(req._id, 'rejected')} className="btn-delete">Reject</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Requests;
