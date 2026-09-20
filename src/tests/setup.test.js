import { describe, it, expect } from 'vitest';
import { ProcessState, createPCB } from '../engine/pcb';
import { validateInput } from '../engine/validation';
import { runFCFS } from '../engine/scheduling/fcfs';

describe('Project Engine Setup', () => {
  it('should initialize PCB properly with default values and OS attributes', () => {
    const pcb = createPCB({ pid: 'P1', arrival: 0, burst: 5 });
    expect(pcb.pid).toBe('P1');
    expect(pcb.arrival).toBe(0);
    expect(pcb.burst).toBe(5);
    expect(pcb.remaining).toBe(5);
    expect(pcb.state).toBe(ProcessState.NEW);
    expect(pcb.firstRun).toBe(-1);
    expect(pcb.completion).toBe(0);
  });

  it('should validate input correctly', () => {
    expect(validateInput({ processes: [] }).valid).toBe(false);
    expect(validateInput({ processes: [{ pid: 'P1', arrival: 0, burst: 5 }] }).valid).toBe(true);
  });

  it('should run FCFS and return standard output format', () => {
    const result = runFCFS({ processes: [{ pid: 'P1', arrival: 0, burst: 5 }] });
    expect(result).toHaveProperty('timeline');
    expect(result).toHaveProperty('processes');
    expect(result).toHaveProperty('averages');
    expect(result).toHaveProperty('cpuUtilization');
    expect(result).toHaveProperty('steps');
  });
});
