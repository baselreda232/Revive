import { useState } from 'react';
import { CartContext } from './cartStore';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  }, []);
  const [isAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const isLoading = false;

  const saveCartToLocalStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const getCartItemCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateTax = () => calculateSubtotal() * 0.14;

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity }];
    }

    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToLocalStorage([]);
  };

  const fetchCart = () => {
    // No-op for frontend-only cart
  };

  const value = {
    cartItems,
    isLoading,
    isAuthenticated,
    getCartItemCount,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
