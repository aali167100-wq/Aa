import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Trophy, Star, Gift, Zap, RotateCw } from 'lucide-react';
import { SpinReward } from '../types';
import { sound } from '../utils/audio';

interface LuckySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (reward: SpinReward) => void;
}

const WHEEL_REWARDS: SpinReward[] = [
  {
    id: 'rew-stars-50',
    label: '+50 STARS',
    subLabel: 'Shiny Stars',
    emoji: '⭐',
    color: '#F59E0B', // Amber
    type: 'stars',
    value: 50,
  },
  {
    id: 'rew-stk-rocket',
    label: 'COSMO ROCKET',
    subLabel: 'Rare Sticker',
    emoji: '🚀',
    color: '#6366F1', // Indigo
    type: 'sticker',
    value: 'stk-rocket',
  },
  {
    id: 'rew-stars-100',
    label: 'JACKPOT 100⭐',
    subLabel: 'Mega Stars!',
    emoji: '💎',
    color: '#06B6D4', // Cyan
    type: 'stars',
    value: 100,
  },
  {
    id: 'rew-dalmatian',
    label: 'RESCUE PUP',
    subLabel: 'Hero Buddy',
    emoji: '🐕‍🦺',
    color: '#EA580C', // Orange
    type: 'badge',
    value: 'pup-badge',
  },
  {
    id: 'rew-booster',
    label: '2X BOOST',
    subLabel: 'Star Turbo',
    emoji: '⚡',
    color: '#EAB308', // Yellow
    type: 'booster',
    value: 2,
  },
  {
    id: 'rew-stk-crown',
    label: 'ROYAL CROWN',
    subLabel: 'Epic Sticker',
    emoji: '👑',
    color: '#A855F7', // Purple
    type: 'sticker',
    value: 'stk-crown',
  },
  {
    id: 'rew-fire-helmet',
    label: 'FIRE CHIEF',
    subLabel: 'Hero Helmet',
    emoji: '⛑️',
    color: '#EF4444', // Red
    type: 'badge',
    value: 'fire-badge',
  },
  {
    id: 'rew-mystery',
    label: 'MYSTERY CHEST',
    subLabel: '+75 Stars & Sparkles',
    emoji: '🎁',
    color: '#EC4899', // Pink
    type: 'stars',
    value: 75,
  },
];

