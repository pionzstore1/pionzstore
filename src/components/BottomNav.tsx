import React from 'react';
import { Flame, Gamepad2, Users, Headphones } from 'lucide-react';
import { StoreConfig } from '../types.ts';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  config?: StoreConfig;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, config }) => {
  const navTabs = [
    { id: 'beranda', label: 'Beranda', icon: Flame },
    { id: 'katalog', label: 'Katalog FF', icon: Gamepad2 },
    { id: 'grup', label: 'Komunitas', icon: Users },
    { id: 'bantuan', label: 'Bantuan', icon: Headphones },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-400 font-extrabold scale-105'
                  : 'text-slate-400 font-medium hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
