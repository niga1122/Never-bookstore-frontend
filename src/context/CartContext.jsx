import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (book, type) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.book._id === book._id && i.type === type);
      if (existing) {
        return prev.map((i) =>
          i.book._id === book._id && i.type === type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { book, type, quantity: 1, price: type === 'rent' ? book.rentalPrice : book.price }];
    });
  };

  const removeItem = (bookId, type) => {
    setItems((prev) => prev.filter((i) => !(i.book._id === bookId && i.type === type)));
  };

  const updateQuantity = (bookId, type, quantity) => {
    if (quantity < 1) return removeItem(bookId, type);
    setItems((prev) =>
      prev.map((i) =>
        i.book._id === bookId && i.type === type ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};
