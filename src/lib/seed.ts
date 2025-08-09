
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import type { Product } from '../hooks/use-cart';

// IMPORTANT: This configuration is for the seed script only and should not be used in the browser.
// The main app uses a different initialization method.
const firebaseConfig = {
  projectId: 'wave-uy47e',
  appId: '1:476248459862:web:5e27ed142fe7d1b8c8c9f7',
  storageBucket: 'wave-uy47e.firebasestorage.app',
  apiKey: 'AIzaSyCRGP7hrppWoip5_g5WGr-8KvV2Xa1G8VQ',
  authDomain: 'wave-uy47e.firebaseapp.com',
  messagingSenderId: '476248459862',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts: Omit<Product, 'id'>[] = [
    {
      name: 'Electric Kettle',
      description: 'A high-quality stainless steel electric kettle, perfect for boiling water quickly.',
      price: 15000,
      image: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'electric kettle',
      category: 'Electronics',
      stock: 25,
      status: 'approved',
      vendorId: 'vendor_01',
    },
    {
      name: 'Ankara Gown',
      description: 'A beautiful and vibrant Ankara print gown, suitable for all occasions.',
      price: 25000,
      image: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'ankara gown',
      category: 'Fashion',
      stock: 10,
      status: 'approved',
      vendorId: 'vendor_01',
    },
    {
      name: 'Golden Morn Cereal',
      description: 'A nutritious and delicious maize cereal to start your day right.',
      price: 3500,
      image: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'cereal box',
      category: 'Groceries',
      stock: 50,
      status: 'approved',
      vendorId: 'vendor_02',
    },
    {
      name: 'Bluetooth Speaker',
      description: 'A portable Bluetooth speaker with excellent sound quality and long battery life.',
      price: 22000,
      image: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'bluetooth speaker',
      category: 'Electronics',
      stock: 15,
      status: 'pending',
      vendorId: 'vendor_02',
    },
    {
      name: 'Classic Leather Wallet',
      description: 'A stylish and durable leather wallet with multiple compartments.',
      price: 8000,
      image: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'leather wallet',
      category: 'Fashion',
      stock: 30,
      status: 'approved',
      vendorId: 'vendor_01',
    },
    {
      name: 'Organic Honey',
      description: 'Pure, unprocessed organic honey sourced from local farms.',
      price: 5500,
      image: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'honey jar',
      category: 'Groceries',
      stock: 40,
      status: 'approved',
      vendorId: 'vendor_03',
    },
];

async function seedDatabase() {
  const productsCollection = collection(db, 'products');
  console.log('Clearing existing products...');
  const q = query(productsCollection);
  const querySnapshot = await getDocs(q);
  for (const docSnapshot of querySnapshot.docs) {
    await deleteDoc(doc(db, 'products', docSnapshot.id));
  }
  console.log('Existing products cleared.');

  console.log('Seeding new products...');
  for (const product of sampleProducts) {
    try {
      await addDoc(productsCollection, product);
      console.log(`Added product: ${product.name}`);
    } catch (error) {
      console.error(`Error adding product ${product.name}:`, error);
    }
  }
  console.log('Database seeding complete.');
}

seedDatabase().then(() => {
    // Manually exit the process because the Firestore client keeps the connection open.
    process.exit(0);
}).catch(error => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
