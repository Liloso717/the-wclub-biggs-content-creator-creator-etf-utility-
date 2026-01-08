import React, { useState } from 'react';
import { MOCK_TIPS } from '../constants';
import { BaseProps } from '../types';

export const TipJar: React.FC<BaseProps> = ({ onInteract, walletConnected }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSendTip = () => {
    if(!walletConnected) {
       onInteract('error', 'Connect Wallet', 'You must connect your wallet to send tips.');
       return;
    }
    if(!recipient || !amount) {
      onInteract('info', 'Missing Fields', 'Please enter a recipient and amount.');
      return;
    }
    onInteract('loading', 'Sending Tip...', 'Transferring funds.');
    setTimeout(() => {
      onInteract('success', 'Tip Sent!', `Sent ${amount} to ${recipient}`);
      setAmount('');
      setRecipient('');
    }, 1500);
  }

  return (
    <div className="bg-card-bg border border-white/5 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
          <span className="text-yellow-400 text-2xl">🍯</span> Tip Jar
        </h2>
        <p className="text-sm text-gray-400">Send $thewclubbiggs to other community members.</p>
      </div>
      
      <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-black/20">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recipient</label>
          <input 
            type="text" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="@username or 0x..." 
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount</label>
          <div className="relative">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" 
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition pr-32"
            />
            <span className="absolute right-3 top-3 text-xs text-gray-500 font-bold bg-white/10 px-2 py-0.5 rounded">
              $thewclubbiggs
            </span>
          </div>
        </div>
        <button 
          onClick={handleSendTip}
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20"
        >
          Send Tip
        </button>
      </div>

      <div className="flex-1 bg-highlight/30 p-4 overflow-y-auto max-h-[300px]">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Recent Tips</h3>
        <div className="space-y-3">
          {MOCK_TIPS.map(tip => (
            <div key={tip.id} className="flex gap-3 items-start p-3 bg-card-bg rounded-lg border border-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-black text-xs">
                {tip.from.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-white font-bold">{tip.from} <span className="text-gray-500 font-normal">tipped</span> {tip.to}</p>
                  <span className="text-xs text-gray-600">{tip.timestamp}</span>
                </div>
                <p className="text-yellow-400 font-mono text-sm font-bold">+{tip.amount} $thewclubbiggs</p>
                {tip.message && <p className="text-xs text-gray-400 mt-1">"{tip.message}"</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};