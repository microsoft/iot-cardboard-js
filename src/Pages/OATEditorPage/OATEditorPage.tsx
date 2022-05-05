import React, { useState, useRef } from 'react';
import prettyBytes from 'pretty-bytes';
import JsonUploader from '../../Components/JsonUploader/JsonUploader';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../Models/Constants';

const OATEditorPage = ({ theme }) => {
    const [elementHandler, setElementHandler] = useState([]);
    const [importModels, setImportModels] = useState([]);
    const [templatesActive, setTemplatesActive] = useState(false);
    const EditorPageStyles = getEditorPageStyles();
    const [deletedModel, setDeletedModel] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [editedName, setEditedName] = useState('');
    const [editedId, setEditedId] = useState('');
    const [isJsonUploaderOpen, setIsJsonUploaderOpen] = useState(false);
    const existingFilesRef = useRef([]);
    const jsonUploaderComponentRef = useRef();

    const [model, setModel] = useState(null);
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

    const handleImportClick = () => {
        existingFilesRef.current = [];
        setIsJsonUploaderOpen((prev) => !prev);
    };

    const onFileListChanged = async (files: Array<File>) => {
        existingFilesRef.current = files;
        let items = [];
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const newItem = {
                    name: existingFilesRef.current[i].name,
                    size: prettyBytes(existingFilesRef.current[i].size),
                    status: FileUploadStatus.Uploading
                } as IFileItem;
                try {
                    const content = await existingFilesRef.current[i].text();
                    newItem.content = JSON.parse(content);
                } catch (error) {
                    console.log(Error(error));
                }
                items = [...items, newItem.content];
            }
            setImportModels(items);
            setIsJsonUploaderOpen((prev) => !prev);
        }
    };

    return (
        <div className={EditorPageStyles.container}>
            <OATHeader
                elements={elementHandler.digitalTwinsModels}
                handleImportClick={handleImportClick}
            />
            {isJsonUploaderOpen && (
                <JsonUploader
                    onFileListChanged={onFileListChanged}
                    ref={jsonUploaderComponentRef}
                    existingFiles={existingFilesRef.current}
                />
            )}
            <div
                className={
                    templatesActive
                        ? EditorPageStyles.componentTemplate
                        : EditorPageStyles.component
                }
            >
                <OATModelList
                    elements={elementHandler.digitalTwinsModels}
                    onDeleteModel={setDeletedModel}
                    onSelectedModel={setSelectedModel}
                    onEditedName={setEditedName}
                    onEditedId={setEditedId}
                />
                <OATGraphViewer
                    onElementsUpdate={setElementHandler}
                    importModels={importModels}
                    model={model}
                    setModel={setModel}
                    deletedModel={deletedModel}
                    selectModel={selectedModel}
                    editedName={editedName}
                    editedId={editedId}
                />
                <OATPropertyEditor
                    model={model}
                    setModel={setModel}
                    templates={templates}
                    setTemplates={setTemplates}
                    theme={theme}
                    templatesActive={templatesActive}
                    setTemplatesActive={setTemplatesActive}
                />
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
