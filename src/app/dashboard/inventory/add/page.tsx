
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
import { categories, addProduct } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(1, 'Price must be a positive number'),
  category: z.string({ required_error: 'Please select a category.' }),
  image: z.string().min(1, 'Please upload an image.'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const handleImageChange = (file: File | null) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          toast({
              variant: 'destructive',
              title: 'File too large',
              description: 'Please upload an image smaller than 2MB.',
          });
          return;
      }
      if (!file.type.startsWith('image/')) {
           toast({
              variant: 'destructive',
              title: 'Invalid file type',
              description: 'Please upload a image file (jpg, png, gif).',
          });
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setValue('image', dataUrl, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    addProduct({
      ...data,
      id: `prod_${new Date().getTime()}`,
      status: 'pending',
      vendorId: 'vendor_01', // Mock vendor ID
    });
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
              <Label>Product Image</Label>
              <div
                className="mt-1 flex justify-center rounded-md border-2 border-dashed border-input px-6 pt-5 pb-6"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImageChange(e.dataTransfer.files[0]);
                }}
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative mx-auto h-40 w-40">
                      <Image src={imagePreview} alt="Image preview" fill objectFit="cover" className="rounded-md" />
                    </div>
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  )}
                  <div className="flex text-sm text-muted-foreground">
                    <Label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-background font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} accept="image/*" />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 2MB</p>
                </div>
              </div>
               {errors.image && (
                <p className="text-sm text-destructive mt-1">{errors.image.message}</p>
              )}
            </div>
            
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
                <Select onValueChange={(value) => setValue('category', value, { shouldValidate: true })}>
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
