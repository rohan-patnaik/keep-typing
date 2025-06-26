import React from 'react';
import { MetricsOutput } from '../lib/metrics';

interface SummaryScreenProps {
  results: MetricsOutput;
  onRetry: () => void;
  onNewTest: () => void;
}

export default function SummaryScreen({ results, onRetry, onNewTest }: SummaryScreenProps) {
  return (
    <div className="mt-8 text-center p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-yellow-400 mb-4">Test Complete!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Raw WPM</p>
          <p className="text-2xl font-bold text-teal-400">{results.rawWpm}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Net WPM</p>
          <p className="text-2xl font-bold text-teal-400">{results.netWpm}</p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Accuracy</p>
          <p className="text-2xl font-bold text-teal-400">{results.accuracy}%</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out"
        >
          Retry
        </button>
        <button
          onClick={onNewTest}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out"
        >
          New Test
        </button>
      </div>
    </div>
  );
}
