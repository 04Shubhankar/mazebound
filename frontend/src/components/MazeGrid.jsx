import React, { useState, useRef, useEffect } from 'react';
import { Flag, Trophy, Bot, Sparkles, ShieldAlert } from 'lucide-react';
import { GRID_SIZE } from '../utils/presets';

export default function MazeGrid({
  maze,
  agentPos,
  trail = [],
  onCellToggle,
  isTraining,
  onMazeChange
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [drawMode, setDrawMode] = useState(null); // 1 = paint wall, 0 = erase wall
  const containerRef = useRef(null);

  // Stop mouse drawing when releasing anywhere on window
  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
      setDrawMode(null);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const isStart = (r, c) => r === 0 && c === 0;
  const isGoal = (r, c) => r === GRID_SIZE - 1 && c === GRID_SIZE - 1;
  const isAgent = (r, c) => agentPos && agentPos[0] === r && agentPos[1] === c;

  const handleCellMouseDown = (r, c) => {
    if (isStart(r, c) || isGoal(r, c)) return;
    if (isTraining) return;

    const currentVal = maze[r][c];
    const nextVal = currentVal === 1 ? 0 : 1;
    setIsMouseDown(true);
    setDrawMode(nextVal);
    onCellToggle(r, c, nextVal);
  };

  const handleCellMouseEnter = (r, c) => {
    if (!isMouseDown || drawMode === null) return;
    if (isStart(r, c) || isGoal(r, c)) return;
    if (isTraining) return;

    if (maze[r][c] !== drawMode) {
      onCellToggle(r, c, drawMode);
    }
  };

  // Find index in trail to calculate trail fade/heat
  const getTrailIndex = (r, c) => {
    for (let i = trail.length - 1; i >= 0; i--) {
      if (trail[i][0] === r && trail[i][1] === c) {
        return trail.length - 1 - i; // 0 is most recent previous step
      }
    }
    return -1;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Maze Grid Frame */}
      <div className="relative p-3.5 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
        {/* Top coordinate numbers */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2 mb-2 px-1 text-center">
          {Array.from({ length: GRID_SIZE }, (_, i) => (
            <span key={i} className="text-[10px] sm:text-xs font-mono text-slate-500 font-semibold">
              {i}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Left coordinate numbers */}
          <div className="grid grid-rows-10 gap-1.5 sm:gap-2 py-1 text-right pr-1">
            {Array.from({ length: GRID_SIZE }, (_, i) => (
              <span key={i} className="text-[10px] sm:text-xs font-mono text-slate-500 font-semibold flex items-center justify-end">
                {i}
              </span>
            ))}
          </div>

          {/* Main Grid */}
          <div
            ref={containerRef}
            className="grid grid-cols-10 grid-rows-10 gap-1.5 sm:gap-2 bg-slate-950/80 p-2 sm:p-3 rounded-xl border border-slate-800 select-none shadow-inner"
            style={{
              width: 'min(78vw, 460px)',
              height: 'min(78vw, 460px)',
            }}
          >
            {maze.map((row, r) =>
              row.map((cell, c) => {
                const isCellStart = isStart(r, c);
                const isCellGoal = isGoal(r, c);
                const isCellAgent = isAgent(r, c);
                const isWall = cell === 1;
                const trailIdx = !isCellAgent && !isWall && !isCellStart && !isCellGoal ? getTrailIndex(r, c) : -1;

                let cellClasses = 'relative rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 maze-cell aspect-square';

                if (isCellAgent) {
                  cellClasses += ' bg-sky-500/30 border-2 border-sky-400 z-20 shadow-[0_0_15px_rgba(56,189,248,0.8)] scale-105';
                } else if (isCellStart) {
                  cellClasses += ' bg-emerald-500/20 border-2 border-emerald-500/60 z-10 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
                } else if (isCellGoal) {
                  cellClasses += ' bg-amber-500/25 border-2 border-amber-400 z-10 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
                } else if (isWall) {
                  cellClasses += ' bg-slate-800 border border-slate-700 shadow-md shadow-black/40';
                } else if (trailIdx >= 0 && trailIdx < 12) {
                  // Recent path trail
                  const opacity = Math.max(0.15, (12 - trailIdx) / 12);
                  cellClasses += ' bg-cyan-500/15 border border-cyan-500/30';
                } else {
                  cellClasses += ' bg-slate-900/60 border border-slate-800/80 hover:border-slate-600 hover:bg-slate-800/40';
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseDown={() => handleCellMouseDown(r, c)}
                    onMouseEnter={() => handleCellMouseEnter(r, c)}
                    className={cellClasses}
                  >
                    {/* Start Flag */}
                    {isCellStart && !isCellAgent && (
                      <div className="flex flex-col items-center">
                        <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
                        <span className="text-[8px] font-mono font-bold text-emerald-400 hidden sm:block">START</span>
                      </div>
                    )}

                    {/* Goal Trophy */}
                    {isCellGoal && !isCellAgent && (
                      <div className="flex flex-col items-center">
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-bounce" />
                        <span className="text-[8px] font-mono font-bold text-amber-400 hidden sm:block">GOAL</span>
                      </div>
                    )}

                    {/* Agent Avatar */}
                    {isCellAgent && (
                      <div className="flex flex-col items-center justify-center animate-pulse-glow">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-200 flex items-center justify-center text-slate-950 shadow-lg">
                          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 stroke-[2.5]" />
                        </div>
                        {isCellGoal && (
                          <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-spin" />
                        )}
                      </div>
                    )}

                    {/* Wall Texture Overlay */}
                    {isWall && (
                      <div className="w-full h-full rounded-md flex items-center justify-center bg-gradient-to-br from-slate-700/60 via-slate-800 to-slate-900 border border-slate-600/40">
                        <div className="w-1.5 h-1.5 rounded-sm bg-slate-600/50"></div>
                      </div>
                    )}

                    {/* Trail Dot */}
                    {trailIdx >= 0 && trailIdx < 12 && !isCellAgent && !isWall && !isCellStart && !isCellGoal && (
                      <div
                        className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                        style={{ opacity: Math.max(0.2, (12 - trailIdx) / 12) }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Training Lock Notice */}
        {isTraining && (
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] rounded-2xl pointer-events-none flex items-end justify-center pb-2">
            <span className="text-[11px] font-mono text-cyan-300 bg-slate-900/90 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              Live Agent Streaming Active
            </span>
          </div>
        )}
      </div>

      {/* Grid Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-slate-400 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-xl">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center">
            <Flag className="w-2.5 h-2.5 text-emerald-400" />
          </div>
          <span>Start (0,0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-amber-500/25 border border-amber-400 flex items-center justify-center">
            <Trophy className="w-2.5 h-2.5 text-amber-400" />
          </div>
          <span>Goal (9,9)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-sky-500/40 border border-sky-400 flex items-center justify-center">
            <Bot className="w-2.5 h-2.5 text-sky-200" />
          </div>
          <span>Agent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700"></div>
          <span>Wall (Click/Drag)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
          </div>
          <span>Path Trail</span>
        </div>
      </div>
    </div>
  );
}
