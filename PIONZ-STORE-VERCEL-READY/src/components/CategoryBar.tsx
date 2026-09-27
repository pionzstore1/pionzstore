import React from 'react';
import { CATEGORIES } from '../data/storeData.ts';
import { Flame, LayoutGrid } from 'lucide-react';

interface CategoryBarProps {
  selectedGame: string;
  onSelectGame: (game: string) => void;
  productCounts: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedGame,
  onSelectGame,
  productCounts,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-extrabold text-white font-heading uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Kategori Akun Free Fire</span>
        </h3>
        <span className="text-xs font-medium text-slate-400">
          Semua Akun Bergaransi Resmi
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
        {CATEGORIES.filter((cat) => cat.id !== 'category-mlbb').map((cat) => {
          const isSelected =
            (cat.id === 'all' && selectedGame === 'all') ||
            (cat.id === 'category-free-fire' && (selectedGame === 'Free Fire' || selectedGame === 'all'));

          const count =
            cat.id === 'all'
              ? productCounts.total || 0
              : productCounts['Free Fire'] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'all') onSelectGame('all');
                else if (cat.id === 'category-free-fire') onSelectGame('Free Fire');
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                isSelected
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-850'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.id === 'all' ? <LayoutGrid className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
              </div>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected
                    ? 'bg-blue-500/30 text-blue-200'
                    : 'bg-slate-800 text-slate-400'
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
