import React, { useReducer } from 'react';
import BaseCardCreate from '../../Base/Create/BaseCardCreate';
import {
    defaultBIMViewerCardCreateState,
    BIMViewerCardCreateReducer
} from './BIMViewerCardCreate.state';
import { BIMViewerCardCreateProps } from './BIMViewerCardCreate.types';
import './BIMViewerCardCreate.scss';

const BIMViewerCardCreate: React.FC<BIMViewerCardCreateProps> = ({
    theme,
    defaultState
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, dispatch] = useReducer(
        BIMViewerCardCreateReducer,
        defaultState ? defaultState : defaultBIMViewerCardCreateState
    );
    return (
        <BaseCardCreate
            theme={theme}
            form={<div>Form</div>}
            preview={<div></div>}
        ></BaseCardCreate>
    );
};

export default BIMViewerCardCreate;
