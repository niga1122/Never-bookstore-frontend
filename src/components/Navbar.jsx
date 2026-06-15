import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Never Bookstore</Link>
        <ul className="navbar-links">
          <li><Link to="/books">Books</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li>
                <Link to="/cart" className="cart-link">
                  Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </Link>
              </li>
              {user.role === 'admin' && (
                <li className="dropdown">
                  <span className="dropbtn">Admin</span>
                  <div className="dropdown-content">
                    <Link to="/admin/books">Manage Books</Link>
                    <Link to="/admin/users">Manage Users</Link>
                    <Link to="/admin/requests">Book Requests</Link>
                  </div>
                </li>
              )}
              <li><button onClick={handleLogout} className="btn-logout">Logout ({user.name})</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
