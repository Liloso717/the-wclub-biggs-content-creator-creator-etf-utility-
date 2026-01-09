import React, { useState, useEffect } from 'react';
import { BaseProps } from '../../types';
import { X, Circle, RotateCcw, Trophy, Frown, MinusCircle } from 'lucide-react';

export const TicTacToe: React.FC<BaseProps> = ({ onInteract, walletConnected }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost' | 'draw'>('idle');
  const [bet, setBet] = useState(50);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const WIN_CONDITIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const startGame = () => {
    if (!walletConnected) {
      onInteract('error', 'Connect Wallet', 'Please connect wallet to play.');
      return;
    }
    setBoard(Array(9).fill(null));
    setGameState('playing');
    setIsPlayerTurn(true);
    setWinningLine(null);
    onInteract('info', 'Game Started', `Bet placed: ${bet} $thewclubbiggs`);
  };

  const checkWinner = (squares: any[]) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [a, b, c] = WIN_CONDITIONS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: WIN_CONDITIONS[i] };
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (gameState !== 'playing' || board[index] || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      endGame(result.winner, result.line);
    } else if (!newBoard.includes(null)) {
      setGameState('draw');
      onInteract('info', 'Draw!', 'Your bet has been returned.');
    } else {
      setIsPlayerTurn(false);
    }
  };

  // CPU Move
  useEffect(() => {
    if (!isPlayerTurn && gameState === 'playing') {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (emptyIndices.length > 0) {
          const rand = emptyIndices[Math.floor(Math.random() * emptyIndices.length)] as number;
          const newBoard = [...board];
          newBoard[rand] = 'O';
          setBoard(newBoard);
          
          const result = checkWinner(newBoard);
          if (result) {
            endGame(result.winner, result.line);
          } else if (!newBoard.includes(null)) {
             setGameState('draw');
             onInteract('info', 'Draw!', 'Your bet has been returned.');
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 500 + Math.random() * 500); // Random delay
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameState, board]);

  const endGame = (winner: string, line: number[]) => {
    setWinningLine(line);
    if (winner === 'X') {
      setGameState('won');
      onInteract('success', 'You Won!', `You won ${bet * 2} $thewclubbiggs!`);
    } else {
      setGameState('lost');
      onInteract('error', 'You Lost', `Better luck next time.`);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-card-bg border border-white/10 rounded-xl relative overflow-hidden">
       <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
         Tic Tac Toe <span className="text-xs text-gray-500 font-normal">(vs CPU)</span>
       </h3>

       {gameState === 'idle' ? (
         <div className="text-center space-y-4">
            <p className="text-gray-400">Place your bet to start playing.</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold">Bet:</span>
              <input 
                type="number" 
                value={bet} 
                onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
                className="bg-black border border-white/20 rounded px-2 py-1 w-24 text-center text-white"
              />
              <span className="text-xs text-neon-green">$thewclubbiggs</span>
            </div>
            <button 
              onClick={startGame}
              className="bg-neon-green text-black font-bold px-8 py-2 rounded-full hover:bg-green-400 transition shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            >
              Start Game
            </button>
         </div>
       ) : (
         <div className="space-y-6 w-full max-w-xs">
            {/* Result Overlay / Display */}
            {gameState !== 'playing' && (
               <div className="bg-black/80 backdrop-blur-sm absolute inset-0 z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <div className="text-center p-6 bg-card-bg border border-white/20 rounded-xl shadow-2xl transform transition-all scale-100">
                     {gameState === 'won' && (
                        <>
                          <Trophy size={48} className="text-neon-green mx-auto mb-2 animate-bounce" />
                          <h2 className="text-3xl font-black text-white italic mb-1 uppercase">Victory!</h2>
                          <p className="text-neon-green font-mono font-bold text-xl mb-4">+{bet * 2} $thewclubbiggs</p>
                        </>
                     )}
                     {gameState === 'lost' && (
                        <>
                          <Frown size={48} className="text-red-500 mx-auto mb-2" />
                          <h2 className="text-3xl font-black text-white italic mb-1 uppercase">Defeat</h2>
                          <p className="text-red-500 font-mono font-bold text-xl mb-4">-{bet} $thewclubbiggs</p>
                        </>
                     )}
                     {gameState === 'draw' && (
                        <>
                          <MinusCircle size={48} className="text-gray-400 mx-auto mb-2" />
                          <h2 className="text-3xl font-black text-white italic mb-1 uppercase">Draw</h2>
                          <p className="text-gray-400 font-mono font-bold text-xl mb-4">Bet Returned</p>
                        </>
                     )}
                     <button 
                       onClick={() => setGameState('idle')}
                       className="bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition flex items-center gap-2 mx-auto"
                     >
                       <RotateCcw size={16} /> Play Again
                     </button>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-3 gap-2 p-2 bg-black/40 rounded-xl border border-white/5">
              {board.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  disabled={!!cell || gameState !== 'playing'}
                  className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-4xl rounded-lg transition-all
                    ${cell === null ? 'bg-white/5 hover:bg-white/10' : 'bg-black/60'}
                    ${winningLine?.includes(i) ? (cell === 'X' ? 'bg-neon-green/20 border border-neon-green' : 'bg-red-500/20 border border-red-500') : ''}
                  `}
                >
                  {cell === 'X' && <X size={48} className="text-neon-green" />}
                  {cell === 'O' && <Circle size={40} className="text-red-500" />}
                </button>
              ))}
            </div>
            
            <div className="text-center h-6">
              {gameState === 'playing' && (
                <p className="text-gray-400 animate-pulse text-sm font-bold uppercase tracking-wider">
                  {isPlayerTurn ? "Your Turn" : "CPU Thinking..."}
                </p>
              )}
            </div>
         </div>
       )}
    </div>
  );
};