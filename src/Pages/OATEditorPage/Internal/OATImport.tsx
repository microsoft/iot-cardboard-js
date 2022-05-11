import React, { useRef } from 'react';
import prettyBytes from 'pretty-bytes';
import JsonUploader from '../../../Components/JsonUploader/JsonUploader';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../../Models/Constants';

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
            setImportModels(items);
            setIsJsonUploaderOpen((prev) => !prev);
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
