import React, { useState, useEffect } from 'react';
import { Banner, StoreConfig } from '../types.ts';
import { ChevronLeft, ChevronRight, ShieldCheck, BadgeCheck, Headphones, Clock } from 'lucide-react';

interface HeroBannerProps {
  banners: Banner[];
  storeConfig: StoreConfig;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners,
  storeConfig,
  onExploreClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banners if more than 1 banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Hero Showcase Frame */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-800/90 bg-slate-950 group">
        {/* Banner Images Carousel */}
        <div 
          className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1] max-h-[390px] min-h-[180px] cursor-pointer"
          onClick={onExploreClick}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title || storeConfig.brandName}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80';
                }}
              />
              {/* Banner image only — no text overlay */}
            </div>
          ))}
        </div>

        {/* Carousel Arrow Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/50 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`transition-all rounded-full ${
                  i === currentIndex
                    ? 'w-6 h-1.5 bg-blue-500'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trust Highlights Bar */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
        {/* Item 1: Transaksi Aman */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-colors shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1">
              <span>Transaksi Aman</span>
              <BadgeCheck className="w-3.5 h-3.5 text-blue-400 inline-block shrink-0" />
            </div>
            <div className="text-[11px] text-slate-400">100% Terverifikasi</div>
          </div>
        </div>

        {/* Item 2: Garansi Akun */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white">Garansi Akun</div>
            <div className="text-[11px] text-slate-400">Aman & Terpercaya</div>
          </div>
        </div>

        {/* Item 3: Bantuan Admin */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-colors shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white">Bantuan Admin</div>
            <div className="text-[11px] text-slate-400">Siap Bantu & Fast Respon</div>
          </div>
        </div>

        {/* Item 4: Jam Operasional */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-colors shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white">Admin Fast Respon</div>
            <div className="text-[11px] text-slate-400">{storeConfig.operatingHours}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
