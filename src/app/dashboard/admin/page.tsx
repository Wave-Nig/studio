
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getProducts, updateProductStatus } from '@/lib/data';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/hooks/use-cart';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

export default function AdminPage() {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    setLoading(true);
    const products = await getProducts({ status: 'pending' });
    setPendingProducts(products);
    setLoading(false);
  }

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleApproval = async (productId: string, newStatus: 'approved' | 'rejected') => {
    const productName = pendingProducts.find(p => p.id === productId)?.name;
    await updateProductStatus(productId, newStatus);
    setPendingProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    toast({
        title: `Product ${newStatus}`,
        description: `${productName} has been ${newStatus}.`,
    });
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Admin Approval</h1>
        <p className="text-muted-foreground">Review vendor submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Products</CardTitle>
          <CardDescription>
            These products are awaiting your approval before they go live.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                       Loading pending products...
                    </TableCell>
                </TableRow>
              ) : pendingProducts.length > 0 ? (
                pendingProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt={product.name}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={product.image}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-success-foreground bg-success hover:bg-success/90"
                                onClick={() => handleApproval(product.id, 'approved')}
                            >
                                <CheckCircle className="mr-2" />
                                Approve
                            </Button>
                            <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleApproval(product.id, 'rejected')}
                            >
                                <XCircle className="mr-2" />
                                Reject
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))
               ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No pending products to review.
                    </TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
