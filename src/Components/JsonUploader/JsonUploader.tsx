import { getTheme, Icon, ITheme, Link } from '@fluentui/react';
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

function JsonUploader(_props, ref) {
    const [files, setFiles] = useState<Array<File>>([]);
    const filesRef = useRef(files);
    const fileListRef = useRef();

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const { t } = useTranslation();

    const theme: ITheme = getTheme();
    const { palette } = theme;

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    useEffect(() => {
        const newFiles = [...files];
        const existingFileNames = files.map((f) => f.name);
        acceptedFiles.forEach((sF) => {
            const fileType = sF.name.split('.').pop().toLowerCase();
            if (!existingFileNames.includes(sF.name) && fileType === 'json') {
                newFiles.push(sF);
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
            <div
                style={{ background: palette.neutralLighter }}
                {...getRootProps({ className: 'cb-drop-files-container' })}
            >
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
                <Link>{t('fileUploader.browseFiles')}</Link>
            </div>
            <FilesList
                files={files}
                onRemoveFile={removeFileHandler}
                ref={fileListRef}
            ></FilesList>
        </div>
    );
}

export default forwardRef(JsonUploader);
