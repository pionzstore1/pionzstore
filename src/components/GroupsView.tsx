import React from 'react';
import { GROUPS, STORE_INFO, GroupLink } from '../data/storeData';
import { StoreSettings } from './AdminPanel/AdminPanelModal';
import { VerifiedBadge } from './VerifiedBadge';
import { ExternalLink, ShieldCheck, MessageSquare, Flame, Users } from 'lucide-react';

interface GroupsViewProps {
  groups?: GroupLink[];
  storeSettings?: StoreSettings;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups = GROUPS,
  storeSettings
}) => {
  const currentBrand = storeSettings?.brandName || STORE_INFO.brandName;
  const currentLogo = storeSettings?.logoUrl || STORE_INFO.logoUrl;
  const currentHours = storeSettings?.operationalHours || STORE_INFO.operationalHours;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Profile Header Box */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-slate-200/80 shadow-card flex flex-col items-center">
        <div className="relative mb-3">
          <img
            src={currentLogo}
            alt={currentBrand}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = STORE_INFO.remoteLogoUrl;
            }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-[#08499f]/15 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <VerifiedBadge size={22} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {currentBrand}
          </h1>
          <VerifiedBadge size={24} />
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md">
          Jual beli akun game aman & terpercaya • Open {currentHours}
        </p>

        {/* Quick Trust Highlights */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600">
          <span className="bg-blue-50 text-[#08499f] px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Anti Hackback
          </span>
          <span className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full flex items-center gap-1">
            <VerifiedBadge size={14} />
            Akun Resmi Verified
          </span>
          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            {STORE_INFO.totalTransactions} Transaksi Sukses
          </span>
        </div>
      </div>

      {/* Official Links List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#08499f]" />
            <span>Grup Resmi & Kontak Admin {currentBrand}</span>
          </h2>
          <span className="text-xs text-slate-500">Pilih link untuk bergabung / chat</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {groups.map((grp) => (
            <a
              key={grp.id}
              href={grp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-[#08499f] hover:shadow-card-hover transition-all duration-200 flex items-start gap-3 sm:gap-4 active:scale-[0.99]"
            >
              {/* WhatsApp Group Logo / Avatar - Authentic WA Japost Style */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white">
                    {grp.logoUrl ? (
                      <img
                        src={grp.logoUrl}
                        alt={grp.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = currentLogo;
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center">
                        <MessageSquare className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                </div>
                {/* WA Official Emerald Tick Badge */}
                <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white rounded-full p-1 border-2 border-white shadow-md">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                    {grp.name}
                  </h3>
                  {grp.badge && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60 shrink-0">
                      {grp.badge}
                    </span>
                  )}
                  {grp.memberCount && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0 flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5 text-slate-500" />
                      <span>{grp.memberCount}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {grp.description}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Buka di WhatsApp Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Security Warning Notice */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1">
        <p className="font-bold flex items-center gap-1 text-amber-800">
          ⚠️ Hati-Hati Penipuan Mengatasnamakan {STORE_INFO.brandName}!
        </p>
        <p className="text-amber-700 leading-relaxed">
          Admin resmi kami hanya menggunakan nomor WhatsApp yang tertera di website ini. Jangan pernah bertransaksi di luar kontak resmi {STORE_INFO.brandName}.
        </p>
      </div>

    </div>
  );
};
