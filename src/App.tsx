import { useEffect } from 'react';
import { useOSStore } from './store/useOSStore';
import { BackgroundParticles } from './components/BackgroundParticles';
import { TopBar } from './components/TopBar';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { SystemMonitor } from './components/SystemMonitor';
import { LowerPanels } from './components/LowerPanels';
import { BottomConsole } from './components/BottomConsole';
import { AdminPanel } from './components/AdminPanel';
import { OnboardingModal } from './components/OnboardingModal';
import { motion } from 'framer-motion';

function App() {
  const theme = useOSStore(state => state.adminSettings.theme);

  useEffect(() => {
    const body = document.body;
    body.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        body.classList.remove(className);
      }
    });
    body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <div className="relative min-h-screen w-full text-white overflow-hidden pb-12 z-10">
      
      {/* 1. Holographic Screen Environmental Overlays */}
      <BackgroundParticles />
      <div className="hologram-grid" />
      <div className="vignette" />
      <div className="scanline-effect" />
      
      {/* Moving scanline laser line */}
      <motion.div 
        animate={{ y: ['-10%', '110%'] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
        className="scanline-bar"
      />

      {/* 2. HUD Grid Container */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-6 flex flex-col gap-6">
        
        {/* Top Header Row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TopBar />
        </motion.div>

        {/* Core Layout Grid */}
        <div className="flex flex-col gap-6">
          
          {/* Upper Section: Left, Center, Right widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Left Column: Weather Widget (1/4 width on desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <LeftPanel />
            </motion.div>

            {/* Middle Column: 3D Globe Canvas (2/4 width on desktop) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-2 min-h-[320px] lg:min-h-[420px]"
            >
              <CenterPanel />
            </motion.div>

            {/* Right Column: AI Assistant Chat (1/4 width on desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <RightPanel />
            </motion.div>

          </div>

          {/* Mid Section: System diagnostics gauges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SystemMonitor />
          </motion.div>

          {/* Lower Section: Calendar, News, Task list */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <LowerPanels />
          </motion.div>

          {/* Bottom Command Console row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <BottomConsole />
          </motion.div>

        </div>

      </div>

      {/* 3. Sliding Admin Control Panel Drawer */}
      <AdminPanel />
      
      {/* 4. First-time Setup/Login Credentials Modal */}
      <OnboardingModal />
    </div>
  );
}

export default App;
