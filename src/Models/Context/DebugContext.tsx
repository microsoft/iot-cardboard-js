/**
 * This context is for debug logging.
 * If it's enabled, the context will connect to the console, otherwise the callbacks will be no-ops
 */
import React, { useContext } from 'react';
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
            console.debug(formattedMessage, args);
            break;
        case 'warn':
            console.warn(formattedMessage, args);
            break;
        case 'error':
            console.error(formattedMessage, args);
            break;
        default:
            console.info(formattedMessage, args);
            break;
    }
};
const logDebug = (context: string, message: string, ...args: unknown[]) =>
    logMessage('warn', context, message, args);
const logError = (context: string, message: string, ...args: unknown[]) =>
    logMessage('error', context, message, args);
const logInfo = (context: string, message: string, ...args: unknown[]) =>
    logMessage('info', context, message, args);
const logWarn = (context: string, message: string, ...args: unknown[]) =>
    logMessage('warn', context, message, args);
const noOp = () => undefined;

export const DebugContextProvider: React.FC<IDebugContextProviderProps> = (
    props
) => {
    const { children, enabled } = props;
    return (
        <DebugContext.Provider
            value={{
                logDebug: enabled ? logDebug : noOp,
                logError: enabled ? logError : noOp,
                logInfo: enabled ? logInfo : noOp,
                logWarn: enabled ? logWarn : noOp
            }}
        >
            {children}
        </DebugContext.Provider>
    );
};
