'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';
import { CheckCircle2, Download } from 'lucide-react';

/* ---- helper that asks the API for a PDF and triggers a download ---- */
async function downloadInvoice(order: Order) {
  try {
    const res = await fetch('/api/generate-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error('Invoice generation failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Could not download invoice. Please try again.');
  }
}

function OrderSuccessContent() {
  const params          = useSearchParams();
  const router          = useRouter();
  const orderId         = params.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  /* fetch the freshly-created order */
  useEffect(() => {
    if (!orderId) {
      router.replace('/orders');         // fallback if no id
      return;
    }
    (async () => {
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (!snap.exists()) {
        router.replace('/orders');
        return;
      }
      setOrder({ id: snap.id, ...snap.data() } as Order);
      setLoading(false);
    })();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Thank you, your order is confirmed!</h1>
      <p className="text-gray-600 mb-6">Order&nbsp;ID&nbsp;#{order?.id.slice(-8)}</p>

      <button
        onClick={() => downloadInvoice(order!)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-4"
      >
        <Download className="h-5 w-5" />
        Download Invoice
      </button>

      <button
        onClick={() => router.push('/orders')}
        className="text-primary-600 hover:underline text-sm"
      >
        View all my orders →
      </button>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-r-transparent" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
