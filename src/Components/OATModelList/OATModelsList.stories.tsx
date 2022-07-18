import React, { useReducer } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATModelList from './OATModelList';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import useCommandHistory from '../../Pages/OATEditorPage/Internal/Hooks/useCommandHistory';
import {
    OATGraphViewerReducer,
    defaultOATEditorState
} from './OATModelList.state';

export default {
    title: 'Components/OATModelList',
    component: OATModelList
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATGraphViewerReducer,
        defaultOATEditorState
    );

    const providerValue = useCommandHistory([]);

    return (
        <BaseComponent theme={theme} locale={locale}>
            <CommandHistoryContext.Provider value={providerValue}>
                <OATModelList state={state} dispatch={dispatch} />
            </CommandHistoryContext.Provider>
        </BaseComponent>
    );
};
