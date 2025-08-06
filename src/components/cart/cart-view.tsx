'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CartItem from './cart-item';
import AiSuggestions from './ai-suggestions';
import { ShoppingCart } from 'lucide-react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};

export default function CartView() {
  const { state } = useCart();
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <ShoppingCart className="h-24 w-24 text-muted-foreground" />
        <h2 className="text-2xl font-semibold font-headline">Your cart is empty</h2>
        <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {state.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold font-headline">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-muted-foreground">Calculated at checkout</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
        <AiSuggestions />
      </div>
    </div>
  );
}
