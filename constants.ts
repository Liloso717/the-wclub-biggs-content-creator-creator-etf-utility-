import { Asset, Market, OpinionMarket, Task, Burner, Tip, LeaderboardItem } from './types';

export const ASSETS: Asset[] = [
  { ticker: '$thewclstrat', name: '$thewclstrat Index', isCore: true, color: '#FFFFFF', description: 'The central index fund token representing the entire ecosystem.' },
  { ticker: 'WCLUBBIGGS', name: 'The W Club Biggs', isCore: true, color: '#39FF14', description: 'Core utility token driving rewards and governing the index.' },
  { ticker: 'LINK', name: 'Chainlink', color: '#2A5ADA', description: 'Decentralized oracle network connecting smart contracts to real-world data.' },
  { ticker: 'BTC', name: 'Bitcoin', color: '#F7931A', description: 'The original decentralized cryptocurrency and digital store of value.' },
  { ticker: 'ETH', name: 'Ethereum', color: '#627EEA', description: 'The leading programmable blockchain and smart contract platform.' },
  { ticker: 'SOL', name: 'Solana', color: '#14F195', description: 'High-performance blockchain optimizing for speed and low costs.' },
  { ticker: 'XRP', name: 'XRP', color: '#1BA4C8', description: 'Digital asset built for global payments and liquidity.' },
  { ticker: 'MORPHO', name: 'Morpho', color: '#00C8AA', description: 'Decentralized lending protocol optimizing yields via P2P matching.' },
  { ticker: 'VIRTUAL', name: 'Virtuals', color: '#4ADE80', description: 'Protocol for co-owning and interacting with AI agents.' },
  { ticker: 'BANKR', name: 'Bankr Coin', color: '#22C55E', description: 'Decentralized banking and yield aggregator protocol.' },
  { ticker: 'DRB', name: 'DebtReliefBot', color: '#FF3366', description: 'Automated debt management and relief execution bot.' },
  { ticker: '$I', name: 'Indexy', color: '#6366F1', description: 'Automated crypto index fund management protocol.' },
  { ticker: 'CLANKER', name: 'Clanker', color: '#EAB308', description: 'AI-driven trading and arbitrage bot.' },
  { ticker: 'ZORA', name: 'Zora', color: '#00BFFF', description: 'Protocol and marketplace for creating and trading NFTs.' },
  { ticker: '$QR', name: 'QR Coin', color: '#D946EF', description: 'Contract: 0x2b5050F01d64FBb3e4Ac44dc07f0732BFb5ecadF' },
];

export const MOCK_MARKETS: Market[] = [
  { id: '1', question: 'Will next video hit 1M views in 24h?', type: 'content', endsIn: '24h', yesPool: 5400, noPool: 1200, volume: '6.6k $thewclubbiggs' },
  { id: '2', question: 'Subscriber count > 100k by Friday?', type: 'longterm', endsIn: '3d', yesPool: 10000, noPool: 8000, volume: '18k $thewclubbiggs' },
  { id: '3', question: 'Flash: BTC > $100k in next 15 mins?', type: 'flash', endsIn: '12m', yesPool: 500, noPool: 5000, volume: '5.5k $thewclubbiggs' },
];

export const MOCK_OPINION_MARKETS: OpinionMarket[] = [
  { 
    id: 'op1', 
    question: 'Is Base the superior L2 for creators?', 
    description: 'Debate on fees, user experience, and creator tools available on Base vs others.',
    creator: 'BaseGod', 
    creatorAvatarColor: '#0052FF',
    endsIn: '2d 4h', 
    totalPool: 25000, 
    yesPercent: 78, 
    volume: '125k', 
    comments: 42,
    tags: ['Crypto', 'L2', 'Tech'],
    gradient: 'from-blue-600 to-blue-900'
  },
  { 
    id: 'op2', 
    question: 'Should $thewclubbiggs add a burn mechanism?', 
    description: 'Community sentiment on implementing a 1% burn on all transfers.',
    creator: 'TokenomicsWhale', 
    creatorAvatarColor: '#39FF14',
    endsIn: '5h 12m', 
    totalPool: 54000, 
    yesPercent: 45, 
    volume: '300k', 
    comments: 156,
    tags: ['Gov', 'Tokenomics'],
    gradient: 'from-green-600 to-emerald-900'
  },
  { 
    id: 'op3', 
    question: 'Will AI agents replace influencers by 2026?', 
    description: 'Speculation on the rise of Virtuals Protocol and AI-driven content.',
    creator: 'FuturistJane', 
    creatorAvatarColor: '#B026FF',
    endsIn: '6d', 
    totalPool: 12000, 
    yesPercent: 12, 
    volume: '45k', 
    comments: 89,
    tags: ['AI', 'Social', 'Future'],
    gradient: 'from-purple-600 to-pink-900'
  },
  { 
    id: 'op4', 
    question: 'Is current Merch design hype or flop?', 
    description: 'Vote on the new "Laser Eyes" hoodie collection drop.',
    creator: 'FashionMod', 
    creatorAvatarColor: '#FF3366',
    endsIn: '12h', 
    totalPool: 8000, 
    yesPercent: 92, 
    volume: '22k', 
    comments: 34,
    tags: ['Merch', 'Art', 'Vibe'],
    gradient: 'from-red-600 to-orange-900'
  }
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Daily Check-in', reward: '50 $thewclubbiggs', type: 'daily', isCompleted: false },
  { id: '2', title: 'Retweet Pinned Post', reward: '100 $thewclubbiggs', type: 'social', actionUrl: 'https://x.com/thewclubbiggs', isCompleted: false },
  { id: '3', title: 'Hold 1000 $thewclubbiggs for 7 days', reward: '500 $thewclubbiggs', type: 'bagworking', isCompleted: true },
  { id: '4', title: 'Like latest TikTok', reward: '75 $thewclubbiggs', type: 'social', actionUrl: 'https://www.tiktok.com/@thewclubbiggs', isCompleted: false },
  { id: '5', title: 'Refer a friend', reward: '200 $thewclubbiggs', type: 'bagworking', isCompleted: false },
  { id: '6', title: 'Watch my market analysis video', reward: '10 $thewclubbiggs', type: 'community', creator: 'CryptoAnalyst88', isCompleted: false },
  { id: '7', title: 'Follow my art page on Zora', reward: '5 $thewclubbiggs', type: 'community', creator: 'NFT_Wizard', isCompleted: false },
  { id: '8', title: 'Mint "The Origin" on Zora', reward: '50 $thewclubbiggs', type: 'community', creator: 'WClubBiggs', isCompleted: false },
  { id: '9', title: 'Join the Telegram Voice Chat', reward: '25 $thewclubbiggs', type: 'community', creator: 'CommunityMod', isCompleted: false },
];

