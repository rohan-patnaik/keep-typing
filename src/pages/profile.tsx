import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <p className="text-xl text-red-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  // Attempt to get the user's full name from raw_user_meta_data
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-400 tracking-wide">
          User Profile
        </h1>

        <div className="text-lg text-gray-200 space-y-4">
          <p><strong>Name:</strong> {userName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Add more profile details here as needed in future tickets */}
        </div>
      </div>
    </div>
  );
}
