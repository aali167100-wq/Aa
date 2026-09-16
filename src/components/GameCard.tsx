import React from 'react';
import { GameItem } from '../types';
import { Play, Star, Sparkles, Users } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameCardProps {
  game: GameItem;
  onPlay: (game: GameItem) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playStarSparkle();
    onPlay(game);
  };

  return (
    <div
      onClick={() => {
        sound.playPop();
        onPlay(game);
      }}
      className="toy-card p-3 border-2 border-white/80 cursor-pointer group select-none relative overflow-hidden"
    >
      {/* Top Accent Gradient Bar */}
      <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${game.bgColor}`} />

      {/* Main Card Content */}
      <div className="flex gap-3 items-center">
        {/* 3D Game Icon / Art */}
        <div className="relative w-22 h-22 rounded-2xl overflow-hidden bg-slate-100 shadow-md border-2 border-white shrink-0 group-hover:scale-105 transition-transform duration-300">
          <img
            src={game.iconUrl}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Badge over thumbnail */}
          <div className="absolute top-1 left-1">
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs border border-white/60 ${game.badgeColor}`}
            >
              {game.badge}
            </span>
          </div>
        </div>

        {/* Details & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {game.ageRange}
            </span>
            <div className="flex items-center gap-0.5 text-[11px] font-extrabold text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{game.rating}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold ml-auto">
              {game.playsCount}
            </span>
          </div>

          <h4 className="text-base font-black text-slate-800 leading-snug truncate group-hover:text-indigo-600 transition-colors">
            {game.title}
          </h4>

          <p className="text-[11px] font-semibold text-slate-500 line-clamp-1 mb-2">
            {game.tagline}
          </p>

          {/* Action Row: Skills & Play Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                +{game.starsReward}
              </span>
            </div>

            {/* Play Button */}
            <button
              onClick={handlePlayClick}
              className={`btn-3d py-1.5 px-3.5 rounded-xl font-black text-xs text-white flex items-center gap-1.5 shadow-sm bg-gradient-to-r ${game.bgColor} border border-white`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>PLAY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
