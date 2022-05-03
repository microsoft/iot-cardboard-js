/**
 * This context is for debug logging.
 * If it's enabled, the context will connect to the console, otherwise the callbacks will be no-ops
 */
import React, { useContext, useMemo } from 'react';
import {
    IDebugContext,
    IDebugContextProviderProps
} from './DebugContext.types';

export const DebugContext = React.createContext<IDebugContext>(null);
export const useDebugContext = () => useContext(DebugContext);

const logMessage = (
    level: 'debug' | 'info' | 'warn' | 'error',
    context: string,
    message: string,
    ...args: unknown[]
): void => {
    const formattedMessage = `[CB-DEBUG][${context}] ${message}`;
    switch (level) {
        case 'debug':
            console.debug(formattedMessage, ...args);
            break;
        case 'warn':
            console.warn(formattedMessage, ...args);
            break;
        case 'error':
            console.error(formattedMessage, ...args);
            break;
        default:
            console.info(formattedMessage, ...args);
            break;
    }
};
const getLogDebug = (context: string) => (
    message: string,
    ...args: unknown[]
) => logMessage('warn', context, message, ...args);
const getLogError = (context: string) => (
    message: string,
    ...args: unknown[]
) => logMessage('error', context, message, ...args);
const getLogInfo = (context: string) => (message: string, ...args: unknown[]) =>
    logMessage('info', context, message, ...args);
const getLogWarn = (context: string) => (message: string, ...args: unknown[]) =>
    logMessage('warn', context, message, ...args);
const noOp = () => undefined;

export const DebugContextProvider: React.FC<IDebugContextProviderProps> = (
    props
) => {
    const { children, enabled, context } = props;
    // only include the context in development builds
    if (process.env.NODE_ENV === 'production') {
        return <>{children}</>;
    }

    const providerValue: IDebugContext = useMemo(() => {
        return {
            logDebug: enabled ? getLogDebug(context) : noOp,
            logError: enabled ? getLogError(context) : noOp,
            logInfo: enabled ? getLogInfo(context) : noOp,
            logWarn: enabled ? getLogWarn(context) : noOp
        };
    }, [context, enabled]);
    return (
        <DebugContext.Provider value={providerValue}>
            {children}
        </DebugContext.Provider>
    );
};
