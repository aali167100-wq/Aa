import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Star, RotateCcw, X, Check, Sparkles } from 'lucide-react';

interface PuzzleMatchProps {
  onClose: () => void;
  onAddStars: (amount: number) => void;
}

interface Piece {
  id: string;
  emoji: string;
  name: string;
  color: string;
  shadowColor: string;
}

const PUZZLE_PIECES: Piece[] = [
  { id: 'star', emoji: '⭐', name: 'Golden Star', color: 'from-amber-300 to-yellow-500', shadowColor: 'shadow-yellow-500/50' },
  { id: 'heart', emoji: '💖', name: 'Love Heart', color: 'from-pink-400 to-rose-500', shadowColor: 'shadow-rose-500/50' },
  { id: 'crown', emoji: '👑', name: 'Magic Crown', color: 'from-yellow-400 to-orange-500', shadowColor: 'shadow-orange-500/50' },
  { id: 'cloud', emoji: '☁️', name: 'Fluffy Cloud', color: 'from-sky-300 to-blue-400', shadowColor: 'shadow-sky-400/50' },
  { id: 'diamond', emoji: '💎', name: 'Shining Gem', color: 'from-cyan-300 to-teal-400', shadowColor: 'shadow-cyan-400/50' },
  { id: 'flower', emoji: '🌸', name: 'Blossom Flower', color: 'from-fuchsia-300 to-pink-500', shadowColor: 'shadow-fuchsia-500/50' },
];

export const PuzzleMatch: React.FC<PuzzleMatchProps> = ({ onClose, onAddStars }) => {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [placedPieceIds, setPlacedPieceIds] = useState<string[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    // Shuffle pieces order for the tray
    const shuffled = [...PUZZLE_PIECES].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, []);

  const handleSelectTrayPiece = (piece: Piece) => {
    if (placedPieceIds.includes(piece.id)) return;
    sound.playPop(520);
    setSelectedPiece(piece);
  };

  const handleSlotClick = (slotPiece: Piece) => {
    if (placedPieceIds.includes(slotPiece.id)) return;

    if (selectedPiece && selectedPiece.id === slotPiece.id) {
      // Correct match!
      sound.playStarSparkle();
      const updated = [...placedPieceIds, slotPiece.id];
      setPlacedPieceIds(updated);
      setSelectedPiece(null);

      // Check for win
      if (updated.length === PUZZLE_PIECES.length) {
        setIsWon(true);
        sound.playVictory();
        onAddStars(20);
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#38BDF8', '#4ADE80', '#FBBF24', '#F472B6'],
        });
      }
    } else if (selectedPiece) {
      // Incorrect match
      sound.playBoing();
    } else {
      sound.playPop(300);
    }
  };

  const restartPuzzle = () => {
    sound.playPop();
    setPlacedPieceIds([]);
    setSelectedPiece(null);
    setIsWon(false);
    setPieces([...PUZZLE_PIECES].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-teal-400 via-sky-500 to-indigo-600 text-white select-none overflow-hidden font-['Fredoka',sans-serif]">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 z-20 bg-black/15 backdrop-blur-sm">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition shadow"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center gap-2 bg-amber-400 text-amber-950 font-black px-4 py-1.5 rounded-full shadow text-sm">
          <Star className="w-4 h-4 fill-amber-950" />
          <span>{placedPieceIds.length} / {PUZZLE_PIECES.length} Matched</span>
        </div>

        <button
          onClick={restartPuzzle}
          className="w-10 h-10 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition shadow"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Guide Banner */}
      <div className="text-center pt-2 px-4">
        <h2 className="text-xl font-black text-amber-200 drop-shadow flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          Match the Magic Shapes!
        </h2>
        <p className="text-xs text-white/80 font-medium">
          Tap a shape below, then tap its matching silhouette frame!
        </p>
      </div>

      {/* Puzzle Board Slots */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2">
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-4 border-2 border-white/30 shadow-2xl max-w-xs mx-auto w-full">
          <div className="grid grid-cols-3 gap-3.5">
            {PUZZLE_PIECES.map((piece) => {
              const isPlaced = placedPieceIds.includes(piece.id);
              const isTargetForSelected = selectedPiece?.id === piece.id;

              return (
                <button
                  key={piece.id}
                  onClick={() => handleSlotClick(piece)}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isPlaced
                      ? `bg-gradient-to-tr ${piece.color} shadow-lg scale-100 border-2 border-white`
                      : isTargetForSelected
                      ? 'bg-amber-300/30 border-2 border-dashed border-amber-300 scale-105 animate-pulse'
                      : 'bg-black/25 border-2 border-dashed border-white/40 hover:bg-black/35'
                  }`}
                >
                  {isPlaced ? (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl animate-in zoom-in-50 duration-200">{piece.emoji}</span>
                      <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-2xl opacity-30 grayscale filter">
                      {piece.emoji}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Tray of Pieces */}
      <div className="p-4 bg-slate-950/40 backdrop-blur-md border-t border-white/20 z-20">
        <p className="text-xs font-bold text-center text-white/80 mb-2">
          {selectedPiece ? `Selected: ${selectedPiece.name} (Tap slot above)` : 'Choose a piece below:'}
        </p>

        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
          {pieces.map((piece) => {
            const isPlaced = placedPieceIds.includes(piece.id);
            const isSelected = selectedPiece?.id === piece.id;

            if (isPlaced) {
              return (
                <div
                  key={piece.id}
                  className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center opacity-30"
                >
                  <span className="text-lg grayscale">{piece.emoji}</span>
                </div>
              );
            }

            return (
              <button
                key={piece.id}
                onClick={() => handleSelectTrayPiece(piece)}
                className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-md active:translate-y-1 ${
                  isSelected
                    ? `bg-gradient-to-tr ${piece.color} ring-4 ring-amber-300 scale-110 -translate-y-1`
                    : 'bg-white/30 hover:bg-white/40 border border-white/50'
                }`}
              >
                {piece.emoji}
              </button>
            );
          })}
        </div>
      </div>

      {/* Win celebration modal */}
      {isWon && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 animate-in fade-in zoom-in duration-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-500 flex items-center justify-center text-4xl shadow-xl border-4 border-white mb-3 animate-bounce">
            🌟
          </div>
          <h2 className="text-3xl font-black text-amber-300 text-center drop-shadow-md">
            PUZZLE SOLVED!
          </h2>
          <p className="text-white/90 text-center text-sm font-semibold mt-1 mb-4">
            You matched every piece like a puzzle champion!
          </p>

          <div className="bg-white/15 rounded-2xl p-4 w-full max-w-xs flex justify-center items-center gap-3 mb-6 border border-white/20">
            <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
            <span className="text-2xl font-black text-white">+20 Stars Awarded!</span>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={restartPuzzle}
              className="flex-1 py-3 px-4 rounded-2xl font-black text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-lg active:translate-y-1 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Again
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-2xl font-black text-white bg-white/20 hover:bg-white/30 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
