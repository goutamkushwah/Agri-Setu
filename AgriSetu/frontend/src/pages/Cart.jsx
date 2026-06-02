import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, hasChanges } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quantityInputs, setQuantityInputs] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleQuantityChange = (id, value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) return;
    
    setQuantityInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleQuantitySubmit = (id, value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      // Reset to current quantity
      const currentItem = items.find(item => item.id === id);
      setQuantityInputs(prev => ({ ...prev, [id]: currentItem.quantity }));
      return;
    }
    
    updateQuantity(id, numValue);
    setQuantityInputs(prev => ({ ...prev, [id]: numValue }));
  };

  const handleQuantityBlur = (id) => {
    const value = quantityInputs[id];
    if (value !== undefined) {
      handleQuantitySubmit(id, value);
    }
  };

  const handleQuantityKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleQuantitySubmit(id, quantityInputs[id]);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some fresh products to get started</p>
          <Button onClick={() => navigate('/')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            {isAuthenticated && user && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Cart for {user.first_name || user.email}</span>
              </div>
            )}
          </div>
          {hasChanges() && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Cart has items</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{item.price} / {item.unit}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= (item.minOrderQuantity || 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min={item.minOrderQuantity || 1}
                          max={item.maxOrderQuantity || 999}
                          value={quantityInputs[item.id] !== undefined ? quantityInputs[item.id] : item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          onBlur={() => handleQuantityBlur(item.id)}
                          onKeyPress={(e) => handleQuantityKeyPress(e, item.id)}
                          className="w-16 text-center"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.maxOrderQuantity && item.quantity >= item.maxOrderQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {(item.minOrderQuantity || item.maxOrderQuantity) && (
                        <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground">
                          <AlertCircle className="h-3 w-3" />
                          <span>
                            {item.minOrderQuantity && `Min: ${item.minOrderQuantity}`}
                            {item.minOrderQuantity && item.maxOrderQuantity && ' • '}
                            {item.maxOrderQuantity && `Max: ${item.maxOrderQuantity}`}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="mt-2 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
