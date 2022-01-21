import { useEffect, useRef, useState } from 'react';
import { UseLongPollParams } from '../Constants/Types';

export const defaultPollingIntervalMillis = 1000;
export const defaultPulseTimeoutMillis = 400;

/**
 * Hook to wrap vanilla setInterval with smarter, unmount-safe logic.
 * Adapted from Dan Abramov's declarative setInterval blog post
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
const useLongPoll = ({
    callback,
    pollingIntervalMillis = defaultPollingIntervalMillis,
    pulseTimeoutMillis = defaultPulseTimeoutMillis
}: UseLongPollParams) => {
    const [pulse, setPulse] = useState(false);
    const savedCallback = useRef(null);
    const mountedRef = useRef(true);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        let timeoutId, intervalId;

        async function tick() {
            await savedCallback.current();
            mountedRef.current && setPulse(true);
            timeoutId = setTimeout(
                () => mountedRef.current && setPulse(false),
                pulseTimeoutMillis
            );
        }

        if (pollingIntervalMillis !== null) {
            tick();
            intervalId = setInterval(tick, pollingIntervalMillis);
            return () => {
                mountedRef.current = false;
                clearInterval(intervalId);
                clearTimeout(timeoutId);
            };
        }
    }, [pollingIntervalMillis]);

    return {
        /**
         * Boolean pulse variable. Toggled to true for pulseTimeoutMillis
         * after callback completion, before returning to false.  Can be used
         * for visual indication of updated data in UI.
         */
        pulse
    };
};

export default useLongPoll;
