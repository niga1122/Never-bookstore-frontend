import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = () => {
    usersAPI.getAll({ page, limit: 20 }).then(({ data }) => {
      setUsers(data.users);
      setTotalPages(data.pages);
    }).catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleRoleChange = async (id, role) => {
    try {
      await usersAPI.updateRole(id, role);
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleMembershipChange = async (id, membership) => {
    try {
      const expiry = membership !== 'none' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null;
      await usersAPI.updateMembership(id, { membership, membershipExpiry: expiry });
      fetchUsers();
    } catch (err) {
      alert('Failed to update membership');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await usersAPI.delete(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-users-page">
      <h1>Manage Users</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Membership</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <select value={user.membership} onChange={(e) => handleMembershipChange(user._id, e.target.value)}>
                  <option value="none">None</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user._id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={p === page ? 'active' : ''}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
