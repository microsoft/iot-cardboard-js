export type AdapterReturnType<T> = Promise<{
    data: T | null;
    error: Error | null;
}>;
