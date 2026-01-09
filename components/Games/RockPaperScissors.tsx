import React, { useState } from 'react';
import { BaseProps } from '../../types';
import { Hand, Scissors, Scroll } from 'lucide-react'; 

export const RockPaperScissors: React.FC<BaseProps> = ({ onInteract, walletConnected }) => {
  const [bet, setBet] = useState(50);
  const [gameState, setGameState] = useState<'idle' | 'result'>('idle');
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [cpuChoice, setCpuChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');

  const play = (choice: string) => {
    if (!walletConnected) {
      onInteract('error', 'Connect Wallet', 'Please connect wallet to play.');
      return;
    }

    onInteract('loading', 'Throwing...', '');
    setGameState('result'); 
    
    setTimeout(() => {
        const options = ['rock', 'paper', 'scissors'];
        const cpu = options[Math.floor(Math.random() * options.length)];
        
        setUserChoice(choice);
        setCpuChoice(cpu);

        let res = '';
        if (choice === cpu) res = 'draw';
        else if (
          (choice === 'rock' && cpu === 'scissors') ||
          (choice === 'paper' && cpu === 'rock') ||
          (choice === 'scissors' && cpu === 'paper')
        ) {
          res = 'win';
          onInteract('success', 'You Won!', `You won ${bet * 2} $thewclubbiggs`);
        } else {
          res = 'lose';
          onInteract('error', 'You Lost', `Better luck next time.`);
        }
        setResult(res);
    }, 1000);
  };

  const reset = () => {
    setGameState('idle');
    setUserChoice(null);
    setCpuChoice(null);
    setResult('');
  };

  const getIcon = (c: string) => {
      switch(c) {
          case 'rock': return <Hand size={40} className="rotate-90" />; 
          case 'paper': return <Scroll size={40} />;
          case 'scissors': return <Scissors size={40} />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-card-bg border border-white/10 rounded-xl">
       <h3 className="text-2xl font-bold mb-4">Rock Paper Scissors</h3>
       
       <div className="mb-6 flex items-center gap-2">
          <span className="font-bold">Bet:</span>
          <input 
            type="number" 
            value={bet} 
            onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
            disabled={gameState !== 'idle'}
            className="bg-black border border-white/20 rounded px-2 py-1 w-24 text-center disabled:opacity-50 text-white"
          />
          <span className="text-xs text-neon-green">$thewclubbiggs</span>
       </div>

       {gameState === 'idle' ? (
         <div className="flex gap-4">
            <button onClick={() => play('rock')} className="p-6 bg-white/5 hover:bg-neon-green/20 border border-white/10 hover:border-neon-green rounded-xl transition flex flex-col items-center gap-2 group">
               <Hand size={40} className="group-hover:text-neon-green rotate-90" />
               <span className="font-bold text-sm">ROCK</span>
            </button>
            <button onClick={() => play('paper')} className="p-6 bg-white/5 hover:bg-neon-green/20 border border-white/10 hover:border-neon-green rounded-xl transition flex flex-col items-center gap-2 group">
               <Scroll size={40} className="group-hover:text-neon-green" />
               <span className="font-bold text-sm">PAPER</span>
            </button>
            <button onClick={() => play('scissors')} className="p-6 bg-white/5 hover:bg-neon-green/20 border border-white/10 hover:border-neon-green rounded-xl transition flex flex-col items-center gap-2 group">
               <Scissors size={40} className="group-hover:text-neon-green" />
               <span className="font-bold text-sm">SCISSORS</span>
            </button>
         </div>
       ) : (
         <div className="text-center w-full">
            {userChoice && cpuChoice ? (
                <div className="flex justify-between items-center w-full max-w-md mx-auto mb-6">
                    <div className="flex flex-col items-center animate-in slide-in-from-left">
                        <span className="text-gray-400 text-sm mb-2">You</span>
                        <div className={`p-6 rounded-xl border-4 ${result === 'win' ? 'border-neon-green bg-neon-green/10' : 'border-white/10 bg-white/5'}`}>
                           {getIcon(userChoice)}
                        </div>
                    </div>
                    
                    <div className="text-2xl font-black italic">VS</div>

                    <div className="flex flex-col items-center animate-in slide-in-from-right">
                        <span className="text-gray-400 text-sm mb-2">CPU</span>
                        <div className={`p-6 rounded-xl border-4 ${result === 'lose' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
                           {getIcon(cpuChoice)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-32 flex items-center justify-center">
                    <span className="animate-pulse text-2xl font-bold">VS</span>
                </div>
            )}
            
            {result && (
                <div className="animate-in zoom-in">
                    <h2 className={`text-4xl font-black mb-4 uppercase ${result === 'win' ? 'text-neon-green' : result === 'lose' ? 'text-red-500' : 'text-white'}`}>
                        {result === 'draw' ? 'DRAW' : result === 'win' ? 'VICTORY' : 'DEFEAT'}
                    </h2>
                    <button 
                        onClick={reset}
                        className="bg-white text-black font-bold px-8 py-2 rounded-full hover:bg-gray-200 transition"
                    >
                        Play Again
                    </button>
                </div>
            )}
         </div>
       )}
    </div>
  );
};