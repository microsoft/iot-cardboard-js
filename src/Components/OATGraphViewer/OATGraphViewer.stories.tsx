import React, { useReducer } from 'react';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATGraphViewer from './OATGraphViewer';
import { OATEditorPageReducer } from '../../Pages/OATEditorPage/OATEditorPage.state';
import { defaultOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.state';

export default {
    title: 'Components/OATGraphViewer',
    component: OATGraphViewer
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );

    return (
        <BaseComponent locale={locale} theme={theme}>
            <CommandHistoryContextProvider>
                <OATGraphViewer state={state} dispatch={dispatch} />
            </CommandHistoryContextProvider>
        </BaseComponent>
    );
};
