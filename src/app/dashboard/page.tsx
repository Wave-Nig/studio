
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Wallet, Package, LogOut, Store, Shield, Bell, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthUser {
  uid: string;
  email: string;
  role: 'admin' | 'vendor' | 'consumer';
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user is found, redirect to login.
      // This prevents rendering a dashboard for a logged-out user.
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('auth_user');
    router.push('/');
  }

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <Skeleton className="h-9 w-48" />
                <Skeleton className="mt-2 h-5 w-64" />
              </div>
              <Skeleton className="h-10 w-28" />
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
             </div>
        </div>
    );
  }

  if (!user) {
    // This case handles the brief moment after loading but before redirection,
    // or if the user data is somehow invalid.
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.email}!
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Consumer-facing cards */}
        {(user.role === 'consumer') && (
            <>
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
                    <Button className="mt-4" asChild>
                     <Link href="/dashboard/orders">View Orders</Link>
                    </Button>
                </CardContent>
                </Card>
            </>
        )}
        
        {/* Vendor-facing card */}
        {(user.role === 'vendor' ) && (
            <Card className="border-primary/50 md:col-span-2 lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Vendor Tools
                </CardTitle>
                <CardDescription>
                Manage your products, sales, and notifications.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Button asChild>
                <Link href="/dashboard/inventory">Inventory</Link>
                </Button>
                <Button asChild variant="outline">
                <Link href="/dashboard/notifications">
                    <Bell className="mr-2" /> Notifications
                </Link>
                </Button>
                <Button asChild variant="outline" className="col-span-2">
                <Link href="/dashboard/analytics">
                    <BarChart3 className="mr-2" /> View Analytics
                </Link>
                </Button>
            </CardContent>
            </Card>
        )}


        {/* Admin-facing card */}
        {user.role === 'admin' && (
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
        )}
      </div>
    </div>
  );
}
