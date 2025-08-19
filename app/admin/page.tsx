'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    lowStockItems: 0,
    totalSales: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        // Get total orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const totalOrders = ordersSnapshot.size;

        // Calculate total sales
        const totalSales = ordersSnapshot.docs.reduce((sum, doc) => {
          return sum + (doc.data().total || 0);
        }, 0);

        // Get low stock items (stock < 10)
        const lowStockQuery = query(
          collection(db, 'products'),
          where('stock', '<', 10)
        );
        const lowStockSnapshot = await getDocs(lowStockQuery);
        const lowStockItems = lowStockSnapshot.size;

        setStats({
          totalProducts,
          totalOrders,
          lowStockItems,
          totalSales
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg text-white mr-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stats.lowStockItems > 0 && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Stock Alert</h3>
          </div>
          <p className="text-red-700 mt-2">
            You have {stats.lowStockItems} items with low stock. Please restock soon.
          </p>
        </div>
      )}
    </div>
  );
}
