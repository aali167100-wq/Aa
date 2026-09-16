import React, { useState, useEffect } from 'react';
import {
  AvatarCustomization,
  HairstyleType,
  OutfitType,
  AccessoryType,
  PetCompanionType,
  SkinToneType,
  ExpressionType,
} from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import avatarHeroImage from '../assets/images/avatar_customizer_1789536278415.jpg';
import {
  Sparkles,
  Dices,
  Check,
  X,
  Palette,
  Shirt,
  Crown,
  Smile,
  Heart,
  Wand2,
  Camera,
  RotateCcw,
  Volume2,
  Zap,
} from 'lucide-react';

interface CharacterCustomizerProps {
  avatar: AvatarCustomization;
  onSaveAvatar: (newAvatar: AvatarCustomization) => void;
  onClose: () => void;
}

// Category Tabs
type CustomizerTab = 'auto' | 'hair' | 'outfit' | 'accessories' | 'face' | 'pet' | 'stage';

// Pre-designed 3D Archetypes for Auto Creator
interface AutoArchetype {
  id: string;
  name: string;
  title: string;
  icon: string;
  tagline: string;
  color: string;
  config: AvatarCustomization;
}

const AUTO_ARCHETYPES: AutoArchetype[] = [
  {
    id: 'bombero',
    name: 'Bombero Hero',
    title: '🚒 Chief Bombero 3D Hero',
    icon: '🚒',
    tagline: 'Sirens blaring, saving puppy buddies!',
    color: 'from-red-500 via-orange-500 to-amber-400',
    config: {
      skinTone: 'honey',
      expression: 'happy',
      hairstyle: 'fire-helmet',
      hairColor: '#F59E0B',
      outfit: 'bombero',
      accessory: 'fire-hose',
      petCompanion: 'puppy',
      backgroundTheme: 'from-amber-400 via-red-400 to-yellow-300',
      pose: 'hero',
      title: 'Chief Bombero 3D Hero',
    },
  },
  {
    id: 'cyber',
    name: 'Cyber Cosmo Pilot',
    title: '🚀 Cyber Cosmo 3D Pilot',
    icon: '🚀',
    tagline: 'Warp speed jetpack & plasma shields!',
    color: 'from-cyan-400 via-indigo-500 to-purple-600',
    config: {
      skinTone: 'peach',
      expression: 'excited',
      hairstyle: 'cyber-helmet',
      hairColor: '#06B6D4',
      outfit: 'cyber-suit',
      accessory: 'jetpack',
      petCompanion: 'cyber-pup',
      backgroundTheme: 'from-indigo-950 via-purple-950 to-slate-900',
      pose: 'hero',
      title: 'Cyber Cosmo 3D Pilot',
    },
  },
  {
    id: 'racer',
    name: 'Turbo Racer',
    title: '🏎️ Turbo Speed Champion',
    icon: '🏎️',
    tagline: 'Fastest kid in Rainbow Valley!',
    color: 'from-amber-400 to-orange-500',
    config: {
      skinTone: 'warm',
      expression: 'cool',
      hairstyle: 'spiky',
      hairColor: '#F59E0B',
      outfit: 'racer',
      accessory: 'sunglasses',
      petCompanion: 'baby-lion',
      backgroundTheme: 'from-amber-300 via-orange-300 to-rose-300',
      pose: 'hero',
      title: 'Turbo Speed Champion',
    },
  },
  {
    id: 'astronaut',
    name: 'Cosmic Ranger',
    title: '🚀 Galaxy Star Explorer',
    icon: '🚀',
    tagline: 'Blasting off to the moon!',
    color: 'from-cyan-400 to-blue-600',
    config: {
      skinTone: 'peach',
      expression: 'excited',
      hairstyle: 'space',
      hairColor: '#3B82F6',
      outfit: 'astronaut',
      accessory: 'wand',
      petCompanion: 'owl',
      backgroundTheme: 'from-indigo-900 via-purple-900 to-slate-900',
      pose: 'jump',
      title: 'Galaxy Star Explorer',
    },
  },
  {
    id: 'hero',
    name: 'Mega Hero',
    title: '⚡ Lightning Spark Hero',
    icon: '🦸',
    tagline: 'Ready to save the day!',
    color: 'from-rose-500 to-red-600',
    config: {
      skinTone: 'honey',
      expression: 'happy',
      hairstyle: 'curls',
      hairColor: '#8B5CF6',
      outfit: 'superhero',
      accessory: 'medal',
      petCompanion: 'puppy',
      backgroundTheme: 'from-red-300 via-amber-200 to-yellow-300',
      pose: 'hero',
      title: 'Lightning Spark Hero',
    },
  },
  {
    id: 'dino',
    name: 'Dino Scout',
    title: '🦖 Prehistoric Dino Master',
    icon: '🦖',
    tagline: 'Roaring fun adventures!',
    color: 'from-emerald-400 to-green-600',
    config: {
      skinTone: 'tan',
      expression: 'winking',
      hairstyle: 'cap',
      hairColor: '#10B981',
      outfit: 'dino',
      accessory: 'headset',
      petCompanion: 'panda',
      backgroundTheme: 'from-emerald-300 via-teal-200 to-sky-300',
      pose: 'wave',
      title: 'Prehistoric Dino Master',
    },
  },
  {
    id: 'royal',
    name: 'Crystal Royalty',
    title: '👑 Rainbow Kingdom Monarch',
    icon: '👑',
    tagline: 'Sparkling magic & kind heart!',
    color: 'from-purple-400 to-pink-500',
    config: {
      skinTone: 'peach',
      expression: 'excited',
      hairstyle: 'crown',
      hairColor: '#EC4899',
      outfit: 'royal',
      accessory: 'bow',
      petCompanion: 'kitten',
      backgroundTheme: 'from-pink-300 via-purple-200 to-indigo-300',
      pose: 'dance',
      title: 'Rainbow Kingdom Monarch',
    },
  },
  {
    id: 'artist',
    name: 'Color Wizard',
    title: '🎨 Master Cartoon Painter',
    icon: '🎨',
    tagline: 'Painting dreams in bright 3D!',
    color: 'from-pink-400 to-yellow-400',
    config: {
      skinTone: 'espresso',
      expression: 'laughing',
      hairstyle: 'curls',
      hairColor: '#F59E0B',
      outfit: 'artist',
      accessory: 'glasses',
      petCompanion: 'panda',
      backgroundTheme: 'from-yellow-200 via-pink-200 to-purple-200',
      pose: 'dance',
      title: 'Master Cartoon Painter',
    },
  },
];

