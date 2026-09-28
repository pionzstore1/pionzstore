import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Product, STORE_INFO } from '../data/storeData';
import { 
  X, 
  MessageCircle, 
  ShieldCheck, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  Star, 
  Maximize2,
  ExternalLink,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { StoreSettings } from './AdminPanel/AdminPanelModal';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  storeSettings?: StoreSettings;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  storeSettings
}) => {
  if (!product) return null;

  const currentBrand = storeSettings?.brandName || STORE_INFO.brandName;
  const currentWa = storeSettings?.waNumber || STORE_INFO.waNumber;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [copied, setCopied] = useState(false);

  // Pan / drag state for high detail inspection
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{ dist: number; x: number; y: number } | null>(null);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const currentPrice = product.discountPrice ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const isSold = !!product.sold;
  const isDp = !isSold && !!product.isDp;
  const dpAmount = product.dpAmount || 0;
  const dpRemaining = Math.max(0, currentPrice - dpAmount);

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const orderMessage = isDp 
    ? `Halo Admin ${currentBrand}, saya ingin menanyakan akun [${product.accountCode}] ${encodeURIComponent(product.name)} yang saat ini berstatus TER-BOOKING DP.%0A%0AApakah akun ini masih ada antrean atau bisa di-take over jika pembeli batal?`
    : `Halo Admin ${currentBrand}, saya berminat membeli akun berikut:%0A%0A` +
      `• Game: ${encodeURIComponent(product.game)}%0A` +
      `• Judul: ${encodeURIComponent(product.name)}%0A` +
      `• Kode Akun: ${encodeURIComponent(product.accountCode)}%0A` +
      `• Harga: ${encodeURIComponent(formatRupiah(currentPrice))}%0A%0A` +
      `Apakah akun ini masih tersedia dan bisa langsung transaksi?`;

  const negoMessage = `Halo Admin ${currentBrand}, untuk akun [${product.accountCode}] ${encodeURIComponent(product.name)} apakah harganya masih bisa dinego?`;

  const handleCopyOrderFormat = () => {
    const textToCopy = `FORMAT ORDER ${currentBrand}\nGame: ${product.game}\nKode Akun: ${product.accountCode}\nJudul: ${product.name}\nHarga: ${formatRupiah(currentPrice)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openZoomModal = () => {
    setZoomScale(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(true);
  };

  const zoomIn = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale((prev) => Math.min(Number((prev + 0.5).toFixed(1)), 5));
  }, []);

  const zoomOut = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale((prev) => {
      const next = Math.max(Number((prev - 0.5).toFixed(1)), 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const resetZoom = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomScale > 1) {
      resetZoom();
    } else {
      setZoomScale(2.5);
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomScale((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 5));
    } else {
      setZoomScale((prev) => {
        const next = Math.max(Number((prev - 0.25).toFixed(2)), 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale > 1) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & pinch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoomScale > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      touchStartRef.current = {
        dist,
        x: position.x,
        y: position.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && zoomScale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y
      });
    } else if (e.touches.length === 2 && touchStartRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = dist / touchStartRef.current.dist;
      setZoomScale((prev) => Math.min(Math.max(Number((prev * (ratio > 1 ? 1.04 : 0.96)).toFixed(2)), 1), 5));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current = null;
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, onClose]);

  const activeImageUrl = images[activeImageIndex] || product.image;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-200"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-[#08499f] bg-blue-100/80 px-2.5 py-1 rounded-lg">
                {product.accountCode}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {product.game}
              </span>
              {product.badge && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {product.badge}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            {/* Gallery + Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Left Column: Image Preview with Click to Zoom indicator */}
              <div className="space-y-3">
                <div 
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 group border border-slate-200 cursor-pointer shadow-sm select-none"
                  onClick={openZoomModal}
                  title="Klik untuk zoom & lihat spek lengkap HD"
                >
                  <img
                    src={activeImageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/banner.jpg';
                    }}
                    className="w-full h-full object-contain sm:object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ imageRendering: 'auto' }}
                  />
                  
                  {/* Persistent HD Zoom Badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 hover:bg-black backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all">
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    <span>Zoom Foto Spek (HD)</span>
                  </div>

                  <div className="absolute top-2.5 left-2.5 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Kualitas HD</span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 text-xs font-bold pointer-events-none">
                    <Maximize2 className="w-5 h-5 text-white" />
                    <span>Klik Untuk Perbesar Spek</span>
                  </div>

                  {isSold && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-rose-600 text-white font-extrabold text-sm px-4 py-2 rounded-xl shadow-lg -rotate-6">
                        TERJUAL (SOLD)
                      </span>
                    </div>
                  )}

                  {isDp && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-extrabold text-sm px-4 py-2 rounded-xl shadow-xl -rotate-6 border border-white/60 text-center">
                        <span className="block">TER-BOOKING (DP)</span>
                        {dpAmount > 0 && (
                          <span className="text-[10px] font-normal block opacity-95">DP: {formatRupiah(dpAmount)}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx ? 'border-[#08499f] ring-2 ring-blue-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Thumbnail ${idx}`} 
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/banner.jpg'; }}
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Account Security Badge */}
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#08499f] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 space-y-0.5">
                    <p className="font-bold text-[#08499f]">Jaminan Keamanan {currentBrand}</p>
                    <p className="text-slate-600">
                      Semua akun dicek teliti. Rebind dipandu admin sampai email pembeli terpasang 100% aman bergaransi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Specs & Price */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#08499f] bg-blue-50 px-2 py-0.5 rounded">
                      {product.game}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>5.0 (Verified)</span>
                    </div>
                  </div>

                  <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                    {product.name}
                  </h2>

                  {/* Price Section */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Harga Akun:
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#08499f]">
                          {formatRupiah(currentPrice)}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-semibold">
                            {formatRupiah(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {isDp ? (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        Ter-booking DP ⏳
                      </span>
                    ) : product.flash ? (
                      <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg shadow-sm">
                        Flash Sale 🔥
                      </span>
                    ) : null}
                  </div>

                  {/* DP Breakdown Card if Booked */}
                  {isDp && (
                    <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-900">
                        <span>Status Booking:</span>
                        <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded">DP Terbayar</span>
                      </div>
                      {dpAmount > 0 && (
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Nominal DP Masuk:</span>
                          <span className="font-bold text-emerald-600">{formatRupiah(dpAmount)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-slate-700">
                        <span>Sisa Pelunasan:</span>
                        <span className="font-bold text-rose-600">{formatRupiah(dpRemaining)}</span>
                      </div>
                      {product.dpBuyerNote && (
                        <div className="pt-1 border-t border-amber-200/60 text-[11px] text-slate-600">
                          <span>Catatan: </span>
                          <span className="italic">{product.dpBuyerNote}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Specifications Checklist */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <span>Detail & Spesifikasi Akun:</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/70 max-h-48 overflow-y-auto">
                      {product.specs && product.specs.length > 0 ? (
                        product.specs.map((spec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#08499f] mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{spec}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400 italic">Lihat gambar untuk spesifikasi lengkap.</li>
                      )}
                    </ul>
                  </div>
                </div>

              </div>

            </div>

            {/* Action Buttons Row */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Copy Format Button */}
              <button
                type="button"
                onClick={handleCopyOrderFormat}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Format Tersalin!' : 'Salin Format Order'}</span>
              </button>

              {/* WhatsApp CTAs */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <a
                  href={`https://wa.me/${currentWa}?text=${negoMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-[#08499f] text-slate-700 text-xs font-bold transition-all text-center"
                >
                  Nego via WhatsApp
                </a>

                {isSold ? (
                  <button
                    disabled
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs cursor-not-allowed"
                  >
                    Sudah Terjual
                  </button>
                ) : (
                  <a
                    href={`https://wa.me/${currentWa}?text=${orderMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Beli via WhatsApp</span>
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULLSCREEN HD ZOOM INSPECTOR LIGHTBOX */}
      {/* ======================================================== */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-2 sm:p-4 select-none touch-none"
          onClick={() => setIsZoomed(false)}
        >
          {/* Top Control Bar */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-5xl mx-auto flex items-center justify-between text-white z-10 px-2 py-1.5 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold bg-white/20 px-3 py-1 rounded-xl backdrop-blur-md">
                Zoom {Math.round(zoomScale * 100)}%
              </span>
              <span className="bg-emerald-500/80 text-[10px] font-bold px-2 py-0.5 rounded-md hidden sm:inline">
                HD Original
              </span>
              <span className="text-[11px] text-slate-300 hidden md:inline">
                (Geser/drag gambar untuk periksa vault, bundle, dan evo gun)
              </span>
            </div>

            {/* Zoom Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={zoomIn}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors active:scale-95"
                title="Perbesar (Zoom In)"
              >
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomScale <= 1}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-40 text-white flex items-center justify-center transition-colors active:scale-95"
                title="Perkecil (Zoom Out)"
              >
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={resetZoom}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors active:scale-95"
                title="Reset Zoom (100%)"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Open Raw Image in New Tab */}
              <a
                href={activeImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors active:scale-95"
                title="Buka Foto Resolusi Penuh di Tab Baru"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setIsZoomed(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center font-bold transition-colors ml-1 active:scale-95"
                title="Tutup Zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Zoomable Image Canvas */}
          <div 
            className="flex-1 w-full flex items-center justify-center overflow-hidden relative my-2"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleTap}
            style={{ 
              cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (zoomScale === 1) {
                zoomIn();
              }
            }}
          >
            <img
              src={activeImageUrl}
              alt="Foto Spek HD Akun"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/banner.jpg'; }}
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomScale})`,
                transition: isDragging ? 'none' : 'transform 0.12s ease-out',
                imageRendering: 'auto'
              }}
              className="max-h-[82vh] max-w-[95vw] object-contain rounded-lg shadow-2xl pointer-events-auto"
            />
          </div>

          {/* Bottom Thumbnails & Helper Hint */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-xl mx-auto flex flex-col items-center gap-1.5 pb-1"
          >
            {/* Multiple Photos Selector if available */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 p-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 overflow-x-auto max-w-full">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      resetZoom();
                    }}
                    className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-blue-400 ring-2 ring-blue-500/50 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="text-center text-[11px] sm:text-xs text-slate-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              {zoomScale === 1 
                ? 'Klik foto / tombol (+) / scroll mouse untuk zoom hingga 500% • Dobel klik untuk zoom instan' 
                : `Zoom ${Math.round(zoomScale * 100)}% aktif • Tarik / drag untuk menggeser foto spek`}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
