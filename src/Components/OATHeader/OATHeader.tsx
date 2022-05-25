import React, { useEffect, useRef } from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles } from './OATHeader.styles';
import JSZip from 'jszip';
import { IOATTwinModelNodes, OATDataStorageKey } from '../../Models/Constants';
import { downloadText } from '../../Models/Services/Utils';
import { IAction } from '../../Models/Constants/Interfaces';
import { useDropzone } from 'react-dropzone';
import { SET_OAT_IMPORT_MODELS } from '../../Models/Constants/ActionTypes';
import prettyBytes from 'pretty-bytes';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../Models/Constants';

type OATHeaderProps = {
    elements: IOATTwinModelNodes[];
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    disabled: boolean;
};
import { parseModels } from '../../Models/Services/Utils';

const OATHeader = ({ elements, dispatch, disabled }: OATHeaderProps) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const inputFileRef = useRef();

    const downloadModelExportBlob = (blob) => {
        const blobURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', blobURL);
        link.setAttribute('download', 'modelExport.zip');
        link.innerHTML = '';
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    const handleExportClick = () => {
        const zip = new JSZip();
        for (const element of elements) {
            let fileName = element['@id'];
            fileName = fileName.replace(/;/g, '-').replace(/:/g, '_');
            zip.file(`${fileName}.json`, JSON.stringify(element));
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            downloadModelExportBlob(content);
        });
    };

    const handleSaveClick = () => {
        const editorData = localStorage.getItem(OATDataStorageKey);
        if (editorData) {
            downloadText(editorData, 'project.config');
        }
    };

    const onImportClick = () => {
        inputFileRef.current.click();
    };

    const items: ICommandBarItemProps[] = [
        {
            key: 'Save',
            text: t('OATHeader.save'),
            iconProps: { iconName: 'Save' },
            onClick: () => handleSaveClick()
        },
        {
            key: 'Upload',
            text: t('OATHeader.publish'),
            iconProps: { iconName: 'Upload' }
        },
        {
            key: 'Sync',
            text: t('OATHeader.sync'),
            iconProps: { iconName: 'Sync' }
        },
        {
            key: 'Import',
            text: t('OATHeader.import'),
            iconProps: { iconName: 'Import' },
            onClick: onImportClick
        },
        {
            key: 'Export',
            text: t('OATHeader.export'),
            iconProps: { iconName: 'Export' },
            onClick: handleExportClick
        }
    ];

    useEffect(() => {
        const newFiles = [];
        acceptedFiles.forEach((sF) => {
            if (sF.type === 'application/json') {
                newFiles.push(sF);
            } else {
                alert(`${sF.name} format not Supported`);
            }
        });
        handleFileListChanged(newFiles);
    }, [acceptedFiles]);

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
                const validJson = await parseModels([newItem.content]);
                if (validJson) {
                    items.push(newItem.content);
                }
            }
            dispatch({
                type: SET_OAT_IMPORT_MODELS,
                payload: items
            });
        }
    };

    return (
        <div>
            <div className={headerStyles.container}>
                <div className={headerStyles.menuComponent}>
                    <div className="cb-oat-header-model"></div>
                    <div className="cb-oat-header-menu">
                        <CommandBar items={items} />
                    </div>
                    <div className="cb-oat-header-versioning"></div>
                </div>
            </div>
            {disabled && <div className={headerStyles.disable}></div>}
            <div {...getRootProps()}>
                <input {...getInputProps()} ref={inputFileRef} />
            </div>
        </div>
    );
};

OATHeader.defaultProps = {
    elements: [],
    onImportClick: () => null
};

export default OATHeader;
