import React from 'react';
import { MessageSquare, Bell, ArrowRightCircle, CheckCircle2, Clock, PauseCircle } from 'lucide-react';

const EVENT_BADGES = {
  ARRIVAL: {
    label: 'ARRIVAL',
    icon: Bell,
    style: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  },
  DISPATCH: {
    label: 'DISPATCH',
    icon: ArrowRightCircle,
    style: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  },
  COMPLETE: {
    label: 'COMPLETE',
    icon: CheckCircle2,
    style: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
  },
  IDLE: {
    label: 'IDLE CPU',
    icon: Clock,
    style: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  },
  PREEMPT: {
    label: 'PREEMPT',
    icon: PauseCircle,
    style: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  },
};

export default function StepExplanation({ currentStep = null }) {
  if (!currentStep) {
    return (
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400 italic text-center">
        Step narration will appear here as playback begins.
      </div>
    );
  }

  const eventConfig = EVENT_BADGES[currentStep.event] || {
    label: currentStep.event,
    icon: MessageSquare,
    style: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const Icon = eventConfig.icon;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/20 border border-brand-200/80 dark:border-brand-900/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-brand-600 dark:text-brand-400 shrink-0 shadow-xs">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Current Event
            </span>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
              @ t = {currentStep.time}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
            {currentStep.description}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-xs ${eventConfig.style}`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{eventConfig.label}</span>
        </span>
      </div>
    </div>
  );
}
