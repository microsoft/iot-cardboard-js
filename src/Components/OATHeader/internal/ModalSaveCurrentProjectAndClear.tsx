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
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { loadFiles, saveFiles } from './Utils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { FromBody } from './Enums';

interface IModal {
    resetProject?: () => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
}

export const ModalSaveCurrentProjectAndClear = ({
    resetProject,
    setModalOpen,
    setModalBody,
    state
}: IModal) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const promptTextStyles = getPromptTextStyles();
    const { projectName, models, modelPositions, templates, namespace } = state;

    const handleOnSave = () => {
        const files = loadFiles();

        //  Overwrite existing file
        const foundIndex = files.findIndex((file) => file.name === projectName);
        if (foundIndex > -1) {
            const project = new ProjectData(
                modelPositions,
                models,
                '',
                projectName,
                templates,
                namespace
            );

            files[foundIndex].data = project;
            saveFiles(files);
            resetProject();
            setModalBody(FromBody.settings);
        }
        setModalBody('saveNewProjectAndClear');
    };

    const handleDoNotSave = () => {
        resetProject();
        setModalBody(FromBody.settings);
    };

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={() => setModalOpen(false)}>
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
                <PrimaryButton
                    text={t('OATHeader.save')}
                    onClick={handleOnSave}
                />

                <PrimaryButton
                    text={t('OATHeader.dontSave')}
                    onClick={handleDoNotSave}
                />

                <PrimaryButton
                    text={t('OATHeader.cancel')}
                    onClick={() => setModalOpen(false)}
                />
            </div>
        </Stack>
    );
};

export default ModalSaveCurrentProjectAndClear;
