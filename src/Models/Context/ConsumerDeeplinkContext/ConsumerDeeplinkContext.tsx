/**
 * This context is for letting consuming apps get a callback when a deeplink is generated so that they can intercept it and modify it. Presumably to add additional parameters like tid or app specific params.
 */
import React, { useContext } from 'react';
import {
    IConsumerDeeplinkContext,
    IConsumerDeeplinkContextProviderProps
} from './ConsumerDeeplinkContext.types';

const ConsumerDeeplinkContextInstance = React.createContext<IConsumerDeeplinkContext>(
    null
);
export const useConsumerDeeplinkContext = () =>
    useContext(ConsumerDeeplinkContextInstance);

export const ConsumerDeeplinkContext: React.FC<IConsumerDeeplinkContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useConsumerDeeplinkContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { onGenerateDeeplink } = props;

    return (
        <ConsumerDeeplinkContextInstance.Provider
            value={{
                onGenerateDeeplink
            }}
        >
            {children}
        </ConsumerDeeplinkContextInstance.Provider>
    );
};
