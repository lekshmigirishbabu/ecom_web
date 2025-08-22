'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { User2, ShoppingBag, Package, Settings, LogOut } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface UserOrder {
  id: string;
  total: number;
  createdAt: Timestamp;
  [key: string]: unknown;
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // check role
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        }

        // Fetch orders
        try {
          const ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', currentUser.uid)
          );
          const ordersSnapshot = await getDocs(ordersQuery);
          const userOrders: UserOrder[] = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }) as UserOrder);

          setOrders(userOrders);

          const total = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
          setTotalSpent(total);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left side: Logo & Admin Panel */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Plant<span className="text-green-600">ingo</span>
            </Link>

            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Admin Panel
              </button>
            )}
          </div>

          {/* Right side: User & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full ring-2 ring-blue-200"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-medium">
                  {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}

              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {user.displayName || 'User'}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.displayName || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your orders, browse products, and update your profile.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {orders.length > 0 ? 'Active' : 'New'}
                </div>
                <div className="text-sm text-gray-600">Member</div>
              </div>
            </div>
          </div>
        </div>

        {/* (Rest of dashboard content unchanged, orders, links, etc.) */}
      </div>
    </div>
  );
}
