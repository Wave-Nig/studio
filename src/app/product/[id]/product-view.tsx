
'use client';

import type { Product } from '@/hooks/use-cart';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import AddToCartButton from './add-to-cart-button';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
};

export default function ProductView({ product }: { product: Product }) {
  const stockStatus = product.stock 
    ? product.stock > 0 
        ? product.stock > 5 
            ? 'In Stock' 
            : `Only ${product.stock} left!`
        : 'Out of Stock'
    : 'Not Managed';

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
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold text-primary">
                {formatPrice(product.price)}
              </p>
              <Badge variant={product.stock && product.stock > 0 ? 'default' : 'destructive'}>
                {stockStatus}
              </Badge>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <AddToCartButton product={product} disabled={product.stock === 0} />
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
