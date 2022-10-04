import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useLibTheme } from '../../../Theming/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, DefaultButton } from '@fluentui/react';
import {
    getCancelButtonStyles,
    getSaveButtonStyles
} from '../OATPropertyEditor.styles';
import { deepCopy, parseModels } from '../../../Models/Services/Utils';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { JSONEditorProps } from './JSONEditor.types';
import { OAT_RELATIONSHIP_HANDLE_NAME } from '../../../Models/Constants';
import { DTDLModel } from '../../../Models/Classes/DTDL';
import { getTargetFromSelection, replaceTargetFromSelection } from '../Utils';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

function setEditorTheme(monaco: any) {
    monaco.editor.defineTheme('kraken', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            {
                token: 'comment',
                foreground: '#5d7988',
                fontStyle: 'italic'
            },
            { token: 'constant', foreground: '#e06c75' }
        ],
        colors: {
            'editor.background': '#16203b'
        }
    });
}

const JSONEditor: React.FC<JSONEditorProps> = (props) => {
    const { theme } = props;

    // hooks
    const { t } = useTranslation();
    const libTheme = useLibTheme();
    const themeToUse = libTheme || theme;

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const editorRef = useRef(null);
    const [content, setContent] = useState(null);

    // data
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            ),
        [oatPageState.currentOntologyModels, oatPageState.selection]
    );

    // side effects
    useEffect(() => {
        setContent(JSON.stringify(model, null, 2));
    }, [model]);

    // callbacks
    const onHandleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const isJsonStringValid = (value: string) => {
        try {
            return JSON.parse(value);
        } catch (e) {
            return false;
        }
    };

    const onHandleEditorChange = (value: string) => {
        if (value.replaceAll('\r\n', '\n') !== JSON.stringify(model, null, 2)) {
            setContent(value);
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODIFIED,
                payload: { isModified: true }
            });
        }
    };

    const onCancelClick = () => {
        setContent(JSON.stringify(model, null, 2));
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_MODIFIED,
            payload: { isModified: false }
        });
    };

    const checkDuplicateId = (modelValue: DTDLModel) => {
        if (modelValue['@type'] === OAT_RELATIONSHIP_HANDLE_NAME) {
            const repeatedIdOnRelationship = oatPageState.currentOntologyModels.find(
                (queryModel) =>
                    queryModel.contents &&
                    queryModel.contents.find(
                        (content) =>
                            content['@id'] === modelValue['@id'] &&
                            content['@id'] !== model['@id'] // Prevent checking for duplicate name to itself
                    )
            );
            return !!repeatedIdOnRelationship;
        } else {
            // Check current value is not used by another model as @id within models
            const repeatedIdModel = oatPageState.currentOntologyModels.find(
                (queryModel) =>
                    queryModel['@id'] === modelValue['@id'] &&
                    queryModel['@id'] !== model['@id']
            );
            return !!repeatedIdModel;
        }
    };

    const onSaveClick = async () => {
        const newModel = isJsonStringValid(content);
        const validJson = await parseModels([
            ...oatPageState.currentOntologyModels,
            content
        ]);

        const save = () => {
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            replaceTargetFromSelection(
                modelsCopy,
                oatPageState.selection,
                newModel
            );
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: modelsCopy }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODIFIED,
                payload: { isModified: false }
            });
        };

        const undoSave = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        if (!validJson) {
            if (checkDuplicateId(newModel)) {
                // Dispatch error if duplicate id
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_ERROR,
                    payload: {
                        title: t('OATPropertyEditor.errorInvalidJSON'),
                        message: t('OATPropertyEditor.errorRepeatedId')
                    }
                });
            } else {
                execute(save, undoSave);
            }
        } else {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_ERROR,
                payload: {
                    title: t('OATPropertyEditor.errorInvalidJSON'),
                    message: validJson
                }
            });
        }
    };

    // styles
    const cancelButtonStyles = getCancelButtonStyles();
    const saveButtonStyles = getSaveButtonStyles();

    return (
        <>
            <Editor
                defaultLanguage="json"
                value={content}
                onMount={onHandleEditorDidMount}
                onChange={onHandleEditorChange}
                theme={
                    themeToUse === 'dark' || theme === 'explorer'
                        ? 'vs-dark'
                        : themeToUse
                }
                beforeMount={setEditorTheme}
                height={'95%'}
            />
            {oatPageState.modified && (
                <>
                    <PrimaryButton
                        styles={saveButtonStyles}
                        onClick={onSaveClick}
                        text={t('save')}
                    ></PrimaryButton>
                    <DefaultButton
                        styles={cancelButtonStyles}
                        onClick={onCancelClick}
                        text={t('cancel')}
                    ></DefaultButton>
                </>
            )}
        </>
    );
};

export default JSONEditor;
