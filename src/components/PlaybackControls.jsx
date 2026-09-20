import React from 'react';

export default function PlaybackControls({
  isPlaying = false,
  onPlayPause = () => {},
  onNext = () => {},
  onPrev = () => {},
  onReset = () => {},
  speed = 1,
  onSpeedChange = () => {},
}) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Playback Controls
      </div>
      <div className="text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 px-3 py-1 rounded">
        Play / Pause / Step Controls Placeholder
      </div>
    </div>
  );
}
