import React, { useReducer } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATGraphViewer from './OATGraphViewer';
import {
    OATGraphViewerReducer,
    defaultOATEditorState
} from './OATGraphViewer.state';

export default {
    title: 'Components/OATGraphViewer',
    component: OATGraphViewer
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATGraphViewerReducer,
        defaultOATEditorState
    );

    return (
        <BaseComponent locale={locale} theme={theme}>
            <OATGraphViewer state={state} dispatch={dispatch} />
        </BaseComponent>
    );
};
