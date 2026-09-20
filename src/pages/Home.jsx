import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  HardDrive,
  Layers,
  Lock,
  MemoryStick,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'all',
    name: 'All Categories',
    icon: SlidersHorizontal,
  },
  {
    id: 'cpu',
    name: 'CPU Scheduling',
    icon: Cpu,
    description: 'Process dispatching and CPU resource allocation strategies.',
  },
  {
    id: 'page',
    name: 'Page Replacement',
    icon: Layers,
    description: 'Virtual memory page replacement algorithms.',
  },
  {
    id: 'disk',
    name: 'Disk Scheduling',
    icon: HardDrive,
    description: 'I/O head movement optimization and seek time minimization.',
  },
  {
    id: 'deadlock',
    name: 'Deadlock',
    icon: Lock,
    description: 'Deadlock avoidance and detection strategies.',
  },
  {
    id: 'memory',
    name: 'Memory',
    icon: MemoryStick,
    description: 'Contiguous and dynamic partition memory allocation.',
  },
];

const ALGORITHMS = [
  // CPU Scheduling
  {
    id: 'fcfs',
    name: 'First-Come, First-Served (FCFS)',
    category: 'cpu',
    categoryName: 'CPU Scheduling',
    description: 'Executes processes strictly in arrival order with a standard FIFO queue. Non-preemptive.',
    tags: ['Non-preemptive', 'FIFO', 'Convoy Effect'],
    status: 'active',
    route: '/algorithm/fcfs',
  },
  {
    id: 'sjf',
    name: 'Shortest Job First (SJF)',
    category: 'cpu',
    categoryName: 'CPU Scheduling',
    description: 'Selects the waiting process with the smallest burst time. Minimizes average wait time.',
    tags: ['Non-preemptive', 'Optimal Average Waiting'],
    status: 'coming_soon',
  },
  {
    id: 'srtf',
    name: 'Shortest Remaining Time First (SRTF)',
    category: 'cpu',
    categoryName: 'CPU Scheduling',
    description: 'Preemptive variant of SJF where newly arriving shorter jobs preempt currently executing process.',
    tags: ['Preemptive', 'Dynamic Scheduling'],
    status: 'coming_soon',
  },
  {
    id: 'priority',
    name: 'Priority Scheduling',
    category: 'cpu',
    categoryName: 'CPU Scheduling',
    description: 'Dispatches processes according to assigned priority values with preemption support.',
    tags: ['Preemptive & Non-preemptive', 'Starvation Risk'],
    status: 'coming_soon',
  },
  {
    id: 'round-robin',
    name: 'Round Robin (RR)',
    category: 'cpu',
    categoryName: 'CPU Scheduling',
    description: 'Time-sharing algorithm allocating fixed time slices (quanta) cyclically to ready processes.',
    tags: ['Preemptive', 'Time Quantum', 'Interactive'],
    status: 'coming_soon',
  },

  // Page Replacement
  {
    id: 'fifo-page',
    name: 'FIFO Page Replacement',
    category: 'page',
    categoryName: 'Page Replacement',
    description: 'Replaces the oldest page loaded in memory when a page fault occurs. Susceptible to Belady\'s Anomaly.',
    tags: ['FIFO Queue', 'Belady\'s Anomaly'],
    status: 'coming_soon',
  },
  {
    id: 'lru',
    name: 'Least Recently Used (LRU)',
    category: 'page',
    categoryName: 'Page Replacement',
    description: 'Replaces the page that has not been accessed for the longest duration of time.',
    tags: ['Temporal Locality', 'Stack Algorithm'],
    status: 'coming_soon',
  },
  {
    id: 'optimal-page',
    name: 'Optimal Page Replacement (OPT)',
    category: 'page',
    categoryName: 'Page Replacement',
    description: 'Replaces the page that will not be used for the longest period in the future.',
    tags: ['Theoretical Benchmark', 'Lowest Page Faults'],
    status: 'coming_soon',
  },

  // Disk Scheduling
  {
    id: 'fcfs-disk',
    name: 'FCFS Disk Scheduling',
    category: 'disk',
    categoryName: 'Disk Scheduling',
    description: 'Services disk track requests in the order they are received without reordering.',
    tags: ['FIFO', 'High Seek Time'],
    status: 'coming_soon',
  },
  {
    id: 'sstf',
    name: 'Shortest Seek Time First (SSTF)',
    category: 'disk',
    categoryName: 'Disk Scheduling',
    description: 'Selects the disk request closest to the current head position.',
    tags: ['Greedy', 'Seek Optimization'],
    status: 'coming_soon',
  },
  {
    id: 'scan',
    name: 'SCAN (Elevator Algorithm)',
    category: 'disk',
    categoryName: 'Disk Scheduling',
    description: 'Disk arm moves in one direction servicing requests until it reaches the end, then reverses.',
    tags: ['Bi-directional', 'Fair Distribution'],
    status: 'coming_soon',
  },
  {
    id: 'c-scan',
    name: 'C-SCAN (Circular SCAN)',
    category: 'disk',
    categoryName: 'Disk Scheduling',
    description: 'Services requests in one direction only, then immediately returns to the start without servicing on the return trip.',
    tags: ['Uniform Wait Times', 'Circular'],
    status: 'coming_soon',
  },

  // Deadlock
  {
    id: 'bankers',
    name: 'Banker\'s Algorithm',
    category: 'deadlock',
    categoryName: 'Deadlock',
    description: 'Deadlock avoidance algorithm that tests for safety by simulating maximum possible resource allocation.',
    tags: ['Safety Algorithm', 'Resource Request', 'Avoidance'],
    status: 'coming_soon',
  },

  // Memory
  {
    id: 'first-fit',
    name: 'First Fit',
    category: 'memory',
    categoryName: 'Memory',
    description: 'Allocates the first memory hole that is large enough to satisfy the request.',
    tags: ['Fast Allocation', 'Memory Management'],
    status: 'coming_soon',
  },
  {
    id: 'best-fit',
    name: 'Best Fit',
    category: 'memory',
    categoryName: 'Memory',
    description: 'Allocates the smallest memory hole that is big enough, producing the smallest leftover hole.',
    tags: ['Hole Optimization', 'Internal Fragmentation'],
    status: 'coming_soon',
  },
  {
    id: 'worst-fit',
    name: 'Worst Fit',
    category: 'memory',
    categoryName: 'Memory',
    description: 'Allocates the largest available hole to leave the largest leftover block possible.',
    tags: ['Large Leftover', 'Partitioning'],
    status: 'coming_soon',
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAlgorithms = selectedCategory === 'all'
    ? ALGORITHMS
    : ALGORITHMS.filter(algo => algo.category === selectedCategory);

  const activeCount = ALGORITHMS.filter(a => a.status === 'active').length;
  const totalCount = ALGORITHMS.length;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Operating Systems (CI3202) Algorithm Suite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            OS <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Visualizer</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Master core Operating System algorithms through step-by-step visual simulation, textbook examples, and interactive custom runs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{activeCount} Algorithm Ready</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{totalCount - activeCount} Coming Soon</span>
            </span>
            <span>•</span>
            <span>Pure Client-Side Engine</span>
          </div>
        </section>

        {/* Category Filters */}
        <section className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map(category => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-102'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </section>

        {/* Algorithm Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlgorithms.map(algo => {
              const isActive = algo.status === 'active';

              const CardContent = (
                <div
                  className={`h-full flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 border-brand-200 dark:border-brand-900 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-400 dark:hover:border-brand-600 group cursor-pointer'
                      : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-85'
                  }`}
                >
                  {/* Top row */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {algo.categoryName}
                      </span>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-300/50 dark:border-slate-700/50">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Coming soon
                        </span>
                      )}
                    </div>

                    <h2
                      className={`text-lg font-bold tracking-tight ${
                        isActive
                          ? 'text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {algo.name}
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {algo.description}
                    </p>
                  </div>

                  {/* Bottom tags & Action */}
                  <div className="pt-5 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {algo.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      {isActive ? (
                        <span className="font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Launch Visualizer <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">
                          Phase roadmap item
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );

              return isActive ? (
                <Link key={algo.id} to={algo.route} className="block h-full">
                  {CardContent}
                </Link>
              ) : (
                <div key={algo.id} className="block h-full">
                  {CardContent}
                </div>
              );
            })}
          </div>
        </section>
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
