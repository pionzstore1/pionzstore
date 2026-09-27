import React from 'react';
import { Product, StoreConfig } from '../types.ts';
import { STORE_CONFIG } from '../data/storeData.ts';
import { formatRupiah, getBadgeColorClass, createWhatsAppBuyUrl } from '../utils/formatters.ts';
import { Flame, Crown, GraduationCap, Sparkles, Star, MessageCircle, Eye, BadgeCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  config?: StoreConfig;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, config }) => {
  const currentConfig = config || STORE_CONFIG;

  const getBadgeIcon = (badge: string) => {
    switch (badge?.toUpperCase()) {
      case 'HOT':
        return <Flame className="w-3.5 h-3.5 fill-red-400 text-red-400" />;
      case 'SULTAN':
        return <Crown className="w-3 h-3 fill-amber-400 text-amber-400" />;
      case 'PELAJAR':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'LIMITED':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Star className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const isSoldOrDp = product.sold || product.name.toUpperCase().includes('SOLD DI DP');
  const isBooking = product.name.toUpperCase().includes('SOLD DI DP');

  // Format first 2 key specs
  const keySpecs = (product.specs || [])
    .filter(s => !s.toLowerCase().includes('op?') && !s.toLowerCase().includes('rebind only'))
    .slice(0, 2);

  const waBuyUrl = createWhatsAppBuyUrl(product, currentConfig);

  return (
    <div 
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-[#101726] rounded-3xl border border-slate-800/90 shadow-xl hover:shadow-2xl hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.99]"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-slate-900">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            product.sold ? 'grayscale-[0.5] opacity-75' : ''
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Ambient Top Shadow Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101726] via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          {/* Main Tier Badge */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider backdrop-blur-md bg-black/60 text-white border border-white/10 shadow-md">
            {getBadgeIcon(product.badge)}
            <span>{product.badge}</span>
          </div>

          {/* Flash Sale Tag */}
          {product.flash && !product.sold && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase bg-rose-600 text-white shadow-md animate-pulse">
              <Flame className="w-3 h-3 fill-white" />
              <span>Flash</span>
            </div>
          )}
        </div>

        {/* Sold / DP Overlay */}
        {product.sold && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center z-20">
            <div className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl border border-red-500 rotate-[-4deg] mb-1">
              TERJUAL (SOLD)
            </div>
            {product.soldPrice && (
              <span className="text-xs text-slate-300 font-medium font-mono">
                Terjual {formatRupiah(product.soldPrice)}
              </span>
            )}
          </div>
        )}

        {isBooking && !product.sold && (
          <div className="absolute inset-0 bg-amber-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 text-center z-20">
            <div className="px-3.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide uppercase shadow-xl border border-amber-400">
              SOLD DI DP
            </div>
            <span className="text-[11px] text-amber-200 font-semibold mt-1">
              Bisa ditikung!
            </span>
          </div>
        )}

        {/* Game Tag Bottom-Right */}
        <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[9px] font-bold text-slate-300 border border-white/5 z-10">
          Free Fire
        </div>
      </div>

      {/* Product Content Body */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 text-white">
        {/* Rating and Guarantee */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1.5">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>5.0</span>
            <span className="text-slate-500 font-normal">Rating</span>
          </div>
          <span className="flex items-center gap-1 text-blue-400 font-semibold text-[9px]">
            <BadgeCheck className="w-3.5 h-3.5" /> Garansi Akun
          </span>
        </div>

        {/* Title */}
        <h4 className="font-bold text-white text-[10px] sm:text-xs line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors mb-2 font-heading">
          {product.name}
        </h4>

        {/* Key Specs Preview */}
        {keySpecs.length > 0 && (
          <div className="pionz-key-specs flex flex-wrap gap-1.5 mb-2.5 text-[9px] sm:text-[9px] text-slate-300">
            {keySpecs.map((spec, idx) => (
              <span
                key={idx}
                className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md border border-slate-800/90 bg-slate-900/60 px-1.5 py-0.5 truncate"
                title={spec}
              >
                <span className="w-0.5 h-0.5 rounded-full bg-blue-400 shrink-0" />
                <span className="truncate">{spec}</span>
              </span>
            ))}
          </div>
        )}

        {/* Spacer & Bottom Price / CTA */}
        <div className="mt-auto pt-2 border-t border-slate-800/80">
          {/* Price Section */}
          <div className="flex items-baseline justify-between gap-1 mb-3">
            <div>
              {product.discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-[9px] line-through text-slate-500 font-mono">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-sm sm:text-lg font-black text-rose-400 font-heading tabular-nums">
                    {formatRupiah(product.discountPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-sm sm:text-lg font-black text-blue-400 font-heading tabular-nums">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
            
            {product.discountPrice && (
              <span className="text-[9px] font-extrabold text-rose-300 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded-md">
                PROMO
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-all active:scale-95"
            >
              <Eye className="w-3 h-3 text-slate-400" />
              <span>Detail</span>
            </button>

            <a
              href={waBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-bold text-white transition-all shadow-md active:scale-95 ${
                product.sold
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : isBooking
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>
                {product.sold ? 'Tanya Stok' : isBooking ? 'Tikung' : 'Beli'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
