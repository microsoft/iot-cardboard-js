import React, { useCallback, useState } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
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
import ClusterPicker from '../Pickers/ClusterPicker/ClusterPicker';
import DatabasePicker from '../Pickers/DatabasePicker/DatabasePicker';

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
    const isFormValid =
        databaseConnection.databaseName && databaseConnection.clusterUrl;

    // callbacks
    const handleClusterUrlChange = useCallback((clusterUrl: string) => {
        setDatabaseConnection(
            produce((draft) => {
                draft.clusterUrl = clusterUrl;
                draft.databaseName = '';
            })
        );
    }, []);
    const handleDatabaseNameChange = useCallback((databaseName: string) => {
        setDatabaseConnection(
            produce((draft) => {
                draft.databaseName = databaseName;
            })
        );
    }, []);

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
            <ClusterPicker
                selectedClusterUrl={databaseConnection.clusterUrl}
                onClusterUrlChange={handleClusterUrlChange}
                label={t('legionApp.Common.clusterLabel')}
            />
            <DatabasePicker
                selectedDatabaseName={databaseConnection.databaseName}
                onDatabaseNameChange={handleDatabaseNameChange}
                label={t('legionApp.Common.databaseLabel')}
                placeholder={t('legionApp.Common.databasePlaceholder')}
            />
        </CardboardModal>
    );
};

export default styled<
    IStoreFormModalProps,
    IStoreFormModalStyleProps,
    IStoreFormModalStyles
>(StoreFormModal, getStyles);
