import React, { useState } from 'react';
import { StoreConfig } from '../types.ts';
import { 
  Search, 
  Menu, 
  X, 
  BadgeCheck, 
  Users, 
  Flame,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Headphones
} from 'lucide-react';

interface NavbarProps {
  config: StoreConfig;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Flame },
    { id: 'katalog', label: 'Katalog FF', icon: Gamepad2 },
    { id: 'grup', label: 'Komunitas Resmi', icon: Users },
    { id: 'bantuan', label: 'Bantuan', icon: Headphones },
  ];

  const handleNavClick = (id: string, isDirectWa?: boolean) => {
    if (isDirectWa) {
      window.open(
        `https://wa.me/${config.waNumber}?text=${encodeURIComponent(`Halo Admin ${config.brandName}, saya butuh bantuan & panduan transaksi akun Free Fire.`)}`,
        '_blank'
      );
      setMobileMenuOpen(false);
      return;
    }
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo and Store Name */}
          <div 
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative">
              <img
                src={config.logo}
                alt={config.brandName}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-400 group-hover:scale-105 transition-all shadow-lg shadow-blue-500/10"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-[#090d16] rounded-full p-0.5">
                <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-500/20" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading leading-tight group-hover:text-blue-400 transition-colors">
                  {config.brandName}
                </h1>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Marketplace Akun FF
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.isDirectWa)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-600/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop & Mobile Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar */}
            <div className="relative">
              <div className="hidden md:flex items-center bg-slate-900/90 rounded-xl px-3.5 py-2 border border-slate-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-52 lg:w-64">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Cari spek akun, SG2, Evo..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'katalog' && activeTab !== 'beranda') {
                      setActiveTab('katalog');
                    }
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-500 hover:text-slate-300 ml-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                aria-label="Cari Akun"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {isSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-slate-800 animate-fadeIn">
            <div className="flex items-center bg-slate-900 rounded-xl px-3.5 py-2.5 border border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Cari akun Free Fire, SG2, Evo Gun, Sultan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'katalog' && activeTab !== 'beranda') {
                    setActiveTab('katalog');
                  }
                }}
                autoFocus
                className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-200 ml-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#090d16]/98 backdrop-blur-2xl shadow-2xl animate-fadeIn">
          <div className="px-4 py-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.isDirectWa)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

          </div>
        </div>
      )}
    </header>
  );
};
