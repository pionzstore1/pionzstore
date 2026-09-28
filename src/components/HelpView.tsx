import React, { useState } from 'react';
import { FAQS, STORE_INFO } from '../data/storeData';
import { StoreSettings } from './AdminPanel/AdminPanelModal';
import { VerifiedBadge } from './VerifiedBadge';
import { 
  Headphones, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileCheck2,
  PhoneCall
} from 'lucide-react';

interface HelpViewProps {
  storeSettings?: StoreSettings;
}

export const HelpView: React.FC<HelpViewProps> = ({ storeSettings }) => {
  const currentBrand = storeSettings?.brandName || STORE_INFO.brandName;
  const currentWa = storeSettings?.waNumber || STORE_INFO.waNumber;
  const currentHours = storeSettings?.operationalHours || STORE_INFO.operationalHours;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#08499f] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full inline-block">
          Pusat Bantuan & Layanan Konsumen
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
          Layanan Resmi {currentBrand}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Butuh bantuan transaksi, panduan ganti data akun, atau konfirmasi ketersediaan stok? Hubungi admin resmi kami kapan saja.
        </p>
      </div>

      {/* Direct Contact Admin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Fast Response WhatsApp Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 fill-emerald-600/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                  Customer Service WhatsApp
                </h3>
                <VerifiedBadge size={16} />
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Chat langsung dengan admin bertugas untuk respon cepat, cek stok realtime, dan transaksi akun game.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-[#08499f] shrink-0" />
              <span>Jam Operasional: {currentHours}</span>
            </div>
          </div>

          <div className="mt-5">
            <a
              href={`https://wa.me/${currentWa}?text=Halo%20Admin%20${encodeURIComponent(currentBrand)}%2C%20saya%20butuh%20bantuan%20layanan`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat WhatsApp Admin (+{currentWa})</span>
            </a>
          </div>
        </div>

        {/* Security & Guarantee Info Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#08499f] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                Jaminan & Garansi Transaksi
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Setiap transaksi akun game di {currentBrand} diproses secara transparan dengan jaminan keamanan data.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garansi resmi Anti Hackback (HB) terjamin</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Didampingi rebind email & ubah no HP sampai tuntas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Akun telah melewati verifikasi kelayakan spek</span>
              </li>
            </ul>
          </div>

          <div className="mt-5">
            <a
              href={`https://wa.me/${currentWa}?text=Halo%20Admin%20${encodeURIComponent(currentBrand)}%2C%20saya%20ingin%20konsultasi%20garansi%20akun`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#08499f] hover:bg-blue-800 active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Headphones className="w-4 h-4" />
              <span>Konsultasi Transaksi</span>
            </a>
          </div>
        </div>

      </div>

      {/* Cara Transaksi Singkat */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card">
        <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-4 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#08499f]" />
          <span>Panduan Mudah Transaksi di {currentBrand}</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#08499f] text-white font-black text-xs grid place-items-center">
              1
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Pilih Akun</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cari akun impianmu di katalog beranda dan periksa detail spek melalui fitur perbesar gambar.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#08499f] text-white font-black text-xs grid place-items-center">
              2
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Chat WhatsApp</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Klik tombol "Beli via WhatsApp". Format order akan otomatis dikirimkan ke nomor admin resmi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#08499f] text-white font-black text-xs grid place-items-center">
              3
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Rebind & Garansi</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Admin membimbing penggantian data login akun (email/no HP) sampai terpasang aman 100%.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#08499f]" />
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-4.5 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-[#08499f] flex items-center justify-between gap-3 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#08499f] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
