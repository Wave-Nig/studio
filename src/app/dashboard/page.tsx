
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Wallet, Package, LogOut, Store, Shield } from 'lucide-react';

export default function DashboardPage() {
  // In a real app, you'd have logic to determine the user's role.
  const userRole = 'admin'; // or 'vendor' or 'consumer'

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your overview.
          </p>
        </div>
        <Button variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              My Wallet
            </CardTitle>
            <CardDescription>
              View your balance and transaction history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₦150,000.00</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/wallet">Manage Wallet</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              My Orders
            </CardTitle>
            <CardDescription>
              Track your recent orders and view purchase history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You have 3 active orders.</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="#">View Orders</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* This card would be shown for vendors */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Vendor Tools
            </CardTitle>
            <CardDescription>
              Manage your products and view sales.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">Access your vendor profile to manage products.</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/inventory">Manage Inventory</Link>
            </Button>
          </CardContent>
        </Card>

        {/* This card would be shown for Admins */}
        <Card className="border-primary border-2 col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Admin Panel
            </CardTitle>
            <CardDescription>
              Review and approve vendor submissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">You have access to administrative tools.</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/admin">Go to Admin Panel</Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
