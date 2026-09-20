/**
 * First-Come, First-Served (FCFS) CPU Scheduling Algorithm
 * 
 * FCFS is a non-preemptive scheduling policy where the CPU is allocated to processes
 * in the strict order of their arrival in the ready queue (FIFO order).
 * 
 * Key Characteristics:
 * - Non-preemptive: Once a process gets the CPU, it executes until it finishes its CPU burst.
 * - Simple FIFO Ready Queue: Arrivals are placed at the tail of the queue; the dispatcher selects from the head.
 * - Convoy Effect: Short CPU-burst processes may get delayed behind long CPU-burst processes.
 */

import { ProcessState, createPCB } from '../pcb';
import { validateInput } from '../validation';

/**
 * Utility function to round numeric values to 2 decimal places.
 * @param {number} val
 * @returns {number}
 */
function roundToTwo(val) {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Simulates First-Come, First-Served (FCFS) CPU scheduling.
 * 
 * @param {Object} input - Simulation input
 * @param {Array<{pid: string, arrival: number, burst: number, priority?: number}>} input.processes
 * @returns {Object} Output containing timeline, processes, averages, cpuUtilization, and step-by-step trace
 * @throws {Error} If input fails validation
 */
export function runFCFS(input) {
  const validation = validateInput(input);
  if (!validation.valid) {
    throw new Error(validation.errors.join('; '));
  }

  // Deep-copy and instantiate Process Control Blocks (PCBs)
  // Store original index to maintain stability for arrival ties and output ordering
  const processes = input.processes.map((proc, index) => ({
    ...createPCB(proc),
    originalIndex: index,
  }));

  // Initial process states map
  const states = {};
  processes.forEach(p => {
    states[p.pid] = ProcessState.NEW;
  });

  // Sort processes by arrival time ascending; stable sort by original input index on ties
  const unloaded = [...processes].sort((a, b) => {
    if (a.arrival !== b.arrival) {
      return a.arrival - b.arrival;
    }
    return a.originalIndex - b.originalIndex;
  });

  const timeline = [];
  const steps = [];
  const readyQueue = [];
  let running = null;
  let time = 0;

  /**
   * Records a discrete simulation step snapshot.
   * @param {string} event - "ARRIVAL" | "DISPATCH" | "COMPLETE" | "IDLE"
   * @param {string} description - Human-readable explanation of the event
   */
  function recordStep(event, description) {
    steps.push({
      time,
      event,
      description,
      running: running ? running.pid : null,
      readyQueue: readyQueue.map(p => p.pid),
      states: { ...states },
    });
  }

  // Main simulation loop
  while (unloaded.length > 0 || readyQueue.length > 0 || running !== null) {
    if (running === null) {
      // 1. Process any process arrivals that occur at the current time
      while (unloaded.length > 0 && unloaded[0].arrival <= time) {
        const proc = unloaded.shift();
        proc.state = ProcessState.READY;
        states[proc.pid] = ProcessState.READY;
        readyQueue.push(proc);
        recordStep('ARRIVAL', `t=${time}: ${proc.pid} arrives and joins the ready queue`);
      }

      // 2. If ready queue has waiting processes, dispatch the head of the queue
      if (readyQueue.length > 0) {
        running = readyQueue.shift();
        running.state = ProcessState.RUNNING;
        states[running.pid] = ProcessState.RUNNING;

        // Record first CPU dispatch time for response time calculation
        if (running.firstRun === -1) {
          running.firstRun = time;
          running.response = time - running.arrival;
        }

        recordStep('DISPATCH', `t=${time}: ${running.pid} is dispatched to the CPU`);
      } else if (unloaded.length > 0) {
        // 3. CPU is idle until the next process arrival
        const nextArrival = unloaded[0].arrival;
        recordStep('IDLE', `t=${time}: CPU is idle waiting for processes to arrive`);
        timeline.push({ pid: 'IDLE', start: time, end: nextArrival });
        time = nextArrival;
      }
    } else {
      // CPU is executing the running process
      const burstStartTime = time;
      const finishTime = burstStartTime + running.burst;

      // Handle any process arrivals that occur strictly during this execution burst
      while (unloaded.length > 0 && unloaded[0].arrival < finishTime) {
        const nextArrTime = unloaded[0].arrival;
        time = nextArrTime;

        while (unloaded.length > 0 && unloaded[0].arrival === time) {
          const proc = unloaded.shift();
          proc.state = ProcessState.READY;
          states[proc.pid] = ProcessState.READY;
          readyQueue.push(proc);
          recordStep('ARRIVAL', `t=${time}: ${proc.pid} arrives and joins the ready queue`);
        }
      }

      // Complete execution of the running process at finishTime
      time = finishTime;
      timeline.push({ pid: running.pid, start: burstStartTime, end: finishTime });

      running.completion = finishTime;
      running.turnaround = running.completion - running.arrival;
      running.waiting = running.turnaround - running.burst;
      running.state = ProcessState.TERMINATED;
      states[running.pid] = ProcessState.TERMINATED;

      const completedPid = running.pid;
      running = null;

      recordStep('COMPLETE', `t=${time}: ${completedPid} finishes execution`);
    }
  }

  // Calculate final metrics in original input order
  const finalProcesses = processes
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map(p => ({
      pid: p.pid,
      arrival: p.arrival,
      burst: p.burst,
      completion: p.completion,
      turnaround: p.turnaround,
      waiting: p.waiting,
      response: p.response,
    }));

  const n = finalProcesses.length;
  const totalWaiting = finalProcesses.reduce((acc, p) => acc + p.waiting, 0);
  const totalTurnaround = finalProcesses.reduce((acc, p) => acc + p.turnaround, 0);
  const totalResponse = finalProcesses.reduce((acc, p) => acc + p.response, 0);
  const totalBusyTime = finalProcesses.reduce((acc, p) => acc + p.burst, 0);

  const totalTime = timeline.length > 0 ? timeline[timeline.length - 1].end : 0;
  const cpuUtilization = totalTime > 0 ? roundToTwo((totalBusyTime / totalTime) * 100) : 100;

  return {
    timeline,
    processes: finalProcesses,
    averages: {
      waiting: n > 0 ? roundToTwo(totalWaiting / n) : 0,
      turnaround: n > 0 ? roundToTwo(totalTurnaround / n) : 0,
      response: n > 0 ? roundToTwo(totalResponse / n) : 0,
    },
    cpuUtilization,
    steps,
  };
}

// Alias for compatibility
export const simulateFCFS = runFCFS;
