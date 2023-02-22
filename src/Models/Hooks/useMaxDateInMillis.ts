import { useState } from 'react';
import { useStableMaxDateInMillis } from '../Context/StableMaxDateInMillisProvider';

const useMaxDateInMillis = () => {
    const stableMaxDateInMillis = useStableMaxDateInMillis();
    const [maxDateInMillis] = useState(
        stableMaxDateInMillis ? stableMaxDateInMillis : null
    );
    return maxDateInMillis;
};

export default useMaxDateInMillis;
