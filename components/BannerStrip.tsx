'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  position: 'hero' | 'sidebar' | 'footer';
  isActive: boolean;
};

export default function BannerStrip() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res   = await fetch('/api/banners?position=hero'); // ← create this public endpoint
        const data  = await res.json();
        setBanners(data.filter((b: Banner) => b.isActive));
      } catch (e) {
        console.error('Banner fetch failed', e);
      }
    })();
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className="w-full overflow-hidden">
      {banners.map((b) => (
        <a href={b.link || '#'} key={b.id} className="block">
          <Image
            src={b.imageUrl}
            alt={b.title}
            width={1_920}
            height={600}
            className="w-full h-auto object-cover"
            priority
          />
        </a>
      ))}
    </div>
  );
}