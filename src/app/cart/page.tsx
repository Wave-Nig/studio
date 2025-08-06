import CartView from '@/components/cart/cart-view';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <CartView />
        </CardContent>
      </Card>
    </div>
  );
}
