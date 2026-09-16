import React, { useState } from 'react';
import { StickerItem } from '../types';
import { ALBUM_BACKGROUNDS } from '../data/rewards';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Palette, RotateCcw, Camera, Lock, Check } from 'lucide-react';

interface StickerBookProps {
  stickers: StickerItem[];
  onPlaceSticker: (stickerId: string, x: number, y: number) => void;
  onClearAlbum: () => void;
}

export const StickerBook: React.FC<StickerBookProps> = ({
  stickers,
  onPlaceSticker,
  onClearAlbum,
}) => {
  const [selectedBgId, setSelectedBgId] = useState<string>('park');
  const [activeStickerToPlace, setActiveStickerToPlace] = useState<StickerItem | null>(null);
  const [cameraFlash, setCameraFlash] = useState<boolean>(false);

  const currentBg = ALBUM_BACKGROUNDS.find((b) => b.id === selectedBgId) || ALBUM_BACKGROUNDS[0];

  const unlockedStickers = stickers.filter((s) => s.unlocked);
  const lockedStickers = stickers.filter((s) => !s.unlocked);

  const handleSelectStickerFromDrawer = (stk: StickerItem) => {
    sound.playPop(stk.soundPitch);
    setActiveStickerToPlace(stk);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeStickerToPlace) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    sound.playStarSparkle();
    onPlaceSticker(activeStickerToPlace.id, x, y);
    setActiveStickerToPlace(null);

    confetti({
      particleCount: 20,
      spread: 40,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
    });
  };

  const handleTakeSnapshot = () => {
    sound.playStarSparkle();
    setCameraFlash(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
    });
    setTimeout(() => setCameraFlash(false), 300);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-3 select-none font-['Fredoka',sans-serif]">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5 leading-tight">
            <span>My 3D Sticker Book</span>
            <span className="text-xl animate-bounce">🎨</span>
          </h3>
          <p className="text-xs font-bold text-slate-500">
            {unlockedStickers.length} of {stickers.length} Stickers Collected!
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Background Scene Selector */}
          <div className="flex bg-white/80 p-1 rounded-2xl border border-slate-200 shadow-xs">
            {ALBUM_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => {
                  sound.playPop(480);
                  setSelectedBgId(bg.id);
                }}
                className={`px-2 py-1 rounded-xl text-xs font-black transition ${
                  selectedBgId === bg.id
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title={bg.name}
              >
                {bg.id === 'park' ? '🌳' : bg.id === 'candy' ? '🍭' : '🪐'}
              </button>
            ))}
          </div>

          {/* Photo Snap Button */}
          <button
            onClick={handleTakeSnapshot}
            className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 hover:bg-amber-300 flex items-center justify-center shadow transition active:scale-90"
            title="Snap Photo of Album"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Sticker Scene Canvas */}
      <div className="relative">
        <div
          onClick={handleCanvasClick}
          className={`relative aspect-[16/11] w-full rounded-[28px] bg-gradient-to-b ${currentBg.bgClass} p-3 border-4 border-white shadow-xl overflow-hidden cursor-crosshair group`}
        >
          {/* Camera Flash overlay */}
          {cameraFlash && (
            <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300" />
          )}

          {/* Scenery Atmosphere Elements */}
          <div className="absolute top-2 inset-x-3 flex justify-between text-2xl opacity-80 pointer-events-none">
            <span>☁️</span>
            <span>🌈</span>
            <span>✨</span>
          </div>

          <div className="absolute bottom-2 inset-x-3 flex justify-between text-3xl opacity-70 pointer-events-none">
            {currentBg.sceneryEmoji.split(' ').map((emoji, i) => (
              <span key={i}>{emoji}</span>
            ))}
          </div>

          {/* Placed Stickers */}
          {stickers
            .filter((s) => s.unlocked && s.placedX !== undefined && s.placedY !== undefined)
            .map((stk) => (
              <div
                key={stk.id}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playPop(stk.soundPitch);
                }}
                style={{
                  left: `${stk.placedX}%`,
                  top: `${stk.placedY}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-13 h-13 rounded-2xl bg-white/90 shadow-lg border-2 border-white flex items-center justify-center text-3xl cursor-grab hover:scale-125 active:scale-95 transition-transform animate-in zoom-in-75 duration-200 select-none group/item"
                title={`${stk.name} (Tap to hear sound!)`}
              >
                {stk.emoji}
                {/* Subtle shine badge */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full border border-white" />
              </div>
            ))}

          {/* Active Sticker Placement Prompt */}
          {activeStickerToPlace && (
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center pointer-events-none">
              <div className="bg-amber-400 text-amber-950 font-black px-4 py-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 text-xs animate-bounce">
                <span className="text-xl">{activeStickerToPlace.emoji}</span>
                <span>Tap anywhere in the scene to stick it!</span>
              </div>
            </div>
          )}
        </div>

        {/* Clear/Reset Canvas Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClearAlbum();
          }}
          className="absolute bottom-2.5 right-2.5 bg-white/80 hover:bg-white text-slate-600 px-2 py-1 rounded-xl text-[10px] font-black border border-slate-200 shadow-sm flex items-center gap-1 active:scale-90 transition"
        >
          <RotateCcw className="w-3 h-3" /> Reset Stickers
        </button>
      </div>

      {/* Sticker Drawer Collection */}
      <div className="bg-white/90 rounded-3xl p-3.5 border-2 border-white shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Pick a Sticker to Peel & Place:
          </span>
          {activeStickerToPlace && (
            <button
              onClick={() => setActiveStickerToPlace(null)}
              className="text-[10px] font-black text-rose-500 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Stickers Grid */}
        <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto no-scrollbar p-1">
          {stickers.map((stk) => {
            const isSelected = activeStickerToPlace?.id === stk.id;

            if (!stk.unlocked) {
              return (
                <div
                  key={stk.id}
                  className="aspect-square rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-1 opacity-60 relative group"
                  title={`Locked: ${stk.gameSource}`}
                >
                  <Lock className="w-4 h-4 text-slate-400 mb-0.5" />
                  <span className="text-[9px] font-bold text-slate-400 text-center leading-tight">
                    {stk.gameSource.split(' ')[0]}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={stk.id}
                onClick={() => handleSelectStickerFromDrawer(stk)}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-1 transition-all shadow-sm ${
                  isSelected
                    ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-300 scale-105 shadow-md'
                    : 'bg-gradient-to-tr from-white to-amber-50/50 border-amber-200 hover:border-amber-400 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-2xl drop-shadow-xs">{stk.emoji}</span>
                <span className="text-[9px] font-black text-slate-800 truncate w-full text-center mt-0.5">
                  {stk.name}
                </span>
                <span
                  className={`text-[8px] font-extrabold uppercase px-1 rounded-sm mt-0.5 ${
                    stk.rarity === 'legendary'
                      ? 'bg-amber-200 text-amber-900'
                      : stk.rarity === 'epic'
                      ? 'bg-purple-200 text-purple-900'
                      : stk.rarity === 'rare'
                      ? 'bg-sky-200 text-sky-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {stk.rarity}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
