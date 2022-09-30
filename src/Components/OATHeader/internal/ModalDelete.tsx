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
import {
    getOntologiesFromStorage,
    saveOntologiesToStorage
} from '../../../Models/Services/OatUtils';
import {
    IModalDeleteProps,
    IModalDeleteStyleProps,
    IModalDeleteStyles
} from './ModalDelete.types';
import { getStyles } from './ModalDelete.styles';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';

const getClassNames = classNamesFunction<
    IModalDeleteStyleProps,
    IModalDeleteStyles
>();

export const ModalDelete: React.FC<IModalDeleteProps> = (props) => {
    const { resetProject, onClose, setModalBody, styles } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageState } = useOatPageContext();

    // styles
    const promptTextStyles = getPromptTextStyles();
    const classNames = getClassNames(styles, { theme: useTheme() });

    const onDelete = () => {
        const files = getOntologiesFromStorage();

        //  Overwrite existing file
        const foundIndex = files.findIndex(
            (file) => file.id === oatPageState.projectName
        );
        if (foundIndex > -1) {
            // Remove file
            files.splice(foundIndex, 1);
            saveOntologiesToStorage(files);
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
                        projectName: oatPageState.projectName
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
