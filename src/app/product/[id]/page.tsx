
import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import AddToCartButton from './add-to-cart-button';

interface ProductPageProps {
  params: {
    id: string;
  };
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border">
          <div className="relative h-[500px] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
             <Badge variant="secondary">{product.category}</Badge>
            <h1 className="font-headline text-4xl font-bold">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>
          
          <p className="text-muted-foreground">
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <AddToCartButton product={product} />
          </div>

           <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Product Details</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><span className="font-medium text-foreground">Vendor:</span> {product.vendorId}</li>
                <li><span className="font-medium text-foreground">Status:</span> {product.status}</li>
                <li><span className="font-medium text-foreground">Product ID:</span> {product.id}</li>
              </ul>
           </div>

        </div>
      </div>
    </div>
  );
}
