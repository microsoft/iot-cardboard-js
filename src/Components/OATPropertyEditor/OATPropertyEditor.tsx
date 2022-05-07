import React, { useState } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import { Theme } from '../../Models/Constants/Enums';
import Modal from './Modal';
import Editor from './Editor';

type IOATPropertyEditor = {
    dispatch?: React.Dispatch<React.SetStateAction<any>>;
    theme?: Theme;
    state?: any;
};

const OATPropertyEditor = ({ theme, dispatch, state }: IOATPropertyEditor) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState('formProperty');
    const [templates, setTemplates] = useState([]);
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(null);
    const [
        currentNestedPropertyIndex,
        setCurrentNestedPropertyIndex
    ] = useState(null);

    return (
        <BaseComponent theme={theme}>
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
            />
            <Editor
                templates={templates}
                setTemplates={setTemplates}
                theme={theme}
                setModalBody={setModalBody}
                setModalOpen={setModalOpen}
                setCurrentNestedPropertyIndex={setCurrentNestedPropertyIndex}
                setCurrentPropertyIndex={setCurrentPropertyIndex}
                currentPropertyIndex={currentPropertyIndex}
                dispatch={dispatch}
                state={state}
            />
        </BaseComponent>
    );
};

export default OATPropertyEditor;

OATPropertyEditor.defaultProps = {
    setModalOpen: () => {
        console.log('no modal');
    }
};
