import { useEffect, useRef, useState } from 'react';

export const defaultPollingIntervalMillis = 1000;
export const defaultPulseTimeoutMillis = 400;

type Params = {
    /** Function to long poll at set interval */
    callback: () => Promise<any>;
    /** Time between each callback execution */
    pollingIntervalMillis?: number;
    /** Length of time UI pulse state remains true after callback completion - use to indicate updated data */
    pulseTimeoutMillis?: number;
};

/**
 * Hook to wrap vanilla setInterval with smarter, unmount-safe logic.
 * Adapted from Dan Abramov's declarative setInterval blog post
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
const useLongPoll = ({
    callback,
    pollingIntervalMillis = defaultPollingIntervalMillis,
    pulseTimeoutMillis = defaultPulseTimeoutMillis
}: Params) => {
    const [pulse, setPulse] = useState(false);
    const savedCallback = useRef(null);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        let timeoutId, intervalId;

        async function tick() {
            await savedCallback.current();
            setPulse(true);
            timeoutId = setTimeout(() => setPulse(false), pulseTimeoutMillis);
        }

        if (pollingIntervalMillis !== null) {
            tick();
            intervalId = setInterval(tick, pollingIntervalMillis);
            return () => {
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
