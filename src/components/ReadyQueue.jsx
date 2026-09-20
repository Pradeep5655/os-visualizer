import React from 'react';

export default function ReadyQueue({ queue = [] }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Ready Queue</h3>
      <div className="h-12 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-400">
        Ready Queue placeholder
      </div>
    </div>
  );
}
