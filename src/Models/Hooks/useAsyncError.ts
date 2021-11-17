import { useState, useCallback } from 'react';

/** Hook which allows for bubbling up async errors to React error boundary
 *  https://medium.com/trabe/catching-asynchronous-errors-in-react-using-error-boundaries-5e8a5fd7b971
 */
const useAsyncError = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setError] = useState();
    return useCallback(
        (e) => {
            setError(() => {
                throw e;
            });
        },
        [setError]
    );
};

export default useAsyncError;
