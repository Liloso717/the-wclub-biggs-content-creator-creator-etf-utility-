import React from 'react';
import { 
  LEADERBOARD_BIGGS, 
  LEADERBOARD_INDEX, 
  LEADERBOARD_DURATION, 
  LEADERBOARD_VOLUME,
  TOP_BURNERS 
} from '../constants';
import { Trophy, Timer, BarChart3, Wallet, Flame } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Burner } from '../types';

interface LeaderboardSectionProps {
  title: string;
  icon: React.ReactNode;
  data: any[]; // Accepts generic data structure for rendering flexibility
  color: string;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ title, icon, data, color }) => (
  <div className={`bg-card-bg border border-white/5 rounded-xl overflow-hidden hover:border-${color}/30 transition group h-full`}>
    <div className={`p-4 border-b border-white/5 bg-gradient-to-r from-${color}/10 to-transparent flex items-center gap-3`}>
      <div className={`text-${color}`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
    </div>
    <div className="p-2">
      {data.map((item, index) => {
        // Handle different data shapes (Standard Leaderboard vs Burner)
        const rank = item.rank;
        const username = item.username;
        const value = item.value || (item.amount ? item.amount.toLocaleString() + ' 🔥' : '');
        const detail = item.detail || 'Total Burned';

        return (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition mb-1 last:mb-0"
          >
            <div className="flex items-center gap-4">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                rank === 1 ? 'bg-yellow-500 text-black' : 
                rank === 2 ? 'bg-gray-400 text-black' : 
                rank === 3 ? 'bg-orange-700 text-white' : 
                'bg-white/10 text-gray-400'
              }`}>
                {rank}
              </span>
              <div>
                <p className={`font-bold text-sm ${rank <= 3 ? 'text-white' : 'text-gray-400'}`}>
                  @{username}
                </p>
                <p className="text-[10px] text-gray-500">{detail}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-mono text-sm font-bold text-${color}`}>
                {value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const LeaderboardPanel: React.FC<{ burners?: Burner[] }> = ({ burners }) => {
  const currentBurners = burners || TOP_BURNERS;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500 mb-2">
          Hall of Fame
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Recognizing the top holders, traders, and promoters powering the $thewclubbiggs ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Tooltip content="Users holding the largest amount of $thewclubbiggs tokens." position="top">
          <div>
            <LeaderboardSection 
              title="Top $thewclubbiggs Holders" 
              icon={<Wallet />} 
              data={LEADERBOARD_BIGGS} 
              color="neon-green" 
            />
          </div>
        </Tooltip>

        <Tooltip content="Users holding the most $thewclstrat index tokens." position="top">
          <div>
            <LeaderboardSection 
              title="Top $thewclstrat Holders" 
              icon={<BarChart3 />} 
              data={LEADERBOARD_INDEX} 
              color="blue-400" 
            />
          </div>
        </Tooltip>

        <Tooltip content="Wallets that have held their tokens for the longest duration without selling." position="top">
          <div>
            <LeaderboardSection 
              title="Diamond Hands (Longest Held)" 
              icon={<Timer />} 
              data={LEADERBOARD_DURATION} 
              color="purple-400" 
            />
          </div>
        </Tooltip>

        <Tooltip content="Users with the highest trading volume in the last 30 days." position="top">
          <div>
            <LeaderboardSection 
              title="Top Volume Traders" 
              icon={<Trophy />} 
              data={LEADERBOARD_VOLUME} 
              color="orange-400" 
            />
          </div>
        </Tooltip>

        <Tooltip content="Users who have burned the most tokens to promote their handle in the auction slot." position="top">
          <div className="md:col-span-2 lg:col-span-2">
            <LeaderboardSection 
              title="Top Promoters (Most Burned)" 
              icon={<Flame />} 
              data={currentBurners} 
              color="red-500" 
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};