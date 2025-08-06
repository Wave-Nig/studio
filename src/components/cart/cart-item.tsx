'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
  item: Product & { quantity: number };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};

export default function CartItem({ item }: CartItemProps) {
  const { dispatch } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    if (!isNaN(quantity)) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity } });
    }
  };

  const handleRemoveItem = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <Link href="#" className="font-semibold hover:underline">
          {item.name}
        </Link>
        <p className="text-sm text-muted-foreground">{item.category}</p>
        <p className="mt-2 font-bold text-primary">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="h-9 w-16 text-center"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemoveItem}
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
