
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Wallet, PlusCircle, MinusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Transaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
};

interface AuthUser {
  uid: string;
  email: string;
  role: 'admin' | 'vendor' | 'consumer';
  fullName: string;
}


export default function WalletPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [balance, setBalance] = useState(150000);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'credit', amount: 50000, description: 'Wallet Funded', date: '2023-10-26' },
    { id: 2, type: 'debit', amount: 15000, description: 'Purchase of Electric Kettle', date: '2023-10-25' },
    { id: 3, type: 'debit', amount: 25000, description: 'Purchase of Ankara Gown', date: '2023-10-24' },
    { id: 4, type: 'credit', amount: 100000, description: 'Wallet Funded', date: '2023-10-23' },
  ]);
  const [amount, setAmount] = useState('');


  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const handleFundWallet = () => {
    const fundAmount = parseFloat(amount);
    if (isNaN(fundAmount) || fundAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid positive number.' });
        return;
    }
    setBalance(prev => prev + fundAmount);
    setTransactions(prev => [{
        id: Date.now(),
        type: 'credit',
        amount: fundAmount,
        description: 'Wallet Funded',
        date: new Date().toISOString().split('T')[0],
    }, ...prev]);
    toast({ title: 'Success', description: `${formatPrice(fundAmount)} has been added to your wallet.` });
    setAmount('');
  }

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid positive number.' });
        return;
    }
    if (withdrawAmount > balance) {
        toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'You cannot withdraw more than your current balance.' });
        return;
    }

    setBalance(prev => prev - withdrawAmount);
    setTransactions(prev => [{
        id: Date.now(),
        type: 'debit',
        amount: withdrawAmount,
        description: 'Bank Withdrawal',
        date: new Date().toISOString().split('T')[0],
    }, ...prev]);
    toast({ title: 'Withdrawal Successful', description: `${formatPrice(withdrawAmount)} has been withdrawn from your wallet.` });
    setAmount('');
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }
  
  const isVendor = user?.role === 'vendor';

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-headline text-3xl font-bold">My Wallet</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatPrice(balance)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{tx.description}</p>
                                <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                            <p className={`font-semibold ${tx.type === 'credit' ? 'text-success' : 'text-destructive'}`}>
                                {tx.type === 'credit' ? '+' : '-'} {formatPrice(tx.amount)}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {isVendor ? (
            <Card>
                <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                    Transfer funds from your wallet to your bank account.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label htmlFor="withdraw-amount" className="text-sm font-medium">Amount (₦)</label>
                        <Input 
                            id="withdraw-amount" 
                            type="number" 
                            placeholder="e.g. 50000" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground pt-2">Bank account details will be confirmed on the next page.</p>
                    </div>
                </CardContent>
                <CardFooter>
                <Button className="w-full" onClick={handleWithdraw}>
                    <MinusCircle className="mr-2 h-4 w-4" />
                    Withdraw
                </Button>
                </CardFooter>
            </Card>
          ) : (
            <Card>
                <CardHeader>
                <CardTitle>Fund Wallet</CardTitle>
                <CardDescription>
                    Add money to your wallet to enjoy seamless checkout.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label htmlFor="fund-amount" className="text-sm font-medium">Amount (₦)</label>
                        <Input 
                            id="fund-amount" 
                            type="number" 
                            placeholder="e.g. 10000" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                <Button className="w-full" onClick={handleFundWallet}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Funds
                </Button>
                </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
