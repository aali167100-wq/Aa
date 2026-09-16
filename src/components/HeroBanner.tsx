import React from 'react';
import { Play, Sparkles, Trophy, Star, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import heroKidsImg from '../assets/images/hero_kids_characters_1789535901150.jpg';

interface HeroBannerProps {
  onPlayNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onPlayNow }) => {
  const handlePlayClick = () => {
    sound.playStarSparkle();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FFDD00', '#FF3366', '#00E5FF', '#76FF03'],
    });
    onPlayNow();
  };

  return (
    <div className="px-4 py-2 select-none">
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-indigo-400 p-1.5 shadow-xl border-4 border-white">
        {/* Colorful floating stickers */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md border-2 border-white animate-bounce">
            <Trophy className="w-3 h-3 fill-amber-950" />
            GAME OF THE DAY!
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow border border-white/80 w-fit">
            <Sparkles className="w-2.5 h-2.5" /> 100% Kid Safe
          </span>
        </div>

        {/* Floating Heart / Star Accents */}
        <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 shadow-md border border-white">
          <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
        </div>

        {/* 3D Cartoon Characters Image */}
        <div className="relative aspect-[16/9.5] w-full rounded-[26px] overflow-hidden bg-sky-200">
          <img
            src={heroKidsImg}
            alt="Cute 3D Cartoon Children and Friendly Animals"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle bottom shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

          {/* Tagline inside banner */}
          <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none drop-shadow-md">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-yellow-300 text-stroke">
              FUN KIDS GAMES
            </h3>
            <p className="text-[11px] sm:text-xs font-bold text-white/95 leading-tight">
              Puzzles, Racing, Animals & Brain Mini-Games!
            </p>
          </div>
        </div>

        {/* Giant Colorful 3D PLAY NOW Button */}
        <div className="mt-2.5 pb-1 px-1">
          <button
            onClick={handlePlayClick}
            className="btn-3d btn-3d-play w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 border-2 border-amber-200 cursor-pointer group"
          >
            {/* Play icon in bouncy circle */}
            <div className="w-10 h-10 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-orange-600 ml-0.5" />
            </div>

            {/* Big 3D Typography */}
            <div className="text-left">
              <span className="block text-2xl sm:text-3xl font-black text-white tracking-wider leading-none drop-shadow-md">
                PLAY NOW!
              </span>
              <span className="block text-[11px] font-extrabold text-yellow-100 tracking-wide mt-0.5">
                TAP TO START ADVENTURE
              </span>
            </div>

            {/* Sparkle badge */}
            <div className="ml-auto bg-yellow-300 text-amber-950 font-black text-xs px-2.5 py-1 rounded-xl shadow border border-white flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-950" />
              <span>FREE</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
