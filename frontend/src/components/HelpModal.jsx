import React from 'react';
import { X, Bot, Compass, Brain, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">How Mazebound Works</h2>
            <p className="text-xs text-slate-400">Deep Q-Network Reinforcement Learning in the Browser</p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-sky-400" />
              1. The Reinforcement Learning Agent
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The agent starts at the top-left <span className="text-emerald-400 font-bold">(0,0)</span> and aims to reach the goal at bottom-right <span className="text-amber-400 font-bold">(9,9)</span>. It receives a reward of <code className="text-emerald-300 font-mono">+100</code> when reaching the goal, and a penalty of <code className="text-rose-300 font-mono">-1</code> for every step or wall collision.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-amber-400" />
              2. Exploration vs. Exploitation (&epsilon;-Greedy)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              At the beginning (&epsilon; = 1.0), the agent moves completely at random to explore the maze. Over consecutive training episodes, &epsilon; gradually decays down towards 0.01, shifting the agent from pure exploration to exploiting its learned Q-value policy net to take the shortest path.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-purple-400" />
              3. Interactive Wall Drawing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click or drag across the 10x10 grid when training is paused to toggle walls. You can also pick from predefined presets (Classic Zigzag, Spiral Labyrinth, Choke Point) or generate a procedural layout!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              4. Real-Time Streaming & Controls
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use the playback delay slider to slow down visualization and observe the agent's step-by-step decision making, or set it to max speed for rapid neural network convergence.
            </p>
          </div>
        </div>

        {/* Footer button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all"
          >
            Got it, Let's Train!
          </button>
        </div>
      </div>
    </div>
  );
}
