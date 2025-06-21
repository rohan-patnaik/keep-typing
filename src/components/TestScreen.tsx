import React, { useState, useEffect, useRef } from 'react';
import { Timer } from '../lib/timer';

const DEFAULT_DURATION = 30; // seconds
const referenceText = 'The quick brown fox jumps over the lazy dog.';

export default function TestScreen() {
  const [remaining, setRemaining] = useState(DEFAULT_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const timerRef = useRef<Timer>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Timer
  useEffect(() => {
    timerRef.current = new Timer(DEFAULT_DURATION, {
      onTick: secs => setRemaining(secs),
      onComplete: () => setIsRunning(false),
    });
    return () => {
      timerRef.current?.stop();
    };
  }, []);

  // Autofocus textarea when test starts
  useEffect(() => {
    if (isRunning) {
      textareaRef.current?.focus();
    }
  }, [isRunning]);

  // Global keyboard: detect CapsLock state
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setCapsLockOn(e.getModifierState('CapsLock'));
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    };
  }, []);

  // Handlers for buttons
  const handleStartPause = () => {
    if (isRunning) {
      timerRef.current?.pause();
      setIsRunning(false);
    } else {
      timerRef.current?.start();
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    timerRef.current?.reset();
    setIsRunning(false);
    setInputValue('');
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div className="text-2xl font-medium">
        Time Remaining: {remaining}s
      </div>

      <div className="flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleStartPause}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {capsLockOn && (
        <div className="text-red-600">Warning: Caps Lock is on</div>
      )}

      <div className="w-full max-w-3xl">
        <div className="p-4 mb-2 border rounded bg-gray-50">
          <p>{referenceText}</p>
        </div>
        <textarea
          ref={textareaRef}
          className="w-full h-36 p-2 border rounded focus:outline-none focus:ring"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={!isRunning}
          placeholder={
            isRunning ? 'Start typing...' : 'Click Start to begin...'
          }
        />
      </div>

      <div className="text-sm text-gray-500">
        Use buttons above to Start/Pause or Reset
      </div>
    </div>
  );
}