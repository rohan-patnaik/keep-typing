// tests/unit/timer.test.ts
import { Timer } from '../../src/lib/timer';

jest.useFakeTimers();

describe('Timer', () => {
  it('counts down each second and fires onTick & onComplete', () => {
    const ticks: number[] = [];
    const onComplete = jest.fn();
    const timer = new Timer(3, {
      onTick: (r) => ticks.push(r),
      onComplete,
    });

    timer.start();
    expect(timer.isRunning()).toBe(true);

    // advance 1s
    jest.advanceTimersByTime(1000);
    expect(ticks).toEqual([2]);
    expect(timer.getRemaining()).toBe(2);

    // advance to zero
    jest.advanceTimersByTime(2000);
    expect(ticks).toEqual([2, 1, 0]);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(timer.isRunning()).toBe(false);
  });

  it('pause stops the countdown', () => {
    const ticks: number[] = [];
    const timer = new Timer(5, { onTick: (r) => ticks.push(r) });

    timer.start();
    jest.advanceTimersByTime(2000);
    timer.pause();

    const afterPause = ticks.slice();
    jest.advanceTimersByTime(3000);
    expect(ticks).toEqual(afterPause);
    expect(timer.isRunning()).toBe(false);
  });

  it('reset stops and resets remaining to initial duration', () => {
    const timer = new Timer(4);
    timer.start();
    jest.advanceTimersByTime(2000);
    timer.reset();

    expect(timer.isRunning()).toBe(false);
    expect(timer.getRemaining()).toBe(4);
  });
});