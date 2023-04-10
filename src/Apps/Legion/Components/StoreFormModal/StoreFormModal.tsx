import React, { useMemo, useState } from 'react';
import { classNamesFunction, styled, TextField } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IStoreFormModalProps,
    IStoreFormModalStyleProps,
    IStoreFormModalStyles
} from './StoreFormModal.types';
import { getStyles } from './StoreFormModal.styles';
import CardboardModal from '../../../../Components/CardboardModal/CardboardModal';
import { ITargetDatabaseConnection } from '../../Contexts/AppDataContext/AppDataContext.types';
import { useTranslation } from 'react-i18next';
import produce from 'immer';

const debugLogging = false;
const logDebugConsole = getDebugLogger('StoreFormModal', debugLogging);

const getClassNames = classNamesFunction<
    IStoreFormModalStyleProps,
    IStoreFormModalStyles
>();

const EMPTY_DATABASE_CONNECTION: ITargetDatabaseConnection = {
    clusterUrl: '',
    databaseName: ''
};

const StoreFormModal: React.FC<IStoreFormModalProps> = (props) => {
    const { isOpen, onConfirm, onDismiss, styles } = props;

    // contexts

    // state
    const [
        databaseConnection,
        setDatabaseConnection
    ] = useState<ITargetDatabaseConnection>(EMPTY_DATABASE_CONNECTION);

    // hooks
    const { t } = useTranslation();

    // data
    const isFormValid = useMemo(() => {
        return (
            // TODO: Remove Cluster URL after demo since users should not enter this
            databaseConnection.databaseName?.trim().length > 0 &&
            databaseConnection.clusterUrl?.trim().length
        );
    }, [databaseConnection.clusterUrl, databaseConnection.databaseName]);

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render {databaseConnection}', databaseConnection);

    return (
        <CardboardModal
            isOpen={isOpen}
            onDismiss={onDismiss}
            footerPrimaryButtonProps={{
                disabled: !isFormValid,
                onClick: () => {
                    onConfirm({ targetDatabase: databaseConnection });
                },
                text: t('create')
            }}
            styles={classNames.subComponentStyles?.modal}
            title={t('legionApp.StoreListPage.Modal.title')}
        >
            <TextField
                label={t('legionApp.StoreListPage.nameLabel')}
                onChange={(_ev, value) => {
                    setDatabaseConnection(
                        produce((draft) => {
                            draft.databaseName = value;
                        })
                    );
                }}
                placeholder={t('legionApp.StoreListPage.Modal.namePlaceholder')}
                styles={classNames?.subComponentStyles?.formFields}
                value={databaseConnection.databaseName}
            />
            <TextField
                label={t('legionApp.StoreListPage.urlLabel')}
                onChange={(_ev, value) => {
                    setDatabaseConnection(
                        produce((draft) => {
                            draft.clusterUrl = value;
                        })
                    );
                }}
                placeholder={t('legionApp.StoreListPage.Modal.urlPlaceholder')}
                styles={classNames?.subComponentStyles?.formFields}
                value={databaseConnection.clusterUrl}
            />
        </CardboardModal>
    );
};

export default styled<
    IStoreFormModalProps,
    IStoreFormModalStyleProps,
    IStoreFormModalStyles
>(StoreFormModal, getStyles);
