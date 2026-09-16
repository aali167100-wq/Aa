import React, { useState } from 'react';
import { TrophyItem } from '../types';
import trophyRoomBanner from '../assets/images/trophy_room_3d_1789536268577.jpg';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, Check, Lock, Award, ShieldAlert } from 'lucide-react';

interface TrophyRoomProps {
  trophies: TrophyItem[];
  onClaimTrophyBonus?: (trophyId: string, stars: number) => void;
}

export const TrophyRoom: React.FC<TrophyRoomProps> = ({ trophies, onClaimTrophyBonus }) => {
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyItem | null>(null);

  const unlockedCount = trophies.filter((t) => t.unlocked).length;
  const totalStarsBonus = trophies.reduce((acc, t) => acc + (t.unlocked ? t.starsBonus : 0), 0);

  const handleSelectTrophy = (t: TrophyItem) => {
    if (t.unlocked) {
      sound.playStarSparkle();
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#00FFFF'],
      });
    } else {
      sound.playBoing();
    }
    setSelectedTrophy(t);
  };

  const tierColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    diamond: {
      bg: 'from-cyan-200 via-sky-300 to-indigo-300',
      border: 'border-cyan-400',
      text: 'text-cyan-900',
      badge: 'bg-cyan-500 text-white',
    },
    gold: {
      bg: 'from-amber-200 via-yellow-300 to-orange-300',
      border: 'border-amber-400',
      text: 'text-amber-950',
      badge: 'bg-amber-500 text-amber-950',
    },
    silver: {
      bg: 'from-slate-200 via-gray-300 to-zinc-300',
      border: 'border-slate-400',
      text: 'text-slate-800',
      badge: 'bg-slate-400 text-white',
    },
    bronze: {
      bg: 'from-orange-200 via-amber-300 to-amber-600',
      border: 'border-amber-600',
      text: 'text-amber-950',
      badge: 'bg-amber-700 text-white',
    },
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-3.5 select-none font-['Fredoka',sans-serif]">
      {/* 3D Trophy Showcase Banner */}
      <div className="relative rounded-[30px] overflow-hidden border-4 border-white shadow-xl aspect-[16/8] bg-amber-200">
        <img
          src={trophyRoomBanner}
          alt="3D Kids Trophy Room Showcase"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow border-2 border-white">
            <Trophy className="w-3.5 h-3.5 fill-amber-950" />
            HALL OF FAME
          </span>
        </div>

        <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
          <h3 className="text-xl font-black text-yellow-300 leading-tight drop-shadow">
            Junior Champion Trophies
          </h3>
          <p className="text-[11px] font-bold text-white/90">
            {unlockedCount} of {trophies.length} Trophies Unlocked • {totalStarsBonus} Stars Earned!
          </p>
        </div>
      </div>

      {/* Trophy Display Shelves */}
      <div className="bg-white/90 rounded-3xl p-3.5 border-2 border-white shadow-md">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Trophy Pedestals:
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            Tap a trophy for details
          </span>
        </div>

        {/* 3D Wooden Shelf Grid */}
        <div className="grid grid-cols-3 gap-3">
          {trophies.map((trophy) => {
            const isUnlocked = trophy.unlocked;
            const styling = tierColors[trophy.tier];

            return (
              <button
                key={trophy.id}
                onClick={() => handleSelectTrophy(trophy)}
                className={`relative aspect-[3/3.8] rounded-2xl border-3 flex flex-col items-center justify-between p-2 transition-all shadow-md active:translate-y-1 ${
                  isUnlocked
                    ? `bg-gradient-to-tr ${styling.bg} ${styling.border} hover:scale-105`
                    : 'bg-slate-100 border-dashed border-slate-300 opacity-65'
                }`}
              >
                {/* Tier Badge */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-2xs ${styling.badge}`}
                  >
                    {trophy.tier}
                  </span>
                  {isUnlocked ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  ) : (
                    <Lock className="w-3 h-3 text-slate-400" />
                  )}
                </div>

                {/* 3D Icon */}
                <div className="text-3xl my-1 drop-shadow-md animate-in zoom-in duration-150">
                  {isUnlocked ? trophy.icon : '🔒'}
                </div>

                {/* Trophy Title */}
                <div className="text-center w-full">
                  <div className="text-[10px] font-black text-slate-800 truncate leading-tight">
                    {trophy.title}
                  </div>
                  <div className="text-[9px] font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-500" />
                    +{trophy.starsBonus}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Trophy Inspector Drawer */}
      {selectedTrophy && (
        <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-3.5 border-2 border-amber-300 shadow-lg animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md border-2 border-amber-300 flex items-center justify-center text-3xl shrink-0">
              {selectedTrophy.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-slate-900 truncate">
                  {selectedTrophy.title}
                </h4>
                <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-400 text-amber-950 rounded-md">
                  {selectedTrophy.tier.toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-snug">
                {selectedTrophy.description}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-slate-500">
                <span>Game: {selectedTrophy.gameTitle}</span>
                <span className="text-amber-600 font-black flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-500" /> +{selectedTrophy.starsBonus} Stars
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTrophy(null)}
              className="w-7 h-7 rounded-full bg-white text-slate-500 hover:bg-slate-100 flex items-center justify-center text-xs font-bold self-start"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
