import React from 'react';
import { Burner } from '../types';
import { Tooltip } from './Tooltip';

interface SlotWinnerBannerProps {
  winner: Burner;
}

export const SlotWinnerBanner: React.FC<SlotWinnerBannerProps> = ({ winner }) => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 bg-[length:200%_200%] animate-gradient-x border-b border-white/20 p-3 shadow-lg shadow-purple-500/20 mb-6 rounded-lg relative overflow-visible group z-30">
      <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition pointer-events-none"></div>
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-center">
        <Tooltip content="This user burned the most $thewclubbiggs to win this promotional spot for 1 hour.">
          <div className="flex items-center gap-2 animate-pulse cursor-help">
            <span className="text-yellow-400 text-lg">👑</span>
            <span className="text-white font-bold uppercase tracking-widest text-xs md:text-sm">Current 1HR Slot Owner</span>
          </div>
        </Tooltip>
        
        <div className="flex items-center gap-3 bg-black/40 px-4 py-1 rounded-full border border-white/10">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-black flex items-center justify-center font-bold text-xs shadow-inner">
                {winner.username.charAt(0)}
            </div>
            <span className="font-bold text-white text-sm md:text-lg tracking-tight">@{winner.username}</span>
        </div>
        
        <Tooltip content={`Burn more than ${winner.amount} tokens in the Auction panel to replace this user instantly!`} position="bottom">
          <span className="text-xs text-neon-green font-mono bg-neon-green/10 px-2 py-1 rounded border border-neon-green/20 cursor-pointer hover:bg-neon-green/20 transition">
            Bid {winner.amount.toLocaleString()} $thewclubbiggs to win
          </span>
        </Tooltip>
      </div>
    </div>
  );
};