import React, { useState } from 'react';
import { Trophy, Gamepad2, Sparkles } from 'lucide-react';
import { GamesConfig } from '../../types';
import { FlappyGame } from './FlappyGame';
import { SnakeGame } from './SnakeGame';

interface GameSectionProps {
  gamesConfig: GamesConfig;
}

export const GameSection: React.FC<GameSectionProps> = ({ gamesConfig }) => {
  const [activeGame, setActiveGame] = useState<'flappy' | 'snake'>('flappy');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#004b87] via-[#005a9e] to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khu vực giải trí quầy giao dịch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chờ Vui – Chơi Hay – Nhận Quà Liền Tay
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-100">
            Chơi mini game thú vị trong lúc chờ giao dịch tại quầy VietinBank để nhận ngay voucher xăng hấp dẫn!
          </p>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs max-w-md">
        <button
          onClick={() => setActiveGame('flappy')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeGame === 'flappy'
              ? 'bg-[#004b87] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#004b87] hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Game 1: Flappy Bird</span>
        </button>

        <button
          onClick={() => setActiveGame('snake')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeGame === 'snake'
              ? 'bg-[#004b87] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#004b87] hover:bg-slate-100'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>Game 2: Rắn Săn Mồi</span>
        </button>
      </div>

      {/* Render Active Game */}
      {activeGame === 'flappy' ? (
        <FlappyGame config={gamesConfig.flappy} />
      ) : (
        <SnakeGame config={gamesConfig.snake} />
      )}
    </div>
  );
};
