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
    IEventTelemetryParams,
    IExceptionTelemetryParams,
    IMetricTelemetryParams,
    IRequestTelemetryParams,
    ITraceTelemetryParams
} from '../TelemetryService.types';
import {
    AppRegion,
    ComponentName,
    CUSTOM_PROPERTY_NAMES,
    TelemetryTrigger
} from '../../../Constants/TelemetryConstants';

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

const testEvent: IEventTelemetryParams = {
    name: 'test event',
    triggerType: TelemetryTrigger.UserAction,
    appRegion: AppRegion.Builder,
    componentName: ComponentName.BehaviorForm
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
            TelemetryService.sendRequest(new TelemetryRequest(testRequest));
            expect(mockCallback.mock.calls.length).toBe(1);

            const message: TelemetryRequest = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryRequest);
            expect(message.name).toBe(testRequest.name);
        });
    });

    describe('Exception telemetry', () => {
        test('Exception telemetry is sent successfully', () => {
            TelemetryService.sendException(
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
            TelemetryService.sendTrace(new TelemetryTrace(testTrace));
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryTrace = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryTrace);
            expect(message.name).toBe(testTrace.name);
        });
    });

    describe('Event telemetry', () => {
        test('Event telemetry is sent successfully', () => {
            TelemetryService.sendEvent(new TelemetryEvent(testEvent));
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryEvent = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryEvent);
            expect(message.name).toBe(testEvent.name);
            expect(
                message.customProperties[CUSTOM_PROPERTY_NAMES.AppRegion]
            ).toBe(testEvent.appRegion);
            expect(
                message.customProperties[CUSTOM_PROPERTY_NAMES.ComponentName]
            ).toBe(testEvent.componentName);
            expect(
                message.customProperties[CUSTOM_PROPERTY_NAMES.TriggerType]
            ).toBe(testEvent.triggerType);
        });
    });

    describe('Metric telemetry', () => {
        test('Metric telemetry is sent successfully', () => {
            TelemetryService.sendMetric(new TelemetryMetric(testMetric));
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryMetric = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryMetric);
            expect(message.name).toBe(testEvent.name);
            expect(message.average).toBe(testMetric.average);
        });
    });

    describe('Property setters', () => {
        test('setting adt instance gets included on messages', () => {
            // ARRANGE
            const adtInstance = 'https://myadtinstance.com';

            // ACT
            TelemetryService.setAdtInstance(adtInstance);
            TelemetryService.sendEvent(new TelemetryEvent(testEvent));

            // ASSERT
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryEvent = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryEvent);
            expect(
                message.customProperties[CUSTOM_PROPERTY_NAMES.AdtInstanceHash]
            ).toBe('eb9328444a41243802d59d4b64b9d4be');
        });
        test('setting blob storage url gets included on messages', () => {
            // ARRANGE
            const blobStorage = 'https://mystorage.blob.com';

            // ACT
            TelemetryService.setStorageContainerUrl(blobStorage);
            TelemetryService.sendEvent(new TelemetryEvent(testEvent));

            // ASSERT
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryEvent = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryEvent);
            expect(
                message.customProperties[
                    CUSTOM_PROPERTY_NAMES.StorageContainerHash
                ]
            ).toBe('0d3974c1e930cadab16cfbe833587bef');
        });
        test('setting scene id gets included on messages', () => {
            // ARRANGE
            const sceneId = '125-23523-23523-23523';

            // ACT
            TelemetryService.setSceneId(sceneId);
            TelemetryService.sendEvent(new TelemetryEvent(testEvent));

            // ASSERT
            expect(mockCallback.mock.calls.length).toBe(1);
            const message: TelemetryEvent = mockCallback.mock.calls[0][0];
            expect(message).toBeInstanceOf(TelemetryEvent);
            expect(
                message.customProperties[CUSTOM_PROPERTY_NAMES.SceneHash]
            ).toBe('9c2507e0369cc2b90fc38a27e02746d4');
        });
    });
});
