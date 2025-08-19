'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export const SidebarBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSidebarBanners();
  }, []);

  const fetchSidebarBanners = async () => {
    try {
      const response = await fetch('/api/settings/banners');
      const data = await response.json();
      if (response.ok) {
        const sidebarBanners = data.banners
          .filter((banner: Banner) => banner.position === 'sidebar' && banner.isActive)
          .sort((a: Banner, b: Banner) => a.priority - b.priority);
        setBanners(sidebarBanners);
      }
    } catch (error) {
      console.error('Error fetching sidebar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-gray-200 animate-pulse h-40 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {banners.map((banner) => {
        const BannerCard = () => (
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-32 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="p-3">
              <h3 className="font-semibold text-sm">{banner.title}</h3>
              {banner.subtitle && (
                <p className="text-xs text-gray-600 mt-1">{banner.subtitle}</p>
              )}
            </div>
          </div>
        );

        return banner.linkUrl ? (
          <Link key={banner.id} href={banner.linkUrl}>
            <BannerCard />
          </Link>
        ) : (
          <div key={banner.id}>
            <BannerCard />
          </div>
        );
      })}
    </div>
  );
};
