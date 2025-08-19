'use client';
import { useEffect, useState, ReactNode, Suspense } from 'react';
import { Order } from '@/types';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle
} from 'lucide-react';

// Define the order status type for better type safety
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

function CustomerOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');

  /* helper to get JS Date from Firestore Timestamp or ISO string */
  const toJsDate = (raw: Timestamp | string | Date | number | undefined): Date => {
    if (!raw) return new Date();
    if (raw instanceof Timestamp) return raw.toDate();
    if (raw instanceof Date) return raw;
    return new Date(raw);
  };

  /* ─────────── listen for auth + orders ─────────── */
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubOrders = onSnapshot(
        q,
        (snap) => {
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          })) as Order[];
          setOrders(data);
          setLoading(false);
        },
        (err) => {
          console.error('Orders listener error:', err);
          setLoading(false);
        }
      );

      return () => unsubOrders();
    });

    return () => unsubAuth();
  }, [router]);

  /* ─────────── status chip styles ─────────── */
  const statusMeta: Record<OrderStatus, { icon: ReactNode; style: string }> = {
    pending: { 
      icon: <Clock className="h-4 w-4" />, 
      style: 'bg-yellow-100 text-yellow-800' 
    },
    processing: { 
      icon: <Package className="h-4 w-4" />, 
      style: 'bg-blue-100 text-blue-800' 
    },
    shipped: { 
      icon: <Truck className="h-4 w-4" />, 
      style: 'bg-purple-100 text-purple-800' 
    },
    delivered: { 
      icon: <CheckCircle2 className="h-4 w-4" />, 
      style: 'bg-green-100 text-green-800' 
    },
    cancelled: { 
      icon: <XCircle className="h-4 w-4" />, 
      style: 'bg-red-100 text-red-800' 
    }
  };

  /* ─────────── loading skeleton ─────────── */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse h-24 rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  /* ─────────── render ─────────── */
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {success && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-green-700 text-sm">
            Your order was placed successfully! We&apos;ll email you updates.
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/shop"
            className="inline-block rounded-full bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => {
            const meta = statusMeta[o.status as OrderStatus] || statusMeta.pending;
            return (
              <div
                key={o.id}
                className="rounded-xl border shadow-sm hover:shadow transition flex flex-col md:flex-row md:items-center md:justify-between p-5"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm font-mono mb-1">
                    <span className="text-gray-500">Order #</span>
                    <span>{o.id.slice(-8)}</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Placed on {toJsDate(o.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center gap-4">
                  <span className="font-semibold whitespace-nowrap">
                    ₹{o.total.toFixed(2)}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs capitalize ${meta.style}`}
                  >
                    {meta.icon}
                    {o.status}
                  </span>

                  <Link
                    href={`/orders/${o.id}`}
                    className="text-blue-600 hover:underline text-sm whitespace-nowrap"
                  >
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CustomerOrders() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-24 rounded-lg bg-gray-200" />
          ))}
        </div>
      }
    >
      <CustomerOrdersContent />
    </Suspense>
  );
}
