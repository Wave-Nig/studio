
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

export default function Header() {
  const { state } = useCart();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      setIsLoggedIn(!!token);
    }
  }, []);


  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-auto flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/referral">
                  <Gift className="mr-2" /> Refer a Friend
                </Link>
              </Button>
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
