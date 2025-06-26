export type TimerCallback = (remaining: number) => void;

export class Timer {
  private durationMs: number;
  private remainingMs: number;
  private startTime: number | null;
  private timerId: NodeJS.Timeout | null;
  private onTick: TimerCallback | null;
  private onComplete: (() => void) | null;
  private isRunning: boolean;
  private lastTickTime: number | null;

  constructor(durationSeconds: number, onTick?: TimerCallback, onComplete?: () => void) {
    this.durationMs = durationSeconds * 1000;
    this.remainingMs = durationSeconds * 1000;
    this.startTime = null;
    this.timerId = null;
    this.onTick = onTick || null;
    this.onComplete = onComplete || null;
    this.isRunning = false;
    this.lastTickTime = null;
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = Date.now();
    this.lastTickTime = this.startTime;
    
    const tick = () => {
      if (!this.startTime) return;
      
      const now = Date.now();
      const elapsedMs = now - this.startTime;
      this.remainingMs = Math.max(0, this.durationMs - elapsedMs);
      
      // Calculate remaining seconds (rounded up)
      const remainingSeconds = Math.ceil(this.remainingMs / 1000);
      
      // Call onTick at least once per second
      if (this.onTick && (!this.lastTickTime || now - this.lastTickTime >= 1000)) {
        this.onTick(remainingSeconds);
        this.lastTickTime = now;
      }
      
      if (this.remainingMs <= 0) {
        this.clearTimer();
        this.isRunning = false;
        if (this.onComplete) this.onComplete();
      } else {
        // Schedule next tick
        this.timerId = setTimeout(tick, 100);
      }
    };
    
    this.timerId = setTimeout(tick, 100);
  }

  pause(): void {
    if (!this.isRunning || this.timerId === null) return;
    this.clearTimer();
    this.isRunning = false;
    
    if (this.startTime !== null) {
      const elapsedMs = Date.now() - this.startTime;
      this.remainingMs = Math.max(0, this.durationMs - elapsedMs);
    }
  }

  reset(): void {
    this.clearTimer();
    this.isRunning = false;
    this.remainingMs = this.durationMs;
    this.startTime = null;
    this.lastTickTime = null;
  }

  getRemaining(): number {
    return Math.ceil(this.remainingMs / 1000);
  }

  isTimerRunning(): boolean {
    return this.isRunning;
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
