
import type { Product } from '@/hooks/use-cart';

export const categories = [
  { id: '1', name: 'Food' },
  { id: '2', name: 'Groceries' },
  { id: '3', name: 'Electronics' },
];

export let products: Product[] = [
  {
    id: 'prod_001',
    name: 'Infinix Smart 8',
    description: '6.6" HD+ Display, 4GB RAM, 64GB ROM, 5000mAh Battery',
    price: 185000,
    image: 'https://placehold.co/600x600.png',
    category: 'Electronics',
    status: 'approved',
    'data-ai-hint': 'smartphone electronics',
    vendorId: 'vendor_01',
  },
  {
    id: 'prod_002',
    name: 'Oraimo FreePods 4',
    description: 'Active Noise Cancellation, 35.5-hr long playtime',
    price: 35000,
    image: 'https://placehold.co/600x600.png',
    category: 'Electronics',
    status: 'approved',
    'data-ai-hint': 'wireless earbuds',
    vendorId: 'vendor_01',
  },
  {
    id: 'prod_003',
    name: 'Classic Ankara Gown',
    description: '100% cotton, vibrant patterns, available in all sizes.',
    price: 25000,
    image: 'https://placehold.co/600x600.png',
    category: 'Groceries',
    status: 'approved',
    'data-ai-hint': 'african dress',
    vendorId: 'vendor_02',
  },
  {
    id: 'prod_004',
    name: 'Leather Handbag',
    description: 'Genuine leather, spacious interior, with a timeless design.',
    price: 45000,
    image: 'https://placehold.co/600x600.png',
    category: 'Groceries',
    status: 'approved',
    'data-ai-hint': 'leather handbag',
    vendorId: 'vendor_02',
  },
  {
    id: 'prod_005',
    name: '6-Piece Non-Stick Pot Set',
    description: 'Durable, easy to clean, and perfect for modern kitchens.',
    price: 60000,
    image: 'https://placehold.co/600x600.png',
    category: 'Groceries',
    status: 'approved',
    'data-ai-hint': 'cooking pots',
    vendorId: 'vendor_01',
  },
  {
    id: 'prod_006',
    name: 'Electric Kettle',
    description: '1.8L capacity, stainless steel, with auto-shutoff feature.',
    price: 15000,
    image: 'https://placehold.co/600x600.png',
    category: 'Electronics',
    status: 'approved',
    'data-ai-hint': 'electric kettle',
    vendorId: 'vendor_01',
  },
  {
    id: 'prod_007',
    name: 'Golden Morn Cereal',
    description: '500g pack of nutritious maize and soya cereal.',
    price: 2500,
    image: 'https://placehold.co/600x600.png',
    category: 'Food',
    status: 'approved',
    'data-ai-hint': 'cereal box',
    vendorId: 'vendor_02',
  },
  {
    id: 'prod_008',
    name: 'Indomie Instant Noodles (Carton)',
    description: 'Carton of 40 packs of Onion Chicken flavor instant noodles.',
    price: 8000,
    image: 'https://placehold.co/600x600.png',
    category: 'Food',
    status: 'approved',
    'data-ai-hint': 'instant noodles',
    vendorId: 'vendor_02',
  },
  {
    id: 'prod_009',
    name: 'Designer Sunglasses',
    description: 'UV400 protection, stylish and modern design.',
    price: 22000,
    image: 'https://placehold.co/600x600.png',
    category: 'Groceries',
    status: 'pending',
    'data-ai-hint': 'sunglasses fashion',
    vendorId: 'vendor_01',
  },
  {
    id: 'prod_010',
    name: 'Smart Watch',
    description: 'Fitness tracking, heart rate monitor, long battery life.',
    price: 75000,
    image: 'https://placehold.co/600x600.png',
    category: 'Electronics',
    status: 'pending',
    'data-ai-hint': 'smart watch',
    vendorId: 'vendor_02',
  },
];

// This is a mock function to simulate adding a product to the database
export function addProduct(product: Product) {
  products.unshift(product);
}

// This is a mock function to simulate updating a product in the database
export function updateProductStatus(productId: string, status: 'approved' | 'rejected') {
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    products[productIndex].status = status;
  }
}
