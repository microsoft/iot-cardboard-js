import { Icon, PrimaryButton } from '@fluentui/react';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import FilesList from './FilesList';
import './JsonUploader.scss';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { IJSONUploaderProps } from '../../Models/Constants/Interfaces';

function JsonUploader(
    { onFileListChanged, existingFileListItems }: IJSONUploaderProps,
    ref
) {
    const [files, setFiles] = useState<Array<File>>([]);
    const filesRef = useRef(files);
    const fileListRef = useRef();

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const { t } = useTranslation();

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    useEffect(() => {
        const newFiles = [...files];
        const existingFileNames = files.map((f) => f.name);
        acceptedFiles.forEach((sF) => {
            if (sF.type === 'application/json') {
                const index = existingFileNames.findIndex((n) => n === sF.name);
                if (index === -1) {
                    newFiles.push(sF);
                } else {
                    newFiles[index] = sF;
                }
            }
        });
        setFiles(newFiles);
    }, [acceptedFiles]);

    const removeFileHandler = useCallback((index: number) => {
        setFiles(filesRef.current.filter((_f, idx) => idx !== index));
    }, []);

    useImperativeHandle(ref, () => ({
        getJsonItems: () => {
            return (fileListRef.current as any)?.getItemContents();
        }
    }));

    return (
        <div className={'cb-file-uploader'}>
            <div {...getRootProps({ className: 'cb-drop-files-container' })}>
                <input {...getInputProps()} />
                <Icon
                    iconName="CloudUpload"
                    styles={{
                        root: {
                            fontSize: 32,
                            paddingBottom: 20,
                            color: 'var(--cb-color-theme-primary)'
                        }
                    }}
                />
                <span>{t('fileUploader.dragAndDrop')}</span>
                <span>{t('or')}</span>
                <PrimaryButton>{t('fileUploader.browseFiles')}</PrimaryButton>
            </div>
            <FilesList
                files={files}
                onRemoveFile={removeFileHandler}
                ref={fileListRef}
                onListUpdated={onFileListChanged}
                existingFileListItems={existingFileListItems}
            ></FilesList>
        </div>
    );
}

export default forwardRef(JsonUploader);
