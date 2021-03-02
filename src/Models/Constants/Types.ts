export type AdapterReturnType<T> = Promise<AdapterResolvedType<T>>;

export type AdapterResolvedType<T> = {
    data: T | null;
    error: Error | null;
};

export type CardState = {
    adapterResult: AdapterResolvedType<any>;
    isLoading: boolean;
};
