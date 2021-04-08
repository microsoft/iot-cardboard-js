import { useState } from 'react';
import { createGUID, createSeededGUID } from '../Services/Utils';
import { useStableGuidRng } from '../Context/StableGuidRngProvider';

const useGuid = () => {
    const stableGuidRng = useStableGuidRng();
    const [guid] = useState(
        stableGuidRng ? createSeededGUID(stableGuidRng) : createGUID()
    );
    return guid;
};

export default useGuid;
