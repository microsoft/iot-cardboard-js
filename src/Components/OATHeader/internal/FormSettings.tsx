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
import { OATNamespaceDefaultValue } from '../../../Models/Constants/Constants';

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

    const handleProjectNamespaceChange = (value) => {
        // Validate value contains only letters, digits, and underscores. The first character may not be a digit, and the last character may not be an underscore.
        const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        if (
            (value.match(regex) && value.charAt(value.length - 1) !== '_') ||
            value.length === 0
        ) {
            setNamespaceError(false);
        } else {
            setNamespaceError(true);
        }
        setNamespace(value);
    };

    const handleOnSave = () => {
        // If namespace is not provided revert to default value
        let commitValue = namespace;
        if (!namespace) {
            commitValue = OATNamespaceDefaultValue;
        }

        dispatch({
            type: SET_OAT_NAMESPACE,
            payload: commitValue
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
                    errorMessage={
                        namespaceError ? t('OATHeader.errorNamespace') : null
                    }
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATHeader.save')}
                    onClick={handleOnSave}
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
