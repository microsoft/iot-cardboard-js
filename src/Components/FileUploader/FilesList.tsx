import {
    DetailsList,
    DetailsListLayoutMode,
    IconButton,
    SelectionMode
} from '@fluentui/react';
import prettyBytes from 'pretty-bytes';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    FileUploadedStatus,
    JSONPreviewOverflowCharacterLimit
} from '../../Models/Constants';
import JsonPreview from '../JsonPreview/JsonPreview';

interface IFilesList {
    files: Array<File>;
    onRemoveFile: (idx: number) => void;
}

interface IFileItem {
    name: string;
    size: string;
    status: FileUploadedStatus;
}

const FilesList: React.FC<IFilesList> = ({ files, onRemoveFile }) => {
    const { t } = useTranslation();
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File>(null);
    const [selectedFileText, setSelectedFileText] = useState('');
    const filesRef = useRef(files);

    const listItems = useMemo(
        () =>
            files?.map(
                (f: File) =>
                    ({
                        name: f.name,
                        size: prettyBytes(f.size),
                        status: FileUploadedStatus.Uploading
                    } as IFileItem)
            ) ?? [],
        [files]
    );

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const handleViewItem = useCallback((item: IFileItem, index: number) => {
        setSelectedFile(filesRef.current[index]);
        getFileData(filesRef.current[index]);
    }, []);

    const handleDeleteItem = useCallback((item: IFileItem, index: number) => {
        onRemoveFile(index);
    }, []);

    const getFileData = useCallback((file: File) => {
        const reader = new FileReader();
        const fileType = file.name.split('.').pop().toLowerCase();
        if (fileType === 'json') {
            reader.onload = (evt: any) => {
                const text = evt.target.result;
                if (text) {
                    if (text.length > JSONPreviewOverflowCharacterLimit) {
                        setSelectedFileText(
                            text
                                .substring(0, JSONPreviewOverflowCharacterLimit)
                                .concat(`\n ... (${t('continued')})`)
                        );
                    } else {
                        setSelectedFileText(text);
                    }
                    setIsPreviewOpen(true);
                }
            };
            reader.readAsText(file, 'UTF-8');
        }
    }, []);

    return (
        <>
            <DetailsList
                items={listItems}
                columns={[
                    {
                        key: 'cb-file-uploader-column-name',
                        name: 'Name',
                        minWidth: 210,
                        maxWidth: 350,
                        onRender: (item: IFileItem) => <span>{item.name}</span>
                    },
                    {
                        key: 'cb-file-uploader-column-size',
                        name: 'Size',
                        minWidth: 110,
                        maxWidth: 250,
                        onRender: (item: IFileItem) => <span>{item.size}</span>
                    },
                    {
                        key: 'cb-file-uploader-column-actions',
                        name: 'Actions',
                        minWidth: 110,
                        maxWidth: 250,
                        onRender: (item: IFileItem, index: number) => (
                            <div>
                                <IconButton
                                    iconProps={{ iconName: 'FileCode' }}
                                    title={t('view')}
                                    ariaLabel={t(
                                        'modelSearch.modelListItemPreview'
                                    )}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleViewItem(item, index);
                                    }}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Delete' }}
                                    title={t('delete')}
                                    ariaLabel={t('delete')}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleDeleteItem(item, index);
                                    }}
                                />
                            </div>
                        )
                    }
                ]}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
            />
            {isPreviewOpen && (
                <JsonPreview
                    isOpen={isPreviewOpen}
                    onDismiss={() => setIsPreviewOpen(false)}
                    json={JSON.parse(selectedFileText)}
                    modalTitle={selectedFile.name}
                />
            )}
        </>
    );
};

export default FilesList;
