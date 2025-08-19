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

export const HeroBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroBanners();
  }, []);

  const fetchHeroBanners = async () => {
    try {
      const response = await fetch('/api/settings/banners');
      const data = await response.json();
      if (response.ok) {
        const heroBanners = data.banners
          .filter((banner: Banner) => banner.position === 'hero' && banner.isActive)
          .sort((a: Banner, b: Banner) => a.priority - b.priority);
        setBanners(heroBanners);
      }
    } catch (error) {
      console.error('Error fetching hero banners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (loading) {
    return (
      <div className="relative h-96 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading banner...</div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // No banners to display
  }

  const banner = banners[currentBanner];

  const BannerContent = () => (
    <div className="relative h-96 bg-gray-900 overflow-hidden">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h1>
          {banner.subtitle && (
            <p className="text-xl md:text-2xl mb-6">{banner.subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Carousel indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentBanner ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return banner.linkUrl ? (
    <Link href={banner.linkUrl}>
      <BannerContent />
    </Link>
  ) : (
    <BannerContent />
  );
};