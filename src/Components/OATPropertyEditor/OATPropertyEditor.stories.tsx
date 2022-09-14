import React, { useReducer } from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import BaseComponent from '../BaseComponent/BaseComponent';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    defaultOATEditorState,
    OATEditorPageReducer
} from '../../Pages/OATEditorPage/OATEditorPage.state';
import i18n from '../../i18n';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditor
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );

    const languages = Object.keys(i18n.options.resources).map((language) => {
        return {
            key: i18n.options.resources[language].translation.languageCode,
            text: i18n.options.resources[language].translation.languageName
        };
    });

    return (
        <BaseComponent locale={locale} theme={theme}>
            <CommandHistoryContextProvider>
                <OATPropertyEditor
                    theme={theme}
                    state={state}
                    dispatch={dispatch}
                    languages={languages}
                />
            </CommandHistoryContextProvider>
        </BaseComponent>
    );
};
