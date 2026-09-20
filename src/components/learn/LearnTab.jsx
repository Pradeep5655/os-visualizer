import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  HelpCircle,
  Code2,
  Calculator,
  Play,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Cpu,
  Layers,
  Clock,
  Check,
  Copy,
  TrendingDown,
  Server,
  Zap,
} from 'lucide-react';
import GanttChart from '../GanttChart';
import SimulationView from '../SimulationView';
import { runFCFS } from '../../engine/scheduling/fcfs';

const TOC_SECTIONS = [
  { id: 'overview', title: 'Overview & Analogy', icon: Lightbulb },
  { id: 'key-terms', title: 'Key Terminology', icon: Layers },
  { id: 'how-it-works', title: 'How It Works & Code', icon: Code2 },
  { id: 'formulas', title: 'Formulas & Math', icon: Calculator },
  { id: 'pros-cons', title: 'Pros & Cons', icon: Sparkles },
  { id: 'live-demo', title: 'Watch It In Action', icon: Play },
  { id: 'convoy-comparison', title: 'Convoy Effect Analysis', icon: TrendingDown },
  { id: 'complexity-realworld', title: 'Complexity & Real World', icon: Server },
  { id: 'common-mistakes', title: 'Common Mistakes', icon: AlertTriangle },
  { id: 'quiz', title: 'Quick Check Quiz', icon: HelpCircle },
];