export const LuckySpinModal: React.FC<LuckySpinModalProps> = ({
  isOpen,
  onClose,
  onReward,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedReward, setSelectedReward] = useState<SpinReward | null>(null);
  const [hasSpunToday, setHasSpunToday] = useState<boolean>(false);
  const [spinsLeft, setSpinsLeft] = useState<number>(3); // 3 fun spins for testing!
  const lastTickDeg = useRef<number>(0);

  if (!isOpen) return null;

  const segmentAngle = 360 / WHEEL_REWARDS.length; // 45 deg

  const handleSpin = () => {
    if (isSpinning) return;

    sound.playBooster();
    setIsSpinning(true);
    setSelectedReward(null);

    // Random target index
    const targetIndex = Math.floor(Math.random() * WHEEL_REWARDS.length);
    // Calculate final rotation so the top pointer (at 270 deg or 0 deg depending on orientation) lands on target
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    // Each slice is 45 deg, slice 0 is at 0..45 deg
    // Pointer is at the top (12 o'clock = 270 deg in standard SVG, or 0 deg if pointer is at top)
    const targetAngle = 360 - (targetIndex * segmentAngle + segmentAngle / 2);
    const finalRotation = rotation + extraSpins + (targetAngle - (rotation % 360));

    // Play tick sounds as it spins
    let currentDeg = rotation;
    const start = performance.now();
    const duration = 4000; // 4 seconds

    const animateTicks = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const estimatedDeg = rotation + (finalRotation - rotation) * easeOut;

      if (Math.abs(estimatedDeg - lastTickDeg.current) > 40) {
        sound.playSpinTick();
        lastTickDeg.current = estimatedDeg;
      }

      if (progress < 1) {
        requestAnimationFrame(animateTicks);
      }
    };
    requestAnimationFrame(animateTicks);

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonReward = WHEEL_REWARDS[targetIndex];
      setSelectedReward(wonReward);
      setSpinsLeft((s) => Math.max(0, s - 1));
      setHasSpunToday(true);

      sound.playVictory();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#6366F1'],
      });

      onReward(wonReward);
    }, duration + 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-['Fredoka',sans-serif] select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-[36px] max-w-sm w-full p-5 shadow-2xl border-4 border-amber-300 relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition active:scale-95"
          disabled={isSpinning}
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full text-xs font-black border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>DAILY LUCKY WHEEL</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1 leading-tight">
            Spin & Win Stars!
          </h3>
          <p className="text-xs font-bold text-slate-500">
            {spinsLeft > 0
              ? `${spinsLeft} Lucky Spins remaining today!`
              : 'Come back tomorrow or keep practicing!'}
          </p>
        </div>

        {/* 3D Wheel Container */}
        <div className="relative w-64 h-64 my-2 flex items-center justify-center">
          {/* Outer Golden Flashing Frame with Lightbulbs */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-2 shadow-2xl border-4 border-amber-200 flex items-center justify-center">
            {/* Lightbulbs around rim */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12;
              return (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse"
                  style={{
                    top: `${50 - 46 * Math.cos((angle * Math.PI) / 180)}%`,
                    left: `${50 + 46 * Math.sin((angle * Math.PI) / 180)}%`,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              );
            })}
          </div>

          {/* Top Indicator / Flapper Arrow Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center filter drop-shadow-md">
            <div className="w-6 h-7 bg-gradient-to-b from-red-500 to-rose-700 clip-triangle shadow-lg border border-white" />
            <div className="w-3 h-3 rounded-full bg-amber-300 border border-white -mt-1 shadow" />
          </div>

          {/* The Spinning Wheel Surface */}
          <div
            className="w-56 h-56 rounded-full overflow-hidden relative shadow-inner transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {WHEEL_REWARDS.map((reward, i) => {
                const startAngle = i * segmentAngle;
                const endAngle = startAngle + segmentAngle;
                const x1 = 100 + 100 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 100 + 100 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 100 + 100 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 100 + 100 * Math.sin((endAngle * Math.PI) / 180);

                const midAngle = startAngle + segmentAngle / 2;
                const textX = 100 + 64 * Math.cos((midAngle * Math.PI) / 180);
                const textY = 100 + 64 * Math.sin((midAngle * Math.PI) / 180);

                return (
                  <g key={reward.id}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={reward.color}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#FFFFFF"
                      fontSize="16"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {reward.emoji}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Spin Hub / Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 text-amber-950 font-black flex flex-col items-center justify-center shadow-xl border-3 border-white active:scale-95 transition-transform hover:scale-105 disabled:opacity-80 cursor-pointer"
          >
            <RotateCw
              className={`w-5 h-5 stroke-[3] ${isSpinning ? 'animate-spin' : ''}`}
            />
            <span className="text-[10px] font-black tracking-tight mt-0.5">
              {isSpinning ? 'SPINNING' : 'SPIN!'}
            </span>
          </button>
        </div>

        {/* Won Reward Announcement Box */}
        {selectedReward ? (
          <div className="w-full bg-amber-50 rounded-2xl p-3 border-2 border-amber-300 text-center my-2 animate-in zoom-in-95 duration-200">
            <div className="text-3xl mb-1">{selectedReward.emoji}</div>
            <div className="text-xs font-black text-amber-800 uppercase">
              YOU WON!
            </div>
            <div className="text-lg font-black text-slate-900">
              {selectedReward.label}
            </div>
            <div className="text-xs font-bold text-slate-500">
              {selectedReward.subLabel}
            </div>

            <button
              onClick={() => {
                sound.playStarSparkle();
                onClose();
              }}
              className="mt-3 w-full btn-3d btn-3d-play py-2.5 rounded-xl text-white font-black text-sm shadow border border-amber-200"
            >
              COLLECT REWARD! 🎉
            </button>
          </div>
        ) : (
          <div className="w-full mt-2 text-center">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full btn-3d btn-3d-play py-3 rounded-2xl text-white font-black text-base shadow-lg border-2 border-amber-200 flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{isSpinning ? 'LUCKY WHEEL SPINNING...' : 'SPIN THE WHEEL!'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
