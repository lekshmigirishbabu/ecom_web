'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Product } from '@/types/Product';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { User2, ShoppingCart, Check, Search, Filter } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from '@/components/ui/CartSidebar';
import BannerStrip from '@/components/BannerStrip';

export default function PlantShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user, setUser] = useState<User | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { addToCart, cartItems, getCartCount } = useCart();

  useEffect(() => {
    fetchProducts();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedToCart(product.id ?? null);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="text-3xl font-bold text-gray-900">
            Plant<span className="text-green-600">ingo</span>
            <div className="text-xs text-gray-500 font-normal">Where Plants Come to Life</div>
          </Link>

          {/* Right side - Cart & Profile */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-3 text-gray-600 hover:text-green-600 rounded-full hover:bg-green-50 transition-all duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Profile */}
            {user ? (
              <Link href="/dashboard" className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full ring-2 ring-green-200"
                  />
                ) : (
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user.displayName || 'My Account'}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors bg-green-50 px-4 py-2 rounded-full"
              >
                <User2 className="h-5 w-5" />
                <span className="hidden md:block text-sm font-medium">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Banner */}
      <BannerStrip />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop Beautiful Plants</h1>
          <p className="text-lg text-gray-600">Transform your space with our carefully curated collection</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for plants..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white md:w-56"
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
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              {product.imageUrl && (
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {product.stock} left
                  </div>
                </div>
              )}

              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-600">₹{product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    addedToCart === product.id
                      ? 'bg-green-500 text-white scale-95'
                      : isInCart(product.id ?? '')
                      ? 'bg-gray-400 text-white cursor-default'
                      : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                  }`}
                  disabled={isInCart(product.id ?? '') && addedToCart !== product.id}
                >
                  {addedToCart === product.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="h-5 w-5" />
                      Added to Cart!
                    </span>
                  ) : isInCart(product.id ?? '') ? (
                    'Already in Cart'
                  ) : (
                    '🛒 Add to Cart'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No plants found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
