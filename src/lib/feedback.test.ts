import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function createMockOscillator() {
  return {
    type: "",
    frequency: { value: 0 },
    connect: vi.fn((node: unknown) => node),
    start: vi.fn(),
    stop: vi.fn(),
  };
}

function createMockGain() {
  return {
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn((node: unknown) => node),
  };
}

class MockAudioContext {
  state: "suspended" | "running" = "suspended";
  currentTime = 0;
  destination = {};
  resume = vi.fn(() => {
    this.state = "running";
    return Promise.resolve();
  });
  createOscillator = vi.fn(createMockOscillator);
  createGain = vi.fn(createMockGain);
}

/** Loads a fresh feedback module instance so its module-level AudioContext
 * singleton doesn't leak state between tests. */
async function loadFeedback() {
  vi.resetModules();
  return import("./feedback");
}

describe("feedback with the Web Audio and Vibration APIs available", () => {
  let mockContext: MockAudioContext;

  beforeEach(() => {
    mockContext = new MockAudioContext();
    vi.stubGlobal(
      "AudioContext",
      vi.fn(function AudioContextMock() {
        return mockContext;
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("unlockAudio resumes a suspended context", async () => {
    const { unlockAudio } = await loadFeedback();
    unlockAudio();
    expect(mockContext.resume).toHaveBeenCalledOnce();
  });

  it("unlockAudio does not resume an already-running context", async () => {
    mockContext.state = "running";
    const { unlockAudio } = await loadFeedback();
    unlockAudio();
    expect(mockContext.resume).not.toHaveBeenCalled();
  });

  it("playChimeRing schedules two oscillators through a gain envelope", async () => {
    const { playChimeRing } = await loadFeedback();
    playChimeRing();

    expect(mockContext.createOscillator).toHaveBeenCalledTimes(2);
    expect(mockContext.createGain).toHaveBeenCalledTimes(2);

    const oscillators = mockContext.createOscillator.mock.results.map(
      (r) => r.value,
    );
    expect(oscillators.map((o) => o.frequency.value)).toEqual([880, 1320]);
    for (const oscillator of oscillators) {
      expect(oscillator.start).toHaveBeenCalledOnce();
      expect(oscillator.stop).toHaveBeenCalledOnce();
      expect(oscillator.connect).toHaveBeenCalledOnce();
    }

    const gains = mockContext.createGain.mock.results.map((r) => r.value);
    for (const gain of gains) {
      expect(gain.gain.setValueAtTime).toHaveBeenCalledOnce();
      expect(gain.gain.exponentialRampToValueAtTime).toHaveBeenCalledTimes(2);
    }
  });

  it("vibrate calls navigator.vibrate with the given pattern", async () => {
    const vibrateSpy = vi.fn();
    vi.stubGlobal("navigator", { ...navigator, vibrate: vibrateSpy });

    const { vibrate } = await loadFeedback();
    vibrate([40, 30, 40]);

    expect(vibrateSpy).toHaveBeenCalledWith([40, 30, 40]);
  });
});

describe("feedback without the Web Audio or Vibration APIs", () => {
  it("unlockAudio does not throw when the Web Audio API is unavailable", async () => {
    const { unlockAudio } = await loadFeedback();
    expect(() => unlockAudio()).not.toThrow();
  });

  it("playChimeRing does not throw when the Web Audio API is unavailable", async () => {
    const { playChimeRing } = await loadFeedback();
    expect(() => playChimeRing()).not.toThrow();
  });

  it("vibrate does not throw when the Vibration API is unavailable", async () => {
    const { vibrate } = await loadFeedback();
    expect(() => vibrate([40, 30, 40])).not.toThrow();
  });
});
