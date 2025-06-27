import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { TestResult } from '../../src/lib/results';

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResult() {
      if (!id || !supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('test_results')
        .select(`
          id,
          wpm,
          accuracy,
          duration_seconds,
          typed_at,
          user:auth_users(raw_user_meta_data)
        `)
        .eq('id', id as string)
        .single();

      if (error) {
        console.error('Error fetching result:', error);
        setError('Result not found or an error occurred.');
        setResult(null);
      } else if (data) {
        setResult({
          ...data,
          user_id: data.user.id, // Assuming user.id is available
          user_name: data.user?.raw_user_meta_data?.full_name || data.user?.raw_user_meta_data?.name || 'Anonymous',
        });
      }
      setLoading(false);
    }

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <p className="text-xl text-teal-400">Loading Result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <p className="text-xl text-gray-400">Result not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-400 tracking-wide">
          Test Result
        </h1>

        <div className="text-lg text-gray-200 space-y-4">
          <p><strong>User:</strong> {result.user_name}</p>
          <p><strong>WPM:</strong> {result.wpm}</p>
          <p><strong>Accuracy:</strong> {result.accuracy}%</p>
          <p><strong>Duration:</strong> {result.duration_seconds} seconds</p>
          <p><strong>Typed At:</strong> {new Date(result.typed_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
