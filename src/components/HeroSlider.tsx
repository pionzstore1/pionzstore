import React, { useState } from 'react';
import { STORE_INFO } from '../data/storeData';
import { StoreSettings } from './AdminPanel/AdminPanelModal';
import { ShieldCheck, Zap, Headphones } from 'lucide-react';

interface HeroSliderProps {
  onExploreClick?: () => void;
  storeSettings?: StoreSettings;
}

const CANONICAL_BANNER = 'https://i.ibb.co/HDWzWTYL/Screenshot-2026-09-27-10-56-03-982-com-openai-chatgpt-edit.jpg';

export const HeroSlider: React.FC<HeroSliderProps> = ({ storeSettings }) => {
  const [imgError, setImgError] = useState(false);

  const bannerImg = storeSettings?.bannerUrl || STORE_INFO.bannerUrl || CANONICAL_BANNER;
  const brandName = storeSettings?.brandName || STORE_INFO.brandName;
  const operationalHours = storeSettings?.operationalHours || STORE_INFO.operationalHours;

  return (
    <section className="w-full pt-1.5 sm:pt-3 pb-1">
      {/* 
        Sleek, Compact, High-Definition Banner
        Tuned aspect ratio and max-height for a clean, perfectly balanced appearance without visual clutter
      */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border border-slate-200/90 bg-slate-950 group">
          
          {/* Ambient Glow Backdrop (smooth blend on widescreen) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={imgError ? CANONICAL_BANNER : bannerImg}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover blur-2xl opacity-35 scale-110"
            />
            <div className="absolute inset-0 bg-slate-950/20"></div>
          </div>

          {/* Main High-Definition Banner Image with compact aspect ratio */}
          <div className="relative w-full aspect-[20/9] sm:aspect-[24/8] md:aspect-[3.2/1] max-h-[300px] sm:max-h-[340px] flex items-center justify-center overflow-hidden">
            <img
              src={imgError ? CANONICAL_BANNER : bannerImg}
              alt={`${brandName} Banner`}
              referrerPolicy="no-referrer"
              onError={() => {
                if (!imgError) setImgError(true);
              }}
              className="w-full h-full object-cover object-center select-none transition-transform duration-700 group-hover:scale-[1.01]"
              style={{ imageRendering: 'auto' }}
            />
          </div>
        </div>

        {/* 3 Quick Value Badges */}
        <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/80 shadow-sm flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-[#08499f] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Garansi Akun</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">100% Anti Hackback</p>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/80 shadow-sm flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Proses Kilat</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">5 - 15 Menit Beres</p>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/80 shadow-sm flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Bantuan Admin</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{operationalHours}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
