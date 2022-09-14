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
import { FromBody } from './Enums';
import { loadOatFiles, saveOatFiles } from '../../../Models/Services/OatUtils';
import {
    IModalDeleteProps,
    IModalDeleteStyleProps,
    IModalDeleteStyles
} from './ModalDelete.types';
import { getStyles } from './ModalDelete.styles';

const getClassNames = classNamesFunction<
    IModalDeleteStyleProps,
    IModalDeleteStyles
>();

export const ModalDelete: React.FC<IModalDeleteProps> = (props) => {
    const { resetProject, onClose, setModalBody, state, styles } = props;

    // hooks
    const { t } = useTranslation();

    // styles
    const promptTextStyles = getPromptTextStyles();
    const classNames = getClassNames(styles, { theme: useTheme() });
    const { projectName } = state;

    const onDelete = () => {
        const files = loadOatFiles();

        //  Overwrite existing file
        const foundIndex = files.findIndex((file) => file.name === projectName);
        if (foundIndex > -1) {
            // Remove file
            files.splice(foundIndex, 1);
            saveOatFiles(files);
            resetProject();
            setModalBody(FromBody.settings);
        }
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
                    {t('OATHeader.deleteProjectMessage', {
                        projectName: projectName
                    })}
                </Text>
            </div>

            <div className={classNames.modalRowCenterItem}>
                <PrimaryButton
                    text={t('OATHeader.delete')}
                    onClick={onDelete}
                />

                <PrimaryButton text={t('OATHeader.cancel')} onClick={onClose} />
            </div>
        </Stack>
    );
};

export default styled<
    IModalDeleteProps,
    IModalDeleteStyleProps,
    IModalDeleteStyles
>(ModalDelete, getStyles);
