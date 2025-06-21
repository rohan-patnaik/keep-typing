// src/lib/metrics.ts

export interface MetricsInput {
  totalKeystrokes: number;
  correctKeystrokes: number;
  durationSeconds: number;
}

export interface MetricsOutput {
  rawWpm: number;
  netWpm: number;
  accuracy: number;
}

function validateDuration(seconds: number): void {
  if (seconds <= 0) {
    throw new Error('durationSeconds must be > 0');
  }
}

/**
 * Raw WPM = (total keystrokes ÷ 5) ÷ (durationMinutes)
 */
export function computeRawWpm(
  totalKeystrokes: number,
  durationSeconds: number
): number {
  validateDuration(durationSeconds);
  return (totalKeystrokes * 60) / (5 * durationSeconds);
}

/**
 * Net WPM = (correct keystrokes ÷ 5) ÷ (durationMinutes)
 */
export function computeNetWpm(
  correctKeystrokes: number,
  durationSeconds: number
): number {
  validateDuration(durationSeconds);
  return (correctKeystrokes * 60) / (5 * durationSeconds);
}

/**
 * Accuracy % = (correct keystrokes ÷ total keystrokes) × 100
 */
export function computeAccuracy(
  correctKeystrokes: number,
  totalKeystrokes: number
): number {
  if (totalKeystrokes <= 0) {
    return 0;
  }
  return (correctKeystrokes / totalKeystrokes) * 100;
}

/**
 * Bundle all metrics together.
 */
export function computeMetrics(input: MetricsInput): MetricsOutput {
  const { totalKeystrokes, correctKeystrokes, durationSeconds } = input;
  validateDuration(durationSeconds);
  return {
    rawWpm: computeRawWpm(totalKeystrokes, durationSeconds),
    netWpm: computeNetWpm(correctKeystrokes, durationSeconds),
    accuracy: computeAccuracy(correctKeystrokes, totalKeystrokes),
  };
}