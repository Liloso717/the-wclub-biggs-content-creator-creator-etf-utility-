import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { Flywheel } from './components/Flywheel';
import { StakingDashboard } from './components/StakingDashboard';
import { PredictionMarket } from './components/PredictionMarket';
import { BurnAuction } from './components/BurnAuction';
import { TaskBoard } from './components/TaskBoard';
import { LearnToEarn } from './components/LearnToEarn';
import { DeFiPanel } from './components/DeFiPanel';
import { SlotWinnerBanner } from './components/SlotWinnerBanner';
import { TipJar } from './components/TipJar';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { ToastContainer } from './components/Toast';
import { LINKS } from './constants';
import { Notification, NotificationType } from './types';
import { 
  Home, 
  Activity, 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign,
  Menu,
  X as XIcon,
  Twitter,
  Youtube,
  ShoppingBag,
  Trophy,
  Wallet,
  Loader2
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'earn' | 'play' | 'defi' | 'leaderboard'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Simulated Wallet State
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const triggerNotification = (type: NotificationType, message: string, subMessage?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message, subMessage }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const connectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsWalletConnected(true);
      triggerNotification('success', 'Wallet Connected', '0x123...89EF is now active');
    }, 1500);
  };

  // Props to pass to interactive components
  const interactiveProps = {
    onInteract: triggerNotification,
    walletConnected: isWalletConnected
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="animate-in fade-in duration-500">
            {/* Slot Winner Banner - Top of Main Page */}
            <SlotWinnerBanner />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Flywheel />
                <StakingDashboard {...interactiveProps} />
              </div>
              <div className="space-y-6">
                 <BurnAuction {...interactiveProps} />
                 <div className="bg-card-bg p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold mb-4">Social Hub</h3>
                    <div className="flex flex-wrap gap-4">
                      <a href={LINKS.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white"><Twitter size={20} /> X (Twitter)</a>
                      <a href={LINKS.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white">TikTok</a>
                      <a href={LINKS.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white"><Youtube size={20} /> YouTube</a>
                      <a href={LINKS.zoraProfile} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white">Zora</a>
                      <a href={LINKS.merch} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-neon-green"><ShoppingBag size={20} /> Merch Store</a>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'earn':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
             <div className="lg:col-span-2 space-y-6">
               <TaskBoard {...interactiveProps} />
             </div>
             <div className="space-y-6">
               <LearnToEarn />
               <TipJar {...interactiveProps} />
             </div>
          </div>
        );
      case 'play':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <PredictionMarket {...interactiveProps} />
            <BurnAuction {...interactiveProps} />
          </div>
        );
      case 'defi':
        return (
          <div className="animate-in fade-in duration-500">
            <DeFiPanel {...interactiveProps} />
            <div className="mt-8">
              <StakingDashboard {...interactiveProps} />
            </div>
          </div>
        );
      case 'leaderboard':
        return (
          <div className="animate-in fade-in duration-500">
            <LeaderboardPanel />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-neon-green selection:text-black">
        <ToastContainer notifications={notifications} removeNotification={removeNotification} />
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-50">
          <div className="font-bold text-xl tracking-tighter text-neon-green">$thewclubbiggs</div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <XIcon /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 z-40 border-b border-white/10 p-4 space-y-4">
             {['dashboard', 'earn', 'play', 'defi', 'leaderboard'].map((tab) => (
               <button 
                key={tab}
                onClick={() => { setActiveTab(tab as any); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 px-4 uppercase font-bold hover:text-neon-green"
               >
                 {tab}
               </button>
             ))}
             <button 
                onClick={() => {
                  if(!isWalletConnected) connectWallet();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-neon-green text-black font-bold py-3 rounded mt-4"
              >
                {isConnecting ? 'Connecting...' : isWalletConnected ? '0x123...89EF' : 'Connect Wallet'}
              </button>
          </div>
        )}

        <div className="flex h-screen overflow-hidden">
          {/* Sidebar (Desktop) */}
          <div className="hidden md:flex flex-col w-64 border-r border-white/10 bg-card-bg/50 p-6 space-y-8">
            <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">
              THE W CLUB
            </div>
            
            <nav className="flex-1 space-y-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Home size={20} /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('earn')}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'earn' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Users size={20} /> Quests & Earn
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'leaderboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Trophy size={20} /> Leaderboard
              </button>
              <button 
                onClick={() => setActiveTab('play')}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'play' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Activity size={20} /> Prediction & Games
              </button>
              <button 
                onClick={() => setActiveTab('defi')}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'defi' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <DollarSign size={20} /> Trade & DeFi
              </button>
            </nav>

            <div className="pt-6 border-t border-white/10">
               <button 
                 onClick={connectWallet}
                 disabled={isWalletConnected || isConnecting}
                 className={`w-full font-bold py-3 rounded transition shadow-[0_0_15px_rgba(57,255,20,0.4)] flex items-center justify-center gap-2 ${
                   isWalletConnected 
                   ? 'bg-black border border-neon-green text-neon-green' 
                   : 'bg-neon-green text-black hover:bg-green-400'
                 }`}
               >
                 {isConnecting ? <Loader2 className="animate-spin" size={20} /> : <Wallet size={20} />}
                 {isConnecting ? 'Connecting...' : isWalletConnected ? '0x123...89EF' : 'Connect Wallet'}
               </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto relative">
            <div className="p-4 md:p-8 max-w-7xl mx-auto pb-20">
               {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;