import { supabase } from './supabaseClient';
import { TestResult } from './results';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  threshold?: number; // e.g., WPM for speed achievements
  type: 'wpm' | 'first_test';
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achieved_at: string;
}

// Define all possible achievements
export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_test',
    name: 'First Test Complete',
    description: 'Complete your very first typing test.',
    type: 'first_test',
  },
  {
    id: 'wpm_50',
    name: 'Speed Demon I',
    description: 'Achieve a Net WPM of 50 or higher.',
    threshold: 50,
    type: 'wpm',
  },
  {
    id: 'wpm_100',
    name: 'Speed Demon II',
    description: 'Achieve a Net WPM of 100 or higher.',
    threshold: 100,
    type: 'wpm',
  },
];

/**
 * Checks for and records new achievements for a user based on a test result.
 * @param userId The ID of the user.
 * @param testResult The completed test result.
 */
export async function checkAndRecordAchievements(userId: string, testResult: TestResult) {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot check achievements.');
    return;
  }

  for (const achievement of ALL_ACHIEVEMENTS) {
    let isAchieved = false;

    // Check if the user already has this achievement
    const { data: existingAchievement, error: existingError } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievement.id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error(`Error checking existing achievement ${achievement.id}:`, existingError);
      continue;
    }

    if (existingAchievement) {
      // User already has this achievement, skip
      continue;
    }

    switch (achievement.type) {
      case 'first_test':
        // For 'first_test', simply completing a test is enough
        isAchieved = true;
        break;
      case 'wpm':
        if (achievement.threshold && testResult.wpm >= achievement.threshold) {
          isAchieved = true;
        }
        break;
      // Add more achievement types here as needed
    }

    if (isAchieved) {
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
        });

      if (insertError) {
        console.error(`Error recording achievement ${achievement.id}:`, insertError);
      } else {
        console.log(`Achievement unlocked: ${achievement.name} for user ${userId}`);
      }
    }
  }
}

/**
 * Fetches all achievements for a given user.
 * @param userId The ID of the user.
 * @returns An array of user achievements or null if an error occurred.
 */
export async function fetchUserAchievements(userId: string): Promise<UserAchievement[] | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot fetch user achievements.');
    return null;
  }

  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      id,
      achieved_at,
      achievement:achievements(id, name, description)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user achievements:', error);
    return null;
  }

  return data.map((ua: any) => ({
    id: ua.id,
    user_id: userId,
    achievement_id: ua.achievement.id,
    achieved_at: ua.achieved_at,
    achievement: {
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
    },
  }));
}
