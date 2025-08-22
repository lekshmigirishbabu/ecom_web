'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

import { Plus, Edit, Trash2, Search, Filter, Package, AlertCircle, Eye } from 'lucide-react';
import ProductForm from '@/components/ui/ProductForm';
import { Product } from '@/types/Product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const router = useRouter();

  // ✅ Protect route: only admins
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      fetchProducts();
    });

    return () => unsub();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSaveProduct = async () => {
    await fetchProducts();
    setShowForm(false);
    setEditingProduct(null);
  };

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && product.stock < 10) ||
      (stockFilter === 'out' && product.stock === 0) ||
      (stockFilter === 'in' && product.stock > 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-lg text-gray-600">Manage your plant inventory and product listings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Products" value={products.length} color="blue" icon={Package} />
          <StatCard title="In Stock" value={products.filter(p => p.stock > 0).length} color="green" icon={Package} />
          <StatCard title="Low Stock" value={products.filter(p => p.stock < 10 && p.stock > 0).length} color="orange" icon={AlertCircle} />
          <StatCard title="Out of Stock" value={products.filter(p => p.stock === 0).length} color="red" icon={AlertCircle} />
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <SelectFilter
              icon={Filter}
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={['all', ...categories]}
            />

            <SelectFilter
              icon={Package}
              value={stockFilter}
              onChange={setStockFilter}
              options={['all', 'in', 'low', 'out']}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded-xl mr-4 shadow-md"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{product.name}</div>
                          <div className="text-sm text-gray-600 max-w-xs truncate leading-relaxed">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{product.category}</td>
                    <td className="py-4 px-6 font-bold text-green-600">₹{product.price.toFixed(2)}</td>
                    <td className="py-4 px-6">{product.stock}</td>
                    <td className="py-4 px-6 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => product.id && handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`bg-${color}-100 p-3 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
}

function SelectFilter({ icon: Icon, value, onChange, options }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <select
        className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === 'all'
              ? 'All'
              : opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
