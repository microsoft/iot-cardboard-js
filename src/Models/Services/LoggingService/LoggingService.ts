import { ILoggingServiceParams, ILogParams } from './LoggingService.types';

class LoggingService {
    context: string;
    enabled: boolean;
    constructor({ context, enabled }: ILoggingServiceParams) {
        this.context = context;
        this.enabled = enabled;
    }

    log({ message, level = 'info' }: ILogParams, ...args: unknown[]) {
        if (!this.enabled) return;

        const formattedMessage = [
            `%c${this.context}:`,
            'font-weight: 600;',
            message
        ];
        switch (level) {
            case 'debug':
                console.debug(...formattedMessage, ...args);
                break;
            case 'error':
                console.error(...formattedMessage, ...args);
                break;
            case 'warn':
                console.warn(...formattedMessage, ...args);
                break;
            default:
                console.info(...formattedMessage, ...args);
                break;
        }
    }

    customLog(customLogCallback: () => any) {
        if (!this.enabled) return;
        customLogCallback();
    }
}

export default LoggingService;
