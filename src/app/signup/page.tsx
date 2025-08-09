
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function SignupPage() {
  const [isVendor, setIsVendor] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password too weak',
        description: 'Password should be at least 6 characters.',
      });
      return;
    }
    setIsLoading(true);

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create user document in Firestore
      const userRole = isVendor ? 'vendor' : 'consumer';
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        role: userRole,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: 'Account Created!',
        description: "You've successfully signed up. Please log in.",
      });
      router.push('/login');

    } catch (error: any) {
        console.error("Signup Error:", error);
        toast({
            variant: 'destructive',
            title: 'Sign-up Failed',
            description: error.code === 'auth/email-already-in-use' 
                ? 'This email is already registered.'
                : 'An unexpected error occurred. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center gap-2 transition-colors ${!isVendor ? 'text-primary' : 'text-muted-foreground'}`}>
                  <User className="h-5 w-5" />
                  <Label htmlFor="role-switch">I'm a Consumer</Label>
                </div>
              </div>
              <Switch id="role-switch" checked={isVendor} onCheckedChange={setIsVendor} disabled={isLoading} />
              <div className="flex items-center space-x-2">
                <div className={`flex items-center gap-2 transition-colors ${isVendor ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Store className="h-5 w-5" />
                  <Label htmlFor="role-switch">I'm a Vendor</Label>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input 
                id="full-name" 
                placeholder="First & Last Name" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {!isVendor && (
              <div className="grid gap-2">
                <Label htmlFor="referral-code">Referral Code (Optional)</Label>
                <Input 
                    id="referral-code" 
                    placeholder="Enter referral code" 
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    disabled={isLoading}
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create an account'}
            </Button>
          </form>
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
