import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Trophy, Star, RotateCcw, X, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface RainbowRacerProps {
  onClose: () => void;
  onAddStars: (amount: number) => void;
}

interface Item {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // 0 to 100%
  type: 'star' | 'cone' | 'gem';
}

export const RainbowRacer: React.FC<RainbowRacerProps> = ({ onClose, onAddStars }) => {
  const [lane, setLane] = useState<number>(1); // 0: Left, 1: Center, 2: Right
  const [score, setScore] = useState<number>(0);
  const [starsCaught, setStarsCaught] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [speed, setSpeed] = useState<number>(1.2);
  const nextId = useRef(1);

  const moveLeft = () => {
    sound.playPop(480);
    setLane((prev) => Math.max(0, prev - 1));
  };

  const moveRight = () => {
    sound.playPop(560);
    setLane((prev) => Math.min(2, prev + 1));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') moveLeft();
      if (e.key === 'ArrowRight' || e.key === 'd') moveRight();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameOver || gameWon) return;

    const interval = setInterval(() => {
      // Spawn new items occasionally
      if (Math.random() < 0.28) {
        const itemType: 'star' | 'cone' | 'gem' = Math.random() < 0.6 ? 'star' : Math.random() < 0.85 ? 'gem' : 'cone';
        setItems((prev) => [
          ...prev,
          {
            id: nextId.current++,
            lane: Math.floor(Math.random() * 3),
            y: 0,
            type: itemType,
          },
        ]);
      }

      // Move items down
      setItems((prev) => {
        const updated: Item[] = [];
        for (const item of prev) {
          const newY = item.y + speed * 2.8;

          // Check collision near player (y ~ 75% to 88%)
          if (newY >= 74 && newY <= 88 && item.lane === lane) {
            if (item.type === 'star') {
              sound.playStarSparkle();
              setScore((s) => s + 20);
              setStarsCaught((c) => c + 1);
            } else if (item.type === 'gem') {
              sound.playStarSparkle();
              setScore((s) => s + 50);
              setStarsCaught((c) => c + 3);
            } else if (item.type === 'cone') {
              sound.playBoing();
              setScore((s) => Math.max(0, s - 10));
            }
            continue; // Collected, don't keep
          }

          if (newY < 100) {
            updated.push({ ...item, y: newY });
          }
        }
        return updated;
      });

      // Gradually increase speed and check win condition
      setSpeed((s) => Math.min(2.2, s + 0.001));
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver, gameWon, lane, speed]);

  // Win condition at 15 stars
  useEffect(() => {
    if (starsCaught >= 12 && !gameWon) {
      setGameWon(true);
      sound.playVictory();
      onAddStars(25);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFDD00', '#FF3366', '#00D2FF', '#7000FF'],
      });
    }
  }, [starsCaught, gameWon, onAddStars]);

  const restartGame = () => {
    sound.playPop();
    setLane(1);
    setScore(0);
    setStarsCaught(0);
    setItems([]);
    setSpeed(1.2);
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-sky-400 via-indigo-500 to-purple-800 text-white select-none overflow-hidden font-['Fredoka',sans-serif]">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 z-20 bg-black/20 backdrop-blur-sm">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition shadow"
          title="Exit Game"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-400/90 text-amber-950 font-black px-3 py-1 rounded-full shadow-inner text-sm">
            <Star className="w-4 h-4 fill-amber-950" />
            <span>{starsCaught} / 12</span>
          </div>
          <div className="bg-white/20 text-white font-extrabold px-3 py-1 rounded-full text-sm">
            PTS: {score}
          </div>
        </div>
      </div>

      {/* Track Container */}
      <div className="relative flex-1 w-full max-w-sm mx-auto overflow-hidden">
        {/* Animated Rainbow Track Background */}
        <div className="absolute inset-0 flex">
          {/* Lane 0: Pink/Rose */}
          <div className="flex-1 border-r-2 border-white/20 bg-gradient-to-b from-pink-400/30 to-pink-600/40 relative">
            <div className="absolute inset-y-0 right-0 w-0.5 border-r border-dashed border-white/40" />
          </div>
          {/* Lane 1: Yellow/Amber */}
          <div className="flex-1 border-r-2 border-white/20 bg-gradient-to-b from-amber-400/30 to-amber-600/40 relative">
            <div className="absolute inset-y-0 right-0 w-0.5 border-r border-dashed border-white/40" />
          </div>
          {/* Lane 2: Cyan/Sky */}
          <div className="flex-1 bg-gradient-to-b from-cyan-400/30 to-cyan-600/40 relative" />
        </div>

        {/* Falling Items */}
        {items.map((item) => {
          const lanePercent = item.lane === 0 ? '16.6%' : item.lane === 1 ? '50%' : '83.3%';
          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
              style={{
                left: lanePercent,
                top: `${item.y}%`,
              }}
            >
              {item.type === 'star' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-400 flex items-center justify-center shadow-lg animate-spin text-xl border-2 border-white">
                  ⭐
                </div>
              )}
              {item.type === 'gem' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center shadow-lg animate-bounce text-xl border-2 border-white">
                  💎
                </div>
              )}
              {item.type === 'cone' && (
                <div className="w-8 h-8 flex items-center justify-center text-2xl drop-shadow-md">
                  🍦
                </div>
              )}
            </div>
          );
        })}

        {/* Player Cute 3D Cartoon Racer */}
        <div
          className="absolute bottom-[16%] -translate-x-1/2 transition-all duration-150 ease-out z-10"
          style={{
            left: lane === 0 ? '16.6%' : lane === 1 ? '50%' : '83.3%',
          }}
        >
          <div className="relative group">
            {/* Speed trails */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-cyan-300/60 rounded-full blur-xs animate-pulse" />
            
            {/* 3D Toy Car Body */}
            <div className="w-16 h-20 bg-gradient-to-t from-red-600 via-rose-500 to-amber-400 rounded-3xl p-1.5 shadow-2xl border-2 border-white flex flex-col items-center justify-between">
              {/* Windshield & cute eyes */}
              <div className="w-12 h-7 bg-sky-200 rounded-2xl border border-sky-400 flex items-center justify-center gap-2 shadow-inner">
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full -mt-0.5 -ml-0.5" />
                </div>
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full -mt-0.5 -ml-0.5" />
                </div>
              </div>

              {/* Smiling Grill */}
              <div className="w-8 h-2 bg-amber-200 rounded-full border border-amber-400" />

              {/* Side Wheels */}
              <div className="absolute -left-2 top-3 w-3 h-5 bg-slate-900 rounded-lg border border-slate-700" />
              <div className="absolute -right-2 top-3 w-3 h-5 bg-slate-900 rounded-lg border border-slate-700" />
              <div className="absolute -left-2 bottom-3 w-3 h-5 bg-slate-900 rounded-lg border border-slate-700" />
              <div className="absolute -right-2 bottom-3 w-3 h-5 bg-slate-900 rounded-lg border border-slate-700" />
            </div>
          </div>
        </div>

        {/* Win Overlay Modal */}
        {gameWon && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 flex items-center justify-center text-4xl shadow-xl border-4 border-white mb-3 animate-bounce">
              🏆
            </div>
            <h2 className="text-3xl font-black text-amber-300 text-center drop-shadow-md">
              YOU WON!
            </h2>
            <p className="text-white/90 text-center text-sm font-semibold mt-1 mb-4">
              Awesome driving! You collected all the magical stars!
            </p>

            <div className="bg-white/15 rounded-2xl p-4 w-full max-w-xs flex justify-around mb-6 border border-white/20">
              <div className="text-center">
                <span className="text-xs text-white/70 block">Score</span>
                <span className="text-2xl font-black text-white">{score}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-white/70 block">Stars Won</span>
                <span className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-amber-300" /> +25
                </span>
              </div>
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={restartGame}
                className="flex-1 py-3 px-4 rounded-2xl font-black text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-lg active:translate-y-1 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Play Again
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

      {/* Big Tactile Steer Controls at Bottom for Touch / Clicks */}
      <div className="p-4 bg-slate-950/40 backdrop-blur-sm border-t border-white/15 flex items-center justify-center gap-6 z-20">
        <button
          onClick={moveLeft}
          disabled={lane === 0}
          className={`w-24 h-16 rounded-3xl font-black text-xl flex items-center justify-center gap-2 border-b-4 transition-all shadow-lg ${
            lane === 0
              ? 'bg-slate-700 text-slate-400 border-slate-900 opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-orange-700 active:translate-y-1'
          }`}
        >
          <ArrowLeft className="w-7 h-7 stroke-[3]" />
          <span>LEFT</span>
        </button>

        <button
          onClick={moveRight}
          disabled={lane === 2}
          className={`w-24 h-16 rounded-3xl font-black text-xl flex items-center justify-center gap-2 border-b-4 transition-all shadow-lg ${
            lane === 2
              ? 'bg-slate-700 text-slate-400 border-slate-900 opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-blue-700 active:translate-y-1'
          }`}
        >
          <span>RIGHT</span>
          <ArrowRight className="w-7 h-7 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
