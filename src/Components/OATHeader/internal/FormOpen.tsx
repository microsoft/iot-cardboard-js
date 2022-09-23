import React, { useState, useMemo } from 'react';
import {
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack,
    Dropdown,
    IDropdownOption
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
import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    onClose?: () => void;
}

export const FormOpen = ({ dispatch, setModalBody, onClose }: IModal) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const [selectedFile, setSelectedFile] = useState<IOATFile>(null);

    const onOpen = () => {
        const projectToOpen = new ProjectData(
            selectedFile.data.modelPositions,
            convertDtdlInterfacesToModels(selectedFile.data.models),
            selectedFile.data.projectName,
            selectedFile.data.templates,
            selectedFile.data.namespace,
            selectedFile.data.modelsMetadata
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
            const formattedFiles: IDropdownOption<IOATFile>[] = storedFiles.map(
                (file) => {
                    return {
                        key: file.name,
                        text: file.name,
                        data: file
                    };
                }
            );

            return formattedFiles;
        }
        return [];
    };

    const formattedFiles = useMemo(() => getFormatFilesToDropDownOptions(), []);

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={onClose}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRow}>
                <Text>{`${t('OATHeader.fileOpenModal.dropdownLabel')}:`}</Text>
                <Dropdown
                    placeholder={t(
                        'OATHeader.fileOpenModal.dropdownPlaceholder'
                    )}
                    options={formattedFiles}
                    onChange={(_ev, option) => setSelectedFile(option.data)}
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
