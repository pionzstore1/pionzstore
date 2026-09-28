import React from 'react';
import { CATEGORIES } from '../data/storeData';
import { Flame, Swords, Crosshair, Blocks, Gamepad2 } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  productCounts: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  productCounts
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'flame':
        return <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />;
      case 'swords':
        return <Swords className="w-4 h-4 text-blue-500" />;
      case 'crosshair':
        return <Crosshair className="w-4 h-4 text-amber-500" />;
      case 'blocks':
        return <Blocks className="w-4 h-4 text-emerald-500" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="font-heading font-bold text-sm sm:text-base text-slate-800 flex items-center gap-1.5">
          <span>Kategori Game</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">Pilih game favoritmu</span>
      </div>

      {/* Horizontal scroll on mobile, flex-wrap on desktop */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = productCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 border ${
                isSelected
                  ? 'bg-[#08499f] text-white border-[#08499f] shadow-sm shadow-blue-500/20 scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={isSelected ? 'text-white' : ''}>
                {cat.id === 'all' ? (
                  <Gamepad2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                ) : (
                  getIcon(cat.iconName)
                )}
              </span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
