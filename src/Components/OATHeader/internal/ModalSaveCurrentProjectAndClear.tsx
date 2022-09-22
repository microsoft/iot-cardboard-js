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
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { FromBody } from './Enums';
import { ModalSaveCurrentProjectAndClearProps } from './ModalSaveCurrentProjectAndClear.types';
import {
    convertDtdlInterfacesToModels,
    loadOatFiles,
    saveOatFiles
} from '../../../Models/Services/OatUtils';

export const ModalSaveCurrentProjectAndClear = ({
    resetProject,
    setModalBody,
    state,
    onClose
}: ModalSaveCurrentProjectAndClearProps) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const promptTextStyles = getPromptTextStyles();
    const {
        projectName,
        models,
        modelPositions,
        templates,
        namespace,
        modelsMetadata
    } = state;

    const onSave = () => {
        const files = loadOatFiles();

        //  Overwrite existing file
        const foundIndex = files.findIndex((file) => file.name === projectName);
        if (foundIndex > -1) {
            const project = new ProjectData(
                modelPositions,
                convertDtdlInterfacesToModels(models),
                projectName,
                templates,
                namespace,
                modelsMetadata
            );

            files[foundIndex].data = project;
            saveOatFiles(files);
            resetProject();
            setModalBody(FromBody.settings);
        }
        setModalBody('saveNewProjectAndClear');
    };

    const onDoNotSave = () => {
        resetProject();
        setModalBody(FromBody.settings);
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
                    {t('OATHeader.doYouWantToSaveChangesYouMadeTo', {
                        projectName: projectName
                    })}
                </Text>
            </div>

            <div className={headerStyles.modalRowCenterItem}>
                <PrimaryButton text={t('OATHeader.save')} onClick={onSave} />

                <PrimaryButton
                    text={t('OATHeader.dontSave')}
                    onClick={onDoNotSave}
                />

                <PrimaryButton text={t('OATHeader.cancel')} onClick={onClose} />
            </div>
        </Stack>
    );
};

export default ModalSaveCurrentProjectAndClear;
