import React from 'react';
import { StoreSettings } from './AdminPanel/AdminPanelModal';
import { 
  Wrench, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface MaintenanceScreenProps {
  storeSettings: StoreSettings;
  onOpenAdmin: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  storeSettings,
  onOpenAdmin
}) => {
  const brandName = storeSettings.brandName || 'Pionz Store';
  const waNumber = storeSettings.waNumber || '6285643698411';
  const logoUrl = storeSettings.logoUrl || 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg';
  
  const title = storeSettings.maintenanceTitle || 'Pemeliharaan Sistem & Update Stok Akun';
  const message = storeSettings.maintenanceMessage || 
    'Website sedang dalam peningkatan sistem keamanan transaksi dan pembaruan katalog akun game Free Fire terbaru. Anda tetap dapat melakukan order dan konsultasi langsung melalui WhatsApp resmi admin.';
  const eta = storeSettings.maintenanceEta || 'Estimasi Selesai: 15 - 30 Menit (Hari Ini)';

  const waOrderLink = `https://wa.me/${waNumber}?text=Halo%20Admin%20${encodeURIComponent(brandName)}%2C%20saya%20mau%20order%20%2F%20tanya%20stok%20akun%20Free%20Fire%20selagi%20website%20sedang%20maintenance.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#08204d] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2.5">
          <img 
            src={logoUrl} 
            alt={brandName}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg';
            }}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <h1 className="font-heading font-extrabold text-base sm:text-lg text-white">
                {brandName}
              </h1>
              <VerifiedBadge size={16} />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Marketplace Akun Game Terpercaya
            </p>
          </div>
        </div>

        {/* Status Pill Indicator */}
        <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
            Under Maintenance
          </span>
        </div>
      </header>

      {/* Center Main Card */}
      <main className="max-w-2xl mx-auto w-full my-auto py-8 sm:py-12 z-10 text-center space-y-6">
        
        {/* Animated Glow Wrench Icon */}
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
          <div className="absolute inset-0 bg-blue-500/30 rounded-3xl blur-xl animate-pulse"></div>
          <div className="relative w-full h-full bg-slate-900 border border-blue-500/40 rounded-3xl shadow-2xl flex items-center justify-center text-blue-400">
            <Wrench className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1.5 text-slate-950 shadow-md">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {/* Estimated Completion Box */}
        {eta && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-xs font-semibold text-slate-300 shadow-inner backdrop-blur-sm">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{eta}</span>
          </div>
        )}

        {/* WhatsApp & Fast Contact Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <a
            href={waOrderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Chat Admin WhatsApp</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>Nomor WA: +{waNumber}</span>
          </a>
        </div>

        {/* Guarantees Reminder */}
        <div className="pt-4 grid grid-cols-2 gap-2 text-left max-w-md mx-auto">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-300 font-medium">Garansi 100% Anti HB</span>
          </div>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-[11px] text-slate-300 font-medium">Bimbingan Rebind Aman</span>
          </div>
        </div>

      </main>

      {/* Bottom Footer with Private Admin Access */}
      <footer className="max-w-4xl mx-auto w-full flex items-center justify-between text-xs text-slate-500 z-10 pt-4 border-t border-slate-800/80">
        <span>© {new Date().getFullYear()} {brandName}. Hak Cipta Dilindungi.</span>

        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Login Akses Pemilik Toko</span>
        </button>
      </footer>

    </div>
  );
};
