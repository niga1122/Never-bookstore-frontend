import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, requestsAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    ordersAPI.getAll().then(({ data }) => setOrders(data.orders)).catch(() => {});
    requestsAPI.getAll().then(({ data }) => setUserRequests(data.requests)).catch(() => {});
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user.name}</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Membership</h3>
          <p className="membership-badge">{user.membership || 'none'}</p>
          {user.membership === 'none' && (
            <p className="text-muted">No active membership</p>
          )}
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/books" className="btn-primary btn-sm">Browse Books</Link>
            <Link to="/requests" className="btn-secondary btn-sm">Request a Book</Link>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-muted">No orders yet</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order._id} className="order-item">
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="order-total">${order.totalAmount.toFixed(2)}</span>
                <span className={`order-status ${order.status}`}>{order.status}</span>
                <span className="order-items">{order.items.length} item(s)</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Your Requests</h2>
        {userRequests.length === 0 ? (
          <p className="text-muted">No book requests yet. <Link to="/requests">Request a book</Link></p>
        ) : (
          <div className="request-list">
            {userRequests.map((req) => (
              <div key={req._id} className="request-item">
                <span>{req.title}</span>
                <span className={`status-badge ${req.status}`}>{req.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
