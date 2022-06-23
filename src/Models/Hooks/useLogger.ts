import { useMemo } from 'react';
import { useLoggingContext } from '../Context/LoggingContextProvider';
import LoggingService from '../Services/LoggingService/LoggingService';
import { ILoggingServiceParams } from '../Services/LoggingService/LoggingService.types';

const useLogger = (loggingServiceParams: ILoggingServiceParams) => {
    const loggingContext = useLoggingContext();

    // Auto disable logs out of storybook environment
    const enabled =
        loggingContext?.isStorybookEnv && loggingServiceParams.enabled;

    // Create a logging service instance
    const loggingService = useMemo(
        () =>
            new LoggingService({
                ...loggingServiceParams,
                enabled
            }),
        [loggingServiceParams]
    );

    // Return object that wraps info, debug, warn, etc (and log all up)
    return {
        loggingService,
        logInfo: (message: string, ...args: unknown[]) =>
            loggingService.log('info', message, ...args),
        logWarning: (message: string, ...args: unknown[]) =>
            loggingService.log('warn', message, ...args),
        logError: (message: string, ...args: unknown[]) =>
            loggingService.log('error', message, ...args),
        logDebug: (message: string, ...args: unknown[]) =>
            loggingService.log('debug', message, ...args)
    };
};

export default useLogger;
