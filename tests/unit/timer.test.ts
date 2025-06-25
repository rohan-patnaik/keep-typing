import { Timer } from '../../src/lib/timer';

describe('Timer', () => {
  jest.useFakeTimers();

  it('starts and ticks correctly', () => {
    const onTick = jest.fn();
    const timer = new Timer(30, onTick);
    timer.start();
    expect(timer.isTimerRunning()).toBe(true);
    
    // Advance by 1 second
    jest.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledWith(29);
    
    // Advance by another second
    jest.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledWith(28);
  });

  it('pauses correctly', () => {
    const timer = new Timer(30);
    timer.start();
    jest.advanceTimersByTime(1000);
    timer.pause();
    expect(timer.isTimerRunning()).toBe(false);
    expect(timer.getRemaining()).toBe(29);
  });

  it('resets correctly', () => {
    const timer = new Timer(30);
    timer.start();
    jest.advanceTimersByTime(1000);
    timer.reset();
    expect(timer.getRemaining()).toBe(30);
    expect(timer.isTimerRunning()).toBe(false);
  });

  it('calls onComplete when time is up', () => {
    const onComplete = jest.fn();
    const timer = new Timer(1, undefined, onComplete);
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(onComplete).toHaveBeenCalled();
    expect(timer.isTimerRunning()).toBe(false);
  });
});