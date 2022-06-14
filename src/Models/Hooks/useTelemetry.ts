import TelemetryService from '../Services/TelemetryService/TelemetryService';

const useTelemetry = () => {
    return {
        sendTelemetry: TelemetryService.sendTelemetry
    };
};

export default useTelemetry;
