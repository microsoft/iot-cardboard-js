import React, { useState } from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles } from './OATHeader.styles';
import JSZip from 'jszip';
import {
    IAction,
    IOATTwinModelNodes,
    OATDataStorageKey
} from '../../Models/Constants';
import FileSubMenu from './internal/FileSubMenu';
import Modal from './internal/Modal';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    SET_OAT_PROJECT_NAME,
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_RELOAD_PROJECT
} from '../../Models/Constants/ActionTypes';
import { ProjectData } from './internal/Classes';

const ID_FILE = 'file';

type OATHeaderProps = {
    elements: IOATTwinModelNodes[];
    onImportClick: () => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};

const OATHeader = ({
    elements,
    onImportClick,
    dispatch,
    state
}: OATHeaderProps) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState('save');

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
            t('OATHeader.untitledProject')
        );

        localStorage.setItem(OATDataStorageKey, JSON.stringify(clearProject));

        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: clearProject
        });

        dispatch({
            type: SET_OAT_PROJECT_NAME,
            payload: t('OATHeader.untitledProject')
        });

        dispatch({
            type: SET_OAT_RELOAD_PROJECT,
            payload: true
        });
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
                <div className="cb-oat-header-versioning"></div>
            </div>
        </div>
    );
};

OATHeader.defaultProps = {
    elements: [],
    onImportClick: () => null
};

export default OATHeader;
