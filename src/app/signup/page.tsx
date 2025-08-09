
'use client';

import Link from 'next/link';
import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import Logo from '@/components/logo';
import { User, Store } from 'lucide-react';

export default function SignupPage() {
  const [isVendor, setIsVendor] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Join the WAVE and start your journey with us today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center gap-2 transition-colors ${!isVendor ? 'text-primary' : 'text-muted-foreground'}`}>
                  <User className="h-5 w-5" />
                  <Label htmlFor="role-switch">I'm a Consumer</Label>
                </div>
              </div>
              <Switch id="role-switch" checked={isVendor} onCheckedChange={setIsVendor} />
              <div className="flex items-center space-x-2">
                <div className={`flex items-center gap-2 transition-colors ${isVendor ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Store className="h-5 w-5" />
                  <Label htmlFor="role-switch">I'm a Vendor</Label>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full-name">First & Last Name</Label>
              <Input id="full-name" placeholder="Adebayo Adewale" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>

            {!isVendor && (
              <div className="grid gap-2">
                <Label htmlFor="referral-code">Referral Code (Optional)</Label>
                <Input id="referral-code" placeholder="Enter referral code" />
              </div>
            )}
            
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
