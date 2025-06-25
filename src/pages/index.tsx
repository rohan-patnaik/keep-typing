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
      const initialDuration = 30; // Match timeLeft state
      // setTimeLeft(initialDuration); // Ensure timeLeft is reset visually. Timer constructor receives duration.

      timerRef.current = new Timer(
        initialDuration,
        (remaining) => setTimeLeft(remaining),
        () => { // onComplete
          setTestFinished(true);
          setTestStarted(false);
          console.log("Test finished!");
        }
      );
      timerRef.current.start();
    } else {
      // If test is not started or is finished, reset any existing timer
      timerRef.current?.reset();
    }
    return () => {
      // Cleanup timer on component unmount or before effect reruns
      timerRef.current?.reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStarted, testFinished]);

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
    setUserInput('');
    setTimeLeft(30); // Reset visual timer display immediately
    // Important: setTestStarted(true) will trigger the useEffect to create and start a new timer.
    // If already started and not finished, this acts as a reset.
    // If finished, or not started, this acts as a start.
    setTestStarted(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Basic text rendering
  const renderTextDisplay = () => {
    return textToType.split('').map((char, index) => {
      let className = "text-gray-500"; // Untyped text
      if (index < userInput.length) {
        // Character has been typed or attempted
        className = char === userInput[index] ? "text-green-400" : "text-red-500";
      }
      // Highlight the current character to be typed (simulates a cursor)
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
          onClick={() => inputRef.current?.focus()} // Allow clicking the text area to focus input
        >
          {renderTextDisplay()}
        </div>

        {/* Visually Hidden Input, but focusable and interactive */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onPaste={(e) => e.preventDefault()} // Typically good to prevent pasting in typing tests
          disabled={testFinished}
          className="opacity-0 absolute w-0 h-0 p-0 m-0 border-0" // Standard way to hide but keep interactive
          maxLength={textToType.length + 10} // Allow some mistakes beyond text length
          autoFocus // Automatically focus on load
        />

        <div className="flex justify-between items-center mt-8">
          <div className="text-3xl font-bold text-teal-400 tabular-nums">
            {timeLeft}s
          </div>
          <button
            onClick={handleStartReset}
            className="px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
          >
            {(!testStarted && !testFinished) || testFinished ? 'Start Test' : 'Reset Test'}
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
            <p className="text-gray-400 mt-6">
              You typed <span className="font-medium text-yellow-500">{userInput.length}</span> characters.
              Correct characters: <span className="font-medium text-green-500">{
                // Recalculate for display if needed, or store it. For now, this is an estimate.
                Math.round((userInput.length * results.accuracy) / 100)
              }</span>.
            </p>
          </div>
        )}
        {testFinished && !results && ( // Case where metrics calculation might have failed or is pending
           <div className="mt-8 text-center p-5 bg-gray-800 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-3">Test Complete!</h2>
            <p className="text-gray-400">Calculating results...</p>
          </div>
        )}
      </div>
      <footer className="text-center text-gray-500 mt-10 text-xs">
        <p>&copy; {new Date().getFullYear()} Keep Typing</p>
      </footer>
    </div>
  );
}