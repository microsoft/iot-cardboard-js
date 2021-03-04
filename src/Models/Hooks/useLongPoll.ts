import { useEffect, useState } from 'react';

const defaultPollInterval = 1000;

type Params = {
    pollFunc: () => any;
    pollInterval?: number;
    pulseInterval?: number;
    startOnMount?: boolean;
};

const useLongPoll = ({
    pollFunc,
    pollInterval = defaultPollInterval,
    pulseInterval = Math.ceil(defaultPollInterval / 2),
    startOnMount = true
}: Params) => {
    const [pulse, setPulse] = useState(false);

    let dataLongPoll;
    let pulseTimeout;

    const pollFuncWithPulse = () => {
        pollFunc();
        setPulse(true);
        pulseTimeout = setTimeout(() => setPulse(false), pulseInterval);
    };

    const startPoll = () => {
        pollFuncWithPulse();
        dataLongPoll = setInterval(() => {
            pollFuncWithPulse();
        }, pollInterval);
    };

    const stopPoll = () => {
        clearInterval(dataLongPoll);
        clearTimeout(pulseTimeout);
        setPulse(false);
    };

    useEffect(() => {
        if (startOnMount) {
            startPoll();
        }
        return () => {
            clearInterval(dataLongPoll);
            clearTimeout(pulseTimeout);
        };
    }, []);

    return {
        startPoll,
        stopPoll,
        pulse
    };
};

export default useLongPoll;
