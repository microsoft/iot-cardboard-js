import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import BaseComponent from '../BaseComponent/BaseComponent';
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
            JSON.parse(value);
        } catch (e) {
            return false;
        }
        return JSON.parse(value);
    };

    const validateJSONValues = (json) => {
        const nameArray = json.contents.map((property) => property.name);
        const isNameDuplicated = nameArray.some(function (item, index) {
            return nameArray.indexOf(item) != index;
        });

        return isNameDuplicated;
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
        <BaseComponent theme={themeToUse}>
            <div>
                <Editor
                    height="90vh"
                    defaultLanguage="json"
                    value={content}
                    onMount={onHandleEditorDidMount}
                    onChange={onHandleEditorChange}
                />
            </div>
        </BaseComponent>
    );
};

export default JSONEditor;
