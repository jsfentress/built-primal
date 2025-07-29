import productsData from '@/data/products.json';

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  stripe_payment_link: string;
  stripe_price_id: string;
  image: string;
  summary: string;
  description: string;
  features: string[];
  stock: number;
  category: 'equipment' | 'digital' | 'apparel';
}

export function getAllProducts(): Product[] {
  return productsData.products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return productsData.products.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return productsData.products.filter(p => p.category === category);
}

export function isInStock(product: Product): boolean {
  // -1 means unlimited stock (digital products)
  return product.stock === -1 || product.stock > 0;
}