import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameCategory, GameItem, KidProfile, AvatarCustomization } from './types';
import { GAMES_DATA } from './data/games';
import { sound } from './utils/audio';

import { PhoneFrame } from './components/PhoneFrame';
import { PromoControls } from './components/PromoControls';
import { HeaderBar } from './components/HeaderBar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryChips } from './components/CategoryChips';
import { GameCard } from './components/GameCard';
import { GameLauncherModal } from './components/GameLauncherModal';
import { ParentalModal } from './components/ParentalModal';
import { CharacterCustomizer } from './components/CharacterCustomizer';
import { LuckySpinModal } from './components/LuckySpinModal';
import { BedtimeModal } from './components/BedtimeModal';

import { RainbowRacer } from './components/games/RainbowRacer';
import { PuzzleMatch } from './components/games/PuzzleMatch';
import { AnimalMemory } from './components/games/AnimalMemory';
import { AlphabetPop } from './components/games/AlphabetPop';
import { BomberoAutoRunner } from './components/games/BomberoAutoRunner';
import { CyberCosmoDash } from './components/games/CyberCosmoDash';
import { SpinReward } from './types';

import {
  Trophy,
  Gift,
  Sparkles,
  Gamepad2,
  Smile,
  Home,
  Star,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';

export default function App() {
  const [isPromoView, setIsPromoView] = useState<boolean>(true);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [selectedGameForModal, setSelectedGameForModal] = useState<GameItem | null>(null);
  const [activeGameType, setActiveGameType] = useState<string | null>(null);
  const [isParentalGateOpen, setIsParentalGateOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'rewards' | 'stickers'>('home');
  const [showChestReward, setShowChestReward] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState<boolean>(false);
  const [isBedtimeOpen, setIsBedtimeOpen] = useState<boolean>(false);

  // 3D Avatar Configuration (Auto Creator 3D)
  const [avatarConfig, setAvatarConfig] = useState<AvatarCustomization>({
    skinTone: 'honey',
    expression: 'happy',
    hairstyle: 'fire-helmet',
    hairColor: '#F59E0B',
    outfit: 'bombero',
    accessory: 'fire-hose',
    petCompanion: 'dalmatian',
    backgroundTheme: 'from-amber-400 via-red-400 to-yellow-300',
    pose: 'hero',
    title: 'Chief Bombero 3D Hero',
  });

  // Kid Player Profile State
  const [kidProfile, setKidProfile] = useState<KidProfile>({
    name: 'Leo & Friends',
    avatarEmoji: '👨‍🚒',
    level: 3,
    stars: 280,
    streakDays: 4,
    stickersCollected: 8,
  });

  // Filter games based on chosen category
  const displayedGames =
    selectedCategory === 'all'
      ? GAMES_DATA
      : GAMES_DATA.filter((g) => g.category === selectedCategory);

  const handleAddStars = (amount: number) => {
    setKidProfile((prev) => ({
      ...prev,
      stars: prev.stars + amount,
      level: prev.stars + amount > 350 ? 4 : prev.level,
    }));
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sound.setMuted(nextMute);
    if (nextMute && isBgmPlaying) {
      setIsBgmPlaying(false);
    }
  };

  const handleToggleBgm = () => {
    const playing = sound.toggleBgm();
    setIsBgmPlaying(playing);
    if (playing) {
      setIsMuted(false);
    }
  };

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF1493', '#FFDD00', '#00E5FF', '#76FF03', '#9C27B0'],
    });
  };

  const handlePlayNow = () => {
    // Launch Bombero Auto Run 3D as the Featured Hero Adventure!
    sound.playSiren();
    setActiveGameType('bombero-autorun');
  };

  const handleStartGame = (game: GameItem) => {
    setSelectedGameForModal(null);
    setActiveGameType(game.gameplayType);
  };

  const handleOpenChest = () => {
    sound.playStarSparkle();
    setShowChestReward(true);
    handleAddStars(50);
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF4500'],
    });
  };

  const handleClaimSpinReward = (reward: SpinReward) => {
    const starVal = typeof reward.value === 'number' ? reward.value : 50;
    handleAddStars(starVal);
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#06B6D4', '#FFD700', '#A855F7', '#FF1493'],
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 flex flex-col font-['Fredoka',sans-serif] selection:bg-amber-300">
      {/* Top Promotional Video Control Toolbar */}
      <PromoControls
        isPromoView={isPromoView}
        onTogglePromoView={() => setIsPromoView((v) => !v)}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
        onTriggerConfetti={handleTriggerConfetti}
        onQuickPlay={handlePlayNow}
        onPlayBombero={() => {
          sound.playSiren();
          setActiveGameType('bombero-autorun');
        }}
        onPlayCyberCosmo={() => {
          sound.playLaser();
          setActiveGameType('cyber-cosmo');
        }}
        onOpenLuckySpin={() => {
          sound.playSpinTick();
          setIsLuckySpinOpen(true);
        }}
      />

      {/* Main Container - 9:16 vertical mobile format or full responsive */}
      <div className="flex-1 flex items-center justify-center">
        <PhoneFrame isPromoView={isPromoView}>
          {/* If a Mini-Game is Active, Render the Mini-Game Interface */}
          {activeGameType === 'cyber-cosmo' && (
            <CyberCosmoDash
              onClose={() => setActiveGameType(null)}
              onAddStars={handleAddStars}
            />
          )}

          {activeGameType === 'bombero-autorun' && (
            <BomberoAutoRunner
              onClose={() => setActiveGameType(null)}
              onAddStars={handleAddStars}
            />
          )}

          {activeGameType === 'racing' && (
            <RainbowRacer
              onClose={() => setActiveGameType(null)}
              onAddStars={handleAddStars}
            />
          )}

          {activeGameType === 'puzzle' && (
            <PuzzleMatch
              onClose={() => setActiveGameType(null)}
              onAddStars={handleAddStars}
            />
          )}

          {activeGameType === 'matching' && (
            <AnimalMemory
              onClose={() => setActiveGameType(null)}
              onAddStars={handleAddStars}
            />
          )}

          {activeGameType === 'educational' && (
            <AlphabetPop
              onClose={() => setActiveGameType(null)}
              onAddStars={handleAddStars}
            />
          )}

          {/* Main Fun Kids Games App Interface */}
          {!activeGameType && (
            <div className="flex-1 flex flex-col pb-16">
              {/* App Header with Kid Profile & Star Counter */}
              <HeaderBar
                profile={kidProfile}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onOpenParentalGate={() => setIsParentalGateOpen(true)}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
                onOpenLuckySpin={() => setIsLuckySpinOpen(true)}
                onOpenBedtime={() => setIsBedtimeOpen(true)}
              />

              {/* Main Content Area Based on Active Tab */}
              {activeTab === 'home' && (
                <>
                  {/* Hero Showcase with 3D Cartoon Kids and Large PLAY NOW Button */}
                  <HeroBanner onPlayNow={handlePlayNow} />

                  {/* Daily Star Quest Meter */}
                  <div className="px-4 py-1.5 select-none">
                    <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border-2 border-amber-200 shadow-sm flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-xl shadow-inner border border-white animate-bounce">
                          🎁
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-xs font-black text-slate-800">
                            <span>Mystery Toy Chest</span>
                            <span className="text-[10px] text-amber-600 font-bold">
                              (280/300 ⭐)
                            </span>
                          </div>
                          <div className="w-32 sm:w-40 h-2.5 bg-slate-200 rounded-full overflow-hidden mt-1 border border-slate-300">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-500"
                              style={{ width: '88%' }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleOpenChest}
                        className="btn-3d py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black text-xs shadow border border-white whitespace-nowrap"
                      >
                        CLAIM
                      </button>
                    </div>
                  </div>

                  {/* Futuristic Quick Activity Cards */}
                  <div className="px-4 py-1 grid grid-cols-3 gap-2 select-none">
                    <button
                      onClick={() => {
                        sound.playSpinTick();
                        setIsLuckySpinOpen(true);
                      }}
                      className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex flex-col items-center justify-center shadow-md border border-white/60 active:scale-95 transition cursor-pointer"
                    >
                      <span className="text-2xl animate-bounce">🎰</span>
                      <span className="text-[10px] font-black mt-1">Lucky Spin</span>
                      <span className="text-[8px] font-bold text-pink-100">Win Stars</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playLaser();
                        setActiveGameType('cyber-cosmo');
                      }}
                      className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex flex-col items-center justify-center shadow-md border border-white/60 active:scale-95 transition cursor-pointer"
                    >
                      <span className="text-2xl">🚀</span>
                      <span className="text-[10px] font-black mt-1">Cyber Dash</span>
                      <span className="text-[8px] font-bold text-cyan-100">3D Jetpack</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playLullaby();
                        setIsBedtimeOpen(true);
                      }}
                      className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-700 to-slate-900 text-white flex flex-col items-center justify-center shadow-md border border-white/60 active:scale-95 transition cursor-pointer"
                    >
                      <span className="text-2xl">🌙</span>
                      <span className="text-[10px] font-black mt-1">Bedtime</span>
                      <span className="text-[8px] font-bold text-indigo-200">Rest Mode</span>
                    </button>
                  </div>

                  {/* Interactive Category Chips */}
                  <div className="mt-1">
                    <div className="px-4 flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-indigo-500" />
                        Explore Adventures
                      </h4>
                      <span className="text-[11px] font-bold text-slate-400">
                        {displayedGames.length} Games
                      </span>
                    </div>
                    <CategoryChips
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                    />
                  </div>

                  {/* Games Catalog List */}
                  <div className="px-4 space-y-3 mt-1 flex-1">
                    {displayedGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onPlay={(g) => setSelectedGameForModal(g)}
                      />
                    ))}
                  </div>

                  {/* Safety & Community Trust Footnote */}
                  <div className="p-4 text-center mt-2">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-[11px] font-black border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Kid Safe & Parent Approved • Ad-Free
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 mt-1">
                      Certified for ages 2 to 8 • High-Quality 3D Animations
                    </p>
                  </div>
                </>
              )}

              {/* Rewards / Badges Tab */}
              {activeTab === 'rewards' && (
                <div className="p-4 space-y-4 animate-in fade-in duration-150 select-none">
                  <div className="bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl p-4 text-amber-950 shadow-lg border-2 border-white text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/40 flex items-center justify-center text-4xl mx-auto mb-2 border border-white">
                      🏆
                    </div>
                    <h3 className="text-2xl font-black">Star Champion!</h3>
                    <p className="text-xs font-bold text-amber-900 mt-0.5">
                      You have earned {kidProfile.stars} Stars!
                    </p>
                  </div>

                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Badges Unlocked ({kidProfile.stickersCollected}/12)
                  </h4>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { name: 'Speedy Buggy', emoji: '🏎️', unlocked: true, desc: 'Play Racing' },
                      { name: 'Puzzle Ace', emoji: '🧩', unlocked: true, desc: 'Finish 1 Puzzle' },
                      { name: 'Animal Buddy', emoji: '🦁', unlocked: true, desc: 'Find Twins' },
                      { name: 'Owl Master', emoji: '🦉', unlocked: true, desc: 'Pop 8 Bubbles' },
                      { name: 'Super Streak', emoji: '🔥', unlocked: true, desc: '4 Days Active' },
                      { name: 'Star Catcher', emoji: '⭐', unlocked: true, desc: '100+ Stars' },
                      { name: 'Space Explorer', emoji: '🚀', unlocked: false, desc: 'Reach Level 5' },
                      { name: 'Rainbow Crown', emoji: '👑', unlocked: false, desc: 'Collect 500 ⭐' },
                      { name: 'Master Artist', emoji: '🎨', unlocked: false, desc: 'All Stickers' },
                    ].map((b, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-2xl border-2 text-center transition ${
                          b.unlocked
                            ? 'bg-white border-amber-300 shadow-sm'
                            : 'bg-slate-100 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="text-2xl mb-1">{b.emoji}</div>
                        <div className="text-xs font-black text-slate-800 leading-tight">
                          {b.name}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 mt-0.5">
                          {b.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stickers Tab */}
              {activeTab === 'stickers' && (
                <div className="p-4 space-y-4 animate-in fade-in duration-150 select-none">
                  <div className="text-center">
                    <h3 className="text-xl font-black text-slate-800">
                      My 3D Sticker Book 🎨
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      Tap stickers to hear their cute sounds!
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-3 bg-white/80 rounded-3xl p-4 border-2 border-white shadow-md">
                    {['🦁', '🐼', '🐰', '🐯', '🍦', '⭐', '🏎️', '🎈', '🦉', '💎', '🌈', '🍭'].map(
                      (sticker, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            sound.playPop(440 + idx * 40);
                            confetti({
                              particleCount: 25,
                              spread: 50,
                              origin: { y: 0.7 },
                            });
                          }}
                          className="aspect-square rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-3xl shadow-sm active:scale-90 transition-transform cursor-pointer"
                        >
                          {sticker}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation Dock (when no game is actively being played) */}
          {!activeGameType && (
            <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 py-2 px-6 flex items-center justify-around z-30 shadow-lg select-none">
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('home');
                }}
                className={`flex flex-col items-center gap-0.5 transition ${
                  activeTab === 'home'
                    ? 'text-indigo-600 font-black scale-105'
                    : 'text-slate-400 font-bold hover:text-slate-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    activeTab === 'home' ? 'bg-indigo-100' : 'bg-transparent'
                  }`}
                >
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-[10px]">Home</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('rewards');
                }}
                className={`flex flex-col items-center gap-0.5 transition ${
                  activeTab === 'rewards'
                    ? 'text-amber-600 font-black scale-105'
                    : 'text-slate-400 font-bold hover:text-slate-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    activeTab === 'rewards' ? 'bg-amber-100' : 'bg-transparent'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-[10px]">Trophies</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('stickers');
                }}
                className={`flex flex-col items-center gap-0.5 transition ${
                  activeTab === 'stickers'
                    ? 'text-pink-600 font-black scale-105'
                    : 'text-slate-400 font-bold hover:text-slate-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    activeTab === 'stickers' ? 'bg-pink-100' : 'bg-transparent'
                  }`}
                >
                  <Smile className="w-5 h-5" />
                </div>
                <span className="text-[10px]">Stickers</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setIsParentalGateOpen(true);
                }}
                className="flex flex-col items-center gap-0.5 text-slate-400 font-bold hover:text-slate-600 transition"
              >
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-transparent">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <span className="text-[10px]">Settings</span>
              </button>
            </div>
          )}

          {/* Game Preview & Launcher Modal */}
          <GameLauncherModal
            game={selectedGameForModal}
            onClose={() => setSelectedGameForModal(null)}
            onStartGame={handleStartGame}
          />

          {/* Mystery Toy Chest Claimed Celebration Modal */}
          {showChestReward && (
            <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in-95 duration-200">
              <div className="bg-white rounded-[32px] p-6 text-center max-w-xs w-full shadow-2xl border-4 border-amber-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 flex items-center justify-center text-4xl shadow-lg border-2 border-white mx-auto mb-3 animate-bounce">
                  👑
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  CHEST UNLOCKED!
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 mb-4">
                  You discovered the Golden Crown Badge and +50 Stars!
                </p>
                <button
                  onClick={() => {
                    sound.playPop();
                    setShowChestReward(false);
                  }}
                  className="btn-3d btn-3d-yellow w-full py-3 rounded-2xl font-black text-white text-base shadow border border-white"
                >
                  AWESOME!
                </button>
              </div>
            </div>
          )}

          {/* Safe Child-Friendly Parental Gate Modal */}
          <ParentalModal
            isOpen={isParentalGateOpen}
            onClose={() => setIsParentalGateOpen(false)}
            profile={kidProfile}
            onUpdateProfile={setKidProfile}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          {/* Daily Lucky Spin Wheel Modal */}
          <LuckySpinModal
            isOpen={isLuckySpinOpen}
            onClose={() => setIsLuckySpinOpen(false)}
            onReward={handleClaimSpinReward}
          />

          {/* Bedtime & Screen Rest Modal */}
          <BedtimeModal
            isOpen={isBedtimeOpen}
            onClose={() => setIsBedtimeOpen(false)}
          />

          {/* 3D Character Customizer / Auto Creator Modal */}
          {isCustomizerOpen && (
            <CharacterCustomizer
              avatar={avatarConfig}
              onSaveAvatar={(newAvatar) => {
                setAvatarConfig(newAvatar);
                setKidProfile((prev) => ({
                  ...prev,
                  avatarEmoji:
                    newAvatar.outfit === 'bombero'
                      ? '👨‍🚒'
                      : newAvatar.outfit === 'superhero'
                      ? '🦸'
                      : newAvatar.outfit === 'racer'
                      ? '🏎️'
                      : '🦁',
                }));
                setIsCustomizerOpen(false);
              }}
              onClose={() => setIsCustomizerOpen(false)}
            />
          )}
        </PhoneFrame>
      </div>
    </div>
  );
}
