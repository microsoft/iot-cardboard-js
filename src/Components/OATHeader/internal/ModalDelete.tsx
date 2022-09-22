import React from 'react';
import {
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles, getPromptTextStyles } from '../OATHeader.styles';
import { FromBody } from './Enums';
import { loadOatFiles, saveOatFiles } from '../../../Models/Services/OatUtils';
import { ModalDeleteProps } from './ModalDelete.types';

export const ModalDelete = ({
    resetProject,
    onClose,
    setModalBody,

    state
}: ModalDeleteProps) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const promptTextStyles = getPromptTextStyles();
    const { projectName } = state;

    const onDelete = () => {
        const files = loadOatFiles();

        //  Overwrite existing file
        const foundIndex = files.findIndex((file) => file.name === projectName);
        if (foundIndex > -1) {
            // Remove file
            files.splice(foundIndex, 1);
            saveOatFiles(files);
            resetProject();
            setModalBody(FromBody.settings);
        }
    };

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={onClose}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRowCenterItem}>
                <Text styles={promptTextStyles}>
                    {t('OATHeader.deleteProjectMessage', {
                        projectName: projectName
                    })}
                </Text>
            </div>

            <div className={headerStyles.modalRowCenterItem}>
                <PrimaryButton
                    text={t('OATHeader.delete')}
                    onClick={onDelete}
                />

                <PrimaryButton text={t('OATHeader.cancel')} onClick={onClose} />
            </div>
        </Stack>
    );
};

export default ModalDelete;
