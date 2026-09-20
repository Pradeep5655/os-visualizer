import { describe, it, expect } from 'vitest';
import { ProcessState, createPCB } from '../engine/pcb';
import { simulateFCFS } from '../engine/scheduling/fcfs';

describe('Project Skeleton & Engine Placeholders', () => {
  it('should initialize PCB properly with default values', () => {
    const pcb = createPCB({ pid: 'P1', arrival: 0, burst: 5 });
    expect(pcb.pid).toBe('P1');
    expect(pcb.arrival).toBe(0);
    expect(pcb.burst).toBe(5);
    expect(pcb.state).toBe(ProcessState.NEW);
  });

  it('should have simulateFCFS placeholder returning standard empty result format', () => {
    const result = simulateFCFS({ processes: [] });
    expect(result).toHaveProperty('timeline');
    expect(result).toHaveProperty('processes');
    expect(result).toHaveProperty('averages');
    expect(result).toHaveProperty('steps');
  });
});
