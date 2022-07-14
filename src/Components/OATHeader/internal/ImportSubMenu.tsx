import React from 'react';
import { ActionButton, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getSubMenuItemStyles, getSubMenuStyles } from '../OATHeader.styles';

type ImportSubMenu = {
    setSubMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
    subMenuActive?: boolean;
    targetId?: string;
    uploadFile?: () => void;
    uploadFolder?: () => void;
};

export const ImportSubMenu = ({
    setSubMenuActive,
    subMenuActive,
    targetId,
    uploadFile,
    uploadFolder
}: ImportSubMenu) => {
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
                        <Text>{t('OATHeader.fileUpload')}</Text>
                    </ActionButton>

                    <ActionButton
                        styles={subMenuItemStyles}
                        onClick={onUploadFolder}
                    >
                        <Text>{t('OATHeader.folderUpload')}</Text>
                    </ActionButton>
                </Callout>
            )}
        </>
    );
};

export default ImportSubMenu;
