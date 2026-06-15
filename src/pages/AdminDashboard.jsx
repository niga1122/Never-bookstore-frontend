import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-grid">
        <Link to="/admin/books" className="admin-card">
          <h3>Manage Books</h3>
          <p>Add, edit, or remove books from the store</p>
        </Link>
        <Link to="/admin/users" className="admin-card">
          <h3>Manage Users</h3>
          <p>View and manage user accounts and memberships</p>
        </Link>
        <Link to="/admin/requests" className="admin-card">
          <h3>Book Requests</h3>
          <p>Review and respond to book requests from users</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
