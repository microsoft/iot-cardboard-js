import React, { useState } from 'react';
import {
    TextField,
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
import {
    FormSettingsProps,
    FormSettingsStyleProps,
    FormSettingsStyles
} from './FormSettings.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { getStyles } from './FormSettings.styles';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

const getClassNames = classNamesFunction<
    FormSettingsStyleProps,
    FormSettingsStyles
>();

export const FormSettings: React.FC<FormSettingsProps> = (props) => {
    const { setModalBody, onClose, styles } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [namespace, setNamespace] = useState(oatPageState.namespace);
    const [namespaceError, setNamespaceError] = useState(false);

    // callbacks
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
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_NAMESPACE,
            payload: { namespace }
        });
        setModalBody(null);
        onClose();
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

            <div className={classNames.modalRowFlexEnd}>
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

export default styled<
    FormSettingsProps,
    FormSettingsStyleProps,
    FormSettingsStyles
>(FormSettings, getStyles);
