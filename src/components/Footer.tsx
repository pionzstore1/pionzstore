import React, { useState } from 'react';
import { StoreConfig } from '../types.ts';
import { STORE_CONFIG } from '../data/storeData.ts';
import { BadgeCheck, Clock, Headphones } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  config?: StoreConfig;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, config: propConfig, onOpenAdmin }) => {
  const currentConfig = propConfig || STORE_CONFIG;
  const [secretClickCount, setSecretClickCount] = useState(0);

  // Secret 3-click trigger on copyright to open admin panel for the owner
  const handleCopyrightClick = () => {
    const newCount = secretClickCount + 1;
    if (newCount >= 3) {
      setSecretClickCount(0);
      onOpenAdmin?.();
    } else {
      setSecretClickCount(newCount);
      setTimeout(() => setSecretClickCount(0), 2000);
    }
  };

  return (
    <footer className="bg-[#060911] text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-8 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={currentConfig.logo}
                alt={currentConfig.brandName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10"
              />
              <div>
                <h3 className="text-xl font-black text-white font-heading tracking-wide">
                  {currentConfig.brandName}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {currentConfig.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {currentConfig.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
              <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Transaksi Aman & Garansi Akun 100% Terverifikasi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('katalog')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Katalog Akun Free Fire
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('grup')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Komunitas & Saluran WhatsApp
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright with private admin access */}
        <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
          <p className="max-w-2xl mx-auto leading-relaxed text-[11px]">
            Disclaimer: {currentConfig.brandName} adalah platform penyedia layanan transaksi jual beli akun game Free Fire. Seluruh merek dagang seperti Garena Free Fire adalah hak cipta dari masing-masing pemiliknya.
          </p>
          <p 
            onClick={handleCopyrightClick}
            className="font-medium text-slate-400 cursor-default select-none transition-colors hover:text-slate-300"
            title=""
          >
            © {new Date().getFullYear()} {currentConfig.brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
