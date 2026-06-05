import React, { useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Sliders, Volume2, ShieldAlert, Download, Trash2, Cpu, RefreshCw, Key } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminOpen, 
    setAdminOpen, 
    adminSettings, 
    updateAdminSettings, 
    logs, 
    clearLogs, 
    exportLogs 
  } = useOSStore();

  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'success' | 'warn' | 'error' | 'command'>('all');

  const themes = [
    { id: 'cyan', label: 'Cyber Cyan', color: '#00f0ff', class: 'bg-[#00f0ff]' },
    { id: 'purple', label: 'Quantum Purple', color: '#a855f7', class: 'bg-[#a855f7]' },
    { id: 'green', label: 'Matrix Green', color: '#10b981', class: 'bg-[#10b981]' },
    { id: 'amber', label: 'Solar Amber', color: '#f59e0b', class: 'bg-[#f59e0b]' },
    { id: 'crimson', label: 'Crimson Nova', color: '#ef4444', class: 'bg-[#ef4444]' },
  ];

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  return (
    <AnimatePresence>
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAdminOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-[#0a0f1e]/85 backdrop-blur-xl border-l border-cyber-cyan/25 shadow-glow-cyan-lg z-10 flex flex-col font-mono select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cyber-cyan/15 bg-black/35">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 animate-pulse-slow">
                  <Sliders size={16} className="text-cyber-cyan" />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-orbitron text-xs font-bold tracking-widest text-white">
                    A.E.G.I.S. ADMIN CENTER
                  </h2>
                  <span className="text-[8px] text-cyber-cyan/70 font-orbitron tracking-widest">
                    SYSTEM SECURITY ROOT CORE // ADMIN_MODE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAdminOpen(false)}
                className="p-1 rounded-md border border-white/5 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 text-white/50 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Contents */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6 scrollbar-thin">
              
              {/* 1. Commander Credentials */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] text-white/30 font-orbitron tracking-widest block uppercase">
                  Commander Profile Credentials
                </span>
                <div className="p-4 bg-black/30 border border-white/5 rounded-md flex flex-col gap-3.5 hover:border-cyber-cyan/15 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-cyber-cyan/10 border border-cyber-cyan/30">
                      <User size={16} className="text-cyber-cyan" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-orbitron tracking-wider">COMMANDER NAME</label>
                      <input
                        type="text"
                        value={adminSettings.commanderName}
                        onChange={(e) => updateAdminSettings({ commanderName: e.target.value.toUpperCase() })}
                        className="bg-black/60 border border-white/10 hover:border-cyber-cyan/20 focus:border-cyber-cyan/40 px-2.5 py-1 rounded text-xs font-semibold text-white tracking-widest uppercase focus:outline-none focus:shadow-glow-cyan w-full font-orbitron"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-cyber-purple/10 border border-cyber-purple/30">
                      <ShieldAlert size={16} className="text-cyber-purple" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-orbitron tracking-wider">CLEARANCE LEVEL</label>
                      <select
                        value={adminSettings.clearanceLevel}
                        onChange={(e) => updateAdminSettings({ clearanceLevel: e.target.value })}
                        className="bg-black/60 border border-white/10 hover:border-cyber-cyan/20 focus:border-cyber-cyan/40 px-2.5 py-1 rounded text-xs font-semibold text-white tracking-widest uppercase focus:outline-none focus:shadow-glow-cyan w-full font-orbitron appearance-none"
                      >
                        <option value="Level 5 Admin">Level 5 Admin</option>
                        <option value="Level 4 Operator">Level 4 Operator</option>
                        <option value="Level 3 Technician">Level 3 Technician</option>
                        <option value="Guest Terminal">Guest Terminal</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Credentials */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] text-white/30 font-orbitron tracking-widest block uppercase">
                  A.E.G.I.S. Cognitive API Sync
                </span>
                <div className="p-4 bg-black/30 border border-white/5 rounded-md flex flex-col gap-2 hover:border-cyber-purple/15 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-cyber-pink/10 border border-cyber-pink/30">
                      <Key size={16} className="text-cyber-pink" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-orbitron tracking-wider">GEMINI API KEY</label>
                      <input
                        type="password"
                        placeholder="PASTE GOOGLE AI STUDIO API KEY..."
                        value={adminSettings.geminiApiKey || ''}
                        onChange={(e) => updateAdminSettings({ geminiApiKey: e.target.value })}
                        className="bg-black/60 border border-white/10 hover:border-cyber-pink/20 focus:border-cyber-pink/40 px-2.5 py-1.5 rounded text-xs font-semibold text-white tracking-widest focus:outline-none focus:shadow-glow-pink w-full font-mono"
                      />
                    </div>
                  </div>
                  <span className="text-[7.5px] text-white/30 leading-relaxed uppercase mt-1">
                    * If empty, A.E.G.I.S. defaults to the Vercel build variable. Added keys are saved securely in your local browser Cache.
                  </span>
                </div>
              </div>

              {/* 2. Dynamic Theme Swap */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] text-white/30 font-orbitron tracking-widest block uppercase">
                  HUD Neon Accent Override
                </span>
                <div className="p-4 bg-black/30 border border-white/5 rounded-md flex flex-col gap-3 hover:border-cyber-cyan/15 transition-all duration-300">
                  <div className="grid grid-cols-5 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => updateAdminSettings({ theme: t.id as any })}
                        className={`flex flex-col items-center justify-center p-2 bg-black/40 border rounded-md cursor-pointer hover:border-white/20 transition-all duration-300 ${
                          adminSettings.theme === t.id 
                            ? 'border-cyber-cyan/80 shadow-glow-cyan bg-cyber-cyan/5' 
                            : 'border-white/5'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full ${t.class} shadow-md mb-1.5`} />
                        <span className="text-[7px] text-white/60 text-center font-orbitron font-semibold tracking-tighter truncate max-w-full">
                          {t.id.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. System Override metrics knobs */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] text-white/30 font-orbitron tracking-widest block uppercase">
                  Overclocking Subsystem Manual Override
                </span>
                <div className="p-4 bg-black/30 border border-white/5 rounded-md flex flex-col gap-4 hover:border-cyber-cyan/15 transition-all duration-300">
                  
                  {/* CPU override */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xxs font-semibold">
                      <span className="text-white/70 flex items-center gap-1">
                        <Cpu size={10} className="text-cyber-cyan" /> CPU SETPOINT THROTTLE
                      </span>
                      <span className="text-cyber-cyan">
                        {adminSettings.cpuOverride !== undefined ? `${adminSettings.cpuOverride}%` : 'FLUID FLUX'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={adminSettings.cpuOverride ?? 34}
                        onChange={(e) => updateAdminSettings({ cpuOverride: parseInt(e.target.value) })}
                        className="flex-1 accent-cyber-cyan h-1 bg-black/60 rounded-lg appearance-none cursor-pointer"
                      />
                      <button
                        onClick={() => updateAdminSettings({ cpuOverride: undefined })}
                        className={`text-[8px] px-1.5 py-0.5 rounded border ${
                          adminSettings.cpuOverride === undefined 
                            ? 'border-cyber-cyan/40 bg-cyber-cyan/5 text-cyber-cyan' 
                            : 'border-white/10 text-white/40 hover:text-white'
                        }`}
                      >
                        AUTO
                      </button>
                    </div>
                  </div>

                  {/* RAM override */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xxs font-semibold">
                      <span className="text-white/70 flex items-center gap-1">
                        <Cpu size={10} className="text-cyber-purple" /> RAM HEAP ALLOCATION
                      </span>
                      <span className="text-cyber-purple">
                        {adminSettings.ramOverride !== undefined ? `${adminSettings.ramOverride}%` : 'FLUID FLUX'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={adminSettings.ramOverride ?? 58}
                        onChange={(e) => updateAdminSettings({ ramOverride: parseInt(e.target.value) })}
                        className="flex-1 accent-cyber-purple h-1 bg-black/60 rounded-lg appearance-none cursor-pointer"
                      />
                      <button
                        onClick={() => updateAdminSettings({ ramOverride: undefined })}
                        className={`text-[8px] px-1.5 py-0.5 rounded border ${
                          adminSettings.ramOverride === undefined 
                            ? 'border-cyber-purple/40 bg-cyber-purple/5 text-cyber-purple' 
                            : 'border-white/10 text-white/40 hover:text-white'
                        }`}
                      >
                        AUTO
                      </button>
                    </div>
                  </div>

                  {/* Thermal override */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xxs font-semibold">
                      <span className="text-white/70 flex items-center gap-1">
                        <Cpu size={10} className="text-cyber-pink" /> THERMAL SETPOINT
                      </span>
                      <span className="text-cyber-pink">
                        {adminSettings.tempOverride !== undefined ? `${adminSettings.tempOverride}°C` : 'FLUID FLUX'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="15"
                        max="95"
                        value={adminSettings.tempOverride ?? 42}
                        onChange={(e) => updateAdminSettings({ tempOverride: parseInt(e.target.value) })}
                        className="flex-1 accent-cyber-pink h-1 bg-black/60 rounded-lg appearance-none cursor-pointer"
                      />
                      <button
                        onClick={() => updateAdminSettings({ tempOverride: undefined })}
                        className={`text-[8px] px-1.5 py-0.5 rounded border ${
                          adminSettings.tempOverride === undefined 
                            ? 'border-cyber-pink/40 bg-cyber-pink/5 text-cyber-pink' 
                            : 'border-white/10 text-white/40 hover:text-white'
                        }`}
                      >
                        AUTO
                      </button>
                    </div>
                  </div>

                  {/* Fan Speed override */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xxs font-semibold">
                      <span className="text-white/70 flex items-center gap-1">
                        <RefreshCw size={10} className="text-white/60 animate-spin [animation-duration:10s]" /> COOLANT FAN EXHAUST
                      </span>
                      <span className="text-white">
                        {adminSettings.fanSpeed} RPM
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="6000"
                      step="100"
                      value={adminSettings.fanSpeed}
                      onChange={(e) => updateAdminSettings({ fanSpeed: parseInt(e.target.value) })}
                      className="w-full accent-white h-1 bg-black/60 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                </div>
              </div>

              {/* 4. Speech & Vocal Synthesizer Settings */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] text-white/30 font-orbitron tracking-widest block uppercase">
                  Vocal Synthesis Synthesis & Mic
                </span>
                <div className="p-4 bg-black/30 border border-white/5 rounded-md flex flex-col gap-4 hover:border-cyber-cyan/15 transition-all duration-300">
                  
                  {/* Volume */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xxs font-semibold">
                      <span className="text-white/70 flex items-center gap-1">
                        <Volume2 size={12} className="text-cyber-cyan" /> SPEECH SYNTHESIS VOLUME
                      </span>
                      <span className="text-cyber-cyan">{Math.round(adminSettings.ttsVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={adminSettings.ttsVolume}
                      onChange={(e) => updateAdminSettings({ ttsVolume: parseFloat(e.target.value) })}
                      className="w-full accent-cyber-cyan h-1 bg-black/60 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Pitch */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xxs font-semibold">
                      <span className="text-white/70">SPEECH SYNTHESIS PITCH</span>
                      <span className="text-white">{adminSettings.ttsPitch.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={adminSettings.ttsPitch}
                      onChange={(e) => updateAdminSettings({ ttsPitch: parseFloat(e.target.value) })}
                      className="w-full accent-white h-1 bg-black/60 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Speed Rate */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xxs font-semibold">
                      <span className="text-white/70">SPEECH SYNTHESIS RATE</span>
                      <span className="text-white">{adminSettings.ttsRate.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={adminSettings.ttsRate}
                      onChange={(e) => updateAdminSettings({ ttsRate: parseFloat(e.target.value) })}
                      className="w-full accent-white h-1 bg-black/60 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Mic Auto Listen */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                    <div className="flex flex-col">
                      <span className="text-xxs font-semibold text-white/70">MIC AUTO-DICTATION</span>
                      <span className="text-[8px] text-white/30 leading-tight">Continuous voice recognition listening loops</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminSettings.sttAutoListen}
                        onChange={(e) => updateAdminSettings({ sttAutoListen: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-black/60 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyber-cyan/25 peer-checked:border-cyber-cyan peer-checked:after:bg-cyber-cyan" />
                    </label>
                  </div>

                </div>
              </div>

              {/* 5. Logs Telemetry Management */}
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-white/30 font-orbitron tracking-widest block uppercase">
                    System Logs Telemetry
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={exportLogs}
                      title="Export Logs"
                      className="p-1 rounded border border-white/10 hover:border-cyber-cyan/40 hover:bg-cyber-cyan/5 text-white/60 hover:text-cyber-cyan transition-all duration-200 cursor-pointer"
                    >
                      <Download size={10} />
                    </button>
                    <button
                      onClick={clearLogs}
                      title="Purge Logs"
                      className="p-1 rounded border border-white/10 hover:border-red-500/40 hover:bg-red-500/5 text-white/60 hover:text-red-500 transition-all duration-200 cursor-pointer"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-black/30 border border-white/5 rounded-md flex flex-col gap-3 hover:border-cyber-cyan/15 transition-all duration-300">
                  {/* Filters bar */}
                  <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2.5">
                    {['all', 'info', 'success', 'warn', 'error', 'command'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setLogFilter(f as any)}
                        className={`text-[8px] px-2 py-0.5 rounded border transition-all duration-200 cursor-pointer ${
                          logFilter === f 
                            ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan' 
                            : 'border-white/5 text-white/50 hover:text-white'
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Logs list */}
                  <div className="max-h-40 overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin text-[9px]">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <div key={log.id} className="flex gap-2 font-mono leading-relaxed border-b border-white/3 pb-1 border-dashed">
                          <span className="text-white/20 select-none">[{log.timestamp}]</span>
                          <span className={`font-semibold uppercase tracking-tighter ${
                            log.type === 'error' ? 'text-red-500' :
                            log.type === 'warn' ? 'text-cyber-pink' :
                            log.type === 'success' ? 'text-cyber-cyan' :
                            log.type === 'command' ? 'text-cyber-purple' :
                            'text-white/55'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-white/70 flex-1">{log.message}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[9px] text-white/25 text-center py-4">NO TELEMETRY RECORDED FOR FILTER</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-cyber-cyan/15 bg-black/35 flex justify-between items-center text-[8px] text-white/25 font-orbitron">
              <span>SECURITY LEVEL: ROOT_LEVEL</span>
              <span>AEGIS ADMIN NODES SWEEP</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
