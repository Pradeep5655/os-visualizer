import React from 'react';
import { getProcessColor } from '../utils/colors';
import { Layers, Cpu, ArrowRight } from 'lucide-react';

export default function ReadyQueue({ currentStep = null }) {
  const readyQueue = currentStep && Array.isArray(currentStep.readyQueue) ? currentStep.readyQueue : [];
  const runningPid = currentStep ? currentStep.running : null;
  const runningColor = getProcessColor(runningPid);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ready Queue & CPU</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">FIFO Order</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Ready Queue (Left 2 columns) */}
        <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[5rem]">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-brand-600 dark:text-brand-400 flex items-center gap-1">
              <span>← Head (Next Out)</span>
            </span>
            <span className="text-[10px] text-slate-400">Tail (New In) →</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 min-h-[2.5rem]">
            {readyQueue.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Queue is empty</span>
            ) : (
              readyQueue.map((pid, idx) => {
                const color = getProcessColor(pid);
                return (
                  <div
                    key={`${pid}-${idx}`}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all duration-200 animate-fade-in ${color.badge}`}
                  >
                    {idx === 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                    )}
                    <span>{pid}</span>
                    {idx === 0 && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-brand-200 dark:bg-brand-800 text-brand-800 dark:text-brand-200 font-sans">
                        Front
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dispatch Arrow + Active CPU Core (Right 1 column) */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-brand-500" />
              <span>CPU Core</span>
            </span>
          </div>

          <div className="flex items-center justify-center">
            {runningPid ? (
              <div
                className={`w-full py-2 px-3 rounded-xl border text-center font-mono font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm ${
                  runningColor.badge
                } ring-2 ring-brand-400/50 animate-pulse`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Running: {runningPid}</span>
              </div>
            ) : (
              <div className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center font-mono text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>CPU is Idle</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
