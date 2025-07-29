import { useEffect, useState } from 'react';
import type { Cart } from '@/lib/cart';

export default function CartView() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = async () => {
    try {
      const { getCart } = await import('@/lib/cart');
      setCart(getCart());
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const handleUpdateQuantity = async (productId: string, change: number) => {
    const item = cart.items.find(i => i.product.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    const { updateQuantity } = await import('@/lib/cart');
    setCart(updateQuantity(productId, newQuantity));
  };

  const handleRemove = async (productId: string) => {
    const { removeFromCart } = await import('@/lib/cart');
    setCart(removeFromCart(productId));
  };

  const handleCheckout = async () => {
    const { createCheckoutSession } = await import('@/lib/cart');
    const checkoutUrl = await createCheckoutSession(cart);
    
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      alert('Unable to create checkout session. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <a href="/store" className="inline-flex bg-accent text-background px-6 py-3 rounded-md font-medium hover:bg-accent/90 transition-colors">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-8">
        {cart.items.map(item => (
          <div key={item.product.id} className="flex items-center gap-4 bg-muted/20 p-4 rounded-lg">
            <div className="w-20 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
              {item.product.image ? (
                <img 
                  src={item.product.image} 
                  alt={item.product.title} 
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-xs text-muted-foreground">No image</span>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.title}</h3>
              <p className="text-muted-foreground">${item.product.price}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateQuantity(item.product.id, -1)}
                className="w-8 h-8 rounded border border-border hover:bg-muted transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.product.id, 1)}
                className="w-8 h-8 rounded border border-border hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
            
            <button
              onClick={() => handleRemove(item.product.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold text-accent">${cart.total}</span>
        </div>
        
        <div className="flex gap-4">
          <a href="/store" className="flex-1 border border-accent text-accent px-6 py-3 rounded-md font-medium hover:bg-accent hover:text-background transition-colors text-center">
            Continue Shopping
          </a>
          <button
            onClick={handleCheckout}
            className="flex-1 bg-accent text-background px-6 py-3 rounded-md font-medium hover:bg-accent/90 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}