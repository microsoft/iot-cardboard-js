import React, { useState } from 'react';
import { ActionButton, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getSubMenuItemStyles, getSubMenuStyles } from '../OATHeader.styles';
import {
    OATDataStorageKey,
    OATFilesStorageKey
} from '../../../Models/Constants/Constants';
import { IAction } from '../../../Models/Constants';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

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

    const { projectName } = state;

    const handleSave = () => {
        setSubMenuActive(false);
        if (files.length > 0 && projectName) {
            // Update file
            const foundIndex = files.findIndex(
                (file) => file.name === projectName
            );
            if (foundIndex > -1) {
                const editorData = JSON.parse(
                    localStorage.getItem(OATDataStorageKey)
                );
                files[foundIndex].data = editorData;
                localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));
            }
        } else {
            // Create new file
            setModalBody('save');
            setModalOpen(true);
        }
    };

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
                        onClick={() => {
                            setSubMenuActive(false);
                        }}
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
                        <Text>{t('OATPropertyEditor.delete')}</Text>
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
