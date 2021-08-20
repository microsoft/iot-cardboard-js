import {
    ColumnActionsMode,
    DetailsList,
    DetailsListLayoutMode,
    DirectionalHint,
    FontIcon,
    IconButton,
    MessageBar,
    MessageBarType,
    SelectionMode,
    TooltipDelay,
    TooltipHost
} from '@fluentui/react';
import prettyBytes from 'pretty-bytes';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { FileUploadStatus } from '../../Models/Constants';
import JsonPreview from '../JsonPreview/JsonPreview';
import { useId } from '@fluentui/react-hooks';

interface IFilesList {
    files: Array<File>;
    onRemoveFile: (idx: number) => void;
}

interface IFileItem {
    name: string;
    size: string;
    content?: JSON | Error;
    status: FileUploadStatus;
}

function FilesList({ files, onRemoveFile }: IFilesList, ref) {
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [selectedFileItem, setSelectedFileItem] = useState<IFileItem>(null);
    const [isLoadFinished, setIsLoadFinished] = useState(false);

    const { t } = useTranslation();

    const listItems = useMemo(
        () =>
            files?.map(
                (f: File) =>
                    ({
                        name: f.name,
                        size: prettyBytes(f.size),
                        status: FileUploadStatus.Uploading
                    } as IFileItem)
            ) ?? [],
        [files]
    );

    useEffect(() => {
        setIsLoadFinished(false);
    }, [files]);

    useEffect(() => {
        files?.forEach(async (f, idx) => {
            if (listItems[idx].content === undefined) {
                try {
                    const content = await f.text();
                    listItems[idx].content = JSON.parse(content);
                } catch (error) {
                    listItems[idx].content = new Error(error);
                }
            }

            if (idx === files.length - 1) {
                setIsLoadFinished(true);
            }
        });
    }, [listItems]);

    const handleViewItem = useCallback((item: IFileItem) => {
        setSelectedFileItem(item);
        setIsPreviewOpen(true);
    }, []);

    const handleDeleteItem = useCallback((index: number) => {
        onRemoveFile(index);
    }, []);

    useImperativeHandle(ref, () => ({
        getItemContents: () => {
            return listItems
                .filter((i) => !(i.content instanceof Error))
                .reduce((acc, currItem) => {
                    if (Array.isArray(currItem.content)) {
                        acc = acc.concat(currItem.content);
                    } else {
                        acc.push(currItem.content);
                    }
                    return acc;
                }, []);
        }
    }));

    return (
        <>
            <DetailsList
                className="cb-file-list"
                items={listItems}
                columns={[
                    {
                        key: 'cb-file-list-column-name',
                        name: t('name'),
                        minWidth: 210,
                        maxWidth: 350,
                        isResizable: true,
                        onRender: (item: IFileItem) => <span>{item.name}</span>
                    },
                    {
                        key: 'cb-file-list-column-size',
                        name: t('size'),
                        minWidth: 110,
                        maxWidth: 250,
                        onRender: (item: IFileItem) => <span>{item.size}</span>
                    },
                    {
                        key: 'cb-file-list-column-status',
                        name: '',
                        minWidth: 40,
                        columnActionsMode: ColumnActionsMode.disabled,
                        onRender: (item: IFileItem) =>
                            isLoadFinished &&
                            item.content instanceof Error && (
                                <ViewWithTooltip
                                    tooltipContent={
                                        <MessageBar
                                            className={'cb-no-models-error'}
                                            messageBarType={
                                                MessageBarType.error
                                            }
                                        >
                                            {item.content.toString()}
                                        </MessageBar>
                                    }
                                >
                                    <FontIcon
                                        iconName="Warning"
                                        className="cb-warning-icon  "
                                    ></FontIcon>
                                </ViewWithTooltip>
                            )
                    },
                    {
                        key: 'cb-file-list-column-actions',
                        name: t('action'),
                        minWidth: 110,
                        maxWidth: 250,
                        onRender: (item: IFileItem, index: number) => (
                            <div>
                                {isLoadFinished &&
                                    (!(item.content instanceof Error) ? (
                                        <IconButton
                                            iconProps={{ iconName: 'FileCode' }}
                                            title={t('view')}
                                            ariaLabel={t('view')}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleViewItem(item);
                                            }}
                                        />
                                    ) : (
                                        <IconButton
                                            iconProps={{
                                                iconName: 'FileCode'
                                            }}
                                            title={t('view')}
                                            ariaLabel={t('view')}
                                            disabled
                                        />
                                    ))}
                                <IconButton
                                    iconProps={{
                                        iconName: 'Delete',
                                        styles: {
                                            root: {
                                                color:
                                                    'var(--cb-color-text-error)'
                                            }
                                        }
                                    }}
                                    title={t('delete')}
                                    ariaLabel={t('delete')}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleDeleteItem(index);
                                    }}
                                />
                            </div>
                        )
                    }
                ]}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                styles={{
                    root: {
                        selectors: {
                            '.ms-DetailsRow-cell': {
                                lineHeight: '32px'
                            }
                        }
                    }
                }}
            />
            {isPreviewOpen && (
                <JsonPreview
                    isOpen={isPreviewOpen}
                    onDismiss={() => setIsPreviewOpen(false)}
                    json={selectedFileItem.content}
                    modalTitle={selectedFileItem.name}
                />
            )}
        </>
    );
}

const ViewWithTooltip: React.FunctionComponent<{
    tooltipContent: JSX.Element;
}> = ({ tooltipContent, children }) => {
    // Use useId() to ensure that the ID is unique on the page.
    // (It's also okay to use a plain string and manually ensure uniqueness.)
    const tooltipId = useId('tooltip');

    return (
        <TooltipHost
            tooltipProps={{ onRenderContent: () => tooltipContent }}
            delay={TooltipDelay.zero}
            id={tooltipId}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{ root: { display: 'inline-block' } }}
        >
            {children}
        </TooltipHost>
    );
};

export default forwardRef(FilesList);
