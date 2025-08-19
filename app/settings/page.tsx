// app/settings/page.tsx
'use client';
import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff, Loader } from 'lucide-react';

// Types
interface TaxSetting {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  isDefault: boolean;
  regions: string[];
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
  regions: string[];
}

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'hero' | 'sidebar' | 'footer';
  isActive: boolean;
  priority: number;
}

export default function SettingsPage() {
  const {
    taxSettings,
    shippingOptions,
    banners,
    loading,
    error,
    saveTaxSetting,
    deleteTaxSetting,
    saveShippingOption,
    deleteShippingOption,
    saveBanner,
    deleteBanner,
    clearError
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'tax' | 'shipping' | 'banners'>('tax');
  
  // Form states
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxSetting | null>(null);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [editingShipping, setEditingShipping] = useState<ShippingOption | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Tax Form Component
  const TaxForm = ({ tax, onSave, onCancel }: {
    tax?: TaxSetting;
    onSave: (tax: TaxSetting) => Promise<void>;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: tax?.name || '',
      rate: tax?.rate || 0,
      type: tax?.type || 'percentage' as const,
      isDefault: tax?.isDefault || false,
      regions: tax?.regions || ['']
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      
      const taxData = {
        id: tax?.id,
        ...formData
      };
      
      await onSave(taxData as TaxSetting);
      setSaving(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {tax ? 'Edit Tax Setting' : 'Add Tax Setting'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tax Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax Rate</label>
              <input
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})}
                className="w-full border rounded-md px-3 py-2"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'percentage' | 'fixed'})}
                className="w-full border rounded-md px-3 py-2"
                disabled={saving}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="mr-2"
                  disabled={saving}
                />
                Default Tax Setting
              </label>
            </div>
            <div className="flex justify-end space-x-2">
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
                {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Shipping Form Component
  const ShippingForm = ({ shipping, onSave, onCancel }: {
    shipping?: ShippingOption;
    onSave: (shipping: ShippingOption) => Promise<void>;
    onCancel: () => void;
  }) => {
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

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {shipping ? 'Edit Shipping Option' : 'Add Shipping Option'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                rows={2}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full border rounded-md px-3 py-2"
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
                placeholder="e.g., 3-5 business days"
                className="w-full border rounded-md px-3 py-2"
                disabled={saving}
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                  disabled={saving}
                />
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-2">
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
                {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Banner Form Component
  const BannerForm = ({ banner, onSave, onCancel }: {
    banner?: Banner;
    onSave: (banner: Banner) => Promise<void>;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: banner?.title || '',
      subtitle: banner?.subtitle || '',
      imageUrl: banner?.imageUrl || '',
      linkUrl: banner?.linkUrl || '',
      position: banner?.position || 'hero' as const,
      isActive: banner?.isActive ?? true,
      priority: banner?.priority || 1
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      
      const bannerData = {
        id: banner?.id,
        ...formData
      };
      
      await onSave(bannerData as Banner);
      setSaving(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {banner ? 'Edit Banner' : 'Add Banner'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link URL</label>
              <input
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value as Banner['position']})}
                className="w-full border rounded-md px-3 py-2"
                disabled={saving}
              >
                <option value="hero">Hero Section</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <input
                type="number"
                min="1"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: Number(e.target.value)})}
                className="w-full border rounded-md px-3 py-2"
                disabled={saving}
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                  disabled={saving}
                />
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-2">
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
                {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Event Handlers
  const handleSaveTax = async (tax: TaxSetting) => {
    const result = await saveTaxSetting(tax);
    if (result.success) {
      setShowTaxForm(false);
      setEditingTax(null);
    }
  };

  const handleSaveShipping = async (shipping: ShippingOption) => {
    const result = await saveShippingOption(shipping);
    if (result.success) {
      setShowShippingForm(false);
      setEditingShipping(null);
    }
  };

  const handleSaveBanner = async (banner: Banner) => {
    const result = await saveBanner(banner);
    if (result.success) {
      setShowBannerForm(false);
      setEditingBanner(null);
    }
  };

  const handleDeleteTax = async (id: string) => {
    if (confirm('Are you sure you want to delete this tax setting?')) {
      await deleteTaxSetting(id);
    }
  };

  const handleDeleteShipping = async (id: string) => {
    if (confirm('Are you sure you want to delete this shipping option?')) {
      await deleteShippingOption(id);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      await deleteBanner(id);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
     {/* Tab Navigation */}
     <div className="border-b mb-6">
      <nav className="-mb-px flex space-x-8">
    {[
          { key: 'tax' as const, label: 'Tax Settings' },
          { key: 'shipping' as const, label: 'Shipping Options' },
          { key: 'banners' as const, label: 'Banner Management' }
            ].map(tab => (
           <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab.key
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
             }`}
          >
        {tab.label}
      </button>
       ))}  
        </nav>
          </div>


      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="h-6 w-6 animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      )}

      {/* Tax Settings Tab */}
      {activeTab === 'tax' && !loading && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tax Settings</h2>
            <button
              onClick={() => setShowTaxForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tax Setting
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {taxSettings.map(tax => (
                  <tr key={tax.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{tax.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tax.rate}{tax.type === 'percentage' ? '%' : '₹'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{tax.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tax.isDefault ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Yes</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingTax(tax);
                          setShowTaxForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTax(tax.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {taxSettings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No tax settings found. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shipping Settings Tab */}
      {activeTab === 'shipping' && !loading && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Shipping Options</h2>
            <button
              onClick={() => setShowShippingForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Shipping Option
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shippingOptions.map(shipping => (
                  <tr key={shipping.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{shipping.name}</div>
                        {shipping.description && (
                          <div className="text-sm text-gray-500">{shipping.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{shipping.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{shipping.estimatedDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        shipping.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {shipping.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingShipping(shipping);
                          setShowShippingForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteShipping(shipping.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {shippingOptions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No shipping options found. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Banner Settings Tab */}
      {activeTab === 'banners' && !loading && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Banner Management</h2>
            <button
              onClick={() => setShowBannerForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map(banner => (
              <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
                {banner.imageUrl && (
                  <div className="relative">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {banner.linkUrl && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Linked
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-gray-600 text-sm mt-1">{banner.subtitle}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">{banner.position}</span>
                    </div>
                    <span className="text-xs text-gray-400">Priority: {banner.priority}</span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        setShowBannerForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <div className="col-span-full">
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No banners found. Add one to get started.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Forms */}
      {showTaxForm && (
        <TaxForm
          tax={editingTax || undefined}
          onSave={handleSaveTax}
          onCancel={() => {
            setShowTaxForm(false);
            setEditingTax(null);
          }}
        />
      )}

      {showShippingForm && (
        <ShippingForm
          shipping={editingShipping || undefined}
          onSave={handleSaveShipping}
          onCancel={() => {
            setShowShippingForm(false);
            setEditingShipping(null);
          }}
        />
      )}

      {showBannerForm && (
        <BannerForm
          banner={editingBanner || undefined}
          onSave={handleSaveBanner}
          onCancel={() => {
            setShowBannerForm(false);
            setEditingBanner(null);
          }}
        />
      )}
    </div>
  );
}