export default function LearnTab({
  theory,
  runAlgorithm = runFCFS,
}) {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Comparison execution results for Scenario A and Scenario B
  const comparisonResults = useMemo(() => {
    if (!theory || !theory.comparison) return null;
    try {
      const resA = runAlgorithm(theory.comparison.scenarioA.input);
      const resB = runAlgorithm(theory.comparison.scenarioB.input);
      return { resA, resB };
    } catch {
      return null;
    }
  }, [theory, runAlgorithm]);

  // Scroll spy for sticky Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = TOC_SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(TOC_SECTIONS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(TOC_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const handleCopyPseudocode = () => {
    if (theory?.pseudocode) {
      navigator.clipboard.writeText(theory.pseudocode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Quiz Handlers
  const currentQuestion = theory?.quiz?.[quizIndex];

  const handleSelectOption = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
    if (index === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < (theory?.quiz?.length || 0) - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (!theory) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
      {/* Mobile Horizontal Pill Bar */}
      <div className="lg:hidden w-full sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-2.5 border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 overflow-x-auto scrollbar-none flex gap-2">
        {TOC_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Sticky Table of Contents Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-24 space-y-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Table of Contents
          </div>
          <nav className="space-y-0.5">
            {TOC_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold border border-brand-200/60 dark:border-brand-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Lesson Content Area */}
      <div className="flex-1 w-full space-y-10">
        {/* 1. OVERVIEW & ANALOGY */}
        <section id="overview" className="scroll-mt-24 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                1. What is {theory.name}?
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {theory.definition}
            </p>

            {/* Analogy Callout Card */}
            {theory.analogy && (
              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Real-World Analogy: {theory.analogy.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                    {theory.analogy.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. KEY TERMS */}
        <section id="key-terms" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              2. Key Terminology
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theory.keyTerms?.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <h3 className="text-sm font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <span>{item.term}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. HOW IT WORKS & PSEUDOCODE */}
        <section id="how-it-works" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Code2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              3. How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Numbered Steps */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400">
                Algorithm Execution Flow
              </h3>
              <div className="space-y-3">
                {theory.steps?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-mono font-bold flex items-center justify-center shrink-0 border border-brand-200 dark:border-brand-800 text-xs">
                      {idx + 1}
                    </span>
                    <p className="pt-0.5 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pseudocode Code Block */}
            <div className="p-6 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand-300">
                  algorithm_fcfs.txt
                </span>
                <button
                  onClick={handleCopyPseudocode}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950/80 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed border border-slate-800/80">
                <code>{theory.pseudocode}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. FORMULAS & MATH */}
        <section id="formulas" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              4. Key Formulas & Calculations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {theory.formulas?.map((f, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {f.name}
                </span>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                  {f.formula}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.explanation}
                </p>
                <div className="pt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Example:</span> {f.example}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. PROS & CONS */}
        <section id="pros-cons" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              5. Advantages & Disadvantages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Advantages */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Advantages</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {theory.pros?.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      +
                    </span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disadvantages */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/60 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>Disadvantages</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {theory.cons?.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      −
                    </span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. WATCH IT IN ACTION (LIVE DEMO) */}
        {theory.demoInput && (
          <section id="live-demo" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  <Play className="w-5 h-5 fill-current" />
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  6. Watch It In Action
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Interactive Demo</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Step through this small 3-process demonstration to observe how processes join the ready queue and execute on the CPU.
            </p>

            <SimulationView
              input={theory.demoInput}
              runAlgorithm={runAlgorithm}
              algorithmName={theory.shortName}
            />
          </section>
        )}

        {/* 7. CONVOY EFFECT COMPARISON */}
        {theory.comparison && comparisonResults && (
          <section id="convoy-comparison" className="scroll-mt-24 space-y-6">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <TrendingDown className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                7. {theory.comparison.title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {theory.comparison.text}
            </p>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Scenario A */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {theory.comparison.scenarioA.label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Poor Order
                  </span>
                </div>

                <GanttChart
                  timeline={comparisonResults.resA.timeline}
                  showAll={true}
                />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Avg Waiting Time
                    </span>
                    <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                      {comparisonResults.resA.averages.waiting}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Avg Turnaround Time
                    </span>
                    <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                      {comparisonResults.resA.averages.turnaround}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario B */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {theory.comparison.scenarioB.label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Optimal Order
                  </span>
                </div>

                <GanttChart
                  timeline={comparisonResults.resB.timeline}
                  showAll={true}
                />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Avg Waiting Time
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {comparisonResults.resB.averages.waiting}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Avg Turnaround Time
                    </span>
                    <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                      {comparisonResults.resB.averages.turnaround}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Takeaway conclusion banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-purple-50/40 dark:from-brand-950/40 dark:via-indigo-950/30 dark:to-purple-950/20 border border-brand-200 dark:border-brand-900/60 flex items-start gap-3">
              <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {theory.comparison.takeaway}
              </p>
            </div>
          </section>
        )}

        {/* 8. COMPLEXITY & REAL-WORLD USE */}
        <section id="complexity-realworld" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Server className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              8. Complexity & Real-World Use
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Complexity Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Algorithm Complexity
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Time Complexity
                  </span>
                  <span className="text-lg font-mono font-bold text-brand-600 dark:text-brand-400">
                    {theory.complexity?.time}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Space Complexity
                  </span>
                  <span className="text-lg font-mono font-bold text-brand-600 dark:text-brand-400">
                    {theory.complexity?.space}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {theory.complexity?.note}
              </p>
            </div>

            {/* Real World Applications Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Where FCFS Is Used in Real OS
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {theory.realWorld?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 9. COMMON MISTAKES */}
        <section id="common-mistakes" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              9. Common Mistakes & Exam Pitfalls
            </h2>
          </div>

          <div className="space-y-2.5">
            {theory.mistakes?.map((mistake, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {mistake}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. QUICK CHECK QUIZ */}
        {theory.quiz && theory.quiz.length > 0 && (
          <section id="quiz" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                10. Quick Check Quiz
              </h2>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {!quizCompleted ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Question {quizIndex + 1} of {theory.quiz.length}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Score: {score} / {quizIndex + (isAnswerSubmitted ? 1 : 0)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {currentQuestion.question}
                    </h3>

                    {/* Option Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQuestion.options.map((opt, optIdx) => {
                        const isSelected = selectedOption === optIdx;
                        const isCorrect = optIdx === currentQuestion.correctIndex;

                        let buttonStyle =
                          'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';

                        if (isAnswerSubmitted) {
                          if (isCorrect) {
                            buttonStyle =
                              'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/30';
                          } else if (isSelected) {
                            buttonStyle =
                              'bg-rose-50 dark:bg-rose-950/80 border-rose-400 dark:border-rose-600 text-rose-800 dark:text-rose-200 font-bold';
                          } else {
                            buttonStyle =
                              'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            disabled={isAnswerSubmitted}
                            className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${buttonStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback Explanation */}
                  {isAnswerSubmitted && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 animate-fade-in">
                      <div className="flex items-center gap-2">
                        {selectedOption === currentQuestion.correctIndex ? (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct!
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleNextQuestion}
                          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/25 flex items-center gap-1.5 transition-all"
                        >
                          <span>{quizIndex < theory.quiz.length - 1 ? 'Next Question' : 'View Results'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Completed Quiz Score Card */
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Quiz Completed!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    You scored <span className="font-bold text-brand-600 dark:text-brand-400">{score}</span> out of{' '}
                    <span className="font-bold">{theory.quiz.length}</span> (
                    {Math.round((score / theory.quiz.length) * 100)}%)
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleResetQuiz}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/25 inline-flex items-center gap-2 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try Again</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
