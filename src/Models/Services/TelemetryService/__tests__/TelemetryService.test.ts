import {
    TelemetryEvent,
    TelemetryException,
    TelemetryMetric,
    TelemetryRequest,
    Telemetry,
    TelemetryTrace
} from '../Telemetry';
import TelemetryService from '../../../../Models/Services/TelemetryService/TelemetryService';
import {
    IBaseTelemetryParams,
    IExceptionTelemetryParams,
    IMetricTelemetryParams,
    IRequestTelemetryParams,
    ITraceTelemetryParams
} from '../TelemetryService.types';

const testRequest: IRequestTelemetryParams = {
    name: 'test request',
    url: 'test.com',
    requestMethod: 'GET',
    responseCode: 200,
    responseMessage: 'success',
    success: true
};

const testException: IExceptionTelemetryParams = {
    name: 'test exception',
    exceptionId: '123',
    message: 'test exception',
    severityLevel: 'Critical',
    stack: 'test stack'
};

const testTrace: ITraceTelemetryParams = {
    name: 'test trace',
    message: 'test trace',
    severityLevel: 'Warning'
};

const testEvent: IBaseTelemetryParams = {
    name: 'test event'
};

const testMetric: IMetricTelemetryParams = {
    name: 'test event',
    average: 12
};

let mockCallback: jest.Mock;

describe('Telemetry service tests', () => {
    beforeEach(() => {
        mockCallback = jest.fn((_message: Telemetry) => null);
        TelemetryService.registerTelemetryCallback(mockCallback);
    });

    test('Telemetry callback is registered successfully', () => {
        expect(TelemetryService.telemetryCallback).toBeTruthy();
    });

    describe('Request telemetry', () => {
        test('Request telemetry is sent successfully', () => {
            TelemetryService.sendTelemetry(new TelemetryRequest(testRequest));
            expect(mockCallback.mock.calls.length).toBe(1);

            const message: TelemetryRequest = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryRequest);
            expect(message.name).toBe(testRequest.name);
        });
    });

    describe('Exception telemetry', () => {
        test('Exception telemetry is sent successfully', () => {
            TelemetryService.sendTelemetry(
                new TelemetryException(testException)
            );
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryException = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryException);
            expect(message.name).toBe(testException.name);
        });
    });

    describe('Trace telemetry', () => {
        test('Trace telemetry is sent successfully', () => {
            TelemetryService.sendTelemetry(new TelemetryTrace(testTrace));
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryTrace = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryTrace);
            expect(message.name).toBe(testTrace.name);
        });
    });

    describe('Event telemetry', () => {
        test('Event telemetry is sent successfully', () => {
            TelemetryService.sendTelemetry(new TelemetryEvent(testEvent));
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryEvent = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryEvent);
            expect(message.name).toBe(testEvent.name);
        });
    });

    describe('Metric telemetry', () => {
        test('Metric telemetry is sent successfully', () => {
            TelemetryService.sendTelemetry(new TelemetryMetric(testMetric));
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryMetric = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryMetric);
            expect(message.name).toBe(testEvent.name);
            expect(message.average).toBe(testMetric.average);
        });
    });
});
