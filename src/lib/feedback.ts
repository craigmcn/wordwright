let audioContext: AudioContext | undefined;

function getAudioContext(): AudioContext | undefined {
  if (typeof window === "undefined" || !window.AudioContext) return undefined;
  audioContext ??= new AudioContext();
  return audioContext;
}

/** Call synchronously from a real gesture handler, not a useEffect — browsers only resume audio inside the gesture's own call stack. */
export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (ctx?.state === "suspended") void ctx.resume();
}

/**
 * A short two-tone bell ring for a loss, synthesized with the Web Audio API
 * so no audio asset is needed (keeps the offline PWA bundle self-contained).
 */
export function playChimeRing(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  for (const frequency of [880, 1320]) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.6);
  }
}

/** No-ops on browsers without the Vibration API (e.g. Safari/iOS). */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
