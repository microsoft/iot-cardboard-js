import React, { useReducer } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATModelList from './OATModelList';
import {
    OATGraphViewerReducer,
    defaultOATEditorState
} from './OATModelList.state';

export default {
    title: 'Components/OATModelList',
    component: OATModelList
};

export const Default = (_args, { globals: { theme } }) => {
    const [state, dispatch] = useReducer(
        OATGraphViewerReducer,
        defaultOATEditorState
    );

    return (
        <BaseComponent theme={theme}>
            <OATModelList state={state} dispatch={dispatch} />
        </BaseComponent>
    );
};