export const TOP_BURNERS: Burner[] = [
  { rank: 1, username: 'CryptoKing99', amount: 50000 },
  { rank: 2, username: 'BaseAlpha', amount: 32000 },
  { rank: 3, username: 'WClubOG', amount: 15000 },
  { rank: 4, username: 'Burninator', amount: 8000 },
  { rank: 5, username: 'AdSpender', amount: 5500 },
];

export const MOCK_TIPS: Tip[] = [
  { id: '1', from: 'MoonWalker', to: 'WClubBiggs', amount: 500, message: 'Love the new content!', timestamp: '2m ago' },
  { id: '2', from: 'DeFi_Dave', to: 'CryptoKing99', amount: 100, message: 'Thanks for the alpha', timestamp: '15m ago' },
  { id: '3', from: 'Alice', to: 'Bob', amount: 50, message: 'GG', timestamp: '1h ago' },
];

export const LEADERBOARD_BIGGS: LeaderboardItem[] = [
  { rank: 1, username: 'Whale0x', value: '1,500,000', detail: '3.5% Supply' },
  { rank: 2, username: 'DiamondDave', value: '850,000', detail: '1.8% Supply' },
  { rank: 3, username: 'SarahConnor', value: '620,000', detail: '1.2% Supply' },
  { rank: 4, username: 'BaseGod', value: '410,000', detail: '0.9% Supply' },
  { rank: 5, username: 'WAGMI_Warrior', value: '305,000', detail: '0.7% Supply' },
];

export const LEADERBOARD_INDEX: LeaderboardItem[] = [
  { rank: 1, username: 'FundManager_X', value: '55,000', detail: '$thewclstrat' },
  { rank: 2, username: 'IndexMaxi', value: '42,000', detail: '$thewclstrat' },
  { rank: 3, username: 'PassiveIncome', value: '28,500', detail: '$thewclstrat' },
  { rank: 4, username: 'RetireEarly', value: '19,000', detail: '$thewclstrat' },
  { rank: 5, username: 'SlowAndSteady', value: '12,500', detail: '$thewclstrat' },
];

export const LEADERBOARD_DURATION: LeaderboardItem[] = [
  { rank: 1, username: 'OG_Genesis', value: '420 Days', detail: 'Since Launch' },
  { rank: 2, username: 'HODL_King', value: '385 Days', detail: 'No Sells' },
  { rank: 3, username: 'IronHands', value: '360 Days', detail: 'Buying Dips' },
  { rank: 4, username: 'EarlyBird', value: '310 Days', detail: 'Pre-sale' },
  { rank: 5, username: 'Believer', value: '295 Days', detail: 'Accumulating' },
];

export const LEADERBOARD_VOLUME: LeaderboardItem[] = [
  { rank: 1, username: 'MarketMaker01', value: '$12.5M', detail: '30d Vol' },
  { rank: 2, username: 'ArbitrageBot', value: '$8.2M', detail: '30d Vol' },
  { rank: 3, username: 'DayTraderPro', value: '$4.5M', detail: '30d Vol' },
  { rank: 4, username: 'LiquidityProv', value: '$2.1M', detail: '30d Vol' },
  { rank: 5, username: 'VolBot_9000', value: '$1.8M', detail: '30d Vol' },
];

export const LINKS = {
  phantom: 'https://phantom.com/tokens/base/0xfaac6a5816f2734f231119c2cf0b16227ee83328?referralId=hjc1mwd6uu',
  zoraCoin: 'https://zora.co/coin/base:0x69ccfacc8f90bbe4abf64110df1da45ab2f58526',
  zoraProfile: 'https://zora.co/@thewclubbiggs',
  merch: 'https://wclubbiggs.printify.me/',
  twitter: 'https://x.com/thewclubbiggs',
  tiktok: 'https://www.tiktok.com/@thewclubbiggs',
  youtube: 'https://youtube.com/@wclubbiggs',
  contract: '0xfaac6a5816f2734f231119c2cf0b16227ee83328',
  glider: 'https://glider.fi/portfolio/gjg6ar0x'
};