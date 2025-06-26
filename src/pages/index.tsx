import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [duration, setDuration] = useState<number>(30);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);

  const startTest = () => {
    // In V1, we'll just navigate to the test page with default settings
    // Future versions might pass these settings as query parameters
    router.push('/test');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-400 tracking-wide">
          keep-typing
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Test Duration</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setDuration(30)}
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
                duration === 30 ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              30s
            </button>
            <button
              onClick={() => setDuration(60)}
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
                duration === 60 ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              60s
            </button>
            <button
              // Custom duration not implemented in V1, just a placeholder
              className="px-6 py-3 rounded-lg text-lg font-semibold bg-gray-700 text-gray-300 cursor-not-allowed opacity-50"
              disabled
            >
              Custom
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Test Settings</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setIncludePunctuation(!includePunctuation)}
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
                includePunctuation ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Punctuation: {includePunctuation ? '✓' : ''}
            </button>
            <button
              onClick={() => setIncludeNumbers(!includeNumbers)}
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
                includeNumbers ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Numbers: {includeNumbers ? '✓' : ''}
            </button>
          </div>
        </div>

        <button
          onClick={startTest}
          className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95"
        >
          Start Test
        </button>
      </div>
    </div>
  );
}
