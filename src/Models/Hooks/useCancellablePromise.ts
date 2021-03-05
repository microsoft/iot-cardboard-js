import { useEffect, useRef } from 'react';
import { CancelledPromiseError } from '../Classes/Errors';

export function makeCancellable<T>(promise: T) {
    let isCancelled = false;

    const wrappedPromise = new Promise<T>((resolve, reject) => {
        async function executePromise() {
            try {
                const val = await promise;
                if (isCancelled) {
                    reject(new CancelledPromiseError());
                } else {
                    resolve(val);
                }
            } catch (error) {
                if (isCancelled) {
                    reject(new CancelledPromiseError());
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

    function cancellablePromise<T>(p: Promise<T>) {
        const cPromise = makeCancellable(p);
        promises.current.push(cPromise);
        return cPromise.promise;
    }

    return { cancellablePromise, cancel };
};

export default useCancellablePromise;
