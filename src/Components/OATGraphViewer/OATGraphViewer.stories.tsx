import React, { useReducer } from 'react';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import useCommandHistory from '../../Pages/OATEditorPage/Internal/Hooks/useCommandHistory';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATGraphViewer from './OATGraphViewer';
import { OATGraphViewerReducer } from './OATGraphViewer.state';
import { defaultOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.state';

export default {
    title: 'Components/OATGraphViewer',
    component: OATGraphViewer
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATGraphViewerReducer,
        defaultOATEditorState
    );

    const providerValue = useCommandHistory([]);

    return (
        <BaseComponent locale={locale} theme={theme}>
            <CommandHistoryContext.Provider value={providerValue}>
                <OATGraphViewer state={state} dispatch={dispatch} />
            </CommandHistoryContext.Provider>
        </BaseComponent>
    );
};
