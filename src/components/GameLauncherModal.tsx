import React from 'react';
import { GameItem } from '../types';
import { Play, Star, X, CheckCircle, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameLauncherModalProps {
  game: GameItem | null;
  onClose: () => void;
  onStartGame: (game: GameItem) => void;
}

export const GameLauncherModal: React.FC<GameLauncherModalProps> = ({
  game,
  onClose,
  onStartGame,
}) => {
  if (!game) return null;

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-3 sm:p-4 font-['Fredoka',sans-serif] animate-in fade-in duration-200">
      <div className="bg-white rounded-[36px] overflow-hidden shadow-2xl border-4 border-amber-300 max-w-sm w-full mx-auto relative animate-in slide-in-from-bottom-6 duration-300">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Header Art */}
        <div className={`relative aspect-[16/10] bg-gradient-to-tr ${game.bgColor} overflow-hidden`}>
          <img
            src={game.iconUrl}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-black px-3 py-1 rounded-full shadow-md ${game.badgeColor} border border-white`}>
              {game.badge}
            </span>
          </div>

          {/* Game Title Over Header */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-2xl font-black leading-tight drop-shadow-md text-amber-200">
              {game.title}
            </h3>
            <p className="text-xs font-bold text-white/90">
              {game.tagline}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5">
          {/* Stats Badges */}
          <div className="flex items-center justify-around bg-slate-100 p-2.5 rounded-2xl">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Age Group</span>
              <span className="text-xs font-black text-slate-800">{game.ageRange}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Rating</span>
              <span className="text-xs font-black text-amber-500 flex items-center justify-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" /> {game.rating}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Reward</span>
              <span className="text-xs font-black text-indigo-600 flex items-center justify-center gap-0.5">
                +{game.starsReward} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            {game.description}
          </p>

          {/* Skills Learned */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
              Skills Developed:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {game.skillsLearned.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-lg"
                >
                  <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Big Tactile START GAME Button */}
          <button
            onClick={() => {
              sound.playStarSparkle();
              onStartGame(game);
            }}
            className="btn-3d btn-3d-play w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 border-2 border-amber-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center shadow">
              <Play className="w-5 h-5 fill-orange-600 ml-0.5" />
            </div>
            <span className="text-xl font-black text-white tracking-wider">
              START GAME!
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
