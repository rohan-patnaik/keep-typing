
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
  if (durationSeconds <= 0) {
    return { rawWpm: 0, netWpm: 0, accuracy: 0, correctChars: 0, incorrectChars: 0, totalChars: 0 };
  }

  const typedChars = typedText.length;
  let correctChars = 0;
  let incorrectChars = 0;

  for (let i = 0; i < typedChars; i++) {
    if (i < originalText.length) {
      if (typedText[i] === originalText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    } else {
      // Any character typed beyond the original text length is an error
      incorrectChars++;
    }
  }

  // Standard WPM calculation uses 5 characters per word
  const wordsTyped = typedChars / 5;
  const minutes = durationSeconds / 60;

  const rawWpm = Math.round(wordsTyped / minutes);

  // Net WPM subtracts uncorrected errors
  const uncorrectedErrors = incorrectChars / minutes;
  const netWpm = Math.round(rawWpm - uncorrectedErrors);

  const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;

  return {
    rawWpm: Math.max(0, rawWpm),
    netWpm: Math.max(0, netWpm),
    accuracy: Math.max(0, accuracy),
    correctChars,
    incorrectChars,
    totalChars: typedChars,
  };
}
