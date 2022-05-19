import React, { useState, useEffect } from 'react';
import { ActionButton, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getSubMenuItemStyles, getSubMenuStyles } from '../OATHeader.styles';
import {
    OATDataStorageKey,
    OATFilesStorageKey
} from '../../../Models/Constants/Constants';
import { IAction } from '../../../Models/Constants';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import {
    SET_OAT_PROJECT_NAME,
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_RELOAD_PROJECT
} from '../../../Models/Constants/ActionTypes';

type IFileSubMenu = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    subMenuActive?: boolean;
    parentIndex?: number;
    targetId?: string;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setSubMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
};

export const FileSubMenu = ({
    dispatch,
    subMenuActive,
    targetId,
    setModalBody,
    setModalOpen,
    setSubMenuActive,
    state
}: IFileSubMenu) => {
    const { t } = useTranslation();
    const subMenuItemStyles = getSubMenuItemStyles();
    const subMenuStyles = getSubMenuStyles();
    const [files] = useState(
        JSON.parse(localStorage.getItem(OATFilesStorageKey))
    );
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
            localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));
        } else {
            // Create new file
            setModalBody('save');
            setModalOpen(true);
        }
    };

    const resetProject = () => {
        const clearProject = {
            modelPositions: [],
            models: [],
            projectDescription: t('OATHeader.description'),
            projectName: t('OATHeader.project')
        };

        localStorage.setItem(OATDataStorageKey, JSON.stringify(clearProject));

        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: clearProject
        });

        dispatch({
            type: SET_OAT_PROJECT_NAME,
            payload: t('OATHeader.project')
        });

        dispatch({
            type: SET_OAT_RELOAD_PROJECT,
            payload: true
        });
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
                setModalBody('saveCurrentProjectAndClear');
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
                payload: t('OATHeader.project')
            });
            setModalBody('saveCurrentProjectAndClear');
            setModalOpen(true);
        }
    };

    useEffect(() => {
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
                                setModalBody('open');
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
                            setModalBody('save');
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

                    <ActionButton
                        styles={subMenuItemStyles}
                        onClick={() => {
                            setSubMenuActive(false);
                            setModalBody('delete');
                            setModalOpen(true);
                        }}
                    >
                        <Text>{t('OATHeader.delete')}</Text>
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
