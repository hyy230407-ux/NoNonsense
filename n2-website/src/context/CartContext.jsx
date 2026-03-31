import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCustomizationMeal, setActiveCustomizationMeal] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('n2-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('n2-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCustomizationModal = (meal) => {
    setActiveCustomizationMeal(meal);
  };

  const closeCustomizationModal = () => {
    setActiveCustomizationMeal(null);
  };

  const addToCart = (product) => {
    const qtyToAdd = product.quantity || 1;
    setCartItems((prevItems) => {
      // Create a unique key based on id and customizations
      const customKey = product.id + (product.customizations ? JSON.stringify(product.customizations) : '');
      
      const existingItem = prevItems.find((item) => item.cartId === customKey);
      if (existingItem) {
        return prevItems.map((item) =>
          item.cartId === customKey ? { ...item, quantity: item.quantity + qtyToAdd } : item
        );
      }
      return [...prevItems, { ...product, cartId: customKey, quantity: qtyToAdd }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartId === cartId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', '')) || 0;
    return total + price * item.quantity;
  }, 0).toFixed(2);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        activeCustomizationMeal,
        openCustomizationModal,
        closeCustomizationModal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

