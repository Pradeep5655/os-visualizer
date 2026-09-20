/**
 * Theory and Educational Data for Operating System Algorithms
 * Schema-driven configuration supporting Learn tab lessons, quizzes,
 * analogies, and comparative visualizations across all OS algorithms.
 */

export const ALGORITHM_THEORY = {
  fcfs: {
    id: 'fcfs',
    title: 'First-Come, First-Served (FCFS)',
    name: 'First-Come, First-Served',
    shortName: 'FCFS',
    category: 'CPU Scheduling',
    type: 'Non-preemptive',
    tagline: 'The simplest CPU scheduling algorithm: processes execute strictly in the order they arrive.',
    definition: 'First-Come, First-Served (FCFS) is a non-preemptive scheduling algorithm where the process that requests the CPU first is allocated the CPU first. It is managed with a simple FIFO (First-In, First-Out) ready queue.',
    
    // Real-Life Analogy
    analogy: {
      title: 'The Single Ticket Counter',
      text: 'Imagine a single ticket counter at a train station or a canteen line. Customers line up in the exact order they arrive. The person at the front of the queue is served until they are finished, and no one can cut in line regardless of how long or short their request is.',
    },

    // Key Terminology
    keyTerms: [
      {
        term: 'FIFO Ready Queue',
        definition: 'A First-In, First-Out queue where newly arriving processes are appended to the tail and the CPU scheduler dispatches from the head.',
      },
      {
        term: 'Non-Preemptive',
        definition: 'Once a process is allocated the CPU, it holds it until it terminates or requests I/O. It cannot be interrupted by newly arriving processes.',
      },
      {
        term: 'Convoy Effect',
        definition: 'A phenomenon where a long CPU-burst process holds the CPU, causing multiple short CPU-burst processes to wait behind it, drastically increasing average waiting time.',
      },
      {
        term: 'CPU Burst Time',
        definition: 'The total continuous duration of time a process requires the CPU to complete its computational work.',
      },
      {
        term: 'Starvation-Free',
        definition: 'Because processes are served in strict arrival order, every process in the ready queue is guaranteed to be executed eventually.',
      },
      {
        term: 'Dispatch Latency',
        definition: 'The minimal time taken by the OS dispatcher to stop one process and start the next from the head of the ready queue.',
      },
    ],

    // Numbered Algorithm Steps
    steps: [
      'Check arriving processes at current time t and add them to the tail of the FIFO ready queue.',
      'If the CPU is free and the ready queue is non-empty, dequeue the process at the head and dispatch it to the CPU.',
      'If the CPU is free and the ready queue is empty, the CPU remains idle until the next process arrival.',
      'The running process executes continuously on the CPU until its entire burst time is completed.',
      'When the process finishes, record its completion time, calculate turnaround and waiting metrics, mark it Terminated, and repeat from Step 1.',
    ],

    // Exact Monospace Pseudocode
    pseudocode: `// First-Come, First-Served (FCFS) Scheduling Algorithm
sort processes by arrival time (stable, keep input order on ties)
time = 0

for each process p in order:
    if time < p.arrival:
        time = p.arrival            // CPU is idle until process arrives
    p.start = time
    time = time + p.burst
    p.completion = time
    p.turnaround = p.completion - p.arrival
    p.waiting = p.turnaround - p.burst
    p.response = p.start - p.arrival`,

    // Scheduling Metrics & Formulas
    formulas: [
      {
        name: 'Turnaround Time (TAT)',
        formula: 'Turnaround Time = Completion Time − Arrival Time',
        explanation: 'Total time elapsed from the moment the process entered the system until it completely finishes execution.',
        example: 'If a process arrives at t=0 and finishes at t=24: TAT = 24 − 0 = 24',
      },
      {
        name: 'Waiting Time (WT)',
        formula: 'Waiting Time = Turnaround Time − Burst Time',
        explanation: 'Total time the process spent waiting in the ready queue before gaining access to the CPU.',
        example: 'If TAT = 24 and Burst Time = 24: WT = 24 − 24 = 0',
      },
      {
        name: 'Response Time (RT)',
        formula: 'Response Time = First CPU Dispatch Time − Arrival Time',
        explanation: 'Time taken from arrival to the very first moment the process starts executing on the CPU. (In non-preemptive FCFS, Response Time is always identical to Waiting Time).',
        example: 'If arrival = 0 and first dispatched at t=0: RT = 0 − 0 = 0',
      },
      {
        name: 'CPU Utilization',
        formula: 'CPU Utilization = (Total CPU Busy Time / Total Simulation Time) × 100',
        explanation: 'Percentage of time the processor is actively executing process instructions versus sitting idle.',
        example: 'If total busy time = 30 and total time = 30: CPU Utilization = (30 / 30) × 100 = 100%',
      },
    ],

    // Advantages & Disadvantages
    pros: [
      'Extremely simple to understand, design, and implement.',
      'Completely fair in terms of arrival time: strictly First-In, First-Out.',
      'No starvation: every process in the ready queue is guaranteed execution.',
      'Minimal scheduling overhead since no complex priority re-evaluations occur.',
    ],
    cons: [
      'Convoy Effect: short processes suffer severe delays when stuck behind lengthy jobs.',
      'Average waiting time and turnaround time are often very high compared to SJF or Round Robin.',
      'Not suitable for interactive or time-sharing systems where quick response is critical.',
      'Cannot prioritize urgent or high-priority system tasks over regular background jobs.',
    ],

    // Interactive Demo Input for "Watch It In Action"
    demoInput: {
      processes: [
        { pid: 'P1', arrival: 0, burst: 6, priority: 1 },
        { pid: 'P2', arrival: 2, burst: 3, priority: 1 },
        { pid: 'P3', arrival: 4, burst: 2, priority: 1 },
      ],
    },

    // Convoy Effect Comparison Scenarios
    comparison: {
      title: 'The Convoy Effect: Order Dictates Performance',
      text: 'The Convoy Effect occurs when one CPU-heavy process executes ahead of several lightweight processes. Notice how reversing the execution order dramatically slashes the average waiting time!',
      scenarioA: {
        label: 'Scenario A: Long Process First (P1 → P2 → P3)',
        input: {
          processes: [
            { pid: 'P1', arrival: 0, burst: 24, priority: 1 },
            { pid: 'P2', arrival: 0, burst: 3, priority: 1 },
            { pid: 'P3', arrival: 0, burst: 3, priority: 1 },
          ],
        },
      },
      scenarioB: {
        label: 'Scenario B: Short Processes First (P2 → P3 → P1)',
        input: {
          processes: [
            { pid: 'P2', arrival: 0, burst: 3, priority: 1 },
            { pid: 'P3', arrival: 0, burst: 3, priority: 1 },
            { pid: 'P1', arrival: 0, burst: 24, priority: 1 },
          ],
        },
      },
      takeaway: 'In Scenario A, P2 and P3 must wait 24 time units, resulting in an Average Waiting Time of 17. In Scenario B, serving the short jobs first reduces Average Waiting Time to just 3—an 82% performance improvement!',
    },

    // Complexity Analysis
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
      note: 'Sorting process arrival times takes O(n log n). If processes arrive in order or are inserted directly into a FIFO queue, the scheduling pass itself is O(n). Space complexity is O(n) for the PCB ready queue.',
    },

    // Real-World Systems Context
    realWorld: [
      'Batch Processing Systems: Where non-interactive jobs are submitted in batches and execution order does not affect responsiveness.',
      'Print Spoolers & I/O Request Queues: Print jobs and background disk requests are traditionally serviced in arrival order.',
      'Internal FIFO Queues in Schedulers: Complex algorithms like Round Robin internally use an FCFS FIFO queue to cycle through runnable processes within each quantum.',
      'Linux Real-Time SCHED_FIFO: Linux provides a real-time FIFO policy where the highest-priority runnable thread runs until it yields or blocks; threads of equal priority are scheduled in pure FIFO order.',
      'Modern Interactive OS Contrast: General-purpose desktop and server OS (such as Linux CFS or Windows Scheduler) do not use pure FCFS for interactive workloads because it would make UI applications freeze.',
    ],

    // Common Student Mistakes
    mistakes: [
      'Not drawing or constructing the Gantt chart first before attempting to compute completion times.',
      'Forgetting the IDLE gap when no process is ready in the queue (e.g., at t=0 or during arrival gaps).',
      'Computing Waiting Time as (Completion − Burst) instead of (Turnaround − Burst). Remember: Waiting Time = (Completion − Arrival) − Burst.',
      'Not breaking arrival ties by original input order (FCFS is stable and maintains original order when arrival times match).',
      'Thinking FCFS can preempt a running process when a shorter process arrives (FCFS is strictly non-preemptive).',
    ],

    // Interactive Quick Check Quiz
    quiz: [
      {
        question: 'Which data structure is fundamentally used to maintain the ready processes in FCFS scheduling?',
        options: ['LIFO Stack', 'FIFO Queue', 'Priority Heap', 'Circular Buffer'],
        correctIndex: 1,
        explanation: 'FCFS uses a standard FIFO (First-In, First-Out) queue where new processes are inserted at the tail and the CPU dispatches from the head.',
      },
      {
        question: 'Is standard First-Come, First-Served (FCFS) scheduling preemptive or non-preemptive?',
        options: ['Preemptive', 'Non-preemptive', 'Semi-preemptive', 'Dynamic preemptive'],
        correctIndex: 1,
        explanation: 'FCFS is non-preemptive: once a process is given the CPU, it continues executing until its CPU burst finishes.',
      },
      {
        question: 'What is the "Convoy Effect" in operating systems?',
        options: [
          'When multiple CPUs execute parallel threads',
          'When short processes get stuck waiting behind a long CPU-burst process',
          'When high-priority processes starve low-priority processes',
          'When the ready queue overflows available RAM',
        ],
        correctIndex: 1,
        explanation: 'The Convoy Effect occurs when a CPU-heavy process monopolizes the processor, causing smaller I/O or CPU-bound jobs to pile up behind it.',
      },
      {
        question: 'Given processes P1(Arrival: 0, Burst: 4), P2(Arrival: 1, Burst: 3), P3(Arrival: 2, Burst: 1), what is the average waiting time under FCFS?',
        options: ['2.00', '2.67', '3.33', '4.00'],
        correctIndex: 1,
        explanation: 'P1 runs [0,4] (WT = 0). P2 runs [4,7] (WT = 4 − 1 = 3). P3 runs [7,8] (WT = 7 − 2 = 5). Total waiting = 0 + 3 + 5 = 8. Average waiting = 8 / 3 = 2.67.',
      },
      {
        question: 'Under what condition does the CPU sit IDLE in FCFS scheduling?',
        options: [
          'When all processes have the same priority',
          'When the currently running process requests another time quantum',
          'When the CPU is free but no process has arrived in the system yet',
          'When the ready queue contains more than 10 processes',
        ],
        correctIndex: 2,
        explanation: 'The CPU sits idle only when no process is ready in the queue and the CPU must wait for the next arrival.',
      },
    ],
  },
};
