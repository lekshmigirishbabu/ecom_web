'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Settings, Banner } from '@/types';

// Add proper type definitions
type BannerPosition = 'hero' | 'sidebar' | 'footer';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    tax: { rate: 0, enabled: false },
    shipping: { freeShippingThreshold: 0, standardRate: 0, expressRate: 0 }
  });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchBanners();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      const data = await response.json();
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  const addBanner = async () => {
    const newBanner: Partial<Banner> = {
      title: '',
      imageUrl: '',
      link: '',
      position: 'hero',
      isActive: true
    };

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner)
      });
      const banner = await response.json();
      setBanners([...banners, banner]);
    } catch (error) {
      console.error('Error adding banner:', error);
    }
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    try {
      await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      
      setBanners(banners.map(banner => 
        banner.id === id ? { ...banner, ...updates } : banner
      ));
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      setBanners(banners.filter(banner => banner.id !== id));
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      {/* Tax Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Tax Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.tax.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  tax: { ...prev.tax, enabled: e.target.checked }
                }))}
                className="mr-2"
              />
              Enable Tax Calculation
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              className="input-field"
              value={settings.tax.rate}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                tax: { ...prev.tax, rate: parseFloat(e.target.value) || 0 }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Shipping Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Free Shipping Threshold ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              value={settings.shipping.freeShippingThreshold}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                shipping: { 
                  ...prev.shipping, 
                  freeShippingThreshold: parseFloat(e.target.value) || 0 
                }
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Standard Shipping Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              value={settings.shipping.standardRate}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                shipping: { 
                  ...prev.shipping, 
                  standardRate: parseFloat(e.target.value) || 0 
                }
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Express Shipping Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              value={settings.shipping.expressRate}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                shipping: { 
                  ...prev.shipping, 
                  expressRate: parseFloat(e.target.value) || 0 
                }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Banner Management */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Banner Management</h2>
          <button onClick={addBanner} className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Banner
          </button>
        </div>
        
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <input
                  type="text"
                  placeholder="Banner Title"
                  className="input-field"
                  value={banner.title}
                  onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  className="input-field"
                  value={banner.imageUrl}
                  onChange={(e) => updateBanner(banner.id, { imageUrl: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Link URL (optional)"
                  className="input-field"
                  value={banner.link || ''}
                  onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                />
                <select
                  className="input-field"
                  value={banner.position}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    updateBanner(banner.id, { position: e.target.value as BannerPosition })
                  }
                >
                  <option value="hero">Hero</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                </select>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={banner.isActive}
                      onChange={(e) => updateBanner(banner.id, { isActive: e.target.checked })}
                      className="mr-1"
                    />
                    Active
                  </label>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={saveSettings} className="btn-primary flex items-center">
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
