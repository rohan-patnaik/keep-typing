import React, { useState } from 'react';
import { LeaderboardEntry } from '../lib/results';

export default function LeaderboardPage() {
  const mockLeaderboardData: LeaderboardEntry[] = [
    {
      id: 'mock-1',
      wpm: 75,
      accuracy: 98.5,
      user_name: 'Alice Smith',
    },
    {
      id: 'mock-2',
      wpm: 72,
      accuracy: 97.2,
      user_name: 'Bob Johnson',
    },
    {
      id: 'mock-3',
      wpm: 68,
      accuracy: 99.1,
      user_name: 'Charlie Brown',
    },
    {
      id: 'mock-4',
      wpm: 65,
      accuracy: 96.0,
      user_name: 'Diana Prince',
    },
  ];

  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboardData);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-400 tracking-wide">
          Leaderboard
        </h1>

        {leaderboard && leaderboard.length > 0 ? (
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
          <p className="text-center text-gray-400 text-lg">No results yet. Be the first to set a score!</p>
        )}
      </div>
    </div>
  );
}