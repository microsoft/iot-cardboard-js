import React, { useRef } from 'react';
import prettyBytes from 'pretty-bytes';
import JsonUploader from '../../../Components/JsonUploader/JsonUploader';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../../Models/Constants';
<<<<<<< HEAD
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
=======

type OATImportProps = {
    isJsonUploaderOpen: boolean;
    setIsJsonUploaderOpen: (boolean) => any;
    setImportModels: () => any;
};

const OATImport = ({
    isJsonUploaderOpen,
    setIsJsonUploaderOpen,
    setImportModels
}: OATImportProps) => {
>>>>>>> origin/zarmada/oat-development
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
                    console.log(Error(error));
                    alert(Error(error));
                }
                items.push(newItem.content);
            }
<<<<<<< HEAD
            dispatch;
            dispatch({
                type: SET_OAT_IMPORT_MODELS,
                payload: items
            });
            dispatch({
                type: SET_OAT_IS_JSON_UPLOADER_OPEN,
                payload: !isJsonUploaderOpen
            });
=======
            setImportModels(items);
            setIsJsonUploaderOpen((prev) => !prev);
>>>>>>> origin/zarmada/oat-development
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
