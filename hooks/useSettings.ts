// hooks/useSettings.ts
'use client';
import { useState, useEffect } from 'react';

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

export const useSettings = () => {
  const [taxSettings, setTaxSettings] = useState<TaxSetting[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tax Settings Functions
  const fetchTaxSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/tax');
      const data = await response.json();
      if (response.ok) {
        setTaxSettings(data.taxSettings || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch tax settings');
    } finally {
      setLoading(false);
    }
  };

  const saveTaxSetting = async (taxSetting: Omit<TaxSetting, 'id'> & { id?: string }) => {
    try {
      setLoading(true);
      const isEdit = !!taxSetting.id;
      const url = '/api/settings/tax';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taxSetting)
      });
      
      const data = await response.json();
      if (response.ok) {
        await fetchTaxSettings(); // Refresh the list
        return { success: true, data };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to save tax setting';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteTaxSetting = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/settings/tax?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (response.ok) {
        setTaxSettings(prev => prev.filter(tax => tax.id !== id));
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to delete tax setting';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Shipping Options Functions
  const fetchShippingOptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/shipping');
      const data = await response.json();
      if (response.ok) {
        setShippingOptions(data.shippingOptions || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch shipping options');
    } finally {
      setLoading(false);
    }
  };

  const saveShippingOption = async (shippingOption: Omit<ShippingOption, 'id'> & { id?: string }) => {
    try {
      setLoading(true);
      const isEdit = !!shippingOption.id;
      const url = '/api/settings/shipping';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingOption)
      });
      
      const data = await response.json();
      if (response.ok) {
        await fetchShippingOptions(); // Refresh the list
        return { success: true, data };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to save shipping option';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteShippingOption = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/settings/shipping?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (response.ok) {
        setShippingOptions(prev => prev.filter(shipping => shipping.id !== id));
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to delete shipping option';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Banner Functions
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/banners');
      const data = await response.json();
      if (response.ok) {
        setBanners(data.banners || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async (banner: Omit<Banner, 'id'> & { id?: string }) => {
    try {
      setLoading(true);
      const isEdit = !!banner.id;
      const url = '/api/settings/banners';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      });
      
      const data = await response.json();
      if (response.ok) {
        await fetchBanners(); // Refresh the list
        return { success: true, data };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to save banner';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/settings/banners?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (response.ok) {
        setBanners(prev => prev.filter(banner => banner.id !== id));
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to delete banner';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Load all settings on mount
  useEffect(() => {
    fetchTaxSettings();
    fetchShippingOptions();
    fetchBanners();
  }, []);

  return {
    // State
    taxSettings,
    shippingOptions,
    banners,
    loading,
    error,
    
    // Tax functions
    saveTaxSetting,
    deleteTaxSetting,
    fetchTaxSettings,
    
    // Shipping functions
    saveShippingOption,
    deleteShippingOption,
    fetchShippingOptions,
    
    // Banner functions
    saveBanner,
    deleteBanner,
    fetchBanners,
    
    // Utility
    clearError: () => setError(null)
  };
};