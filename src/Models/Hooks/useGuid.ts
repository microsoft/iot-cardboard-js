import { useState } from 'react';
import { createGUID } from '../Services/Utils';

const useGuid = () => {
    const [guid] = useState(createGUID());
    return guid;
};

export default useGuid;
