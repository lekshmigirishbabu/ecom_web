'use client';
import { useState } from 'react';
import { Order, OrderStatus } from '../types/Order';
import { orderService } from '../lib/orderService';
import { Package, Calendar, User, DollarSign, Download } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onDownloadInvoice: (order: Order) => void;
  isAdmin?: boolean;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function OrderList({ orders, onStatusUpdate, onDownloadInvoice, isAdmin = false }: OrderListProps) {
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    try {
      await onStatusUpdate(orderId, newStatus);
    } finally {
      setUpdatingOrders(prev => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {order.createdAt.toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <button
                onClick={() => onDownloadInvoice(order)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Download className="w-4 h-4 mr-1" />
                Invoice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Package className="w-4 h-4 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">{order.items.length} item(s)</p>
                <p className="text-sm text-gray-600">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} total qty
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">${order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Items:</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Status Update */}
          {isAdmin && (
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status:
              </label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                disabled={updatingOrders.has(order.id)}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {updatingOrders.has(order.id) && (
                <span className="ml-2 text-sm text-gray-500">Updating...</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}