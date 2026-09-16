import React from 'react';
import { Star, ShieldCheck, Volume2, VolumeX, Flame } from 'lucide-react';
import { KidProfile } from '../types';
import { sound } from '../utils/audio';

interface HeaderBarProps {
  profile: KidProfile;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenParentalGate: () => void;
  onOpenCustomizer?: () => void;
  onOpenLuckySpin?: () => void;
  onOpenBedtime?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  profile,
  isMuted,
  onToggleMute,
  onOpenParentalGate,
  onOpenCustomizer,
  onOpenLuckySpin,
  onOpenBedtime,
}) => {
  return (
    <header className="px-4 pt-3 pb-2 flex items-center justify-between gap-2 z-30 select-none">
      {/* Kid Profile Pill -> Opens 3D Auto Creator */}
      <button
        onClick={() => {
          sound.playPop();
          if (onOpenCustomizer) onOpenCustomizer();
          else onOpenParentalGate();
        }}
        className="flex items-center gap-2 bg-white/95 hover:bg-white rounded-full p-1.5 pr-3 shadow-md border-2 border-amber-300 transition-transform active:scale-95 cursor-pointer"
        title="3D Character Studio & Auto Creator"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-xl shadow-inner border border-white">
          {profile.avatarEmoji || '🦁'}
        </div>
        <div className="text-left leading-none">
          <div className="text-xs font-black text-slate-800 flex items-center gap-1">
            <span>{profile.name}</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              Lv.{profile.level}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600 mt-0.5">
            <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
            <span>{profile.streakDays} Day Streak!</span>
          </div>
        </div>
      </button>

      {/* Right Controls: Stars Bank, Lucky Wheel, Bedtime, Sound & Parent Lock */}
      <div className="flex items-center gap-1.5">
        {/* Lucky Wheel Button */}
        {onOpenLuckySpin && (
          <button
            onClick={() => {
              sound.playSpinTick();
              onOpenLuckySpin();
            }}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white border-2 border-pink-300 flex items-center justify-center transition-transform active:scale-90 shadow-md animate-bounce"
            title="Daily Lucky Spin Wheel"
          >
            <span className="text-base">🎰</span>
          </button>
        )}

        {/* Bedtime / Break Button */}
        {onOpenBedtime && (
          <button
            onClick={() => {
              sound.playLullaby();
              onOpenBedtime();
            }}
            className="w-9 h-9 rounded-full bg-indigo-600 text-amber-200 border-2 border-indigo-400 flex items-center justify-center transition-transform active:scale-90 shadow-md"
            title="Bedtime & Screen Rest"
          >
            <span className="text-sm">🌙</span>
          </button>
        )}

        {/* Star Counter */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black px-2.5 py-1.5 rounded-full shadow-md border-2 border-amber-300 text-xs sm:text-sm">
          <Star className="w-3.5 h-3.5 fill-amber-950 animate-star" />
          <span className="tracking-tight">{profile.stars}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            sound.playPop();
            onToggleMute();
          }}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md border-2 ${
            isMuted
              ? 'bg-slate-200 text-slate-500 border-slate-300'
              : 'bg-emerald-400 text-emerald-950 border-emerald-300 active:scale-90'
          }`}
          title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Child Safe Lock Button */}
        <button
          onClick={() => {
            sound.playPop();
            onOpenParentalGate();
          }}
          className="w-9 h-9 rounded-full bg-sky-400 text-sky-950 hover:bg-sky-300 border-2 border-sky-300 flex items-center justify-center transition-transform active:scale-90 shadow-md"
          title="Parental Zone & Safety Settings"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
