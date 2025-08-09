
'use client';

import { Button } from '@/components/ui/button';
import { useCart, type Product } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product;
    disabled?: boolean;
}

export default function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
    const { addItem } = useCart();
    
    return (
        <Button size="lg" onClick={() => addItem(product)} disabled={disabled}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
        </Button>
    )
}
