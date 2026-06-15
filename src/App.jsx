import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminBooks from './pages/AdminBooks';
import AdminUsers from './pages/AdminUsers';
import Requests from './pages/Requests';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/cart"
            element={<ProtectedRoute><Cart /></ProtectedRoute>}
          />
          <Route
            path="/requests"
            element={<ProtectedRoute><Requests /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/books"
            element={<ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>}
          />
          <Route
            path="/admin/requests"
            element={<ProtectedRoute adminOnly><AdminRequests /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      </CartProvider>
    </AuthProvider>
  );
};

const AdminRequests = () => {
  return <Requests adminView />;
};

export default App;
