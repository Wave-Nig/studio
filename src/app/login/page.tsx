
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/logo';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let user;

    // Simulate login
    if (email === 'wave.nig@gmail.com' && password === 'Israelite@11') {
      user = { email, role: 'admin' };
      toast({
        title: 'Admin Login Successful',
        description: 'Redirecting to admin dashboard...',
      });
      localStorage.setItem('auth_user', JSON.stringify(user));
      router.push('/dashboard/admin');

    } else if (email === 'vendor@wave.com' && password === 'password') {
      user = { email, role: 'vendor', vendorId: 'vendor_01' }; // Using a mock vendorId
      toast({
        title: 'Vendor Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      localStorage.setItem('auth_user', JSON.stringify(user));
      router.push('/dashboard/inventory');

    } else if (email === 'consumer@wave.com' && password === 'password') {
       user = { email, role: 'consumer' };
       toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      localStorage.setItem('auth_user', JSON.stringify(user));
      router.push('/');
    }
    else {
      toast({
        variant: 'destructive',
        title: 'Invalid Credentials',
        description: 'Please check your email and password and try again.',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account. <br />
            (Try consumer@wave.com, vendor@wave.com, or wave.nig@gmail.com with password 'password' or 'Israelite@11' for admin)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
