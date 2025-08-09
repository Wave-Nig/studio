
'use client';

import Link from 'next/link';
import Logo from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Gift, LogIn, LogOut } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthUser {
  uid: string;
  email: string | null;
  role: 'admin' | 'vendor' | 'consumer';
}

export default function Header() {
  const { state } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            const storedUserStr = localStorage.getItem('auth_user');
            if (storedUserStr) {
              const storedUser = JSON.parse(storedUserStr);
              // Prevent unnecessary state updates if user is already set
              if (user?.uid !== storedUser.uid) {
                setUser(storedUser);
              }
            }
        } else {
            if (user !== null) {
              setUser(null);
              localStorage.removeItem('auth_user');
            }
        }
    });

    return () => unsubscribe();
  }, [user]);


  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleLogout = async () => {
    await auth.signOut();
    // The onAuthStateChanged listener will handle setting user to null and clearing localStorage
    router.push('/');
    router.refresh(); // To ensure header state is updated
  }

  if (!isClient) {
    // Render a placeholder or loading state on the server
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Logo />
                <div className="ml-auto flex items-center gap-2">
                    {/* Skeleton or minimal UI */}
                </div>
            </div>
        </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'consumer' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/referral">
                    <Gift className="mr-2" /> Refer a Friend
                  </Link>
                </Button>
              )}
               <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard" aria-label="User Profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                 <LogOut className="mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login"><LogIn className="mr-2" />Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Shopping Cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </div>
            </Link>
          </Button>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
