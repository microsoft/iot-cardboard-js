import React, { useReducer } from 'react';
import { getDebugLogger } from '../../Models/Services/Utils';
import Editor from './Editor';
import {
    OATPropertyEditorReducer,
    defaultOATPropertyEditorState
} from './OATPropertyEditor.state';
import { OATPropertyEditorProps } from './OATPropertyEditor.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATPropertyEditor', debugLogging);

const OATPropertyEditor = (props: OATPropertyEditorProps) => {
    const { selectedThemeName, selectedItem, parentModelId } = props;

    // state
    const [localState, localDispatch] = useReducer(
        OATPropertyEditorReducer,
        defaultOATPropertyEditorState
    );

    logDebugConsole('debug', 'Render. {selectedItem}', selectedItem);
    return (
        <Editor
            editorDispatch={localDispatch}
            editorState={localState}
            parentModelId={parentModelId}
            selectedItem={selectedItem}
            selectedThemeName={selectedThemeName}
        />
    );
};

export default OATPropertyEditor;
