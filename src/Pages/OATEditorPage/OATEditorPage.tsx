import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import prettyBytes from 'pretty-bytes';
import JsonPreview from '../../Components/JsonPreview/JsonPreview';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import JsonUploader from '../../Components/JsonUploader/JsonUploader';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../Models/Constants';

import './OATEditorPage.scss';

const OATEditorPage = ({ theme }) => {
    const { t } = useTranslation();
    const [isModelPreviewOpen, setIsModelPreviewOpen] = useState(false);
    const [isJsonUploaderOpen, setIsJsonUploaderOpen] = useState(false);
    const [modelName, setModelName] = useState('Home>Seattle factory');
    const [elements, setElements] = useState([]);
    const existingFilesRef = useRef([]);
    const jsonUploaderComponentRef = useRef();

    const onHandleElementsUpdate = (newElements) => {
        setElements(newElements);
    };

    const onHandleImportModel = () => {
        existingFilesRef.current = [];
        setIsJsonUploaderOpen((prev) => !prev);
    };

    const onHandleExportModel = () => {
        setIsModelPreviewOpen((prev) => !prev);
    };

    const onFileListChanged = async (files: Array<File>) => {
        existingFilesRef.current = files;
        if (files.length > 0) {
            const newItem = {
                name: existingFilesRef.current[0].name,
                size: prettyBytes(existingFilesRef.current[0].size),
                status: FileUploadStatus.Uploading
            } as IFileItem;
            try {
                const content = await existingFilesRef.current[0].text();
                newItem.content = JSON.parse(content);
            } catch (error) {
                newItem.content = new Error(error);
            }
            setElements(newItem.content);
            setIsJsonUploaderOpen((prev) => !prev);
        }
    };

    return (
        <div className="cb-ontology-body-container">
            <OATHeader
                onHandleExportModel={onHandleExportModel}
                onHandleImportModel={onHandleImportModel}
                modelNameInput={modelName}
            ></OATHeader>
            {isJsonUploaderOpen && (
                <JsonUploader
                    onFileListChanged={onFileListChanged}
                    ref={jsonUploaderComponentRef}
                    existingFiles={existingFilesRef.current}
                />
            )}
            <div className="cb-ontology-body-component">
                <OATModelList
                    elements={elements}
                    theme={theme}
                    onHandleElementsUpdate={onHandleElementsUpdate}
                />
                <OATGraphViewer
                    elements={elements}
                    theme={theme}
                    onHandleElementsUpdate={onHandleElementsUpdate}
                />
                <OATPropertyEditor elements={elements} theme={theme} />
            </div>
            <JsonPreview
                json={elements}
                isOpen={isModelPreviewOpen}
                onDismiss={() => setIsModelPreviewOpen(false)}
                modalTitle={t('OATModel.models')}
                theme={theme}
            />
        </div>
    );
};

export default React.memo(OATEditorPage);
