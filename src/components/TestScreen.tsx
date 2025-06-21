import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FC,
} from 'react';
import { Timer } from '../lib/timer';
import { computeMetrics, MetricsOutput } from '../lib/metrics';

export type TestScreenProps = {
  text: string;
  duration: number; // in seconds
};

const TestScreen: FC<TestScreenProps> = ({ text, duration }) => {
  const [remaining, setRemaining] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);

  const timerRef = useRef<Timer | null>(null);

  // Initialize Timer on mount or duration change
  useEffect(() => {
    timerRef.current = new Timer(duration, {
      onTick: (r) => setRemaining(r),
      onComplete: () => setIsRunning(false),
    });
    return () => {
      timerRef.current?.pause();
    };
  }, [duration]);

  // Listen for Enter (start/pause) and CapsLock events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) {
          timerRef.current?.start();
          setIsRunning(true);
        } else {
          timerRef.current?.pause();
          setIsRunning(false);
        }
      }
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        setCapsLockOn(true);
      } else {
        setCapsLockOn(false);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.getModifierState && !e.getModifierState('CapsLock')) {
        setCapsLockOn(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRunning]);

  const elapsed = duration - remaining;
  let metrics: MetricsOutput = { rawWpm: 0, netWpm: 0, accuracy: 0 };
  if (elapsed > 0) {
    metrics = computeMetrics({
      totalKeystrokes: inputValue.length,
      correctKeystrokes: inputValue
        .split('')
        .filter((c, i) => text[i] === c).length,
      durationSeconds: elapsed,
    });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isRunning) {
      setInputValue(e.target.value);
    }
  };

  const toggleStartPause = () => {
    if (!isRunning) {
      timerRef.current?.start();
      setIsRunning(true);
    } else {
      timerRef.current?.pause();
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>Time: {remaining}s</div>
        <div>WPM: {metrics.rawWpm.toFixed(0)}</div>
        <div>Accuracy: {metrics.accuracy.toFixed(1)}%</div>
      </div>

      {capsLockOn && (
        <div className="text-red-500 mb-2">Warning: CapsLock is on</div>
      )}

      <p className="mb-4">{text}</p>

      <input
        type="text"
        className="w-full p-2 border"
        value={inputValue}
        onChange={handleChange}
        disabled={!isRunning}
        autoFocus={!isRunning}
      />

      <div className="mt-2">
        <button
          onClick={toggleStartPause}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default TestScreen;