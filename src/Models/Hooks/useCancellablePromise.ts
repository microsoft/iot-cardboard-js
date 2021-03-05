import { useEffect, useRef } from 'react';
import { CancelledPromiseError } from '../Classes/Errors';

export function makeCancellable<T>(
    promise: T,
    promisesRef: React.MutableRefObject<any>
) {
    let isCancelled = false;
    let returnValue = null;

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
            // Remove promise from promisesRef.current list once resolved/rejected
            if (promisesRef.current.indexOf(returnValue) !== -1) {
                promisesRef.current = promisesRef.current.filter(
                    (promise) => promise !== returnValue
                );
            }
        }
        executePromise();
    });

    returnValue = {
        promise: wrappedPromise,
        cancel() {
            isCancelled = true;
        }
    };

    return returnValue;
}

// Cancellable promise hook adapted from this repo: https://github.com/rajeshnaroth/react-cancelable-promise-hook/blob/master/index.js
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
        const cPromise = makeCancellable(p, promises);
        promises.current.push(cPromise);
        return cPromise.promise;
    }

    return { cancellablePromise, cancel };
};

export default useCancellablePromise;
