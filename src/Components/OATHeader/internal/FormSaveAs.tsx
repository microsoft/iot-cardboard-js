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
import { SET_OAT_PROJECT } from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { FromBody } from './Enums';
import { loadFiles, saveFiles } from '../../../Models/Services/Utils';
import { FromSaveAsProps } from './FormSaveAs.types';

export const FormSaveAs = ({
    dispatch,
    onClose,
    setModalBody,
    resetProject,
    resetProjectOnSave,
    state
}: FromSaveAsProps) => {
    const { t } = useTranslation();
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState(false);
    const headerStyles = getHeaderStyles();
    const {
        modelPositions,
        models,
        templates,
        namespace,
        modelsMetadata
    } = state;

    const onSave = () => {
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
                    projectName,
                    templates,
                    namespace,
                    modelsMetadata
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
            projectName,
            templates,
            namespace,
            modelsMetadata
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

        onClose();
        setModalBody(null);
        if (resetProjectOnSave) {
            resetProject();
            setModalBody(FromBody.settings);
        }
        return;
    };

    const onProjectNameChange = (value: string) => {
        const files = loadFiles();
        setProjectName(value);

        // Find if project name already exists
        const fileAlreadyExists = files.some((file) => {
            return file.name === value;
        });

        setError(fileAlreadyExists);
    };

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={onClose}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRow}>
                <Text>{t('OATHeader.saveAs')}</Text>
                <TextField
                    placeholder={t('OATHeader.enterAName')}
                    value={projectName}
                    onChange={(e, v) => onProjectNameChange(v)}
                    errorMessage={error ? t('OATHeader.errorSameName') : null}
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={
                        error ? t('OATHeader.overwrite') : t('OATHeader.save')
                    }
                    onClick={onSave}
                    disabled={!projectName}
                />

                <PrimaryButton text={t('OATHeader.cancel')} onClick={onClose} />
            </div>
        </Stack>
    );
};

export default FormSaveAs;
