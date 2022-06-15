import { useMemo } from 'react';
import { useLoggingContext } from '../Context/LoggingContextProvider';
import LoggingService from '../Services/LoggingService/LoggingService';
import { ILoggingServiceParams } from '../Services/LoggingService/LoggingService.types';

const useLoggingService = (loggingServiceParams: ILoggingServiceParams) => {
    const loggingContext = useLoggingContext();

    const enabled =
        loggingContext?.isStorybookEnv && loggingServiceParams.enabled;

    const loggingService = useMemo(
        () =>
            new LoggingService({
                ...loggingServiceParams,
                enabled
            }),
        [loggingServiceParams]
    );

    return loggingService;
};

export default useLoggingService;
