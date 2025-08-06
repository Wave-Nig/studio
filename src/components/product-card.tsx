'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart, type Product } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product['data-ai-hint']}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-2 text-lg font-headline">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-bold text-primary">
          {formatPrice(product.price)}
        </p>
        <Button size="sm" onClick={() => addItem(product)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
