import React, { useState } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
<<<<<<< HEAD
import { getEditorPageStyles } from './OATEditorPage.Styles';

const OATEditorPage = () => {
    const [elementHandler, setElementHandler] = useState([]);
    const EditorPageStyles = getEditorPageStyles();

    return (
        <div className={EditorPageStyles.container}>
            <OATHeader elements={elementHandler} />
            <div className={EditorPageStyles.component}>
                <OATModelList />
                <OATGraphViewer setElementHandler={setElementHandler} />
                <OATPropertyEditor />
=======
import Modal from '../../Components/OATPropertyEditor/Modal';

import './OATEditorPage.scss';

const OATEditorPage = ({ theme }) => {
    const [model, setModel] = useState({
        '@id': 'dtmi:com:adt:model1;',
        '@type': 'Interface',
        '@context': 'dtmi:adt:context;2',
        displayName: 'model1',
        contents: [
            {
                '@id': 'dtmi:com:adt:model1:prop_0',
                '@type': ['Property'],
                name: 'prop_0',
                schema: 'string',
                writable: true,
                comment: 'default comment',
                description: 'default description',
                unit: 'default unit'
            }
        ]
    });
    const [templates, setTemplates] = useState([
        {
            '@id': 'dtmi:com:adt:model1:prop_template_0',
            '@type': ['Property'],
            name: 'prop_template_0',
            schema: 'string',
            writable: true,
            comment: 'default comment',
            description: 'default description',
            unit: 'default unit'
        },
        {
            '@id': 'dtmi:com:adt:model1:prop_template_1',
            '@type': ['Property'],
            name: 'prop_template_1',
            schema: 'string',
            writable: true,
            comment: 'default comment',
            description: 'default description',
            unit: 'default unit'
        }
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(null);

    return (
        <div className="cb-ontology-body-container">
            <Modal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                model={model}
                setModel={setModel}
                currentPropertyIndex={currentPropertyIndex}
            />
            <OATHeader />
            <div className="cb-ontology-body-component">
                <OATModelList />
                <OATGraphViewer />
                <OATPropertyEditor
                    model={model}
                    setModel={setModel}
                    setModalOpen={setModalOpen}
                    currentPropertyIndex={currentPropertyIndex}
                    setCurrentPropertyIndex={setCurrentPropertyIndex}
                    templates={templates}
                    setTemplates={setTemplates}
                    theme={theme}
                />
>>>>>>> origin/zarmada/working/ADTS-89
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
