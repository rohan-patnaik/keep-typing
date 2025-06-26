import { computeMetrics } from '../../src/lib/metrics';

describe('computeMetrics', () => {
  const ORIGINAL_TEXT = 'The quick brown fox'; // 19 chars
  const DURATION = 10; // seconds

  it('calculates metrics for a perfect performance', () => {
    const typedText = ORIGINAL_TEXT;
    const metrics = computeMetrics(ORIGINAL_TEXT, typedText, DURATION);

    // Raw WPM: (19 chars / 5) / (10s / 60) = 3.8 / 0.166... = 22.8 -> 23
    expect(metrics.rawWpm).toBe(23);
    // Net WPM: 23 - (0 errors / 0.166...) = 23
    expect(metrics.netWpm).toBe(23);
    expect(metrics.accuracy).toBe(100);
    expect(metrics.correctChars).toBe(19);
    expect(metrics.incorrectChars).toBe(0);
  });

  it('calculates metrics with some mistakes', () => {
    const typedText = 'The quik brown fox'; // 18 chars, 1 mistake
    const metrics = computeMetrics(ORIGINAL_TEXT, typedText, DURATION);

    // Raw WPM: (18 chars / 5) / (10s / 60) = 3.6 / 0.166... = 22
    expect(metrics.rawWpm).toBe(22);
    // Net WPM: 22 - (11 incorrect chars / (10s / 60)) = 22 - (11 / 0.166) = 22 - 66 = -44 -> 0
    expect(metrics.netWpm).toBe(0);
    // Accuracy: (7 correct / 18 total) * 100 = 38.8 -> 39
    expect(metrics.accuracy).toBe(39);
    expect(metrics.correctChars).toBe(7);
    expect(metrics.incorrectChars).toBe(11);
  });

  it('handles typing more characters than the original text', () => {
    const typedText = 'The quick brown fox jumps'; // 25 chars
    const metrics = computeMetrics(ORIGINAL_TEXT, typedText, DURATION);

    // Raw WPM: (25 chars / 5) / (10s / 60) = 5 / 0.166... = 30
    expect(metrics.rawWpm).toBe(30);
    // Net WPM: 30 - (6 incorrect chars / (10s / 60)) = 30 - (6 / 0.166) = 30 - 36 = -6 -> 0
    expect(metrics.netWpm).toBe(0);
    // Accuracy: (19 correct / 25 total) * 100 = 76
    expect(metrics.accuracy).toBe(76);
    expect(metrics.correctChars).toBe(19);
    expect(metrics.incorrectChars).toBe(6);
  });

  it('returns all zeros for zero duration', () => {
    const metrics = computeMetrics(ORIGINAL_TEXT, 'some text', 0);
    expect(metrics.rawWpm).toBe(0);
    expect(metrics.netWpm).toBe(0);
    expect(metrics.accuracy).toBe(0);
  });

  it('returns all zeros for no typed text', () => {
    const metrics = computeMetrics(ORIGINAL_TEXT, '', DURATION);
    expect(metrics.rawWpm).toBe(0);
    expect(metrics.netWpm).toBe(0);
    expect(metrics.accuracy).toBe(0);
  });
});
