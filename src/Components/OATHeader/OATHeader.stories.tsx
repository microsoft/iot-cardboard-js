import React, { useReducer } from 'react';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from '../../Pages/OATEditorPage/OATEditorPage.state';
import OATHeader from './OATHeader';
import BaseComponent from '../BaseComponent/BaseComponent';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';

export default {
    title: 'Components/OATHeader',
    component: OATHeader
};

export const Default = (args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );

    return (
        <BaseComponent locale={locale} theme={theme}>
            <CommandHistoryContextProvider>
                <OATHeader dispatch={dispatch} state={state} />
            </CommandHistoryContextProvider>
        </BaseComponent>
    );
};
