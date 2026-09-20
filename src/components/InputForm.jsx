import React from 'react';

export default function InputForm({ onSubmit = () => {} }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Process Input Form</h3>
      <div className="h-20 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-400">
        Process input table with Add/Remove process, Sample, and Randomize buttons placeholder
      </div>
    </div>
  );
}
