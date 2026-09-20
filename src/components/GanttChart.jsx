import React from 'react';
import { getProcessColor } from '../utils/colors';
import { Activity } from 'lucide-react';

export default function GanttChart({ timeline = [], currentStep = null }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center text-xs text-slate-400">
        No timeline data available
      </div>
    );
  }

  const currentTime = currentStep ? currentStep.time : 0;
  const currentRunning = currentStep ? currentStep.running : null;

  // Filter visible blocks based on currentStep
  const visibleBlocks = timeline.filter((block) => {
    // Already completed blocks
    if (block.end <= currentTime) {
      return true;
    }
    // Currently active block
    if (block.start <= currentTime && currentTime < block.end) {
      if (block.pid === 'IDLE') {
        return currentRunning === null;
      }
      return currentRunning === block.pid;
    }
    return false;
  });

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gantt Chart</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Block</span>
          </span>
          <span className="font-mono">t = {currentTime}</span>
        </div>
      </div>

      {/* Gantt Bar Container with Horizontal Scroll */}
      <div className="overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {visibleBlocks.length === 0 ? (
          <div className="h-16 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
            Waiting for CPU execution to begin...
          </div>
        ) : (
          <div className="min-w-fit flex flex-col">
            {/* Blocks Row */}
            <div className="flex items-stretch h-14 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-950 p-0.5 gap-0.5">
              {visibleBlocks.map((block, idx) => {
                const duration = block.end - block.start;
                const isRunning =
                  block.start <= currentTime &&
                  currentTime < block.end &&
                  (block.pid === 'IDLE' ? currentRunning === null : currentRunning === block.pid);

                const color = getProcessColor(block.pid);

                return (
                  <div
                    key={`${block.pid}-${block.start}-${block.end}-${idx}`}
                    style={{
                      flexGrow: duration,
                      minWidth: `${Math.max(64, duration * 24)}px`,
                    }}
                    className={`relative flex flex-col items-center justify-center font-mono font-bold text-xs rounded-lg transition-all select-none ${
                      color.isIdle
                        ? 'bg-[repeating-linear-gradient(45deg,#94a3b8_0px,#94a3b8_10px,#cbd5e1_10px,#cbd5e1_20px)] dark:bg-[repeating-linear-gradient(45deg,#334155_0px,#334155_10px,#1e293b_10px,#1e293b_20px)] text-slate-700 dark:text-slate-200'
                        : `${color.bg} text-white`
                    } ${
                      isRunning
                        ? 'ring-4 ring-brand-400/60 dark:ring-brand-500/80 z-10 shadow-lg scale-y-105 animate-pulse'
                        : 'opacity-95'
                    }`}
                  >
                    <span className="tracking-wide">{block.pid}</span>
                    <span className="text-[10px] font-normal opacity-80">
                      Δ {duration}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Time Ticks Axis below blocks */}
            <div className="flex items-center pt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold select-none">
              {visibleBlocks.map((block, idx) => {
                const duration = block.end - block.start;
                return (
                  <div
                    key={`time-${block.start}-${idx}`}
                    style={{
                      flexGrow: duration,
                      minWidth: `${Math.max(64, duration * 24)}px`,
                    }}
                    className="flex justify-between px-0.5"
                  >
                    <span>{block.start}</span>
                    <span>{block.end}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
