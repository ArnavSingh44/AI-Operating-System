import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client with the environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const hasValidKey = apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && apiKey.trim() !== '';
const genAI = hasValidKey ? new GoogleGenerativeAI(apiKey) : null;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  category: 'system' | 'sync' | 'sec' | 'personal';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  time: string;
}

export interface SystemMetrics {
  cpu: number;
  ram: number;
  networkUp: number;
  networkDown: number;
  storageUsed: number;
  storageTotal: number;
  temp: number;
}

export interface LogEntry {
  id: string;
  type: 'info' | 'warn' | 'success' | 'command' | 'error';
  message: string;
  timestamp: string;
}

export interface GlobeNode {
  name: string;
  lat: number;
  lng: number;
  color: string;
}

export interface AdminSettings {
  commanderName: string;
  clearanceLevel: string;
  theme: 'cyan' | 'purple' | 'green' | 'amber' | 'crimson';
  ttsVolume: number;
  ttsPitch: number;
  ttsRate: number;
  sttAutoListen: boolean;
  fanSpeed: number;
  cpuOverride?: number;
  ramOverride?: number;
  tempOverride?: number;
}

interface OSState {
  metrics: SystemMetrics;
  messages: ChatMessage[];
  tasks: Task[];
  events: CalendarEvent[];
  news: NewsItem[];
  logs: LogEntry[];
  isTyping: boolean;
  isListening: boolean;
  searchQuery: string;
  activeCity: string;
  globeNodes: GlobeNode[];
  isAdminOpen: boolean;
  adminSettings: AdminSettings;
  weather: {
    temp: number;
    humidity: number;
    wind: number;
    condition: string;
    forecast: { day: string; temp: number; icon: string }[];
  };
  
  // Actions
  setSearchQuery: (query: string) => void;
  setListening: (listening: boolean) => void;
  addLog: (type: LogEntry['type'], message: string) => void;
  clearChat: () => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  sendMessage: (text: string) => Promise<void>;
  optimizeSystem: () => void;
  fluctuateMetrics: () => void;
  changeCity: (city: string) => void;
  searchLocation: (query: string) => Promise<void>;
  setAdminOpen: (open: boolean) => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  exportLogs: () => void;
  clearLogs: () => void;
}

const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const initialMessages: ChatMessage[] = [
  {
    id: 'init-1',
    sender: 'assistant',
    text: 'A.E.G.I.S. OS initialized. System integrity at 98%. Holographic HUD activated. How may I assist you today, Commander?',
    timestamp: getTimestamp(),
  }
];

const initialTasks: Task[] = [
  { id: '1', title: 'Sync quantum encryption keys', completed: true },
  { id: '2', title: 'Analyze dark matter core fluctuation', completed: false },
  { id: '3', title: 'Recalibrate Three.js web globe projection', completed: false },
];

const initialEvents: CalendarEvent[] = [
  { id: 'e1', time: '09:00 AM', title: 'Deep Space Network Sync', category: 'sync' },
  { id: 'e2', time: '11:30 AM', title: 'Quantum Core Maintenance', category: 'system' },
  { id: 'e3', time: '02:00 PM', title: 'Cybernetic Security Audit', category: 'sec' },
  { id: 'e4', time: '05:00 PM', title: 'Galactic Weather Briefing', category: 'personal' },
];

const initialNews: NewsItem[] = [
  { 
    id: 'n1', 
    title: 'Venus Colony Achieves Fusion Grid Independence', 
    summary: 'The floating cloud colony Sector 4 has completed its grid upgrade, achieving 100% self-sustained clean energy via localized helium-3 atmospheric collectors.', 
    source: 'Solaris Net',
    time: '20m ago' 
  },
  { 
    id: 'n2', 
    title: 'L5 Lagrange Point Quantum Beacon Activated', 
    summary: 'United Space Alliance deploys a hyper-spatial navigation beacon at L5 Lagrange. Signals show 0.02ms ping variance, solidifying cross-sector interstellar paths.', 
    source: 'DeepSpace Info',
    time: '1h ago' 
  },
  { 
    id: 'n3', 
    title: 'Neural Link firmware patch 8.4 released', 
    summary: 'Neurolink announces core firmware safety updates. Fixes sleep-mode feedback loops, increases computational synchronization by 14.2%.', 
    source: 'CyberTech Weekly',
    time: '3h ago' 
  },
];

