
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
}
interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  shippingAddress: ShippingAddress;
  createdAt: Timestamp;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};

const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Date not available';
    return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (typeof window === 'undefined') return;
            const user = JSON.parse(localStorage.getItem('auth_user') || 'null');
            if (!user || !user.uid) {
                setError("Please log in to view your orders.");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const ordersRef = collection(db, 'orders');
                const q = query(
                    ordersRef, 
                    where('customerId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                
                const querySnapshot = await getDocs(q);
                const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(userOrders);
            } catch (err) {
                console.error("Error fetching orders: ", err);
                setError("Could not load your orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <h1 className="mb-8 font-headline text-3xl font-bold">My Order History</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
                    <CardDescription>Here's a list of all your past purchases.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-muted-foreground text-center py-8">Loading your orders...</p>
                    ) : error ? (
                        <p className="text-destructive text-center py-8">{error}</p>
                    ) : orders.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                           {orders.map(order => (
                             <AccordionItem key={order.id} value={order.id}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full pr-4 items-center">
                                        <div className="text-left">
                                            <p className="font-semibold">Order #{order.id.slice(0, 7)}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                        <span className="font-bold text-lg text-primary">{formatPrice(order.total)}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="p-4 bg-muted/50 rounded-md">
                                        <h4 className="font-semibold mb-2">Items</h4>
                                        <div className="space-y-2">
                                            {order.items.map(item => (
                                                <div key={item.productId} className="flex justify-between items-center text-sm">
                                                    <span>{item.name} (x{item.quantity})</span>
                                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator className="my-4" />
                                        <h4 className="font-semibold mb-2">Shipping To</h4>
                                        <div className="text-sm text-muted-foreground">
                                            <p>{order.shippingAddress.name}</p>
                                            <p>{order.shippingAddress.address}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                           ))}
                        </Accordion>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-muted-foreground">
                            <Package className="h-24 w-24" />
                            <h3 className="text-xl font-semibold">No orders yet</h3>
                            <p>You haven't placed any orders with us. Let's change that!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
