
import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProductView from './product-view';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // Since Firestore queries require async operations, we fetch the products here.
  // In a larger app, you might want to cache this or find a more efficient way.
  const products = await getProducts({ status: 'approved' });
  
  if (!products) {
    return [];
  }

  // Generate a param for each product ID
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
