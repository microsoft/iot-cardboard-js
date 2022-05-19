import React from 'react';
import {
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { IAction } from '../../../Models/Constants/Interfaces';
import {
    OATDataStorageKey,
    OATFilesStorageKey
} from '../../../Models/Constants';
import {
    SET_OAT_PROJECT_NAME,
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_RELOAD_PROJECT
} from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
}

export const ModalSaveCurrentProjectAndClear = ({
    dispatch,
    setModalOpen,
    setModalBody,
    state
}: IModal) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const { projectName } = state;

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

    const handleOnSave = () => {
        const files = JSON.parse(localStorage.getItem(OATFilesStorageKey));

        //  Overwrite existing file
        const foundIndex = files.findIndex((file) => file.name === projectName);
        if (foundIndex > -1) {
            const editorData = JSON.parse(
                localStorage.getItem(OATDataStorageKey)
            );
            files[foundIndex].data = editorData;
            localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));
            setModalOpen(false);
            setModalBody('');
            resetProject();
        }
        setModalBody('saveNewProjectAndClear');
    };

    const handleDoNotSave = () => {
        setModalOpen(false);
        setModalBody('');
        resetProject();
    };

    return (
        <Stack>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <ActionButton onClick={() => setModalOpen(false)}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div>
                <Text>
                    Do you want to save the changes you made to {projectName}
                </Text>
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
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
