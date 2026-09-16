import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Star, RotateCcw, X, Heart, Award } from 'lucide-react';

interface AnimalMemoryProps {
  onClose: () => void;
  onAddStars: (amount: number) => void;
}

interface CardItem {
  id: number;
  pairId: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
  color: string;
}

const ANIMAL_PAIRS = [
  { pairId: 'lion', emoji: '🦁', name: 'Little Lion', color: 'from-amber-400 to-orange-500' },
  { pairId: 'panda', emoji: '🐼', name: 'Cute Panda', color: 'from-emerald-400 to-teal-500' },
  { pairId: 'bunny', emoji: '🐰', name: 'Happy Bunny', color: 'from-pink-400 to-rose-500' },
  { pairId: 'puppy', emoji: '🐶', name: 'Playful Pup', color: 'from-cyan-400 to-blue-500' },
  { pairId: 'tiger', emoji: '🐯', name: 'Baby Tiger', color: 'from-yellow-400 to-amber-500' },
  { pairId: 'koala', emoji: '🐨', name: 'Sweet Koala', color: 'from-purple-400 to-indigo-500' },
];

export const AnimalMemory: React.FC<AnimalMemoryProps> = ({ onClose, onAddStars }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  const initGame = () => {
    // Pick 4 pairs for a clean 8-card grid (great for kids 4x2 on mobile)
    const selectedPairs = ANIMAL_PAIRS.slice(0, 4);
    const deck: CardItem[] = [];
    let id = 0;

    selectedPairs.forEach((item) => {
      // 2 cards for each animal
      deck.push({
        id: id++,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: id++,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchedCount(0);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isMatched || cards[index].isFlipped) return;
    if (flippedIndices.length >= 2) return;

    sound.playPop(600);
    const newFlipped = [...flippedIndices, index];

    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c))
    );
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          sound.playStarSparkle();
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setMatchedCount((cnt) => {
            const nextCnt = cnt + 1;
            if (nextCnt === 4) {
              // Win!
              setTimeout(() => {
                setIsWon(true);
                sound.playVictory();
                onAddStars(30);
                confetti({
                  particleCount: 80,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ['#EC4899', '#8B5CF6', '#FBBF24', '#34D399'],
                });
              }, 400);
            }
            return nextCnt;
          });
        }, 350);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          sound.playBoing();
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-pink-400 via-purple-500 to-indigo-700 text-white select-none overflow-hidden font-['Fredoka',sans-serif]">
      {/* Top Bar */}
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
          <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 font-black px-3 py-1 rounded-full shadow text-sm">
            <Star className="w-4 h-4 fill-amber-950" />
            <span>Pairs: {matchedCount}/4</span>
          </div>
          <div className="bg-white/20 text-white font-extrabold px-3 py-1 rounded-full text-sm">
            Taps: {moves}
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            initGame();
          }}
          className="w-10 h-10 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition shadow"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Guide Banner */}
      <div className="text-center pt-2 px-4">
        <h2 className="text-xl font-black text-amber-200 drop-shadow flex items-center justify-center gap-1.5">
          <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
          Find Matching Animals!
        </h2>
        <p className="text-xs text-white/80 font-medium">
          Tap two cards to discover the cute twins!
        </p>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-2 gap-3.5 w-full max-w-xs mx-auto">
          {cards.map((card, idx) => {
            const showFace = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-[4/3.8] rounded-3xl p-2 flex flex-col items-center justify-center transition-all duration-300 shadow-xl select-none ${
                  showFace
                    ? `bg-gradient-to-tr ${card.color} border-3 border-white scale-100`
                    : 'bg-white/30 hover:bg-white/40 border-3 border-white/60 active:scale-95'
                }`}
              >
                {showFace ? (
                  <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-200">
                    <span className="text-4xl drop-shadow-md">{card.emoji}</span>
                    <span className="text-xs font-black text-white mt-1 drop-shadow">
                      {card.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center">
                      <span className="text-xl font-black text-amber-300">🐾</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/70 mt-1 uppercase tracking-wider">
                      TAP ME
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Win Modal */}
      {isWon && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 animate-in fade-in zoom-in duration-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-4xl shadow-xl border-4 border-white mb-3 animate-bounce">
            🎉
          </div>
          <h2 className="text-3xl font-black text-amber-300 text-center drop-shadow-md">
            SUPER MATCH!
          </h2>
          <p className="text-white/90 text-center text-sm font-semibold mt-1 mb-4">
            You reunited all the animal friends in {moves} moves!
          </p>

          <div className="bg-white/15 rounded-2xl p-4 w-full max-w-xs flex justify-center items-center gap-3 mb-6 border border-white/20">
            <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
            <span className="text-2xl font-black text-white">+30 Stars Won!</span>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={initGame}
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
  );
};
