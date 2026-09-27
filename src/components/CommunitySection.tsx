import React from 'react';
import { GroupChannel, StoreConfig } from '../types.ts';
import { GROUPS, STORE_CONFIG } from '../data/storeData.ts';
import { MessageCircle, ExternalLink, BadgeCheck, Shield, Users, Radio, Video } from 'lucide-react';

interface CommunitySectionProps {
  groups?: GroupChannel[];
  config?: StoreConfig;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  groups: propGroups,
  config: propConfig,
}) => {
  const currentGroups = propGroups || GROUPS;
  const currentConfig = propConfig || STORE_CONFIG;

  const getIconForGroup = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('tiktok')) {
      return <Video className="w-5 h-5 text-pink-400" />;
    } else if (lower.includes('saluran') || lower.includes('channel')) {
      return <Radio className="w-5 h-5 text-emerald-400" />;
    } else if (lower.includes('rekber')) {
      return <Shield className="w-5 h-5 text-blue-400" />;
    }
    return <MessageCircle className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12 pt-4">
      <div className="mx-auto w-full max-w-5xl px-4 pb-12">
        {/* Header Profile Box */}
        <div className="flex flex-col items-center text-center bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden mb-6 text-white">
          <div className="relative mb-3">
            <img
              src={currentConfig.logo}
              alt={currentConfig.brandName}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover ring-4 ring-blue-500/30 shadow-2xl shadow-blue-500/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-[#0f172a] rounded-full p-1 shadow">
              <BadgeCheck className="w-6 h-6 text-blue-400 fill-blue-500/20" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Grup & Komunitas Resmi {currentConfig.brandName}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md font-medium">
            Jual beli akun Free Fire aman & terpercaya • {currentConfig.operatingHours}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5" /> Terverifikasi 100%
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Users className="w-3.5 h-3.5" /> 10.000+ Member Aktif
            </span>
          </div>
        </div>

        {/* Warning Notice Box */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs sm:text-sm text-amber-200 flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <strong className="font-bold">PERHATIAN PENTING:</strong> Waspada terhadap oknum penipuan mengatasnamakan {currentConfig.brandName}. Transaksi akun hanya sah dan bergaransi jika dilakukan melalui saluran resmi Pionz Store yang tersedia di website.
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentGroups.map((group) => {
            const isTikTok = group.name.toLowerCase().includes('tiktok');
            const isSaluran = group.name.toLowerCase().includes('saluran');

            return (
              <a
                key={group.id}
                href={group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800 bg-[#0f172a] hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.99] transition-all group"
              >
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                  {group.image && group.image.startsWith('http') ? (
                    <img
                      src={group.image}
                      alt={group.name}
                      className="h-full w-full object-cover rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    getIconForGroup(group.name)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {group.name}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                    {isTikTok
                      ? 'Follow akun TikTok resmi'
                      : isSaluran
                      ? 'Saluran Update Stok & Pemberitahuan'
                      : 'Komunitas WhatsApp Resmi'}
                  </p>
                </div>

                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 group-hover:bg-blue-600 group-hover:text-white text-slate-400 transition-colors border border-slate-800">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
