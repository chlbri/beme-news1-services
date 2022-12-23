import { afterAll, beforeAll, vi } from 'vitest';

export function useTestConfig() {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });
}
