
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, Trash2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';

interface Notification {
    id: string;
    vendorId: string;
    title: string;
    message: string;
    createdAt: { seconds: number, nanoseconds: number };
    isRead: boolean;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const userStr = localStorage.getItem('auth_user');
        if (!userStr) {
            setError('Please log in to view your notifications.');
            setLoading(false);
            return;
        }

        const user = JSON.parse(userStr);
        if (!user || user.role !== 'vendor' || !user.uid) {
            setError('You do not have permission to view notifications.');
            setLoading(false);
            return;
        }

        const notificationsRef = collection(db, 'notifications');
        const q = query(
            notificationsRef, 
            where('vendorId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const vendorNotifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            setNotifications(vendorNotifications);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching notifications:", err);
            setError('Could not load notifications. Please try again later.');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const markAsRead = async (id: string) => {
        const notificationRef = doc(db, 'notifications', id);
        await updateDoc(notificationRef, { isRead: true });
    };

    const deleteNotification = async (id: string) => {
        const notificationRef = doc(db, 'notifications', id);
        await deleteDoc(notificationRef);
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-12">
       <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Notifications</h1>
            {!loading && !error && <p className="text-muted-foreground">You have {unreadCount} unread messages.</p>}
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Notifications about sales, approvals, and other events.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-16 text-muted-foreground">Loading notifications...</div>
                ) : error ? (
                    <div className="text-center py-16 text-destructive">{error}</div>
                ) : notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`flex items-start gap-4 p-4 rounded-lg border ${!notification.isRead ? 'bg-primary/5' : 'bg-transparent'}`}
                        >
                            <div className={`mt-1 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full ${!notification.isRead ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                <BellRing className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {!notification.isRead && (
                                     <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                                        <Check className="mr-2" />
                                        Mark as Read
                                     </Button>
                                )}
                                <Button size="icon" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-muted-foreground">
                        <Bell className="h-24 w-24" />
                        <h3 className="text-xl font-semibold">No notifications yet</h3>
                        <p>We'll let you know when there's something new.</p>
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
