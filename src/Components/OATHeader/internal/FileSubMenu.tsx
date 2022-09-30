import React, { useState, useEffect, useCallback } from 'react';
import {
    ActionButton,
    Text,
    Callout,
    classNamesFunction,
    styled,
    useTheme,
    Modal
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { OAT_NAMESPACE_DEFAULT_VALUE } from '../../../Models/Constants';
import { FromBody } from './Enums';
import { deepCopy } from '../../../Models/Services/Utils';
import {
    convertDtdlInterfacesToModels,
    getOntologiesFromStorage,
    saveOntologiesToStorage
} from '../../../Models/Services/OatUtils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import ModalDelete from './ModalDelete';
import FormSaveAs from './FormSaveAs';
import ModalSaveCurrentProjectAndClear from './ModalSaveCurrentProjectAndClear';
import FormSettings from './FormSettings';
import FromOpen from './FormOpen';
import {
    IFileSubMenuProps,
    IFileSubMenuStyleProps,
    IFileSubMenuStyles
} from './FileSubMenu.types';
import { getStyles } from './FileSubMenu.styles';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

const getClassNames = classNamesFunction<
    IFileSubMenuStyleProps,
    IFileSubMenuStyles
>();

const FileSubMenu: React.FC<IFileSubMenuProps> = (props) => {
    const { onFileSubMenuClose, isActive, styles, targetId } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [files, setFiles] = useState(getOntologiesFromStorage());
    const [isFileStored, setIsFileStored] = useState(false);
    const [fileIndex, setFileIndex] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState(null);

    // callbacks
    const onSave = () => {
        onFileSubMenuClose();

        if (isFileStored) {
            // Update file
            const filesCopy = deepCopy(files);

            const project = new ProjectData(
                oatPageState.modelPositions,
                convertDtdlInterfacesToModels(oatPageState.models),
                oatPageState.projectName,
                oatPageState.templates,
                oatPageState.namespace,
                oatPageState.modelsMetadata
            );

            filesCopy[fileIndex].data = project;
            setFiles(filesCopy);
            saveOntologiesToStorage(filesCopy);
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
                JSON.stringify(oatPageState.models) !==
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
            oatPageState.models &&
            oatPageState.models.length > 0
        ) {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_PROJECT_NAME,
                payload: { name: t('OATHeader.untitledProject') }
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
            OAT_NAMESPACE_DEFAULT_VALUE,
            []
        );

        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_PROJECT,
            payload: clearProject
        });
    };

    const onModalClose = () => {
        setModalOpen(false);
    };

    const getModalBody = () => {
        switch (modalBody) {
            case FromBody.delete:
                return (
                    <ModalDelete
                        onClose={onModalClose}
                        setModalBody={setModalBody}
                        resetProject={resetProject}
                    />
                );
            case FromBody.open:
                return (
                    <FromOpen
                        setModalBody={setModalBody}
                        onClose={onModalClose}
                    />
                );
            case FromBody.save:
                return (
                    <FormSaveAs
                        onClose={onModalClose}
                        setModalBody={setModalBody}
                        resetProject={resetProject}
                    />
                );
            case FromBody.saveCurrentProjectAndClear:
                return (
                    <ModalSaveCurrentProjectAndClear
                        onClose={onModalClose}
                        setModalBody={setModalBody}
                        resetProject={resetProject}
                    />
                );
            case FromBody.saveNewProjectAndClear:
                return (
                    <FormSaveAs
                        onClose={onModalClose}
                        setModalBody={setModalBody}
                        resetProjectOnSave
                        resetProject={resetProject}
                    />
                );
            case FromBody.settings:
                return (
                    <FormSettings
                        onClose={onModalClose}
                        setModalBody={setModalBody}
                    />
                );
            default:
                return <></>;
        }
    };

    const onProjectChange = useCallback(() => {
        const currentFiles = getOntologiesFromStorage();
        setFiles(currentFiles);
        // Check if current file is stored
        let foundIndex = -1;
        if (currentFiles.length > 0 && oatPageState.projectName) {
            foundIndex = currentFiles.findIndex(
                (file) => file.id === oatPageState.projectName
            );
            setFileIndex(foundIndex);
            setIsFileStored(foundIndex > -1);
        } else {
            setIsFileStored(false);
        }
    }, [oatPageState.projectName]);

    // side effects
    useEffect(() => {
        onProjectChange();
    }, [onProjectChange, oatPageState.projectName]);

    // styles
    const classNames = getClassNames(styles, {
        isMenuOpen: isActive,
        theme: useTheme()
    });

    return (
        <>
            {isActive && (
                <Callout
                    styles={classNames.subComponentStyles.subMenuCallout}
                    role="dialog"
                    gapSpace={0}
                    target={`#${targetId}`}
                    isBeakVisible={false}
                    setInitialFocus
                    onDismiss={onFileSubMenuClose}
                >
                    <ActionButton
                        styles={classNames.subComponentStyles.menuItemButton()}
                        onClick={onNew}
                    >
                        <Text>{t('OATHeader.new')}</Text>
                    </ActionButton>

                    {files.length > 0 && (
                        <ActionButton
                            styles={classNames.subComponentStyles.menuItemButton()}
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
                        styles={classNames.subComponentStyles.menuItemButton()}
                        onClick={() => {
                            onFileSubMenuClose();
                            setModalBody(FromBody.save);
                            setModalOpen(true);
                        }}
                    >
                        <Text>{t('OATHeader.saveAs')}</Text>
                    </ActionButton>

                    <ActionButton
                        styles={classNames.subComponentStyles.menuItemButton()}
                        onClick={onSave}
                    >
                        <Text>{t('OATHeader.save')}</Text>
                    </ActionButton>

                    {isFileStored && (
                        <ActionButton
                            styles={classNames.subComponentStyles.menuItemButton()}
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
                        styles={classNames.subComponentStyles.menuItemButton()}
                        onClick={onSettingsClick}
                    >
                        <Text>{t('OATHeader.settings')}</Text>
                    </ActionButton>
                </Callout>
            )}

            <Modal
                isOpen={modalOpen}
                styles={classNames.subComponentStyles.modal}
            >
                {getModalBody()}
            </Modal>
        </>
    );
};

export default styled<
    IFileSubMenuProps,
    IFileSubMenuStyleProps,
    IFileSubMenuStyles
>(FileSubMenu, getStyles);
