import React, { useState, useEffect } from 'react';
import { ActionButton, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getSubMenuItemStyles,
    getSubMenuStyles,
    getSubMenuHiddenStyles,
    getHeaderStyles
} from '../OATHeader.styles';
import { IAction, OATNamespaceDefaultValue } from '../../../Models/Constants';
import {
    SET_OAT_PROJECT,
    SET_OAT_PROJECT_NAME
} from '../../../Models/Constants/ActionTypes';
import { FromBody } from './Enums';
import { deepCopy, loadFiles, saveFiles } from '../../../Models/Services/Utils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import ModalDelete from './ModalDelete';
import FormSaveAs from './FormSaveAs';
import ModalSaveCurrentProjectAndClear from './ModalSaveCurrentProjectAndClear';
import FormSettings from './FormSettings';
import FromOpen from './FormOpen';
import OATModal from '../../../Pages/OATEditorPage/Internal/Components/OATModal';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

interface IFileSubMenu {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    onFileSubMenuClose: () => void;
    isActive?: boolean;
    state?: IOATEditorState;
    targetId?: string;
}

export const FileSubMenu = ({
    dispatch,
    onFileSubMenuClose,
    isActive,
    state,
    targetId
}: IFileSubMenu) => {
    const { t } = useTranslation();
    const subMenuItemStyles = getSubMenuItemStyles();
    const subMenuStyles = getSubMenuStyles();
    const headerStyles = getHeaderStyles();
    const subMenuHiddenStyles = getSubMenuHiddenStyles();
    const [files, setFiles] = useState(loadFiles());
    const [isFileStored, setIsFileStored] = useState(false);
    const [fileIndex, setFileIndex] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState(null);
    const {
        modelPositions,
        models,
        projectName,
        templates,
        namespace,
        modelsMetadata
    } = state;

    const onSave = () => {
        onFileSubMenuClose();

        if (isFileStored) {
            // Update file
            const filesCopy = deepCopy(files);

            const project = new ProjectData(
                modelPositions,
                models,
                projectName,
                templates,
                namespace,
                modelsMetadata
            );

            filesCopy[fileIndex].data = project;
            setFiles(filesCopy);
            saveFiles(filesCopy);
        } else {
            // Create new file
            setModalBody(FromBody.save);
            setModalOpen(true);
        }
    };

    const onSettingsClick = () => {
        setModalOpen(true);
        setModalBody(FromBody.settings);
    };

    const onNew = () => {
        onFileSubMenuClose();

        if (isFileStored) {
            // Check if current project has been modified
            if (
                JSON.stringify(models) !==
                JSON.stringify(files[fileIndex].data.models)
            ) {
                // Prompt the if user would like to save current progress
                setModalBody(FromBody.saveCurrentProjectAndClear);
                setModalOpen(true);
                return;
            }
            //  Reset project data and project name
            resetProject();
            setModalBody(FromBody.settings);
            setModalOpen(true);
        } else if (
            // Check if current file has any progress
            models &&
            models.length > 0
        ) {
            dispatch({
                type: SET_OAT_PROJECT_NAME,
                payload: t('OATHeader.untitledProject')
            });
            setModalBody(FromBody.saveCurrentProjectAndClear);
            setModalOpen(true);
        }
    };

    const resetProject = () => {
        const clearProject = new ProjectData(
            [],
            [],
            t('OATHeader.untitledProject'),
            [],
            OATNamespaceDefaultValue,
            []
        );

        dispatch({
            type: SET_OAT_PROJECT,
            payload: clearProject
        });
    };

    const getModalBody = () => {
        switch (modalBody) {
            case FromBody.delete:
                return (
                    <ModalDelete
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        state={state}
                        resetProject={resetProject}
                    />
                );
            case FromBody.open:
                return (
                    <FromOpen
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                    />
                );
            case FromBody.save:
                return (
                    <FormSaveAs
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        resetProject={resetProject}
                        state={state}
                    />
                );
            case FromBody.saveCurrentProjectAndClear:
                return (
                    <ModalSaveCurrentProjectAndClear
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        state={state}
                        resetProject={resetProject}
                    />
                );
            case FromBody.saveNewProjectAndClear:
                return (
                    <FormSaveAs
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        resetProjectOnSave
                        resetProject={resetProject}
                        state={state}
                    />
                );
            case FromBody.settings:
                return (
                    <FormSettings
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        state={state}
                    />
                );
            default:
                return <></>;
        }
    };

    useEffect(() => {
        // Check if current file is stored
        let foundIndex = -1;
        if (files.length > 0 && projectName) {
            foundIndex = files.findIndex((file) => file.name === projectName);
            setFileIndex(foundIndex);
            if (foundIndex > -1) {
                setIsFileStored(true);
            }
        }
    }, []);

    return (
        <>
            <Callout
                styles={isActive ? subMenuStyles : subMenuHiddenStyles}
                role="dialog"
                gapSpace={0}
                target={`#${targetId}`}
                isBeakVisible={false}
                setInitialFocus
                onDismiss={onFileSubMenuClose}
            >
                <ActionButton styles={subMenuItemStyles} onClick={onNew}>
                    <Text>{t('OATHeader.new')}</Text>
                </ActionButton>

                {files.length > 0 && (
                    <ActionButton
                        styles={subMenuItemStyles}
                        onClick={() => {
                            onFileSubMenuClose();
                            setModalBody(FromBody.open);
                            setModalOpen(true);
                        }}
                    >
                        <Text>{t('OATHeader.open')}</Text>
                    </ActionButton>
                )}

                <ActionButton
                    styles={subMenuItemStyles}
                    onClick={() => {
                        onFileSubMenuClose();
                        setModalBody(FromBody.save);
                        setModalOpen(true);
                    }}
                >
                    <Text>{t('OATHeader.saveAs')}</Text>
                </ActionButton>

                <ActionButton styles={subMenuItemStyles} onClick={onSave}>
                    <Text>{t('OATHeader.save')}</Text>
                </ActionButton>

                {isFileStored && (
                    <ActionButton
                        styles={subMenuItemStyles}
                        onClick={() => {
                            onFileSubMenuClose();
                            setModalBody(FromBody.delete);
                            setModalOpen(true);
                        }}
                    >
                        <Text>{t('OATHeader.delete')}</Text>
                    </ActionButton>
                )}

                <ActionButton
                    styles={subMenuItemStyles}
                    onClick={onSettingsClick}
                >
                    <Text>{t('OATHeader.settings')}</Text>
                </ActionButton>
            </Callout>

            <OATModal isOpen={modalOpen} className={headerStyles.modal}>
                {getModalBody()}
            </OATModal>
        </>
    );
};

export default FileSubMenu;

FileSubMenu.defaultProps = {
    removeItem: true,
    duplicateItem: true,
    addItemToTemplates: true
};
