import React from 'react';
import { Wifi, BatteryMedium, Sparkles } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isPromoView: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isPromoView }) => {
  if (!isPromoView) {
    // Full screen view mode
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-sky-300 via-amber-100 to-rose-200 flex flex-col items-center">
        <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-sky-100 via-yellow-50 to-pink-100 shadow-2xl relative flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  // 9:16 Vertical Phone Showcase Mockup (ideal for promo video recording)
  return (
    <div className="relative flex items-center justify-center p-2 sm:p-6 select-none">
      {/* Ambient background glow & floating cartoon elements */}
      <div className="absolute w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      {/* Floating 3D Toy Balloons in the background */}
      <div className="hidden lg:block absolute -left-20 top-24 text-6xl animate-float pointer-events-none filter drop-shadow-xl">
        🎈
      </div>
      <div className="hidden lg:block absolute -right-20 top-40 text-6xl animate-float pointer-events-none filter drop-shadow-xl delay-300">
        ⭐
      </div>
      <div className="hidden lg:block absolute -left-16 bottom-32 text-6xl animate-wiggle pointer-events-none filter drop-shadow-xl">
        🦁
      </div>
      <div className="hidden lg:block absolute -right-16 bottom-24 text-6xl animate-bounce pointer-events-none filter drop-shadow-xl">
        🏎️
      </div>

      {/* 9:16 Smartphone Mockup Chassis */}
      <div className="relative w-[390px] h-[844px] max-h-[92vh] aspect-[9/19.5] bg-slate-900 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_10px_#1e293b,0_0_0_12px_#38bdf8] flex flex-col overflow-hidden border-2 border-slate-700">
        {/* Shiny glass edge highlight */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none skew-x-12 z-40" />

        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-40 flex items-center justify-between px-2.5 border border-slate-800 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center">
            <div className="w-1 h-1 bg-indigo-400 rounded-full" />
          </div>
          <span className="text-[9px] font-black text-amber-400 flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" /> FUN
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>

        {/* Screen Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-slate-800 text-[11px] font-black z-30 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-[10px] font-extrabold">5G</span>
            <BatteryMedium className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Actual Mobile App Screen Container */}
        <div className="relative flex-1 bg-gradient-to-b from-sky-200 via-yellow-50 to-pink-100 rounded-[38px] overflow-y-auto no-scrollbar flex flex-col shadow-inner">
          {children}

          {/* Bottom Home Indicator Bar */}
          <div className="sticky bottom-1.5 inset-x-0 flex justify-center pointer-events-none py-1 z-40">
            <div className="w-32 h-1 bg-slate-800/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
