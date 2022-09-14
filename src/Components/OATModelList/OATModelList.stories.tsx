import React, { useReducer } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATModelList from './OATModelList';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from '../../Pages/OATEditorPage/OATEditorPage.state';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';

export default {
    title: 'Components/OATModelList',
    component: OATModelList
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );

    return (
        <BaseComponent theme={theme} locale={locale}>
            <CommandHistoryContextProvider>
                <OATModelList state={state} dispatch={dispatch} />
            </CommandHistoryContextProvider>
        </BaseComponent>
    );
};
