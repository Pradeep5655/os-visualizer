/**
 * First-Come, First-Served (FCFS) CPU Scheduling Algorithm
 * Note: Pure scheduling algorithm logic will be implemented in the next phase.
 */

export function simulateFCFS(input) {
  return {
    timeline: [],
    processes: [],
    averages: { waiting: 0, turnaround: 0, response: 0 },
    cpuUtilization: 0,
    steps: [],
  };
}