const STAGE_THEMES = [
  { id: 'cyber', name: 'Cyber Neon Station', bg: 'from-cyan-950 via-slate-900 to-purple-950', icon: '🚀' },
  { id: 'sunny', name: 'Sunny Meadow', bg: 'from-sky-300 via-amber-100 to-emerald-200', icon: '☀️' },
  { id: 'galaxy', name: 'Cosmic Starfield', bg: 'from-indigo-900 via-purple-900 to-slate-950', icon: '🌌' },
  { id: 'candy', name: 'Rainbow Valley', bg: 'from-pink-300 via-rose-100 to-purple-200', icon: '🍭' },
  { id: 'neon', name: 'Turbo Stadium', bg: 'from-amber-400 via-red-300 to-indigo-400', icon: '⚡' },
];

export const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({
  avatar,
  onSaveAvatar,
  onClose,
}) => {
  const [current, setCurrent] = useState<AvatarCustomization>({
    ...avatar,
    pose: avatar.pose || 'wave',
    title: avatar.title || 'Super 3D Kid',
  });
  const [activeTab, setActiveTab] = useState<CustomizerTab>('auto');
  const [isMorphing, setIsMorphing] = useState(false);
  const [cameraFlash, setCameraFlash] = useState(false);
  const [activePose, setActivePose] = useState<'wave' | 'jump' | 'hero' | 'dance'>(
    (avatar.pose as any) || 'wave'
  );

  // Sound and bounce preview when tapping avatar
  const handleAvatarTap = () => {
    sound.playBoing();
    const poses: Array<'wave' | 'jump' | 'hero' | 'dance'> = ['wave', 'jump', 'hero', 'dance'];
    const nextPose = poses[(poses.indexOf(activePose) + 1) % poses.length];
    setActivePose(nextPose);
  };

  // Magic 3D Auto-Creator Button Action
  const handleAutoCreate3D = () => {
    sound.playVictory();
    setIsMorphing(true);

    const hairs: HairstyleType[] = ['curls', 'spiky', 'pigtails', 'cap', 'beanie', 'crown', 'space', 'bunny-ears'];
    const outfits: OutfitType[] = ['explorer', 'superhero', 'racer', 'royal', 'dino', 'artist', 'astronaut'];
    const accs: AccessoryType[] = ['none', 'glasses', 'sunglasses', 'headset', 'wand', 'medal', 'bow'];
    const pets: PetCompanionType[] = ['none', 'puppy', 'kitten', 'baby-lion', 'panda', 'owl'];
    const skins: SkinToneType[] = ['peach', 'warm', 'honey', 'tan', 'espresso'];
    const exps: ExpressionType[] = ['happy', 'winking', 'excited', 'cool', 'laughing'];
    const hairColors = ['#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#1F2937'];
    const stageThemes = STAGE_THEMES.map((t) => t.bg);
    const poses: Array<'wave' | 'jump' | 'hero' | 'dance'> = ['wave', 'jump', 'hero', 'dance'];

    const titles = [
      '⚡ Cosmic Star Champion',
      '🏎️ Turbo Nitro Kid',
      '👑 Royal Crystal Legend',
      '🦖 Prehistoric Dino Knight',
      '🎨 Master Cartoon Artist',
      '🦸 Supreme Spark Hero',
      '🐾 Wild Safari Buddy',
      '🪄 Magic Star Wizard',
    ];

    setTimeout(() => {
      const chosenHair = hairs[Math.floor(Math.random() * hairs.length)];
      const chosenOutfit = outfits[Math.floor(Math.random() * outfits.length)];
      const chosenAcc = accs[Math.floor(Math.random() * accs.length)];
      const chosenPet = pets[Math.floor(Math.random() * pets.length)];
      const chosenSkin = skins[Math.floor(Math.random() * skins.length)];
      const chosenExp = exps[Math.floor(Math.random() * exps.length)];
      const chosenColor = hairColors[Math.floor(Math.random() * hairColors.length)];
      const chosenStage = stageThemes[Math.floor(Math.random() * stageThemes.length)];
      const chosenPose = poses[Math.floor(Math.random() * poses.length)];
      const chosenTitle = titles[Math.floor(Math.random() * titles.length)];

      setCurrent({
        skinTone: chosenSkin,
        expression: chosenExp,
        hairstyle: chosenHair,
        hairColor: chosenColor,
        outfit: chosenOutfit,
        accessory: chosenAcc,
        petCompanion: chosenPet,
        backgroundTheme: chosenStage,
        pose: chosenPose,
        title: chosenTitle,
      });
      setActivePose(chosenPose);
      setIsMorphing(false);

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#FFD700', '#FF1493', '#00FFFF', '#76FF03', '#FF4500'],
      });
    }, 450);
  };

  // Select a pre-crafted 3D archetype
  const handleSelectArchetype = (archetype: AutoArchetype) => {
    sound.playStarSparkle();
    setIsMorphing(true);
    setTimeout(() => {
      setCurrent({ ...archetype.config });
      setActivePose((archetype.config.pose as any) || 'hero');
      setIsMorphing(false);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
      });
    }, 250);
  };

  const handleTakeSnapshot = () => {
    sound.playStarSparkle();
    setCameraFlash(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#FFD700', '#00FFFF', '#FF69B4'],
    });
    setTimeout(() => setCameraFlash(false), 300);
  };

  const handleSave = () => {
    sound.playVictory();
    confetti({
      particleCount: 80,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#FF69B4', '#FFD700', '#00FFFF', '#7FFF00'],
    });
    onSaveAvatar({
      ...current,
      pose: activePose,
    });
    onClose();
  };

  // Helper skin color lookup
  const skinColors: Record<SkinToneType, string> = {
    peach: '#FFDFC4',
    warm: '#F0C59D',
    honey: '#DEAA79',
    tan: '#BA7A4F',
    espresso: '#754B2E',
  };

  // Helper expression face
  const renderFace = () => {
    switch (current.expression) {
      case 'winking':
        return (
          <div className="flex items-center justify-center gap-3">
            <div className="w-3.5 h-3.5 bg-slate-900 rounded-full" />
            <div className="w-4 h-1 bg-slate-900 rounded-full rotate-6" />
          </div>
        );
      case 'excited':
        return (
          <div className="flex items-center justify-center gap-3">
            <div className="text-sm font-black text-slate-900">⭐</div>
            <div className="text-sm font-black text-slate-900">⭐</div>
          </div>
        );
      case 'cool':
        return (
          <div className="flex items-center justify-center">
            <span className="text-2xl">🕶️</span>
          </div>
        );
      case 'laughing':
        return (
          <div className="flex items-center justify-center gap-3">
            <div className="w-3.5 h-1.5 bg-slate-900 rounded-full -rotate-12" />
            <div className="w-3.5 h-1.5 bg-slate-900 rounded-full rotate-12" />
          </div>
        );
      case 'happy':
      default:
        return (
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full -mt-1 -ml-1" />
            </div>
            <div className="w-3 h-3 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full -mt-1 -ml-1" />
            </div>
          </div>
        );
    }
  };

  // Helper hairstyle overlay
  const renderHair = () => {
    switch (current.hairstyle) {
      case 'pigtails':
        return (
          <>
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-12 rounded-t-full z-10 shadow-sm"
              style={{ backgroundColor: current.hairColor }}
            />
            <div
              className="absolute -left-3 top-2 w-6 h-9 rounded-full z-10 shadow-sm animate-pulse"
              style={{ backgroundColor: current.hairColor }}
            />
            <div
              className="absolute -right-3 top-2 w-6 h-9 rounded-full z-10 shadow-sm animate-pulse"
              style={{ backgroundColor: current.hairColor }}
            />
          </>
        );
      case 'spiky':
        return (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            <div
              className="w-4 h-8 rounded-t-full rotate-[-22deg] shadow-sm"
              style={{ backgroundColor: current.hairColor }}
            />
            <div
              className="w-5 h-10 rounded-t-full shadow-sm"
              style={{ backgroundColor: current.hairColor }}
            />
            <div
              className="w-4 h-8 rounded-t-full rotate-[22deg] shadow-sm"
              style={{ backgroundColor: current.hairColor }}
            />
          </div>
        );
      case 'curls':
        return (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 flex justify-center gap-1 z-10">
            <div
              className="w-7 h-7 rounded-full shadow-xs"
              style={{ backgroundColor: current.hairColor }}
            />
            <div
              className="w-8 h-8 rounded-full -mt-2 shadow-xs"
              style={{ backgroundColor: current.hairColor }}
            />
            <div
              className="w-7 h-7 rounded-full shadow-xs"
              style={{ backgroundColor: current.hairColor }}
            />
          </div>
        );
      case 'cap':
        return (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="w-24 h-9 bg-rose-500 rounded-t-full border border-rose-600 shadow-md" />
            <div className="w-28 h-4 bg-rose-600 rounded-full -mt-1 shadow" />
          </div>
        );
      case 'beanie':
        return (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="w-5 h-5 bg-yellow-300 rounded-full shadow" />
            <div className="w-24 h-12 bg-sky-500 rounded-t-3xl border-t-2 border-white -mt-1 shadow-md" />
          </div>
        );
      case 'crown':
        return (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 text-3xl animate-bounce drop-shadow-md">
            👑
          </div>
        );
      case 'bunny-ears':
        return (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
            <div className="w-4 h-10 bg-pink-200 rounded-t-full border-2 border-pink-400 shadow" />
            <div className="w-4 h-10 bg-pink-200 rounded-t-full border-2 border-pink-400 shadow" />
          </div>
        );
      case 'space':
        return (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-25 w-32 h-30 rounded-full border-4 border-cyan-300/80 bg-cyan-200/25 backdrop-blur-2xs pointer-events-none shadow-lg" />
        );
      case 'fire-helmet':
        return (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="w-24 h-9 bg-amber-400 rounded-t-full border-2 border-amber-500 shadow-md flex items-center justify-center">
              <span className="text-[10px] font-black text-amber-950">🚒 FIRE CHIEF</span>
            </div>
            <div className="w-28 h-3.5 bg-amber-500 rounded-full -mt-1 shadow" />
          </div>
        );
      case 'cyber-helmet':
        return (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="w-24 h-8 bg-slate-900 rounded-t-full border-2 border-cyan-400 shadow-[0_0_12px_#06b6d4] flex items-center justify-center">
              <div className="w-16 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] animate-pulse" />
            </div>
            <div className="w-26 h-3 bg-cyan-500 rounded-full -mt-1 shadow" />
          </div>
        );
      case 'hologram-hair':
        return (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 z-10 animate-pulse">
            <div className="w-4 h-9 rounded-t-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] rotate-[-20deg]" />
            <div className="w-6 h-11 rounded-t-full bg-purple-400 shadow-[0_0_10px_#a855f7]" />
            <div className="w-4 h-9 rounded-t-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] rotate-[20deg]" />
          </div>
        );
      default:
        return null;
    }
  };

  // Helper outfit
  const renderOutfit = () => {
    switch (current.outfit) {
      case 'cyber-suit':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-b-3xl border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] relative">
            <div className="w-6 h-6 rounded-full bg-cyan-400/80 shadow-[0_0_10px_#06b6d4] flex items-center justify-center mb-0.5">
              <span className="text-[9px] font-black text-slate-950">⚡</span>
            </div>
            <span className="text-[9px] font-black text-cyan-300">CYBER 3D</span>
          </div>
        );
      case 'space-pilot':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-b-3xl border-2 border-cyan-300 flex flex-col items-center justify-center shadow-lg relative">
            <span className="text-sm">🛸</span>
            <span className="text-[9px] font-black text-white">WARP PILOT</span>
          </div>
        );
      case 'bombero':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-b-3xl border-2 border-amber-300 flex flex-col items-center justify-center shadow-lg relative">
            <div className="w-20 h-2 bg-yellow-300 rounded-full mb-1 shadow-xs" />
            <div className="flex items-center gap-1">
              <span className="text-base">🚒</span>
              <span className="text-[9px] font-black text-white">BOMBERO</span>
            </div>
            <div className="w-20 h-2 bg-yellow-300 rounded-full mt-1 shadow-xs" />
          </div>
        );
      case 'superhero':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-b-3xl border-2 border-amber-300 flex flex-col items-center justify-center shadow-lg relative">
            <div className="absolute -left-2 -top-1 w-4 h-14 bg-yellow-400 rounded-l-full -z-10 shadow" />
            <div className="absolute -right-2 -top-1 w-4 h-14 bg-yellow-400 rounded-r-full -z-10 shadow" />
            <span className="text-xl">⚡</span>
            <span className="text-[9px] font-black text-white">HERO 3D</span>
          </div>
        );
      case 'racer':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-b-3xl border-2 border-white flex flex-col items-center justify-center shadow-lg">
            <div className="flex gap-1 text-xs">🏁</div>
            <span className="text-[10px] font-black text-slate-900 tracking-wider">
              #1 TURBO
            </span>
          </div>
        );
      case 'royal':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-b-3xl border-2 border-yellow-300 flex flex-col items-center justify-center shadow-lg">
            <span className="text-sm">💎</span>
            <span className="text-[9px] font-black text-yellow-200">ROYALTY</span>
          </div>
        );
      case 'dino':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-b-3xl border-2 border-emerald-300 flex flex-col items-center justify-center shadow-lg">
            <span className="text-base">🦖</span>
            <span className="text-[9px] font-black text-white">DINO ROAR</span>
          </div>
        );
      case 'artist':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-pink-400 via-amber-300 to-sky-400 rounded-b-3xl border-2 border-white flex flex-col items-center justify-center shadow-lg">
            <span className="text-sm">🎨</span>
            <span className="text-[9px] font-black text-slate-900">ARTIST</span>
          </div>
        );
      case 'astronaut':
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-slate-100 to-cyan-200 rounded-b-3xl border-2 border-cyan-400 flex flex-col items-center justify-center shadow-lg">
            <span className="text-sm">🚀</span>
            <span className="text-[9px] font-black text-cyan-900">COSMO 3D</span>
          </div>
        );
      case 'explorer':
      default:
        return (
          <div className="w-24 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-b-3xl border-2 border-amber-300 flex flex-col items-center justify-center shadow-lg">
            <div className="flex gap-2 mb-0.5">
              <span className="text-[10px]">🧭</span>
              <span className="text-[10px]">⭐</span>
            </div>
            <span className="text-[9px] font-black text-amber-100">SCOUT</span>
          </div>
        );
    }
  };

  // Helper pet companion
  const renderPet = () => {
    const map: Record<PetCompanionType, string | null> = {
      none: null,
      puppy: '🐶',
      kitten: '🐱',
      'baby-lion': '🦁',
      panda: '🐼',
      owl: '🦉',
      dalmatian: '🐕‍🦺',
      'cyber-pup': '🤖',
      'robo-dragon': '🐲',
    };
    const emoji = map[current.petCompanion];
    if (!emoji) return null;
    return (
      <div className="absolute -bottom-2 -right-4 w-11 h-11 rounded-2xl bg-white shadow-xl border-2 border-amber-300 flex items-center justify-center text-2xl animate-bounce">
        {emoji}
      </div>
    );
  };

  // Helper accessory
  const renderAccessory = () => {
    switch (current.accessory) {
      case 'jetpack':
        return (
          <div className="absolute -left-6 top-6 z-30 flex flex-col items-center animate-bounce">
            <span className="text-3xl drop-shadow-[0_0_10px_#06b6d4]">🚀</span>
          </div>
        );
      case 'laser-shield':
        return (
          <div className="absolute -right-6 top-8 z-30 flex flex-col items-center animate-pulse">
            <span className="text-3xl drop-shadow-[0_0_12px_#06b6d4]">🛡️</span>
          </div>
        );
      case 'fire-hose':
        return (
          <div className="absolute -left-6 top-8 z-30 text-3xl animate-bounce drop-shadow-md">
            💧
          </div>
        );
      case 'headset':
        return (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 flex justify-between items-center z-30 pointer-events-none">
            <div className="w-4 h-7 bg-amber-400 rounded-l-full border border-slate-900 shadow-sm" />
            <div className="w-4 h-7 bg-amber-400 rounded-r-full border border-slate-900 shadow-sm" />
          </div>
        );
      case 'sunglasses':
        return (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 text-2xl drop-shadow-md">
            😎
          </div>
        );
      case 'glasses':
        return (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 text-2xl drop-shadow-md">
            👓
          </div>
        );
      case 'wand':
        return (
          <div className="absolute -left-5 top-8 z-30 text-3xl animate-pulse drop-shadow-md">
            🪄
          </div>
        );
      case 'medal':
        return (
          <div className="absolute -left-3 bottom-3 z-30 text-2xl animate-star drop-shadow-md">
            🥇
          </div>
        );
      case 'bow':
        return (
          <div className="absolute -top-3 right-1 z-30 text-2xl drop-shadow-md">
            🎀
          </div>
        );
      default:
        return null;
    }
  };

  // Animation pose class
  const getPoseClass = () => {
    switch (activePose) {
      case 'jump':
        return 'animate-bounce';
      case 'dance':
        return 'animate-pulse';
      case 'hero':
        return 'scale-105';
      case 'wave':
      default:
        return 'hover:scale-105';
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col font-['Fredoka',sans-serif] text-slate-800 select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-3 bg-white/95 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between z-20 shadow-xs">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition active:scale-95"
          title="Close Customizer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-amber-300">
            <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
            <span>3D AUTO HERO STUDIO</span>
          </div>
          <h3 className="text-base font-black text-slate-900 leading-tight">
            {current.title || 'Super 3D Cartoon Hero'}
          </h3>
        </div>

        {/* Snapshot Photo Button */}
        <button
          onClick={handleTakeSnapshot}
          className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 flex items-center justify-center shadow transition active:scale-90"
          title="Take 3D Photo Snapshot"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Main 3D Live Stage Preview */}
      <div
        className={`relative py-4 px-6 flex flex-col items-center justify-center bg-gradient-to-b ${current.backgroundTheme} border-b-2 border-white shadow-inner overflow-hidden min-h-[220px] transition-colors duration-500`}
      >
        {/* Camera Flash overlay */}
        {cameraFlash && (
          <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300" />
        )}

        {/* Ambient Stage Particles */}
        <div className="absolute top-2 inset-x-4 flex justify-between text-xl opacity-75 pointer-events-none">
          <span className="animate-spin duration-1000">✨</span>
          <span className="animate-pulse">⭐</span>
          <span className="animate-bounce">🌟</span>
        </div>

        {/* Interactive 3D Avatar Display */}
        <div
          className="relative cursor-pointer group"
          onClick={handleAvatarTap}
          title="Tap your 3D Hero to pose & bounce!"
        >
          {/* Glowing 3D Pedestal Platform */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-44 h-9 bg-amber-400/50 rounded-full blur-xs border-2 border-white/60 shadow-lg" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-36 h-6 bg-yellow-300/80 rounded-full blur-2xs" />

          {/* Interactive 3D Character Node */}
          <div
            className={`relative flex flex-col items-center transition-all duration-300 ${
              isMorphing ? 'scale-0 rotate-180' : getPoseClass()
            }`}
          >
            {/* Accessories / Headset */}
            {renderAccessory()}

            {/* Hair and Hats */}
            {renderHair()}

            {/* Head / Face */}
            <div
              className="relative w-22 h-22 rounded-[28px] shadow-xl border-3 border-white flex flex-col items-center justify-center z-10"
              style={{ backgroundColor: skinColors[current.skinTone] }}
            >
              {/* Cute Rosy Cheeks */}
              <div className="absolute left-2.5 top-12 w-3.5 h-2 bg-pink-400/50 rounded-full blur-2xs" />
              <div className="absolute right-2.5 top-12 w-3.5 h-2 bg-pink-400/50 rounded-full blur-2xs" />

              {/* Eyes & Expression */}
              {renderFace()}

              {/* Smiling Mouth */}
              <div className="w-5 h-2.5 border-b-2 border-slate-900 rounded-b-full mt-1.5" />
            </div>

            {/* Neck & Body Outfit */}
            <div className="relative -mt-2 z-10 flex flex-col items-center">
              {renderOutfit()}
            </div>

            {/* Pet Companion */}
            {renderPet()}
          </div>
        </div>

        {/* Action Pose Selector Bar */}
        <div className="mt-3 flex items-center gap-1.5 bg-white/85 backdrop-blur-xs p-1 rounded-full border border-white/80 shadow-sm z-10">
          {[
            { id: 'wave', label: 'Wave', emoji: '👋' },
            { id: 'jump', label: 'Jump', emoji: '🏆' },
            { id: 'hero', label: 'Hero', emoji: '⚡' },
            { id: 'dance', label: 'Dance', emoji: '💃' },
          ].map((pose) => (
            <button
              key={pose.id}
              onClick={() => {
                sound.playPop(520);
                setActivePose(pose.id as any);
              }}
              className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 transition ${
                activePose === pose.id
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{pose.emoji}</span>
              <span className="text-[10px]">{pose.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary 3D AUTO-CREATOR Magic Banner */}
      <div className="p-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 border-b-2 border-amber-300 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-white text-xl flex items-center justify-center shadow-inner border border-amber-300 animate-spin duration-3000">
            🪄
          </div>
          <div>
            <div className="text-xs font-black text-amber-950 leading-tight">
              1-Tap Magic 3D Auto Creator
            </div>
            <div className="text-[10px] font-bold text-amber-900">
              Spin to generate completely new 3D styles!
            </div>
          </div>
        </div>

        <button
          onClick={handleAutoCreate3D}
          className="btn-3d py-1.5 px-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-xs shadow-md border border-white flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTO CREATE 3D!</span>
        </button>
      </div>

      {/* Category Navigation Tabs */}
      <div className="px-2 pt-2 pb-1 bg-white flex items-center justify-around border-b border-slate-200">
        {[
          { id: 'auto', label: '3D Presets', icon: '⚡' },
          { id: 'hair', label: 'Hair & Hats', icon: '💇' },
          { id: 'outfit', label: 'Outfits', icon: '👕' },
          { id: 'accessories', label: 'Items', icon: '🕶️' },
          { id: 'face', label: 'Face & Skin', icon: '😊' },
          { id: 'pet', label: 'Pet Buddy', icon: '🐾' },
          { id: 'stage', label: '3D Stages', icon: '🏞️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playPop(500);
              setActiveTab(tab.id as CustomizerTab);
            }}
            className={`flex flex-col items-center py-1 px-1.5 rounded-2xl transition ${
              activeTab === tab.id
                ? 'bg-amber-100 text-amber-950 font-black scale-105 border border-amber-300'
                : 'text-slate-400 font-bold hover:text-slate-600'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[9px] mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Options Content Area */}
      <div className="flex-1 p-3.5 overflow-y-auto no-scrollbar bg-slate-50">
        {/* 3D Auto Presets Tab */}
        {activeTab === 'auto' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                Select a 3D Hero Archetype:
              </span>
              <button
                onClick={handleAutoCreate3D}
                className="text-[11px] font-black text-amber-600 flex items-center gap-1 hover:underline"
              >
                <Dices className="w-3.5 h-3.5" />
                Surprise Spin!
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {AUTO_ARCHETYPES.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => handleSelectArchetype(arch)}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition shadow-sm ${
                    current.title === arch.config.title
                      ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-300/70 scale-102 shadow-md'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:scale-102'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${arch.color} flex items-center justify-center text-2xl shadow-inner border border-white shrink-0`}>
                    {arch.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 truncate">
                      {arch.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 leading-tight">
                      {arch.tagline}
                    </div>
                    <div className="text-[9px] font-black text-amber-600 mt-0.5">
                      Tap to auto-equip ✨
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hair & Hats Tab */}
        {activeTab === 'hair' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                Choose Hairstyle or Hat:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { id: 'spiky', name: 'Adventurer', icon: '⚡' },
                  { id: 'cyber-helmet', name: 'Cyber Visor', icon: '🥽' },
                  { id: 'hologram-hair', name: 'Neon Glow', icon: '⚡' },
                  { id: 'curls', name: 'Bouncy Curls', icon: '➰' },
                  { id: 'pigtails', name: 'Twin Tails', icon: '👧' },
                  { id: 'cap', name: 'Baseball Cap', icon: '🧢' },
                  { id: 'beanie', name: 'Winter Beanie', icon: '🏂' },
                  { id: 'crown', name: 'Golden Crown', icon: '👑' },
                  { id: 'space', name: 'Space Helmet', icon: '🪖' },
                  { id: 'bunny-ears', name: 'Bunny Ears', icon: '🐰' },
                  { id: 'fire-helmet', name: 'Fire Helmet', icon: '⛑️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playPop(520);
                      setCurrent({ ...current, hairstyle: item.id as HairstyleType });
                    }}
                    className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition ${
                      current.hairstyle === item.id
                        ? 'bg-amber-100 border-amber-400 shadow-md scale-105'
                        : 'bg-white border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] font-black text-slate-800 mt-1 leading-tight text-center">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color Palette */}
            <div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                Hair Color:
              </span>
              <div className="flex items-center gap-2.5">
                {[
                  { color: '#F59E0B', label: 'Golden Blonde' },
                  { color: '#8B5CF6', label: 'Magic Purple' },
                  { color: '#EC4899', label: 'Bubblegum Pink' },
                  { color: '#3B82F6', label: 'Ocean Blue' },
                  { color: '#10B981', label: 'Emerald Green' },
                  { color: '#78350F', label: 'Chestnut Brown' },
                  { color: '#1F2937', label: 'Midnight Black' },
                ].map((hc) => (
                  <button
                    key={hc.color}
                    onClick={() => {
                      sound.playPop(560);
                      setCurrent({ ...current, hairColor: hc.color });
                    }}
                    style={{ backgroundColor: hc.color }}
                    className={`w-9 h-9 rounded-full shadow border-2 transition ${
                      current.hairColor === hc.color
                        ? 'border-white ring-4 ring-amber-400 scale-110'
                        : 'border-white/70'
                    }`}
                    title={hc.label}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Outfits Tab */}
        {activeTab === 'outfit' && (
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1">
              Choose Cool Outfit:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'explorer', name: 'Scout Explorer', emoji: '🧭' },
                { id: 'cyber-suit', name: 'Cyber Mech', emoji: '🤖' },
                { id: 'space-pilot', name: 'Warp Pilot', emoji: '🛸' },
                { id: 'superhero', name: 'Power Hero', emoji: '🦸' },
                { id: 'racer', name: 'Speed Racer', emoji: '🏎️' },
                { id: 'bombero', name: 'Bombero Jacket', emoji: '🚒' },
                { id: 'royal', name: 'Royal Prince', emoji: '👑' },
                { id: 'dino', name: 'Dino Hoodie', emoji: '🦖' },
                { id: 'artist', name: 'Creative Artist', emoji: '🎨' },
                { id: 'astronaut', name: 'Astronaut Suit', emoji: '🚀' },
              ].map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => {
                    sound.playPop(540);
                    setCurrent({ ...current, outfit: outfit.id as OutfitType });
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition ${
                    current.outfit === outfit.id
                      ? 'bg-amber-100 border-amber-400 shadow-md scale-105'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-3xl mb-1">{outfit.emoji}</span>
                  <span className="text-xs font-black text-slate-800 text-center leading-tight">
                    {outfit.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Accessories Tab */}
        {activeTab === 'accessories' && (
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1">
              Choose Accessories & Gear:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'none', name: 'No Item', emoji: '❌' },
                { id: 'jetpack', name: 'Cyber Jetpack', emoji: '🚀' },
                { id: 'laser-shield', name: 'Laser Shield', emoji: '🛡️' },
                { id: 'fire-hose', name: 'Water Spray', emoji: '💧' },
                { id: 'headset', name: 'Gaming Headset', emoji: '🎧' },
                { id: 'sunglasses', name: 'Cool Shades', emoji: '🕶️' },
                { id: 'glasses', name: 'Smart Glasses', emoji: '👓' },
                { id: 'wand', name: 'Star Wand', emoji: '🪄' },
                { id: 'medal', name: 'Gold Medal', emoji: '🥇' },
                { id: 'bow', name: 'Pretty Bow', emoji: '🎀' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    sound.playPop(560);
                    setCurrent({ ...current, accessory: acc.id as AccessoryType });
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition ${
                    current.accessory === acc.id
                      ? 'bg-amber-100 border-amber-400 shadow-md scale-105'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-3xl mb-1">{acc.emoji}</span>
                  <span className="text-xs font-black text-slate-800 text-center leading-tight">
                    {acc.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Face & Skin Tab */}
        {activeTab === 'face' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                Skin Tone:
              </span>
              <div className="flex items-center gap-3">
                {[
                  { id: 'peach', color: '#FFDFC4', name: 'Peach' },
                  { id: 'warm', color: '#F0C59D', name: 'Warm' },
                  { id: 'honey', color: '#DEAA79', name: 'Honey' },
                  { id: 'tan', color: '#BA7A4F', name: 'Tan' },
                  { id: 'espresso', color: '#754B2E', name: 'Espresso' },
                ].map((skin) => (
                  <button
                    key={skin.id}
                    onClick={() => {
                      sound.playPop(480);
                      setCurrent({ ...current, skinTone: skin.id as SkinToneType });
                    }}
                    style={{ backgroundColor: skin.color }}
                    className={`w-10 h-10 rounded-2xl shadow border-2 transition ${
                      current.skinTone === skin.id
                        ? 'border-white ring-4 ring-amber-400 scale-110'
                        : 'border-slate-300'
                    }`}
                    title={skin.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                Smiling Expression:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'happy', name: 'Happy Smile', emoji: '😊' },
                  { id: 'winking', name: 'Playful Wink', emoji: '😉' },
                  { id: 'excited', name: 'Star Eyes', emoji: '🤩' },
                  { id: 'cool', name: 'Cool Kid', emoji: '😎' },
                  { id: 'laughing', name: 'Big Laugh', emoji: '😄' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => {
                      sound.playPop(520);
                      setCurrent({ ...current, expression: exp.id as ExpressionType });
                    }}
                    className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition ${
                      current.expression === exp.id
                        ? 'bg-amber-100 border-amber-400 shadow scale-105'
                        : 'bg-white border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-3xl mb-1">{exp.emoji}</span>
                    <span className="text-xs font-black text-slate-800 text-center">
                      {exp.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pet Companion Tab */}
        {activeTab === 'pet' && (
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1">
              Choose Loyal Pet Buddy:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'none', name: 'Solo Hero', emoji: '🚶' },
                { id: 'cyber-pup', name: 'Robo Pup', emoji: '🤖' },
                { id: 'robo-dragon', name: 'Cyber Dragon', emoji: '🐲' },
                { id: 'dalmatian', name: 'Fire Dalmatian', emoji: '🐕‍🦺' },
                { id: 'puppy', name: 'Golden Pup', emoji: '🐶' },
                { id: 'kitten', name: 'Sweet Kitty', emoji: '🐱' },
                { id: 'baby-lion', name: 'Lion Cub', emoji: '🦁' },
                { id: 'panda', name: 'Snack Panda', emoji: '🐼' },
                { id: 'owl', name: 'Smart Owl', emoji: '🦉' },
              ].map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => {
                    sound.playPop(580);
                    setCurrent({ ...current, petCompanion: pet.id as PetCompanionType });
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition ${
                    current.petCompanion === pet.id
                      ? 'bg-amber-100 border-amber-400 shadow-md scale-105'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-3xl mb-1">{pet.emoji}</span>
                  <span className="text-xs font-black text-slate-800 text-center leading-tight">
                    {pet.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3D Stages Tab */}
        {activeTab === 'stage' && (
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1">
              Choose 3D Stage Environment:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {STAGE_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    sound.playPop(540);
                    setCurrent({ ...current, backgroundTheme: theme.bg });
                  }}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-2 transition shadow-sm ${
                    current.backgroundTheme === theme.bg
                      ? 'border-amber-400 ring-4 ring-amber-300 bg-white scale-105'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${theme.bg} border border-white shadow-inner flex items-center justify-center text-xl`}>
                    {theme.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-slate-900 leading-tight">
                      {theme.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">
                      Tap to apply
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Button Bar */}
      <div className="p-3 bg-white border-t border-slate-200 z-20">
        <button
          onClick={handleSave}
          className="btn-3d btn-3d-play w-full py-3.5 px-6 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 border-2 border-amber-200 shadow-lg cursor-pointer active:scale-98 transition"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>EQUIP & SAVE MY 3D HERO!</span>
        </button>
      </div>
    </div>
  );
};
