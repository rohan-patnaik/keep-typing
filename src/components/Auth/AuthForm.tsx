import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function AuthForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError(null);
    if (!supabase) {
      setError('Supabase client not initialized. Cannot sign in.');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
    }
    // Supabase handles the redirect, so no need for router.push here on success
  };

  return (
    <div className="bg-gray-900 p-8 rounded-xl shadow-2xl text-center">
      <h2 className="text-3xl font-bold text-teal-400 mb-6">Sign In</h2>
      <button
        onClick={handleGoogleSignIn}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out flex items-center justify-center"
      >
        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.24 10.24v3.52h6.08c-.24 1.52-.96 2.8-2.08 3.68l-.08.08 2.8 2.16 2.24-2.16c1.44-1.36 2.24-3.2 2.24-5.28 0-1.84-.64-3.52-1.76-4.88l-.08-.08-2.8-2.16-2.24 2.16c-1.44-1.36-2.24-3.2-2.24-5.28z" fill="#4285F4"/>
          <path d="M12.24 10.24v3.52h6.08c-.24 1.52-.96 2.8-2.08 3.68l-.08.08 2.8 2.16 2.24-2.16c1.44-1.36 2.24-3.2 2.24-5.28 0-1.84-.64-3.52-1.76-4.88l-.08-.08-2.8-2.16-2.24 2.16c-1.44-1.36-2.24-3.2-2.24-5.28z" fill="#34A853"/>
          <path d="M12.24 10.24v3.52h6.08c-.24 1.52-.96 2.8-2.08 3.68l-.08.08 2.8 2.16 2.24-2.16c1.44-1.36 2.24-3.2 2.24-5.28 0-1.84-.64-3.52-1.76-4.88l-.08-.08-2.8-2.16-2.24 2.16c-1.44-1.36-2.24-3.2-2.24-5.28z" fill="#FBBC05"/>
          <path d="M12.24 10.24v3.52h6.08c-.24 1.52-.96 2.8-2.08 3.68l-.08.08 2.8 2.16 2.24-2.16c1.44-1.36 2.24-3.2 2.24-5.28 0-1.84-.64-3.52-1.76-4.88l-.08-.08-2.8-2.16-2.24 2.16c-1.44-1.36-2.24-3.2-2.24-5.28z" fill="#EA4335"/>
        </svg>
        Sign In with Google
      </button>

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </div>
  );
}
