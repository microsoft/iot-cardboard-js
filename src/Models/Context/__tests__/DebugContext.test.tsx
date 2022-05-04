import React from 'react';
import * as renderer from 'react-test-renderer';
import { DebugContextProvider, useDebugContext } from '../DebugContext';

describe('Debug context', () => {
    let initialConsole: Console;
    const debugMock = jest.fn();
    const errorMock = jest.fn();
    const infoMock = jest.fn();
    const warnMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        initialConsole = global.console;
        global.console = {
            ...global.console,
            debug: debugMock,
            error: errorMock,
            info: infoMock,
            warn: warnMock
        };
    });
    afterEach(() => {
        // restore the console again
        global.console = initialConsole;
    });

    test('Should log debug message to console with hook', () => {
        renderer.create(
            <DebugContextProvider context={'test context'} enabled={true}>
                <DebugLoggingComponent message={'Log debug'} />
            </DebugContextProvider>
        );
        expect(debugMock).toBeCalledTimes(1);
        expect(debugMock).toBeCalledWith('[CB-DEBUG][test context] Log debug');
    });
    test('Should log error message to console with hook', () => {
        renderer.create(
            <DebugContextProvider context={'test context'} enabled={true}>
                <ErrorLoggingComponent message={'Log error'} />
            </DebugContextProvider>
        );
        expect(errorMock).toBeCalledTimes(1);
        expect(errorMock).toBeCalledWith('[CB-DEBUG][test context] Log error');
    });
    test('Should log info message to console with hook', () => {
        renderer.create(
            <DebugContextProvider context={'test context'} enabled={true}>
                <InfoLoggingComponent message={'Log info'} />
            </DebugContextProvider>
        );
        expect(infoMock).toBeCalledTimes(1);
        expect(infoMock).toBeCalledWith('[CB-DEBUG][test context] Log info');
    });
    test('Should log warning message to console with hook', () => {
        renderer.create(
            <DebugContextProvider context={'test context'} enabled={true}>
                <WarningLoggingComponent message={'Log warn'} />
            </DebugContextProvider>
        );
        expect(warnMock).toBeCalledTimes(1);
        expect(warnMock).toBeCalledWith('[CB-DEBUG][test context] Log warn');
    });
});

const DebugLoggingComponent: React.FC<{ message: string }> = ({ message }) => {
    const { logDebug } = useDebugContext();
    logDebug(message);
    return <>{message}</>;
};

const ErrorLoggingComponent: React.FC<{ message: string }> = ({ message }) => {
    const { logError } = useDebugContext();
    logError(message);
    return <>{message}</>;
};

const InfoLoggingComponent: React.FC<{ message: string }> = ({ message }) => {
    const { logInfo } = useDebugContext();
    logInfo(message);
    return <>{message}</>;
};

const WarningLoggingComponent: React.FC<{ message: string }> = ({
    message
}) => {
    const { logWarn } = useDebugContext();
    logWarn(message);
    return <>{message}</>;
};
