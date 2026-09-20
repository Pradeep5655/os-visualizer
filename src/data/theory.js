/**
 * Theory data for OS algorithms
 */

export const ALGORITHM_THEORY = {
  fcfs: {
    id: 'fcfs',
    name: 'First-Come, First-Served',
    shortName: 'FCFS',
    category: 'CPU Scheduling',
    type: 'Non-preemptive',
    tagline: 'The simplest CPU scheduling algorithm: processes execute in the order they arrive.',
    definition: 'First-Come, First-Served (FCFS) is a non-preemptive scheduling algorithm where the process that requests the CPU first is allocated the CPU first. It is managed with a simple FIFO (First-In, First-Out) ready queue.',
    whenUsed: [
      'Batch operating systems where execution order does not critically affect responsiveness.',
      'Simple embedded systems with minimal context-switch overhead requirements.',
      'As a baseline comparison against more advanced scheduling algorithms.'
    ],
    pros: [
      'Extremely simple and easy to understand and implement.',
      'No starvation: every process eventually gets executed.',
      'Minimal scheduling overhead.'
    ],
    cons: [
      'Convoy Effect: short processes get stuck waiting behind long CPU-burst processes.',
      'Average waiting time is often quite high.',
      'Non-preemptive nature makes it unsuitable for time-sharing interactive systems.'
    ],
    complexity: {
      time: 'O(N log N) with sorting by arrival, or O(1) per ready queue enqueue/dequeue',
      space: 'O(N) for process queue',
    }
  }
};
