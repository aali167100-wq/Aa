import React, { useState } from 'react';
import { ShieldCheck, X, Check, Clock, Volume2, User, Star, Lock } from 'lucide-react';
import { KidProfile } from '../types';
import { sound } from '../utils/audio';

interface ParentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: KidProfile;
  onUpdateProfile: (updated: KidProfile) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const AVATAR_OPTIONS = ['🦁', '🐼', '🐰', '🐶', '🚀', '🦊', '🦄', '⭐'];

export const ParentalModal: React.FC<ParentalModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  isMuted,
  onToggleMute,
}) => {
  // Math gate challenge to prevent accidental kid entry
  const [num1] = useState(6);
  const [num2] = useState(7);
  const correctAnswer = num1 + num2; // 13
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [dailyLimit, setDailyLimit] = useState<number>(30); // 30 minutes

  if (!isOpen) return null;

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer.trim(), 10) === correctAnswer) {
      sound.playStarSparkle();
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      sound.playBoing();
      setErrorMsg('Incorrect answer. Parents only!');
      setUserAnswer('');
    }
  };

  const handleSelectAvatar = (emoji: string) => {
    sound.playPop();
    onUpdateProfile({ ...profile, avatarEmoji: emoji });
  };

  const handleNameChange = (name: string) => {
    onUpdateProfile({ ...profile, name });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-['Fredoka',sans-serif]">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-4 border-amber-300 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-tight">
              Parental Zone & Safety
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Child-Safe Settings & Profiles
            </p>
          </div>
        </div>

        {!isUnlocked ? (
          /* Parental Gate Screen */
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mx-auto mb-2 shadow">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">
              Grown-ups Only!
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Please solve this quick problem to access settings:
            </p>

            <form onSubmit={handleVerifyGate} className="space-y-3">
              <div className="text-xl font-black text-indigo-700 bg-white py-2 rounded-xl border border-indigo-200">
                {num1} + {num2} = ?
              </div>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter answer"
                className="w-full text-center py-2 px-3 rounded-xl border-2 border-slate-300 font-black text-lg focus:border-indigo-500 outline-none"
                autoFocus
              />
              {errorMsg && (
                <p className="text-xs font-bold text-rose-500">{errorMsg}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-black text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:translate-y-0.5 transition"
              >
                Verify & Enter
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Settings */
          <div className="space-y-4">
            {/* Child Profile Settings */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Child Avatar & Nickname
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="flex-1 py-1.5 px-3 rounded-xl border border-slate-300 font-bold text-sm text-slate-800"
                  placeholder="Child's Name"
                />
              </div>

              {/* Avatar options */}
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSelectAvatar(emoji)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition ${
                      profile.avatarEmoji === emoji
                        ? 'bg-amber-100 border-amber-500 scale-110'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Time Limit */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" /> Daily Play Time Limit
                </span>
                <span className="font-black text-indigo-700">{dailyLimit} mins</span>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                step={15}
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Sound & Music Controls */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">Game Sound Effects</span>
              </div>
              <button
                onClick={onToggleMute}
                className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                  !isMuted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-300 text-slate-600'
                }`}
              >
                {!isMuted ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* Safety Guarantee */}
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-[11px] text-emerald-800 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Safe: Zero third-party ads, zero tracking, safe kid sandbox.</span>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl font-black text-sm bg-slate-900 hover:bg-slate-800 text-white shadow"
            >
              Save & Back to Games
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
