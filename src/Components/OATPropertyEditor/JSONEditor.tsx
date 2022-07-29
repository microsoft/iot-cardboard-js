import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useLibTheme } from '../../Theming/ThemeProvider';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_MODIFIED,
    SET_OAT_ERROR,
    SET_OAT_MODELS
} from '../../Models/Constants/ActionTypes';
import { PrimaryButton, DefaultButton } from '@fluentui/react';
import {
    getCancelButtonStyles,
    getSaveButtonStyles
} from './OATPropertyEditor.styles';
import { deepCopy, parseModels } from '../../Models/Services/Utils';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { JSONEditorProps } from './JSONEditor.types';
import { OATRelationshipHandleName } from '../../Models/Constants';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { getTargetFromSelection, replaceTargetFromSelection } from './Utils';

const JSONEditor = ({ dispatch, theme, state }: JSONEditorProps) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const libTheme = useLibTheme();
    const themeToUse = libTheme || theme;
    const editorRef = useRef(null);
    const { selection, models } = state;
    const [content, setContent] = useState(null);
    const cancelButtonStyles = getCancelButtonStyles();
    const saveButtonStyles = getSaveButtonStyles();

    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );

    useEffect(() => {
        setContent(JSON.stringify(model, null, 2));
    }, [model]);

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
            dispatch({ type: SET_OAT_MODIFIED, payload: true });
        }
    };

    function setEditorThemes(monaco: any) {
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

    const onCancelClick = () => {
        setContent(JSON.stringify(model, null, 2));
        dispatch({ type: SET_OAT_MODIFIED, payload: false });
    };

    const checkDuplicateId = (modelValue: DTDLModel) => {
        if (modelValue['@type'] === OATRelationshipHandleName) {
            const repeatedIdOnRelationship = models.find(
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
            const repeatedIdModel = models.find(
                (queryModel) =>
                    queryModel['@id'] === modelValue['@id'] &&
                    queryModel['@id'] !== model['@id']
            );
            return !!repeatedIdModel;
        }
    };

    const onSaveClick = async () => {
        const newModel = isJsonStringValid(content);
        const validJson = await parseModels([...models, content]);

        const save = () => {
            const modelsCopy = deepCopy(models);
            replaceTargetFromSelection(modelsCopy, selection, newModel);
            dispatch({
                type: SET_OAT_MODELS,
                payload: modelsCopy
            });
            dispatch({ type: SET_OAT_MODIFIED, payload: false });
        };

        const undoSave = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
        };

        if (!validJson) {
            if (checkDuplicateId(newModel)) {
                // Dispatch error if duplicate id
                dispatch({
                    type: SET_OAT_ERROR,
                    payload: {
                        title: t('OATPropertyEditor.errorInvalidJSON'),
                        message: t('OATPropertyEditor.errorRepeatedId')
                    }
                });
            } else {
                execute(save, undoSave);
            }
        } else {
            dispatch({
                type: SET_OAT_ERROR,
                payload: {
                    title: t('OATPropertyEditor.errorInvalidJSON'),
                    message: validJson
                }
            });
        }
    };

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
                beforeMount={setEditorThemes}
                height={'95%'}
            />
            {state.modified && (
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
