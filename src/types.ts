export type GameCategory = 'all' | 'puzzle' | 'racing' | 'matching' | 'educational';

export interface GameItem {
  id: string;
  title: string;
  category: GameCategory;
  tagline: string;
  iconUrl: string;
  bannerUrl?: string;
  ageRange: string;
  rating: number;
  playsCount: string;
  starsReward: number;
  badge: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  description: string;
  skillsLearned: string[];
  gameplayType: 'racing' | 'puzzle' | 'matching' | 'educational' | 'fruit-pop' | 'bombero-autorun' | 'cyber-cosmo';
}

export type HairstyleType = 'curls' | 'spiky' | 'pigtails' | 'cap' | 'beanie' | 'crown' | 'space' | 'bunny-ears' | 'fire-helmet' | 'cyber-helmet' | 'hologram-hair';
export type OutfitType = 'explorer' | 'superhero' | 'racer' | 'royal' | 'dino' | 'artist' | 'astronaut' | 'bombero' | 'cyber-suit' | 'space-pilot';
export type AccessoryType = 'none' | 'glasses' | 'sunglasses' | 'headset' | 'wand' | 'medal' | 'bow' | 'fire-hose' | 'jetpack' | 'laser-shield';
export type PetCompanionType = 'none' | 'puppy' | 'kitten' | 'baby-lion' | 'panda' | 'owl' | 'dalmatian' | 'cyber-pup' | 'robo-dragon';
export type SkinToneType = 'peach' | 'warm' | 'honey' | 'tan' | 'espresso';
export type ExpressionType = 'happy' | 'winking' | 'excited' | 'cool' | 'laughing';

export interface SpinReward {
  id: string;
  label: string;
  subLabel: string;
  emoji: string;
  color: string;
  type: 'stars' | 'sticker' | 'badge' | 'booster';
  value: number | string;
}

export interface AvatarCustomization {
  skinTone: SkinToneType;
  expression: ExpressionType;
  hairstyle: HairstyleType;
  hairColor: string;
  outfit: OutfitType;
  accessory: AccessoryType;
  petCompanion: PetCompanionType;
  backgroundTheme: string;
  pose?: 'wave' | 'bounce' | 'hero' | 'dance' | 'jump';
  title?: string;
}

export interface KidProfile {
  name: string;
  avatarEmoji: string;
  level: number;
  stars: number;
  streakDays: number;
  stickersCollected: number;
  avatar: AvatarCustomization;
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  gameSource: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  unlocked: boolean;
  soundPitch: number;
  placedX?: number;
  placedY?: number;
}

export interface TrophyItem {
  id: string;
  title: string;
  gameTitle: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  starsBonus: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}
