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
    const [namespaceError, setNamespaceError] = useState(false);
    const headerStyles = getHeaderStyles();

    const onProjectNamespaceChange = (value: string) => {
        // Validate value contains only letters, digits, colons and underscores. The first character may not be a digit
        const regex = /^[a-zA-Z_][a-zA-Z0-9_:]*$/;
        const validValue =
            (value.match(regex) &&
                value.charAt(value.length - 1) !== '_' && // Last character may not be an underscore
                value.charAt(value.length - 1) !== ':' && // The last character may not be a colon
                value.indexOf('::') === -1) || // The value may not contain two consecutive colons
            value.length === 0;

        setNamespaceError(!validValue);
        setNamespace(value);
    };

    const onSave = () => {
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
                    onChange={(e, v) => onProjectNamespaceChange(v)}
                    errorMessage={
                        namespaceError ? t('OATHeader.errorNamespace') : null
                    }
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATHeader.save')}
                    onClick={onSave}
                    disabled={namespaceError}
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
