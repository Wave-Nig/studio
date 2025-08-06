'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Gift, Copy } from 'lucide-react';

export default function ReferralPage() {
  const referralCode = 'WAVE-FRIEND-2024';
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard.',
    });
  };

  return (
    <div className="container mx-auto flex max-w-2xl items-center justify-center p-4 py-24">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-8 w-8" />
          </div>
          <CardTitle className="mt-4 font-headline text-3xl">
            Refer a Friend
          </CardTitle>
          <CardDescription>
            Share your referral code and get rewards when your friends make their first purchase!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm text-muted-foreground">Your unique referral code</p>
          <div className="flex items-center space-x-2">
            <Input
              value={referralCode}
              readOnly
              className="text-center text-lg font-mono tracking-widest"
            />
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy code</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
