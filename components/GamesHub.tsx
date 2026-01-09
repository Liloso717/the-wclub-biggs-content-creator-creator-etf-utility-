import React, { useState } from 'react';
import { BaseProps } from '../types';
import { TicTacToe } from './Games/TicTacToe';
import { RockPaperScissors } from './Games/RockPaperScissors';
import { Gamepad2, Swords } from 'lucide-react';

export const GamesHub: React.FC<BaseProps> = (props) => {
  const [activeGame, setActiveGame] = useState<'tictactoe' | 'rps'>('tictactoe');

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-white mb-2">Arcade</h2>
        <p className="text-gray-400">Play games, bet $thewclubbiggs, win big.</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setActiveGame('tictactoe')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
             activeGame === 'tictactoe' 
             ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.2)]' 
             : 'bg-card-bg border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
          }`}
        >
          <Gamepad2 size={24} />
          <div className="text-left">
             <div className="font-bold leading-none">Tic Tac Toe</div>
             <div className="text-[10px] opacity-70">Strategy</div>
          </div>
        </button>

        <button 
          onClick={() => setActiveGame('rps')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
             activeGame === 'rps' 
             ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(176,38,255,0.2)]' 
             : 'bg-card-bg border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
          }`}
        >
          <Swords size={24} />
          <div className="text-left">
             <div className="font-bold leading-none">RPS</div>
             <div className="text-[10px] opacity-70">Luck</div>
          </div>
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
         {activeGame === 'tictactoe' ? <TicTacToe {...props} /> : <RockPaperScissors {...props} />}
      </div>
    </div>
  );
};