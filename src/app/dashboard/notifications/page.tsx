
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
import { Bell, BellRing, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    vendorId: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
}

// In a real app, you would fetch notifications for the currently logged-in vendor.
// For this simulation, we'll assume the vendor ID is 'vendor_01' and filter from localStorage.
const MOCK_VENDOR_ID = 'vendor_01';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const allNotifications = JSON.parse(localStorage.getItem('vendor_notifications') || '[]');
            const vendorNotifications = allNotifications.filter((n: Notification) => n.vendorId === MOCK_VENDOR_ID);
            setNotifications(vendorNotifications);
        }
    }, []);

    const markAsRead = (id: string) => {
        const updatedNotifications = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
        setNotifications(updatedNotifications);
        // Also update localStorage
         if (typeof window !== 'undefined') {
            const allNotifications = JSON.parse(localStorage.getItem('vendor_notifications') || '[]');
            const otherNotifications = allNotifications.filter((n: Notification) => n.vendorId !== MOCK_VENDOR_ID || n.id !== id);
            const thisNotification = allNotifications.find((n: Notification) => n.id === id);
            if(thisNotification) {
                localStorage.setItem('vendor_notifications', JSON.stringify([{...thisNotification, isRead: true},...otherNotifications]));
            }
        }
    };

    const deleteNotification = (id: string) => {
        const updatedNotifications = notifications.filter(n => n.id !== id);
        setNotifications(updatedNotifications);
        // Also update localStorage
        if (typeof window !== 'undefined') {
            const allNotifications = JSON.parse(localStorage.getItem('vendor_notifications') || '[]');
            const remainingNotifications = allNotifications.filter((n: Notification) => n.id !== id);
            localStorage.setItem('vendor_notifications', JSON.stringify(remainingNotifications));
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-12">
       <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">You have {unreadCount} unread messages.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Notifications about sales and other events.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {notifications.length > 0 ? (
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
                                    {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {!notification.isRead && (
                                     <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
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
