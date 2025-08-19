'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package, AlertCircle, Eye } from 'lucide-react';
import ProductForm from '@/components/ui/ProductForm';
import { Product } from '@/types';

// Mock data with plant images - same as your shop page
const mockProducts = [
  {
    id: '1',
    title: 'Monstera Deliciosa',
    description: 'A stunning tropical plant with large, glossy leaves that develop beautiful splits as they mature. Perfect for bright, indirect light.',
    price: 2499,
    stock: 15,
    category: 'Indoor Plants',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2',
    title: 'Snake Plant',
    description: 'Low-maintenance succulent with tall, sword-like leaves. Great for beginners and excellent air purifier.',
    price: 899,
    stock: 25,
    category: 'Indoor Plants',
    imageUrl: 'https://images.unsplash.com/photo-1593482892479-3b6a8f2fa2f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '3',
    title: 'Fiddle Leaf Fig',
    description: 'Popular houseplant with large, violin-shaped leaves. Makes a stunning statement piece in any room.',
    price: 3299,
    stock: 8,
    category: 'Indoor Plants',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '4',
    title: 'Peace Lily',
    description: 'Elegant flowering plant with dark green leaves and white blooms. Thrives in low to medium light.',
    price: 1299,
    stock: 18,
    category: 'Flowering Plants',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '5',
    title: 'Rubber Plant',
    description: 'Glossy, thick leaves and easy care make this a perfect choice for plant parents of all levels.',
    price: 1599,
    stock: 12,
    category: 'Indoor Plants',
    imageUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '6',
    title: 'Boston Fern',
    description: 'Lush, feathery fronds create a beautiful cascading effect. Perfect for hanging baskets or pedestals.',
    price: 1199,
    stock: 20,
    category: 'Ferns',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '7',
    title: 'ZZ Plant',
    description: 'Drought-tolerant with glossy, waxy leaves. One of the most low-maintenance plants you can own.',
    price: 1899,
    stock: 16,
    category: 'Indoor Plants',
    imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '8',
    title: 'Pothos',
    description: 'Trailing vine with heart-shaped leaves. Fast-growing and perfect for beginners.',
    price: 599,
    stock: 30,
    category: 'Trailing Plants',
    imageUrl: 'https://images.unsplash.com/photo-1586825883021-38b5e1bb2b8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '9',
    title: 'Bird of Paradise',
    description: 'Tropical plant with large, paddle-shaped leaves. Can grow quite tall and makes a dramatic statement.',
    price: 4299,
    stock: 5,
    category: 'Tropical Plants',
    imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '10',
    title: 'Spider Plant',
    description: 'Easy-to-grow plant that produces baby plantlets. Great for beginners and propagation enthusiasts.',
    price: 699,
    stock: 22,
    category: 'Indoor Plants',
    imageUrl: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '11',
    title: 'Aloe Vera',
    description: 'Medicinal succulent with thick, fleshy leaves. Low maintenance and has healing properties.',
    price: 799,
    stock: 28,
    category: 'Succulents',
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f2360af0e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '12',
    title: 'Lavender',
    description: 'Aromatic flowering plant perfect for both indoor and outdoor growing. Beautiful purple flowers.',
    price: 1099,
    stock: 14,
    category: 'Flowering Plants',
    imageUrl: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Remove the fetchProducts function since we're using mock data
  // const fetchProducts = async () => {
  //   try {
  //     const response = await fetch('/api/admin/products');
  //     const data = await response.json();
  //     setProducts(data);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    // For mock data, just remove from state
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSaveProduct = (savedProduct) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
    } else {
      // Add new product
      const newProduct = {
        ...savedProduct,
        id: Date.now().toString() // Simple ID generation for mock data
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'low' && product.stock < 10) ||
      (stockFilter === 'out' && product.stock === 0) ||
      (stockFilter === 'in' && product.stock > 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
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
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > 0).length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.stock < 10 && p.stock > 0).length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
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
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white md:w-48"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white md:w-40"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">All Stock</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid/Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
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
                            alt={product.title}
                            className="h-16 w-16 object-cover rounded-xl mr-4 shadow-md"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{product.title}</div>
                          <div className="text-sm text-gray-600 max-w-xs truncate leading-relaxed">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-lg text-green-600">₹{product.price.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock === 0 
                          ? 'bg-red-100 text-red-800' 
                          : product.stock < 10 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`flex items-center gap-2 ${
                        product.stock === 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          product.stock === 0 ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm font-medium">
                          {product.stock === 0 ? 'Out of Stock' : 'Available'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
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