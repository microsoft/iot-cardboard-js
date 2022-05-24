import React, { useState, useEffect } from 'react';
import { ActionButton, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getSubMenuItemStyles, getSubMenuStyles } from '../OATHeader.styles';
import { OATDataStorageKey } from '../../../Models/Constants/Constants';
import { IAction } from '../../../Models/Constants';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { SET_OAT_PROJECT_NAME } from '../../../Models/Constants/ActionTypes';
import { FromBody } from './Enums';
import { loadFiles, saveFiles } from './Utils';

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
    const [files] = useState(loadFiles());
    const [isFileStored, setIsFileStored] = useState(false);
    const [fileIndex, setFileIndex] = useState(-1);
    const { projectName } = state;

    const handleSave = () => {
        setSubMenuActive(false);

        if (isFileStored) {
            // Update file
            const editorData = JSON.parse(
                localStorage.getItem(OATDataStorageKey)
            );
            files[fileIndex].data = editorData;
            saveFiles(files);
        } else {
            // Create new file
            setModalBody(FromBody.save);
            setModalOpen(true);
        }
    };

    const handleNew = () => {
        setSubMenuActive(false);
        const editorData = JSON.parse(localStorage.getItem(OATDataStorageKey));

        if (isFileStored) {
            // Check if current project has been modified
            if (
                JSON.stringify(editorData) !==
                JSON.stringify(files[fileIndex].data)
            ) {
                // Prompt the if user would like to save current progress
                setModalBody(FromBody.saveCurrentProjectAndClear);
                setModalOpen(true);
                return;
            }
            //  Reset project data and project name
            resetProject();
        } else if (
            // Check if current file has any progress
            editorData &&
            editorData.models &&
            editorData.models.length > 0
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
                    <ActionButton
                        styles={subMenuItemStyles}
                        onClick={handleNew}
                    >
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

                    <ActionButton
                        styles={subMenuItemStyles}
                        onClick={handleSave}
                    >
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
