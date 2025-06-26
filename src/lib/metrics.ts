
export interface MetricsOutput {
  rawWpm: number;
  netWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

/**
 * Calculates typing metrics based on user input and the original text.
 *
 * @param originalText The text the user was supposed to type.
 * @param typedText The text the user actually typed.
 * @param durationSeconds The duration of the test in seconds.
 * @returns An object containing WPM, accuracy, and character counts.
 */
export function computeMetrics(
  originalText: string,
  typedText: string,
  durationSeconds: number
): MetricsOutput {
  if (durationSeconds <= 0 || typedText.length === 0) {
    return { rawWpm: 0, netWpm: 0, accuracy: 0, correctChars: 0, incorrectChars: 0, totalChars: 0 };
  }

  const durationMinutes = durationSeconds / 60;
  const rawWpm = Math.round((typedText.length / 5) / durationMinutes);

  let correctChars = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (i < originalText.length && typedText[i] === originalText[i]) {
      correctChars++;
    }
  }

  const incorrectChars = typedText.length - correctChars;
  const accuracy = Math.round((correctChars / typedText.length) * 100);

  const errorRate = incorrectChars / durationMinutes;
  const netWpm = Math.max(0, Math.round(rawWpm - errorRate));

  return { rawWpm, netWpm, accuracy, correctChars, incorrectChars, totalChars: typedText.length };
}
