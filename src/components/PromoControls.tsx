import React, { useState } from 'react';
import { Smartphone, Monitor, Music, VolumeX, Sparkles, Video, Play, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface PromoControlsProps {
  isPromoView: boolean;
  onTogglePromoView: () => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  onTriggerConfetti: () => void;
  onQuickPlay: () => void;
  onPlayBombero?: () => void;
  onPlayCyberCosmo?: () => void;
  onOpenLuckySpin?: () => void;
}

export const PromoControls: React.FC<PromoControlsProps> = ({
  isPromoView,
  onTogglePromoView,
  isBgmPlaying,
  onToggleBgm,
  onTriggerConfetti,
  onQuickPlay,
  onPlayBombero,
  onPlayCyberCosmo,
  onOpenLuckySpin,
}) => {
  return (
    <nav className="w-full max-w-4xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 z-50 select-none text-white font-['Fredoka',sans-serif]">
      {/* Title / Badge */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-lg shadow-md border border-white">
          🎮
        </div>
        <div>
          <span className="font-black text-sm tracking-wide text-white drop-shadow">
            FUN KIDS GAMES
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold uppercase bg-pink-500/80 text-white px-2 py-0.5 rounded-full border border-pink-300">
            3D Promo Interface
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {/* 9:16 Video Frame Toggle */}
        <button
          onClick={() => {
            sound.playPop();
            onTogglePromoView();
          }}
          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition shadow-sm border ${
            isPromoView
              ? 'bg-amber-400 text-amber-950 border-amber-300'
              : 'bg-white/15 text-white hover:bg-white/25 border-white/20'
          }`}
          title="Toggle 9:16 Vertical Phone Mockup"
        >
          {isPromoView ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          <span className="hidden xs:inline">
            {isPromoView ? '9:16 Video Frame' : 'Full Screen'}
          </span>
        </button>

        {/* Playful Background Music */}
        <button
          onClick={() => {
            sound.playPop();
            onToggleBgm();
          }}
          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition shadow-sm border ${
            isBgmPlaying
              ? 'bg-emerald-400 text-emerald-950 border-emerald-300 animate-pulse'
              : 'bg-white/15 text-white hover:bg-white/25 border-white/20'
          }`}
          title="Toggle Cheerful Cartoon Melody"
        >
          <Music className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">
            {isBgmPlaying ? 'Music: ON' : 'Music: OFF'}
          </span>
        </button>

        {/* Confetti Celebration */}
        <button
          onClick={() => {
            sound.playStarSparkle();
            onTriggerConfetti();
          }}
          className="px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 transition shadow-sm border border-pink-300"
          title="Burst Celebration Confetti"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Confetti</span>
        </button>

        {/* Quick Play launcher */}
        {onPlayBombero && (
          <button
            onClick={() => {
              sound.playSiren();
              onPlayBombero();
            }}
            className="px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-500 text-white hover:brightness-110 transition shadow-sm border border-red-300 animate-pulse"
            title="Launch Bombero Auto Run 3D"
          >
            <span>🚒</span>
            <span className="hidden sm:inline">Auto-Run</span>
            <span>Bombero</span>
          </button>
        )}

        {/* Quick Play Cyber Cosmo */}
        {onPlayCyberCosmo && (
          <button
            onClick={() => {
              sound.playLaser();
              onPlayCyberCosmo();
            }}
            className="px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:brightness-110 transition shadow-sm border border-cyan-300"
            title="Launch Cyber Cosmo Dash 3D"
          >
            <span>🚀</span>
            <span className="hidden sm:inline">Cyber</span>
            <span>Cosmo</span>
          </button>
        )}

        {/* Lucky Spin Wheel */}
        {onOpenLuckySpin && (
          <button
            onClick={() => {
              sound.playSpinTick();
              onOpenLuckySpin();
            }}
            className="px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:brightness-110 transition shadow-sm border border-pink-300"
            title="Open Lucky Reward Spin Wheel"
          >
            <span>🎰</span>
            <span>Spin</span>
          </button>
        )}

        <button
          onClick={() => {
            sound.playPop();
            onQuickPlay();
          }}
          className="px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:brightness-105 transition shadow-sm border border-amber-200"
        >
          <Play className="w-3.5 h-3.5 fill-slate-900" />
          <span>PLAY</span>
        </button>
      </div>
    </nav>
  );
};
