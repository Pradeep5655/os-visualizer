import React from 'react';
import { getProcessColor } from '../utils/colors';
import { LayoutGrid } from 'lucide-react';

const STATE_STYLES = {
  New: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  Ready: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  Running: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-400/40',
  Waiting: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
  Terminated: 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 line-through decoration-slate-400',
};

export default function ProcessStateBoard({ currentStep = null, processes = [] }) {
  const states = currentStep && currentStep.states ? currentStep.states : {};

  // Extract process pids either from currentStep.states or input processes
  const pids = Object.keys(states).length > 0
    ? Object.keys(states)
    : processes.map((p) => p.pid);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Process Lifecycle States</h3>
        </div>
        <span className="text-[11px] text-slate-400">PCB Status</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {pids.map((pid) => {
          const state = states[pid] || 'New';
          const color = getProcessColor(pid);
          const stateStyle = STATE_STYLES[state] || STATE_STYLES.New;

          return (
            <div
              key={pid}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-xs transition-all duration-200"
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                  {pid}
                </span>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${stateStyle}`}
              >
                {state}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
