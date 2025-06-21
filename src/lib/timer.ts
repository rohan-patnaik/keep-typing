// src/lib/timer.ts

type TimerCallbacks = {
    onTick?: (remainingSeconds: number) => void;
    onComplete?: () => void;
  };
  
  /**
   * Timer counts down from a given duration (in seconds),
   * calling back on each tick and on completion.
   */
  export class Timer {
    private duration: number;
    private remaining: number;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private onTick?: (remainingSeconds: number) => void;
    private onComplete?: () => void;
  
    constructor(durationSeconds: number, callbacks?: TimerCallbacks) {
      this.duration = durationSeconds;
      this.remaining = durationSeconds;
      this.onTick = callbacks?.onTick;
      this.onComplete = callbacks?.onComplete;
    }
  
    /** Start the countdown (no-op if already running). */
    start() {
      if (this.intervalId) return;
      this.intervalId = setInterval(() => {
        this.remaining -= 1;
        this.onTick?.(this.remaining);
  
        if (this.remaining <= 0) {
          this.stop();
          this.onComplete?.();
        }
      }, 1000);
    }
  
    /** Pause the countdown (alias for stop). */
    pause() {
      if (!this.intervalId) return;
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  
    /** Stop the countdown. */
    stop() {
      this.pause();
    }
  
    /** Reset to original duration and trigger a tick callback. */
    reset() {
      this.stop();
      this.remaining = this.duration;
      this.onTick?.(this.remaining);
    }
  
    /** Returns current remaining seconds. */
    getTime(): number {
      return this.remaining;
    }
  
    /** Returns true if timer is active. */
    isRunning(): boolean {
      return this.intervalId !== null;
    }
  }