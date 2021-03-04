import { useEffect, useRef } from 'react';
import { IAdapterData } from '../Constants/Interfaces';

export function makeCancellable(promise) {
    let isCancelled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        async function executePromise() {
            try {
                const val = await promise;
                if (isCancelled) {
                    reject(new Error(`Promise cancelled.`));
                } else {
                    resolve(val);
                }
            } catch (error) {
                if (isCancelled) {
                    reject(new Error(`Promise cancelled.`));
                } else {
                    reject(error);
                }
            }
        }
        executePromise();
    });

    return {
        promise: wrappedPromise,
        cancel() {
            isCancelled = true;
        }
    };
}

const useCancellablePromise = () => {
    const promises = useRef(null);

    const cancel = () => {
        promises.current.forEach((p) => p.cancel());
        promises.current = [];
    };

    useEffect(() => {
        promises.current = promises.current || [];
        return cancel;
    }, []);

    function cancellablePromise(p) {
        const cPromise = makeCancellable(p);
        promises.current.push(cPromise);
        return cPromise.promise;
    }

    return { cancellablePromise, cancel };
};

export default useCancellablePromise;
