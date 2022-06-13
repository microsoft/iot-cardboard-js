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
import { SET_OAT_PROJECT } from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';
import { loadFiles, saveFiles } from './Utils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { FromBody } from './Enums';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    resetProject?: () => void;
    resetProjectOnSave?: boolean;
    state?: IOATEditorState;
}

export const FormSaveAs = ({
    dispatch,
    setModalOpen,
    setModalBody,
    resetProject,
    resetProjectOnSave,
    state
}: IModal) => {
    const { t } = useTranslation();
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState(false);
    const headerStyles = getHeaderStyles();
    const { modelPositions, models, templates, namespace } = state;

    const handleOnSave = () => {
        const files = loadFiles();
        if (error) {
            //  Overwrite existing file
            const foundIndex = files.findIndex(
                (file) => file.name === projectName
            );
            if (foundIndex > -1) {
                files[foundIndex].data = new ProjectData(
                    modelPositions,
                    models,
                    '',
                    projectName,
                    templates,
                    namespace
                );

                saveFiles(files);
            }
            if (resetProjectOnSave) {
                resetProject();
                setModalBody(FromBody.settings);
            }
            return;
        }

        // Create new file
        const newProject = new ProjectData(
            modelPositions,
            models,
            '',
            projectName,
            templates,
            namespace
        );
        dispatch({
            type: SET_OAT_PROJECT,
            payload: newProject
        });

        files.push({
            name: projectName,
            data: newProject
        });
        saveFiles(files);

        setModalOpen(false);
        setModalBody(null);
        if (resetProjectOnSave) {
            resetProject();
            setModalBody(FromBody.settings);
        }
        return;
    };

    const handleProjectNameChange = (value) => {
        const files = loadFiles();
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
                            ? t(
                                  'OATHeader.projectWithSameNameAlreadyExistsMessage'
                              )
                            : null
                    }
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={
                        error ? t('OATHeader.overwrite') : t('OATHeader.save')
                    }
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
