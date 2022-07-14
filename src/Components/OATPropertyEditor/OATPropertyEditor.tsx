import React, { useReducer } from 'react';
import { Theme } from '../../Models/Constants/Enums';
import Editor from './Editor';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { IDropdownOption } from '@fluentui/react';
import {
    OATPropertyEditorReducer,
    defaultOATPropertyEditorState
} from './OATPropertyEditor.state';

type IOATPropertyEditor = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    theme?: Theme;
    state?: IOATEditorState;
    languages: IDropdownOption[];
};

const OATPropertyEditor = ({
    theme,
    dispatch,
    state,
    languages
}: IOATPropertyEditor) => {
    const [statePE, dispatchPE] = useReducer(
        OATPropertyEditorReducer,
        defaultOATPropertyEditorState
    );

    return (
        <div>
            <Editor
                theme={theme}
                dispatch={dispatch}
                state={state}
                dispatchPE={dispatchPE}
                statePE={statePE}
                languages={languages}
            />
        </div>
    );
};

export default OATPropertyEditor;
