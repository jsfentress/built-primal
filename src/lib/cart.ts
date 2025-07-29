import type { Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

const CART_STORAGE_KEY = 'built-primal-cart';

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const cart = JSON.parse(stored);
      return calculateCartTotal(cart);
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }

  return { items: [], total: 0 };
}

export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

export function addToCart(product: Product, quantity: number = 1): Cart {
  const cart = getCart();
  
  const existingItem = cart.items.find(item => item.product.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product, quantity });
  }
  
  const updatedCart = calculateCartTotal(cart);
  saveCart(updatedCart);
  return updatedCart;
}

export function removeFromCart(productId: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.product.id !== productId);
  
  const updatedCart = calculateCartTotal(cart);
  saveCart(updatedCart);
  return updatedCart;
}

export function updateQuantity(productId: string, quantity: number): Cart {
  const cart = getCart();
  const item = cart.items.find(item => item.product.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
  }
  
  const updatedCart = calculateCartTotal(cart);
  saveCart(updatedCart);
  return updatedCart;
}

export function clearCart(): Cart {
  const emptyCart: Cart = { items: [], total: 0 };
  saveCart(emptyCart);
  return emptyCart;
}

export function getCartItemCount(): number {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateCartTotal(cart: Cart): Cart {
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);
  
  return { ...cart, total };
}

// Create a Stripe checkout session with multiple items
export async function createCheckoutSession(cart: Cart): Promise<string | null> {
  // Since we're using Payment Links, we'll need to handle multiple products differently
  // For now, we'll redirect to individual payment links
  // In a full implementation, you'd create a dynamic checkout session
  
  if (cart.items.length === 0) {
    console.error('Cart is empty');
    return null;
  }
  
  // For simplicity with Payment Links, we'll handle single product checkout
  // For multiple products, you'd need the full Stripe Checkout API
  if (cart.items.length === 1) {
    const item = cart.items[0];
    const paymentLink = item.product.stripe_payment_link;
    
    // You can append quantity as a parameter if your payment link supports it
    // Most payment links support ?quantity=N
    return `${paymentLink}?quantity=${item.quantity}`;
  }
  
  // For multiple items, you'd need a server endpoint to create a checkout session
  console.warn('Multiple product checkout requires server-side implementation');
  return null;
}