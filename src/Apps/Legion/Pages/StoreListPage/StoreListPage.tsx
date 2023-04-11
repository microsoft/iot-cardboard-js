import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar, ICommandBarItemProps, Stack } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { IStoreListPageProps } from './StoreListPage.types';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import StoreList from '../../Components/StoreList/StoreList';
import { getStyles } from './StoreListPage.styles';
import { useAppNavigationContext } from '../../Contexts/NavigationContext/AppNavigationContext';
import { useAppDataContext } from '../../Contexts/AppDataContext/AppDataContext';
import {
    AppDataContextActionType,
    ITargetDatabaseConnection
} from '../../Contexts/AppDataContext/AppDataContext.types';
import {
    AppNavigationContextActionType,
    AppPageName
} from '../../Contexts/NavigationContext/AppNavigationContext.types';
import StoreFormModal from '../../Components/StoreFormModal/StoreFormModal';
import LocalStorageManager from '../../Services/LocalStorageManager';

const debugLogging = false;
const logDebugConsole = getDebugLogger('StoreListPage', debugLogging);

const StoreListPage: React.FC<IStoreListPageProps> = () => {
    // contexts
    const { appNavigationDispatch } = useAppNavigationContext();
    const { appDataDispatch, appDataState } = useAppDataContext();

    // state
    const [
        isFormOpen,
        { setTrue: setIsFormOpenTrue, setFalse: setIsFormOpenFalse }
    ] = useBoolean(false);

    // hooks
    const { t } = useTranslation();

    // data
    const commandbarItems: ICommandBarItemProps[] = [
        {
            key: 'addNew',
            text: t('legionApp.StoreListPage.createStoreButtonText'),
            iconProps: { iconName: 'Add' },
            onClick: setIsFormOpenTrue
        }
    ];

    // callbacks
    const createNewGraph = useCallback(
        (args: { targetDatabase: ITargetDatabaseConnection }) => {
            LocalStorageManager.AddTargetGraphStore(args.targetDatabase);
        },
        []
    );
    const onNavigateNext = useCallback(
        (args: { targetDatabase: ITargetDatabaseConnection }) => {
            appDataDispatch({
                type: AppDataContextActionType.SET_TARGET_DATABASE,
                payload: { targetDatabase: args.targetDatabase }
            });
            appNavigationDispatch({
                type: AppNavigationContextActionType.NAVIGATE_TO,
                payload: {
                    pageName: AppPageName.FlowPicker
                }
            });
        },
        [appDataDispatch, appNavigationDispatch]
    );

    // side effects

    // styles
    const classNames = getStyles();
    logDebugConsole('debug', 'Render');

    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <h2 className={classNames.header}>
                {t('legionApp.StoreListPage.title')}
            </h2>
            <Stack>
                <CommandBar items={commandbarItems} />
                <StoreList
                    initialTargetDatabase={appDataState.targetDatabase}
                    onNavigateNext={onNavigateNext}
                />
                <StoreFormModal
                    isOpen={isFormOpen}
                    onDismiss={setIsFormOpenFalse}
                    onConfirm={(args) => {
                        setIsFormOpenFalse();
                        createNewGraph(args);
                        onNavigateNext(args);
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default StoreListPage;
