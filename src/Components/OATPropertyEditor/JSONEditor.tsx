import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Theme } from '../../Models/Constants/Enums';
import { useLibTheme } from '../../Theming/ThemeProvider';
import { useTranslation } from 'react-i18next';
import {
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_DISABLED
} from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { PrimaryButton } from '@fluentui/react';
import {
    getCancelButtonStyles,
    getSaveButtonStyles
} from './OATPropertyEditor.styles';
import { parseModels } from '../../Models/Services/Utils';

type JSONEditorProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    theme?: Theme;
    state?: IOATEditorState;
};

const JSONEditor = ({ dispatch, theme, state }: JSONEditorProps) => {
    const { t } = useTranslation();
    const libTheme = useLibTheme();
    const themeToUse = (libTheme || theme) ?? Theme.Light;
    const editorRef = useRef(null);
    const { model } = state;
    const [content, setContent] = useState(null);
    const unSavedContent = useRef(null);
    const cancelButtonStyles = getCancelButtonStyles();
    const saveButtonStyles = getSaveButtonStyles();

    useEffect(() => {
        setContent(JSON.stringify(model, null, 2));
        unSavedContent.current = JSON.stringify(model, null, 2);
    }, [model]);

    const onHandleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const isJsonStringValid = (value) => {
        try {
            return JSON.parse(value);
        } catch (e) {
            return false;
        }
    };

    const onHandleEditorChange = (value) => {
        if (value.replaceAll('\r\n', '\n') !== content) {
            setContent(value);
            dispatch({ type: SET_OAT_DISABLED, payload: true });
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
        setContent(unSavedContent.current);
        dispatch({ type: SET_OAT_DISABLED, payload: false });
    };

    const onSaveClick = async () => {
        const newModel = isJsonStringValid(content);
        const validJson = await parseModels([newModel]);
        if (validJson) {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: newModel
            });
            unSavedContent.current = content;
            dispatch({ type: SET_OAT_DISABLED, payload: false });
        }
    };

    return (
        <>
            {state.disabled && (
                <>
                    <PrimaryButton
                        styles={cancelButtonStyles}
                        onClick={onCancelClick}
                        text={t('cancel')}
                    ></PrimaryButton>
                    <PrimaryButton
                        styles={saveButtonStyles}
                        onClick={onSaveClick}
                        text={t('save')}
                    ></PrimaryButton>
                </>
            )}
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
        </>
    );
};

export default JSONEditor;
