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

function validateInput(totalKeystrokes: number, correctKeystrokes: number, durationSeconds: number): void {
  if (totalKeystrokes < 0) throw new Error('totalKeystrokes must be non-negative');
  if (correctKeystrokes < 0) throw new Error('correctKeystrokes must be non-negative');
  if (durationSeconds <= 0) throw new Error('durationSeconds must be positive');
  if (correctKeystrokes > totalKeystrokes) throw new Error('correctKeystrokes cannot exceed totalKeystrokes');
}

export function computeRawWpm(totalKeystrokes: number, durationSeconds: number): number {
  validateInput(totalKeystrokes, 0, durationSeconds); // We don't use correctKeystrokes here, so set to 0 for validation
  const minutes = durationSeconds / 60;
  // WPM = (total keystrokes / 5) / minutes
  return Math.round((totalKeystrokes / 5) / minutes);
}

export function computeNetWpm(correctKeystrokes: number, durationSeconds: number): number {
  validateInput(correctKeystrokes, correctKeystrokes, durationSeconds);
  const minutes = durationSeconds / 60;
  return Math.round((correctKeystrokes / 5) / minutes);
}

export function computeAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes === 0) return 0;
  return parseFloat(((correctKeystrokes / totalKeystrokes) * 100).toFixed(1));
}

export function computeMetrics(input: MetricsInput): MetricsOutput {
  const { totalKeystrokes, correctKeystrokes, durationSeconds } = input;
  validateInput(totalKeystrokes, correctKeystrokes, durationSeconds);
  return {
    rawWpm: computeRawWpm(totalKeystrokes, durationSeconds),
    netWpm: computeNetWpm(correctKeystrokes, durationSeconds),
    accuracy: computeAccuracy(correctKeystrokes, totalKeystrokes),
  };
}