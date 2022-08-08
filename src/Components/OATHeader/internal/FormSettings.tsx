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
import { SET_OAT_NAMESPACE } from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';
import { FormSettingsProps } from './FormSettings.types';

export const FormSettings = ({
    dispatch,
    setModalBody,
    onClose,
    state
}: FormSettingsProps) => {
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
        onClose();
    };

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={onClose}>
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

                <PrimaryButton text={t('OATHeader.cancel')} onClick={onClose} />
            </div>
        </Stack>
    );
};

export default FormSettings;
