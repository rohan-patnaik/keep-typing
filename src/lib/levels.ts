export interface LevelInfo {
  level: number;
  minTotalWpm: number;
  maxTotalWpm: number;
  progressToNextLevel: number; // Percentage
}

// Define level thresholds (example: total WPM needed to reach a level)
const LEVEL_THRESHOLDS = [
  0,   // Level 0
  100, // Level 1
  300, // Level 2
  600, // Level 3
  1000, // Level 4
  1500, // Level 5
  2000, // Level 6
  2600, // Level 7
  3300, // Level 8
  4100, // Level 9
  5000, // Level 10
];

/**
 * Calculates the user's current level and progress based on their total WPM.
 * @param totalWpm The sum of WPM from all completed tests.
 * @returns An object containing the current level, WPM range for the level, and progress to the next level.
 */
export function calculateLevel(totalWpm: number): LevelInfo {
  let level = 0;
  let minTotalWpm = 0;
  let maxTotalWpm = 0;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalWpm >= LEVEL_THRESHOLDS[i]) {
      level = i;
      minTotalWpm = LEVEL_THRESHOLDS[i];
      if (i + 1 < LEVEL_THRESHOLDS.length) {
        maxTotalWpm = LEVEL_THRESHOLDS[i + 1];
      } else {
        // Max level reached
        maxTotalWpm = totalWpm; // Or some other indicator for max level
      }
    } else {
      break;
    }
  }

  let progressToNextLevel = 0;
  if (level < LEVEL_THRESHOLDS.length - 1) {
    const levelRange = maxTotalWpm - minTotalWpm;
    const progressInLevel = totalWpm - minTotalWpm;
    progressToNextLevel = (progressInLevel / levelRange) * 100;
  } else {
    progressToNextLevel = 100; // Max level, always 100% progress
  }

  return {
    level,
    minTotalWpm,
    maxTotalWpm,
    progressToNextLevel: Math.min(100, Math.max(0, Math.round(progressToNextLevel))),
  };
}
