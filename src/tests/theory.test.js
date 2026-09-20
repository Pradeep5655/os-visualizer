import { describe, it, expect } from 'vitest';
import { ALGORITHM_THEORY } from '../data/theory';
import { validateInput } from '../engine/validation';
import { runFCFS } from '../engine/scheduling/fcfs';

describe('Theory Educational Data & Quiz Verification', () => {
  const fcfsTheory = ALGORITHM_THEORY.fcfs;

  it('has complete required theory schema fields for FCFS', () => {
    expect(fcfsTheory).toBeDefined();
    expect(fcfsTheory.id).toBe('fcfs');
    expect(fcfsTheory.title).toBeDefined();
    expect(fcfsTheory.analogy).toHaveProperty('title');
    expect(fcfsTheory.analogy).toHaveProperty('text');
    expect(Array.isArray(fcfsTheory.keyTerms)).toBe(true);
    expect(fcfsTheory.keyTerms.length).toBeGreaterThan(0);
    expect(Array.isArray(fcfsTheory.steps)).toBe(true);
    expect(typeof fcfsTheory.pseudocode).toBe('string');
    expect(Array.isArray(fcfsTheory.formulas)).toBe(true);
    expect(fcfsTheory.demoInput).toBeDefined();
    expect(fcfsTheory.comparison).toBeDefined();
    expect(fcfsTheory.complexity).toHaveProperty('time');
    expect(fcfsTheory.complexity).toHaveProperty('space');
    expect(Array.isArray(fcfsTheory.realWorld)).toBe(true);
    expect(Array.isArray(fcfsTheory.mistakes)).toBe(true);
    expect(Array.isArray(fcfsTheory.quiz)).toBe(true);
  });

  it('validates all simulation inputs embedded in theory data', () => {
    // Demo Input
    const demoValidation = validateInput(fcfsTheory.demoInput);
    expect(demoValidation.valid).toBe(true);
    expect(demoValidation.errors).toEqual([]);

    // Convoy Effect Comparison Inputs
    const scenarioAValidation = validateInput(fcfsTheory.comparison.scenarioA.input);
    expect(scenarioAValidation.valid).toBe(true);
    expect(scenarioAValidation.errors).toEqual([]);

    const scenarioBValidation = validateInput(fcfsTheory.comparison.scenarioB.input);
    expect(scenarioBValidation.valid).toBe(true);
    expect(scenarioBValidation.errors).toEqual([]);
  });

  it('proves Convoy Effect mathematically with runFCFS: Scenario A produces avg WT 17 and TAT 27', () => {
    const resA = runFCFS(fcfsTheory.comparison.scenarioA.input);
    expect(resA.averages.waiting).toBe(17);
    expect(resA.averages.turnaround).toBe(27);
  });

  it('proves Convoy Effect mathematically with runFCFS: Scenario B produces avg WT 3 and TAT 13', () => {
    const resB = runFCFS(fcfsTheory.comparison.scenarioB.input);
    expect(resB.averages.waiting).toBe(3);
    expect(resB.averages.turnaround).toBe(13);
  });

  it('ensures every quiz question has valid options and correctIndex within bounds', () => {
    fcfsTheory.quiz.forEach((q, idx) => {
      expect(typeof q.question).toBe('string');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(typeof q.explanation).toBe('string');
    });
  });

  it('verifies Quiz Question 4 math matches runFCFS simulation output exactly (Avg WT = 2.67)', () => {
    const q4 = fcfsTheory.quiz[3];
    expect(q4.question).toContain('P1(Arrival: 0, Burst: 4)');

    const simInput = {
      processes: [
        { pid: 'P1', arrival: 0, burst: 4 },
        { pid: 'P2', arrival: 1, burst: 3 },
        { pid: 'P3', arrival: 2, burst: 1 },
      ],
    };

    const simResult = runFCFS(simInput);
    expect(simResult.averages.waiting).toBe(2.67);

    // Ensure the correct answer option string is "2.67"
    const chosenOption = q4.options[q4.correctIndex];
    expect(chosenOption).toBe('2.67');
  });
});
