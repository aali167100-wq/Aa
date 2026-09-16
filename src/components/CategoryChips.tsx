import React from 'react';
import { GameCategory } from '../types';
import { sound } from '../utils/audio';

interface CategoryChipsProps {
  selectedCategory: GameCategory;
  onSelectCategory: (category: GameCategory) => void;
}

interface CategoryOption {
  id: GameCategory;
  label: string;
  emoji: string;
  activeColor: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'All Games', emoji: '🌟', activeColor: 'bg-amber-400 text-amber-950 border-amber-500 shadow-amber-300/50' },
  { id: 'racing', label: 'Racing', emoji: '🏎️', activeColor: 'bg-rose-500 text-white border-rose-600 shadow-rose-300/50' },
  { id: 'puzzle', label: 'Puzzles', emoji: '🧩', activeColor: 'bg-teal-500 text-white border-teal-600 shadow-teal-300/50' },
  { id: 'matching', label: 'Matching', emoji: '🎴', activeColor: 'bg-pink-500 text-white border-pink-600 shadow-pink-300/50' },
  { id: 'educational', label: 'Learning', emoji: '🎓', activeColor: 'bg-purple-500 text-white border-purple-600 shadow-purple-300/50' },
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="px-4 py-2 select-none">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playPop(isSelected ? 580 : 520);
                onSelectCategory(cat.id);
              }}
              className={`whitespace-nowrap flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs transition-all duration-150 border-b-4 ${
                isSelected
                  ? `${cat.activeColor} shadow-md translate-y-0.5 border-b-2`
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-300 hover:border-slate-400 shadow-sm active:translate-y-0.5'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
