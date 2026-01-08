export interface Asset {
  ticker: string;
  name: string;
  color?: string;
  isCore?: boolean;
  description?: string;
}

export interface Market {
  id: string;
  question: string;
  type: 'flash' | 'longterm' | 'content';
  endsIn: string; // e.g., "10m", "24h"
  yesPool: number;
  noPool: number;
  volume: string;
}

export interface OpinionMarket {
  id: string;
  question: string;
  description: string;
  creator: string;
  creatorAvatarColor: string;
  endsIn: string;
  totalPool: number;
  yesPercent: number;
  volume: string;
  comments: number;
  tags: string[];
  gradient: string;
}

export interface Task {
  id: string;
  title: string;
  reward: string;
  type: 'social' | 'bagworking' | 'daily' | 'community';
  actionUrl?: string;
  isCompleted: boolean;
  creator?: string; // For community tasks
}

export interface Burner {
  username: string;
  amount: number;
  rank: number;
}

export interface Tip {
  id: string;
  from: string;
  to: string;
  amount: number;
  message?: string;
  timestamp?: string;
}

export interface LeaderboardItem {
  rank: number;
  username: string;
  value: string;
  detail?: string;
}

// UI Interaction Types
export type NotificationType = 'success' | 'error' | 'info' | 'loading';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  subMessage?: string;
}

export interface BaseProps {
  onInteract: (type: NotificationType, message: string, subMessage?: string) => void;
  walletConnected: boolean;
}