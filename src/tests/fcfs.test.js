import { describe, it, expect } from 'vitest';
import { runFCFS } from '../engine/scheduling/fcfs';
import { ProcessState } from '../engine/pcb';

describe('FCFS Simulation Engine', () => {
  describe('Spec Section 7 Standard Test Cases', () => {
    it('FCFS Test 1: Convoy Effect (Silberschatz) - all arrive at t=0', () => {
      const input = {
        processes: [
          { pid: 'P1', arrival: 0, burst: 24, priority: 1 },
          { pid: 'P2', arrival: 0, burst: 3, priority: 1 },
          { pid: 'P3', arrival: 0, burst: 3, priority: 1 },
        ],
      };

      const result = runFCFS(input);

      // Timeline
      expect(result.timeline).toEqual([
        { pid: 'P1', start: 0, end: 24 },
        { pid: 'P2', start: 24, end: 27 },
        { pid: 'P3', start: 27, end: 30 },
      ]);

      // Process Metrics
      const [p1, p2, p3] = result.processes;
      expect(p1).toEqual({ pid: 'P1', arrival: 0, burst: 24, completion: 24, turnaround: 24, waiting: 0, response: 0 });
      expect(p2).toEqual({ pid: 'P2', arrival: 0, burst: 3, completion: 27, turnaround: 27, waiting: 24, response: 24 });
      expect(p3).toEqual({ pid: 'P3', arrival: 0, burst: 3, completion: 30, turnaround: 30, waiting: 27, response: 27 });

      // Averages & CPU Utilization
      expect(result.averages.waiting).toBe(17);
      expect(result.averages.turnaround).toBe(27);
      expect(result.averages.response).toBe(17);
      expect(result.cpuUtilization).toBe(100);
    });

    it('FCFS Test 2: Staggered arrival times', () => {
      const input = {
        processes: [
          { pid: 'P1', arrival: 0, burst: 5, priority: 1 },
          { pid: 'P2', arrival: 1, burst: 3, priority: 1 },
          { pid: 'P3', arrival: 2, burst: 8, priority: 1 },
          { pid: 'P4', arrival: 3, burst: 6, priority: 1 },
        ],
      };

      const result = runFCFS(input);

      // Timeline
      expect(result.timeline).toEqual([
        { pid: 'P1', start: 0, end: 5 },
        { pid: 'P2', start: 5, end: 8 },
        { pid: 'P3', start: 8, end: 16 },
        { pid: 'P4', start: 16, end: 22 },
      ]);

      // Process Metrics
      const [p1, p2, p3, p4] = result.processes;
      expect(p1.completion).toBe(5);
      expect(p2.completion).toBe(8);
      expect(p3.completion).toBe(16);
      expect(p4.completion).toBe(22);

      expect(p1.waiting).toBe(0);
      expect(p2.waiting).toBe(4);
      expect(p3.waiting).toBe(6);
      expect(p4.waiting).toBe(13);

      expect(p1.turnaround).toBe(5);
      expect(p2.turnaround).toBe(7);
      expect(p3.turnaround).toBe(14);
      expect(p4.turnaround).toBe(19);

      expect(p1.response).toBe(0);
      expect(p2.response).toBe(4);
      expect(p3.response).toBe(6);
      expect(p4.response).toBe(13);

      // Averages & CPU Utilization
      expect(result.averages.waiting).toBe(5.75);
      expect(result.averages.turnaround).toBe(11.25);
      expect(result.averages.response).toBe(5.75);
      expect(result.cpuUtilization).toBe(100);
    });

    it('FCFS Test 3: Idle CPU gap between processes', () => {
      const input = {
        processes: [
          { pid: 'P1', arrival: 0, burst: 2, priority: 1 },
          { pid: 'P2', arrival: 5, burst: 3, priority: 1 },
        ],
      };

      const result = runFCFS(input);

      // Timeline with IDLE block
      expect(result.timeline).toEqual([
        { pid: 'P1', start: 0, end: 2 },
        { pid: 'IDLE', start: 2, end: 5 },
        { pid: 'P2', start: 5, end: 8 },
      ]);

      // Metrics
      const [p1, p2] = result.processes;
      expect(p1).toEqual({ pid: 'P1', arrival: 0, burst: 2, completion: 2, turnaround: 2, waiting: 0, response: 0 });
      expect(p2).toEqual({ pid: 'P2', arrival: 5, burst: 3, completion: 8, turnaround: 3, waiting: 0, response: 0 });

      expect(result.averages.waiting).toBe(0);
      expect(result.averages.turnaround).toBe(2.5);
      expect(result.averages.response).toBe(0);
      expect(result.cpuUtilization).toBe(62.5);
    });
  });

  describe('Edge Cases & Ordering Guarantees', () => {
    it('handles single process execution', () => {
      const input = {
        processes: [{ pid: 'P1', arrival: 0, burst: 10 }],
      };
      const result = runFCFS(input);

      expect(result.timeline).toEqual([{ pid: 'P1', start: 0, end: 10 }]);
      expect(result.processes[0]).toEqual({
        pid: 'P1',
        arrival: 0,
        burst: 10,
        completion: 10,
        turnaround: 10,
        waiting: 0,
        response: 0,
      });
      expect(result.averages).toEqual({ waiting: 0, turnaround: 10, response: 0 });
      expect(result.cpuUtilization).toBe(100);
    });

    it('handles unsorted input and stably preserves original input order in processes output', () => {
      const input = {
        processes: [
          { pid: 'P3', arrival: 4, burst: 2 },
          { pid: 'P1', arrival: 0, burst: 3 },
          { pid: 'P2', arrival: 1, burst: 4 },
        ],
      };
      const result = runFCFS(input);

      // Timeline executes in arrival order: P1, then P2, then P3
      expect(result.timeline).toEqual([
        { pid: 'P1', start: 0, end: 3 },
        { pid: 'P2', start: 3, end: 7 },
        { pid: 'P3', start: 7, end: 9 },
      ]);

      // Output processes array preserves original input order: [P3, P1, P2]
      expect(result.processes.map(p => p.pid)).toEqual(['P3', 'P1', 'P2']);
      expect(result.processes[0].pid).toBe('P3');
      expect(result.processes[0].completion).toBe(9);
    });

    it('breaks arrival ties by maintaining original input order (stable sort)', () => {
      const input = {
        processes: [
          { pid: 'P1', arrival: 2, burst: 3 },
          { pid: 'P2', arrival: 2, burst: 2 },
          { pid: 'P3', arrival: 2, burst: 1 },
        ],
      };
      const result = runFCFS(input);

      expect(result.timeline).toEqual([
        { pid: 'IDLE', start: 0, end: 2 },
        { pid: 'P1', start: 2, end: 5 },
        { pid: 'P2', start: 5, end: 7 },
        { pid: 'P3', start: 7, end: 8 },
      ]);
    });

    it('handles initial CPU idle gap when first process arrives at t > 0', () => {
      const input = {
        processes: [{ pid: 'P1', arrival: 3, burst: 4 }],
      };
      const result = runFCFS(input);

      expect(result.timeline).toEqual([
        { pid: 'IDLE', start: 0, end: 3 },
        { pid: 'P1', start: 3, end: 7 },
      ]);
      expect(result.processes[0]).toEqual({
        pid: 'P1',
        arrival: 3,
        burst: 4,
        completion: 7,
        turnaround: 4,
        waiting: 0,
        response: 0,
      });
      expect(result.cpuUtilization).toBe(57.14); // (4 / 7) * 100 = 57.1428... -> 57.14
    });

    it('does not mutate the original input object', () => {
      const input = {
        processes: [
          { pid: 'P1', arrival: 0, burst: 5 },
          { pid: 'P2', arrival: 2, burst: 3 },
        ],
      };
      const frozenInput = JSON.parse(JSON.stringify(input));

      runFCFS(input);

      expect(input).toEqual(frozenInput);
    });
  });

  describe('Simulation Step Sequence & Invariants', () => {
    it('ensures steps are in chronological non-decreasing order', () => {
      const input = {
        processes: [
          { pid: 'P1', arrival: 0, burst: 5 },
          { pid: 'P2', arrival: 2, burst: 3 },
          { pid: 'P3', arrival: 4, burst: 2 },
        ],
      };
      const result = runFCFS(input);

      for (let i = 0; i < result.steps.length - 1; i++) {
        expect(result.steps[i].time).toBeLessThanOrEqual(result.steps[i + 1].time);
      }
    });

    it('ensures the final step shows all processes Terminated and CPU not running', () => {
      const input = {
        processes: [
          { pid: 'P1', arrival: 0, burst: 3 },
          { pid: 'P2', arrival: 1, burst: 2 },
        ],
      };
      const result = runFCFS(input);

      const lastStep = result.steps[result.steps.length - 1];
      expect(lastStep.running).toBeNull();
      expect(lastStep.readyQueue).toEqual([]);
      expect(lastStep.states).toEqual({
        P1: ProcessState.TERMINATED,
        P2: ProcessState.TERMINATED,
      });
    });

    it('orders events at the same timestamp t: COMPLETE first, then ARRIVAL, then DISPATCH', () => {
      // P1 runs [0, 2], P2 arrives at t=2, P3 arrives at t=0 and waits
      const input = {
        processes: [
          { pid: 'P1', arrival: 0, burst: 2 },
          { pid: 'P2', arrival: 2, burst: 3 },
        ],
      };
      const result = runFCFS(input);

      // Filter events at time t=2
      const stepsAtT2 = result.steps.filter(s => s.time === 2);
      const eventTypesAtT2 = stepsAtT2.map(s => s.event);

      // COMPLETE (P1) -> ARRIVAL (P2) -> DISPATCH (P2)
      expect(eventTypesAtT2).toEqual(['COMPLETE', 'ARRIVAL', 'DISPATCH']);
    });
  });

  describe('Input Validation & Error Handling', () => {
    it('throws error when input is invalid or empty', () => {
      expect(() => runFCFS(null)).toThrow();
      expect(() => runFCFS({})).toThrow();
      expect(() => runFCFS({ processes: [] })).toThrow(/At least one process is required/);
    });

    it('throws error when process has negative arrival time', () => {
      expect(() =>
        runFCFS({
          processes: [{ pid: 'P1', arrival: -2, burst: 5 }],
        })
      ).toThrow(/arrival time must be an integer >= 0/);
    });

    it('throws error when process has burst time < 1', () => {
      expect(() =>
        runFCFS({
          processes: [{ pid: 'P1', arrival: 0, burst: 0 }],
        })
      ).toThrow(/burst time must be at least 1/);
    });

    it('throws error when duplicate PIDs are provided', () => {
      expect(() =>
        runFCFS({
          processes: [
            { pid: 'P1', arrival: 0, burst: 5 },
            { pid: 'P1', arrival: 2, burst: 3 },
          ],
        })
      ).toThrow(/Duplicate process ID "P1" found/);
    });

    it('throws error when PID is empty or not a string', () => {
      expect(() =>
        runFCFS({
          processes: [{ pid: '', arrival: 0, burst: 5 }],
        })
      ).toThrow(/PID must be a non-empty string/);
    });

    it('throws error when arrival or burst are non-integers', () => {
      expect(() =>
        runFCFS({
          processes: [{ pid: 'P1', arrival: 1.5, burst: 5 }],
        })
      ).toThrow(/arrival time must be an integer >= 0/);

      expect(() =>
        runFCFS({
          processes: [{ pid: 'P1', arrival: 0, burst: 2.7 }],
        })
      ).toThrow(/burst time must be at least 1/);
    });
  });
});
