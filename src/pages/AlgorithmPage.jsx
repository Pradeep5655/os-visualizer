import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  FileCode,
  PlaySquare,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { ALGORITHM_THEORY } from '../data/theory';
import { ALGORITHM_EXAMPLES } from '../data/examples';

export default function AlgorithmPage() {
  const { id = 'fcfs' } = useParams();
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' | 'examples' | 'try'

  const algorithm = ALGORITHM_THEORY[id] || {
    id,
    name: id.toUpperCase(),
    shortName: id.toUpperCase(),
    category: 'CPU Scheduling',
    type: 'Non-preemptive',
    tagline: 'Algorithm visualization and analysis.',
    definition: 'Interactive simulation for this algorithm will be enabled in phase 1.',
    pros: [],
    cons: [],
    whenUsed: [],
  };

  const examples = ALGORITHM_EXAMPLES[id] || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Algorithms</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
              {algorithm.category}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold border border-brand-200 dark:border-brand-800">
              {algorithm.type}
            </span>
          </div>
        </div>

        {/* Algorithm Header */}
        <header className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-brand-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/20 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {algorithm.name} ({algorithm.shortName})
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            {algorithm.tagline}
          </p>
        </header>

        {/* 3 Tabs Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('learn')}
              className={`inline-flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'learn'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Learn</span>
            </button>

            <button
              onClick={() => setActiveTab('examples')}
              className={`inline-flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'examples'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>2. Solved Examples</span>
            </button>

            <button
              onClick={() => setActiveTab('try')}
              className={`inline-flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'try'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <PlaySquare className="w-4 h-4" />
              <span>3. Try Your Own</span>
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="py-4">
          {activeTab === 'learn' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Definition & Theory Card */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-brand-500" />
                    How {algorithm.shortName} Works
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {algorithm.definition}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      When it is used:
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {algorithm.whenUsed?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pros & Cons Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                      Advantages
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {algorithm.pros?.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                      Disadvantages
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {algorithm.cons?.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">−</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Animated demo visual placeholder */}
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center space-y-2">
                <Layers className="w-8 h-8 text-brand-500 mx-auto opacity-75" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Concept Interactive Demo Placeholder
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  The visual simulation with Gantt chart playback, live ready queue, and step-by-step narration will be connected in Phase 1.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/60 text-xs text-brand-700 dark:text-brand-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  Select any pre-configured textbook problem to load its processes and watch the step-by-step playback.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {examples.map(ex => (
                  <div
                    key={ex.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-brand-400 transition-colors"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ex.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {ex.description}
                    </p>
                    <div className="text-[11px] font-mono p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                      Processes: {ex.input.processes.map(p => `${p.pid}(A:${p.arrival}, B:${p.burst})`).join(', ')}
                    </div>
                    <div className="pt-2">
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-400 cursor-not-allowed text-center"
                      >
                        Simulation ready in Phase 1
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'try' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Custom Process Configuration
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter arrival times and burst times to generate a customized step-by-step Gantt chart and metrics table.
                  </p>
                </div>

                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                    <PlaySquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Interactive Process Input Form Placeholder
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Supports adding/removing processes, random input generator, textbook presets, and instant simulation validation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12">
        <p>
          OS Visualizer • Built for Operating Systems (CI3202) • Pure client-side simulation
        </p>
      </footer>
    </div>
  );
}
