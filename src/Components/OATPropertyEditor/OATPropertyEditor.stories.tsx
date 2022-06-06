import React, { useReducer } from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import {
    OATPropertyEditorReducer,
    defaultOATEditorState
} from './OATPropertyEditor.state';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditor
};

export const Default = (_args, { globals: { theme } }) => {
    const [state, dispatch] = useReducer(
        OATPropertyEditorReducer,
        defaultOATEditorState
    );

    return (
        <div>
            <OATPropertyEditor
                theme={theme}
                state={state}
                dispatch={dispatch}
            />
        </div>
    );
};
