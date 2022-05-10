import { IDeeplinkOptions } from '../DeeplinkContext/DeeplinkContext.types';

export interface IConsumerDeeplinkContextProviderProps {
    /**
     * Callback that is triggered when the user generates a deeplink.
     * The value returned will be the value copied to the user clipboard.
     * @param deeplink the generated deeplink for the current context
     * @returns the final link value to be served to the user with any modifications by the consuming app
     */
    onGenerateDeeplink: (deeplink: string, options: IDeeplinkOptions) => string;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IConsumerDeeplinkContext {
    onGenerateDeeplink: (deeplink: string, options: IDeeplinkOptions) => string;
}
