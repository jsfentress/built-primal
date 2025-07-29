import { useState } from 'react';
import type { Product } from '@/lib/products';

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [buttonText, setButtonText] = useState('Add to Cart');

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // Dynamic import to avoid SSR issues
      const { addToCart } = await import('@/lib/cart');
      const updatedCart = addToCart(product);
      
      // Ensure the cart-updated event is fired
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: updatedCart }));
      
      setButtonText('Added to Cart!');
      setTimeout(() => {
        setButtonText('Add to Cart');
        setIsAdding(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setButtonText('Error - Try Again');
      setTimeout(() => {
        setButtonText('Add to Cart');
        setIsAdding(false);
      }, 2000);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="bg-accent text-background px-8 py-3 rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {buttonText}
    </button>
  );
}