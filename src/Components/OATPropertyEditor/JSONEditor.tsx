import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Theme } from '../../Models/Constants/Enums';
import { useLibTheme } from '../../Theming/ThemeProvider';
import { useTranslation } from 'react-i18next';

type OATPropertyEditorProps = {
    theme?: Theme;
    model?: any;
    setModel?: any;
};

const JSONEditor = ({ model, theme, setModel }: OATPropertyEditorProps) => {
    const { t } = useTranslation();
    const libTheme = useLibTheme();
    const themeToUse = (libTheme || theme) ?? Theme.Light;
    const editorRef = useRef(null);
    const [content, setContent] = useState(JSON.stringify(model, null, 2));

    useEffect(() => {
        setContent(JSON.stringify(model, null, 2));
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
                setModel(validJson);
            }
        }
        setContent(value);
    };

    return (
        <Editor
            defaultLanguage="json"
            value={content}
            onMount={onHandleEditorDidMount}
            onChange={onHandleEditorChange}
            theme={themeToUse === 'dark' ? 'vs-dark' : themeToUse}
        />
    );
};

export default JSONEditor;
