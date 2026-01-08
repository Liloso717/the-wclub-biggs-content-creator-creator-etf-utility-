import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';
import { BaseProps } from '../types';

export const StakingDashboard: React.FC<BaseProps> = ({ onInteract, walletConnected }) => {
  const [rewards, setRewards] = useState(124.5093);
  const [totalEarned, setTotalEarned] = useState(4502.12);
  const [isStaked, setIsStaked] = useState(true);
  
  // Live ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment random small amount to simulate live blocks
      setRewards(prev => prev + 0.00004);
      setTotalEarned(prev => prev + 0.00004);
    }, 100); // Update every 100ms
    return () => clearInterval(interval);
  }, []);

  const handleStake = () => {
    if(!walletConnected) {
      onInteract('error', 'Connect Wallet', 'You must connect your wallet to stake.');
      return;
    }
    onInteract('loading', 'Approving Transaction', 'Interacting with Staking Contract...');
    setTimeout(() => {
      onInteract('success', 'Staked Successfully', 'You have staked 5,000 additional tokens.');
      setIsStaked(true);
    }, 1500);
  };

  const handleUnstake = () => {
    if(!walletConnected) {
      onInteract('error', 'Connect Wallet', 'You must connect your wallet to unstake.');
      return;
    }
    if(!isStaked) {
       onInteract('info', 'No Stake Found', 'You do not have any tokens staked.');
       return;
    }
    onInteract('loading', 'Unstaking...', 'Confirming withdrawal.');
    setTimeout(() => {
      onInteract('success', 'Unstaked Successfully', 'Tokens returned to wallet.');
      setIsStaked(false);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-card-bg to-black border border-white/10 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></span>
          Liquid Staking
        </h2>
        <Tooltip content="Annual Percentage Yield (APY) is dynamic and changes based on total network staking participation and transaction fees." position="left">
          <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded border border-neon-green/20">
            APY: 14.2%
          </span>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Tooltip content="Real-time rewards accruing every second based on your staked amount.">
          <div className="bg-highlight/50 p-4 rounded-lg border-l-4 border-neon-green w-full">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Live Rewards</p>
            <div className="text-2xl font-mono text-neon-green font-bold">
              {rewards.toFixed(7)}
            </div>
            <p className="text-xs text-gray-500">$thewclubbiggs/sec</p>
          </div>
        </Tooltip>
        
        <Tooltip content="Total cumulative rewards you have earned since you started staking.">
          <div className="bg-highlight/50 p-4 rounded-lg border-l-4 border-blue-500 w-full">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Total Earned</p>
            <div className="text-2xl font-mono text-white font-bold">
              {totalEarned.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">$thewclubbiggs</p>
          </div>
        </Tooltip>

        <div className="bg-highlight/50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Participants</p>
          <div className="text-2xl font-mono text-white font-bold">
            1,249
          </div>
          <p className="text-xs text-gray-500">Stakers</p>
        </div>
      </div>

      <div className="bg-black/40 rounded-lg p-4 mb-4 border border-white/5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Your Stake</span>
          <span className="font-bold">{isStaked ? '10,000' : '0'} $thewclubbiggs</span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-neon-green h-full transition-all duration-1000" 
            style={{ width: isStaked ? '75%' : '0%' }}
          ></div>
        </div>
        <div className="mt-2 text-right">
           <Tooltip content="Rewards are automatically added to your stake, compounding your interest without needing to claim manually." position="top">
              <span className="text-xs text-neon-green hover:underline decoration-dotted cursor-help">
                Active Liquid Staking (Compounding Automatically)
              </span>
           </Tooltip>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleStake}
          className="flex-1 bg-neon-green text-black font-bold py-3 rounded hover:bg-green-400 transition"
        >
          Stake More
        </button>
        <button 
          onClick={handleUnstake}
          className="flex-1 bg-gray-800 text-white font-bold py-3 rounded hover:bg-gray-700 transition"
        >
          Unstake
        </button>
      </div>
    </div>
  );
};