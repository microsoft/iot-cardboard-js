import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Theme } from '../../Models/Constants/Enums';
import { useLibTheme } from '../../Theming/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';

type OATPropertyEditorProps = {
    dispatch?: React.Dispatch<React.SetStateAction<any>>;
    theme?: Theme;
    state: any;
};

const JSONEditor = ({ dispatch, theme, state }: OATPropertyEditorProps) => {
    const { t } = useTranslation();
    const libTheme = useLibTheme();
    const themeToUse = (libTheme || theme) ?? Theme.Light;
    const editorRef = useRef(null);
    const [content, setContent] = useState(
        JSON.stringify(state.model, null, 2)
    );

    useEffect(() => {
        setContent(JSON.stringify(state.model, null, 2));
    }, [state.model]);

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

    const validateJSONValues = (json) => {
        return json.contents
            .map((property) => property.name)
            .some((item, index, array) => array.indexOf(item) != index);
    };

    const onHandleEditorChange = (value) => {
        const validJson = isJsonStringValid(value);
        if (validJson) {
            if (validateJSONValues(validJson)) {
                alert(t('OATPropertyEditor.errorRepeatedPropertyName'));
            } else {
                dispatch({
                    type: SET_OAT_PROPERTY_EDITOR_MODEL,
                    payload: validJson
                });
            }
        }
        setContent(value);
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

    return (
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
    );
};

export default JSONEditor;
