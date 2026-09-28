import React from 'react';
import { Product, STORE_INFO } from '../data/storeData';
import { Star, ShieldCheck, Flame, Zap, ArrowRight, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onDirectBuy: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onDirectBuy
}) => {
  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const currentPrice = product.discountPrice ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const isSold = !!product.sold;
  const isDp = !isSold && !!product.isDp;

  const getBadgeStyle = (badge: string) => {
    switch (badge.toUpperCase()) {
      case 'HOT':
        return 'bg-gradient-to-r from-orange-500 to-rose-500 text-white';
      case 'SULTAN':
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white';
      case 'PELAJAR':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white';
      case 'FLASH':
        return 'bg-gradient-to-r from-red-600 to-amber-500 text-white animate-pulse';
      default:
        return 'bg-[#08499f] text-white';
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.99]"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/banner.jpg';
          }}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSold ? 'grayscale contrast-125 opacity-75' : isDp ? 'opacity-90' : ''
          }`}
        />

        {/* Sold Out Overlay Banner */}
        {isSold && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider -rotate-6 border-2 border-white/80">
              TERJUAL (SOLD)
            </span>
          </div>
        )}

        {/* DP / Booked Overlay Ribbon */}
        {isDp && (
          <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[11px] sm:text-xs font-black px-3 py-1 rounded-lg shadow-lg uppercase tracking-wider -rotate-6 border border-white/80 flex items-center gap-1">
              <span>TER-BOOKING (DP)</span>
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          {isDp && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wide">
              DP TERBAYAR
            </span>
          )}
          {!isSold && !isDp && product.badge && (
            <span className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wide ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          )}
          {product.flash && !isSold && !isDp && (
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5 uppercase">
              <Zap className="w-3 h-3 fill-slate-900" />
              FLASH
            </span>
          )}
        </div>

        {/* Code badge top right */}
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20">
            {product.accountCode}
          </span>
        </div>

        {/* Game Tag Bottom Left */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.game}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-[#08499f] transition-colors mb-1.5">
            {product.name}
          </h4>

          {/* Quick Specs Snippet */}
          <div className="space-y-1 mb-2.5">
            {product.specs.slice(0, 2).map((spec, i) => (
              <p key={i} className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 flex items-start gap-1">
                <span className="text-[#08499f] font-bold shrink-0">•</span>
                <span className="truncate">{spec}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Price & Rating & Action */}
        <div className="pt-2 border-t border-slate-100 mt-auto">
          {/* Original price strikethrough if discounted */}
          {originalPrice && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {formatRupiah(originalPrice)}
              </span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded">
                Hemat {formatRupiah(originalPrice - currentPrice)}
              </span>
            </div>
          )}

          {/* Current Price */}
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <span className="font-heading font-extrabold text-sm sm:text-base lg:text-lg text-[#08499f] tracking-tight">
              {formatRupiah(currentPrice)}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>5.0</span>
            </div>
          </div>

          {/* Action Button */}
          {isSold ? (
            <button
              disabled
              className="w-full py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed text-center"
            >
              Stok Habis
            </button>
          ) : isDp ? (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(product);
                }}
                className="w-full py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-center border border-amber-200"
              >
                Cek DP
              </button>
              <button
                onClick={(e) => onDirectBuy(product, e)}
                className="w-full py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 active:scale-95 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                title="Tanya Antrian / Sisa DP ke Admin"
              >
                <span>Booked</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(product);
                }}
                className="w-full py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#08499f] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
              >
                Detail
              </button>
              <button
                onClick={(e) => onDirectBuy(product, e)}
                className="w-full py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-[#08499f] hover:bg-blue-700 active:scale-95 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <span>Beli</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
