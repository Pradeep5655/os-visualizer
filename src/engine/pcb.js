/**
 * Process Control Block (PCB) Helper
 * 
 * In an Operating System, the Process Control Block (PCB, also called Task Control Block)
 * is a fundamental kernel data structure containing all information about a specific process.
 * The OS creates a PCB when a process is created and updates it across state transitions.
 */

export const ProcessState = {
  NEW: 'New',               // Process is being created / loaded into memory pool
  READY: 'Ready',           // Process is waiting in the ready queue to be allocated CPU
  RUNNING: 'Running',       // Process instructions are currently being executed on CPU
  WAITING: 'Waiting',       // Process is waiting for an I/O or synchronization event
  TERMINATED: 'Terminated', // Process has finished execution and kernel reclaims its resources
};

/**
 * Creates and initializes a Process Control Block (PCB) structure.
 * 
 * @param {Object} params
 * @param {string} params.pid - Process Identifier: Unique process label (e.g. "P1")
 * @param {number} params.arrival - Arrival Time: Time instant when process enters the ready queue pool
 * @param {number} params.burst - CPU Burst Time: Total CPU time needed to complete execution
 * @param {number} [params.priority=1] - Priority Level: Used by priority scheduling algorithms
 * @returns {Object} Process object initialized with scheduling metrics
 */
export function createPCB({ pid, arrival = 0, burst = 1, priority = 1 }) {
  return {
    // Identity & Static Attributes
    pid: String(pid),
    arrival: Number(arrival),
    burst: Number(burst),
    priority: Number(priority),

    // Dynamic Execution State
    remaining: Number(burst),       // Remaining CPU time needed to finish execution
    state: ProcessState.NEW,        // Current lifecycle state in the OS process model
    firstRun: -1,                   // Timestamp when process was first scheduled on CPU (-1 if unrun)

    // Performance Metrics (Calculated upon completion or during execution)
    completion: 0,                  // Completion Time (CT): Time when process finishes execution
    turnaround: 0,                  // Turnaround Time (TAT = CT - AT): Total time spent in system
    waiting: 0,                     // Waiting Time (WT = TAT - BT): Time spent waiting in ready queue
    response: -1,                   // Response Time (RT = FirstRun - AT): Time taken to start executing
  };
}
