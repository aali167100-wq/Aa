import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, Clock, ShieldCheck, Heart, Sun } from 'lucide-react';
import { sound } from '../utils/audio';

interface BedtimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtendMinutes: (minutes: number) => void;
}

export const BedtimeModal: React.FC<BedtimeModalProps> = ({
  isOpen,
  onClose,
  onExtendMinutes,
}) => {
  const [showParentUnlock, setShowParentUnlock] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      sound.playLullaby();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer.trim(), 10) === 15) {
      sound.playStarSparkle();
      onExtendMinutes(15);
      setShowParentUnlock(false);
      setAnswer('');
      onClose();
    } else {
      sound.playBoing();
      setError('Incorrect answer for parents.');
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/95 backdrop-blur-md flex items-center justify-center p-4 font-['Fredoka',sans-serif] select-none animate-in fade-in duration-300">
      <div className="bg-slate-900 border-4 border-indigo-400/80 rounded-[36px] max-w-sm w-full p-6 text-center text-white shadow-2xl relative flex flex-col items-center">
        {/* Floating Night Moon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-200 to-yellow-300 flex items-center justify-center text-5xl shadow-[0_0_35px_rgba(253,224,71,0.5)] mb-4 animate-bounce">
          🌙
        </div>

        <div className="inline-flex items-center gap-1.5 bg-indigo-900/90 text-indigo-200 px-3 py-1 rounded-full text-xs font-black border border-indigo-500 mb-2">
          <Moon className="w-3.5 h-3.5 fill-indigo-300 text-indigo-300" />
          <span>BEDTIME & SCREEN BREAK</span>
        </div>

        <h3 className="text-2xl font-black text-amber-200 leading-tight">
          Time to Rest Your Eyes!
        </h3>

        <p className="text-xs font-bold text-slate-300 mt-2 mb-5 leading-relaxed px-2">
          You did an amazing job playing and learning today! Time to stretch, take a
          break, drink water, or get ready for cozy dreams! 🌟
        </p>

        {/* Relaxing Bedtime Tips */}
        <div className="w-full bg-indigo-900/50 rounded-2xl p-3 border border-indigo-500/40 text-left mb-4">
          <div className="flex items-center gap-2 text-xs font-black text-indigo-200 mb-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>Healthy Screen Time Habit:</span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1">
            <div>✨ Look away at far-off objects to relax eyes</div>
            <div>🥛 Drink a nice glass of water or warm milk</div>
            <div>🛌 Rest well for your next high score!</div>
          </div>
        </div>

        {showParentUnlock ? (
          <form onSubmit={handleVerifyUnlock} className="w-full bg-slate-800 p-3 rounded-2xl border border-slate-700">
            <div className="text-xs font-black text-amber-300 mb-1">
              Parent Override (Solve: 7 + 8 = ?)
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Answer"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-xl text-center text-sm font-black text-white"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition"
              >
                +15m
              </button>
            </div>
            {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
          </form>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => {
                sound.playLullaby();
              }}
              className="w-full py-3 rounded-2xl bg-indigo-800/80 hover:bg-indigo-700/80 text-indigo-200 text-xs font-black border border-indigo-500 flex items-center justify-center gap-1.5 transition"
            >
              <span>🎵 Play Soothing Lullaby</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setShowParentUnlock(true);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 font-bold underline transition mt-1"
            >
              Parent Settings / Add More Minutes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
