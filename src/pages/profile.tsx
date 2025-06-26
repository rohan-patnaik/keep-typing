import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchUserAchievements, ALL_ACHIEVEMENTS, UserAchievement } from '../lib/achievements';
import { calculateLevel, LevelInfo } from '../lib/levels';
import { supabase } from '../lib/supabaseClient';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [totalWpm, setTotalWpm] = useState<number>(0);
  const [loadingTotalWpm, setLoadingTotalWpm] = useState(true);

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
          .select('total_wpm')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching total WPM:', error);
        } else if (data) {
          setTotalWpm(data.total_wpm || 0);
        }
        setLoadingTotalWpm(false);
      }
    }
    fetchTotalWpm();
  }, [user]);

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
          <p><strong>Name:</strong> {userName}</p>
          <p><strong>Email:</strong> {user.email}</p>
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
