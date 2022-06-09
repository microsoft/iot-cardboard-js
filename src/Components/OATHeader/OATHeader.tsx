import React, { useEffect, useRef, useState } from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles } from './OATHeader.styles';
import JSZip from 'jszip';

import FileSubMenu from './internal/FileSubMenu';
import Modal from './internal/Modal';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { SET_OAT_PROJECT } from '../../Models/Constants/ActionTypes';
import { ProjectData } from '../../Pages/OATEditorPage/Internal/Classes';

import { IOATTwinModelNodes } from '../../Models/Constants';
import { IAction } from '../../Models/Constants/Interfaces';
import { useDropzone } from 'react-dropzone';
import { SET_OAT_IMPORT_MODELS } from '../../Models/Constants/ActionTypes';
import prettyBytes from 'pretty-bytes';
import {
    FileUploadStatus,
    IJSONUploaderFileItem as IFileItem
} from '../../Models/Constants';
import { parseModel } from '../../Models/Services/Utils';

const ID_FILE = 'file';

type OATHeaderProps = {
    elements: IOATTwinModelNodes[];
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};

const OATHeader = ({ elements, dispatch, state }: OATHeaderProps) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        inputRef
    } = useDropzone();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState(null);

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

    const onImportClick = () => {
        inputRef.current.click();
    };

    const items: ICommandBarItemProps[] = [
        {
            key: 'Save',
            text: t('OATHeader.file'),
            iconProps: { iconName: 'Save' },
            onClick: () => setSubMenuActive(!subMenuActive),
            id: ID_FILE
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

    const resetProject = () => {
        const clearProject = new ProjectData(
            [],
            [],
            t('OATHeader.description'),
            t('OATHeader.untitledProject'),
            []
        );

        dispatch({
            type: SET_OAT_PROJECT,
            payload: clearProject
        });
    };
    useEffect(() => {
        const newFiles = [];
        acceptedFiles.forEach((sF) => {
            if (sF.type === 'application/json') {
                newFiles.push(sF);
            } else {
                alert(`${sF.name} format not Supported`);
            }
            sF = new File([], '');
        });
        handleFileListChanged(newFiles);
        inputRef.current.value = '';
    }, [acceptedFiles]);

    const handleFileListChanged = async (files: Array<File>) => {
        const items = [];
        let allValidFiles = true;
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
                    const validJson = await parseModel(
                        content,
                        `Issue on file ${current.name} \r`
                    );
                    if (!validJson) {
                        items.push(newItem.content);
                    } else {
                        allValidFiles = false;
                    }
                } catch (error) {
                    console.log(error);
                    alert(`Issue on file ${current.name} \r ${error}`);
                    allValidFiles = false;
                }
            }
            if (allValidFiles) {
                dispatch({
                    type: SET_OAT_IMPORT_MODELS,
                    payload: items
                });
            }
        }
    };

    return (
        <div className={headerStyles.container}>
            <div className={headerStyles.menuComponent}>
                <div className="cb-oat-header-model"></div>
                <div className="cb-oat-header-menu">
                    <CommandBar items={items} />
                    {subMenuActive && (
                        <FileSubMenu
                            subMenuActive={subMenuActive}
                            targetId={ID_FILE}
                            setSubMenuActive={setSubMenuActive}
                            setModalOpen={setModalOpen}
                            setModalBody={setModalBody}
                            dispatch={dispatch}
                            state={state}
                            resetProject={resetProject}
                        />
                    )}
                    <Modal
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        modalBody={modalBody}
                        dispatch={dispatch}
                        state={state}
                        resetProject={resetProject}
                    />
                </div>
            </div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
            </div>
        </div>
    );
};

OATHeader.defaultProps = {
    elements: [],
    onImportClick: () => null
};

export default OATHeader;
