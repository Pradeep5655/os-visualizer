/**
 * Input validation for CPU scheduling algorithms
 * Validates process attributes according to Section 5 of PROJECT_SPEC.md.
 */

/**
 * Validates scheduling input configuration.
 * 
 * @param {Object} input - Scheduling simulation input
 * @param {Array} input.processes - List of process objects
 * @param {number} [input.timeQuantum] - Optional time quantum for Round Robin
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      valid: false,
      errors: ['Input must be an object containing a processes array'],
    };
  }

  if (!Array.isArray(input.processes)) {
    return {
      valid: false,
      errors: ['processes must be an array'],
    };
  }

  if (input.processes.length === 0) {
    return {
      valid: false,
      errors: ['At least one process is required'],
    };
  }

  const seenPids = new Set();

  input.processes.forEach((proc, index) => {
    const processLabel = proc && typeof proc.pid === 'string' && proc.pid.trim() !== ''
      ? proc.pid.trim()
      : `Process at index ${index}`;

    if (!proc || typeof proc !== 'object') {
      errors.push(`${processLabel}: invalid process configuration`);
      return;
    }

    // PID Validation
    if (typeof proc.pid !== 'string' || proc.pid.trim() === '') {
      errors.push(`Process at index ${index}: PID must be a non-empty string`);
    } else {
      const trimmedPid = proc.pid.trim();
      if (seenPids.has(trimmedPid)) {
        errors.push(`Duplicate process ID "${trimmedPid}" found`);
      } else {
        seenPids.add(trimmedPid);
      }
    }

    // Arrival Time Validation (integer >= 0)
    if (proc.arrival === undefined || proc.arrival === null || !Number.isInteger(Number(proc.arrival)) || Number(proc.arrival) < 0) {
      errors.push(`${processLabel}: arrival time must be an integer >= 0`);
    }

    // Burst Time Validation (integer >= 1)
    if (proc.burst === undefined || proc.burst === null || !Number.isInteger(Number(proc.burst)) || Number(proc.burst) < 1) {
      errors.push(`${processLabel}: burst time must be at least 1`);
    }

    // Optional Priority Validation (must be integer if provided)
    if (proc.priority !== undefined && proc.priority !== null && !Number.isInteger(Number(proc.priority))) {
      errors.push(`${processLabel}: priority must be an integer`);
    }
  });

  // Time Quantum Validation (if provided, must be integer >= 1)
  if (input.timeQuantum !== undefined && input.timeQuantum !== null) {
    if (!Number.isInteger(Number(input.timeQuantum)) || Number(input.timeQuantum) < 1) {
      errors.push('Time quantum must be an integer >= 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
