
'use client';

import { useState } from 'react';
import { products, categories } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const approvedProducts = products.filter(p => p.status === 'approved');

  const filteredProducts =
    selectedCategory === 'All'
      ? approvedProducts
      : approvedProducts.filter((p) => p.category === selectedCategory);

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
        <div className="mb-8 flex flex-wrap justify-center gap-2">
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
