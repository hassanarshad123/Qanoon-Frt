/**
 * Process items with bounded concurrency (worker-pool pattern).
 * At most `limit` processors run simultaneously.
 */
export async function processWithConcurrency<T, R>(
  items: T[],
  limit: number,
  processor: (item: T, index: number) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const idx = nextIndex++;
      try {
        const value = await processor(items[idx], idx);
        results[idx] = { status: "fulfilled", value };
      } catch (reason: any) {
        results[idx] = { status: "rejected", reason };
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
