import { Timer } from '../../src/lib/timer';

describe('Timer', () => {
  jest.useFakeTimers();

  it('initializes with the correct duration and is not running', () => {
    const timer = new Timer(30);
    expect(timer.getRemaining()).toBe(30);
    expect(timer.isTimerRunning()).toBe(false);
  });

  it('starts the timer and ticks every second', () => {
    const onTick = jest.fn();
    const timer = new Timer(5, onTick);

    timer.start();
    expect(timer.isTimerRunning()).toBe(true);

    // Advance time by 1 second
    jest.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledWith(4);

    // Advance time by another 2 seconds
    jest.advanceTimersByTime(2000);
    expect(onTick).toHaveBeenCalledWith(2);
    expect(timer.getRemaining()).toBe(2);
  });

  it('calls the onComplete callback when the timer finishes', () => {
    const onComplete = jest.fn();
    const timer = new Timer(2, undefined, onComplete);

    timer.start();

    // Advance time past the duration
    jest.advanceTimersByTime(2100); // a little over 2s

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(timer.isTimerRunning()).toBe(false);
  });

  it('pauses the timer correctly', () => {
    const onTick = jest.fn();
    const timer = new Timer(10, onTick);

    timer.start();
    jest.advanceTimersByTime(3000);
    expect(timer.getRemaining()).toBe(7);

    timer.pause();
    expect(timer.isTimerRunning()).toBe(false);

    // Advance time while paused, should not trigger tick
    jest.advanceTimersByTime(2000);
    expect(onTick).toHaveBeenCalledTimes(3); // Should not have been called again
    expect(timer.getRemaining()).toBe(7); // Remaining time should not change
  });

  it('resets the timer correctly', () => {
    const timer = new Timer(60);

    timer.start();
    jest.advanceTimersByTime(5000);
    timer.pause();

    timer.reset();
    expect(timer.isTimerRunning()).toBe(false);
    expect(timer.getRemaining()).toBe(60);
  });
});
