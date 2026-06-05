import React from 'react';

interface CircularGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  title: string;
  color?: 'cyan' | 'purple' | 'pink' | 'blue';
  subText?: string;
  onClick?: () => void;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  size = 100,
  strokeWidth = 6,
  title,
  color = 'cyan',
  subText,
  onClick,
}) => {
  const radius = (size - strokeWidth - 10) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const colorMap = {
    cyan: {
      stroke: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.4)',
      text: 'text-cyber-cyan text-glow-cyan',
      track: 'rgba(0, 240, 255, 0.05)',
    },
    purple: {
      stroke: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.4)',
      text: 'text-cyber-purple text-glow-purple',
      track: 'rgba(168, 85, 247, 0.05)',
    },
    pink: {
      stroke: '#ec4899',
      glow: 'rgba(236, 72, 153, 0.4)',
      text: 'text-cyber-pink text-glow-pink',
      track: 'rgba(236, 72, 153, 0.05)',
    },
    blue: {
      stroke: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.4)',
      text: 'text-cyber-blue',
      track: 'rgba(59, 130, 246, 0.05)',
    },
  };

  const activeColor = colorMap[color];

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 hover:bg-white/[0.02] rounded-lg' : ''
      }`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <defs>
            <filter id={`glow-${title}-${color}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Core active track under-glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={activeColor.track}
            strokeWidth={strokeWidth + 2}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />

          {/* Animated Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={activeColor.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={`url(#glow-${title}-${color})`}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-orbitron text-xxs tracking-widest text-white/40 uppercase">
            {title}
          </span>
          <span className={`font-orbitron text-sm font-bold tracking-tight ${activeColor.text}`}>
            {subText || `${clampedValue}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
