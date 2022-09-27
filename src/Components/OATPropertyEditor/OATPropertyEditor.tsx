import React, { useCallback, useMemo, useReducer } from 'react';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import Editor from './Editor';
import {
    OATPropertyEditorReducer,
    defaultOATPropertyEditorState
} from './OATPropertyEditor.state';
import { OATPropertyEditorProps } from './OATPropertyEditor.types';

const OATPropertyEditor = ({ theme, languages }: OATPropertyEditorProps) => {
    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [localState, localDispatch] = useReducer(
        OATPropertyEditorReducer,
        defaultOATPropertyEditorState
    );

    const combinedState = useMemo(() => ({ ...oatPageState, ...localState }), [
        localState,
        oatPageState
    ]);

    const combinedDispatch = useCallback(
        (action) => {
            localDispatch(action);
            oatPageDispatch(action);
        },
        [localDispatch, oatPageDispatch]
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
