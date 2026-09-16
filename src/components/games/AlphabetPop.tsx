import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Star, RotateCcw, X, Sparkles, Volume2 } from 'lucide-react';

interface AlphabetPopProps {
  onClose: () => void;
  onAddStars: (amount: number) => void;
}

interface Bubble {
  id: number;
  val: string;
  x: number; // percentage
  y: number; // percentage
  color: string;
  size: number;
  speed: number;
}

const ITEMS_POOL = ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5'];
const COLORS = [
  'from-pink-400 to-rose-500',
  'from-amber-400 to-yellow-500',
  'from-emerald-400 to-green-500',
  'from-sky-400 to-blue-500',
  'from-purple-400 to-indigo-500',
  'from-orange-400 to-red-500',
];

export const AlphabetPop: React.FC<AlphabetPopProps> = ({ onClose, onAddStars }) => {
  const [target, setTarget] = useState<string>('A');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const nextId = useRef(1);

  // Pick new target
  const pickNewTarget = () => {
    const nextTarget = ITEMS_POOL[Math.floor(Math.random() * ITEMS_POOL.length)];
    setTarget(nextTarget);

    // Speak or cue
    if ('speechSynthesis' in window) {
      try {
        const text = isNaN(Number(nextTarget)) ? `Find letter ${nextTarget}` : `Find number ${nextTarget}`;
        const utter = new SpeechSynthesisUtterance(text);
        utter.pitch = 1.3;
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      } catch {
        // speech synthesis might be disabled
      }
    }
  };

  useEffect(() => {
    pickNewTarget();
  }, []);

  // Bubble spawner and motion loop
  useEffect(() => {
    if (isWon) return;

    const interval = setInterval(() => {
      // Spawn new bubble if less than 6
      setBubbles((prev) => {
        let current = [...prev];
        if (current.length < 6 && Math.random() < 0.35) {
          const spawnVal =
            Math.random() < 0.4
              ? target
              : ITEMS_POOL[Math.floor(Math.random() * ITEMS_POOL.length)];
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];

          current.push({
            id: nextId.current++,
            val: spawnVal,
            x: 15 + Math.random() * 70, // 15% to 85% width
            y: 105, // start below
            color,
            size: 64 + Math.floor(Math.random() * 16),
            speed: 0.8 + Math.random() * 0.6,
          });
        }

        // Float bubbles upwards
        return current
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -15);
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isWon, target]);

  const handlePopBubble = (bubble: Bubble) => {
    if (bubble.val === target) {
      // Correct!
      sound.playStarSparkle();
      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      const nextCount = poppedCount + 1;
      setPoppedCount(nextCount);

      if (nextCount >= 8) {
        // Completed lesson!
        setIsWon(true);
        sound.playVictory();
        onAddStars(35);
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#38BDF8', '#F59E0B', '#10B981', '#EC4899'],
        });
      } else {
        pickNewTarget();
      }
    } else {
      // Wrong bubble
      sound.playBoing();
    }
  };

  const speakCurrentTarget = () => {
    sound.playPop();
    if ('speechSynthesis' in window) {
      try {
        const text = isNaN(Number(target)) ? `Find letter ${target}` : `Find number ${target}`;
        const utter = new SpeechSynthesisUtterance(text);
        utter.pitch = 1.3;
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      } catch {
        // speech synthesis might be disabled
      }
    }
  };

  const restartLesson = () => {
    sound.playPop();
    setPoppedCount(0);
    setIsWon(false);
    setBubbles([]);
    pickNewTarget();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-indigo-500 via-purple-600 to-pink-600 text-white select-none overflow-hidden font-['Fredoka',sans-serif]">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 z-20 bg-black/20 backdrop-blur-sm">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition shadow"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 font-black px-3.5 py-1.5 rounded-full shadow text-sm">
            <Star className="w-4 h-4 fill-amber-950" />
            <span>Found: {poppedCount} / 8</span>
          </div>
        </div>

        <button
          onClick={restartLesson}
          className="w-10 h-10 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition shadow"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Big Educational Mission Prompt */}
      <div className="px-4 py-2 text-center z-20">
        <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-3xl border-2 border-white/40 shadow-xl">
          <span className="text-sm font-bold text-white/90">POP THE:</span>
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 font-black text-2xl flex items-center justify-center shadow-lg animate-bounce border-2 border-white">
            {target}
          </div>
          <button
            onClick={speakCurrentTarget}
            className="p-2 rounded-xl bg-white/25 hover:bg-white/40 active:scale-95 transition"
            title="Hear Pronunciation"
          >
            <Volume2 className="w-5 h-5 text-yellow-300" />
          </button>
        </div>
      </div>

      {/* Floating Bubbles Area */}
      <div className="relative flex-1 w-full overflow-hidden">
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            onClick={() => handlePopBubble(bubble)}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr ${bubble.color} border-3 border-white/90 shadow-2xl flex items-center justify-center font-black text-white text-2xl active:scale-90 transition-transform cursor-pointer group`}
          >
            {/* Bubble shine reflection */}
            <div className="absolute top-1.5 left-2 w-3.5 h-2 bg-white/70 rounded-full rotate-[-30deg]" />
            <span className="drop-shadow-md select-none group-hover:scale-110 transition-transform">
              {bubble.val}
            </span>
          </button>
        ))}
      </div>

      {/* Friendly Mascot Tip */}
      <div className="p-3 bg-slate-950/40 backdrop-blur-sm border-t border-white/15 flex items-center justify-center gap-3 text-sm z-20">
        <span className="text-2xl animate-wiggle">🦉</span>
        <span className="font-semibold text-white/90 text-xs">
          Teacher Owl says: Tap the floating bubbles with {target}!
        </span>
      </div>

      {/* Win Modal */}
      {isWon && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 animate-in fade-in zoom-in duration-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 flex items-center justify-center text-4xl shadow-xl border-4 border-white mb-3 animate-bounce">
            🎓
          </div>
          <h2 className="text-3xl font-black text-amber-300 text-center drop-shadow-md">
            GENIUS MASTER!
          </h2>
          <p className="text-white/90 text-center text-sm font-semibold mt-1 mb-4">
            You mastered your letters and numbers with flying colors!
          </p>

          <div className="bg-white/15 rounded-2xl p-4 w-full max-w-xs flex justify-center items-center gap-3 mb-6 border border-white/20">
            <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
            <span className="text-2xl font-black text-white">+35 Stars Earned!</span>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={restartLesson}
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
