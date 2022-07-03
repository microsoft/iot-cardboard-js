export interface ILoggingServiceParams {
    context: string;
    enabled: boolean;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
