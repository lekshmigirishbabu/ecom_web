'use client';
import { useState, useEffect } from 'react';
import { User2, ShoppingCart, Check, Search, Filter } from 'lucide-react';

// Mock data with plant images - replace with your Firebase data
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

export default function PlantShopPage() {
  const [products] = useState(mockProducts);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user] = useState({ displayName: 'Plant Lover', photoURL: null });
  const [addedToCart, setAddedToCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="text-3xl font-bold text-gray-900">
              Plant<span className="text-green-600">ingo</span>
              <div className="text-xs text-gray-500 font-normal">Where Plants Come to Life</div>
            </div>

            {/* Right side - Cart & Profile */}
            <div className="flex items-center gap-4">
              {/* Shopping Cart Icon */}
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

              {/* User Profile */}
              {user ? (
                <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.displayName || 'My Account'}
                  </span>
                </div>
              ) : (
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors bg-green-50 px-4 py-2 rounded-full">
                  <User2 className="h-5 w-5" />
                  <span className="hidden md:block text-sm font-medium">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium">🌱 Free shipping on orders over ₹2000 | 🚚 Same day delivery available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop Beautiful Plants</h1>
          <p className="text-lg text-gray-600">Transform your space with our carefully curated collection of indoor and outdoor plants</p>
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              {product.imageUrl && (
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {product.stock} left
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-900">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleAddToCart(product)}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    addedToCart === product.id
                      ? 'bg-green-500 text-white scale-95'
                      : isInCart(product.id)
                      ? 'bg-gray-400 text-white cursor-default'
                      : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                  }`}
                  disabled={isInCart(product.id) && addedToCart !== product.id}
                >
                  {addedToCart === product.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="h-5 w-5" />
                      Added to Cart!
                    </span>
                  ) : isInCart(product.id) ? (
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
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Shopping Cart ({getCartCount()})</h2>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-bold text-green-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">
                        ₹{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium mt-4 transition-colors">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}