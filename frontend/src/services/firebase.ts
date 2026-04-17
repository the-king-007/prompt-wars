import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const firebaseAuth = {
  signIn: async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },
  signUp: async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  },
  signOut: async () => {
    await signOut(auth);
  },
  onAuthChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
  getCurrentUser: () => auth.currentUser
};

export const firebaseDb = {
  users: {
    create: async (uid: string, data: Record<string, unknown>) => {
      await setDoc(doc(db, 'users', uid), { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    },
    get: async (uid: string) => {
      const docSnap = await getDoc(doc(db, 'users', uid));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    update: async (uid: string, data: Record<string, unknown>) => {
      await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: Timestamp.now() });
    }
  },
  tickets: {
    validate: async (qrCode: string) => {
      const q = query(collection(db, 'tickets'), where('qrCode', '==', qrCode));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },
    getByUser: async (userId: string) => {
      const q = query(collection(db, 'tickets'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },
  orders: {
    create: async (orderId: string, data: Record<string, unknown>) => {
      await setDoc(doc(db, 'orders', orderId), { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    },
    getByUser: async (userId: string) => {
      const q = query(collection(db, 'orders',), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    getPending: async () => {
      const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    updateStatus: async (orderId: string, status: string) => {
      await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: Timestamp.now() });
    }
  },
  crowdData: {
    subscribe: (eventId: string, callback: (data: unknown[]) => void) => {
      const q = query(collection(db, 'crowd_data'), where('eventId', '==', eventId), orderBy('timestamp', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      });
    }
  },
  demandData: {
    subscribe: (eventId: string, callback: (data: unknown[]) => void) => {
      const q = query(collection(db, 'demand_data'), where('eventId', '==', eventId), orderBy('timestamp', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      });
    }
  },
  vendors: {
    getAll: async () => {
      const snapshot = await getDocs(collection(db, 'vendors'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    updateLocation: async (vendorId: string, lat: number, lng: number) => {
      await updateDoc(doc(db, 'vendors', vendorId), { location: { lat, lng, timestamp: Timestamp.now() } });
    }
  }
};
