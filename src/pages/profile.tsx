import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchUserAchievements, UserAchievement } from '../lib/achievements';
import { calculateLevel, LevelInfo } from '../lib/levels';
import { supabase } from '../lib/supabaseClient';
import { fetchMyTestResults, TestResult } from '../lib/results'; // Import fetchMyTestResults and TestResult

export default function ProfilePage() {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [totalWpm, setTotalWpm] = useState<number>(0);
  const [loadingTotalWpm, setLoadingTotalWpm] = useState(true);
  const [displayName, setDisplayName] = useState<string>('');
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [savingDisplayName, setSavingDisplayName] = useState(false);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [recentTests, setRecentTests] = useState<TestResult[]>([]); // State for recent tests
  const [loadingRecentTests, setLoadingRecentTests] = useState(true); // Loading state for recent tests

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || user.email || '');
    }
  }, [user]);

  useEffect(() => {
    async function getAchievements() {
      if (user) {
        setLoadingAchievements(true);
        const achievements = await fetchUserAchievements(user.id);
        if (achievements) {
          setUserAchievements(achievements);
        }
        setLoadingAchievements(false);
      }
    }
    getAchievements();
  }, [user]);

  useEffect(() => {
    async function fetchTotalWpm() {
      if (user && supabase) {
        setLoadingTotalWpm(true);
        const { data, error } = await supabase
          .from('auth.users')
          .select('raw_user_meta_data')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching total WPM:', error);
        } else if (data) {
          setTotalWpm(data.raw_user_meta_data?.total_wpm || 0);
        }
        setLoadingTotalWpm(false);
      }
    }
    fetchTotalWpm();
  }, [user]);

  useEffect(() => {
    async function getRecentTests() {
      if (user) {
        setLoadingRecentTests(true);
        // Fetching only a few recent tests, e.g., last 5
        const tests = await fetchMyTestResults(user.id);
        if (tests) {
          setRecentTests(tests.slice(0, 5)); // Displaying only the 5 most recent tests
        }
        setLoadingRecentTests(false);
      }
    }
    getRecentTests();
  }, [user]);

  const handleSaveDisplayName = async () => {
    if (!user || !supabase) return;
    setSavingDisplayName(true);
    setDisplayNameError(null);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: displayName },
      });

      if (error) {
        setDisplayNameError(error.message);
      } else {
        console.log('Display name updated successfully:', data);
        setIsEditingDisplayName(false);
      }
    } catch (err: any) {
      setDisplayNameError(err.message);
    } finally {
      setSavingDisplayName(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <p className="text-xl text-red-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const levelInfo: LevelInfo = calculateLevel(totalWpm);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-400 tracking-wide">
          User Profile
        </h1>

        <div className="text-lg text-gray-200 space-y-4 mb-8">
          <p><strong>Email:</strong> {user.email}</p>
          <div className="flex items-center space-x-2">
            <strong>Display Name:</strong>
            {isEditingDisplayName ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-grow px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={savingDisplayName}
              />
            ) : (
              <span>{userName}</span>
            )}
            {isEditingDisplayName ? (
              <button
                onClick={handleSaveDisplayName}
                disabled={savingDisplayName}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingDisplayName ? 'Saving...' : 'Save'}
              </button>
            ) : (
              <button
                onClick={() => setIsEditingDisplayName(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          {displayNameError && <p className="text-red-500 text-sm">{displayNameError}</p>}

          {loadingTotalWpm ? (
            <p>Loading level info...</p>
          ) : (
            <>
              <p><strong>Level:</strong> {levelInfo.level}</p>
              <p><strong>Total WPM:</strong> {totalWpm}</p>
              {levelInfo.level < 10 ? (
                <p><strong>Progress to next level:</strong> {levelInfo.progressToNextLevel}%</p>
              ) : (
                <p><strong>Max Level Reached!</strong></p>
              )}
            </>
          )}
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-teal-400 tracking-wide">
          Recent Tests
        </h2>

        {loadingRecentTests ? (
          <p className="text-center text-gray-400">Loading recent tests...</p>
        ) : recentTests.length > 0 ? (
          <div className="space-y-4">
            {recentTests.map((test) => (
              <div key={test.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold text-yellow-400">{test.wpm} WPM</p>
                  <p className="text-gray-300">{test.accuracy}% Accuracy</p>
                </div>
                <p className="text-sm text-gray-500">{new Date(test.typed_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No recent tests found. Complete a test to see it here!</p>
        )}

        <h2 className="text-3xl font-bold text-center mb-6 mt-8 text-teal-400 tracking-wide">
          Achievements
        </h2>

        {loadingAchievements ? (
          <p className="text-center text-gray-400">Loading achievements...</p>
        ) : userAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userAchievements.map((ua) => (
              <div key={ua.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-yellow-400">{ua.achievement.name}</h3>
                <p className="text-gray-300">{ua.achievement.description}</p>
                <p className="text-sm text-gray-500">Achieved on: {new Date(ua.achieved_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No achievements yet. Complete tests to earn them!</p>
        )}
      </div>
    </div>
  );
}
