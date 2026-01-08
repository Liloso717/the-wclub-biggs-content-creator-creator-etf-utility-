import React, { useState } from 'react';
import { MOCK_MARKETS, MOCK_OPINION_MARKETS } from '../constants';
import { MessageCircle, TrendingUp, Clock, User } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { BaseProps } from '../types';

export const PredictionMarket: React.FC<BaseProps> = ({ onInteract, walletConnected }) => {
  const [activeTab, setActiveTab] = useState<'flash' | 'longterm' | 'content' | 'opinion'>('opinion');

  const filteredMarkets = MOCK_MARKETS.filter(m => m.type === activeTab);

  const handleBet = (type: string, marketId: string) => {
    if(!walletConnected) {
      onInteract('error', 'Connect Wallet', 'Please connect your wallet to place a bet.');
      return;
    }
    onInteract('loading', 'Placing Bet...', `Purchasing ${type} shares.`);
    setTimeout(() => {
      onInteract('success', 'Bet Placed', `Successfully bought ${type} for Market #${marketId}`);
    }, 1500);
  };

  // Render specific layout for Opinion Markets (Cue.fun style)
  if (activeTab === 'opinion') {
    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Opinion Markets</h2>
            <span className="text-xs bg-gradient-to-r from-pink-500 to-orange-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">Hot</span>
          </div>
          <div className="flex bg-highlight rounded-lg p-1 overflow-x-auto max-w-[200px] md:max-w-none">
            {(['opinion', 'flash', 'content', 'longterm'] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-3 py-1 text-sm rounded capitalize whitespace-nowrap transition ${
                  activeTab === type ? 'bg-white text-black font-bold shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_OPINION_MARKETS.map(market => (
            <div key={market.id} className="relative group bg-card-bg rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
               {/* Header / Visual */}
               <div className={`h-24 bg-gradient-to-r ${market.gradient} p-4 relative`}>
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur rounded-full px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1">
                    <Clock size={10} /> {market.endsIn}
                  </div>
               </div>

               {/* Avatar Overlay */}
               <div className="absolute top-16 left-6 w-14 h-14 rounded-full border-4 border-card-bg z-10 flex items-center justify-center font-bold text-black text-xl shadow-lg" style={{ backgroundColor: market.creatorAvatarColor }}>
                  {market.creator.charAt(0)}
               </div>

               <div className="pt-8 pb-6 px-6">
                  {/* Creator */}
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs text-gray-400 font-bold">@{market.creator}</span>
                     {market.tags.map(tag => (
                       <span key={tag} className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">#{tag}</span>
                     ))}
                  </div>

                  {/* Question */}
                  <h3 className="text-xl font-black leading-tight mb-2 text-white group-hover:text-neon-green transition-colors">
                    {market.question}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                    {market.description}
                  </p>

                  {/* Betting Bar (Cue Style) */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-green-400">Yes {market.yesPercent}%</span>
                      <span className="text-red-400">{100 - market.yesPercent}% No</span>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden flex">
                       <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${market.yesPercent}%` }}></div>
                       <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${100 - market.yesPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><TrendingUp size={12} /> ${market.volume}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12} /> {market.comments}</span>
                     </div>
                     
                     <div className="flex gap-2">
                        <Tooltip content="Bet YES with $thewclubbiggs">
                          <button 
                            onClick={() => handleBet('YES', market.id)}
                            className="bg-green-500/10 hover:bg-green-500 hover:text-black text-green-500 border border-green-500/30 px-4 py-1.5 rounded-xl text-sm font-bold transition"
                          >
                            Buy Yes
                          </button>
                        </Tooltip>
                        <Tooltip content="Bet NO with $thewclubbiggs">
                          <button 
                            onClick={() => handleBet('NO', market.id)}
                            className="bg-red-500/10 hover:bg-red-500 hover:text-black text-red-500 border border-red-500/30 px-4 py-1.5 rounded-xl text-sm font-bold transition"
                          >
                            Buy No
                          </button>
                        </Tooltip>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default Standard Markets Layout
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Standard Markets</h2>
        <div className="flex bg-highlight rounded-lg p-1 overflow-x-auto max-w-[200px] md:max-w-none">
          {(['opinion', 'flash', 'content', 'longterm'] as const).map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-3 py-1 text-sm rounded capitalize whitespace-nowrap transition ${
                activeTab === type ? 'bg-white text-black font-bold shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMarkets.map(market => (
          <div key={market.id} className="bg-card-bg border border-white/5 rounded-xl p-5 hover:border-neon-purple/50 transition duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-lg text-white">{market.question}</h3>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded flex items-center gap-1">
                Ends: {market.endsIn}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
              <span>Vol: {market.volume}</span>
              <span className="text-green-400">Pool: {market.yesPool + market.noPool}</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleBet('YES', market.id)}
                className="flex-1 bg-green-900/30 border border-green-500/30 text-green-400 py-2 rounded hover:bg-green-500 hover:text-black transition"
              >
                Yes ({(market.yesPool / (market.yesPool + market.noPool) * 100).toFixed(0)}%)
              </button>
              <button 
                onClick={() => handleBet('NO', market.id)}
                className="flex-1 bg-red-900/30 border border-red-500/30 text-red-400 py-2 rounded hover:bg-red-500 hover:text-black transition"
              >
                No ({(market.noPool / (market.yesPool + market.noPool) * 100).toFixed(0)}%)
              </button>
            </div>
          </div>
        ))}
        {filteredMarkets.length === 0 && (
          <div className="text-center py-8 text-gray-500">No active markets in this category.</div>
        )}
      </div>
    </div>
  );
};