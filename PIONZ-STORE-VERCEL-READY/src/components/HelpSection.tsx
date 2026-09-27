import React from 'react';
import { StoreConfig } from '../types.ts';
import { STORE_CONFIG } from '../data/storeData.ts';
import { 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  PhoneCall,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Headphones
} from 'lucide-react';

interface HelpSectionProps {
  config?: StoreConfig;
}

export const HelpSection: React.FC<HelpSectionProps> = ({ config: propConfig }) => {
  const currentConfig = propConfig || STORE_CONFIG;

  const quickWaTopics = [
    {
      title: 'Tanya Stok & Spesifikasi Akun',
      desc: 'Cek akun Free Fire ready, spek sultan, atau budget pelajar.',
      msg: `Halo Admin ${currentConfig.brandName}, saya ingin menanyakan ketersediaan stok akun Free Fire ready hari ini.`,
      btnText: 'Chat Tanya Stok',
    },
    {
      title: 'Bantuan Transaksi Rekber & DP',
      desc: 'Panduan pembayaran aman, booking akun, dan konfirmasi transfer.',
      msg: `Halo Admin ${currentConfig.brandName}, saya butuh bantuan untuk proses pembayaran dan transaksi aman rekber.`,
      btnText: 'Bantuan Transaksi',
    },
    {
      title: 'Garansi Akun & Rebind Email',
      desc: 'Bimbingan pemindahan data akun ke email pribadi sampai tuntas.',
      msg: `Halo Admin ${currentConfig.brandName}, saya butuh panduan rebind email akun dan garansi akun.`,
      btnText: 'Panduan Garansi',
    },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-12 pt-4">
      <div className="mx-auto w-full max-w-4xl px-4">
        {/* Main WhatsApp Help Hero Card */}
        <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl text-center mb-6 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span>Customer Service WhatsApp Resmi</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight">
            Pusat Bantuan {currentConfig.brandName}
          </h2>

          <p className="mt-3 text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Seluruh layanan bantuan, konsultasi akun, nego harga, serta proses transaksi diarahkan langsung ke WhatsApp resmi admin agar cepat, aman, dan bergaransi resmi.
          </p>

          {/* Primary Action Button - Direct to WhatsApp */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${currentConfig.waNumber}?text=${encodeURIComponent(`Halo Admin ${currentConfig.brandName}, saya butuh bantuan seputar akun & transaksi Free Fire.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/50 active:scale-95 transition-all group"
            >
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Hubungi CS WhatsApp Sekarang</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </a>
          </div>

          {/* Service Guarantee Info Badges */}
          <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-300">
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Jam Buka: <strong>{currentConfig.operatingHours}</strong></span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nomor Admin: <strong>+{currentConfig.waNumber}</strong></span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Layanan: <strong>Fast Respon 5-15 Menit</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Topic Cards to WhatsApp */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-black text-white font-heading mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pilih Topik Bantuan Langsung ke WhatsApp</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {quickWaTopics.map((topic, i) => (
              <div
                key={i}
                className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between hover:border-blue-500/40 transition-all text-white"
              >
                <div>
                  <h4 className="font-extrabold text-white text-sm mb-1.5 font-heading">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {topic.desc}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${currentConfig.waNumber}?text=${encodeURIComponent(topic.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{topic.btnText}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Purchasing Guide */}
        <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl mb-6 text-white">
          <h3 className="text-lg font-black text-white font-heading mb-1 flex items-center gap-2">
            <span>🛡️</span>
            <span>4 Langkah Transaksi Aman & Bergaransi</span>
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            Panduan resmi serah terima akun Free Fire bersama Bantuan Admin Pionz Store.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-2.5">
                1
              </span>
              <h4 className="font-bold text-white text-sm mb-1">Pilih Akun</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih akun Free Fire yang diinginkan di menu Katalog Toko.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-2.5">
                2
              </span>
              <h4 className="font-bold text-white text-sm mb-1">Chat WhatsApp</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Klik tombol Beli via WhatsApp untuk konfirmasi ketersediaan stok.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-2.5">
                3
              </span>
              <h4 className="font-bold text-white text-sm mb-1">Transaksi Aman</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lakukan transfer ke rekening/QRIS resmi yang diberikan admin.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center mb-2.5">
                4
              </span>
              <h4 className="font-bold text-emerald-300 text-sm mb-1">Garansi Akun</h4>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Admin pandu serah terima dan rebind email sampai 100% aman bergaransi!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
