import React from 'react';
import { 
  Compass, 
  Zap, 
  Footprints, 
  Trophy, 
  TrendingDown, 
  BarChart3 
} from 'lucide-react';

export default function MetricsPanel({
  episode,
  maxEpisodes,
  epsilon,
  currentSteps,
  goalsReached,
  totalSteps,
  history = []
}) {
  const episodeProgress = maxEpisodes > 0 ? Math.min(100, Math.round(((episode + 1) / maxEpisodes) * 100)) : 0;
  
  // Categorize agent exploration stage
  const getEpsilonPhase = (eps) => {
    if (eps > 0.6) return { label: 'High Exploration', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (eps > 0.2) return { label: 'Balanced Learning', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
    return { label: 'Policy Exploitation', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  };

  const phase = getEpsilonPhase(epsilon);

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-400" />
          Live Agent Telemetry
        </span>
        <span className="text-xs font-mono text-slate-500">
          Total Moves: {totalSteps.toLocaleString()}
        </span>
      </h2>

      {/* Episode Progress Card */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Training Progress
          </span>
          <span className="text-xs font-mono font-bold text-slate-200">
            Ep <span className="text-sky-400">{episode >= 0 ? episode + 1 : 0}</span> / {maxEpisodes}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${episodeProgress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1.5">
          <span>{episodeProgress}% Completed</span>
          <span>Target: {maxEpisodes} eps</span>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Epsilon Exploration Gauge */}
        <div className="glass-card p-3.5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              Epsilon (&epsilon;)
            </span>
            <TrendingDown className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight text-white">
              {(epsilon * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              value: {epsilon.toFixed(3)}
            </div>
          </div>

          <div className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold text-center ${phase.bg} ${phase.color}`}>
            {phase.label}
          </div>
        </div>

        {/* Goals Reached & Episode Steps */}
        <div className="glass-card p-3.5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Goals Reached
            </span>
            <Footprints className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight text-amber-400">
              {goalsReached}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Current Ep Steps: <span className="text-white font-bold">{currentSteps}</span>
            </div>
          </div>

          <div className="px-2 py-0.5 rounded-md border text-[10px] font-semibold text-center bg-slate-800 text-slate-300 border-slate-700">
            DQN Policy Net
          </div>
        </div>
      </div>

      {/* Mini History Sparkline SVG */}
      <div className="glass-card p-3.5 rounded-xl">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-sky-400" />
            Epsilon Decay Curve
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {history.length > 0 ? `${history.length} data points` : 'Awaiting data'}
          </span>
        </div>

        <div className="h-16 w-full flex items-end">
          {history.length > 1 ? (
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${Math.max(10, history.length - 1)} 100`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="epsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <polygon
                fill="url(#epsGrad)"
                points={`0,100 ${history.map((h, i) => `${i},${100 - (h.epsilon * 100)}`).join(' ')} ${history.length - 1},100`}
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                points={history.map((h, i) => `${i},${100 - (h.epsilon * 100)}`).join(' ')}
              />
            </svg>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-600 font-mono">
              Start training to plot epsilon curve
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
