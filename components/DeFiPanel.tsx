import React, { useState } from 'react';
import { LINKS } from '../constants';
import { BaseProps } from '../types';
import { ArrowDownUp, Wallet, ExternalLink, Lock, Unlock, ArrowUpCircle, ArrowDownCircle, AlertTriangle, X, Settings } from 'lucide-react';

export const DeFiPanel: React.FC<BaseProps> = ({ onInteract, walletConnected }) => {
  const [activeMode, setActiveMode] = useState<'swap' | 'vault'>('swap');
  const [swapSide, setSwapSide] = useState<'buy' | 'sell'>('buy');
  const [vaultAction, setVaultAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  
  // New UI State
  const [slippage, setSlippage] = useState('0.5');
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    content: React.ReactNode;
    onConfirm: () => void;
  } | null>(null);

  // Mock Balances
  const ETH_BALANCE = 1.45;
  const BIGGS_BALANCE = 12500;
  const USDC_BALANCE = 5000;
  const INDEX_BALANCE = 500;

  const handleMax = () => {
    if (!walletConnected) {
      onInteract('info', 'Connect Wallet', 'Please connect your wallet to check balances.');
      return;
    }
    if (activeMode === 'swap') {
      if (swapSide === 'buy') setAmount((ETH_BALANCE - 0.01).toFixed(4)); // Leave gas
      else setAmount(BIGGS_BALANCE.toString());
    } else {
       if (vaultAction === 'deposit') setAmount(USDC_BALANCE.toString());
       else setAmount(INDEX_BALANCE.toString());
    }
  };

  const executeTransaction = (actionName: string, displayAmount: string) => {
    onInteract('loading', 'Processing Transaction...', `Executing ${actionName}...`);
    setTimeout(() => {
      onInteract('success', 'Transaction Confirmed', `${actionName} of ${displayAmount} successful.`);
      setShowModal(false);
      setAmount('');
    }, 2000);
  };

  const openVaultConfirmation = () => {
    if (!walletConnected) return onInteract('error', 'Wallet Not Connected', 'Please connect wallet.');
    if (!amount) return onInteract('info', 'Enter Amount', 'Please enter a valid amount.');

    const isDeposit = vaultAction === 'deposit';
    const asset = isDeposit ? 'USDC' : '$thewclstrat';
    
    setModalConfig({
      title: `Confirm ${isDeposit ? 'Deposit' : 'Withdrawal'}`,
      content: (
        <div className="space-y-4 text-sm">
           <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
             <span className="text-gray-400">Amount</span>
             <span className="font-bold text-xl text-white">{amount} <span className="text-xs text-gray-500">{asset}</span></span>
           </div>
           
           <div className="space-y-2">
             <div className="flex justify-between">
               <span className="text-gray-400">Network Fee</span>
               <span className="font-bold text-white">~$2.50</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-400">Est. Time</span>
               <span className="font-bold text-green-400">&lt; 30s</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-400">Rate</span>
               <span className="font-bold text-white">1 $thewclstrat = 14 Assets</span>
             </div>
           </div>

           <div className="bg-blue-900/20 p-3 rounded border border-blue-500/20 flex gap-2 items-start">
             <InfoIcon />
             <p className="text-blue-300 text-xs">
               {isDeposit 
                 ? "Your assets will be automatically staked into the Glider.fi vault smart contract." 
                 : "Redeeming will burn your index tokens and return the underlying assets to your wallet."}
             </p>
           </div>
        </div>
      ),
      onConfirm: () => executeTransaction(isDeposit ? 'Deposit' : 'Withdrawal', `${amount} ${asset}`)
    });
    setShowModal(true);
  };

  const openLendingConfirmation = (actionType: string) => {
    if (!walletConnected) return onInteract('error', 'Wallet Not Connected', 'Please connect wallet.');
    
    // For lending actions, we use a default mock amount if the main input isn't being used for this specific action context
    // In a full app, each action would likely have its own input modal. We'll simulate '1000' if no amount is set globally.
    const useAmount = amount || '1000';
    
    // Mock Health Factor Logic
    const currentHealth = 1.8;
    const isRisk = actionType === 'Borrow' || actionType === 'Withdraw';
    const newHealth = isRisk ? 1.55 : 2.10;
    
    setModalConfig({
      title: `Confirm ${actionType}`,
      content: (
        <div className="space-y-4 text-sm">
           <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
             <span className="text-gray-400">Action Amount</span>
             <span className="font-bold text-xl text-white">{useAmount} <span className="text-xs text-gray-500">$thewclubbiggs</span></span>
           </div>

           <div className="h-px bg-white/10 my-2"></div>

           <div className="space-y-2">
             <div className="flex justify-between items-center">
               <span className="text-gray-400">Current Health Factor</span>
               <span className="font-bold text-green-400">{currentHealth.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-400">New Health Factor</span>
               <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs line-through">{currentHealth.toFixed(2)}</span>
                  <span className={`font-bold ${newHealth < 1.1 ? 'text-red-500' : newHealth < 1.6 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {newHealth.toFixed(2)}
                  </span>
               </div>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-400">Liquidation Threshold</span>
               <span className="font-bold text-red-400">1.00</span>
             </div>
           </div>

           {isRisk && (
              <div className="bg-red-900/20 p-3 rounded border border-red-500/30 flex gap-2 items-start">
                 <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                 <p className="text-red-300 text-xs">
                   This action reduces your Health Factor. If it drops below 1.00, your collateral may be liquidated.
                 </p>
              </div>
           )}
        </div>
      ),
      onConfirm: () => executeTransaction(actionType, `${useAmount} $thewclubbiggs`)
    });
    setShowModal(true);
  };

  const handleSwap = () => {
    if (!walletConnected) return onInteract('error', 'Wallet Not Connected', 'Please connect wallet.');
    if (!amount) return onInteract('info', 'Enter Amount', 'Please enter a valid amount.');
    
    // Swap doesn't strictly need a complex modal per prompt (only vault/lending specified), 
    // but we execute immediately for speed as per typical DEX UX, or we could add one.
    // I'll stick to immediate execution with Toast for Swap to keep it fast, 
    // unless user wants it, but prompt specified modals for Vault/Index & Lending.
    
    executeTransaction(swapSide === 'buy' ? 'Buy' : 'Sell', amount);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interactive Trading Panel */}
        <div className="bg-card-bg border border-white/10 rounded-xl p-6 flex flex-col relative z-0">
          <div className="flex bg-black/40 rounded-lg p-1 mb-6 border border-white/5">
            <button 
              onClick={() => setActiveMode('swap')}
              className={`flex-1 py-2 text-sm font-bold rounded transition ${activeMode === 'swap' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Swap
            </button>
            <button 
              onClick={() => setActiveMode('vault')}
              className={`flex-1 py-2 text-sm font-bold rounded transition ${activeMode === 'vault' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Vault / Index
            </button>
          </div>

          {activeMode === 'swap' ? (
            <div className="flex-1 flex flex-col space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-white">Trade $thewclubbiggs</h3>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setSwapSide('buy')} 
                      className={`px-3 py-1 rounded text-xs font-bold transition ${swapSide === 'buy' ? 'bg-neon-green text-black' : 'bg-gray-800 text-gray-400'}`}
                    >
                      Buy
                    </button>
                    <button 
                      onClick={() => setSwapSide('sell')} 
                      className={`px-3 py-1 rounded text-xs font-bold transition ${swapSide === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                      Sell
                    </button>
                 </div>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/10 space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Pay</span>
                    <span>Balance: {walletConnected ? '1.45 ETH' : '--'}</span>
                  </div>
                  <div className="flex items-center gap-3 relative">
                     <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0" 
                        className="bg-transparent text-2xl font-bold text-white w-full outline-none pr-20"
                     />
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <button 
                          onClick={handleMax}
                          className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-neon-green px-2 py-1 rounded uppercase transition"
                       >
                         Max
                       </button>
                       <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded font-bold text-sm">ETH</span>
                     </div>
                  </div>
                </div>
                
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-card-bg p-1 rounded-full border border-white/10">
                     <ArrowDownUp size={16} className="text-gray-400" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Receive</span>
                    <span>Balance: {walletConnected ? '12,500 $thewclubbiggs' : '--'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <input 
                        type="text" 
                        readOnly 
                        value={amount ? (parseFloat(amount) * 450000).toLocaleString() : '0.0'} 
                        className="bg-transparent text-2xl font-bold text-neon-green w-full outline-none"
                     />
                     <span className="bg-neon-green/20 text-neon-green px-2 py-1 rounded font-bold text-sm text-xs md:text-sm whitespace-nowrap">$thewclubbiggs</span>
                  </div>
                </div>
              </div>
              
              {/* Slippage Settings */}
              <div className="flex justify-between items-center text-xs px-1">
                 <div className="flex items-center gap-1 text-gray-500">
                    <Settings size={12} />
                    <span>Slippage Tolerance</span>
                 </div>
                 <div className="flex gap-1 bg-black/40 rounded p-0.5 border border-white/5">
                    {['0.1', '0.5', '1.0'].map(val => (
                       <button
                         key={val}
                         onClick={() => setSlippage(val)}
                         className={`px-2 py-0.5 rounded transition ${slippage === val ? 'bg-white/20 text-white font-bold' : 'text-gray-500 hover:text-white'}`}
                       >
                         {val}%
                       </button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={handleSwap}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition transform active:scale-95 ${
                  swapSide === 'buy' 
                    ? 'bg-neon-green text-black hover:bg-green-400' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {walletConnected ? (swapSide === 'buy' ? 'Swap ETH to $thewclubbiggs' : 'Swap $thewclubbiggs to ETH') : 'Connect Wallet'}
              </button>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 justify-center">
                <a href={LINKS.phantom} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition">
                  <ExternalLink size={12} /> Phantom
                </a>
                <a href={LINKS.zoraCoin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition">
                  <ExternalLink size={12} /> Zora
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-4 animate-in fade-in">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-white">$thewclstrat ETF Vault</h3>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setVaultAction('deposit')} 
                      className={`px-3 py-1 rounded text-xs font-bold transition ${vaultAction === 'deposit' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                      Deposit
                    </button>
                    <button 
                      onClick={() => setVaultAction('withdraw')} 
                      className={`px-3 py-1 rounded text-xs font-bold transition ${vaultAction === 'withdraw' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                      Withdraw
                    </button>
                 </div>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-white/10 flex-1 flex flex-col justify-center items-center text-center">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    {vaultAction === 'deposit' ? <Lock size={32} /> : <Unlock size={32} />}
                 </div>
                 <p className="text-gray-300 text-sm mb-4 max-w-[80%]">
                   {vaultAction === 'deposit' 
                     ? 'Deposit USDC or ETH to automatically mint $thewclstrat index tokens via Glider.fi.' 
                     : 'Burn $thewclstrat to redeem the underlying 14 assets directly to your wallet.'}
                 </p>
                 
                 <div className="w-full relative mb-4">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00" 
                        className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-blue-500 outline-none pr-20"
                     />
                     <div className="absolute right-3 top-3 flex items-center gap-2">
                       <button 
                          onClick={handleMax}
                          className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded uppercase transition"
                       >
                         Max
                       </button>
                       <span className="text-xs font-bold text-gray-500">
                         {vaultAction === 'deposit' ? 'USDC' : '$thewclstrat'}
                       </span>
                     </div>
                 </div>

                 <button 
                    onClick={openVaultConfirmation}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition"
                 >
                   {walletConnected 
                      ? (vaultAction === 'deposit' ? 'Deposit to Index' : 'Redeem Assets') 
                      : 'Connect Wallet'}
                 </button>
              </div>
              <div className="text-center">
                <a href={LINKS.glider} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-white underline">View Portfolio on Glider.fi</a>
              </div>
            </div>
          )}
        </div>

        {/* Lending/Borrowing Panel */}
        <div className="bg-card-bg border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1">BETA</div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Wallet className="text-gray-400" size={20} /> Lending Market
          </h2>
          <div className="space-y-6 flex-1">
            {/* Supply Section */}
            <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:bg-black/40 transition">
               <div className="flex justify-between items-start mb-3">
                 <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <ArrowUpCircle size={16} className="text-green-400" /> Supply
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">Earn Yield on $thewclubbiggs</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-gray-500">APY</p>
                    <p className="text-lg font-bold text-green-400">8.5%</p>
                 </div>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => openLendingConfirmation('Deposit')}
                    className="flex-1 bg-green-900/20 text-green-400 border border-green-500/20 py-2 rounded text-sm font-bold hover:bg-green-500 hover:text-black transition"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => openLendingConfirmation('Withdraw')}
                    className="flex-1 bg-gray-800 text-gray-300 border border-white/10 py-2 rounded text-sm font-bold hover:bg-white hover:text-black transition"
                  >
                    Withdraw
                  </button>
               </div>
            </div>

            {/* Borrow Section */}
            <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:bg-black/40 transition">
               <div className="flex justify-between items-start mb-3">
                 <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <ArrowDownCircle size={16} className="text-orange-400" /> Borrow
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">Leverage $thewclubbiggs</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-gray-500">APR</p>
                    <p className="text-lg font-bold text-orange-400">10.2%</p>
                 </div>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => openLendingConfirmation('Borrow')}
                    className="flex-1 bg-orange-900/20 text-orange-400 border border-orange-500/20 py-2 rounded text-sm font-bold hover:bg-orange-500 hover:text-white transition"
                  >
                    Borrow
                  </button>
                  <button 
                    onClick={() => openLendingConfirmation('Repay')}
                    className="flex-1 bg-gray-800 text-gray-300 border border-white/10 py-2 rounded text-sm font-bold hover:bg-white hover:text-black transition"
                  >
                    Repay
                  </button>
               </div>
            </div>
            
            <div className="mt-auto p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
               <h4 className="text-red-400 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> Risk Warning
               </h4>
               <p className="text-xs text-gray-400 leading-relaxed">
                  Liquidation risk is high for small-cap assets. Leverage trading involves significant risk of loss. Ensure you understand the protocol parameters before supplying assets.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && modalConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-card-bg border border-white/20 rounded-xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                 <h3 className="font-bold text-lg text-white">{modalConfig.title}</h3>
                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition">
                   <X size={20}/>
                 </button>
              </div>
              <div className="p-6">
                 {modalConfig.content}
                 <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setShowModal(false)} 
                      className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={modalConfig.onConfirm} 
                      className="flex-1 bg-neon-green text-black py-3 rounded-lg font-bold hover:bg-green-400 transition"
                    >
                      Confirm
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);
