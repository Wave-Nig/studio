
import type { Product } from '@/hooks/use-cart';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, getDoc } from 'firebase/firestore';


export const categories = [
  { id: '1', name: 'Food' },
  { id: '2', name: 'Groceries' },
  { id: '3', name: 'Electronics' },
];

export let products: Product[] = [];

export async function getProducts(options?: { category?: string; status?: 'pending' | 'approved' | 'rejected' }) {
    const productsCollection = collection(db, 'products');
    let q = query(productsCollection);

    if (options?.category && options.category !== 'All') {
        q = query(q, where('category', '==', options.category));
    }
    if (options?.status) {
        q = query(q, where('status', '==', options.status));
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
        return null;
    }
}


// This is a mock function to simulate adding a product to the database
export async function addProduct(product: Omit<Product, 'id'>) {
    const productsCollection = collection(db, 'products');
    const docRef = await addDoc(productsCollection, product);
    return docRef.id;
}

// This is a mock function to simulate updating a product in the database
export async function updateProductStatus(productId: string, status: 'approved' | 'rejected') {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, {
      status: status
  });
}
