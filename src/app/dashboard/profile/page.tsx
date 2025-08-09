
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Save } from 'lucide-react';
import { updateUser } from '@/lib/data';


interface AuthUser {
  uid: string;
  email: string;
  role: 'admin' | 'vendor' | 'consumer';
  fullName: string;
  phone: string;
}

export default function ProfilePage() {
    const { toast } = useToast();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Add a placeholder for phone if it's missing
            if (!parsedUser.phone) {
                parsedUser.phone = '';
            }
            setUser(parsedUser);
        }
        setLoading(false);
    }, []);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setIsSaving(true);
        try {
            const userDataToUpdate = {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
            };
            await updateUser(user.uid, userDataToUpdate);
            
            // Update local storage as well
            localStorage.setItem('auth_user', JSON.stringify(user));

            toast({
                title: "Profile Updated",
                description: "Your information has been successfully saved.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: "There was a problem saving your profile. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const { id, value } = e.target;
        setUser({ ...user, [id]: value });
    };

    if (loading) {
        return (
             <div className="container mx-auto max-w-2xl px-4 py-12">
                <Skeleton className="h-9 w-48 mb-8" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
         return <div className="container mx-auto max-w-2xl px-4 py-12">Please log in to view your profile.</div>
    }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 font-headline text-3xl font-bold">My Profile</h1>
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                    Update your account details here. Email changes may require re-verification.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveChanges} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value={user.fullName || ''} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={user.email || ''} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" value={user.phone || ''} onChange={handleInputChange} placeholder="e.g. 08012345678" />
                        {/* We would add OTP verification logic here */}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSaving}>
                        {isSaving ? 'Saving...' : (
                            <>
                                <Save className="mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
