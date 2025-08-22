import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,      // ✅ missing import
  doc, 
  updateDoc, 
  serverTimestamp,
  orderBy,
  query
} from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (orderId) {
      // fetch single order
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const orderData = {
        id: orderSnap.id,
        ...orderSnap.data(),
        createdAt: orderSnap.data().createdAt?.toDate?.() || new Date(),
        updatedAt: orderSnap.data().updatedAt?.toDate?.() || new Date()
      };

      return NextResponse.json(orderData);
    }

    // fallback → fetch all
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Example fields, adjust based on your invoice schema
    const newOrder = {
      customerName: data.customerName || "Unknown",
      items: data.items || [],
      total: data.total || 0,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'orders'), newOrder);

    return NextResponse.json({ id: docRef.id, ...newOrder });
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
    }

    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Order Error:", error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
