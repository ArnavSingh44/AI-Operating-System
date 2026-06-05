import { useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { GlassCard } from './UI/GlassCard';
import { Calendar, Newspaper, CheckSquare, Plus, Trash2, Globe, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LowerPanels: React.FC = () => {
  const { 
    events, 
    news, 
    tasks, 
    addTask, 
    toggleTask, 
    deleteTask, 
    addLog 
  } = useOSStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim());
    addLog('success', `Task added manually: "${newTaskTitle}"`);
    setNewTaskTitle('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">
      
      {/* 1. Calendar & Operations Agenda */}
      <GlassCard 
        title="Chronos Operations" 
        icon={<Calendar size={14} />} 
        glowColor="blue"
        enableParallax={true}
      >
        <div className="flex-1 flex flex-col justify-between py-1 select-none">
          <div className="flex flex-col gap-2.5 max-h-[14rem] overflow-y-auto pr-1">
            {events.map((event) => {
              const categoryColors = {
                sync: 'bg-cyber-cyan border-cyber-cyan/30 text-cyber-cyan',
                system: 'bg-cyber-purple border-cyber-purple/30 text-cyber-purple',
                sec: 'bg-cyber-pink border-cyber-pink/30 text-cyber-pink',
                personal: 'bg-yellow-400 border-yellow-400/30 text-yellow-400',
              };

              return (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-2.5 bg-black/25 border border-white/5 rounded-md hover:border-cyber-blue/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    {/* Glowing status circle */}
                    <div className="relative flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${categoryColors[event.category].split(' ')[0]} shadow-[0_0_8px_currentColor]`} />
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-white tracking-wide">{event.title}</span>
                      <span className="text-[9px] text-white/40 font-orbitron mt-0.5">{event.time}</span>
                    </div>
                  </div>
                  
                  <span className={`text-[8px] font-orbitron border px-2 py-0.5 rounded tracking-widest ${categoryColors[event.category]}`}>
                    {event.category.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="text-[8px] text-white/20 font-orbitron mt-3 border-t border-white/5 pt-2 flex justify-between">
            <span>ZONE: GMT+5:30 (NEO TOKYO)</span>
            <span>SYNC: ORBITAL CLOCK L-1</span>
          </div>
        </div>
      </GlassCard>

      {/* 2. AI Summarized News Feed */}
      <GlassCard 
        title="Neural News Wire" 
        icon={<Newspaper size={14} />} 
        glowColor="purple"
        enableParallax={true}
      >
        <div className="flex-1 flex flex-col justify-between py-1 select-none">
          <div className="flex flex-col gap-3 max-h-[14rem] overflow-y-auto pr-1">
            {news.map((item) => (
              <div 
                key={item.id}
                className="flex flex-col p-2.5 bg-black/25 border border-white/5 rounded-md hover:border-cyber-purple/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-orbitron font-bold text-[9px] text-cyber-purple tracking-widest flex items-center gap-1.5">
                    <Globe size={10} />
                    {item.source.toUpperCase()}
                  </span>
                  <span className="text-[8px] text-white/35 font-orbitron">{item.time}</span>
                </div>
                
                <h4 className="text-xs font-semibold text-white tracking-wide mb-1 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] text-white/60 leading-relaxed font-light">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="text-[8px] text-white/20 font-orbitron mt-3 border-t border-white/5 pt-2 flex justify-between">
            <span>FEED STATUS: STREAMING LIVE</span>
            <span>SECURE CRYPTO LINK</span>
          </div>
        </div>
      </GlassCard>

      {/* 3. Task Manager */}
      <GlassCard 
        title="Mission Directives" 
        icon={<CheckSquare size={14} />} 
        glowColor="cyan"
        enableParallax={true}
      >
        <div className="flex-1 flex flex-col justify-between py-1 select-none">
          {/* Add Task Input Form */}
          <form onSubmit={handleAddTaskSubmit} className="flex gap-1.5 mb-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="DEFINE NEW DIRECTIVE..."
              className="flex-1 px-3 py-1 bg-black/40 border border-white/10 hover:border-cyber-cyan/35 focus:border-cyber-cyan/60 rounded font-orbitron text-[10px] tracking-wider text-white placeholder-white/25 focus:outline-none transition-all duration-300"
            />
            <button 
              type="submit"
              className="p-1 px-2 border border-cyber-cyan/40 bg-cyber-cyan/5 hover:bg-cyber-cyan/15 rounded text-cyber-cyan hover:shadow-glow-cyan transition-all duration-300"
            >
              <Plus size={14} />
            </button>
          </form>

          {/* Checklist */}
          <div className="flex flex-col gap-2 max-h-[11rem] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {tasks.length === 0 ? (
                <div className="flex items-center gap-2 text-[10px] text-white/30 font-orbitron justify-center py-6">
                  <AlertTriangle size={12} />
                  NO ACTIVE MISSION DIRECTIVES
                </div>
              ) : (
                tasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-2.5 bg-black/25 border border-white/5 hover:border-cyber-cyan/30 rounded-md transition-all duration-300 group"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="sr-only"
                      />
                      {/* Custom styled checkbox */}
                      <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-all duration-200 ${
                        task.completed 
                          ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan shadow-glow-cyan' 
                          : 'border-white/20 group-hover:border-cyber-cyan/50'
                      }`}>
                        {task.completed && <div className="w-1.5 h-1.5 rounded-sm bg-cyber-cyan" />}
                      </div>
                      <span className={`text-xs transition-all duration-200 ${
                        task.completed ? 'line-through text-white/35 font-light' : 'text-white font-medium'
                      }`}>
                        {task.title}
                      </span>
                    </label>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-white/30 hover:text-cyber-pink hover:bg-cyber-pink/5 rounded border border-transparent hover:border-cyber-pink/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Trash2 size={11} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="text-[8px] text-white/20 font-orbitron mt-3 border-t border-white/5 pt-2 flex justify-between">
            <span>PENDING TASK BLOCK: {tasks.filter(t => !t.completed).length}</span>
            <span>ENCRYPTED LOCAL STORAGE</span>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
