import React, { useState, useMemo } from 'react';
import {
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack,
    Dropdown,
    IDropdownOption,
    classNamesFunction,
    styled,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import {
    convertDtdlInterfacesToModels,
    getOntologiesFromStorage
} from '../../../Models/Services/OatUtils';
import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import {
    IFormOpenProps,
    IFormOpenStyleProps,
    IFormOpenStyles
} from './FormOpen.types';
import { getStyles } from './FormOpen.styles';

const getClassNames = classNamesFunction<
    IFormOpenStyleProps,
    IFormOpenStyles
>();

export const FormOpen: React.FC<IFormOpenProps> = (props) => {
    const { onClose, setModalBody, styles } = props;

    // hooks
    const { t } = useTranslation();

    // context
    const { oatPageDispatch } = useOatPageContext();

    // state
    const [selectedFile, setSelectedFile] = useState<IOATFile>(null);

    // data
    const formattedFiles = useMemo(() => getFormatFilesToDropDownOptions(), []);

    // callbacks
    const onOpen = () => {
        const projectToOpen = new ProjectData(
            selectedFile.data.modelPositions,
            convertDtdlInterfacesToModels(selectedFile.data.models),
            selectedFile.data.projectName,
            selectedFile.data.templates,
            selectedFile.data.namespace,
            selectedFile.data.modelsMetadata
        );
        oatPageDispatch({
            type: OatPageContextActionType.SET_CURRENT_PROJECT,
            payload: projectToOpen
        });

        onClose();
        setModalBody(null);
    };

    const getFormatFilesToDropDownOptions = () => {
        const storedFiles = getOntologiesFromStorage();
        if (storedFiles.length > 0) {
            const formattedFiles: IDropdownOption<IOATFile>[] = storedFiles.map(
                (file) => {
                    return {
                        key: file.id,
                        text: file.id,
                        data: file
                    };
                }
            );

            return formattedFiles;
        }
        return [];
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
                <Text>{`${t('OATHeader.fileOpenModal.dropdownLabel')}:`}</Text>
                <Dropdown
                    placeholder={t(
                        'OATHeader.fileOpenModal.dropdownPlaceholder'
                    )}
                    options={formattedFiles}
                    onChange={(_ev, option) => setSelectedFile(option.data)}
                />
            </div>

            <div className={classNames.modalRowFlexEnd}>
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

export default styled<IFormOpenProps, IFormOpenStyleProps, IFormOpenStyles>(
    FormOpen,
    getStyles
);
