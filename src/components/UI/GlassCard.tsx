import React from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  glowColor?: 'cyan' | 'purple' | 'blue' | 'none';
  enableParallax?: boolean;
  headerAction?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  title,
  icon,
  glowColor = 'cyan',
  enableParallax = false,
  headerAction,
}) => {
  // Compute parallax values if enabled, otherwise use flat 0.
  const { rotateX, rotateY } = useParallax(5);

  const glowClasses = {
    cyan: 'border-cyber-cyan/25 hover:border-cyber-cyan/50 hover:shadow-glow-cyan transition-all duration-300',
    purple: 'border-cyber-purple/20 hover:border-cyber-purple/45 hover:shadow-glow-purple transition-all duration-300',
    blue: 'border-cyber-blue/20 hover:border-cyber-blue/45 transition-all duration-300',
    none: 'border-white/5',
  };

  const glowShadow = glowColor !== 'none' ? glowClasses[glowColor] : '';

  const headerColors = {
    cyan: 'text-cyber-cyan text-glow-cyan',
    purple: 'text-cyber-purple text-glow-purple',
    blue: 'text-cyber-blue',
    none: 'text-white/80',
  };

  const cardContent = (
    <div className="relative overflow-hidden w-full h-full p-4 flex flex-col z-10">
      {/* Gloss reflection overlay line */}
      <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 transition-transform duration-1000 group-hover:translate-x-full pointer-events-none" />

      {/* Cyberpunk corner details */}
      <div className="absolute top-0 left-0 w-2 h-[1px] bg-cyber-cyan/40" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-cyber-cyan/40" />
      
      <div className="absolute top-0 right-0 w-2 h-[1px] bg-cyber-cyan/40" />
      <div className="absolute top-0 right-0 w-[1px] h-2 bg-cyber-cyan/40" />

      <div className="absolute bottom-0 left-0 w-2 h-[1px] bg-cyber-cyan/40" />
      <div className="absolute bottom-0 left-0 w-[1px] h-2 bg-cyber-cyan/40" />

      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-cyber-cyan/40" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-cyber-cyan/40" />

      {title && (
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <div className="flex items-center gap-2">
            {icon && <span className={headerColors[glowColor]}>{icon}</span>}
            <h3 className={`font-orbitron text-xs font-semibold tracking-widest ${headerColors[glowColor]}`}>
              {title.toUpperCase()}
            </h3>
          </div>
          {headerAction && <div className="flex items-center">{headerAction}</div>}
        </div>
      )}
      
      <div className="flex-1 flex flex-col h-full">{children}</div>
    </div>
  );

  if (enableParallax) {
    return (
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`group relative rounded-xl glassmorphism border ${glowShadow} select-none ${className}`}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <div className={`group relative rounded-xl glassmorphism border ${glowShadow} select-none ${className}`}>
      {cardContent}
    </div>
  );
};
