import React, { useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert, Cpu, Check, Terminal } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { adminSettings, updateAdminSettings, addLog } = useOSStore();
  const [tempName, setTempName] = useState('');
  const [tempClearance, setTempClearance] = useState('Level 5 Admin');
  const [tempTheme, setTempTheme] = useState<'cyan' | 'purple' | 'green' | 'amber' | 'crimson'>('cyan');

  // Modal is visible if commanderName is 'UNASSIGNED'
  const isVisible = adminSettings.commanderName === 'UNASSIGNED';

  const themes = [
    { id: 'cyan', label: 'Cyber Cyan', color: '#00f0ff', class: 'bg-[#00f0ff]' },
    { id: 'purple', label: 'Quantum Purple', color: '#a855f7', class: 'bg-[#a855f7]' },
    { id: 'green', label: 'Matrix Green', color: '#10b981', class: 'bg-[#10b981]' },
    { id: 'amber', label: 'Solar Amber', color: '#f59e0b', class: 'bg-[#f59e0b]' },
    { id: 'crimson', label: 'Crimson Nova', color: '#ef4444', class: 'bg-[#ef4444]' },
  ] as const;

  // Shift page theme live as user selects it in the onboarding modal
  React.useEffect(() => {
    if (isVisible) {
      updateAdminSettings({ theme: tempTheme });
    }
  }, [tempTheme, isVisible, updateAdminSettings]);

  const handleInitialize = () => {
    const finalName = tempName.trim() ? tempName.trim().toUpperCase() : 'OPERATOR';
    
    // Play start-up beep via Web Audio API
    if (typeof window !== 'undefined') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Low beep
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
        gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.3);

        // High confirmation beep
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
          gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.5);
        }, 150);
      } catch (e) {
        console.warn('AudioContext beep failed:', e);
      }
    }

    // Save settings in the global persisted state
    updateAdminSettings({
      commanderName: finalName,
      clearanceLevel: tempClearance,
      theme: tempTheme,
    });

    // Add log entries for the initialization sequence
    addLog('success', `A.E.G.I.S. Core link established by ${finalName} (${tempClearance})`);
    addLog('info', `Holographic grid calibrated on theme: [${tempTheme.toUpperCase()}]`);

    // Voice Synthesis greeting
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const greeting = `Identity confirmed. Welcome back, Commander ${finalName}. All holographic systems are fully operational.`;
        const utterance = new SpeechSynthesisUtterance(greeting);
        utterance.volume = adminSettings.ttsVolume;
        utterance.pitch = adminSettings.ttsPitch;
        utterance.rate = adminSettings.ttsRate;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ||
                               voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('microsoft')) ||
                               voices.find(v => v.lang.startsWith('en'));
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('Speech synthesis greeting failed:', e);
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative w-full max-w-lg bg-[#070b19]/90 border border-cyber-cyan/30 rounded-lg shadow-glow-cyan-lg overflow-hidden flex flex-col p-6 md:p-8"
          >
            {/* Holographic scanner laser line inside the modal */}
            <motion.div
              animate={{ y: ['-10%', '110%'] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute left-0 right-0 h-[1.5px] bg-cyber-cyan/30 opacity-70 blur-[1px]"
            />

            {/* Glowing Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan" />

            {/* Header */}
            <div className="flex flex-col gap-1 items-center text-center pb-6 border-b border-cyber-cyan/15">
              <div className="p-2 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 mb-2">
                <Cpu size={24} className="text-cyber-cyan animate-pulse-slow" />
              </div>
              <h1 className="font-orbitron text-sm md:text-base font-extrabold tracking-widest text-white uppercase">
                A.E.G.I.S. OS INITIALIZATION
              </h1>
              <p className="text-[9px] md:text-xxs text-cyber-cyan/70 font-semibold tracking-wider font-orbitron max-w-sm uppercase">
                Operator credentials required to authorize neural network nodes and configure tactical environment.
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex-1 py-6 flex flex-col gap-5">
              
              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-white/40 font-orbitron tracking-widest flex items-center gap-1.5 uppercase font-semibold">
                  <User size={12} className="text-cyber-cyan" /> Commander Identity Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="ENTER NAME (E.G. SKYWALKER)"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleInitialize();
                    }}
                    className="w-full bg-black/50 border border-white/10 hover:border-cyber-cyan/35 focus:border-cyber-cyan px-3.5 py-2.5 rounded text-xs font-semibold text-white tracking-widest uppercase focus:outline-none focus:shadow-glow-cyan font-orbitron"
                  />
                  <span className="absolute right-3.5 top-3 text-[9px] text-white/20 select-none font-mono">
                    {tempName.length}/15
                  </span>
                </div>
              </div>

              {/* Clearance Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-white/40 font-orbitron tracking-widest flex items-center gap-1.5 uppercase font-semibold">
                  <ShieldAlert size={12} className="text-cyber-purple" /> Security Clearance Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'Level 5 Admin',
                    'Level 4 Operator',
                    'Level 3 Technician',
                    'Guest Terminal',
                  ].map((level) => (
                    <button
                      key={level}
                      onClick={() => setTempClearance(level)}
                      className={`text-[8px] md:text-[9px] py-2 border rounded font-semibold transition-all duration-300 font-orbitron cursor-pointer ${
                        tempClearance === level
                          ? 'border-cyber-purple bg-cyber-purple/15 text-white shadow-glow-purple'
                          : 'border-white/5 bg-black/20 text-white/50 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Swapper */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-white/40 font-orbitron tracking-widest flex items-center gap-1.5 uppercase font-semibold">
                  <Terminal size={12} className="text-cyber-pink" /> Initial Neon HUD Theme
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTempTheme(t.id)}
                      className={`flex flex-col items-center justify-center p-2.5 bg-black/40 border rounded-md cursor-pointer hover:border-white/20 transition-all duration-300 ${
                        tempTheme === t.id
                          ? 'border-cyber-cyan/85 shadow-glow-cyan bg-cyber-cyan/5'
                          : 'border-white/5'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full ${t.class} shadow-md mb-1.5`} />
                      <span className="text-[7px] md:text-[8px] text-white/70 font-semibold tracking-tighter truncate max-w-full font-orbitron">
                        {t.id.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer button */}
            <div className="pt-4 border-t border-cyber-cyan/15 flex flex-col gap-3">
              <button
                onClick={handleInitialize}
                className="w-full py-3 bg-cyber-cyan/20 hover:bg-cyber-cyan/35 border border-cyber-cyan text-white hover:text-white font-semibold font-orbitron text-xs tracking-widest uppercase transition-all duration-350 cursor-pointer shadow-glow-cyan flex items-center justify-center gap-2 rounded"
              >
                <Check size={14} className="text-cyber-cyan animate-pulse" />
                Initialize OS Core
              </button>
              <div className="flex justify-between items-center text-[7px] text-white/20 font-orbitron uppercase">
                <span>SYSTEM STATUS: COMPILING USER MODULES</span>
                <span>SEC_CORE // AEGIS_OS</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
