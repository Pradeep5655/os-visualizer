/**
 * Solved textbook examples for OS algorithms
 */

export const ALGORITHM_EXAMPLES = {
  fcfs: [
    {
      id: 'fcfs-ex-1',
      title: 'Classic Convoy Effect Example (Silberschatz)',
      description: 'Three processes arriving at time 0 where P1 has a large burst time, illustrating high average waiting time.',
      input: {
        processes: [
          { pid: 'P1', arrival: 0, burst: 24, priority: 1 },
          { pid: 'P2', arrival: 0, burst: 3, priority: 1 },
          { pid: 'P3', arrival: 0, burst: 3, priority: 1 },
        ],
      },
      expectedAverages: {
        waiting: 17,
        turnaround: 27,
      },
    },
    {
      id: 'fcfs-ex-2',
      title: 'Staggered Arrival Times',
      description: 'Four processes arriving at sequential intervals demonstrating FIFO order.',
      input: {
        processes: [
          { pid: 'P1', arrival: 0, burst: 5, priority: 1 },
          { pid: 'P2', arrival: 1, burst: 3, priority: 1 },
          { pid: 'P3', arrival: 2, burst: 8, priority: 1 },
          { pid: 'P4', arrival: 3, burst: 6, priority: 1 },
        ],
      },
      expectedAverages: {
        waiting: 5.75,
        turnaround: 11.25,
      },
    },
    {
      id: 'fcfs-ex-3',
      title: 'Idle CPU Gap Demonstration',
      description: 'Demonstrating CPU idle behavior when no process is ready at time t=2 until t=5.',
      input: {
        processes: [
          { pid: 'P1', arrival: 0, burst: 2, priority: 1 },
          { pid: 'P2', arrival: 5, burst: 3, priority: 1 },
        ],
      },
    },
  ],
};
