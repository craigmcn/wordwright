import { describe, expect, it } from "vitest";
import { playChimeRing, vibrate } from "./feedback";

describe("feedback", () => {
  it("playChimeRing does not throw when the Web Audio API is unavailable", () => {
    expect(() => playChimeRing()).not.toThrow();
  });

  it("vibrate does not throw when the Vibration API is unavailable", () => {
    expect(() => vibrate([40, 30, 40])).not.toThrow();
  });
});
