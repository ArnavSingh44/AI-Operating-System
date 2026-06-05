import { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../store/useOSStore';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  supported: boolean;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const isListening = useOSStore((state) => state.isListening);
  const setListening = useOSStore((state) => state.setListening);
  const sendMessage = useOSStore((state) => state.sendMessage);
  const addLog = useOSStore((state) => state.addLog);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Maintain hot-refs to Zustand actions to avoid re-running Speech init on state changes
  const handlersRef = useRef({ sendMessage, setListening, addLog });
  
  useEffect(() => {
    handlersRef.current = { sendMessage, setListening, addLog };
  }, [sendMessage, setListening, addLog]);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        handlersRef.current.setListening(true);
        setTranscript('');
        handlersRef.current.addLog('info', 'Microphone active. Listening for holographic command...');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        handlersRef.current.addLog('error', `Speech input error: ${event.error}`);
        handlersRef.current.setListening(false);
      };

      recognition.onend = () => {
        handlersRef.current.setListening(false);
      };

      recognition.onresult = (event: any) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        handlersRef.current.addLog('success', `Speech decoded: "${currentTranscript}"`);
        
        // Dispatch decoded transcript
        handlersRef.current.sendMessage(currentTranscript);
      };

      recognitionRef.current = recognition;
    } else {
      setSupported(false);
    }
  }, []); // Empty dependency array ensures instance is created exactly once

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    } else if (!supported) {
      // Safe fallback simulator for unsupported environments
      setListening(true);
      addLog('warn', 'Voice module fallback: Speech API not supported. Simulating input...');
      
      const mockPhrases = [
        '/optimize',
        '/system',
        'what is the weather in Neo Tokyo',
        '/task Recalibrate energy grid',
        'hello Jarvis',
      ];
      
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      
      setTimeout(() => {
        setTranscript(randomPhrase);
        addLog('success', `Voice simulated: "${randomPhrase}"`);
        sendMessage(randomPhrase);
        setListening(false);
      }, 2500);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Failed to stop speech recognition:', err);
      }
      setListening(false);
    } else if (!supported && isListening) {
      setListening(false);
      addLog('info', 'Simulated voice input aborted');
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    supported,
  };
};
