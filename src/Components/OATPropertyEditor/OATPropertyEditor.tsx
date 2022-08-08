import React, { useCallback, useMemo, useReducer } from 'react';
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
    const [localState, localDispatch] = useReducer(
        OATPropertyEditorReducer,
        defaultOATPropertyEditorState
    );

    const combinedState = useMemo(() => ({ ...state, ...localState }), [
        localState,
        state
    ]);

    const combinedDispatch = useCallback(
        (action) => {
            localDispatch(action);
            dispatch(action);
        },
        [localDispatch, dispatch]
    );

    return (
        <Editor
            theme={theme}
            dispatch={combinedDispatch}
            state={combinedState}
            languages={languages}
        />
    );
};

export default OATPropertyEditor;
