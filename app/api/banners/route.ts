import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position') || 'hero';     // default

    const bannersRef = collection(db, 'banners');
    const q          = query(
      bannersRef,
      where('position', '==', position),
      where('isActive', '==', true)
    );

    const snap   = await getDocs(q);
    const result = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('Banner fetch error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
