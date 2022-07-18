import React, { useRef } from 'react';
import prettyBytes from 'pretty-bytes';
import JsonUploader from '../../../Components/JsonUploader/JsonUploader';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../../Models/Constants';
import {
    SET_OAT_IMPORT_MODELS,
    SET_OAT_IS_JSON_UPLOADER_OPEN
} from '../../../Models/Constants/ActionTypes';
import { IAction } from '../../../Models/Constants/Interfaces';

type OATImportProps = {
    isJsonUploaderOpen: boolean;
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
};

const OATImport = ({ isJsonUploaderOpen, dispatch }: OATImportProps) => {
    const jsonUploaderComponentRef = useRef();

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
            dispatch({
                type: SET_OAT_IMPORT_MODELS,
                payload: items
            });
            dispatch({
                type: SET_OAT_IS_JSON_UPLOADER_OPEN,
                payload: !isJsonUploaderOpen
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
