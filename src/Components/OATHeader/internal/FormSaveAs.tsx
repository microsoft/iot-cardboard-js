import React, { useState } from 'react';
import {
    TextField,
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
import { SET_OAT_PROJECT_NAME } from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    resetProject?: () => void;
    resetProjectOnSave?: boolean;
}

export const FormSaveAs = ({
    dispatch,
    setModalOpen,
    setModalBody,
    resetProject,
    resetProjectOnSave
}: IModal) => {
    const { t } = useTranslation();
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState(false);
    const headerStyles = getHeaderStyles();

    const handleOnSave = () => {
        const editorData = JSON.parse(localStorage.getItem(OATDataStorageKey));
        const files = JSON.parse(localStorage.getItem(OATFilesStorageKey));

        if (error) {
            //  Overwrite existing file
            const foundIndex = files.findIndex(
                (file) => file.name === projectName
            );
            if (foundIndex > -1) {
                files[foundIndex].data = editorData;
                localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));
            }
            setModalOpen(false);
            setModalBody('');
            if (resetProjectOnSave) {
                resetProject();
            }
            return;
        }

        // Create new file
        dispatch({
            type: SET_OAT_PROJECT_NAME,
            payload: projectName
        });

        files.push({
            name: projectName,
            data: editorData
        });
        editorData.projectName = projectName;
        localStorage.setItem(OATDataStorageKey, JSON.stringify(editorData));
        localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));

        setModalOpen(false);
        setModalBody('');
        if (resetProjectOnSave) {
            resetProject();
        }
        return;
    };

    const handleProjectNameChange = (value) => {
        const files = JSON.parse(localStorage.getItem(OATFilesStorageKey));
        setProjectName(value);

        // Find if project name already exists
        const fileAlreadyExists = files.some((file) => {
            return file.name === value;
        });

        if (fileAlreadyExists) {
            setError(true);
            return;
        }
        setError(false);
    };

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={() => setModalOpen(false)}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRow}>
                <Text>{t('OATHeader.saveAs')}</Text>
                <TextField
                    placeholder={t('OATHeader.enterAName')}
                    value={projectName}
                    onChange={(e, v) => handleProjectNameChange(v)}
                    errorMessage={
                        error
                            ? 'Project with same name already exists, would you like to override'
                            : null
                    }
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={error ? 'Overwrite' : t('OATHeader.save')}
                    onClick={handleOnSave}
                    disabled={!projectName}
                />

                <PrimaryButton
                    text={t('OATHeader.cancel')}
                    onClick={() => setModalOpen(false)}
                />
            </div>
        </Stack>
    );
};

export default FormSaveAs;
