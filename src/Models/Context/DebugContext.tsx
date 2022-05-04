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
const noOp = () => undefined;
const defaultContext: IDebugContext = {
    logDebug: noOp,
    logError: noOp,
    logInfo: noOp,
    logWarn: noOp
};
export const useDebugContext = () => useContext(DebugContext) || defaultContext;

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
) => logMessage('debug', context, message, ...args);
const getLogError = (context: string) => (
    message: string,
    ...args: unknown[]
) => logMessage('error', context, message, ...args);
const getLogInfo = (context: string) => (message: string, ...args: unknown[]) =>
    logMessage('info', context, message, ...args);
const getLogWarn = (context: string) => (message: string, ...args: unknown[]) =>
    logMessage('warn', context, message, ...args);

export const DebugContextProvider: React.FC<IDebugContextProviderProps> = (
    props
) => {
    const { children, enabled, context } = props;
    // only include when enabled
    if (!enabled) {
        return <>{children}</>;
    }

    const providerValue: IDebugContext = useMemo(() => {
        return {
            logDebug: getLogDebug(context),
            logError: getLogError(context),
            logInfo: getLogInfo(context),
            logWarn: getLogWarn(context)
        };
    }, [context]);
    return (
        <DebugContext.Provider value={providerValue}>
            {children}
        </DebugContext.Provider>
    );
};
