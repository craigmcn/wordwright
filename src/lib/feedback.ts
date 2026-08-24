let audioContext: AudioContext | undefined;

function getAudioContext(): AudioContext | undefined {
  if (typeof window === "undefined" || !window.AudioContext) return undefined;
  audioContext ??= new AudioContext();
  return audioContext;
}

/**
 * Browsers only let an AudioContext start once it's created/resumed
 * synchronously inside a real user gesture's event handler (click,
 * keydown) — not from a useEffect, which runs after that handler's call
 * stack has already unwound. Call this directly from the gesture handler
 * (e.g. on each letter guess) well before a loss can happen, so the
 * context is already running by the time playChimeRing() is called later
 * from an effect on game-over. Without this, the very first chime never
 * sounds: resume() is silently ignored and the context stays suspended.
 */
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
