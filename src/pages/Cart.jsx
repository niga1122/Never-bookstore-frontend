import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { getThumbCover } from '../utils/covers';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalAmount, totalItems } = useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const orderItems = items.map((i) => ({
        bookId: i.book._id,
        type: i.type,
        quantity: i.quantity,
      }));
      await ordersAPI.create({ items: orderItems });
      clearCart();
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    } else {
      clearCart();
      setConfirmClear(false);
    }
  };

  const deliveryFee = totalAmount > 50 ? 0 : 4.99;
  const grandTotal = totalAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="cart-empty">
          <div className="cart-empty-icon">&#128722;</div>
          <p>Your cart is empty.</p>
          <p className="text-muted">Browse our collection and add books you love!</p>
          <div className="cart-empty-actions">
            <Link to="/books" className="btn-primary">Browse Books</Link>
            <Link to="/" className="btn-secondary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="cart-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-items">
        {items.map((item) => (
          <div key={`${item.book._id}-${item.type}`} className="cart-item">
            <img
              src={getThumbCover(item.book.title)}
              alt={item.book.title}
              className="cart-item-img"
              loading="lazy"
            />
            <div className="cart-item-info">
              <Link to={`/books/${item.book._id}`} className="cart-item-title">{item.book.title}</Link>
              <span className="cart-item-author">{item.book.author}</span>
              <span className={`cart-item-type ${item.type}`}>{item.type === 'rent' ? 'Rental (14 days)' : 'Purchase'}</span>
            </div>
            <div className="cart-item-qty">
              <button onClick={() => updateQuantity(item.book._id, item.type, item.quantity - 1)} className="qty-btn" aria-label="Decrease quantity">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.book._id, item.type, item.quantity + 1)} className="qty-btn" aria-label="Increase quantity">+</button>
            </div>
            <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
            <button onClick={() => removeItem(item.book._id, item.type)} className="cart-item-remove" aria-label="Remove item">&times;</button>
          </div>
        ))}
      </div>

      <div className="cart-bottom">
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? <span className="free-delivery">FREE</span> : `$${deliveryFee.toFixed(2)}`}</span>
          </div>
          {deliveryFee > 0 && (
            <p className="delivery-hint">Add ${(50 - totalAmount).toFixed(2)} more for free delivery</p>
          )}
          <div className="cart-total-row">
            <span>Total</span>
            <span className="cart-total-amount">${grandTotal.toFixed(2)}</span>
          </div>
          <div className="cart-actions">
            <button onClick={handleCheckout} className="btn-primary btn-full" disabled={checkingOut}>
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <button onClick={handleClear} className="btn-secondary btn-full">
              {confirmClear ? 'Confirm Clear?' : 'Clear Cart'}
            </button>
          </div>
          <Link to="/books" className="continue-shopping">&larr; Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
