import React, { useRef, useState, useEffect } from 'react';
import { VerifiedBadge } from './VerifiedBadge';
import { StoreSettings } from './AdminPanel/AdminPanelModal';
import { 
  Search, 
  MessageCircle, 
  Home, 
  Grid,
  Users, 
  HelpCircle,
  Megaphone,
  Wrench
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  storeSettings: StoreSettings;
  onOpenAdmin: () => void;
}

const CANONICAL_LOGO = 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg';

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  storeSettings,
  onOpenAdmin
}) => {
  // Secret 5-clicks detector on Logo for private admin access
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [imgSrc, setImgSrc] = useState<string>(() => {
    return storeSettings.logoUrl && storeSettings.logoUrl !== '/logo.jpg'
      ? storeSettings.logoUrl 
      : CANONICAL_LOGO;
  });

  useEffect(() => {
    if (storeSettings.logoUrl && storeSettings.logoUrl !== '/logo.jpg') {
      setImgSrc(storeSettings.logoUrl);
    } else {
      setImgSrc(CANONICAL_LOGO);
    }
  }, [storeSettings.logoUrl]);

  const handleLogoClick = () => {
    setActiveTab('home');

    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      onOpenAdmin();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 2500);
    }
  };

  const statusText = storeSettings.storeStatus === 'closed' 
    ? 'Tutup Sementara' 
    : storeSettings.storeStatus === 'restock' 
      ? 'Sedang Restock' 
      : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      
      {/* 1. Maintenance Warning Bar (When active and admin is viewing) */}
      {storeSettings.isMaintenanceMode && (
        <div className="bg-amber-600 text-white text-[11px] sm:text-xs font-bold py-1.5 px-3 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-1.5 mx-auto">
            <Wrench className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Mode Maintenance Aktif: Pengunjung biasa melihat halaman pemeliharaan.</span>
          </div>
          <button
            onClick={onOpenAdmin}
            className="underline hover:text-amber-100 shrink-0 text-[10px] sm:text-xs font-extrabold ml-2"
          >
            Kelola Maintenance
          </button>
        </div>
      )}

      {/* 2. Running Announcement Banner */}
      {storeSettings.showAnnouncement && storeSettings.announcementText && !storeSettings.isMaintenanceMode && (
        <div className="bg-gradient-to-r from-[#08499f] via-blue-700 to-[#08499f] text-white text-[11px] sm:text-xs font-semibold py-1 px-3 flex items-center gap-2 overflow-hidden shadow-sm">
          <div className="flex items-center gap-1.5 shrink-0 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Megaphone className="w-3 h-3 text-amber-300" />
            <span>Info</span>
          </div>
          <p className="truncate text-white/95">
            {storeSettings.announcementText}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Brand Logo & Name (Secret 5-click triggers private admin login) */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
            title={`${storeSettings.brandName} - Klik 5x untuk akses privat`}
          >
            <div className="relative">
              <img 
                src={imgSrc} 
                alt={`${storeSettings.brandName} Logo`}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (imgSrc !== CANONICAL_LOGO) {
                    setImgSrc(CANONICAL_LOGO);
                  } else {
                    setImgSrc('/logo.jpg');
                  }
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover ring-2 ring-[#08499f]/20 group-hover:scale-105 transition-transform shadow-sm"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${
                storeSettings.storeStatus === 'closed' ? 'bg-rose-500' : storeSettings.storeStatus === 'restock' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg sm:text-xl text-[#08499f] tracking-tight group-hover:text-blue-700 transition-colors">
                  {storeSettings.brandName}
                </span>
                <VerifiedBadge size={18} className="translate-y-[-1px]" />
                {statusText && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 hidden sm:inline-block">
                    {statusText}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-none">
                Jual Beli Akun Game Aman & Terpercaya
              </p>
            </div>
          </div>

          {/* Search bar on desktop (active when in catalog) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari akun Free Fire, MLBB, Roblox, spek..."
                value={searchQuery}
                onFocus={() => {
                  if (activeTab !== 'categories') setActiveTab('categories');
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'categories') setActiveTab('categories');
                }}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-[#08499f] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 grid place-items-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'home' ? 'text-[#08499f] bg-blue-50 font-bold' : 'hover:text-[#08499f] hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'categories' ? 'text-[#08499f] bg-blue-50 font-bold' : 'hover:text-[#08499f] hover:bg-slate-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Katalog Akun</span>
            </button>

            <button
              onClick={() => setActiveTab('groups')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'groups' ? 'text-[#08499f] bg-blue-50 font-bold' : 'hover:text-[#08499f] hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Grup WA & Kontak</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'help' ? 'text-[#08499f] bg-blue-50 font-bold' : 'hover:text-[#08499f] hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan & CS</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {/* Direct WhatsApp CTA */}
            <a
              href={`https://wa.me/${storeSettings.waNumber}?text=Halo%20Admin%20${encodeURIComponent(storeSettings.brandName)}%2C%20saya%20mau%20tanya%20order%20akun%20game`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Chat Admin WA</span>
              <span className="sm:hidden">Admin WA</span>
            </a>
          </div>

        </div>

        {/* Mobile Search Bar Row (When on Katalog tab or searching) */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari akun Free Fire, MLBB, Roblox..."
              value={searchQuery}
              onFocus={() => {
                if (activeTab !== 'categories') setActiveTab('categories');
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'categories') setActiveTab('categories');
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-[#08499f] outline-none text-slate-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-3.5 h-3.5 grid place-items-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
