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
import { SET_OAT_NAMESPACE } from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    state?: IOATEditorState;
}

export const FormSettings = ({
    setModalOpen,
    dispatch,
    setModalBody,
    state
}: IModal) => {
    const { t } = useTranslation();
    const [namespace, setNamespace] = useState(state.namespace);
    const headerStyles = getHeaderStyles();

    const handleProjectNamespaceChange = (value) => {
        setNamespace(value);
    };

    const handleOnSave = () => {
        dispatch({
            type: SET_OAT_NAMESPACE,
            payload: namespace
        });
        setModalBody(null);
        setModalOpen(false);
    };

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={() => setModalOpen(false)}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRow}>
                <Text>{t('OATHeader.namespace')}</Text>
                <TextField
                    placeholder={t('OATHeader.enterANamespace')}
                    value={namespace}
                    onChange={(e, v) => handleProjectNamespaceChange(v)}
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATHeader.save')}
                    onClick={handleOnSave}
                    disabled={!namespace}
                />

                <PrimaryButton
                    text={t('OATHeader.cancel')}
                    onClick={() => setModalOpen(false)}
                />
            </div>
        </Stack>
    );
};

export default FormSettings;
