import React, { useReducer } from 'react';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from '../../Pages/OATEditorPage/OATEditorPage.state';
import OATHeader from './OATHeader';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import useCommandHistory from '../../Pages/OATEditorPage/Internal/Hooks/useCommandHistory';
import BaseComponent from '../BaseComponent/BaseComponent';

export default {
    title: 'Components/OATHeader',
    component: OATHeader
};

export const Default = (args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );

    const providerValue = useCommandHistory([]);

    return (
        <BaseComponent locale={locale} theme={theme}>
            <CommandHistoryContext.Provider value={providerValue}>
                <OATHeader dispatch={dispatch} state={state} />
            </CommandHistoryContext.Provider>
        </BaseComponent>
    );
};
