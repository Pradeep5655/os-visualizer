/**
 * Process Control Block (PCB) Helper
 * Placeholder for Process state management:
 * States: New -> Ready -> Running -> Waiting -> Terminated
 */

export const ProcessState = {
  NEW: 'New',
  READY: 'Ready',
  RUNNING: 'Running',
  WAITING: 'Waiting',
  TERMINATED: 'Terminated',
};

export function createPCB({ pid, arrival = 0, burst = 1, priority = 1 }) {
  return {
    pid,
    arrival: Number(arrival),
    burst: Number(burst),
    priority: Number(priority),
    state: ProcessState.NEW,
    remainingTime: Number(burst),
    completionTime: 0,
    turnaroundTime: 0,
    waitingTime: 0,
    responseTime: -1,
  };
}
