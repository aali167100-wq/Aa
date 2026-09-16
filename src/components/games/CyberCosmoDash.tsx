import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import {
  X,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  Shield,
  Bot,
  User,
  Radio,
  Rocket,
  Flame,
} from 'lucide-react';

interface CyberCosmoDashProps {
  onClose: () => void;
  onAddStars: (amount: number) => void;
}

interface CosmoItem {
  id: number;
  lane: number; // 0: Left, 1: Center, 2: Right
  y: number; // 0 to 100%
  type: 'crystal' | 'plasma' | 'satellite' | 'laser-gate' | 'cyber-pup';
  destroyed?: boolean;
}

interface LaserShot {
  id: number;
  lane: number;
  y: number;
}

export const CyberCosmoDash: React.FC<CyberCosmoDashProps> = ({
  onClose,
  onAddStars,
}) => {
  const [lane, setLane] = useState<number>(1);
  const [isJetpackBoosting, setIsJetpackBoosting] = useState<boolean>(false);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [autoRunMode, setAutoRunMode] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [crystalsCaught, setCrystalsCaught] = useState<number>(0);
  const [rescuesCount, setRescuesCount] = useState<number>(0);
  const [plasmaEnergy, setPlasmaEnergy] = useState<number>(100);
  const [speed, setSpeed] = useState<number>(1.3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [items, setItems] = useState<CosmoItem[]>([]);
  const [laserShots, setLaserShots] = useState<LaserShot[]>([]);
  const [heroCostume, setHeroCostume] = useState<'jetpack' | 'mech'>('jetpack');

  const nextId = useRef<number>(1);
  const laserId = useRef<number>(1);
  const laneRef = useRef<number>(lane);
  const autoRunRef = useRef<boolean>(autoRunMode);
  const itemsRef = useRef<CosmoItem[]>(items);

  useEffect(() => {
    laneRef.current = lane;
  }, [lane]);

  useEffect(() => {
    autoRunRef.current = autoRunMode;
  }, [autoRunMode]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const moveLeft = useCallback(() => {
    sound.playPop(520);
    setLane((prev) => Math.max(0, prev - 1));
  }, []);

  const moveRight = useCallback(() => {
    sound.playPop(620);
    setLane((prev) => Math.min(2, prev + 1));
  }, []);

  // Jetpack High Boost
  const boostJetpack = useCallback(() => {
    if (isJetpackBoosting) return;
    sound.playBooster();
    setIsJetpackBoosting(true);
    setTimeout(() => setIsJetpackBoosting(false), 600);
  }, [isJetpackBoosting]);

  // Fire Cyber Laser
  const fireLaser = useCallback(() => {
    if (plasmaEnergy <= 0) return;
    sound.playLaser();
    setPlasmaEnergy((p) => Math.max(0, p - 10));

    setLaserShots((prev) => [
      ...prev,
      {
        id: laserId.current++,
        lane: laneRef.current,
        y: 72,
      },
    ]);
  }, [plasmaEnergy]);

  // Activate Cyber Shield
  const activateShield = useCallback(() => {
    sound.playShield();
    setHasShield(true);
    setTimeout(() => setHasShield(false), 4500);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setAutoRunMode(false);
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setAutoRunMode(false);
        moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        e.preventDefault();
        boostJetpack();
      } else if (e.key === 's' || e.key === 'ArrowDown' || e.key === 'f') {
        fireLaser();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, boostJetpack, fireLaser]);

  // AI Co-Pilot decision maker
  const runAutoDecision = useCallback(() => {
    if (!autoRunRef.current) return;

    const upcoming = itemsRef.current
      .filter((it) => it.y >= 25 && it.y <= 75)
      .sort((a, b) => b.y - a.y);

    if (upcoming.length > 0) {
      const closest = upcoming[0];

      if (
        (closest.type === 'satellite' || closest.type === 'laser-gate') &&
        closest.lane === laneRef.current
      ) {
        if (closest.type === 'satellite') {
          fireLaser();
        } else {
          boostJetpack();
        }
      } else if (
        (closest.type === 'crystal' ||
          closest.type === 'plasma' ||
          closest.type === 'cyber-pup') &&
        closest.lane !== laneRef.current
      ) {
        setLane(closest.lane);
      }
    }
  }, [fireLaser, boostJetpack]);

  // Game Loop
  useEffect(() => {
    if (gameOver || gameWon) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.45) {
        runAutoDecision();
      }

      // Spawn items
      if (Math.random() < 0.35) {
        const rand = Math.random();
        let itemType: CosmoItem['type'] = 'crystal';

        if (rand < 0.45) {
          itemType = 'crystal';
        } else if (rand < 0.65) {
          itemType = 'plasma';
        } else if (rand < 0.8) {
          itemType = 'satellite';
        } else if (rand < 0.92) {
          itemType = 'laser-gate';
        } else {
          itemType = 'cyber-pup';
        }

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

      // Move laser shots
      setLaserShots((shots) => {
        const nextShots: LaserShot[] = [];
        for (const s of shots) {
          const nextY = s.y - 7;
          setItems((currentItems) =>
            currentItems.map((item) => {
              if (
                item.type === 'satellite' &&
                item.lane === s.lane &&
                Math.abs(item.y - nextY) < 15 &&
                !item.destroyed
              ) {
                sound.playStarSparkle();
                setScore((sc) => sc + 80);
                return { ...item, destroyed: true };
              }
              return item;
            })
          );

          if (nextY > 10) {
            nextShots.push({ ...s, y: nextY });
          }
        }
        return nextShots;
      });

      // Move road items
      setItems((prev) => {
        const updated: CosmoItem[] = [];
        const currentLane = laneRef.current;

        for (const item of prev) {
          const newY = item.y + speed * 3.0;

          if (newY >= 70 && newY <= 88 && item.lane === currentLane) {
            if (item.type === 'crystal') {
              sound.playStarSparkle();
              setScore((s) => s + 30);
              setCrystalsCaught((c) => c + 1);
            } else if (item.type === 'plasma') {
              sound.playShield();
              setPlasmaEnergy((p) => Math.min(100, p + 30));
              setScore((s) => s + 20);
            } else if (item.type === 'cyber-pup') {
              sound.playVictory();
              setRescuesCount((r) => r + 1);
              setScore((s) => s + 120);
              confetti({
                particleCount: 30,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#06B6D4', '#6366F1', '#EC4899'],
              });
            } else if (item.type === 'satellite') {
              if (!item.destroyed && !hasShield && !isJetpackBoosting) {
                sound.playBoing();
                setScore((s) => Math.max(0, s - 10));
              }
            } else if (item.type === 'laser-gate') {
              if (!hasShield && !isJetpackBoosting) {
                sound.playBoing();
                setScore((s) => Math.max(0, s - 15));
              }
            }
            continue;
          }

          if (newY < 100) {
            updated.push({ ...item, y: newY });
          }
        }
        return updated;
      });

      setSpeed((s) => Math.min(2.2, s + 0.0008));

      // Win threshold
      if (crystalsCaught >= 20 || rescuesCount >= 4) {
        sound.playVictory();
        setGameWon(true);
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
        });
      }
    }, 45);

    return () => clearInterval(interval);
  }, [
    gameOver,
    gameWon,
    speed,
    isJetpackBoosting,
    hasShield,
    crystalsCaught,
    rescuesCount,
    runAutoDecision,
  ]);

  const restartGame = () => {
    sound.playPop();
    setScore(0);
    setCrystalsCaught(0);
    setRescuesCount(0);
    setPlasmaEnergy(100);
    setSpeed(1.3);
    setGameOver(false);
    setGameWon(false);
    setItems([]);
    setLaserShots([]);
    setLane(1);
  };

  const handleFinishAndSave = () => {
    sound.playVictory();
    onAddStars(Math.max(35, crystalsCaught * 2 + rescuesCount * 15));
    onClose();
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col font-['Fredoka',sans-serif] text-slate-800 select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Futuristic Navigation Bar */}
      <div className="p-3 bg-slate-900/95 backdrop-blur-md border-b-2 border-cyan-500 flex items-center justify-between z-20 shadow-md text-white">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-cyan-300 transition active:scale-95 border border-cyan-500/40"
          title="Exit to Hub"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-cyan-950 text-cyan-300 px-3 py-0.5 rounded-full text-xs font-black border border-cyan-400">
            <Rocket className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>CYBER COSMO DASH 3D</span>
          </div>
          <div className="text-xs font-bold text-slate-400 mt-0.5">
            Future Galaxy Jetpack Flight
          </div>
        </div>

        {/* Auto-Pilot Co-pilot Switch */}
        <button
          onClick={() => {
            sound.playPop();
            setAutoRunMode((m) => !m);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition shadow-sm border ${
            autoRunMode
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_10px_#06b6d4]'
              : 'bg-slate-800 text-slate-300 border-slate-600'
          }`}
        >
          {autoRunMode ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          <span>{autoRunMode ? 'AUTO-PILOT' : 'MANUAL'}</span>
        </button>
      </div>

      {/* Cyber Neon HUD Stats */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 text-white px-4 py-1.5 flex items-center justify-between text-xs font-black border-b border-cyan-500/30 shadow-inner z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-cyan-300">
            <span>💎 Crystals:</span>
            <span>{crystalsCaught}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-purple-200">
            <span>🤖 Saved:</span>
            <span>{rescuesCount}</span>
          </div>
        </div>

        {/* Plasma Energy Meter */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <div className="w-20 h-3 bg-black/50 rounded-full overflow-hidden border border-cyan-400/50">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 transition-all duration-300"
              style={{ width: `${plasmaEnergy}%` }}
            />
          </div>
          <span className="text-[10px] text-cyan-300">{plasmaEnergy}%</span>
        </div>

        <div className="flex items-center gap-1 text-amber-300">
          <span>Score:</span>
          <span>{score}</span>
        </div>
      </div>

      {/* Futuristic Deep Space 3D Track */}
      <div className="relative flex-1 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 overflow-hidden perspective-500">
        {/* Twinkling Cosmic Stars & Nebulae */}
        <div className="absolute inset-0 pointer-events-none opacity-80">
          <div className="absolute top-4 left-10 text-xl animate-pulse">✨</div>
          <div className="absolute top-12 right-14 text-2xl animate-spin duration-5000">🪐</div>
          <div className="absolute top-20 left-1/3 text-lg animate-pulse">⭐</div>
          <div className="absolute top-8 right-1/3 text-xl animate-bounce">🛸</div>
          <div className="absolute top-16 left-3/4 text-sm animate-pulse">✨</div>
        </div>

        {/* 3D Cyber Grid Highway */}
        <div className="absolute inset-x-8 bottom-0 top-16 bg-gradient-to-b from-indigo-900/60 via-purple-950/80 to-slate-950 rounded-t-[48px] border-x-4 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex">
          {/* Lane 0 */}
          <div className="flex-1 border-r-2 border-dashed border-cyan-400/40 relative">
            <div className="absolute inset-y-0 left-1 w-1 bg-indigo-500/30" />
          </div>
          {/* Lane 1 */}
          <div className="flex-1 border-r-2 border-dashed border-cyan-400/40 relative">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 border-r border-dashed border-purple-400/70" />
          </div>
          {/* Lane 2 */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-1 w-1 bg-indigo-500/30" />
          </div>
        </div>

        {/* Laser Shots Travelling Forward */}
        {laserShots.map((shot) => {
          const laneLeft = shot.lane === 0 ? '25%' : shot.lane === 1 ? '50%' : '75%';
          return (
            <div
              key={shot.id}
              className="absolute -translate-x-1/2 z-25 pointer-events-none flex flex-col items-center"
              style={{ left: laneLeft, top: `${shot.y}%` }}
            >
              <div className="w-4 h-10 rounded-full bg-cyan-300 shadow-[0_0_15px_#22d3ee] animate-pulse" />
            </div>
          );
        })}

        {/* Active Items */}
        {items.map((item) => {
          const laneLeft = item.lane === 0 ? '25%' : item.lane === 1 ? '50%' : '75%';
          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-transform"
              style={{
                left: laneLeft,
                top: `${item.y}%`,
                transform: `scale(${0.75 + (item.y / 100) * 0.75})`,
              }}
            >
              {item.type === 'crystal' && (
                <div className="relative flex flex-col items-center animate-spin duration-3000">
                  <span className="text-3xl drop-shadow-[0_0_12px_#06b6d4]">💎</span>
                </div>
              )}

              {item.type === 'plasma' && (
                <div className="relative flex flex-col items-center animate-bounce">
                  <span className="text-3xl drop-shadow-[0_0_12px_#eab308]">⚡</span>
                </div>
              )}

              {item.type === 'cyber-pup' && (
                <div className="relative flex flex-col items-center animate-bounce">
                  <div className="bg-cyan-900 text-cyan-200 text-[9px] font-black px-2 py-0.5 rounded-full border border-cyan-400 shadow -mt-4">
                    CYBER RESCUE!
                  </div>
                  <span className="text-3xl drop-shadow-[0_0_10px_#ec4899]">🤖</span>
                </div>
              )}

              {item.type === 'satellite' && (
                <div className="flex flex-col items-center">
                  {item.destroyed ? (
                    <div className="flex flex-col items-center animate-out fade-out duration-700">
                      <span className="text-xl">💥</span>
                      <span className="text-[10px] font-black text-cyan-300">ZAPPED! +80</span>
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center animate-pulse">
                      <span className="text-3xl drop-shadow-[0_0_10px_#ef4444]">🛰️</span>
                      <span className="text-[8px] font-black bg-rose-600 text-white px-1.5 rounded-full">
                        ZAP!
                      </span>
                    </div>
                  )}
                </div>
              )}

              {item.type === 'laser-gate' && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-2 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444] animate-pulse" />
                  <span className="text-[9px] font-black text-red-300 mt-0.5">
                    JUMP OR BOOST!
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* 3D Futuristic Hero / Cyber Jetpack Pilot */}
        {(() => {
          const playerLeft = lane === 0 ? '25%' : lane === 1 ? '50%' : '75%';
          return (
            <div
              className={`absolute top-[78%] -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200 ${
                isJetpackBoosting ? '-translate-y-16 scale-110' : ''
              }`}
              style={{ left: playerLeft }}
            >
              {/* Forcefield Shield Aura */}
              {hasShield && (
                <div className="absolute -inset-4 rounded-full border-3 border-cyan-300 bg-cyan-400/20 animate-pulse shadow-[0_0_20px_#06b6d4] pointer-events-none" />
              )}

              <div className="relative flex flex-col items-center">
                {/* Cyber Helmet & Visor */}
                <div className="w-16 h-8 bg-slate-800 rounded-t-full border-2 border-cyan-400 flex items-center justify-center shadow-lg relative">
                  <div className="w-12 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] flex items-center justify-center">
                    <div className="w-2 h-1 bg-white rounded-full" />
                  </div>
                </div>

                {/* Cyber Armor Body */}
                <div className="w-18 h-12 bg-gradient-to-b from-indigo-700 to-slate-900 rounded-b-2xl border-2 border-purple-400 flex flex-col items-center justify-center shadow-2xl relative">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/80 shadow-[0_0_10px_#06b6d4] flex items-center justify-center">
                    <span className="text-[9px] font-black text-slate-950">⚡</span>
                  </div>

                  {/* Jetpack Wings & Thruster Flames */}
                  <div className="absolute -left-3 top-2 w-3 h-8 bg-cyan-500 rounded-l-md border border-cyan-300 shadow" />
                  <div className="absolute -right-3 top-2 w-3 h-8 bg-cyan-500 rounded-r-md border border-cyan-300 shadow" />

                  {/* Dual Thruster Plasma Flames */}
                  <div className="absolute -bottom-4 flex gap-4">
                    <div className="w-2.5 h-5 bg-gradient-to-b from-cyan-300 to-blue-600 rounded-b-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
                    <div className="w-2.5 h-5 bg-gradient-to-b from-cyan-300 to-blue-600 rounded-b-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Auto-Pilot Indicator */}
        {autoRunMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-cyan-950/80 backdrop-blur-xs text-cyan-300 px-3 py-1 rounded-full text-xs font-black border border-cyan-400/70 flex items-center gap-1.5 shadow-lg z-20 animate-pulse">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI CO-PILOT FLIGHT ACTIVE</span>
          </div>
        )}
      </div>

      {/* Cyber Controls Bar */}
      <div className="p-3 bg-slate-900 border-t-2 border-cyan-500/50 z-20 flex flex-col gap-2 shadow-2xl">
        <div className="flex items-center justify-between gap-2">
          {/* Shield Power Button */}
          <button
            onClick={activateShield}
            disabled={hasShield}
            className={`px-3 py-2 rounded-2xl text-xs font-black flex items-center gap-1 border active:scale-95 transition ${
              hasShield
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_#06b6d4]'
                : 'bg-slate-800 text-cyan-300 border-cyan-500/50 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>{hasShield ? 'SHIELD ON!' : 'CYBER SHIELD'}</span>
          </button>

          {/* Laser Blaster Button */}
          <button
            onClick={fireLaser}
            disabled={plasmaEnergy <= 0}
            className="btn-3d py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black text-xs shadow-md border-2 border-white flex items-center gap-1.5 active:scale-90 transition disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>ZAP LASER! ⚡</span>
          </button>

          {/* Jetpack Boost Button */}
          <button
            onClick={boostJetpack}
            className="btn-3d py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black text-xs shadow-md border-2 border-white flex items-center gap-1 active:scale-90 transition"
          >
            <span>JETPACK! 🚀</span>
          </button>
        </div>

        {/* Steering Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setAutoRunMode(false);
              moveLeft();
            }}
            className="btn-3d py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black text-sm shadow-md border-2 border-cyan-300 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
            <span>WARP LEFT</span>
          </button>

          <button
            onClick={() => {
              setAutoRunMode(false);
              moveRight();
            }}
            className="btn-3d py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black text-sm shadow-md border-2 border-cyan-300 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <span>WARP RIGHT</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Victory Modal */}
      {gameWon && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="bg-slate-900 text-white rounded-[36px] p-6 text-center max-w-sm w-full shadow-2xl border-4 border-cyan-400">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-4xl shadow-lg border-2 border-white mx-auto mb-3 animate-bounce">
              🚀
            </div>

            <div className="inline-block bg-cyan-950 text-cyan-300 text-xs font-black px-3 py-1 rounded-full border border-cyan-400 mb-2">
              CYBER GALAXY CHAMPION!
            </div>

            <h3 className="text-2xl font-black">MISSION ACCOMPLISHED!</h3>

            <p className="text-xs font-bold text-slate-400 mt-1 mb-4">
              You navigated the cosmic hyperspace highway and collected stellar crystals!
            </p>

            <div className="grid grid-cols-3 gap-2 bg-slate-800/80 rounded-2xl p-3 border border-cyan-500/40 mb-4">
              <div>
                <div className="text-xl">💎</div>
                <div className="text-xs font-black text-cyan-300">{crystalsCaught}</div>
                <div className="text-[9px] font-bold text-slate-400">Crystals</div>
              </div>
              <div>
                <div className="text-xl">🤖</div>
                <div className="text-xs font-black text-purple-300">{rescuesCount}</div>
                <div className="text-[9px] font-bold text-slate-400">Robos</div>
              </div>
              <div>
                <div className="text-xl">🏆</div>
                <div className="text-xs font-black text-amber-300">{score}</div>
                <div className="text-[9px] font-bold text-slate-400">Score</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleFinishAndSave}
                className="btn-3d btn-3d-play py-3.5 rounded-2xl font-black text-white text-base shadow border-2 border-cyan-300"
              >
                CLAIM +{Math.max(35, crystalsCaught * 2 + rescuesCount * 15)} STARS!
              </button>

              <button
                onClick={restartGame}
                className="py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
