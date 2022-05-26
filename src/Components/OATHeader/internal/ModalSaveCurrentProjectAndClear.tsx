import React from 'react';
import {
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { OATDataStorageKey } from '../../../Models/Constants';
import { getHeaderStyles, getPromptTextStyles } from '../OATHeader.styles';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { loadFiles, saveFiles } from './Utils';

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
    const { project } = state;

    const handleOnSave = () => {
        const files = loadFiles();

        //  Overwrite existing file
        const foundIndex = files.findIndex(
            (file) => file.name === project.projectName
        );
        if (foundIndex > -1) {
            const editorData = JSON.parse(
                localStorage.getItem(OATDataStorageKey)
            );
            files[foundIndex].data = editorData;
            saveFiles(files);
            setModalOpen(false);
            setModalBody(null);
            resetProject();
        }
        setModalBody('saveNewProjectAndClear');
    };

    const handleDoNotSave = () => {
        setModalOpen(false);
        setModalBody(null);
        resetProject();
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
                    {`${t('OATHeader.doYouWantToSaveChangesYouMadeTo')} ${
                        project.projectName
                    }?`}
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
