import { useEffect, useRef, useState } from 'react';

export const defaultPollingIntervalMillis = 1000;

type Params = {
    callback: () => void;
    pollingIntervalMillis?: number;
    pulseIntervalMillis?: number;
};

const useLongPoll = ({
    callback,
    pollingIntervalMillis = defaultPollingIntervalMillis,
    pulseIntervalMillis = 500
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

        function tick() {
            savedCallback.current();
            setPulse(true);
            timeoutId = setTimeout(() => setPulse(false), pulseIntervalMillis);
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
