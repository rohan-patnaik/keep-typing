// src/lib/timer.ts

export type TimerOptions = {
  onTick?: (remaining: number) => void;
  onComplete?: () => void;
};

export class Timer {
  private duration: number;
  private remaining: number;
  private intervalId: NodeJS.Timeout | null = null;
  private options: TimerOptions;

  constructor(durationSeconds: number, options: TimerOptions = {}) {
    this.duration = durationSeconds;
    this.remaining = durationSeconds;
    this.options = options;
  }

  start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.remaining = Math.max(0, this.remaining - 1);
      this.options.onTick?.(this.remaining);
      if (this.remaining <= 0) {
        this.clearInterval();
        this.options.onComplete?.();
      }
    }, 1000);
  }

  pause(): void {
    this.clearInterval();
  }

  reset(): void {
    this.clearInterval();
    this.remaining = this.duration;
  }

  getRemaining(): number {
    return this.remaining;
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}