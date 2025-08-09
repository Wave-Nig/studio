
import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProductView from './product-view';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // Fetch all products with status 'approved' to generate static pages for them.
  const products = await getProducts({ status: 'approved' });
  
  // If no products are found, return an empty array.
  if (!products || products.length === 0) {
    return [];
  }

  // Map the product IDs into the format Next.js expects for params.
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}
