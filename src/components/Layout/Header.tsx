import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300">
          keep-typing
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/leaderboard" className="px-4 py-2 text-gray-300 hover:text-teal-300 transition-colors">
            Leaderboard
          </Link>
          {user ? (
            <>
              <span className="text-gray-300">{user.email}</span>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">
                Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}