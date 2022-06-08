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
import { DTDLNameRegex } from '../../../Models/Constants/Constants';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
}

export const FormSettings = ({
    setModalOpen,
    dispatch,
    setModalBody
}: IModal) => {
    const { t } = useTranslation();
    const [namespace, setNamespace] = useState('');
    const [error, setError] = useState(false);
    const headerStyles = getHeaderStyles();

    const handleProjectNamespaceChange = (value) => {
        //  The name may only contain the characters a-z, A-Z, 0-9, and underscore.
        if (DTDLNameRegex.test(value)) {
            setNamespace(value);
            setError(null);
        } else {
            setError(true);
        }
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
                    errorMessage={error ? t('OATHeader.namespaceError') : null}
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={
                        error ? t('OATHeader.overwrite') : t('OATHeader.save')
                    }
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
