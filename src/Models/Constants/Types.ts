export type AdapterReturnType<T> = Promise<AdapterResult<T>>;

export type AdapterResult<T> = {
    data: T | null;
    error: Error | null;
};
