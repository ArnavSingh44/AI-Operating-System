import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { GlassCard } from './UI/GlassCard';
import { Terminal, ShieldAlert, ArrowRight, Mic, MicOff } from 'lucide-react';

export const BottomConsole: React.FC = () => {
  const { logs, sendMessage } = useOSStore();
  const { isListening, startListening, stopListening } = useSpeechRecognition();
  const [command, setCommand] = useState('');
  
  // Ref to the scrolling logs box
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Scroll only the logs box to the bottom without shifting the main browser viewport
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    sendMessage(command.trim());
    setCommand('');
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-2">
      
      {/* 1. Terminal style Command Input Console (span-2) */}
      <div className="lg:col-span-2">
        <GlassCard 
          title="Consolidated Command Console" 
          icon={<Terminal size={14} />} 
          glowColor="cyan"
          enableParallax={true}
        >
          <div className="flex-1 flex flex-col justify-between py-1 select-none">
            {/* Visual HUD console layout */}
            <div className="bg-black/30 border border-white/5 rounded-md p-3.5 h-[10rem] flex flex-col justify-between font-mono">
              <div className="text-[10px] text-white/45 leading-relaxed overflow-y-auto max-h-[7rem]">
                <div className="text-cyber-cyan font-bold tracking-wider mb-1">
                  A.E.G.I.S. TERMINAL SHELL V9.8 // SECURITY CLEARED
                </div>
                <div className="mb-2">
                  Type <span className="text-cyber-purple font-semibold">/help</span> to query the system commands directory, or ask a question directly to prompt the neural core.
                </div>
                
                {/* Last few commands history */}
                <div className="flex flex-col gap-1 text-[9px]">
                  {logs.filter(l => l.type === 'command').slice(0, 3).map((cmdLog, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-white/20">[{cmdLog.timestamp}]</span>
                      <span className="text-cyber-purple">admin:&gt;</span>
                      <span className="text-white/70">{cmdLog.message.replace('User executed: ', '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Command Form */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-white/10 pt-3 mt-2">
                <span className="text-cyber-cyan font-bold text-xs font-orbitron tracking-widest animate-pulse">
                  AEGIS_OS:&gt;
                </span>
                
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="EXECUTE DIRECTIVE OR /SHELL COMMAND..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-cyber-cyan placeholder-cyber-cyan/30 tracking-widest uppercase focus:ring-0 focus:outline-none"
                />

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`p-1.5 rounded border transition-all duration-300 ${
                      isListening
                        ? 'border-red-500 bg-red-500/10 text-red-500 animate-pulse'
                        : 'border-white/10 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/35'
                    }`}
                  >
                    {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                  </button>
                  
                  <button 
                    type="submit"
                    className="p-1.5 border border-cyber-cyan/35 bg-cyber-cyan/5 hover:bg-cyber-cyan/15 rounded text-cyber-cyan transition-all duration-300"
                  >
                    <ArrowRight size={12} />
                  </button>
                </div>
              </form>
            </div>
            
            <div className="text-[8px] text-white/20 font-orbitron mt-2.5 flex justify-between tracking-widest">
              <span>SHELL STATE: ENGAGED</span>
              <span>INPUT_DECODER: SPEECH_V4 // UTF-8</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 2. Scrolling Core System Logger logs (span-1) */}
      <div className="lg:col-span-1">
        <GlassCard 
          title="Telemetry Process Logs" 
          icon={<ShieldAlert size={14} />} 
          glowColor="purple"
          enableParallax={true}
        >
          <div className="flex-1 flex flex-col justify-between py-1 select-none">
            {/* Scrollable logger box */}
            <div 
              ref={logContainerRef}
              className="bg-black/45 border border-white/5 rounded-md p-2 h-[10rem] overflow-y-auto font-mono text-[9px] flex flex-col gap-1.5 scrollbar-thin scroll-smooth"
            >
              {logs.map((log) => {
                const colorMap = {
                  info: 'text-white/45',
                  warn: 'text-yellow-500 font-medium',
                  success: 'text-cyber-cyan font-semibold',
                  error: 'text-red-500 font-bold shadow-[0_0_5px_rgba(239,68,68,0.1)]',
                  command: 'text-cyber-purple font-medium',
                };

                const prefixMap = {
                  info: '[INF]',
                  warn: '[WRN]',
                  success: '[OK ]',
                  error: '[ERR]',
                  command: '[CMD]',
                };

                return (
                  <div key={log.id} className="flex gap-2 items-start leading-tight">
                    <span className="text-white/25">[{log.timestamp}]</span>
                    <span className={`${colorMap[log.type]}`}>{prefixMap[log.type]}</span>
                    <span className={`flex-1 ${colorMap[log.type].split(' ')[0]}`}>{log.message}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-[8px] text-white/20 font-orbitron mt-2.5 flex justify-between tracking-widest">
              <span>LOGGER RATE: 4.8 KB/S</span>
              <span>FILTER: ALL_METRICS</span>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
