
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(1, 'Price must be a positive number'),
  category: z.string({ required_error: 'Please select a category.' }),
  image: z.string().url('Please enter a valid image URL'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductFormValues) => {
    // In a real app, this would submit the data to your backend
    // and the product would be added with a 'pending' status.
    console.log(data);
    toast({
      title: 'Product Submitted!',
      description: `"${data.name}" has been submitted for admin approval.`,
    });
    router.push('/dashboard/inventory');
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
       <div className="mb-4">
        <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/inventory">
                <ArrowLeft className="mr-2" />
                Back to Inventory
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Product</CardTitle>
          <CardDescription>
            Fill out the details below to submit a new product for approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Product Description</Label>
              <Textarea id="description" {...register('description')} />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="price">Price (NGN)</Label>
                <Input id="price" type="number" {...register('price')} />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="image">Product Image URL</Label>
              <Input id="image" {...register('image')} placeholder="https://placehold.co/600x600.png" />
                <p className="text-sm text-muted-foreground mt-1">For demo purposes, please use a placeholder URL.</p>
              {errors.image && (
                <p className="text-sm text-destructive">{errors.image.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2" />
              Submit for Approval
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
