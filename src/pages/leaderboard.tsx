import React, { useEffect, useState } from 'react';
import { fetchLeaderboardResults, LeaderboardEntry, fetchMyTestResults } from '../lib/results';
import { useAuth } from '../hooks/useAuth';

type LeaderboardView = 'global' | 'my_results';

// Helper function to generate a random Reddit-style username
const generateRandomUsername = () => {
  const adjectives = ["Adept", "Bold", "Clever", "Daring", "Eager", "Fierce", "Great", "Happy", "Jolly", "Keen", "Lucky", "Mighty", "Noble", "Optimistic", "Proud", "Quick", "Rapid", "Swift", "True", "Vivid"];
  const nouns = ["Coder", "Dev", "Geek", "Hacker", "Ninja", "Panda", "Robot", "Tiger", "Wizard", "Zebra", "Byte", "Pixel", "Kernel", "Logic", "Script"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

// Generate 20 mock leaderboard entries
const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const mockData: LeaderboardEntry[] = [];
  for (let i = 0; i < 20; i++) {
    mockData.push({
      id: `mock-${i + 1}`,
      wpm: Math.floor(Math.random() * (120 - 30 + 1)) + 30, // WPM between 30 and 120
      accuracy: parseFloat((Math.random() * (100 - 85) + 85).toFixed(1)), // Accuracy between 85.0 and 100.0
      user_name: generateRandomUsername(),
    });
  }
  // Sort mock data by WPM descending
  return mockData.sort((a, b) => b.wpm - a.wpm);
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<LeaderboardView>(user ? 'my_results' : 'global');

  useEffect(() => {
    async function loadLeaderboardData() {
      setLoading(true);
      setError(null);
      let fetchedResults: LeaderboardEntry[] | null = null;

      if (view === 'global') {
        // Always show mock data for global leaderboard
        fetchedResults = generateMockLeaderboard();
      } else if (view === 'my_results' && user) {
        // Fetch real data for user's results
        const myRawResults = await fetchMyTestResults(user.id);
        if (myRawResults && myRawResults.length > 0) {
          fetchedResults = myRawResults.map(r => ({
            id: r.id,
            wpm: r.wpm,
            accuracy: r.accuracy,
            user_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'You',
          }));
        } else {
          // If 'my_results' is empty, switch to global view and show a message
          setView('global'); // This will trigger a re-render and re-fetch for 'global'
          setError('You have no personal results yet. Showing global leaderboard. Take a test to see your results here!');
          setLoading(false); // Set loading to false here to avoid infinite loading state
          return; // Exit early, the re-render will handle fetching global
        }
      }

      if (fetchedResults) {
        setLeaderboard(fetchedResults);
      } else if (user) { // Only set error if logged in and fetching real data failed
        setError('Failed to load leaderboard.');
      }
      setLoading(false);
    }
    loadLeaderboardData();
  }, [view, user]); // Depend on view and user

  // If user logs out, switch to global view
  useEffect(() => {
    if (!user && view === 'my_results') {
      setView('global');
    }
  }, [user, view]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-400 tracking-wide">
          Leaderboard
        </h1>

        {user && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setView('global')}
              className={`px-6 py-2 text-lg font-semibold rounded-l-lg transition-colors ${
                view === 'global' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              Global Leaderboard
            </button>
            <button
              onClick={() => setView('my_results')}
              className={`px-6 py-2 text-lg font-semibold rounded-r-lg transition-colors ${
                view === 'my_results' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              My Results
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-xl text-teal-400">Loading Leaderboard...</p>
          </div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Rank</th>
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">WPM</th>
                  <th className="py-3 px-6 text-left">Accuracy</th>
                </tr>
              </thead>
              <tbody className="text-gray-200 text-sm font-light">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                    <td className="py-3 px-6 text-left">{entry.user_name}</td>
                    <td className="py-3 px-6 text-left">{entry.wpm}</td>
                    <td className="py-3 px-6 text-left">{entry.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg">
            No results yet. Be the first to set a score!
          </p>
        )}
      </div>
    </div>
  );
}
