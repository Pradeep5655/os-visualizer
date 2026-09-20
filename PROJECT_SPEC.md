# OS Visualizer — Project Spec

Course: Operating Systems (CI3202)
Purpose: An interactive web tool to learn OS algorithms visually, see solved examples, and simulate the user's own input step by step.

---

## 1. Core idea (3 modes per algorithm)

Every algorithm page has three tabs:

1. **Learn**: short theory (definition, when used, pros/cons) + a small animated demo.
2. **Examples**: pre-solved textbook questions. User picks one and sees it play step by step.
3. **Try Your Own**: user enters their own input in the given format and sees the same visualization.

---

## 2. Tech stack

- React + Vite (JavaScript, not TypeScript)
- Tailwind CSS for styling
- react-router-dom for pages
- No backend. All simulation runs in the browser.
- Testing: Vitest for the engine (pure JS functions)

---

## 3. Golden architecture rule

**Engine and UI are completely separate.**

- `src/engine/` contains pure JavaScript functions. No React, no DOM, no UI code.
- An engine function takes input and returns a result object with a full list of `steps`.
- The UI only *plays* those steps (play, pause, next, previous, speed). It never calculates scheduling logic itself.

This makes it easy to add new algorithms and to test them.

---

## 4. Folder structure

```
src/
  engine/
    pcb.js                  // Process Control Block helper (pid, arrival, burst, priority, state, ...)
    scheduling/
      fcfs.js
      sjf.js
      srtf.js
      priority.js
      roundRobin.js
    memory/                 // later phases
    deadlock/
    disk/
  components/
    GanttChart.jsx
    ReadyQueue.jsx
    ProcessTable.jsx
    StateDiagram.jsx        // New -> Ready -> Running -> Waiting -> Terminated
    PlaybackControls.jsx
    InputForm.jsx
    StepExplanation.jsx
  pages/
    Home.jsx                // cards for each algorithm
    AlgorithmPage.jsx       // tabs: Learn | Examples | Try Your Own
  data/
    examples.js             // solved textbook questions
    theory.js               // theory text per algorithm
  tests/
```

---

## 5. Data format for CPU scheduling

### Input

```js
{
  processes: [
    { pid: "P1", arrival: 0, burst: 5, priority: 1 },  // priority optional
    ...
  ],
  timeQuantum: 2   // only for Round Robin
}
```

Validation rules: arrival >= 0, burst >= 1, integers only, unique pids, at least 1 process, timeQuantum >= 1 for RR. Show clear error messages.

### Output

```js
{
  timeline: [ { pid: "P1", start: 0, end: 5 }, { pid: "IDLE", start: 5, end: 7 }, ... ],
  processes: [ { pid, arrival, burst, completion, turnaround, waiting, response } ],
  averages: { waiting, turnaround, response },
  cpuUtilization: 100,
  steps: [
    {
      time: 0,
      event: "ARRIVAL" | "DISPATCH" | "PREEMPT" | "COMPLETE" | "IDLE",
      description: "t=0: P1 arrives and is added to the ready queue",
      running: "P1" | null,
      readyQueue: ["P2", "P3"],
      states: { P1: "Running", P2: "Ready", P3: "New" }
    }
  ]
}
```

Formulas:
- Turnaround = Completion - Arrival
- Waiting = Turnaround - Burst
- Response = First time on CPU - Arrival

---

## 6. UI requirements

- Playback controls: Play, Pause, Next step, Previous step, Reset, speed slider
- Gantt chart that fills in as steps play (IDLE shown clearly)
- Live ready queue
- Process state indicators (New / Ready / Running / Waiting / Terminated)
- Text explanation for the current step
- Results table + averages at the end
- Sample-input button and random-input button in "Try Your Own"
- Responsive, clean, readable. Dark/light mode is a bonus.

---

## 7. Test cases (engine must match these exactly)

**FCFS test 1** (all arrive at 0): P1(AT0, BT24), P2(AT0, BT3), P3(AT0, BT3)
- Timeline: P1 0-24, P2 24-27, P3 27-30
- Waiting: 0, 24, 27 → avg 17
- Turnaround: 24, 27, 30 → avg 27

**FCFS test 2**: P1(0,5), P2(1,3), P3(2,8), P4(3,6)
- Timeline: P1 0-5, P2 5-8, P3 8-16, P4 16-22
- Completion: 5, 8, 16, 22
- Waiting: 0, 4, 6, 13 → avg 5.75
- Turnaround: 5, 7, 14, 19 → avg 11.25

**FCFS test 3 (idle gap)**: P1(0,2), P2(5,3)
- Timeline: P1 0-2, IDLE 2-5, P2 5-8

---

## 8. Roadmap

- **Phase 1: CPU Scheduling**: FCFS, SJF, SRTF, Priority (pre-emptive and non-pre-emptive), Round Robin
- **Phase 1.5: Compare mode**: same input, multiple algorithms side by side
- **Phase 2**: Page Replacement (FIFO, LRU, Optimal), Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN)
- **Phase 3**: Deadlock (Banker's Algorithm), Memory Allocation (First/Best/Worst Fit), Synchronization (Producer-Consumer, Dining Philosophers)

Do not build later phases until asked.

---

## 9. Rules for the AI agent

1. Work on **one task at a time**, exactly as requested. Do not build features from later phases.
2. Before big changes, show a short plan first.
3. Keep engine code pure and well commented (explain the OS concept in comments).
4. After writing an engine function, write Vitest tests using the test cases above and run them.
5. After UI changes, run the app and confirm there are no console errors.
6. Do not silently change the data format in section 5. If it must change, say so.
7. Keep code simple and readable. This is a student project, not an enterprise app.
