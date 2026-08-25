import React from 'react';
import { Bot, Activity, Wifi, WifiOff, HelpCircle, RefreshCw } from 'lucide-react';

export default function Header({ 
  status, 
  onResetAgent, 
  onOpenHelp, 
  episodeCount, 
  maxEpisodes 
}) {
  const getStatusBadge = () => {
    switch (status) {
      case 'training':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Training Active ({episodeCount}/{maxEpisodes})
          </span>
        );
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Wifi className="w-3.5 h-3.5" />
            Backend Ready
          </span>
        );
      case 'connecting':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            Connecting...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <WifiOff className="w-3.5 h-3.5" />
            Disconnected
          </span>
        );
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Mazebound
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-md">
                DQN RL
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Real-time Deep Q-Network Agent Navigation Visualizer
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {getStatusBadge()}

          <button
            onClick={onResetAgent}
            title="Reset Agent View"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guide & RL Info</span>
          </button>
        </div>
      </div>
    </header>
  );
}
