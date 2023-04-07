import React from 'react';
import { IStoreListPageProps } from './StoreListPage.types';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import StoreList from '../../Components/StoreList/StoreList';
import { CommandBar, ICommandBarItemProps, Stack } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getStyles } from './StoreListPage.styles';
import { useAppNavigationContext } from '../../Contexts/NavigationContext/AppNavigationContext';
import { useAppDataContext } from '../../Contexts/AppDataContext/AppDataContext';
import { AppDataContextActionType } from '../../Contexts/AppDataContext/AppDataContext.types';
import {
    AppNavigationContextActionType,
    AppPageName
} from '../../Contexts/NavigationContext/AppNavigationContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('StoreListPage', debugLogging);

const StoreListPage: React.FC<IStoreListPageProps> = () => {
    // contexts
    const { appNavigationDispatch } = useAppNavigationContext();
    const { appDataDispatch, appDataState } = useAppDataContext();

    // state

    // hooks
    const { t } = useTranslation();

    // data
    const commandbarItems: ICommandBarItemProps[] = [
        {
            key: 'addNew',
            text: t('legionApp.StoreListPage.createStoreButtonText'),
            iconProps: { iconName: 'Add' }
        }
    ];

    // callbacks

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
                    onNavigateNext={(args) => {
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
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default StoreListPage;
