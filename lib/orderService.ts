import { collection, getDocs, doc, updateDoc, getDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import { Order, OrderStatus } from '../types/Order';

export const orderService = {
  // Get all orders (admin)
  getAllOrders: async (): Promise<Order[]> => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Order[];
  },

  // Get orders by user
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Order[];
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    });
  },

  // Get single order
  getOrder: async (orderId: string): Promise<Order | null> => {
    const orderRef = doc(db, 'orders', orderId);
    const snapshot = await getDoc(orderRef);
    if (!snapshot.exists()) return null;
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),
      updatedAt: snapshot.data().updatedAt?.toDate(),
    } as Order;
  }
};