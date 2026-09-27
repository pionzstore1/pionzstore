import React, { useState, useEffect } from 'react';
import { Product, StoreConfig } from '../types.ts';
import { STORE_CONFIG } from '../data/storeData.ts';
import { 
  formatRupiah, 
  getBadgeColorClass, 
  createWhatsAppBuyUrl,
} from '../utils/formatters.ts';
import { 
  X, 
  Share2, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  BadgeCheck,
  Star, 
  Flame, 
  Crown, 
  GraduationCap, 
  Sparkles, 
  Copy, 
  Check, 
  ZoomIn, 
  Clock
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  config?: StoreConfig;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  config,
}) => {
  const currentConfig = config || STORE_CONFIG;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    setSelectedImageIndex(0);
    setIsCopied(false);
  }, [product]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomOpen) setIsZoomOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, onClose]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[selectedImageIndex] || product.image;
  const waBuyUrl = createWhatsAppBuyUrl(product, currentConfig);
  const isSoldOrDp = product.sold || product.name.toUpperCase().includes('SOLD DI DP');
  const isBooking = product.name.toUpperCase().includes('SOLD DI DP');

  const handleCopyLink = () => {
    const url = `${window.location.origin}?product=${product.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge?.toUpperCase()) {
      case 'HOT':
        return <Flame className="w-4 h-4 fill-red-400 text-red-400" />;
      case 'SULTAN':
        return <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />;
      case 'PELAJAR':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'LIMITED':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Star className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
        <div 
          className="relative w-full max-w-3xl bg-[#0c1220] rounded-3xl shadow-2xl overflow-hidden border border-slate-800 my-auto flex flex-col max-h-[92vh] text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#090d16]/80 sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Free Fire
              </span>
              <span className="text-xs font-mono text-slate-400 truncate max-w-[150px] sm:max-w-none">
                ID: {product.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Salin Link Produk"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Salin Link'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Scrollable */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Left Column: Image Viewer */}
              <div className="space-y-3">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Zoom Action Overlay */}
                  <button
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold border border-white/10"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Perbesar</span>
                  </button>

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase backdrop-blur-md bg-black/70 text-white border border-white/10 shadow-md">
                      {getBadgeIcon(product.badge)}
                      <span>{product.badge}</span>
                    </div>
                  </div>

                  {/* Status Overlay if Sold */}
                  {product.sold && (
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-base tracking-wider uppercase shadow-xl rotate-[-4deg] border border-red-500">
                        TERJUAL (SOLD OUT)
                      </div>
                    </div>
                  )}

                  {isBooking && !product.sold && (
                    <div className="absolute inset-0 bg-amber-950/70 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-sm uppercase shadow-xl border border-amber-400">
                        SOLD DI DP (BISA TIKUNG)
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnails if multiple images */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Safety Guarantee Info Box */}
                <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-900/50 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-400">
                    <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Transaksi Aman & Garansi Akun</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Setiap pembelian akun didampingi langsung oleh Bantuan Admin {currentConfig.brandName} sampai proses serah terima tuntas dan aman. Transaksi aman dan bergaransi resmi!
                  </p>
                </div>
              </div>

              {/* Right Column: Details & Specs */}
              <div className="flex flex-col justify-between space-y-5">
                <div>
                  {/* Rating & Availability */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>5.0</span>
                      <span className="text-slate-500 font-normal">Rating Penjual</span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${
                        product.sold
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : isBooking
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {product.sold ? 'Sudah Terjual' : isBooking ? 'Booking DP' : 'Stok Ready'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug font-heading">
                    {product.name}
                  </h3>

                  {/* Price Banner */}
                  <div className="mt-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">
                        Harga Akun
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        {product.discountPrice ? (
                          <>
                            <span className="text-2xl font-black text-rose-400 font-heading tabular-nums">
                              {formatRupiah(product.discountPrice)}
                            </span>
                            <span className="text-sm line-through text-slate-500 font-mono font-semibold">
                              {formatRupiah(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-black text-blue-400 font-heading tabular-nums">
                            {formatRupiah(product.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {product.discountPrice && (
                      <span className="px-3 py-1 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 font-black text-xs shadow-sm">
                        PROMO
                      </span>
                    )}
                  </div>

                  {/* Specifications Section */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Spesifikasi Akun Lengkap:
                    </h4>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {product.specs?.map((spec, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <a
                    href={waBuyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${
                      product.sold
                        ? 'bg-slate-700 hover:bg-slate-600'
                        : isBooking
                        ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>
                      {product.sold
                        ? 'Tanya Stok Serupa via WhatsApp'
                        : isBooking
                        ? 'Tikung Akun Langsung'
                        : 'Beli Sekarang via WhatsApp'}
                    </span>
                  </a>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {currentConfig.operatingHours}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="hover:underline flex items-center gap-1 text-blue-400 font-semibold"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Bagikan Akun Ini
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-fadeIn backdrop-blur-md"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm"
              aria-label="Tutup Zoom"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div 
            className="max-w-4xl max-h-[85vh] relative flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt="Zoomed preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {images.length > 1 && (
            <div 
              className="mt-4 flex items-center gap-2 overflow-x-auto p-2 bg-black/60 rounded-2xl backdrop-blur-md border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                    selectedImageIndex === idx ? 'border-blue-500 scale-105' : 'border-white/30 opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
