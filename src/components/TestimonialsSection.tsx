import React, { useState, useEffect } from 'react';
import { Testimonial, StoreConfig } from '../types.ts';
import { TESTIMONIALS, STORE_CONFIG } from '../data/storeData.ts';
import { formatRupiah } from '../utils/formatters.ts';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ZoomIn, 
  X, 
  MessageCircle, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Camera,
  ExternalLink,
  BadgeCheck
} from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  config?: StoreConfig;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials: propTestis,
  config: propConfig,
}) => {
  const currentTestimonials = (propTestis && propTestis.length > 0 ? propTestis : TESTIMONIALS).filter(
    (t) => t.imageProof || t.buyerName
  );
  const currentConfig = propConfig || STORE_CONFIG;

  const [activeFilter, setActiveFilter] = useState<'all' | 'serah' | 'transfer'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : currentTestimonials.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < currentTestimonials.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, currentTestimonials.length]);

  const activeLightboxItem = lightboxIndex !== null ? currentTestimonials[lightboxIndex] : null;

  return (
    <div className="min-h-screen pb-24 lg:pb-12 pt-4">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Galeri Foto Bukti Transaksi Real 100%</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
            Foto Bukti Testimoni {currentConfig.brandName}
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Kumpulan foto screenshot asli bukti transfer, serah terima akun Free Fire, dan rebind email sukses pelanggan kami. Transaksi aman, akun sampai dengan selamat dan bergaransi!
          </p>

          {/* Stats Bar */}
          <div className="mt-5 flex items-center justify-center gap-6 text-xs sm:text-sm font-bold text-slate-700">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#08499f] font-heading block">5.0 / 5.0</span>
              <div className="flex items-center justify-center gap-1 text-amber-400 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading block">5.000+</span>
              <span className="text-slate-500 text-xs font-medium">Transaksi Sukses</span>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-2xl sm:text-3xl font-black text-purple-600 font-heading block">100%</span>
              <span className="text-slate-500 text-xs font-medium">Bukti Screenshot Asli</span>
            </div>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Menampilkan {currentTestimonials.length} Foto Bukti
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/90 shadow-sm">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#08499f] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Foto Bukti
            </button>
            <button
              onClick={() => setActiveFilter('serah')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'serah'
                  ? 'bg-[#08499f] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Serah Terima Akun
            </button>
            <button
              onClick={() => setActiveFilter('transfer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'transfer'
                  ? 'bg-[#08499f] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transfer Rekber
            </button>
          </div>
        </div>

        {/* PHOTO TESTIMONIALS GRID - Prominent Screenshot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentTestimonials.map((testi, index) => {
            const photoUrl =
              testi.imageProof ||
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={testi.id || index}
                onClick={() => setLightboxIndex(index)}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#08499f]/40 transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.99]"
              >
                {/* PHOTO SCREENSHOT PROOF CONTAINER */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={photoUrl}
                    alt={`Bukti transaksi ${testi.buyerName}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Gradient Overlay & Hover Zoom Prompt */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badge: Verified Real */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-emerald-600 text-white shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Bukti Real 100%
                    </span>
                  </div>

                  {/* Zoom Icon Button */}
                  <div className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-black/60 text-white group-hover:bg-[#08499f] backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 text-xs font-bold">
                    <ZoomIn className="w-4 h-4" />
                    <span className="hidden group-hover:inline text-[11px]">Lihat Foto Penuh</span>
                  </div>

                  {/* Floating Date Tag */}
                  <div className="absolute bottom-3 left-3 text-[11px] text-white/90 font-medium drop-shadow">
                    📅 {testi.date}
                  </div>
                </div>

                {/* DETAILS BELOW THE PHOTO */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Buyer Name & Verification */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base font-heading">
                          {testi.buyerName}
                        </span>
                        {testi.verified && (
                          <BadgeCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        )}
                      </div>

                      <div className="flex items-center text-amber-400">
                        {[...Array(testi.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Account Purchased Pill */}
                    <div className="mt-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 truncate pr-2">
                        🎮 {testi.accountBought}
                      </span>
                      <span className="font-black text-[#08499f] font-heading shrink-0">
                        {formatRupiah(testi.price)}
                      </span>
                    </div>
                  </div>

                  {/* Comment Quote */}
                  {testi.comment && (
                    <p className="text-xs text-slate-600 italic line-clamp-2 leading-relaxed pt-1 border-t border-slate-100">
                      "{testi.comment}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Join Community CTA */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-[#08499f] to-indigo-900 text-white text-center shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-blue-100 text-xs font-bold mb-3 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Saluran Resmi Update Harian</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-heading">
            Ingin Melihat Ratusan Foto Bukti Testimoni Lainnya?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-lg mx-auto leading-relaxed">
            Bergabunglah dengan Saluran WhatsApp Resmi All Testimoni {currentConfig.brandName} untuk bukti transfer, testimoni serah akun, dan rekber harian terupdate.
          </p>
          <a
            href="https://whatsapp.com/channel/0029VbCtccs6GcGFguxmt30B"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Buka Saluran WhatsApp All Testimoni</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
          </a>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX PHOTO VIEWER MODAL */}
      {lightboxIndex !== null && activeLightboxItem && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar with Close & Info */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white pb-3 px-2 z-10">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base font-heading">
                {activeLightboxItem.buyerName}
              </span>
              <span className="text-xs text-slate-400">
                • {activeLightboxItem.accountBought} ({formatRupiah(activeLightboxItem.price)})
              </span>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition-colors"
              aria-label="Tutup Foto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo Container with Arrow Navigation */}
          <div
            className="relative max-w-4xl max-h-[78vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeLightboxItem.imageProof || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'}
              alt={`Foto bukti ${activeLightboxItem.buyerName}`}
              className="max-w-full max-h-[78vh] object-contain rounded-xl select-none"
            />

            {/* Prev Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : currentTestimonials.length - 1
                );
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null && prev < currentTestimonials.length - 1 ? prev + 1 : 0
                );
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
              aria-label="Foto Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption */}
          <div
            className="w-full max-w-4xl text-center text-xs text-slate-300 pt-3 px-4 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] text-slate-400">
              Foto {lightboxIndex + 1} dari {currentTestimonials.length}
            </span>
            <span className="text-xs text-white font-medium italic truncate max-w-md">
              "{activeLightboxItem.comment}"
            </span>
            <span className="text-[11px] text-emerald-400 font-bold">
              ✓ Garansi Akun Berhasil
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
