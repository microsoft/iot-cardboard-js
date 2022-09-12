import React, { useState, useMemo, useEffect } from 'react';
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
import {
    convertDtdlInterfacesToModels,
    loadOatFiles
} from '../../../Models/Services/OatUtils';
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
            convertDtdlInterfacesToModels(selectedFile.key.models),
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
        const storedFiles = loadOatFiles();
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

    const formattedFiles = useMemo(() => getFormatFilesToDropDownOptions(), []);

    useEffect(() => {
        if (formattedFiles.length > 0) {
            setSelectedFile(formattedFiles[0]);
        }
    }, [formattedFiles]);

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={onClose}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRow}>
                <Text>{`${t('OATHeader.selectFile')}:`}</Text>
                <Dropdown
                    placeholder={t('OATHeader.files')}
                    options={formattedFiles}
                    onChange={(_ev, option) => setSelectedFile(option)}
                    defaultSelectedKey={formattedFiles[0].key}
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
