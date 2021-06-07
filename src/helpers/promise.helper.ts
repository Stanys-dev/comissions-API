export async function TO<T>(
  promise: Promise<T>,
  defaultValue?: any,
): Promise<[any, T]> {
  const error: any = null;
  let result: T = defaultValue || null;
  try {
    result = await promise;
    return [error, result];
  } catch (e) {
    return [e, result];
  }
}
