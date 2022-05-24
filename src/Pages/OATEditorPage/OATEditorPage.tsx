import React, { useReducer } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';
import {
    OATEditorPageReducer,
    defaultOATEditorState
} from './OATEditorPage.state';
import OATErrorHandlingWrapper from './Internal/OATErrorHandlingWrapper';
import i18n from '../../i18n';

const OATEditorPage = ({ theme }) => {
    const [state, dispatch] = useReducer(
        OATEditorPageReducer,
        defaultOATEditorState
    );
    const editorPageStyles = getEditorPageStyles();

    const languages = Object.keys(i18n.options.resources).map((language) => {
        return {
            key: i18n.options.resources[language].translation.languageCode,
            text: i18n.options.resources[language].translation.languageName
        };
    });

    return (
        <div className={editorPageStyles.container}>
            <OATHeader
                elements={state.elements.digitalTwinsModels}
                dispatch={dispatch}
            />
            <div
                className={
                    state.templatesActive
                        ? editorPageStyles.componentTemplate
                        : editorPageStyles.component
                }
            >
                <OATModelList
                    elements={state.elements.digitalTwinsModels}
                    dispatch={dispatch}
                />
                <OATGraphViewer state={state} dispatch={dispatch} />
                <OATPropertyEditor
                    theme={theme}
                    state={state}
                    dispatch={dispatch}
                    languages={languages}
                />
            </div>
            <OATErrorHandlingWrapper state={state} dispatch={dispatch} />
        </div>
    );
};

export default React.memo(OATEditorPage);
