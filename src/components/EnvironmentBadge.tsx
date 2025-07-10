import React from 'react';
import { Server } from 'lucide-react';

interface EnvironmentBadgeProps {
  currentEnv: string;
  className?: string;
  showPulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const EnvironmentBadge: React.FC<EnvironmentBadgeProps> = ({ 
  currentEnv, 
  className = '', 
  showPulse = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-5 text-sm'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-4 h-4'
  };

  const pulseSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]} rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-0 text-emerald-700 shadow-sm hover:shadow-lg transition-all duration-300 font-medium backdrop-blur-sm ${className}`}>
      {showPulse && (
        <div className={`${pulseSize[size]} bg-emerald-500 rounded-full animate-pulse`}></div>
      )}
      <Server className={iconSizes[size]} />
      <span className="font-medium whitespace-nowrap">{currentEnv}</span>
    </div>
  );
};

export default EnvironmentBadge;
