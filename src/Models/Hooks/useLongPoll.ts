import { useEffect, useRef, useState } from 'react';

export const defaultPollInterval = 1000;

type Params = {
    callback: () => void;
    pollInterval?: number;
    pulseInterval?: number;
};

const useLongPoll = ({
    callback,
    pollInterval = defaultPollInterval,
    pulseInterval = Math.ceil(defaultPollInterval / 2)
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
            timeoutId = setTimeout(() => setPulse(false), pulseInterval);
        }

        if (pollInterval !== null) {
            tick();
            intervalId = setInterval(tick, pollInterval);
            return () => {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
            };
        }
    }, [pollInterval]);

    return {
        pulse
    };
};

export default useLongPoll;
