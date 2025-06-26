import { supabase } from './supabaseClient';
import { MetricsOutput } from './metrics';

export interface TestResult {
  id: string;
  user_id: string;
  wpm: number;
  accuracy: number;
  duration_seconds: number;
  typed_at: string;
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
  return data;
}

/**
 * Fetches all test results for a given user.
 * @param userId The ID of the user.
 * @returns An array of test results or null if an error occurred.
 */
export async function fetchUserTestResults(userId: string): Promise<TestResult[] | null> {
  const { data, error } = await supabase
    .from('test_results')
    .select('id, wpm, accuracy, duration_seconds, typed_at')
    .eq('user_id', userId)
    .order('typed_at', { ascending: false });

  if (error) {
    console.error('Error fetching test results:', error);
    return null;
  }
  return data;
}
