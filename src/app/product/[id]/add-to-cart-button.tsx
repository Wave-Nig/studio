
'use client';

import { Button } from '@/components/ui/button';
import { useCart, type Product } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();
    
    return (
        <Button size="lg" onClick={() => addItem(product)}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
        </Button>
    )
}
