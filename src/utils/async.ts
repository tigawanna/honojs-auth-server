type TryCatchWrapperResponse<T, E extends Error> = Promise<{ data: T | null; error: E | null }>;

export async function tryCatchWrapper<T, E extends Error>(
  fn: Promise<T>
): TryCatchWrapperResponse<T, E> {
  try {
    const data = await fn;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}
