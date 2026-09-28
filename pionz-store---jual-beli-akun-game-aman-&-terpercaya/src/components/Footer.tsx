import React from 'react';
import { VerifiedBadge } from './VerifiedBadge';
import { StoreSettings } from './AdminPanel/AdminPanelModal';
import { ShieldCheck, MessageCircle, Lock } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  storeSettings: StoreSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, storeSettings, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={storeSettings.logoUrl}
                alt={storeSettings.brandName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg';
                }}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/20"
              />
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                  {storeSettings.brandName}
                </span>
                <VerifiedBadge size={18} />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Marketplace jual beli akun game Free Fire, Mobile Legends, Roblox, dan PUBG Mobile dengan transaksi aman, terpercaya, dan bergaransi anti hackback.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Open Setiap Hari: {storeSettings.operationalHours}</span>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white mb-3 tracking-wide uppercase">
              Navigasi Menu
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Beranda Toko
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-white transition-colors">
                  Katalog Akun Lengkap
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('groups')} className="hover:text-white transition-colors">
                  Grup WhatsApp & Admin
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('help')} className="hover:text-white transition-colors">
                  Pusat Bantuan & CS
                </button>
              </li>
            </ul>
          </div>

          {/* Keamanan & Garansi */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white mb-3 tracking-wide uppercase">
              Jaminan Transaksi
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{storeSettings.guaranteeText || 'Garansi 100% Anti Hackback 15 - 30 Hari'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rebind dipandu admin sampai email pembeli terhubung</span>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>WhatsApp Admin Resmi Terverifikasi: +{storeSettings.waNumber}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom separator, copyright and discreet private admin access */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 {storeSettings.brandName}. Semua hak cipta dilindungi.</p>
          <div className="flex items-center gap-2">
            <span>Website Jual Beli Akun Game Terbaik & Amanah</span>
            
            {/* Discreet Admin Lock icon for private access */}
            <button
              onClick={onOpenAdmin}
              className="text-slate-700 hover:text-slate-400 transition-colors p-1 rounded-md opacity-40 hover:opacity-100"
              title="Private System"
              aria-label="Private Access"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
