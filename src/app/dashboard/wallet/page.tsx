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
import { Separator } from '@/components/ui/separator';
import { Wallet, PlusCircle } from 'lucide-react';

const transactions = [
  { id: 1, type: 'credit', amount: 50000, description: 'Wallet Funded', date: '2023-10-26' },
  { id: 2, type: 'debit', amount: 15000, description: 'Purchase of Electric Kettle', date: '2023-10-25' },
  { id: 3, type: 'debit', amount: 25000, description: 'Purchase of Ankara Gown', date: '2023-10-24' },
  { id: 4, type: 'credit', amount: 100000, description: 'Wallet Funded', date: '2023-10-23' },
];

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

export default function WalletPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-headline text-3xl font-bold">My Wallet</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
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
                                <p className="text-sm text-muted-foreground">{tx.date}</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">₦150,000.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fund Wallet</CardTitle>
              <CardDescription>
                Add money to your wallet to enjoy seamless checkout.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">Amount (₦)</label>
                    <Input id="amount" type="number" placeholder="e.g. 10000" />
                </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
