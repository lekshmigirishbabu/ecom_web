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

export const FooterBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterBanners();
  }, []);

  const fetchFooterBanners = async () => {
    try {
      const response = await fetch('/api/settings/banners');
      const data = await response.json();
      if (response.ok) {
        const footerBanners = data.banners
          .filter((banner: Banner) => banner.position === 'footer' && banner.isActive)
          .sort((a: Banner, b: Banner) => a.priority - b.priority);
        setBanners(footerBanners);
      }
    } catch (error) {
      console.error('Error fetching footer banners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {banners.map((banner) => {
        const BannerCard = () => (
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-24 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="p-3">
              <h4 className="font-medium text-sm">{banner.title}</h4>
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