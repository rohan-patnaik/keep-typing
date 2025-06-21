// tests/unit/metrics.test.ts

import {
    computeRawWpm,
    computeNetWpm,
    computeAccuracy,
    computeMetrics,
  } from '../../src/lib/metrics';
  
  describe('metrics module', () => {
    it('computes raw WPM correctly', () => {
      // 250 keystrokes over 30s → (250/5)/(30/60) = 100 WPM
      expect(computeRawWpm(250, 30)).toBeCloseTo(100);
    });
  
    it('computes net WPM correctly', () => {
      // 200 correct keystrokes over 30s → (200/5)/(30/60) = 80 WPM
      expect(computeNetWpm(200, 30)).toBeCloseTo(80);
    });
  
    it('computes accuracy correctly', () => {
      // 200 correct of 250 total → 80%
      expect(computeAccuracy(200, 250)).toBeCloseTo(80);
    });
  
    it('computeMetrics returns all three values', () => {
      const m = computeMetrics({
        totalKeystrokes: 250,
        correctKeystrokes: 200,
        durationSeconds: 30,
      });
      expect(m.rawWpm).toBeCloseTo(100);
      expect(m.netWpm).toBeCloseTo(80);
      expect(m.accuracy).toBeCloseTo(80);
    });
  
    it('throws on zero or negative duration', () => {
      expect(() => computeRawWpm(100, 0)).toThrow('durationSeconds must be > 0');
      expect(() => computeNetWpm(100, -5)).toThrow('durationSeconds must be > 0');
      expect(() =>
        computeMetrics({ totalKeystrokes: 100, correctKeystrokes: 90, durationSeconds: 0 })
      ).toThrow();
    });
  
    it('accuracy is 0 when no keystrokes', () => {
      expect(computeAccuracy(0, 0)).toBeCloseTo(0);
    });
  });