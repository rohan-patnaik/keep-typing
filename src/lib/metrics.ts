// src/lib/metrics.ts

/**
 * Computes raw words per minute (gross WPM) based on total characters typed
 * and elapsed time.
 * @param charCount Number of characters typed.
 * @param elapsedSec Elapsed time in seconds.
 * @returns Raw WPM.
 */
export function computeRawWPM(
    charCount: number,
    elapsedSec: number
  ): number {
    if (elapsedSec <= 0) return 0;
    const words = charCount / 5;
    return (words / elapsedSec) * 60;
  }
  
  /**
   * Computes net words per minute (only correctly typed characters)
   * over elapsed time.
   * @param correctCharCount Number of correctly typed characters.
   * @param elapsedSec Elapsed time in seconds.
   * @returns Net WPM.
   */
  export function computeNetWPM(
    correctCharCount: number,
    elapsedSec: number
  ): number {
    if (elapsedSec <= 0) return 0;
    const words = correctCharCount / 5;
    return (words / elapsedSec) * 60;
  }
  
  /**
   * Computes typing accuracy as a percentage of correctly typed characters
   * over total characters in the reference text.
   * @param correctCharCount Number of correctly typed characters.
   * @param totalCharCount Total characters in reference text.
   * @returns Accuracy percentage (0–100).
   */
  export function computeAccuracy(
    correctCharCount: number,
    totalCharCount: number
  ): number {
    if (totalCharCount <= 0) return 0;
    return (correctCharCount / totalCharCount) * 100;
  }