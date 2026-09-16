import React from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, Sparkles, Check, ArrowRight } from 'lucide-react';
import { StickerItem, TrophyItem } from '../types';
import { sound } from '../utils/audio';

interface RewardUnlockModalProps {
  reward: {
    type: 'sticker' | 'trophy';
    item: StickerItem | TrophyItem;
    starsWon: number;
  } | null;
  onClose: () => void;
  onGoToStickers: () => void;
  onGoToTrophies: () => void;
}

export const RewardUnlockModal: React.FC<RewardUnlockModalProps> = ({
  reward,
  onClose,
  onGoToStickers,
  onGoToTrophies,
}) => {
  if (!reward) return null;

  const isSticker = reward.type === 'sticker';
  const sticker = isSticker ? (reward.item as StickerItem) : null;
  const trophy = !isSticker ? (reward.item as TrophyItem) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-['Fredoka',sans-serif] animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-300 via-yellow-200 to-white rounded-[38px] max-w-xs w-full p-6 text-center shadow-2xl border-4 border-amber-400 relative animate-in zoom-in-90 duration-300">
        {/* Floating Sparkles */}
        <div className="absolute top-4 left-4 text-2xl animate-spin">✨</div>
        <div className="absolute top-4 right-4 text-2xl animate-bounce">🎉</div>

        {/* Big Reward Badge Icon */}
        <div className="relative my-2">
          <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400 p-2 shadow-xl border-4 border-white flex items-center justify-center animate-bounce">
            <span className="text-6xl drop-shadow-md">
              {isSticker ? sticker?.emoji : trophy?.icon}
            </span>
          </div>
        </div>

        {/* Title */}
        <span className="inline-block bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full border border-white shadow-xs uppercase tracking-wider mb-2">
          {isSticker ? '🌟 NEW STICKER UNLOCKED!' : '🏆 NEW TROPHY EARNED!'}
        </span>

        <h3 className="text-2xl font-black text-slate-900 leading-tight">
          {isSticker ? sticker?.name : trophy?.title}
        </h3>

        <p className="text-xs font-bold text-slate-600 mt-1 mb-4">
          {isSticker
            ? `Earned from ${sticker?.gameSource}!`
            : trophy?.description}
        </p>

        {/* Stars Bonus Box */}
        <div className="bg-white/80 rounded-2xl p-3 border border-amber-300 shadow-inner flex items-center justify-center gap-2 mb-5">
          <Star className="w-6 h-6 fill-amber-400 text-amber-400 animate-star" />
          <span className="text-lg font-black text-slate-900">
            +{reward.starsWon} Bonus Stars!
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              sound.playStarSparkle();
              if (isSticker) onGoToStickers();
              else onGoToTrophies();
              onClose();
            }}
            className="btn-3d btn-3d-play w-full py-3 px-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 border-2 border-amber-200 cursor-pointer shadow-md"
          >
            <span>{isSticker ? 'View in Sticker Book 🎨' : 'Visit Trophy Room 🏆'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-full py-2.5 rounded-2xl font-black text-slate-600 hover:text-slate-800 text-xs bg-slate-100 hover:bg-slate-200 transition"
          >
            Keep Playing
          </button>
        </div>
      </div>
    </div>
  );
};
