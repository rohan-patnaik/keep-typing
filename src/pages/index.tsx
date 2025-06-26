import { useState, useEffect, useRef } from 'react';
import { Timer } from '../lib/timer';
import { computeMetrics, MetricsOutput } from '../lib/metrics'; // Import metrics functions

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog.";
const TEST_DURATION_SECONDS = 30; // Define test duration as a constant

export default function TestScreen() {
  const [textToType] = useState(SAMPLE_TEXT);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [results, setResults] = useState<MetricsOutput | null>(null); // State for results

  const timerRef = useRef<Timer | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); // For focusing the hidden input

  useEffect(() => {
    // Focus the hidden input when the component mounts or test resets
    if (inputRef.current && !testFinished) {
      inputRef.current.focus();
    }
  }, [testStarted, testFinished]);

  useEffect(() => {
    if (testStarted && !testFinished) {
      timerRef.current = new Timer(
        TEST_DURATION_SECONDS,
        (remaining) => setTimeLeft(remaining),
        () => { // onComplete
          setTestFinished(true);
          setTestStarted(false);
          const finalMetrics = computeMetrics(textToType, userInput, TEST_DURATION_SECONDS);
          setResults(finalMetrics);
          console.log("Test finished!");
        }
      );
      timerRef.current.start();
    } else {
      timerRef.current?.reset();
    }
    return () => {
      timerRef.current?.reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStarted, testFinished, textToType, userInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (testFinished) return;

    const currentInput = e.target.value;
    if (!testStarted && currentInput.length > 0) {
      setTestStarted(true); // Start the test on first character typed
    }
    setUserInput(currentInput);
  };

  const handleStartReset = () => {
    setTestFinished(false);
    setTestStarted(false); // Will be set to true on first input
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
      let className = "text-gray-500"; // Untyped text
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-gray-200 p-4 font-sans">
      <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-400 tracking-wide">
          Typing Test
        </h1>

        <div
          className="mb-6 p-5 bg-gray-800 rounded-lg shadow-inner h-36 overflow-y-auto text-2xl leading-relaxed tracking-wider font-mono select-none"
          onClick={() => inputRef.current?.focus()}
        >
          {renderTextDisplay()}
        </div>

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

        <div className="flex justify-between items-center mt-8">
          <div className="text-3xl font-bold text-teal-400 tabular-nums">
            {timeLeft}s
          </div>
          <button
            onClick={handleStartReset}
            className="px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
          >
            {testFinished ? 'Restart Test' : 'Reset'}
          </button>
        </div>

        {testFinished && results && (
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
          </div>
        )}
      </div>
      <footer className="text-center text-gray-500 mt-10 text-xs">
        <p>&copy; {new Date().getFullYear()} Keep Typing</p>
      </footer>
    </div>
  );
}