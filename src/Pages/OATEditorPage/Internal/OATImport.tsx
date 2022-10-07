import React, { useRef } from 'react';
import prettyBytes from 'pretty-bytes';
import JsonUploader from '../../../Components/JsonUploader/JsonUploader';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../../Models/Constants';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

type OATImportProps = {
    isJsonUploaderOpen: boolean;
};

const OATImport: React.FC<OATImportProps> = (props) => {
    const { isJsonUploaderOpen } = props;

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const jsonUploaderComponentRef = useRef();

    // callbacks
    const handleFileListChanged = async (files: Array<File>) => {
        const items = [];
        if (files.length > 0) {
            for (const current of files) {
                const newItem = {
                    name: current.name,
                    size: prettyBytes(current.size),
                    status: FileUploadStatus.Uploading
                } as IFileItem;
                try {
                    const content = await current.text();
                    newItem.content = JSON.parse(content);
                } catch (error) {
                    console.log(error);
                    alert(error);
                }
                items.push(newItem.content);
            }
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_IMPORT_MODELS,
                payload: { models: items }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_IS_JSON_UPLOADER_OPEN,
                payload: { isOpen: !oatPageState.isJsonUploaderOpen }
            });
        }
    };

    return (
        <>
            {isJsonUploaderOpen && (
                <JsonUploader
                    onFileListChanged={handleFileListChanged}
                    ref={jsonUploaderComponentRef}
                />
            )}
        </>
    );
};

export default React.memo(OATImport);
