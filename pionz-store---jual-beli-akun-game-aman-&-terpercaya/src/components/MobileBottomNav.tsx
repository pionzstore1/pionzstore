import React from 'react';
import { Home, Grid, Users, HelpCircle } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'categories', label: 'Katalog', icon: Grid },
    { id: 'groups', label: 'Grup WA', icon: Users },
    { id: 'help', label: 'Bantuan', icon: HelpCircle }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#08499f]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-[#08499f]' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-4 h-1 bg-[#08499f] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
