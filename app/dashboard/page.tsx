'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { User2, ShoppingBag, Package, Settings, LogOut } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

// Add this type definition to fix the error
interface UserOrder {
    id: string;
    total: number;
    createdAt: Timestamp; // Proper Firestore timestamp type
    [key: string]: unknown; // Allow other properties
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<UserOrder[]>([]); // Fixed type
  const [totalSpent, setTotalSpent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch user's orders to calculate stats
        try {
          const ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', currentUser.uid)
          );
          const ordersSnapshot = await getDocs(ordersQuery);
          const userOrders: UserOrder[] = ordersSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          }) as UserOrder); // Cast to UserOrder type
          
          setOrders(userOrders);
          
          // Calculate total spent
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
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link href="/" className="text-2xl font-bold text-gray-900">
            Plant<span className="text-green-600">ingo</span>
            </Link>

            {/* Right side - User Profile & Logout */}
            <div className="flex items-center gap-4">
              {/* User Avatar & Info */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
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

                {/* User Info */}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user.displayName || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
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

        {/* Quick Stats Bar - NOW DYNAMIC */}
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Browse Products */}
          <Link
            href="/shop"
            className="block card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Browse Products</h3>
            </div>
            <p className="text-gray-600">Shop our latest products and discover new arrivals</p>
          </Link>

          {/* My Orders */}
          <Link
            href="/orders"
            className="block card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold">My Orders</h3>
            </div>
            <p className="text-gray-600">View and track your order history</p>
          </Link>

          {/* Profile Settings */}
          <Link
            href="/auth/profile"
            className="block card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">Profile Settings</h3>
            </div>
            <p className="text-gray-600">Update your account information and preferences</p>
          </Link>

          {/* Recent Activity */}
          <div className="block card md:col-span-3">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Package className="h-4 w-4 text-gray-600" />
              </div>
              Recent Activity
            </h3>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent orders</p>
                <p className="text-sm text-gray-400 mt-2">Start shopping to see your activity here</p>
                <Link 
                  href="/shop" 
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Browse Products →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <div className="font-medium text-sm">Order #{order.id.slice(-8)}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium">₹{order.total.toFixed(2)}</div>
                  </div>
                ))}
                <Link 
                  href="/orders" 
                  className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Orders →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
