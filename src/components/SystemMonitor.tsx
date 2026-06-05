import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { GlassCard } from './UI/GlassCard';
import { CircularGauge } from './UI/CircularGauge';
import { Activity, RefreshCw, ArrowUpRight, ArrowDownLeft, X, Cpu, HardDrive, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: string;
}

export const SystemMonitor: React.FC = () => {
  const { metrics, fluctuateMetrics, optimizeSystem, addLog } = useOSStore();
  const [activeModal, setActiveModal] = useState<'cpu' | 'ram' | 'thermal' | 'storage' | null>(null);
  
  // CPU mock processes state to support interactive "killing" of threads
  const [processes, setProcesses] = useState<Process[]>([
    { pid: 1024, name: 'GlobeRenderer.sys', cpu: 14.2, memory: '1.2 GB' },
    { pid: 2048, name: 'SpeechDecoder.sys', cpu: 4.8, memory: '256 MB' },
    { pid: 3096, name: 'ParticleBackground.js', cpu: 3.5, memory: '512 MB' },
    { pid: 4112, name: 'ZustandStateCache.ts', cpu: 1.1, memory: '128 MB' },
    { pid: 5021, name: 'GeminiBrainwaveLink.sys', cpu: 0.8, memory: '340 MB' },
  ]);

  // Keep metrics fluctuating
  useEffect(() => {
    const timer = setInterval(() => {
      fluctuateMetrics();
    }, 2500);

    return () => clearInterval(timer);
  }, [fluctuateMetrics]);

  const handleKillProcess = (pid: number, name: string) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
    addLog('warn', `Process '${name}' [PID: ${pid}] terminated by Commander.`);
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const storagePercentage = Math.round((metrics.storageUsed / metrics.storageTotal) * 100);

  return (
    <div className="relative">
      <GlassCard 
        title="System Diagnostics Grid" 
        icon={<Activity size={14} />} 
        glowColor="cyan"
        enableParallax={true}
        headerAction={
          <button 
            onClick={() => {
              optimizeSystem();
              // Reset killed processes on optimize as a mock refresh
              setProcesses([
                { pid: 1024, name: 'GlobeRenderer.sys', cpu: 14.2, memory: '1.2 GB' },
                { pid: 2048, name: 'SpeechDecoder.sys', cpu: 4.8, memory: '256 MB' },
                { pid: 3096, name: 'ParticleBackground.js', cpu: 3.5, memory: '512 MB' },
                { pid: 4112, name: 'ZustandStateCache.ts', cpu: 1.1, memory: '128 MB' },
                { pid: 5021, name: 'GeminiBrainwaveLink.sys', cpu: 0.8, memory: '340 MB' },
              ]);
            }}
            className="flex items-center gap-1.5 text-[9px] font-orbitron border border-cyber-purple/35 bg-cyber-purple/5 hover:bg-cyber-purple/15 px-2.5 py-1 rounded text-cyber-purple hover:shadow-glow-purple transition-all duration-300"
          >
            <RefreshCw size={10} className="animate-spin [animation-duration:4s]" />
            OPTIMIZE RAM
          </button>
        }
        className="h-full"
      >
        <div className="flex-1 flex flex-col justify-between py-1 select-none gap-4">
          
          {/* 1. Clickable Gauge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-white/5 pb-4">
            <CircularGauge 
              value={metrics.cpu} 
              title="CPU Load" 
              color="cyan" 
              size={90} 
              onClick={() => setActiveModal('cpu')}
            />
            <CircularGauge 
              value={metrics.ram} 
              title="RAM Alloc" 
              color="purple" 
              size={90} 
              onClick={() => setActiveModal('ram')}
            />
            <CircularGauge 
              value={metrics.temp} 
              title="Thermal" 
              color="pink" 
              subText={`${metrics.temp}°C`} 
              size={90} 
              onClick={() => setActiveModal('thermal')}
            />
            <CircularGauge 
              value={storagePercentage} 
              title="Storage" 
              color="blue" 
              subText={`${metrics.storageUsed}G`} 
              size={90} 
              onClick={() => setActiveModal('storage')}
            />
          </div>

          {/* 2. Network Telemetry */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-white/30 font-orbitron tracking-widest block uppercase">
              Hyperwave Network Throughput
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-black/35 border border-white/5 rounded-md flex items-center justify-between hover:border-cyber-cyan/25 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-cyber-cyan/15 border border-cyber-cyan/30">
                    <ArrowDownLeft size={14} className="text-cyber-cyan" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-white/40 font-orbitron tracking-wider">DOWNSTREAM</span>
                    <span className="font-orbitron text-xs font-bold text-white">
                      {metrics.networkDown.toFixed(1)} <span className="text-[9px] text-cyber-cyan font-normal">Mbps</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-black/35 border border-white/5 rounded-md flex items-center justify-between hover:border-cyber-purple/25 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-cyber-purple/15 border border-cyber-purple/30">
                    <ArrowUpRight size={14} className="text-cyber-purple" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-white/40 font-orbitron tracking-wider">UPSTREAM</span>
                    <span className="font-orbitron text-xs font-bold text-white">
                      {metrics.networkUp.toFixed(1)} <span className="text-[9px] text-cyber-purple font-normal">Mbps</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech diagnostics stamp */}
          <div className="text-[8px] text-white/20 font-orbitron flex justify-between tracking-widest">
            <span>CORES: 128 / THREADS: 256 // CLICK GAUGES FOR TELEMETRY</span>
            <span>INTEGRITY: 99.8% // SWAP: 1.2G</span>
          </div>

        </div>
      </GlassCard>

      {/* 3. Diagnostic Modals Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleModalClose}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            
            {/* Modal Glass Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md p-6 rounded-xl glassmorphism border border-cyber-cyan/30 shadow-glow-cyan-lg z-10 font-mono text-xs select-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  {activeModal === 'cpu' && <Cpu size={16} className="text-cyber-cyan animate-pulse" />}
                  {activeModal === 'ram' && <HardDrive size={16} className="text-cyber-purple" />}
                  {activeModal === 'thermal' && <Thermometer size={16} className="text-cyber-pink" />}
                  {activeModal === 'storage' && <HardDrive size={16} className="text-cyber-blue" />}
                  <h3 className="font-orbitron text-xs font-bold tracking-widest text-white uppercase">
                    {activeModal === 'cpu' && 'Core Thread Diagnostics'}
                    {activeModal === 'ram' && 'Memory Heap Allocation'}
                    {activeModal === 'thermal' && 'Thermal Exchanger Telemetry'}
                    {activeModal === 'storage' && 'Interstellar Storage Nodes'}
                  </h3>
                </div>
                <button 
                  onClick={handleModalClose}
                  className="p-1 rounded-md border border-white/5 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 text-white/50 hover:text-white transition-all duration-200"
                >
                  <X size={14} />
                </button>
              </div>

              {/* CPU Modal Content */}
              {activeModal === 'cpu' && (
                <div className="flex flex-col gap-3">
                  <div className="text-[10px] text-white/40 leading-relaxed">
                    ACTIVE LOCAL THREADS SWEEP. TARGET PID CODE TO DISCONNECT OR TERMINATE FROM CORE ALLOCATIONS.
                  </div>
                  
                  <div className="flex flex-col gap-2 max-h-[14rem] overflow-y-auto pr-1">
                    {processes.map((p) => (
                      <div 
                        key={p.pid}
                        className="flex items-center justify-between p-2.5 bg-black/30 border border-white/5 rounded-md hover:border-cyber-cyan/20 transition-all duration-200"
                      >
                        <div className="flex flex-col">
                          <span className="text-white text-xxs font-semibold">{p.name}</span>
                          <span className="text-[9px] text-white/30 mt-0.5">PID: {p.pid} // MEM: {p.memory}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-cyber-cyan font-bold tracking-tighter text-xxs">{p.cpu}% CPU</span>
                          <button
                            onClick={() => handleKillProcess(p.pid, p.name)}
                            className="text-[9px] font-orbitron font-semibold border border-red-500/40 bg-red-500/5 hover:bg-red-500/20 hover:border-red-500 px-2 py-0.5 rounded text-red-500 transition-all duration-200"
                          >
                            KILL
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RAM Modal Content */}
              {activeModal === 'ram' && (
                <div className="flex flex-col gap-3">
                  <div className="text-[10px] text-white/40 leading-relaxed mb-1">
                    MEMORY SEGMENTATION HEAP READOUT. ACTIVE HEAP CAPACITY: 64.0 GB
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between">
                      <span className="text-white/60">System Kernel Buffer</span>
                      <span className="text-cyber-purple font-semibold">16.4 GB</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between">
                      <span className="text-white/60">R3F Shader Geometry Buffer</span>
                      <span className="text-cyber-purple font-semibold">8.2 GB</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between">
                      <span className="text-white/60">Zustand Local State Cache</span>
                      <span className="text-cyber-purple font-semibold">1.1 GB</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between">
                      <span className="text-white/60">Mic Audio Streaming Buffer</span>
                      <span className="text-cyber-purple font-semibold">512 MB</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between border-dashed hover:border-cyber-purple/30">
                      <span className="text-white/30">Available Inactive Heap</span>
                      <span className="text-white/40">24.8 GB</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Thermal Modal Content */}
              {activeModal === 'thermal' && (
                <div className="flex flex-col gap-3">
                  <div className="text-[10px] text-white/40 leading-relaxed mb-1">
                    QUANTUM CORE THERMAL EXCHANGERS. LIQUID NITROGEN COOLANT LEVEL: 94%
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between items-center">
                      <span className="text-white/60">Primary Core Node</span>
                      <span className="text-cyber-pink font-semibold">42°C // STABLE</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between items-center">
                      <span className="text-white/60">R3F GPU Vector Core</span>
                      <span className="text-cyber-pink font-semibold">48°C // MODERATE</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between items-center">
                      <span className="text-white/60">Liquid Coolant Flow Rate</span>
                      <span className="text-white/70">1.8 L/Min</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between items-center">
                      <span className="text-white/60">Exhaust Fan Core Speed</span>
                      <span className="text-white/70">3200 RPM</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Storage Modal Content */}
              {activeModal === 'storage' && (
                <div className="flex flex-col gap-3">
                  <div className="text-[10px] text-white/40 leading-relaxed mb-1">
                    INTERSTELLAR STORAGE PARTITIONS. TOTAL STORAGE DISK CAPACITY: 1024 GB
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between items-center">
                      <span className="text-white/60">/dev/node_a (OS Core Root)</span>
                      <span className="text-cyber-blue font-semibold">320 GB</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between items-center">
                      <span className="text-white/60">/dev/node_b (Gemini Logs Cache)</span>
                      <span className="text-cyber-blue font-semibold">180 GB</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between items-center">
                      <span className="text-white/60">/dev/node_c (Media & Imagery)</span>
                      <span className="text-cyber-blue font-semibold">212 GB</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded-md flex justify-between items-center border-dashed">
                      <span className="text-white/30">Raw Sector Space Reserves</span>
                      <span className="text-white/40">312 GB</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[8px] text-white/20">
                <span>SECURE CRYPTO BUS</span>
                <span>AEGIS NODE SWEEP</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
