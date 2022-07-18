import React, { useState } from 'react';
import {
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack,
    Dropdown
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { IAction } from '../../../Models/Constants/Interfaces';
import { SET_OAT_PROJECT } from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { loadFiles } from '../../../Models/Services/Utils';
interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    onClose?: () => void;
}

export const FormOpen = ({ dispatch, setModalBody, onClose }: IModal) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const [selectedFile, setSelectedFile] = useState(null);

    const onOpen = () => {
        const projectToOpen = new ProjectData(
            selectedFile.key.modelPositions,
            selectedFile.key.models,
            selectedFile.key.projectName,
            selectedFile.key.templates,
            selectedFile.key.namespace,
            selectedFile.key.modelsMetadata
        );
        dispatch({
            type: SET_OAT_PROJECT,
            payload: projectToOpen
        });

        onClose();
        setModalBody(null);
    };

    const getFormatFilesToDropDownOptions = () => {
        const storedFiles = loadFiles();
        if (storedFiles.length > 0) {
            const formattedFiles = storedFiles.map((file) => {
                return {
                    key: file.data,
                    text: file.name
                };
            });

            return formattedFiles;
        }
    };

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={onClose}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRow}>
                <Text>{`${t('OATHeader.Select file')}:`}</Text>
                <Dropdown
                    placeholder={t('OATHeader.files')}
                    options={getFormatFilesToDropDownOptions()}
                    onChange={(_ev, option) => setSelectedFile(option)}
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATHeader.open')}
                    onClick={onOpen}
                    disabled={!selectedFile}
                />

                <PrimaryButton text={t('OATHeader.cancel')} onClick={onClose} />
            </div>
        </Stack>
    );
};

export default FormOpen;
