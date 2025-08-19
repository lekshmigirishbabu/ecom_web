"use client";
import { Product } from '../../types/Product';
import { useCart } from '../../contexts/CartContext';
import { Edit, Trash2, ShoppingCart } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}) => {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.category}</p>
            <p className="text-2xl font-bold text-green-600 mb-2">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Stock: {product.stock} units
            </p>
            
            {product.description && (
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Add to Cart Button - Only show if not admin and product is in stock */}
            {!isAdmin && product.stock > 0 && (
              <button
                onClick={() => addItem(product)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center mb-3 transition-colors"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </button>
            )}

            {/* Out of Stock Message */}
            {!isAdmin && product.stock === 0 && (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed flex items-center justify-center mb-3"
              >
                Out of Stock
              </button>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => product.id && onDelete(product.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};