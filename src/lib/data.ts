
import type { Product } from '@/hooks/use-cart';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, getDoc, serverTimestamp } from 'firebase/firestore';


export const categories = [
  { id: '1', name: 'Food' },
  { id: '2', name: 'Groceries' },
  { id: '3', name: 'Electronics' },
  { id: '4', name: 'Fashion' },
];

export let products: Product[] = [];

export async function getProducts(options?: { category?: string; status?: 'pending' | 'approved' | 'rejected', vendorId?: string }) {
    const productsCollection = collection(db, 'products');
    let q = query(productsCollection);

    if (options?.category && options.category !== 'All') {
        q = query(q, where('category', '==', options.category));
    }
    if (options?.status) {
        q = query(q, where('status', '==', options.status));
    }
    if (options?.vendorId) {
        q = query(q, where('vendorId', '==', options.vendorId));
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return products;
}

export async function getProductById(id: string): Promise<Product | null> {
    const productRef = doc(db, 'products', id);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
        console.error(`No product found with id: ${id}`);
        return null;
    }
}


export async function addProduct(product: Omit<Product, 'id'>) {
    const productsCollection = collection(db, 'products');
    const docRef = await addDoc(productsCollection, product);
    return docRef.id;
}

export async function updateProductStatus(productId: string, status: 'approved' | 'rejected') {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, {
      status: status
  });
}


export async function createNotification(notification: { vendorId: string; title: string; message: string; }) {
    const notificationsCollection = collection(db, 'notifications');
    await addDoc(notificationsCollection, {
        ...notification,
        isRead: false,
        createdAt: serverTimestamp(),
    });
}

export async function createOrder(order: {
    customerId: string;
    items: any[];
    total: number;
    shippingAddress: object;
}) {
    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, {
        ...order,
        status: 'pending',
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