const initialLogs: LogEntry[] = [
  { id: 'l1', type: 'info', message: 'A.E.G.I.S. Core kernel v9.8.1 load successful', timestamp: getTimestamp() },
  { id: 'l2', type: 'success', message: 'Connected to orbital relay grid: [SECURE_IP: 192.168.99.1]', timestamp: getTimestamp() },
  { id: 'l3', type: 'info', message: '3D Globe renderer initialized. Frame pacing locked at 60 FPS', timestamp: getTimestamp() },
];

const initialGlobeNodes: GlobeNode[] = [
  { name: 'Silicon Valley', lat: 37.7749, lng: -122.4194, color: '#00f0ff' },
  { name: 'London', lat: 51.5074, lng: -0.1278, color: '#3b82f6' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#a855f7' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, color: '#00f0ff' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, color: '#ec4899' },
];

const initialAdminSettings: AdminSettings = {
  commanderName: 'ARNAV',
  clearanceLevel: 'Level 5 Admin',
  theme: 'cyan',
  ttsVolume: 1.0,
  ttsPitch: 0.85,
  ttsRate: 1.05,
  sttAutoListen: false,
  fanSpeed: 3200,
};

// Local rule-based fallback responses when Gemini is offline
const getMockAIResponse = (input: string, state: OSState): { response: string, logs: string[] } => {
  const clean = input.toLowerCase().trim();
  
  if (clean === '/help') {
    return {
      response: 'Core Console Command Library:\n- `/optimize` : Cleans CPU registry & allocates memory reserves\n- `/weather [city]` : Pulls meteorological metrics\n- `/locate [city]` : Centers the 3D globe and weather panel\n- `/task [name]` : Registers an operational directive\n- `/clear` : Purges chat history\n- `/system` : Audits local OS core subsystems\n- `/help` : Provides this directory',
      logs: ['Console query: help directory accessed']
    };
  }
  
  if (clean === '/optimize') {
    return {
      response: 'Initiating system sweep. Releasing inactive threads, optimizing GPU cache, and cooling quantum cores... RAM usage reduced, CPU throttled down. Optimization COMPLETE.',
      logs: [
        'Command: System optimize protocol engaged',
        'Warning: Memory leak neutralized in node_modules',
        'Success: Core temperature reduced by 8°C. Core registry stabilized.'
      ]
    };
  }

  if (clean === '/clear') {
    return {
      response: 'Purging localized conversations logs.',
      logs: ['Command: chat purge executed']
    };
  }

  if (clean.startsWith('/task ')) {
    const taskName = input.slice(6).trim();
    return {
      response: `Operational Directive: "${taskName}" has been successfully added to your task dashboard.`,
      logs: [`Task added: "${taskName}"`]
    };
  }

  if (clean.startsWith('/weather ') || clean.startsWith('/locate ')) {
    const city = clean.startsWith('/weather ') ? input.slice(9).trim() : input.slice(8).trim();
    return {
      response: `Recalibrating satellite radar grid. Cam lens panning to orbital vector coordinate for ${city}. Camera locked.`,
      logs: [`Scanning radar tracking sector: ${city}`]
    };
  }

  if (clean === '/system') {
    return {
      response: `System Core Audit Details:\n- Hostname: AEGIS-OS-NODE-9\n- Platform: React Three Fiber Canvas v8.0\n- Rendering Agent: WebGL 2.0 (Double Buffered)\n- Memory Allocation: ${state.metrics.ram}% of 64GB DDR7\n- Processor: Ryzen Quantum 9900X (Liquid Nitrogen Cooled)\n- Network Status: Fully Connected (latency: 3ms)`,
      logs: ['Command: local OS subsystem audit completed']
    };
  }

  // Fallback conversational responses
  if (clean.includes('hello') || clean.includes('hi ') || clean.includes('hey')) {
    return {
      response: 'Greetings, Commander. All systems are operational. I am ready to process your commands.',
      logs: ['Dialogue interaction: Greeting recognized']
    };
  }

  if (clean.includes('weather')) {
    return {
      response: `Meteorological report for ${state.activeCity}: Currently ${state.weather.temp}°C and ${state.weather.condition}. Let me know if you wish to recalibrate coordinates using \`/weather [city]\`.`,
      logs: ['Meteorology inquiry routed']
    };
  }

  if (clean.includes('status') || clean.includes('system') || clean.includes('cpu')) {
    return {
      response: `CPU load is fluctuating around ${state.metrics.cpu}%. RAM utilization sits at ${state.metrics.ram}%. Network throughput is healthy at ${state.metrics.networkDown.toFixed(1)} Mbps down.`,
      logs: ['Performance diagnostics readout requested']
    };
  }

  if (clean.includes('task') || clean.includes('todo')) {
    const pending = state.tasks.filter(t => !t.completed).length;
    return {
      response: `You currently have ${pending} pending tasks in your queue. You can view them in the task section or create a new one using the terminal command \`/task [title]\`.`,
      logs: ['Task manager summary extracted']
    };
  }

  return {
    response: `Processing request: "${input}". A.E.G.I.S. neural node calculates 99.4% probability that this request can be handled. Let me know if you would like me to compile telemetry logs.`,
    logs: ['General query parsed by AI core']
  };
};

const mapWeatherCode = (code: number): { condition: string; icon: string } => {
  switch (code) {
    case 0:
      return { condition: 'Clear Sky', icon: 'sun' };
    case 1:
    case 2:
    case 3:
      return { condition: 'Partly Cloudy', icon: 'cloud-sun' };
    case 45:
    case 48:
      return { condition: 'Fog / Haze', icon: 'cloud-sun' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { condition: 'Drizzle', icon: 'cloud-rain' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return { condition: 'Rain', icon: 'cloud-rain' };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { condition: 'Snow Flurries', icon: 'cloud-sun' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Rain Showers', icon: 'cloud-rain' };
    case 95:
    case 96:
    case 99:
      return { condition: 'Thunderstorm', icon: 'cloud-lightning' };
    default:
      return { condition: 'Clear Skies', icon: 'sun' };
  }
};

const getMockLocationData = (q: string) => {
  const resolvedName = q.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const lat = (Math.random() - 0.5) * 120;
  const lng = (Math.random() - 0.5) * 360;
  const temp = Math.floor(10 + Math.random() * 25);
  
  return {
    name: resolvedName,
    lat,
    lng,
    weather: {
      temp,
      humidity: Math.floor(40 + Math.random() * 50),
      wind: Math.floor(5 + Math.random() * 40),
      condition: 'Clear Digital Skies',
      forecast: [
        { day: 'MON', temp: temp - 2, icon: 'cloud-sun' },
        { day: 'TUE', temp: temp + 1, icon: 'sun' },
        { day: 'WED', temp: temp + 3, icon: 'sun' },
        { day: 'THU', temp: temp - 1, icon: 'cloud-rain' }
      ]
    },
    news: [
      {
        id: `news-${Math.random()}`,
        title: `${resolvedName} Cyber-Grid Upgrade Online`,
        summary: `The municipal council of ${resolvedName} has completed installation of quantum repeaters across all sectors.`,
        source: 'Grid Wire',
        time: '12m ago'
      },
      {
        id: `news-${Math.random()}`,
        title: `Ion Dust Storm hits ${resolvedName} Outskirts`,
        summary: `High density ion particle dust is drifting into the suburbs. Citizens are advised to engage personal respirators.`,
        source: 'Local Weather Net',
        time: '3h ago'
      }
    ],
    logMessage: `Satellite scan mapped new node coordinates for ${resolvedName}`
  };
};

// Custom synthesized speech player helper
const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    try {
      const { adminSettings } = useOSStore.getState();
      window.speechSynthesis.cancel(); // Abort previous queue
      const utterance = new SpeechSynthesisUtterance(text);
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
      console.error('Speech synthesis execution failed:', e);
    }
  }
};

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      metrics: {
        cpu: 34,
        ram: 58,
        networkUp: 8.4,
        networkDown: 82.1,
        storageUsed: 712,
        storageTotal: 1024,
        temp: 42,
      },
      isAdminOpen: false,
      adminSettings: initialAdminSettings,
      messages: initialMessages,
      tasks: initialTasks,
      events: initialEvents,
      news: initialNews,
      logs: initialLogs,
      isTyping: false,
      isListening: false,
      searchQuery: '',
      activeCity: 'Tokyo',
      globeNodes: initialGlobeNodes,
      weather: {
        temp: 24,
        humidity: 65,
        wind: 18,
        condition: 'Overcast, Cyber Rain imminent',
        forecast: [
          { day: 'MON', temp: 22, icon: 'cloud-rain' },
          { day: 'TUE', temp: 25, icon: 'cloud-sun' },
          { day: 'WED', temp: 28, icon: 'sun' },
          { day: 'THU', temp: 23, icon: 'cloud-lightning' },
        ]
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setListening: (listening) => set({ isListening: listening }),
      
      addLog: (type, message) => set((state) => ({
        logs: [
          { id: Math.random().toString(), type, message, timestamp: getTimestamp() },
          ...state.logs
        ].slice(0, 50)
      })),

      clearChat: () => set({ messages: [] }),

      addTask: (title) => set((state) => {
        const newTask: Task = {
          id: Math.random().toString(),
          title,
          completed: false,
        };
        return {
          tasks: [...state.tasks, newTask]
        };
      }),

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      sendMessage: async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'user',
          text,
          timestamp: getTimestamp(),
        };

        set((state) => ({
          messages: [...state.messages, userMsg],
          logs: [
            { id: Math.random().toString(), type: 'command' as const, message: `User executed: ${text}`, timestamp: getTimestamp() },
            ...state.logs
          ]
        }));

        // Intercept clear command immediately
        if (text.toLowerCase().trim() === '/clear') {
          setTimeout(() => {
            get().clearChat();
            get().addLog('info', 'Chat history purged');
          }, 500);
          return;
        }

        const clean = text.toLowerCase().trim();

        // Intercept weather / location searches
        if (clean.startsWith('/weather ') || clean.startsWith('/locate ')) {
          const newCity = clean.startsWith('/weather ') ? text.slice(9).trim() : text.slice(8).trim();
          if (newCity) {
            get().searchLocation(newCity);
          }
          return;
        }

        set({ isTyping: true });

        // Parse commands for immediate UI state transitions
        let isCommand = false;

        if (clean === '/optimize') {
          isCommand = true;
          setTimeout(() => get().optimizeSystem(), 500);
        } else if (clean.startsWith('/task ')) {
          isCommand = true;
          const taskName = text.slice(6).trim();
          if (taskName) {
            setTimeout(() => get().addTask(taskName), 300);
          }
        } else if (clean === '/system' || clean === '/help') {
          isCommand = true;
        }

        // Delay simulation
        const delay = 1000 + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // If it's a locally intercepted command, fetch local command response
        if (isCommand) {
          const { response, logs } = getMockAIResponse(text, get());
          
          set((state) => ({
            messages: [...state.messages, { id: Math.random().toString(), sender: 'assistant', text: response, timestamp: getTimestamp() }],
            isTyping: false,
            logs: [
              ...logs.map(msg => ({
                id: Math.random().toString(),
                type: msg.toLowerCase().includes('success') ? ('success' as const) : msg.toLowerCase().includes('warn') ? ('warn' as const) : ('info' as const),
                message: msg,
                timestamp: getTimestamp()
              })),
              ...state.logs
            ].slice(0, 50)
          }));
          
          speakText(response);
          return;
        }

        // If it is a conversational query, hit Google Gemini!
        if (genAI) {
          try {
            const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const model = genAI.getGenerativeModel({
              model: 'gemini-2.5-flash',
              systemInstruction: 
                "You are A.E.G.I.S., a futuristic military AI Operating System holographic interface inspired by Jarvis and Cyberpunk themes. " +
                "Your responses must be structured, cool, tech-infused, and direct. Keep them under 3 sentences unless asking for system configs. " +
                "Address the user as 'Commander' or 'Operator'.\n\n" +
                `Current Temporal Coordinates: Date: ${currentDate}, Time: ${currentTime}.`,
              generationConfig: {
                maxOutputTokens: 250,
                temperature: 0.7,
              }
            });

            // Filter and map history to standard roles ('user' and 'model')
            const rawHistory = get().messages
              .filter(m => m.sender === 'user' || m.sender === 'assistant');
            
            const startIndex = rawHistory.findIndex(m => m.sender === 'user');
            const sanitizedHistory = startIndex !== -1 
              ? rawHistory.slice(startIndex).map(m => ({
                  role: m.sender === 'user' ? ('user' as const) : ('model' as const),
                  parts: [{ text: m.text }]
                }))
              : [];

            const chat = model.startChat({
              history: sanitizedHistory
            });

            const result = await chat.sendMessage(text);
            const responseText = result.response.text().trim();

            set((state) => ({
              messages: [...state.messages, {
                id: Math.random().toString(),
                sender: 'assistant',
                text: responseText,
                timestamp: getTimestamp(),
              }],
              isTyping: false,
              logs: [
                { id: Math.random().toString(), type: 'success' as const, message: 'Gemini cognitive link response compiled successfully', timestamp: getTimestamp() },
                ...state.logs
              ].slice(0, 50)
            }));

            speakText(responseText);

          } catch (err: any) {
            console.error('Gemini API query failed:', err);
            get().addLog('warn', `Gemini API sync error: ${err.message || err}. Falling back to simulation...`);
            
            const { response, logs } = getMockAIResponse(text, get());
            set((state) => ({
              messages: [...state.messages, { id: Math.random().toString(), sender: 'assistant', text: response, timestamp: getTimestamp() }],
              isTyping: false,
              logs: [
                ...logs.map(msg => ({ id: Math.random().toString(), type: 'info' as const, message: msg, timestamp: getTimestamp() })),
                ...state.logs
              ].slice(0, 50)
            }));

            speakText(response);
          }
        } else {
          const { response, logs } = getMockAIResponse(text, get());
          set((state) => ({
            messages: [...state.messages, { id: Math.random().toString(), sender: 'assistant', text: response, timestamp: getTimestamp() }],
            isTyping: false,
            logs: [
              ...logs.map(msg => ({ id: Math.random().toString(), type: 'info' as const, message: msg, timestamp: getTimestamp() })),
              ...state.logs
            ].slice(0, 50)
          }));

          speakText(response);
        }
      },

      optimizeSystem: () => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            cpu: 10,
            ram: 34,
            temp: 33,
          }
        }));
        get().addLog('success', 'Optimized local thread clusters. Memory buffers flushed.');
      },

      fluctuateMetrics: () => {
        set((state) => {
          const { cpu, ram, temp, networkUp, networkDown } = state.metrics;
          const { cpuOverride, ramOverride, tempOverride } = state.adminSettings;
          
          const baseCpu = cpuOverride !== undefined ? cpuOverride : cpu;
          const baseRam = ramOverride !== undefined ? ramOverride : ram;
          const baseTemp = tempOverride !== undefined ? tempOverride : temp;

          const cpuDelta = (Math.random() - 0.5) * 6;
          const ramDelta = (Math.random() - 0.5) * 1.5;
          const tempDelta = (Math.random() - 0.5) * 2;
          
          const newCpu = Math.max(5, Math.min(100, Math.round(baseCpu + cpuDelta)));
          const newRam = Math.max(5, Math.min(100, Math.round(baseRam + ramDelta)));
          const newTemp = Math.max(15, Math.min(95, Math.round(baseTemp + tempDelta)));
          
          const upDelta = (Math.random() - 0.5) * 2;
          const downDelta = (Math.random() - 0.5) * 15;
          const newUp = Math.max(1, Math.min(50, Math.round((networkUp + upDelta) * 10) / 10));
          const newDown = Math.max(10, Math.min(300, Math.round((networkDown + downDelta) * 10) / 10));

          return {
            metrics: {
              ...state.metrics,
              cpu: newCpu,
              ram: newRam,
              temp: newTemp,
              networkUp: newUp,
              networkDown: newDown,
            }
          };
        });
      },

      changeCity: (city) => {
        if (city === 'None') {
          set({ activeCity: 'None' });
          get().addLog('info', 'Orbital coordinate lock released.');
          return;
        }
        get().searchLocation(city);
      },

      searchLocation: async (query) => {
        if (!query.trim()) return;

        set({ isTyping: true });
        get().addLog('info', `Engaging tactical radar sweep for: ${query}`);

        let resolvedName = query;
        let lat = 0;
        let lng = 0;
        let temp = 22;
        let humidity = 50;
        let wind = 10;
        let baseCondition = 'Clear Skies';
        let weathercode = 0;
        let forecast = [
          { day: 'MON', temp: 20, icon: 'cloud-sun' },
          { day: 'TUE', temp: 22, icon: 'sun' },
          { day: 'WED', temp: 25, icon: 'sun' },
          { day: 'THU', temp: 21, icon: 'cloud-rain' }
        ];

        let geocodingSuccess = false;

        try {
          // 1. Fetch Geocoding from Open-Meteo (completely free, no API key needed)
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en`);
          const geoJson = await geoRes.json();
          if (geoJson.results && geoJson.results.length > 0) {
            const geoData = geoJson.results[0];
            lat = geoData.latitude;
            lng = geoData.longitude;
            resolvedName = [geoData.name, geoData.admin1, geoData.country].filter(Boolean).join(', ');
            geocodingSuccess = true;

            // 2. Fetch Live Weather Telemetry (completely free, no API key needed)
            try {
              const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=relative_humidity_2m&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,weather_code&timezone=auto`);
              const weatherData = await weatherRes.json();
              if (weatherData.current_weather) {
                temp = Math.round(weatherData.current_weather.temperature);
                humidity = weatherData.current?.relative_humidity_2m || 50;
                wind = Math.round(weatherData.current_weather.windspeed);
                weathercode = weatherData.current_weather.weathercode ?? weatherData.current_weather.weather_code ?? 0;
                
                const mapped = mapWeatherCode(weathercode);
                baseCondition = mapped.condition;

                const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                const dailyTime = weatherData.daily?.time || [];
                const dailyMax = weatherData.daily?.temperature_2m_max || [];
                const dailyCode = weatherData.daily?.weathercode || weatherData.daily?.weather_code || [];

                if (dailyTime.length > 4) {
                  forecast = dailyTime.slice(1, 5).map((timeStr: string, index: number) => {
                    const date = new Date(timeStr);
                    const dayName = days[date.getDay()];
                    const maxTemp = Math.round(dailyMax[index + 1] ?? temp);
                    const code = dailyCode[index + 1] ?? 0;
                    const fMapped = mapWeatherCode(code);
                    return {
                      day: dayName,
                      temp: maxTemp,
                      icon: fMapped.icon
                    };
                  });
                }
              }
            } catch (wErr) {
              console.error('Weather fetching failed:', wErr);
            }
          }
        } catch (gErr) {
          console.error('Geocoding failed:', gErr);
        }

        let data;

        if (geocodingSuccess) {
          if (genAI) {
            try {
              const prompt = `
                We are targeting the location: "${resolvedName}" at coordinates [LAT: ${lat.toFixed(4)}, LNG: ${lng.toFixed(4)}].
                Live real-time weather metrics are:
                - Temperature: ${temp}°C
                - Humidity: ${humidity}%
                - Wind Speed: ${wind} km/h
                - Weather Condition: "${baseCondition}" (WMO code ${weathercode}).

                Please analyze this and return a strict JSON object matching the theme of a futuristic military AI Operating System (A.E.G.I.S. OS) set in the future (e.g. 2026/cyberpunk vibe).
                
                JSON Format template:
                {
                  "name": "${resolvedName}",
                  "lat": ${lat},
                  "lng": ${lng},
                  "weather": {
                    "temp": ${temp},
                    "humidity": ${humidity},
                    "wind": ${wind},
                    "condition": "A cool cyberpunk-themed conversion of the base condition (e.g. 'Acid Haze', 'Clear Ion Sky', 'Heavy Cyber Rain' or 'Ion Fog')",
                    "forecast": [
                      { "day": "${forecast[0].day}", "temp": ${forecast[0].temp}, "icon": "${forecast[0].icon}" },
                      { "day": "${forecast[1].day}", "temp": ${forecast[1].temp}, "icon": "${forecast[1].icon}" },
                      { "day": "${forecast[2].day}", "temp": ${forecast[2].temp}, "icon": "${forecast[2].icon}" },
                      { "day": "${forecast[3].day}", "temp": ${forecast[3].temp}, "icon": "${forecast[3].icon}" }
                    ]
                  },
                  "news": [
                    {
                      "title": "A futuristic regional news headline related to this location/region (set in 2026 or later, cyberpunk theme)",
                      "summary": "Short 1-2 sentence futuristic summary of this news event.",
                      "source": "Futuristic news agency",
                      "time": "5m ago"
                    },
                    {
                      "title": "Another futuristic regional news headline...",
                      "summary": "Short summary...",
                      "source": "Futuristic news agency",
                      "time": "1h ago"
                    }
                  ],
                  "logMessage": "A tech-style satellite confirmation log (e.g. 'Orbital uplink locked on sector ${resolvedName.replace(/'/g, '')}')"
                }

                Do not wrap the response in markdown blocks (e.g. do not use \`\`\`json). Return ONLY the raw JSON string starting with { and ending with }.
              `;

              const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
              const result = await model.generateContent(prompt);
              const textResult = result.response.text().trim();
              
              let cleanText = textResult;
              if (cleanText.includes('```')) {
                cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
              }

              data = JSON.parse(cleanText);
            } catch (e: any) {
              console.error('Gemini location parse failed, falling back to clean telemetry:', e);
              data = {
                name: resolvedName,
                lat,
                lng,
                weather: {
                  temp,
                  humidity,
                  wind,
                  condition: `Cyber-${baseCondition}`,
                  forecast
                },
                news: [
                  {
                    title: `${resolvedName.split(',')[0]} Quantum Node Activated`,
                    summary: `Orbital satellites verified dynamic alignment for sector grid ${resolvedName.split(',')[0]}.`,
                    source: 'AEGIS OS Intel',
                    time: '1m ago'
                  },
                  {
                    title: `Regional weather grid locks at ${temp}°C`,
                    summary: `Live data confirms weather sensors stabilized. Condition matches ${baseCondition.toLowerCase()}.`,
                    source: 'Weather Net',
                    time: '10m ago'
                  }
                ],
                logMessage: `Satellite scan mapped new node coordinates for ${resolvedName}`
              };
            }
          } else {
            // Live data but mock news if no Gemini
            data = {
              name: resolvedName,
              lat,
              lng,
              weather: {
                temp,
                humidity,
                wind,
                condition: `Cyber-${baseCondition}`,
                forecast
              },
              news: [
                {
                  title: `${resolvedName.split(',')[0]} Grid Synchronized`,
                  summary: `Local servers in ${resolvedName.split(',')[0]} aligned with the AEGIS orbital network.`,
                  source: 'AEGIS OS Intel',
                  time: '1m ago'
                },
                {
                  title: `Environmental telemetry online`,
                  summary: `Sensors reporting ${temp}°C and ${baseCondition.toLowerCase()}. Grid shield efficiency at 99.4%.`,
                  source: 'Weather Net',
                  time: '10m ago'
                }
              ],
              logMessage: `Satellite scan mapped new node coordinates for ${resolvedName}`
            };
          }
        } else {
          // Fallback if geocoding failed
          data = getMockLocationData(query);
        }

        const existingNode = get().globeNodes.find(
          (node) => node.name.toLowerCase() === data.name.toLowerCase() ||
                    node.name.toLowerCase().includes(data.name.toLowerCase()) ||
                    data.name.toLowerCase().includes(node.name.toLowerCase())
        );

        let finalNodeName = data.name;
        if (!existingNode) {
          const CYBER_COLORS = ['#00f0ff', '#3b82f6', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];
          const randomColor = CYBER_COLORS[Math.floor(Math.random() * CYBER_COLORS.length)];
          const newNode: GlobeNode = {
            name: data.name,
            lat: data.lat,
            lng: data.lng,
            color: randomColor,
          };
          set((state) => ({
            globeNodes: [...state.globeNodes, newNode]
          }));
        } else {
          finalNodeName = existingNode.name;
        }

        // Add news unique IDs (since Gemini doesn't guarantee IDs)
        const newsWithIds = data.news.map((item: any, i: number) => ({
          id: `news-${Date.now()}-${i}`,
          title: item.title,
          summary: item.summary,
          source: item.source,
          time: item.time
        }));

        set({
          activeCity: finalNodeName,
          weather: data.weather,
          news: newsWithIds,
          isTyping: false
        });

        const feedbackText = `Tactical sweep complete. Target coordinates locked on **${finalNodeName}** [LAT: ${data.lat.toFixed(2)}, LNG: ${data.lng.toFixed(2)}]. Live weather telemetry synced: **${data.weather.temp}°C**, **${data.weather.condition}**.`;
        
        const aegisMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'assistant',
          text: feedbackText,
          timestamp: getTimestamp(),
        };

        set((state) => ({
          messages: [...state.messages, aegisMsg]
        }));

        get().addLog('success', data.logMessage || `Dynamic coordinate node registered: ${finalNodeName}`);
        speakText(`Tactical radar sweep complete. Target locked on ${finalNodeName}. Live weather is ${data.weather.temp} degrees.`);
      },

      setAdminOpen: (open) => set({ isAdminOpen: open }),

      updateAdminSettings: (settings) => set((state) => {
        const nextSettings = { ...state.adminSettings, ...settings };
        
        let nextMetrics = state.metrics;
        if (settings.hasOwnProperty('cpuOverride') || settings.hasOwnProperty('ramOverride') || settings.hasOwnProperty('tempOverride')) {
          nextMetrics = {
            ...state.metrics,
            cpu: settings.cpuOverride !== undefined ? settings.cpuOverride : state.metrics.cpu,
            ram: settings.ramOverride !== undefined ? settings.ramOverride : state.metrics.ram,
            temp: settings.tempOverride !== undefined ? settings.tempOverride : state.metrics.temp,
          };
        }

        return {
          adminSettings: nextSettings,
          metrics: nextMetrics
        };
      }),

      exportLogs: () => {
        const logs = get().logs;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `AEGIS_Logs_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        get().addLog('success', 'System telemetry logs archived and exported.');
      },

      clearLogs: () => {
        set({ logs: [] });
        get().addLog('info', 'System telemetry logs purged.');
      }
    }),
    {
      name: 'aegis-os-storage',
      // Store tasks, logs, dialogue logs and settings in localStorage
      partialize: (state) => ({
        messages: state.messages,
        tasks: state.tasks,
        activeCity: state.activeCity,
        weather: state.weather,
        logs: state.logs,
        globeNodes: state.globeNodes,
        adminSettings: state.adminSettings,
      }),
    }
  )
);
