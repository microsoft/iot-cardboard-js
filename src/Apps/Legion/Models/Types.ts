export type IConsoleLogFunction = (
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    ...args: unknown[]
) => void;
