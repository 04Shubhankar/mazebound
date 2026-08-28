import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import MazeGrid from './components/MazeGrid';
import Controls from './components/Controls';
import MetricsPanel from './components/MetricsPanel';
import HelpModal from './components/HelpModal';
import { createEmptyGrid, PRESET_MAZES, GRID_SIZE } from './utils/presets';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // Maze & Agent State
  const [maze, setMaze] = useState(() => PRESET_MAZES.zigzag.generate());
  const [agentPos, setAgentPos] = useState([0, 0]);
  const [trail, setTrail] = useState([]);
  
  // Training & Configuration State
  const [isTraining, setIsTraining] = useState(false);
  const [status, setStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'training'
  const [episodes, setEpisodes] = useState(500);
  const [throttleMs, setThrottleMs] = useState(0); // playback delay in ms (0 = max speed)
  const [wsUrl, setWsUrl] = useState('ws://localhost:8000/ws');
  const [errorMessage, setErrorMessage] = useState(null);

  // Metrics State
  const [currentEpisode, setCurrentEpisode] = useState(-1);
  const [currentEpsilon, setCurrentEpsilon] = useState(1.0);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [goalsReached, setGoalsReached] = useState(0);
  const [history, setHistory] = useState([]); // [{ episode, epsilon }]

  // UI Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Refs for managing WebSocket and frame throttle queue
  const wsRef = useRef(null);
  const queueRef = useRef([]);
  const isProcessingQueueRef = useRef(false);
  const throttleMsRef = useRef(throttleMs);
  const currentEpisodeRef = useRef(currentEpisode);
  const lastPosRef = useRef([0, 0]);

  // Keep throttleMsRef in sync
  useEffect(() => {
    throttleMsRef.current = throttleMs;
  }, [throttleMs]);

  // Count placed walls
  const wallCount = maze.reduce((acc, row) => acc + row.filter(cell => cell === 1).length, 0);

  // Handle cell toggle
  const handleCellToggle = useCallback((row, col, value) => {
    if (isTraining) return;
    setMaze((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  }, [isTraining]);

  // Handle presets
  const handleApplyPreset = (key) => {
    if (isTraining) return;
    const preset = PRESET_MAZES[key];
    if (preset) {
      setMaze(preset.generate());
      setAgentPos([0, 0]);
      setTrail([]);
      setErrorMessage(null);
    }
  };

  // Clear all walls
  const handleClearMaze = () => {
    if (isTraining) return;
    setMaze(createEmptyGrid());
    setAgentPos([0, 0]);
    setTrail([]);
    setErrorMessage(null);
  };

  // Reset agent position
  const handleResetAgent = () => {
    setAgentPos([0, 0]);
    setTrail([]);
  };

  // Process incoming frame
  const applyFrame = useCallback((frame) => {
    const { agent_pos, episode, epsilon } = frame;
    const isNewEpisode = episode !== currentEpisodeRef.current;

    if (isNewEpisode) {
      currentEpisodeRef.current = episode;
      setCurrentEpisode(episode);
      setCurrentSteps(0);
      setTrail([]);
      setHistory((prev) => {
        // Record up to 100 historical points for sparkline
        if (prev.length === 0 || prev[prev.length - 1].episode !== episode) {
          const updated = [...prev, { episode, epsilon }];
          return updated.slice(-100);
        }
        return prev;
      });
    } else {
      setCurrentSteps((prev) => prev + 1);
    }

    // Check goal hit
    if (agent_pos[0] === GRID_SIZE - 1 && agent_pos[1] === GRID_SIZE - 1) {
      setGoalsReached((prev) => prev + 1);
    }

    setAgentPos(agent_pos);
    setCurrentEpsilon(epsilon);
    setTotalSteps((prev) => prev + 1);

    // Update trail
    setTrail((prev) => {
      const nextTrail = [...prev, agent_pos];
      return nextTrail.slice(-15);
    });

    lastPosRef.current = agent_pos;
  }, []);

  // Process frame queue with throttle
  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isProcessingQueueRef.current = false;
      return;
    }

    isProcessingQueueRef.current = true;
    const frame = queueRef.current.shift();
    applyFrame(frame);

    const delay = throttleMsRef.current;
    if (delay > 0) {
      setTimeout(processQueue, delay);
    } else {
      // If queue is getting long during max speed, skip frames or process in microtask
      if (queueRef.current.length > 50) {
        // Skip ahead to maintain high FPS without UI lag
        const latest = queueRef.current.pop();
        queueRef.current = [];
        if (latest) applyFrame(latest);
      }
      requestAnimationFrame(processQueue);
    }
  }, [applyFrame]);

  // Start Training WebSocket
  const handleStartTraining = () => {
    setErrorMessage(null);
    setStatus('connecting');
    setCurrentEpisode(0);
    setCurrentSteps(0);
    setTotalSteps(0);
    setGoalsReached(0);
    setHistory([]);
    setTrail([]);
    queueRef.current = [];
    currentEpisodeRef.current = -1;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('training');
        setIsTraining(true);

        // Send payload expected by backend/main.py
        const payload = {
          episodes: episodes,
          maze: maze
        };
        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.agent_pos) {
            queueRef.current.push(data);
            if (!isProcessingQueueRef.current) {
              processQueue();
            }
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket encountered an error:', err);
        setErrorMessage(`Failed to connect to backend at ${wsUrl}. Ensure FastAPI server is running on port 8000.`);
        setStatus('disconnected');
        setIsTraining(false);
      };

      ws.onclose = () => {
        setStatus('connected');
        setIsTraining(false);
      };
    } catch (err) {
      setErrorMessage(`WebSocket initialization error: ${err.message}`);
      setStatus('disconnected');
      setIsTraining(false);
    }
  };

  // Stop Training
  const handleStopTraining = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    queueRef.current = [];
    isProcessingQueueRef.current = false;
    setIsTraining(false);
    setStatus('connected');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#070a10] text-slate-100 selection:bg-sky-500 selection:text-black">
      {/* App Header */}
      <Header
        status={status}
        onResetAgent={handleResetAgent}
        onOpenHelp={() => setIsHelpOpen(true)}
        episodeCount={currentEpisode >= 0 ? currentEpisode + 1 : 0}
        maxEpisodes={episodes}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Error Alert if backend is unreachable */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 3-Column / Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Simulation Controls (4 cols) */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <Controls
              isTraining={isTraining}
              onStartTraining={handleStartTraining}
              onStopTraining={handleStopTraining}
              onClearMaze={handleClearMaze}
              onApplyPreset={handleApplyPreset}
              episodes={episodes}
              setEpisodes={setEpisodes}
              throttleMs={throttleMs}
              setThrottleMs={setThrottleMs}
              wsUrl={wsUrl}
              setWsUrl={setWsUrl}
              wallCount={wallCount}
            />
          </div>

          {/* Center Column: Interactive Maze Canvas (5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center">
            <MazeGrid
              maze={maze}
              agentPos={agentPos}
              trail={trail}
              onCellToggle={handleCellToggle}
              isTraining={isTraining}
            />
          </div>

          {/* Right Column: Live Metrics & Exploration Dashboard (3 cols) */}
          <div className="lg:col-span-3 order-3">
            <MetricsPanel
              episode={currentEpisode}
              maxEpisodes={episodes}
              epsilon={currentEpsilon}
              currentSteps={currentSteps}
              goalsReached={goalsReached}
              totalSteps={totalSteps}
              history={history}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/40 py-4 px-6 text-center text-xs text-slate-500">
        <p>Mazebound &bull; Deep Q-Network Maze Navigation with PyTorch, Gymnasium & React</p>
      </footer>

      {/* Help / Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
