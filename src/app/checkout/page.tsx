'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(10, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Checkout data:', data);
    toast({
      title: 'Order Placed!',
      description: "Thank you for your purchase. This is a simulation.",
    });
    dispatch({ type: 'CLEAR_CART' });
    router.push('/');
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold">
        Checkout
      </h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
            <CardDescription>
              Enter your details to complete the purchase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="address">Shipping Address</Label>
                <Input id="address" {...register('address')} />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register('city')} />
                  {errors.city && (
                    <p className="text-sm text-destructive">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register('country')} defaultValue="Nigeria"/>
                  {errors.country && (
                    <p className="text-sm text-destructive">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={state.items.length === 0}>
                Place Order (Simulated)
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                {state.items.length === 0 ? (
                    <p className="text-muted-foreground">Your cart is empty.</p>
                ) : (
                    <div className="space-y-4">
                        {state.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{item.quantity}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                </div>
                                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                         <div className="flex justify-between text-muted-foreground">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
