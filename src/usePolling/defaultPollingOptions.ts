import { PollingOptions } from "./PollingOptions";

export const defaultPollingOptions: PollingOptions = {
  intervalMs: 60000,
  maxIntervalMs: 60000,
  immediate: true,
  onError: console.error,
};
