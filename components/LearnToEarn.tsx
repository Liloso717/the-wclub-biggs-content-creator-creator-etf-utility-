import React from 'react';

export const LearnToEarn: React.FC = () => {
  return (
    <div className="bg-card-bg rounded-xl border border-white/5 p-6">
      <h2 className="text-xl font-bold mb-4">Learn to Earn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "What is the Creator Index?", reward: "100 $thewclubbiggs", level: "Beginner" },
          { title: "How Staking Works", reward: "150 $thewclubbiggs", level: "Intermediate" },
          { title: "Advanced Bagworking Strategies", reward: "300 $thewclubbiggs", level: "Advanced" },
          { title: "Understanding The Flywheel", reward: "200 $thewclubbiggs", level: "Expert" }
        ].map((module, i) => (
          <div key={i} className="group relative overflow-hidden rounded-lg bg-highlight/30 hover:bg-highlight/50 transition cursor-pointer p-4 border border-white/5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-gray-500 uppercase">{module.level}</span>
              <span className="text-xs bg-neon-green text-black px-2 py-0.5 rounded font-bold">{module.reward}</span>
            </div>
            <h3 className="font-bold text-lg mb-4 group-hover:text-neon-green transition-colors">{module.title}</h3>
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
               <div className="bg-blue-500 h-full w-0 group-hover:w-full transition-all duration-700"></div>
            </div>
            <div className="mt-2 text-xs text-gray-400 text-right group-hover:text-white">Start Module &rarr;</div>
          </div>
        ))}
      </div>
    </div>
  );
};