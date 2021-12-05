/**
 * Utility function to generate a delay.  Used only for testing and is not exported.
 * @param ms milliseconds to wait
 */
 export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
