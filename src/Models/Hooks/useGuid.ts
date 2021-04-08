import { useState } from 'react';
import { createGUID } from '../Services/Utils';

const useGuid = (guidSeed: string) => {
    const [guid] = useState(createGUID(guidSeed));
    return guid;
};

export default useGuid;
