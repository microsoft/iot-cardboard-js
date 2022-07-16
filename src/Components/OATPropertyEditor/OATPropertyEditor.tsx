import React, { useReducer } from 'react';
import Editor from './Editor';
import {
    OATPropertyEditorReducer,
    defaultOATPropertyEditorState
} from './OATPropertyEditor.state';
import { OATPropertyEditorProps } from './OATPropertyEditor.types';

const OATPropertyEditor = ({
    theme,
    dispatch,
    state,
    languages
}: OATPropertyEditorProps) => {
    const [statePE, dispatchPE] = useReducer(
        OATPropertyEditorReducer,
        defaultOATPropertyEditorState
    );

    return (
        <Editor
            theme={theme}
            dispatch={dispatch}
            state={state}
            dispatchPE={dispatchPE}
            statePE={statePE}
            languages={languages}
        />
    );
};

export default OATPropertyEditor;
