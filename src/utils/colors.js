/**
 * Process Color Mapping Utility
 * Provides consistent, harmonious color styling across Gantt charts,
 * ready queues, state boards, and tables in dark and light modes.
 */

const PALETTE = [
  {
    bg: 'bg-indigo-500',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/50',
    border: 'border-indigo-400 dark:border-indigo-600',
    text: 'text-indigo-700 dark:text-indigo-300',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
    solid: '#6366f1',
  },
  {
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/50',
    border: 'border-emerald-400 dark:border-emerald-600',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    solid: '#10b981',
  },
  {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-400 dark:border-amber-600',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    solid: '#f59e0b',
  },
  {
    bg: 'bg-rose-500',
    bgLight: 'bg-rose-50 dark:bg-rose-950/50',
    border: 'border-rose-400 dark:border-rose-600',
    text: 'text-rose-700 dark:text-rose-300',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border-rose-200 dark:border-rose-800',
    solid: '#f43f5e',
  },
  {
    bg: 'bg-cyan-500',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/50',
    border: 'border-cyan-400 dark:border-cyan-600',
    text: 'text-cyan-700 dark:text-cyan-300',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800',
    solid: '#06b6d4',
  },
  {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-50 dark:bg-purple-950/50',
    border: 'border-purple-400 dark:border-purple-600',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-200 dark:border-purple-800',
    solid: '#a855f7',
  },
  {
    bg: 'bg-teal-500',
    bgLight: 'bg-teal-50 dark:bg-teal-950/50',
    border: 'border-teal-400 dark:border-teal-600',
    text: 'text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 border-teal-200 dark:border-teal-800',
    solid: '#14b8a6',
  },
  {
    bg: 'bg-pink-500',
    bgLight: 'bg-pink-50 dark:bg-pink-950/50',
    border: 'border-pink-400 dark:border-pink-600',
    text: 'text-pink-700 dark:text-pink-300',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200 border-pink-200 dark:border-pink-800',
    solid: '#ec4899',
  },
];

export function getProcessColor(pid) {
  if (!pid || pid === 'IDLE') {
    return {
      bg: 'bg-slate-300 dark:bg-slate-700',
      bgLight: 'bg-slate-100 dark:bg-slate-800',
      border: 'border-slate-300 dark:border-slate-600',
      text: 'text-slate-500 dark:text-slate-400',
      badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700',
      isIdle: true,
      solid: '#94a3b8',
    };
  }

  // Extract numeric index from PID (e.g. "P1" -> 0, "P2" -> 1)
  const match = pid.match(/\d+/);
  let index = 0;
  if (match) {
    index = (parseInt(match[0], 10) - 1) % PALETTE.length;
    if (index < 0) index = 0;
  } else {
    // Hash string if no numbers found
    let hash = 0;
    for (let i = 0; i < pid.length; i++) {
      hash = pid.charCodeAt(i) + ((hash << 5) - hash);
    }
    index = Math.abs(hash) % PALETTE.length;
  }

  return {
    ...PALETTE[index],
    isIdle: false,
  };
}
