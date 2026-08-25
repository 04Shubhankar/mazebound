import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Trash2, 
  Sliders, 
  Layers, 
  Gauge, 
  Settings2, 
  ChevronDown, 
  ChevronUp,
  Cpu
} from 'lucide-react';
import { PRESET_MAZES } from '../utils/presets';

export default function Controls({
  isTraining,
  onStartTraining,
  onStopTraining,
  onClearMaze,
  onApplyPreset,
  episodes,
  setEpisodes,
  throttleMs,
  setThrottleMs,
  wsUrl,
  setWsUrl,
  wallCount
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Action Card */}
      <div className="glass-panel p-5 rounded-2xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          Agent Training Controls
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          {!isTraining ? (
            <button
              onClick={onStartTraining}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              Start RL Training
            </button>
          ) : (
            <button
              onClick={onStopTraining}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4 fill-white" />
              Stop Training
            </button>
          )}

          <button
            onClick={onClearMaze}
            disabled={isTraining}
            className="py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4 text-slate-400" />
            Clear Walls
          </button>
        </div>

        {/* Preset Maze Templates */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Maze Templates
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {wallCount} walls placed
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(PRESET_MAZES).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => onApplyPreset(key)}
                disabled={isTraining}
                className="px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white text-left transition-all flex flex-col gap-0.5 group"
              >
                <span className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                  {preset.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {preset.description.split('.')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration & Sliders */}
      <div className="glass-panel p-5 rounded-2xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          Simulation Parameters
        </h2>

        <div className="space-y-4">
          {/* Episode Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-300">Training Episodes</span>
              <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {episodes} eps
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="20"
              value={episodes}
              disabled={isTraining}
              onChange={(e) => setEpisodes(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>20</span>
              <span>500</span>
              <span>1000</span>
              <span>2000</span>
            </div>
          </div>

          {/* Throttle / Render Delay */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                Step Playback Delay
              </span>
              <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {throttleMs === 0 ? 'Max Speed' : `${throttleMs} ms`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="10"
              value={throttleMs}
              onChange={(e) => setThrottleMs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0ms (Full Speed)</span>
              <span>50ms</span>
              <span>150ms (Slow-Mo)</span>
            </div>
          </div>

          {/* Advanced WebSocket URL accordion */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5" />
                Connection Settings
              </span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-2">
                <label className="text-[11px] text-slate-400">WebSocket Endpoint URL</label>
                <input
                  type="text"
                  value={wsUrl}
                  disabled={isTraining}
                  onChange={(e) => setWsUrl(e.target.value)}
                  placeholder="ws://localhost:8000/ws"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 disabled:opacity-50"
                />
                <p className="text-[10px] text-slate-500">
                  Ensure the FastAPI backend is running via <code className="text-slate-400">uvicorn backend.main:app --reload</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
