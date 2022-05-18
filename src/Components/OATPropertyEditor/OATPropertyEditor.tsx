import React, { useState, useEffect } from 'react';
import { Theme } from '../../Models/Constants/Enums';
import Modal from './Modal';
import Editor from './Editor';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { OATDataStorageKey } from '../../Models/Constants/Constants';
import { SET_OAT_TEMPLATES } from '../../Models/Constants/ActionTypes';
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
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState('formProperty');
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(null);
    const [
        currentNestedPropertyIndex,
        setCurrentNestedPropertyIndex
    ] = useState(null);
    const { templates } = state;

    // Default templates to storage value
    // Save templates updates to local storage
    useEffect(() => {
        const oatEditorData = JSON.parse(
            localStorage.getItem(OATDataStorageKey)
        );

        if (!templates && oatEditorData.templates) {
            dispatch({
                type: SET_OAT_TEMPLATES,
                payload: oatEditorData.templates
            });
        }

        if (oatEditorData && templates) {
            oatEditorData.templates = templates;
            localStorage.setItem(
                OATDataStorageKey,
                JSON.stringify(oatEditorData)
            );
        }
    }, [templates]);

    return (
        <div>
            {/* Wrap as one element in case modal is open */}
            <Modal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                currentPropertyIndex={currentPropertyIndex}
                currentNestedPropertyIndex={currentNestedPropertyIndex}
                setCurrentNestedPropertyIndex={setCurrentNestedPropertyIndex}
                setModalBody={setModalBody}
                modalBody={modalBody}
                dispatch={dispatch}
                state={state}
                languages={languages}
            />
            <Editor
                theme={theme}
                setModalBody={setModalBody}
                setModalOpen={setModalOpen}
                setCurrentNestedPropertyIndex={setCurrentNestedPropertyIndex}
                setCurrentPropertyIndex={setCurrentPropertyIndex}
                currentPropertyIndex={currentPropertyIndex}
                dispatch={dispatch}
                state={state}
            />
        </div>
    );
};

export default OATPropertyEditor;

OATPropertyEditor.defaultProps = {
    setModalOpen: () => {
        console.log('no modal');
    }
};
