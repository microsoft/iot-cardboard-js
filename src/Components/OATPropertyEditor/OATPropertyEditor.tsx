import React, { useState } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import { Theme } from '../../Models/Constants/Enums';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { DTDLProperty } from '../../Models/Constants/Interfaces';
import Modal from './Modal';
import Editor from './Editor';

type IOATPropertyEditor = {
    model?: DTDLModel;
    theme?: Theme;
    templates?: DTDLProperty[];
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
    setTemplates?: React.Dispatch<React.SetStateAction<DTDLProperty>>;
    templatesActive?: boolean;
    setTemplatesActive?: (active: boolean) => boolean;
};

const OATPropertyEditor = ({
    model,
    setModel,
    theme,
    templates,
    setTemplates,
    templatesActive,
    setTemplatesActive
}: IOATPropertyEditor) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState('formProperty');
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
                model={model}
                setModel={setModel}
                currentPropertyIndex={currentPropertyIndex}
                currentNestedPropertyIndex={currentNestedPropertyIndex}
                setCurrentNestedPropertyIndex={setCurrentNestedPropertyIndex}
                setModalBody={setModalBody}
                modalBody={modalBody}
            />
            <Editor
                model={model}
                setModel={setModel}
                templates={templates}
                setTemplates={setTemplates}
                theme={theme}
                setModalBody={setModalBody}
                setModalOpen={setModalOpen}
                setCurrentNestedPropertyIndex={setCurrentNestedPropertyIndex}
                setCurrentPropertyIndex={setCurrentPropertyIndex}
                currentPropertyIndex={currentPropertyIndex}
                templatesActive={templatesActive}
                setTemplatesActive={setTemplatesActive}
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
