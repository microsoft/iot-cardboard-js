import React, { useState } from 'react';
import {
    TextField,
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack,
    classNamesFunction,
    styled,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { FromBody } from './Enums';
import {
    IFormSaveAsProps,
    IFormSaveAsStyleProps,
    IFormSaveAsStyles
} from './FormSaveAs.types';
import {
    convertDtdlInterfacesToModels,
    getOntologiesFromStorage,
    saveOntologiesToStorage
} from '../../../Models/Services/OatUtils';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { getStyles } from '../OATHeader.styles';

const getClassNames = classNamesFunction<
    IFormSaveAsStyleProps,
    IFormSaveAsStyles
>();

export const FormSaveAs: React.FC<IFormSaveAsProps> = (props) => {
    const {
        onClose,
        setModalBody,
        resetProject,
        resetProjectOnSave,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();

    // context
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [projectName, setProjectName] = useState('');
    const [hasSameNameError, setHasSameNameError] = useState(false);

    // callbacks
    const onSave = () => {
        const files = getOntologiesFromStorage();
        // UI changes to a "confirm" scenario if the name exists, so look up the existing item and update it in that case
        if (hasSameNameError) {
            //  Overwrite existing file
            const foundIndex = files.findIndex(
                (file) => file.name === projectName
            );
            if (foundIndex > -1) {
                files[foundIndex].data = new ProjectData(
                    oatPageState.modelPositions,
                    convertDtdlInterfacesToModels(oatPageState.models),
                    projectName,
                    oatPageState.templates,
                    oatPageState.namespace,
                    oatPageState.modelsMetadata
                );

                saveOntologiesToStorage(files);
            }
            if (resetProjectOnSave) {
                resetProject();
                setModalBody(FromBody.settings);
            }
            return;
        }

        // Create new file
        const newProject = new ProjectData(
            oatPageState.modelPositions,
            convertDtdlInterfacesToModels(oatPageState.models),
            projectName,
            oatPageState.templates,
            oatPageState.namespace,
            oatPageState.modelsMetadata
        );
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_PROJECT,
            payload: newProject
        });

        files.push({
            name: projectName,
            data: newProject
        });
        saveOntologiesToStorage(files);

        onClose();
        setModalBody(null);
        if (resetProjectOnSave) {
            resetProject();
            setModalBody(FromBody.settings);
        }
        return;
    };

    const onProjectNameChange = (value: string) => {
        const files = getOntologiesFromStorage();
        setProjectName(value);

        // Find if project name already exists
        const fileAlreadyExists = files.some((file) => {
            return file.name === value;
        });

        setHasSameNameError(fileAlreadyExists);
    };

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <Stack>
            <div className={classNames.modalRowFlexEnd}>
                <ActionButton onClick={onClose}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={classNames.modalRow}>
                <Text>{t('OATHeader.saveAs')}</Text>
                <TextField
                    placeholder={t('OATHeader.enterAName')}
                    value={projectName}
                    onChange={(e, v) => onProjectNameChange(v)}
                    errorMessage={
                        hasSameNameError ? t('OATHeader.errorSameName') : null
                    }
                />
            </div>

            <div className={classNames.modalRowFlexEnd}>
                <PrimaryButton
                    text={
                        hasSameNameError
                            ? t('OATHeader.overwrite')
                            : t('OATHeader.save')
                    }
                    onClick={onSave}
                    disabled={!projectName}
                />

                <PrimaryButton text={t('OATHeader.cancel')} onClick={onClose} />
            </div>
        </Stack>
    );
};

export default styled<
    IFormSaveAsProps,
    IFormSaveAsStyleProps,
    IFormSaveAsStyles
>(FormSaveAs, getStyles);
