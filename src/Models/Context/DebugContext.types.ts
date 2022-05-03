export interface IDebugContextProviderProps {
    enabled: boolean;
    context: string;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IDebugContext {
    logDebug: (message: string, ...args: unknown[]) => void;
    logError: (message: string, ...args: unknown[]) => void;
    logInfo: (message: string, ...args: unknown[]) => void;
    logWarn: (message: string, ...args: unknown[]) => void;
}
