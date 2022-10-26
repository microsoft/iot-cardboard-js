import React, { useReducer } from 'react';
import Editor from './Editor';
import {
    OATPropertyEditorReducer,
    defaultOATPropertyEditorState
} from './OATPropertyEditor.state';
import { OATPropertyEditorProps } from './OATPropertyEditor.types';

const OATPropertyEditor = ({ theme, languages }: OATPropertyEditorProps) => {
    // state
    const [localState, localDispatch] = useReducer(
        OATPropertyEditorReducer,
        defaultOATPropertyEditorState
    );

    return (
        <div style={{ width: 340, position: 'relative' }}>
            <Editor
                theme={theme}
                dispatch={localDispatch}
                state={localState}
                languages={languages}
            />
        </div>
    );
};

export default OATPropertyEditor;
