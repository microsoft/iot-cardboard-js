import { useEffect, useRef, useState } from 'react';

const defaultPollInterval = 1000;

type Params = {
    callback: () => void;
    pollInterval?: number;
    pulseInterval?: number;
    startOnMount?: boolean;
    onCallbackChanged?: () => void;
};

const useLongPoll = ({
    callback,
    pollInterval = defaultPollInterval,
    pulseInterval = Math.ceil(defaultPollInterval / 2),
    onCallbackChanged = () => null
}: Params) => {
    const [pulse, setPulse] = useState(false);
    const savedCallback = useRef(null);

    // Remember the latest callback
    useEffect(() => {
        // savedCallback?.cancel()
        // console.log('Callback changed in useLongPoll');
        // onCallbackChanged();
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
    }, [callback, pollInterval]);

    return {
        pulse
    };
};

export default useLongPoll;
