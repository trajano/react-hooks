export const timeToNextCheck = (nextFire: number, maxIntervalMs: number) =>
  Math.max(0, Math.min(nextFire - Date.now(), maxIntervalMs));
