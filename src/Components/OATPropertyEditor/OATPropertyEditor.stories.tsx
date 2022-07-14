import React, { useReducer } from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import { OATPropertyEditorReducer } from './OATPropertyEditor.state';
import { defaultOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.state';
import i18n from '../../i18n';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditor
};

export const Default = (_args, { globals: { theme } }) => {
    const [state, dispatch] = useReducer(
        OATPropertyEditorReducer,
        defaultOATEditorState
    );

    const languages = Object.keys(i18n.options.resources).map((language) => {
        return {
            key: i18n.options.resources[language].translation.languageCode,
            text: i18n.options.resources[language].translation.languageName
        };
    });

    return (
        <div>
            <OATPropertyEditor
                theme={theme}
                state={state}
                dispatch={dispatch}
                languages={languages}
            />
        </div>
    );
};
