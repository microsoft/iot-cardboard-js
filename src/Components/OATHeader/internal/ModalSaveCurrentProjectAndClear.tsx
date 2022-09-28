import React from 'react';
import {
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
import { getPromptTextStyles } from '../OATHeader.styles';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { FromBody } from './Enums';
import {
    convertDtdlInterfacesToModels,
    loadOatFiles,
    saveOatFiles
} from '../../../Models/Services/OatUtils';
import {
    IModalSaveCurrentProjectAndClearProps,
    IModalSaveCurrentProjectAndClearStyleProps,
    IModalSaveCurrentProjectAndClearStyles
} from './ModalSaveCurrentProjectAndClear.types';
import { getStyles } from './ModalSaveCurrentProjectAndClear.styles';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';

const getClassNames = classNamesFunction<
    IModalSaveCurrentProjectAndClearStyleProps,
    IModalSaveCurrentProjectAndClearStyles
>();

export const ModalSaveCurrentProjectAndClear: React.FC<IModalSaveCurrentProjectAndClearProps> = (
    props
) => {
    const { resetProject, setModalBody, styles, onClose } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageState } = useOatPageContext();

    // styles
    const classNames = getClassNames(styles, { theme: useTheme() });
    const promptTextStyles = getPromptTextStyles();

    const onSave = () => {
        const files = loadOatFiles();

        //  Overwrite existing file
        const foundIndex = files.findIndex(
            (file) => file.name === oatPageState.projectName
        );
        if (foundIndex > -1) {
            const project = new ProjectData(
                oatPageState.modelPositions,
                convertDtdlInterfacesToModels(oatPageState.models),
                oatPageState.projectName,
                oatPageState.templates,
                oatPageState.namespace,
                oatPageState.modelsMetadata
            );

            files[foundIndex].data = project;
            saveOatFiles(files);
            resetProject();
            setModalBody(FromBody.settings);
        }
        setModalBody('saveNewProjectAndClear');
    };

    const onDoNotSave = () => {
        resetProject();
        setModalBody(FromBody.settings);
    };

    return (
        <Stack>
            <div className={classNames.modalRowFlexEnd}>
                <ActionButton onClick={onClose}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={classNames.modalRowCenterItem}>
                <Text styles={promptTextStyles}>
                    {t('OATHeader.doYouWantToSaveChangesYouMadeTo', {
                        projectName: oatPageState.projectName
                    })}
                </Text>
            </div>

            <div className={classNames.modalRowCenterItem}>
                <PrimaryButton text={t('OATHeader.save')} onClick={onSave} />

                <PrimaryButton
                    text={t('OATHeader.dontSave')}
                    onClick={onDoNotSave}
                />

                <PrimaryButton text={t('OATHeader.cancel')} onClick={onClose} />
            </div>
        </Stack>
    );
};

export default styled<
    IModalSaveCurrentProjectAndClearProps,
    IModalSaveCurrentProjectAndClearStyleProps,
    IModalSaveCurrentProjectAndClearStyles
>(ModalSaveCurrentProjectAndClear, getStyles);
