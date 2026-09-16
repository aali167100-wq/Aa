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
  Volume2,
  Trophy,
  Heart,
  Droplets,
  Flame,
  FlameKindling,
  Bot,
  User,
} from 'lucide-react';

interface BomberoAutoRunnerProps {
  onClose: () => void;
  onAddStars: (amount: number) => void;
}

interface RoadItem {
  id: number;
  lane: number; // 0: Left, 1: Center, 2: Right
  y: number; // 0 to 100%
  type: 'star' | 'water' | 'fire' | 'cone' | 'puppy' | 'kitten';
  extinguished?: boolean;
}

interface WaterParticle {
  id: number;
  lane: number;
  y: number;
}

export const BomberoAutoRunner: React.FC<BomberoAutoRunnerProps> = ({
  onClose,
  onAddStars,
}) => {
  // Game States
  const [lane, setLane] = useState<number>(1); // 0, 1, 2
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isSpraying, setIsSpraying] = useState<boolean>(false);
  const [autoRunMode, setAutoRunMode] = useState<boolean>(true); // Default to Auto-Run for young kids!
  const [score, setScore] = useState<number>(0);
  const [starsCaught, setStarsCaught] = useState<number>(0);
  const [rescuesCount, setRescuesCount] = useState<number>(0);
  const [waterTank, setWaterTank] = useState<number>(100);
  const [distance, setDistance] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1.2);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [items, setItems] = useState<RoadItem[]>([]);
  const [waterShots, setWaterShots] = useState<WaterParticle[]>([]);
  const [sirenActive, setSirenActive] = useState<boolean>(true);
  const [heroForm, setHeroForm] = useState<'truck' | 'kid'>('truck');

  const nextId = useRef<number>(1);
  const waterId = useRef<number>(1);
  const laneRef = useRef<number>(lane);
  const autoRunRef = useRef<boolean>(autoRunMode);
  const itemsRef = useRef<RoadItem[]>(items);

  // Sync refs for the loop
  useEffect(() => {
    laneRef.current = lane;
  }, [lane]);

  useEffect(() => {
    autoRunRef.current = autoRunMode;
  }, [autoRunMode]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Lane movement
  const moveLeft = useCallback(() => {
    sound.playPop(480);
    setLane((prev) => Math.max(0, prev - 1));
  }, []);

  const moveRight = useCallback(() => {
    sound.playPop(560);
    setLane((prev) => Math.min(2, prev + 1));
  }, []);

  // Jump action
  const jump = useCallback(() => {
    if (isJumping) return;
    sound.playBoing();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 550);
  }, [isJumping]);

  // Spray Water Hose
  const sprayWater = useCallback(() => {
    if (waterTank <= 0) return;
    sound.playSplash();
    setIsSpraying(true);
    setWaterTank((w) => Math.max(0, w - 8));

    // Spawn water stream projectile
    setWaterShots((prev) => [
      ...prev,
      {
        id: waterId.current++,
        lane: laneRef.current,
        y: 72,
      },
    ]);

    setTimeout(() => setIsSpraying(false), 400);
  }, [waterTank]);

  // Firefighter Siren
  const triggerSiren = () => {
    sound.playSiren();
    setSirenActive((s) => !s);
  };

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
        jump();
      } else if (e.key === 's' || e.key === 'ArrowDown' || e.key === 'f') {
        sprayWater();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, jump, sprayWater]);

  // Auto-Run decision maker (AI co-pilot for kids)
  const runAutoDecision = useCallback(() => {
    if (!autoRunRef.current) return;

    // Look at items coming up near the front (y between 35% and 75%)
    const upcoming = itemsRef.current
      .filter((it) => it.y >= 25 && it.y <= 75)
      .sort((a, b) => b.y - a.y);

    if (upcoming.length > 0) {
      const closest = upcoming[0];

      // If it's a hazard in our lane
      if ((closest.type === 'fire' || closest.type === 'cone') && closest.lane === laneRef.current) {
        if (closest.type === 'fire') {
          // Extinguish fire with water!
          sprayWater();
        } else {
          // Dodge or jump
          const availableLanes = [0, 1, 2].filter((l) => l !== laneRef.current);
          const safeLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
          setLane(safeLane);
        }
      } else if (
        (closest.type === 'star' || closest.type === 'water' || closest.type === 'puppy' || closest.type === 'kitten') &&
        closest.lane !== laneRef.current
      ) {
        // Steer towards friendly rescue stars or animals!
        setLane(closest.lane);
      }
    }
  }, [sprayWater]);

  // Main game loop
  useEffect(() => {
    if (gameOver || gameWon) return;

    const interval = setInterval(() => {
      setDistance((d) => d + 1);

      // Trigger Auto-Pilot decision every few frames
      if (Math.random() < 0.45) {
        runAutoDecision();
      }

      // Spawn new items
      if (Math.random() < 0.32) {
        const rand = Math.random();
        let itemType: RoadItem['type'] = 'star';

        if (rand < 0.4) {
          itemType = 'star';
        } else if (rand < 0.6) {
          itemType = 'water';
        } else if (rand < 0.75) {
          itemType = 'fire';
        } else if (rand < 0.88) {
          itemType = 'cone';
        } else if (rand < 0.94) {
          itemType = 'puppy';
        } else {
          itemType = 'kitten';
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

      // Move water projectiles up
      setWaterShots((shots) => {
        const nextShots: WaterParticle[] = [];
        for (const s of shots) {
          const nextY = s.y - 6;
          // Check collision with fire in same lane
          setItems((currentItems) =>
            currentItems.map((item) => {
              if (
                item.type === 'fire' &&
                item.lane === s.lane &&
                Math.abs(item.y - nextY) < 14 &&
                !item.extinguished
              ) {
                sound.playSplash();
                setScore((sc) => sc + 60);
                return { ...item, extinguished: true };
              }
              return item;
            })
          );

          if (nextY > 15) {
            nextShots.push({ ...s, y: nextY });
          }
        }
        return nextShots;
      });

      // Move road items down
      setItems((prev) => {
        const updated: RoadItem[] = [];
        const currentLane = laneRef.current;

        for (const item of prev) {
          const newY = item.y + speed * 2.8;

          // Check collision near player (y ~ 74% to 88%)
          if (newY >= 72 && newY <= 88 && item.lane === currentLane) {
            if (item.type === 'star') {
              sound.playStarSparkle();
              setScore((s) => s + 25);
              setStarsCaught((c) => c + 1);
            } else if (item.type === 'water') {
              sound.playSplash();
              setWaterTank((w) => Math.min(100, w + 25));
              setScore((s) => s + 15);
            } else if (item.type === 'puppy' || item.type === 'kitten') {
              sound.playVictory();
              setRescuesCount((r) => r + 1);
              setScore((s) => s + 100);
              confetti({
                particleCount: 35,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
              });
            } else if (item.type === 'fire') {
              if (!item.extinguished && !isJumping) {
                sound.playBoing();
                setScore((s) => Math.max(0, s - 10));
              }
            } else if (item.type === 'cone') {
              if (!isJumping) {
                sound.playBoing();
                setScore((s) => Math.max(0, s - 10));
              }
            }
            continue; // Item collected or handled
          }

          if (newY < 100) {
            updated.push({ ...item, y: newY });
          }
        }
        return updated;
      });

      // Gradual progression
      setSpeed((s) => Math.min(2.0, s + 0.0008));

      // Win threshold at 1500 distance or 25 stars
      if (starsCaught >= 20 || rescuesCount >= 5) {
        sound.playVictory();
        setGameWon(true);
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    }, 45);

    return () => clearInterval(interval);
  }, [gameOver, gameWon, speed, isJumping, starsCaught, rescuesCount, runAutoDecision]);

  const restartGame = () => {
    sound.playPop();
    setScore(0);
    setStarsCaught(0);
    setRescuesCount(0);
    setWaterTank(100);
    setDistance(0);
    setSpeed(1.2);
    setGameOver(false);
    setGameWon(false);
    setItems([]);
    setWaterShots([]);
    setLane(1);
  };

  const handleFinishAndSave = () => {
    sound.playVictory();
    onAddStars(Math.max(25, starsCaught + rescuesCount * 10));
    onClose();
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col font-['Fredoka',sans-serif] text-slate-800 select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Navigation HUD */}
      <div className="p-3 bg-white/95 backdrop-blur-sm border-b-2 border-amber-300 flex items-center justify-between z-20 shadow-md">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition active:scale-95"
          title="Exit to Lobby"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-0.5 rounded-full text-xs font-black border border-red-300">
            <span className="text-sm animate-pulse">🚒</span>
            <span>BOMBERO AUTO RUN 3D</span>
          </div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">
            Firefighter Hero Rescue
          </div>
        </div>

        {/* Auto-Run Mode Toggle Switch */}
        <button
          onClick={() => {
            sound.playPop();
            setAutoRunMode((m) => !m);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition shadow-sm border ${
            autoRunMode
              ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}
          title="Toggle Auto-Pilot / Auto-Run mode"
        >
          {autoRunMode ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          <span>{autoRunMode ? 'AUTO ON' : 'MANUAL'}</span>
        </button>
      </div>

      {/* Live Stats Bar */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white px-4 py-1.5 flex items-center justify-between text-xs font-black shadow-inner z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{starsCaught}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
            <span>🐾 Rescues:</span>
            <span className="text-amber-200">{rescuesCount}</span>
          </div>
        </div>

        {/* Water Tank Meter */}
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-cyan-200" />
          <div className="w-20 h-3 bg-black/30 rounded-full overflow-hidden border border-white/40">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300"
              style={{ width: `${waterTank}%` }}
            />
          </div>
          <span className="text-[10px] text-cyan-200">{waterTank}%</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-amber-200">Score:</span>
          <span>{score}</span>
        </div>
      </div>

      {/* 3D Track & Running Canvas Area */}
      <div className="relative flex-1 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 overflow-hidden perspective-500">
        {/* Distant 3D City Skyline & Fluffy Clouds */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-sky-500/80 to-transparent pointer-events-none flex justify-around pt-3 opacity-80">
          <div className="text-3xl animate-pulse">☁️</div>
          <div className="text-4xl">🏢</div>
          <div className="text-3xl animate-bounce">🏰</div>
          <div className="text-4xl">🏬</div>
          <div className="text-3xl animate-pulse">☁️</div>
        </div>

        {/* 3D Perspective Road */}
        <div className="absolute inset-x-8 bottom-0 top-16 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-t-[48px] border-x-4 border-amber-400 shadow-2xl flex">
          {/* Lane 0 (Left) */}
          <div className="flex-1 border-r-2 border-dashed border-white/40 relative">
            <div className="absolute inset-y-0 left-1 w-1 bg-red-500/40" />
          </div>
          {/* Lane 1 (Center) */}
          <div className="flex-1 border-r-2 border-dashed border-white/40 relative">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 border-r border-dashed border-yellow-300/80" />
          </div>
          {/* Lane 2 (Right) */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-1 w-1 bg-red-500/40" />
          </div>
        </div>

        {/* Speed lines rushing past */}
        <div className="absolute inset-x-10 bottom-0 top-20 pointer-events-none overflow-hidden opacity-30">
          <div className="w-full h-full flex justify-between animate-pulse">
            <div className="w-1 bg-white h-20 rotate-12" />
            <div className="w-1 bg-white h-28 -rotate-12" />
          </div>
        </div>

        {/* Water Stream Projectiles */}
        {waterShots.map((shot) => {
          const laneLeft = shot.lane === 0 ? '25%' : shot.lane === 1 ? '50%' : '75%';
          return (
            <div
              key={shot.id}
              className="absolute -translate-x-1/2 z-25 pointer-events-none flex flex-col items-center"
              style={{ left: laneLeft, top: `${shot.y}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-cyan-300/90 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-ping" />
              <div className="text-xl">💦</div>
            </div>
          );
        })}

        {/* Active Items on the Road */}
        {items.map((item) => {
          const laneLeft = item.lane === 0 ? '25%' : item.lane === 1 ? '50%' : '75%';
          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-transform"
              style={{
                left: laneLeft,
                top: `${item.y}%`,
                transform: `scale(${0.7 + (item.y / 100) * 0.7})`,
              }}
            >
              {item.type === 'star' && (
                <div className="relative flex flex-col items-center animate-spin duration-3000">
                  <span className="text-3xl drop-shadow-[0_4px_8px_rgba(245,158,11,0.8)]">
                    ⭐
                  </span>
                </div>
              )}

              {item.type === 'water' && (
                <div className="relative flex flex-col items-center animate-bounce">
                  <span className="text-3xl drop-shadow-[0_4px_8px_rgba(59,130,246,0.8)]">
                    💧
                  </span>
                </div>
              )}

              {item.type === 'puppy' && (
                <div className="relative flex flex-col items-center animate-bounce">
                  <div className="bg-amber-100 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-300 shadow -mt-4">
                    RESCUE ME!
                  </div>
                  <span className="text-3xl drop-shadow-md">🐶</span>
                </div>
              )}

              {item.type === 'kitten' && (
                <div className="relative flex flex-col items-center animate-bounce">
                  <div className="bg-pink-100 text-pink-900 text-[9px] font-black px-2 py-0.5 rounded-full border border-pink-300 shadow -mt-4">
                    SAVE ME!
                  </div>
                  <span className="text-3xl drop-shadow-md">🐱</span>
                </div>
              )}

              {item.type === 'cone' && (
                <div className="flex flex-col items-center">
                  <span className="text-3xl drop-shadow-md">🚧</span>
                </div>
              )}

              {item.type === 'fire' && (
                <div className="flex flex-col items-center">
                  {item.extinguished ? (
                    <div className="flex flex-col items-center animate-out fade-out duration-700">
                      <span className="text-xl">💨</span>
                      <span className="text-[10px] font-black text-cyan-300">OUT! +60</span>
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center animate-pulse">
                      <span className="text-3xl drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]">
                        🔥
                      </span>
                      <span className="text-[8px] font-black bg-red-600 text-white px-1.5 rounded-full">
                        SPRAY!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* 3D Cartoon Firefighter Hero / Mini Fire Truck */}
        {(() => {
          const playerLeft = lane === 0 ? '25%' : lane === 1 ? '50%' : '75%';
          return (
            <div
              className={`absolute top-[78%] -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200 ${
                isJumping ? '-translate-y-14 scale-110' : ''
              }`}
              style={{ left: playerLeft }}
            >
              {heroForm === 'truck' ? (
                /* 3D Toy Fire Truck */
                <div className="relative flex flex-col items-center group cursor-pointer" onClick={triggerSiren}>
                  {/* Flashing Beacon Siren */}
                  <div className="flex items-center gap-2 -mb-1 z-10">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-white shadow-lg ${
                        sirenActive
                          ? 'bg-red-500 animate-ping shadow-[0_0_10px_#ef4444]'
                          : 'bg-red-700'
                      }`}
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-white shadow-lg ${
                        sirenActive
                          ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]'
                          : 'bg-blue-700'
                      }`}
                    />
                  </div>

                  {/* Truck Body */}
                  <div className="w-20 h-22 bg-gradient-to-b from-red-500 to-red-700 rounded-3xl border-3 border-amber-300 shadow-2xl flex flex-col items-center justify-between p-1.5 relative">
                    {/* Fire Hose Reel on Top */}
                    <div className="w-10 h-3 bg-amber-400 rounded-full border border-red-900 shadow-inner flex items-center justify-center">
                      <span className="text-[7px] font-black text-red-950">HOSE 3D</span>
                    </div>

                    {/* Windshield */}
                    <div className="w-15 h-8 bg-gradient-to-b from-cyan-200 to-cyan-400 rounded-2xl border-2 border-white flex items-center justify-center shadow-inner relative overflow-hidden">
                      <div className="w-3 h-3 bg-white/60 rounded-full -top-1 -left-1 absolute" />
                      <span className="text-xs">👨‍🚒</span>
                    </div>

                    {/* Grille & Bumper */}
                    <div className="w-16 h-4 bg-slate-200 rounded-lg border border-slate-400 flex items-center justify-around px-1 shadow">
                      <div className="w-2.5 h-2.5 bg-amber-300 rounded-full border border-slate-600 shadow-xs" />
                      <span className="text-[8px] font-black text-red-700">#1 RESCUE</span>
                      <div className="w-2.5 h-2.5 bg-amber-300 rounded-full border border-slate-600 shadow-xs" />
                    </div>

                    {/* 3D Wheels */}
                    <div className="absolute -left-2 top-4 w-3 h-6 bg-slate-900 rounded-l-md border border-slate-700 shadow" />
                    <div className="absolute -right-2 top-4 w-3 h-6 bg-slate-900 rounded-r-md border border-slate-700 shadow" />
                    <div className="absolute -left-2 bottom-3 w-3 h-6 bg-slate-900 rounded-l-md border border-slate-700 shadow" />
                    <div className="absolute -right-2 bottom-3 w-3 h-6 bg-slate-900 rounded-r-md border border-slate-700 shadow" />
                  </div>

                  {/* Water Hose Spray FX */}
                  {isSpraying && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-cyan-300/90 shadow-[0_0_15px_#22d3ee] animate-ping" />
                      <span className="text-2xl">💦💦</span>
                    </div>
                  )}
                </div>
              ) : (
                /* 3D Cartoon Kid Firefighter Hero */
                <div className="relative flex flex-col items-center">
                  {/* Yellow Fire Helmet */}
                  <div className="w-18 h-7 bg-amber-400 rounded-t-full border-2 border-amber-500 shadow flex items-center justify-center -mb-1 z-10">
                    <span className="text-[9px] font-black text-amber-950">⛑️ BOMBERO</span>
                  </div>
                  {/* Face */}
                  <div className="w-14 h-12 bg-amber-100 rounded-2xl border-2 border-white shadow flex flex-col items-center justify-center">
                    <div className="flex gap-2 text-xs">👀</div>
                    <div className="w-3 h-1 bg-red-400 rounded-full mt-1" />
                  </div>
                  {/* Jacket */}
                  <div className="w-16 h-10 bg-red-600 rounded-b-2xl border-2 border-yellow-300 flex items-center justify-center shadow">
                    <span className="text-xs font-black text-white">RESCUE</span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Auto-Pilot Indicator HUD Overlay */}
        {autoRunMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-emerald-300 px-3 py-1 rounded-full text-xs font-black border border-emerald-400/60 flex items-center gap-1.5 shadow-lg z-20 animate-pulse">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI CO-PILOT DRIVING • AUTO-RUN ACTIVE</span>
          </div>
        )}
      </div>

      {/* Bottom Interactive Controls Bar */}
      <div className="p-3 bg-white border-t-2 border-slate-200 z-20 flex flex-col gap-2 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          {/* Form Switch: Fire Truck vs Firefighter Kid */}
          <button
            onClick={() => {
              sound.playPop();
              setHeroForm((f) => (f === 'truck' ? 'kid' : 'truck'));
            }}
            className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1 border border-slate-300 active:scale-95 transition"
            title="Switch between Fire Truck and Firefighter Kid"
          >
            <span>{heroForm === 'truck' ? '🚒 Truck' : '👨‍🚒 Kid'}</span>
          </button>

          {/* Siren Button */}
          <button
            onClick={triggerSiren}
            className="px-3 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black flex items-center gap-1 border border-amber-300 active:scale-95 transition"
            title="Sound the Siren!"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Siren!</span>
          </button>

          {/* Water Spray Button */}
          <button
            onClick={sprayWater}
            disabled={waterTank <= 0}
            className="btn-3d py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-md border-2 border-white flex items-center gap-1.5 active:scale-90 transition disabled:opacity-50"
            title="Spray Water Hose to Put Out Fires!"
          >
            <Droplets className="w-4 h-4 fill-white" />
            <span>SPRAY WATER! 💦</span>
          </button>

          {/* Jump Button */}
          <button
            onClick={jump}
            className="btn-3d py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-md border-2 border-white flex items-center gap-1 active:scale-90 transition"
            title="Jump Over Cones!"
          >
            <span>JUMP! 🦘</span>
          </button>
        </div>

        {/* Direction Steering Controls */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setAutoRunMode(false);
              moveLeft();
            }}
            className="btn-3d py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black text-sm shadow-md border-2 border-white flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
            <span>STEER LEFT</span>
          </button>

          <button
            onClick={() => {
              setAutoRunMode(false);
              moveRight();
            }}
            className="btn-3d py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black text-sm shadow-md border-2 border-white flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <span>STEER RIGHT</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {gameWon && (
        <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-[36px] p-6 text-center max-w-sm w-full shadow-2xl border-4 border-amber-300">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-red-500 flex items-center justify-center text-4xl shadow-lg border-2 border-white mx-auto mb-3 animate-bounce">
              🚒
            </div>

            <div className="inline-block bg-red-100 text-red-700 text-xs font-black px-3 py-1 rounded-full border border-red-300 mb-2">
              CHIEF BOMBERO RESCUE HERO!
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              MISSION ACCOMPLISHED!
            </h3>

            <p className="text-xs font-bold text-slate-500 mt-1 mb-4">
              You saved the day, extinguished the flames, and rescued cute animal buddies!
            </p>

            <div className="grid grid-cols-3 gap-2 bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-4">
              <div>
                <div className="text-xl">⭐</div>
                <div className="text-xs font-black text-slate-800">{starsCaught}</div>
                <div className="text-[9px] font-bold text-slate-400">Stars</div>
              </div>
              <div>
                <div className="text-xl">🐾</div>
                <div className="text-xs font-black text-slate-800">{rescuesCount}</div>
                <div className="text-[9px] font-bold text-slate-400">Saved</div>
              </div>
              <div>
                <div className="text-xl">🏆</div>
                <div className="text-xs font-black text-slate-800">{score}</div>
                <div className="text-[9px] font-bold text-slate-400">Score</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleFinishAndSave}
                className="btn-3d btn-3d-play py-3.5 rounded-2xl font-black text-white text-base shadow border-2 border-amber-200"
              >
                CLAIM +{Math.max(25, starsCaught + rescuesCount * 10)} STARS!
              </button>

              <button
                onClick={restartGame}
                className="py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center gap-1"
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
