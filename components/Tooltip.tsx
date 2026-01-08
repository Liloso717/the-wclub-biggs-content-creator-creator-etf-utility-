import React, { useState } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-black/90 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-black/90 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-black/90 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-black/90 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div 
      className="relative flex items-center w-fit cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)} // Mobile touch support
    >
      {children}
      {isVisible && (
        <div className={`absolute z-[100] w-48 p-3 text-xs leading-relaxed text-white bg-black/95 border border-white/20 rounded-lg shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-none ${positionClasses[position]}`}>
          {content}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};