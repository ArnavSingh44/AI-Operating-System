import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Search, Shield, Wifi, Terminal, Clock, Calendar, Settings } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { searchQuery, setSearchQuery, searchLocation, adminSettings, setAdminOpen } = useOSStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t: Date) => {
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const formatDate = (t: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return t.toLocaleDateString('en-US', options).toUpperCase();
  };

  return (
    <header className="relative w-full z-30 px-6 py-4 glassmorphism border-b border-cyber-cyan/15 rounded-b-xl flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      
      {/* 1. Logo and Status */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 animate-pulse-slow">
            <Terminal size={18} className="text-cyber-cyan" />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron text-xs font-bold tracking-widest text-white">
              A.E.G.I.S. OS
            </span>
            <span className="text-[9px] text-cyber-cyan font-orbitron tracking-widest">
              V9.8.1 // SECURE
            </span>
          </div>
        </div>
        
        {/* Mobile divider */}
        <div className="md:hidden flex items-center gap-2 text-cyber-cyan text-xs">
          <Clock size={12} />
          <span className="font-orbitron font-medium">{formatTime(time)}</span>
        </div>
      </div>

      {/* 2. Interactive HUD Search/Command Bar */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-cyber-cyan">
          <Search size={14} className="transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              searchLocation(searchQuery);
              setSearchQuery('');
            }
          }}
          placeholder="SEARCH TELEMETRY / LOCATIONS (ENTER)..."
          className="w-full pl-9 pr-4 py-1.5 bg-black/40 border border-white/10 hover:border-cyber-cyan/30 focus:border-cyber-cyan/60 rounded-md font-orbitron text-xxs tracking-wider text-white placeholder-white/30 focus:outline-none focus:shadow-glow-cyan transition-all duration-300"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. DateTime & System Health Indicators */}
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        {/* Time display */}
        <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-6">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-cyber-cyan" />
            <span className="font-orbitron text-sm font-semibold tracking-widest text-white text-glow-cyan w-20">
              {formatTime(time)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-cyber-purple" />
            <span className="font-orbitron text-xxs tracking-wider text-white/70">
              {formatDate(time)}
            </span>
          </div>
        </div>

        {/* User profile & system status */}
        <div className="flex items-center gap-3">
          {/* Status Indicators */}
          <div className="flex items-center gap-2 text-[10px] text-white/50 font-orbitron pr-2 border-r border-white/10">
            <div className="flex items-center gap-1">
              <Wifi size={12} className="text-cyber-cyan" />
              <span className="hidden sm:inline">1.2 Gbps</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={12} className="text-cyber-purple" />
              <span className="hidden sm:inline">98% SECURE</span>
            </div>
          </div>

          {/* Commander Bio Clickable Trigger */}
          <button 
            onClick={() => setAdminOpen(true)}
            className="flex items-center gap-2.5 hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex flex-col items-end">
              <span className="font-orbitron text-[10px] font-bold text-white tracking-widest group-hover:text-cyber-cyan transition-colors duration-200">
                CMD. {adminSettings.commanderName}
              </span>
              <span className="text-[8px] text-cyber-cyan font-bold tracking-widest uppercase opacity-75">
                {adminSettings.clearanceLevel}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full border border-cyber-cyan/40 group-hover:border-cyber-cyan p-0.5 bg-black/40 overflow-hidden flex items-center justify-center transition-colors duration-200">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyber-purple to-cyber-cyan flex items-center justify-center text-white font-orbitron text-xs font-bold shadow-glow-cyan group-hover:shadow-glow-cyan-lg">
                {adminSettings.commanderName.charAt(0) || 'A'}
              </div>
            </div>
            <Settings size={14} className="text-white/40 group-hover:text-cyber-cyan group-hover:rotate-45 transition-all duration-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
