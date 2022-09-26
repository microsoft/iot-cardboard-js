import React from 'react';
import { ActionButton, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getSubMenuItemStyles, getSubMenuStyles } from '../OATHeader.styles';
import { ImportSubMenuProps } from './ImportSubMenu.types';

export const ImportSubMenu = ({
    setSubMenuActive,
    subMenuActive,
    targetId,
    uploadFile,
    uploadFolder
}: ImportSubMenuProps) => {
    const { t } = useTranslation();
    const subMenuItemStyles = getSubMenuItemStyles();
    const subMenuStyles = getSubMenuStyles();

    const onUploadFile = () => {
        uploadFile && uploadFile();
        setSubMenuActive(false);
    };

    const onUploadFolder = () => {
        uploadFolder && uploadFolder();
        setSubMenuActive(false);
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
                        onClick={onUploadFile}
                    >
                        <Text>{t('OATHeader.importFile')}</Text>
                    </ActionButton>

                    <ActionButton
                        styles={subMenuItemStyles}
                        onClick={onUploadFolder}
                    >
                        <Text>{t('OATHeader.importFolder')}</Text>
                    </ActionButton>
                </Callout>
            )}
        </>
    );
};

export default ImportSubMenu;
