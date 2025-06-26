import { supabase } from './supabaseClient';
import { MetricsOutput } from './metrics';
import { checkAndRecordAchievements } from './achievements';
import { calculateLevel } from './levels';

export interface TestResult {
  id: string;
  user_id: string;
  wpm: number;
  accuracy: number;
  duration_seconds: number;
  typed_at: string;
}

export interface LeaderboardEntry {
  id: string;
  wpm: number;
  accuracy: number;
  user_name: string; // Changed from user_email to user_name
}

/**
 * Saves a test result to the database.
 * @param userId The ID of the user.
 * @param metrics The metrics output from the typing test.
 * @param durationSeconds The duration of the test in seconds.
 * @returns The saved test result or null if an error occurred.
 */
export async function saveTestResult(
  userId: string,
  metrics: MetricsOutput,
  durationSeconds: number
): Promise<TestResult | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot save test result.');
    return null;
  }
  const { data, error } = await supabase
    .from('test_results')
    .insert([
      {
        user_id: userId,
        wpm: metrics.netWpm,
        accuracy: metrics.accuracy,
        duration_seconds: durationSeconds,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error saving test result:', error);
    return null;
  }

  // Update user's total WPM for level progression
  const { data: userData, error: userError } = await supabase
    .from('auth.users') // Access the auth.users table
    .select('total_wpm')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('Error fetching user total_wpm:', userError);
  } else if (userData) {
    const newTotalWpm = (userData.total_wpm || 0) + metrics.netWpm;
    const { error: updateError } = await supabase
      .from('auth.users')
      .update({ total_wpm: newTotalWpm })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user total_wpm:', updateError);
    } else {
      console.log(`User ${userId} total WPM updated to ${newTotalWpm}`);
      // Optionally, you could calculate and log the new level here
      const levelInfo = calculateLevel(newTotalWpm);
      console.log(`User ${userId} is now Level ${levelInfo.level} with ${levelInfo.progressToNextLevel}% progress.`);
    }
  }

  // Check for and record achievements after saving the test result
  if (data) {
    await checkAndRecordAchievements(userId, data);
  }

  return data;
}

/**
 * Fetches all test results for a given user.
 * @param userId The ID of the user.
 * @returns An array of test results or null if an error occurred.
 */
export async function fetchUserTestResults(userId: string): Promise<TestResult[] | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot fetch user test results.');
    return null;
  }
  const { data, error } = await supabase
    .from('test_results')
    .select('id, user_id, wpm, accuracy, duration_seconds, typed_at')
    .eq('user_id', userId)
    .order('typed_at', { ascending: false });

  if (error) {
    console.error('Error fetching test results:', error);
    return null;
  }
  return data;
}

/**
 * Fetches top test results for the leaderboard.
 * @param limit The maximum number of results to fetch. Defaults to 10.
 * @returns An array of leaderboard entries or null if an error occurred.
 */
export async function fetchLeaderboardResults(limit: number = 10): Promise<LeaderboardEntry[] | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot fetch leaderboard results.');
    return null;
  }
  const { data, error } = await supabase
    .from('test_results')
    .select(`
      id,
      wpm,
      accuracy,
      user:auth_users(raw_user_meta_data)
    `)
    .order('wpm', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard results:', error);
    return null;
  }

  // Map the data to the LeaderboardEntry interface, extracting the name from raw_user_meta_data
  return data.map((entry: any) => ({
    id: entry.id,
    wpm: entry.wpm,
    accuracy: entry.accuracy,
    user_name: entry.user?.raw_user_meta_data?.full_name || entry.user?.raw_user_meta_data?.name || 'Anonymous',
  }));
}