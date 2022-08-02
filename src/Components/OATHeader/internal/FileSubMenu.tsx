import React, { useState, useEffect } from 'react';
import { ActionButton, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getSubMenuItemStyles, getSubMenuStyles } from '../OATHeader.styles';
import { SET_OAT_PROJECT_NAME } from '../../../Models/Constants/ActionTypes';
import { deepCopy, loadFiles, saveFiles } from '../../../Models/Services/Utils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { FromBody } from './Enums';

import { FileSubMenuProps } from './FileSubMenu.types';

export const FileSubMenu = ({
    dispatch,
    onFileSubMenuClose,
    state,
    targetId,
    resetProject,
    setModalOpen,
    setModalBody
}: FileSubMenuProps) => {
    const { t } = useTranslation();
    const subMenuItemStyles = getSubMenuItemStyles();
    const subMenuStyles = getSubMenuStyles();
    const [files, setFiles] = useState(loadFiles());
    const [isFileStored, setIsFileStored] = useState(false);
    const [fileIndex, setFileIndex] = useState(-1);
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
        console.log('neew');
        onFileSubMenuClose();
        console.log('isFileStored', isFileStored);
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
        <Callout
            styles={subMenuStyles}
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
                    setModalBody(FromBody.save);
                    setModalOpen(true);
                    onFileSubMenuClose();
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

            <ActionButton styles={subMenuItemStyles} onClick={onSettingsClick}>
                <Text>{t('OATHeader.settings')}</Text>
            </ActionButton>
        </Callout>
    );
};

export default FileSubMenu;

FileSubMenu.defaultProps = {
    removeItem: true,
    duplicateItem: true,
    addItemToTemplates: true
};
