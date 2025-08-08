
'use client';

import { useState } from 'react';
import { products, categories } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const approvedProducts = products.filter(p => p.status === 'approved');

  const filteredProducts = approvedProducts
    .filter(product => {
      return selectedCategory === 'All' || product.category === selectedCategory;
    })
    .filter(product => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Welcome to <span className="text-primary">WAVE</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover a new wave of shopping. Quality products, unbeatable prices.
        </p>
      </section>

      <section>
        <div className="mb-8 space-y-4">
            <div className="relative mx-auto w-full max-w-lg">
                <Input 
                    placeholder="Search for products..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('All')}
                className="rounded-full"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.name)}
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-muted-foreground">
                <Search className="h-24 w-24" />
                <h3 className="text-xl font-semibold">No products found</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        )}
      </section>
    </div>
  );
}
