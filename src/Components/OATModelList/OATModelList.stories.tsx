import React, { useReducer } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATModelList from './OATModelList';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import useCommandHistory from '../../Pages/OATEditorPage/Internal/Hooks/useCommandHistory';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from '../../Pages/OATEditorPage/OATEditorPage.state';

export default {
    title: 'Components/OATModelList',
    component: OATModelList
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
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
