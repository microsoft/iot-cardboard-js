import { useEffect, useRef, useState } from 'react';

export const defaultPollingIntervalMillis = 1000;

type Params = {
    callback: () => Promise<any>;
    pollingIntervalMillis?: number;
    pulseTimeoutMillis?: number;
};

const useLongPoll = ({
    callback,
    pollingIntervalMillis = defaultPollingIntervalMillis,
    pulseTimeoutMillis = 400
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
        pulse
    };
};

export default useLongPoll;
