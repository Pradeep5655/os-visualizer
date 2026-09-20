import React, { useMemo } from 'react';
import { runFCFS } from '../engine/scheduling/fcfs';
import { usePlayback } from '../hooks/usePlayback';
import PlaybackControls from './PlaybackControls';
import GanttChart from './GanttChart';
import ReadyQueue from './ReadyQueue';
import ProcessStateBoard from './ProcessStateBoard';
import StepExplanation from './StepExplanation';
import ResultsTable from './ResultsTable';
import { getProcessColor } from '../utils/colors';
import { AlertCircle, ListFilter } from 'lucide-react';

export default function SimulationView({
  input,
  runAlgorithm = runFCFS,
  algorithmName = 'FCFS',
}) {
  // Execute simulation engine once when input or algorithm changes
  const { simulationResult, error } = useMemo(() => {
    try {
      if (!input || !input.processes) {
        return { simulationResult: null, error: 'No process configuration provided.' };
      }
      const result = runAlgorithm(input);
      return { simulationResult: result, error: null };
    } catch (err) {
      return { simulationResult: null, error: err.message || 'Simulation execution failed.' };
    }
  }, [input, runAlgorithm]);

  // Hook playback state
  const steps = simulationResult ? simulationResult.steps : [];
  const playback = usePlayback(steps, 1);

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          <span>Invalid Simulation Input</span>
        </div>
        <p className="text-xs leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!simulationResult) {
    return null;
  }

  const { timeline, processes, averages, cpuUtilization } = simulationResult;

  return (
    <div className="space-y-6">
      {/* Top Input Processes Overview */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Initial Process Input Set:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {input.processes.map((p) => {
            const color = getProcessColor(p.pid);
            return (
              <div
                key={p.pid}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono flex items-center gap-1.5"
              >
                <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                <span className="font-bold text-slate-800 dark:text-slate-200">{p.pid}</span>
                <span className="text-slate-400 text-[11px]">
                  (AT:{p.arrival}, BT:{p.burst}
                  {p.priority !== undefined ? `, P:${p.priority}` : ''})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playback Controls */}
      <PlaybackControls
        currentIndex={playback.currentIndex}
        totalSteps={playback.totalSteps}
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        onPlay={playback.play}
        onPause={playback.pause}
        onToggle={playback.toggle}
        onNext={playback.next}
        onPrev={playback.prev}
        onReset={playback.reset}
        onSetSpeed={playback.setSpeed}
        isFirst={playback.isFirst}
        isLast={playback.isLast}
      />

      {/* Gantt Chart */}
      <GanttChart timeline={timeline} currentStep={playback.currentStep} />

      {/* Ready Queue & State Board Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ReadyQueue currentStep={playback.currentStep} />
        <ProcessStateBoard currentStep={playback.currentStep} processes={processes} />
      </div>

      {/* Step Explanation Narration */}
      <StepExplanation currentStep={playback.currentStep} />

      {/* Results & Metrics Table */}
      <ResultsTable
        processes={processes}
        averages={averages}
        cpuUtilization={cpuUtilization}
        currentStep={playback.currentStep}
        isLast={playback.isLast}
      />
    </div>
  );
}
