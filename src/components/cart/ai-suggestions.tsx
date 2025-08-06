'use client';

import { useState, useTransition } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProductRecommendations, type ProductRecommendationsOutput } from '@/ai/flows/product-suggestions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wand2, Frown } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function AiSuggestions() {
  const { state } = useCart();
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<ProductRecommendationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = () => {
    startTransition(async () => {
      setError(null);
      setSuggestions(null);
      
      const cartItems = state.items.map(item => ({
        productId: item.id,
        productName: item.name,
        productDescription: item.description,
        productCategory: item.category,
      }));

      try {
        const result = await getProductRecommendations({ cartItems });
        setSuggestions(result);
      } catch (e) {
        setError("Sorry, we couldn't get AI suggestions at this time.");
        console.error(e);
      }
    });
  };

  return (
    <Card className="bg-background/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-lg">AI Suggestions</CardTitle>
        </div>
        <CardDescription>
          Based on your cart, you might also like these...
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions && (
          <div className="space-y-4">
             <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertTitle>Reasoning</AlertTitle>
              <AlertDescription>{suggestions.reasoning}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              {suggestions.recommendations.map((rec) => (
                <div key={rec.productId} className="rounded-md border p-3 text-sm">
                  <p className="font-semibold">{rec.productName}</p>
                  <p className="text-muted-foreground">{rec.productDescription}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {isPending && (
            <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        )}
        {error && (
            <Alert variant="destructive">
                <Frown className="h-4 w-4" />
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Button 
            onClick={handleGetSuggestions} 
            disabled={isPending || state.items.length === 0}
            className="w-full mt-4"
        >
            {isPending ? 'Thinking...' : 'Get AI Suggestions'}
        </Button>
      </CardContent>
    </Card>
  );
}
