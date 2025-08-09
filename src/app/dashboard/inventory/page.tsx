
'use client';

import { useEffect, useState } from 'react';
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
import { getProducts } from '@/lib/data';
import type { Product } from '@/hooks/use-cart';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};

export default function InventoryPage() {
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      // This logic now runs only on the client
      const userStr = localStorage.getItem('auth_user');
      if (!userStr) {
        setError('You are not logged in. Please log in to see your inventory.');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      if (!user || user.role !== 'vendor' || !user.uid) {
        setError('You do not have permission to view this page.');
        setLoading(false);
        return;
      }

      try {
        const products = await getProducts({ vendorId: user.uid });
        setVendorProducts(products);
      } catch (e) {
        console.error(e);
        setError('Failed to load your products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Inventory Management</h1>
        <Button asChild>
          <Link href="/dashboard/inventory/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
          <CardDescription>
            Here is a list of products you are currently selling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                        Loading your products...
                    </TableCell>
                </TableRow>
              ) : error ? (
                 <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-destructive">
                        {error}
                    </TableCell>
                </TableRow>
              ) : vendorProducts.length > 0 ? (
                vendorProducts.map((product) => (
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
                    <TableCell>
                        <Badge variant={
                            product.status === 'approved' ? 'default' 
                            : product.status === 'rejected' ? 'destructive'
                            : 'secondary'
                        }>
                            {product.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        {product.category}
                    </TableCell>
                    <TableCell>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                        You have not added any products yet.
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
