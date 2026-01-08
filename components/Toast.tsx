import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, Loader2 } from 'lucide-react';
import { Notification } from '../types';

interface ToastContainerProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
      ))}
    </div>
  );
};

const Toast: React.FC<{ notification: Notification; onDismiss: () => void }> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle className="text-neon-green" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-400" size={20} />,
    loading: <Loader2 className="text-yellow-400 animate-spin" size={20} />
  };

  const borders = {
    success: 'border-neon-green/50',
    error: 'border-red-500/50',
    info: 'border-blue-500/50',
    loading: 'border-yellow-500/50'
  };

  return (
    <div className={`pointer-events-auto bg-black/90 backdrop-blur border ${borders[notification.type]} p-4 rounded-lg shadow-2xl flex items-start gap-3 min-w-[300px] animate-in slide-in-from-right fade-in duration-300`}>
      <div className="mt-0.5">{icons[notification.type]}</div>
      <div>
        <h4 className="font-bold text-sm text-white">{notification.message}</h4>
        {notification.subMessage && (
          <p className="text-xs text-gray-400 mt-1">{notification.subMessage}</p>
        )}
      </div>
    </div>
  );
};