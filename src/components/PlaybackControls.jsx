import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Zap,
} from 'lucide-react';

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
  { label: '4x', value: 4 },
];

export default function PlaybackControls({
  currentIndex = 0,
  totalSteps = 0,
  isPlaying = false,
  speed = 1,
  onPlay = () => {},
  onPause = () => {},
  onToggle = () => {},
  onNext = () => {},
  onPrev = () => {},
  onReset = () => {},
  onSetSpeed = () => {},
  isFirst = true,
  isLast = false,
}) {
  // Global keyboard shortcuts (Space, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keystrokes when focused in form inputs
      const target = e.target;
      const tag = target.tagName ? target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onToggle();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle, onPrev, onNext]);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
      {/* Playback Buttons */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset to beginning"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Previous Step */}
        <button
          onClick={onPrev}
          disabled={isFirst}
          title="Previous Step (Left Arrow)"
          className={`p-2.5 rounded-xl border transition-all ${
            isFirst
              ? 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play / Pause Toggle */}
        <button
          onClick={onToggle}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all active:scale-95"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{isLast ? 'Replay' : 'Play'}</span>
            </>
          )}
        </button>

        {/* Next Step */}
        <button
          onClick={onNext}
          disabled={isLast}
          title="Next Step (Right Arrow)"
          className={`p-2.5 rounded-xl border transition-all ${
            isLast
              ? 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Step Counter Indicator */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
          Step
        </span>
        <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-sm font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          {totalSteps > 0 ? currentIndex + 1 : 0} <span className="text-slate-400 font-normal">/ {totalSteps}</span>
        </div>
      </div>

      {/* Playback Speed Selector */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <span className="pl-2 pr-1 text-slate-400 dark:text-slate-500">
          <Zap className="w-3.5 h-3.5" />
        </span>
        {SPEED_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSetSpeed(opt.value)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              speed === opt.value
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
