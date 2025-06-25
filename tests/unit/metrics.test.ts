// tests/unit/metrics.test.ts
import {
  computeRawWpm,
  computeNetWpm,
  computeAccuracy,
  computeMetrics,
} from '../../src/lib/metrics';

describe('Metrics Calculations', () => {
  describe('computeRawWpm', () => {
    it('calculates raw WPM correctly', () => {
      // 300 keystrokes in 60 seconds: (300/5) / (60/60) = 60
      expect(computeRawWpm(300, 60)).toBe(60);
    });

    it('handles zero duration', () => {
      expect(() => computeRawWpm(300, 0)).toThrow('durationSeconds must be positive');
    });
  });

  describe('computeNetWpm', () => {
    it('calculates net WPM correctly', () => {
      // 240 correct keystrokes in 60 seconds: (240/5) / 1 = 48
      expect(computeNetWpm(240, 60)).toBe(48);
    });
  });

  describe('computeAccuracy', () => {
    it('calculates accuracy correctly', () => {
      // 240 correct out of 300: 80%
      expect(computeAccuracy(240, 300)).toBe(80);
    });

    it('returns 0 when totalKeystrokes is 0', () => {
      expect(computeAccuracy(0, 0)).toBe(0);
    });
  });

  describe('computeMetrics', () => {
    it('returns all metrics', () => {
      const input = { totalKeystrokes: 300, correctKeystrokes: 240, durationSeconds: 60 };
      const result = computeMetrics(input);
      expect(result.rawWpm).toBe(60);
      expect(result.netWpm).toBe(48);
      expect(result.accuracy).toBe(80);
    });
  });
});