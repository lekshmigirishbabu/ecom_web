'use client';
import { useState } from 'react';
import { Loader, X } from 'lucide-react';

interface ShippingOption {
  id?: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
  regions: string[];
}

interface ShippingFormProps {
  shipping?: ShippingOption;
  onSave: (shipping: ShippingOption) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ shipping, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: shipping?.name || '',
    description: shipping?.description || '',
    price: shipping?.price || 0,
    estimatedDays: shipping?.estimatedDays || '',
    isActive: shipping?.isActive ?? true,
    regions: shipping?.regions || ['']
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const shippingData = {
      id: shipping?.id,
      ...formData
    };
    
    await onSave(shippingData as ShippingOption);
    setSaving(false);
  };

  const addRegion = () => {
    setFormData(prev => ({
      ...prev,
      regions: [...prev.regions, '']
    }));
  };

  const removeRegion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.filter((_, i) => i !== index)
    }));
  };

  const updateRegion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.map((region, i) => i === index ? value : region)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {shipping ? 'Edit Shipping Option' : 'Add Shipping Option'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={saving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Standard Shipping, Express"
              required
              disabled={saving}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of shipping method"
              disabled={saving}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={saving}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Delivery</label>
            <input
              type="text"
              value={formData.estimatedDays}
              onChange={(e) => setFormData({...formData, estimatedDays: e.target.value})}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3-5 business days"
              disabled={saving}
            />
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2 text-blue-600 focus:ring-blue-500"
                disabled={saving}
              />
              <span className="text-sm font-medium">Active</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Inactive shipping options won't be shown to customers
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Available Regions</label>
            {formData.regions.map((region, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={region}
                  onChange={(e) => updateRegion(index, e.target.value)}
                  className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., US, CA, EU"
                  disabled={saving}
                />
                {formData.regions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRegion(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                    disabled={saving}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRegion}
              className="text-sm text-blue-600 hover:text-blue-800"
              disabled={saving}
            >
              + Add Region
            </button>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={saving}
            >
              {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
