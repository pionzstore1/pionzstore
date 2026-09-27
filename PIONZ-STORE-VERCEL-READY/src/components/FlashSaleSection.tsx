import React, { useState, useEffect } from 'react';
import { Product, StoreConfig } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';
import { Flame, Clock } from 'lucide-react';

interface FlashSaleSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAllFlash: () => void;
  config?: StoreConfig;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onSelectProduct,
  config,
}) => {
  // Countdown timer until midnight
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.flash && !p.sold).slice(0, 4);

  if (flashProducts.length === 0) return null;

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-br from-slate-950 via-[#18110b] to-slate-950 rounded-3xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden border border-amber-500/30">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shrink-0">
              <Flame className="w-6 h-6 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black font-heading tracking-wide uppercase text-white">
                  FLASH SALE AKUN PILIHAN
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
                Akun Sultan & Pelajar Best Price • Kuota Sangat Terbatas!
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-500/30">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-200">Berakhir:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm">
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-lg shadow">
                {padZero(timeLeft.hours)}
              </span>
              <span className="text-amber-400">:</span>
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-lg shadow">
                {padZero(timeLeft.minutes)}
              </span>
              <span className="text-amber-400">:</span>
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-lg shadow">
                {padZero(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Product Slider */}
        <div className="relative z-10 flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 scroll-smooth">
          {flashProducts.map((product) => (
            <div key={product.id} className="shrink-0 w-[48%] sm:w-[31%] md:w-[24%] snap-start">
              <ProductCard
                product={product}
                onSelect={onSelectProduct}
                config={config}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
