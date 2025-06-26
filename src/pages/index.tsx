import { useState, useEffect, useRef } from 'react';
import { Timer } from '../lib/timer';
import { computeMetrics, MetricsOutput } from '../lib/metrics';
import { useAuth } from '../hooks/useAuth';
import { saveTestResult } from '../lib/results';
import SummaryScreen from '../components/SummaryScreen'; // Import SummaryScreen

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog.";
const TEST_DURATION_SECONDS = 30;

export default function TestScreen() {
  const [textToType] = useState(SAMPLE_TEXT);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [results, setResults] = useState<MetricsOutput | null>(null);

  const timerRef = useRef<Timer | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (inputRef.current && !testFinished) {
      inputRef.current.focus();
    }
  }, [testStarted, testFinished]);

  useEffect(() => {
    if (testStarted && !testFinished) {
      timerRef.current = new Timer(
        TEST_DURATION_SECONDS,
        (remaining) => setTimeLeft(remaining),
        async () => {
          setTestFinished(true);
          setTestStarted(false);
          const finalMetrics = computeMetrics(textToType, userInput, TEST_DURATION_SECONDS);
          setResults(finalMetrics);

          if (user && finalMetrics) {
            await saveTestResult(user.id, finalMetrics, TEST_DURATION_SECONDS);
            console.log('Test result saved!');
          }
          console.log("Test finished!");
        }
      );
      timerRef.current.start();
    }
    return () => {
      timerRef.current?.reset();
    };
  }, [testStarted, testFinished, textToType, userInput, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (testFinished) return;
    if (!testStarted) {
      setTestStarted(true);
    }
    setUserInput(e.target.value);
  };

  const resetTest = () => {
    setTestFinished(false);
    setTestStarted(false);
    setUserInput('');
    setResults(null);
    setTimeLeft(TEST_DURATION_SECONDS);
    timerRef.current?.reset();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderTextDisplay = () => {
    return textToType.split('').map((char, index) => {
      let className = "text-gray-500";
      if (index < userInput.length) {
        className = char === userInput[index] ? "text-green-400" : "text-red-500";
      }
      if (index === userInput.length && testStarted && !testFinished) {
        className += " underline decoration-teal-500 decoration-2";
      }
      return <span key={index} className={className}>{char}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-400 tracking-wide">
          Typing Test
        </h1>

        {!testFinished && (
          <div
            className="mb-6 p-5 bg-gray-800 rounded-lg shadow-inner h-36 overflow-y-auto text-2xl leading-relaxed tracking-wider font-mono select-none"
            onClick={() => inputRef.current?.focus()}
          >
            {renderTextDisplay()}
          </div>
        )}

        {!testFinished && (
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onPaste={(e) => e.preventDefault()}
            disabled={testFinished}
            className="opacity-0 absolute w-0 h-0 p-0 m-0 border-0"
            maxLength={textToType.length + 10}
            autoFocus
          />
        )}

        {!testFinished && (
          <div className="flex justify-between items-center mt-8">
            <div data-testid="time-left" className="text-3xl font-bold text-teal-400 tabular-nums">
              {timeLeft}s
            </div>
            <button
              onClick={resetTest}
              className="px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
            >
              Reset
            </button>
          </div>
        )}

        {testFinished && results && (
          <SummaryScreen
            results={results}
            onRetry={resetTest}
            onNewTest={resetTest}
          />
        )}
      </div>
    </div>
  );
}
