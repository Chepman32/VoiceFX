/**
 * Performance Monitoring Utilities
 * Track and measure app performance
 */

import {InteractionManager, Platform} from 'react-native';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private marks: Map<string, number> = new Map();

  /**
   * Start measuring performance
   */
  start(name: string, metadata?: Record<string, any>): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });
  }

  /**
   * End measurement and calculate duration
   */
  end(name: string): number | undefined {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric '${name}' not found`);
      return undefined;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    console.log(`⚡ ${name}: ${metric.duration.toFixed(2)}ms`);

    return metric.duration;
  }

  /**
   * Get metric by name
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.marks.clear();
  }

  /**
   * Measure function execution time
   */
  async measure<T>(
    name: string,
    fn: () => T | Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Mark a point in time
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Measure between two marks
   */
  measureBetweenMarks(startMark: string, endMark: string): number | undefined {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (!start || !end) {
      console.warn(`Marks '${startMark}' or '${endMark}' not found`);
      return undefined;
    }

    const duration = end - start;
    console.log(`⚡ ${startMark} → ${endMark}: ${duration.toFixed(2)}ms`);

    return duration;
  }

  /**
   * Report performance summary
   */
  report(): void {
    console.log('📊 Performance Report:');
    this.metrics.forEach(metric => {
      if (metric.duration) {
        console.log(`  ${metric.name}: ${metric.duration.toFixed(2)}ms`);
        if (metric.metadata) {
          console.log(`    Metadata:`, metric.metadata);
        }
      }
    });
  }

  /**
   * Check if performance is acceptable
   */
  isAcceptable(name: string, threshold: number): boolean {
    const metric = this.metrics.get(name);
    if (!metric || !metric.duration) {
      return false;
    }

    return metric.duration <= threshold;
  }

  /**
   * Get slow metrics (above threshold)
   */
  getSlowMetrics(threshold = 100): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(
      metric => metric.duration && metric.duration > threshold
    );
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for measuring component render time
 */
export const measureComponentRender = (componentName: string) => {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 16.67) {
      // Warn if render takes longer than 1 frame (60fps)
      console.warn(
        `⚠️ Slow render: ${componentName} took ${duration.toFixed(2)}ms`
      );
    } else if (__DEV__) {
      console.log(`✓ ${componentName} rendered in ${duration.toFixed(2)}ms`);
    }
  };
};

/**
 * Wait for interactions to complete
 */
export const waitForInteractions = (): Promise<void> => {
  return new Promise(resolve => {
    InteractionManager.runAfterInteractions(() => {
      resolve();
    });
  });
};

/**
 * Measure interaction latency
 */
export const measureInteraction = async (
  name: string,
  interaction: () => Promise<void> | void
): Promise<void> => {
  performanceMonitor.start(name);

  await interaction();

  const duration = performanceMonitor.end(name);

  if (duration && duration > 100) {
    console.warn(`⚠️ Slow interaction: ${name} took ${duration.toFixed(2)}ms`);
  }
};

/**
 * Memory usage tracking (iOS only)
 */
export const getMemoryUsage = (): number | null => {
  if (Platform.OS === 'ios' && global.performance.memory) {
    return global.performance.memory.usedJSHeapSize / 1048576; // MB
  }
  return null;
};

/**
 * Log memory usage
 */
export const logMemoryUsage = (): void => {
  const memory = getMemoryUsage();
  if (memory !== null) {
    console.log(`💾 Memory usage: ${memory.toFixed(2)} MB`);
  }
};

/**
 * FPS counter
 */
class FPSCounter {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  start(): void {
    this.measure();
  }

  private measure(): void {
    requestAnimationFrame(() => {
      this.frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - this.lastTime;

      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastTime = currentTime;

        if (this.fps < 55) {
          console.warn(`⚠️ Low FPS: ${this.fps}`);
        }
      }

      this.measure();
    });
  }

  getFPS(): number {
    return this.fps;
  }
}

export const fpsCounter = new FPSCounter();

/**
 * Bundle size analyzer
 */
export const logBundleSize = (): void => {
  if (__DEV__) {
    console.log('📦 Running in development mode');
  } else {
    console.log('📦 Running production bundle');
  }
};

/**
 * Startup time tracker
 */
export class StartupTimer {
  private static startTime = Date.now();

  static mark(milestone: string): void {
    const elapsed = Date.now() - this.startTime;
    console.log(`🚀 ${milestone}: ${elapsed}ms`);
  }

  static reset(): void {
    this.startTime = Date.now();
  }
}
