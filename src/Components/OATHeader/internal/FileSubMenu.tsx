import React, { useState, useEffect } from 'react';
import { ActionButton, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getSubMenuItemStyles, getSubMenuStyles } from '../OATHeader.styles';
import { IAction } from '../../../Models/Constants';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { SET_OAT_PROJECT_NAME } from '../../../Models/Constants/ActionTypes';
import { FromBody } from './Enums';
import { loadFiles, saveFiles } from './Utils';
import { deepCopy } from '../../../Models/Services/Utils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';

type IFileSubMenu = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    resetProject?: () => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setSubMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
    subMenuActive?: boolean;
    state?: IOATEditorState;
    targetId?: string;
};

export const FileSubMenu = ({
    dispatch,
    resetProject,
    setModalBody,
    setModalOpen,
    setSubMenuActive,
    subMenuActive,
    state,
    targetId
}: IFileSubMenu) => {
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
        setSubMenuActive(false);

        if (isFileStored) {
            // Update file
            const filesCopy = deepCopy(files);

            const project = new ProjectData(
                modelPositions,
                models,
                '',
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
        setSubMenuActive(false);

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
        <>
            {subMenuActive && (
                <Callout
                    styles={subMenuStyles}
                    role="dialog"
                    gapSpace={0}
                    target={`#${targetId}`}
                    isBeakVisible={false}
                    setInitialFocus
                    onDismiss={() => setSubMenuActive(false)}
                >
                    <ActionButton styles={subMenuItemStyles} onClick={onNew}>
                        <Text>{t('OATHeader.new')}</Text>
                    </ActionButton>

                    {files.length > 0 && (
                        <ActionButton
                            styles={subMenuItemStyles}
                            onClick={() => {
                                setSubMenuActive(false);
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
                            setSubMenuActive(false);
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
                                setSubMenuActive(false);
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
            )}
        </>
    );
};

export default FileSubMenu;

FileSubMenu.defaultProps = {
    removeItem: true,
    duplicateItem: true,
    addItemToTemplates: true
};
