import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import BaseComponent from '../BaseComponent/BaseComponent';
import { Theme } from '../../Models/Constants/Enums';
import { useLibTheme } from '../../Theming/ThemeProvider';

type OATPropertyEditorProps = {
    elements: [];
    theme?: Theme;
};

const OATPropertyEditor = ({ elements, theme }: OATPropertyEditorProps) => {
    const { t } = useTranslation();
    const libTheme = useLibTheme();
    const themeToUse = (libTheme || theme) ?? Theme.Light;
    const editorRef = useRef(null);
    const [content, setContent] = useState(JSON.stringify(elements, null, 2));

    useEffect(() => {
        setContent(JSON.stringify(elements, null, 2));
    }, [elements]);

    const onHandleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const onHandleEditorChange = (evt) => {
        setContent(evt.target.value);
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

export default OATPropertyEditor;
