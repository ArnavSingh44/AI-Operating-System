import React from 'react';
import { useOSStore } from '../store/useOSStore';
import { GlassCard } from './UI/GlassCard';
import { CloudRain, CloudSun, Sun, CloudLightning, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';

const WeatherIcon: React.FC<{ type: string; size?: number; className?: string }> = ({ type, size = 20, className = '' }) => {
  switch (type.toLowerCase()) {
    case 'cloud-rain':
      return <CloudRain size={size} className={`text-cyber-blue ${className}`} />;
    case 'cloud-sun':
      return <CloudSun size={size} className={`text-cyber-cyan ${className}`} />;
    case 'sun':
      return <Sun size={size} className={`text-yellow-400 text-glow-cyan ${className}`} />;
    case 'cloud-lightning':
      return <CloudLightning size={size} className={`text-cyber-purple ${className}`} />;
    default:
      return <Sun size={size} className={`text-cyber-cyan ${className}`} />;
  }
};

export const LeftPanel: React.FC = () => {
  const { weather, activeCity, changeCity } = useOSStore();

  const handleCityCycle = () => {
    const cities = ['Silicon Valley', 'London', 'Tokyo', 'Sydney', 'Paris'];
    const currentIndex = cities.indexOf(activeCity);
    const nextCity = cities[(currentIndex + 1) % cities.length];
    changeCity(nextCity);
  };

  return (
    <GlassCard 
      title="Meteorological Grid" 
      icon={<CloudSun size={14} />} 
      glowColor="cyan"
      enableParallax={true}
      headerAction={
        <button 
          onClick={handleCityCycle}
          className="flex items-center gap-1 text-[9px] font-orbitron border border-cyber-cyan/30 bg-cyber-cyan/5 hover:bg-cyber-cyan/15 px-2 py-0.5 rounded text-cyber-cyan hover:shadow-glow-cyan transition-all duration-300"
        >
          <MapPin size={8} />
          CYCLE GRID
        </button>
      }
      className="h-full"
    >
      <div className="flex-1 flex flex-col justify-between py-2 gap-4 select-none">
        {/* 1. Main Temperature Display */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex flex-col">
            <span className="font-orbitron text-3xl font-extrabold text-white text-glow-cyan flex items-start">
              {weather.temp}
              <span className="text-sm font-semibold text-cyber-cyan mt-1">°C</span>
            </span>
            <span className="font-orbitron text-[10px] text-cyber-cyan font-bold tracking-widest uppercase mt-1">
              {activeCity}
            </span>
            <span className="text-[10px] text-white/50 tracking-wide mt-0.5">
              {weather.condition.toUpperCase()}
            </span>
          </div>
          <div className="p-3 bg-cyber-cyan/5 border border-cyber-cyan/25 rounded-full shadow-glow-cyan animate-pulse-slow">
            <WeatherIcon type={weather.temp > 25 ? 'sun' : weather.temp < 23 ? 'cloud-rain' : 'cloud-sun'} size={36} />
          </div>
        </div>

        {/* 2. Meteorological Sub-Metrics */}
        <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-4">
          {/* Humidity */}
          <div className="flex items-center gap-2.5 p-2 bg-black/25 border border-white/5 rounded-md hover:border-cyber-cyan/20 transition-all duration-300">
            <div className="p-1.5 rounded bg-cyber-blue/10 border border-cyber-blue/20">
              <Droplets size={14} className="text-cyber-blue" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 font-orbitron tracking-wider">HUMIDITY</span>
              <span className="font-orbitron text-xs font-bold text-white">{weather.humidity}%</span>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center gap-2.5 p-2 bg-black/25 border border-white/5 rounded-md hover:border-cyber-cyan/20 transition-all duration-300">
            <div className="p-1.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/20">
              <Wind size={14} className="text-cyber-cyan" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 font-orbitron tracking-wider">WIND VEL</span>
              <span className="font-orbitron text-xs font-bold text-white">{weather.wind} KM/H</span>
            </div>
          </div>

          {/* Core Temperature */}
          <div className="flex items-center gap-2.5 p-2 bg-black/25 border border-white/5 rounded-md hover:border-cyber-cyan/20 transition-all duration-300">
            <div className="p-1.5 rounded bg-cyber-purple/10 border border-cyber-purple/20">
              <Thermometer size={14} className="text-cyber-purple" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 font-orbitron tracking-wider">SAT_GRID</span>
              <span className="font-orbitron text-xs font-bold text-white">ACTIVE</span>
            </div>
          </div>

          {/* Barometric Index */}
          <div className="flex items-center gap-2.5 p-2 bg-black/25 border border-white/5 rounded-md hover:border-cyber-cyan/20 transition-all duration-300">
            <div className="p-1.5 rounded bg-pink-500/10 border border-pink-500/20">
              <WeatherIcon type="cloud-lightning" size={14} className="text-cyber-pink" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 font-orbitron tracking-wider">BARO_PSI</span>
              <span className="font-orbitron text-xs font-bold text-white">1014.2</span>
            </div>
          </div>
        </div>

        {/* 3. Forecast Cards */}
        <div>
          <span className="text-[9px] text-white/30 font-orbitron tracking-widest block mb-2 uppercase">
            SYNOPTIC FORECAST GRID
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {weather.forecast.map((fc, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center p-2 bg-black/30 border border-white/5 hover:border-cyber-cyan/20 rounded-md transition-all duration-300"
              >
                <span className="font-orbitron text-[9px] font-bold text-white/45 mb-1.5">{fc.day}</span>
                <WeatherIcon type={fc.icon} size={16} className="mb-1.5" />
                <span className="font-orbitron text-[10px] font-semibold text-white">{fc.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech diagnostics stamp */}
        <div className="text-[8px] text-white/25 font-orbitron flex justify-between tracking-wider">
          <span>SOURCE: NOAA METNET-8</span>
          <span>SATELLITE SYNC: L-28M</span>
        </div>

      </div>
    </GlassCard>
  );
};
