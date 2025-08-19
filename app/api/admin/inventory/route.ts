import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function PUT(request: NextRequest) {
  try {
    const { productId, stock } = await request.json();
    
    if (!productId || stock === undefined) {
      return NextResponse.json({ error: 'Product ID and stock required' }, { status: 400 });
    }
    
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      stock: parseInt(stock),
      updatedAt: serverTimestamp()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
