import React, { useState } from 'react';
import { Tooltip } from './Tooltip';
import { BaseProps, Burner } from '../types';

interface BurnAuctionProps extends BaseProps {
  burners: Burner[];
  onBurn: (amount: number) => void;
}

export const BurnAuction: React.FC<BurnAuctionProps> = ({ onInteract, walletConnected, burners, onBurn }) => {
  const [burnAmount, setBurnAmount] = useState('');
  const currentLeader = burners[0];

  const handleBid = () => {
    if (!walletConnected) {
      onInteract('error', 'Connect Wallet', 'You must connect your wallet to bid.');
      return;
    }
    const amountVal = parseInt(burnAmount);
    if (!burnAmount || isNaN(amountVal) || amountVal <= currentLeader.amount) {
      onInteract('error', 'Invalid Bid', `Bid must be higher than ${currentLeader.amount}`);
      return;
    }

    onInteract('loading', 'Burning Tokens...', 'Interacting with burn contract.');
    setTimeout(() => {
      onBurn(amountVal);
      onInteract('success', 'Bid Placed!', `You burned ${amountVal} tokens. You are now the leader.`);
      setBurnAmount('');
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-b from-orange-900/20 to-card-bg border border-orange-500/30 rounded-xl p-6 relative overflow-visible">
      <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl uppercase">
        Live Auction
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-bold text-orange-400">
          <span className="text-2xl mr-2">🔥</span>Promo Slot Auction
        </h2>
        <Tooltip content="Burn tokens to bid for the top banner spot. Burned tokens are permanently removed from circulation, making the asset more scarce." position="top">
           <span className="text-xs text-gray-500 border border-gray-600 rounded-full w-5 h-5 flex items-center justify-center hover:text-white transition">?</span>
        </Tooltip>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Bid $thewclubbiggs to hijack the "1hr Slot" banner on the main page. <br/>
        <Tooltip content="You must bid higher than this amount to take over the slot immediately.">
          <span className="text-white font-bold hover:text-orange-400 transition">Current Highest Bid: {currentLeader.amount.toLocaleString()} (by @{currentLeader.username})</span>
        </Tooltip>
      </p>

      <div className="flex gap-2 mb-6">
        <input 
          type="number" 
          placeholder={`Min bid: ${currentLeader.amount + 1}`} 
          value={burnAmount}
          onChange={(e) => setBurnAmount(e.target.value)}
          className="flex-1 bg-black border border-white/20 rounded px-4 py-3 text-white focus:border-orange-500 outline-none font-mono"
        />
        <button 
          onClick={handleBid}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold px-6 py-2 rounded hover:from-orange-500 hover:to-red-500 transition shadow-lg shadow-orange-900/40 whitespace-nowrap"
        >
          BID & BURN
        </button>
      </div>

      <div className="bg-black/40 rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider flex justify-between items-center">
          <span>Wall of Fame</span>
          <span className="text-[10px] text-gray-500">Last 24h</span>
        </h3>
        <ul className="space-y-3">
          {burners.map((burner) => (
            <li key={burner.rank} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 group">
              <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs shadow-lg ${
                  burner.rank === 1 ? 'bg-yellow-500 text-black scale-110' : 
                  burner.rank === 2 ? 'bg-gray-400 text-black' : 
                  'bg-orange-800 text-white'
                }`}>
                  {burner.rank}
                </span>
                <span className={burner.rank === 1 ? 'text-white font-bold' : 'text-gray-400'}>
                  @{burner.username}
                </span>
              </div>
              <Tooltip content="Total tokens burned by this user in the last 24 hours." position="left">
                <span className="font-mono text-orange-400 group-hover:text-orange-300 transition cursor-help">
                  {burner.amount.toLocaleString()} 🔥
                </span>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};