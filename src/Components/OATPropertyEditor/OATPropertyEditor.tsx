import React, { useState } from 'react';
import { Theme } from '../../Models/Constants/Enums';
import Editor from './Editor';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { IDropdownOption } from '@fluentui/react';

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
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(null);
    const [
        currentNestedPropertyIndex,
        setCurrentNestedPropertyIndex
    ] = useState(null);

    const onCurrentPropertyIndexChange = (index: number): void => {
        setCurrentPropertyIndex(index);
    };

    const onCurrentNestedPropertyIndexChange = (index: number): void => {
        setCurrentNestedPropertyIndex(index);
    };

    return (
        <div>
            <Editor
                theme={theme}
                currentNestedPropertyIndex={currentNestedPropertyIndex}
                currentPropertyIndex={currentPropertyIndex}
                dispatch={dispatch}
                state={state}
                languages={languages}
                onCurrentPropertyIndexChange={onCurrentPropertyIndexChange}
                onCurrentNestedPropertyIndexChange={
                    onCurrentNestedPropertyIndexChange
                }
            />
        </div>
    );
};

export default OATPropertyEditor;
