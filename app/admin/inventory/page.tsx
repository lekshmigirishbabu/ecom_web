'use client';
import { useState, useEffect } from 'react';
import { Upload, Download, AlertTriangle } from 'lucide-react';
import Papa from 'papaparse';
import { Product } from '@/types';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data);
      setLowStockItems(data.filter((p: Product) => p.stock < 10));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const stockUpdates = results.data as Array<{productId: string, stock: string}>;
          
          for (const update of stockUpdates) {
            if (update.productId && update.stock) {
              await fetch('/api/admin/inventory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: update.productId,
                  stock: parseInt(update.stock)
                })
              });
            }
          }
          
          await fetchProducts();
          alert('Stock levels updated successfully!');
        } catch (error) {
          console.error('Error updating stock:', error);
          alert('Error updating stock levels');
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        alert('Error parsing CSV file');
        setUploading(false);
      }
    });
  };

  const downloadTemplate = () => {
    const csvContent = "productId,stock\n" + 
      products.map(p => `${p.id},${p.stock}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Management</h1>

      {lowStockItems.length > 0 && (
        <div className="card bg-red-50 border-red-200 mb-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-white p-3 rounded border">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-600">Stock: {item.stock}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">CSV Upload</h3>
          <p className="text-gray-600 mb-4">
            Upload a CSV file with productId and stock columns to bulk update inventory.
          </p>
          <div className="space-y-3">
            <div>
              <label className="btn-secondary cursor-pointer inline-flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                {uploading ? 'Uploading...' : 'Upload CSV'}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <button
              onClick={downloadTemplate}
              className="btn-secondary flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Template
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Products:</span>
              <span className="font-semibold">{products.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Low Stock Items:</span>
              <span className="font-semibold text-red-600">{lowStockItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Stock Value:</span>
              <span className="font-semibold">
                ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Current Inventory</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Product ID</th>
                <th className="text-left py-3 px-4 font-semibold">Product Name</th>
                <th className="text-left py-3 px-4 font-semibold">Current Stock</th>
                <th className="text-left py-3 px-4 font-semibold">Value</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-mono text-sm">{product.id}</td>
                  <td className="py-3 px-4">{product.title}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">${(product.price * product.stock).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock < 5 
                        ? 'bg-red-100 text-red-800' 
                        : product.stock < 10
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock < 5 ? 'Critical' : product.stock < 10 ? 'Low' : 'Good'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
