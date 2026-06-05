import React, { useRef, useEffect, useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { GlassCard } from './UI/GlassCard';
import { Mic, MicOff, Cpu, Trash2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RightPanel: React.FC = () => {
  const { messages, isTyping, clearChat, sendMessage } = useOSStore();
  const { isListening, startListening, stopListening } = useSpeechRecognition();
  const [text, setText] = useState('');
  
  // Ref to the scrolling message box
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll only the chat container to the bottom without shifting the main browser viewport
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage(text.trim());
    setText('');
  };

  return (
    <GlassCard 
      title="A.E.G.I.S. Neural Node" 
      icon={<Cpu size={14} />} 
      glowColor="purple"
      enableParallax={true}
      headerAction={
        <button 
          onClick={clearChat}
          title="Purge chat log"
          className="p-1 rounded border border-white/5 hover:border-cyber-pink/40 hover:bg-cyber-pink/5 text-white/40 hover:text-cyber-pink transition-all duration-300"
        >
          <Trash2 size={10} />
        </button>
      }
      className="h-full flex flex-col"
    >
      <div className="flex-1 flex flex-col justify-between h-full select-none gap-3">
        
        {/* 1. Holographic AI Neural Core Visualizer */}
        <div className="flex flex-col items-center justify-center py-3 border-b border-white/5 relative bg-black/10 rounded-md">
          {/* Animated concentric rings */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Outer dotted ring */}
            <div className={`absolute w-full h-full border border-dashed border-cyber-purple/30 rounded-full ${isListening ? 'animate-spin' : isTyping ? 'animate-pulse' : 'animate-spin'} [animation-duration:10s]`} />
            {/* Mid pulse ring */}
            <div className="absolute w-[80%] h-[80%] border border-cyber-cyan/25 rounded-full animate-cyber-pulse" />
            {/* Core glowing sphere */}
            <motion.div 
              animate={isListening ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : isTyping ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-glow-purple border border-cyber-purple/50 ${
                isListening 
                  ? 'bg-gradient-to-tr from-red-500/20 to-cyber-purple/40 shadow-[0_0_20px_rgba(239,68,68,0.5)] border-red-500/50' 
                  : 'bg-gradient-to-tr from-cyber-purple/20 to-cyber-cyan/35'
              }`}
            >
              <Cpu size={16} className={isListening ? 'text-red-400 animate-pulse' : 'text-cyber-cyan animate-pulse-slow'} />
            </motion.div>
          </div>
          
          <span className="font-orbitron text-[9px] font-bold text-cyber-purple tracking-widest mt-2">
            {isListening ? 'VOICE DECODING ENGAGED' : isTyping ? 'NEURAL COMPILING...' : 'NODE LINK SECURE'}
          </span>
        </div>

        {/* 2. Scrollable Dialogue History Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-1 pr-2 max-h-[14rem] min-h-[10rem] flex flex-col gap-3 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                {/* Bubble Meta */}
                <span className="text-[8px] text-white/30 font-orbitron tracking-wider mb-0.5">
                  {msg.sender.toUpperCase()} // {msg.timestamp}
                </span>
                
                {/* Bubble Body */}
                <div 
                  className={`p-2.5 rounded-lg text-xs tracking-wide border font-inter leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-cyber-purple/10 border-cyber-purple/30 text-white rounded-br-none shadow-[0_0_8px_rgba(168,85,247,0.1)]'
                      : msg.sender === 'system'
                      ? 'bg-black/40 border-yellow-500/20 text-yellow-400 font-orbitron text-[10px]'
                      : 'bg-cyber-cyan/5 border-cyber-cyan/25 text-white rounded-bl-none shadow-[0_0_8px_rgba(0,240,255,0.1)]'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            
            {/* Simulated typing dot-pulse */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="self-start flex flex-col items-start max-w-[85%]"
              >
                <span className="text-[8px] text-white/30 font-orbitron tracking-wider mb-0.5">
                  A.E.G.I.S. // COMPILING
                </span>
                <div className="p-3 bg-cyber-cyan/5 border border-cyber-cyan/15 rounded-lg rounded-bl-none flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Panel Action Bar: Voice Indicator & Active Chat Input */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
          {/* Animated Waveform Overlay when listening */}
          {isListening && (
            <div className="flex items-center gap-3 w-full h-8 px-3 bg-red-500/5 border border-red-500/15 rounded-md">
              <div className="waveform-container">
                <div className="waveform-bar" />
                <div className="waveform-bar" />
                <div className="waveform-bar" />
                <div className="waveform-bar" />
                <div className="waveform-bar" />
                <div className="waveform-bar" />
                <div className="waveform-bar" />
              </div>
              <span className="text-[9px] font-orbitron text-red-400 animate-pulse tracking-widest uppercase">
                VOCAL CAPTURE ACTIVE...
              </span>
            </div>
          )}
          
          <form onSubmit={handleSendSubmit} className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2 rounded-md border flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse'
                  : 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/20 hover:border-cyber-purple/50'
              }`}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isListening ? "LISTENING..." : "SEND DIRECTIVE TO AI..."}
              disabled={isListening}
              className="flex-1 px-2.5 py-1.5 bg-black/40 border border-white/10 hover:border-cyber-purple/35 focus:border-cyber-purple/60 rounded font-orbitron text-[9px] tracking-wider text-white placeholder-white/20 focus:outline-none transition-all duration-300 disabled:opacity-50"
            />
            
            <button 
              type="submit"
              disabled={isListening || !text.trim()}
              className="p-1.5 border border-cyber-purple/40 bg-cyber-purple/5 hover:bg-cyber-purple/15 disabled:opacity-30 disabled:hover:bg-transparent rounded text-cyber-purple hover:shadow-glow-purple transition-all duration-300"
            >
              <Send size={12} />
            </button>
          </form>
        </div>

      </div>
    </GlassCard>
  );
};
