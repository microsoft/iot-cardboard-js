import { getTheme, Icon, ITheme, PrimaryButton } from '@fluentui/react';
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

function JsonUploader(_props, ref) {
    const [files, setFiles] = useState<Array<File>>([]);
    const chooseFileButton = useRef(null);
    const filesRef = useRef(files);
    const fileListRef = useRef();

    const theme: ITheme = getTheme();
    const { palette } = theme;

    const iconStyles = {
        root: {
            fontSize: 32,
            color: 'var(--cb-color-theme-primary)'
        }
    };

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const handleOnChangeFiles = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const newFiles = [...files];
        const selectedFiles = Array.from<File>(event.target.files);
        const existingFileNames = files.map((f) => f.name);
        selectedFiles.forEach((sF) => {
            const fileType = sF.name.split('.').pop().toLowerCase();
            if (!existingFileNames.includes(sF.name) && fileType === 'json') {
                newFiles.push(sF);
            }
        });
        setFiles(newFiles);
        event.target.value = null;
    };

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
                className={'cb-drop-files-container'}
                style={{ background: palette.neutralLighter }}
            >
                <Icon iconName="CloudUpload" styles={iconStyles} />
                <PrimaryButton
                    className={'cb-choose-file-button'}
                    text="Browse for files"
                    onClick={(_e) => chooseFileButton.current.click()}
                />
                <input
                    type="file"
                    multiple
                    ref={(ref) => (chooseFileButton.current = ref)}
                    style={{ display: 'none' }}
                    onChange={handleOnChangeFiles}
                />
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
