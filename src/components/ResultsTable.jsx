import React from 'react';
import { getProcessColor } from '../utils/colors';
import { Table, CheckCircle2, TrendingUp, Clock, Cpu } from 'lucide-react';

export default function ResultsTable({
  processes = [],
  averages = {},
  cpuUtilization = 100,
  currentStep = null,
  isLast = false,
}) {
  const states = currentStep && currentStep.states ? currentStep.states : {};

  // Check if all processes have completed
  const allTerminated =
    processes.length > 0 &&
    processes.every((p) => states[p.pid] === 'Terminated');

  const showFinalAverages = isLast || allTerminated;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Process Metrics Table</h3>
        </div>
        <div className="text-xs text-slate-400">
          Turnaround = CT − AT &nbsp;|&nbsp; Waiting = TAT − BT &nbsp;|&nbsp; Response = FirstRun − AT
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 font-sans font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">PID</th>
              <th className="py-3 px-4">Arrival Time (AT)</th>
              <th className="py-3 px-4">Burst Time (BT)</th>
              <th className="py-3 px-4">Completion Time (CT)</th>
              <th className="py-3 px-4">Turnaround Time (TAT)</th>
              <th className="py-3 px-4">Waiting Time (WT)</th>
              <th className="py-3 px-4">Response Time (RT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {processes.map((proc) => {
              const color = getProcessColor(proc.pid);
              const isTerminated = states[proc.pid] === 'Terminated';
              const isRunning = states[proc.pid] === 'Running';

              return (
                <tr
                  key={proc.pid}
                  className={`transition-colors ${
                    isRunning
                      ? 'bg-brand-50/40 dark:bg-brand-950/20'
                      : isTerminated
                      ? 'bg-white dark:bg-slate-900'
                      : 'bg-slate-50/50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {/* PID */}
                  <td className="py-3 px-4 font-bold flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                    <span className="text-slate-900 dark:text-slate-100">{proc.pid}</span>
                    {isTerminated && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </td>

                  {/* Arrival & Burst */}
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{proc.arrival}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{proc.burst}</td>

                  {/* Completion Time */}
                  <td className="py-3 px-4">
                    {isTerminated ? (
                      <span className="font-bold text-slate-900 dark:text-white">
                        {proc.completion}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>

                  {/* Turnaround Time */}
                  <td className="py-3 px-4">
                    {isTerminated ? (
                      <div>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {proc.turnaround}
                        </span>
                        <span className="block text-[10px] font-normal text-slate-400">
                          ({proc.completion} − {proc.arrival})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>

                  {/* Waiting Time */}
                  <td className="py-3 px-4">
                    {isTerminated ? (
                      <div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {proc.waiting}
                        </span>
                        <span className="block text-[10px] font-normal text-slate-400">
                          ({proc.turnaround} − {proc.burst})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>

                  {/* Response Time */}
                  <td className="py-3 px-4">
                    {isTerminated ? (
                      <div>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {proc.response}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Final Summary Metrics (Appears on Completion) */}
      {showFinalAverages ? (
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
          {/* Average Waiting */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              Average Waiting Time
            </span>
            <span className="text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
              {averages.waiting}
            </span>
          </div>

          {/* Average Turnaround */}
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
              Average Turnaround Time
            </span>
            <span className="text-xl font-extrabold font-mono text-indigo-700 dark:text-indigo-300">
              {averages.turnaround}
            </span>
          </div>

          {/* Average Response */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              Average Response Time
            </span>
            <span className="text-xl font-extrabold font-mono text-amber-700 dark:text-amber-300">
              {averages.response}
            </span>
          </div>

          {/* CPU Utilization */}
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
              CPU Utilization
            </span>
            <span className="text-xl font-extrabold font-mono text-purple-700 dark:text-purple-300">
              {cpuUtilization}%
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          Complete metrics and final averages will calculate as the simulation finishes.
        </div>
      )}
    </div>
  );
}
