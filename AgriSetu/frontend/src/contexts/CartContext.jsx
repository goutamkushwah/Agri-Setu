import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Clear cart when user changes or logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
    }
  }, [isAuthenticated]);

  // Load user-specific cart from localStorage when user logs in
  useEffect(() => {
    if (user && isAuthenticated) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          setItems(cartData);
        } catch (error) {
          console.error('Error loading saved cart:', error);
          setItems([]);
        }
      } else {
        setItems([]);
      }
    }
  }, [user, isAuthenticated]);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    }
  }, [items, user, isAuthenticated]);

  const addToCart = (item) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        toast.success('Quantity updated in cart');
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success('Added to cart');
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success('Removed from cart');
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    // Find the item to check stock limits
    const item = items.find(i => i.id === id);
    if (item && item.maxOrderQuantity && quantity > item.maxOrderQuantity) {
      toast.error(`Maximum order quantity is ${item.maxOrderQuantity}`);
      return;
    }
    
    if (item && item.minOrderQuantity && quantity < item.minOrderQuantity) {
      toast.error(`Minimum order quantity is ${item.minOrderQuantity}`);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
    
    toast.success('Quantity updated');
  };

  const clearCart = () => {
    setItems([]);
    if (user && isAuthenticated) {
      localStorage.removeItem(`cart_${user.id}`);
    }
    toast.success('Cart cleared');
  };

  const updateItemDetails = (id, updates) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
    toast.success('Item details updated');
  };

  const hasChanges = () => {
    // This could be enhanced to track if cart has been modified
    return items.length > 0;
  };

  const switchUserCart = (newUserId) => {
    // Clear current cart
    setItems([]);
    
    // Load new user's cart
    if (newUserId) {
      const savedCart = localStorage.getItem(`cart_${newUserId}`);
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          setItems(cartData);
        } catch (error) {
          console.error('Error loading user cart:', error);
          setItems([]);
        }
      }
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemDetails,
        clearCart,
        hasChanges,
        switchUserCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
