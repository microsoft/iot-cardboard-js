import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
    DataSourceStepActionType,
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
} from './DataSourceStep.types';
import { getStyles } from './DataSourceStep.styles';
import {
    classNamesFunction,
    DefaultButton,
    Dropdown,
    IDropdownOption,
    Stack,
    styled,
    TextField
} from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import {
    SourceType,
    SourceTypeOptions,
    TableTypes
} from '../../../DataPusher/DataPusher.types';
import {
    IGetTableAdapterParams,
    IGetTablesAdapterParams,
    ITable
} from '../../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import useAdapter from '../../../../../../Models/Hooks/useAdapter';
import { useTranslation } from 'react-i18next';
import {
    dateSourceStepReducer,
    defaultDataSourceStepState
} from './DataSourceStep.state';
import { useWizardNavigationContext } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { WizardNavigationContextActionType } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { useWizardDataManagementContext } from '../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import { IAppData } from '../../../../Models/Interfaces';
import { WizardDataManagementContextActionType } from '../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext.types';
import { cookSourceTable } from '../../../../Services/DataPusherUtils';
import DatabasePicker from '../../../Pickers/DatabasePicker/DatabasePicker';
import ClusterPicker from '../../../Pickers/ClusterPicker/ClusterPicker';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DataSourceStep', debugLogging);

const getClassNames = classNamesFunction<
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>();

const DataSourceStep: React.FC<IDataSourceStepProps> = (props) => {
    const { styles } = props;
    // state
    const [state, dispatch] = useReducer(
        dateSourceStepReducer,
        defaultDataSourceStepState
    );

    const [appData, setAppData] = useState<IAppData>(null);

    // contexts
    const { wizardNavigationContextDispatch } = useWizardNavigationContext();
    const {
        adapter,
        wizardDataManagementContextDispatch
    } = useWizardDataManagementContext();

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    const getTablesState = useAdapter({
        adapterMethod: (param: IGetTablesAdapterParams) =>
            adapter.getTables(param.databaseName),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });
    const getTableState = useAdapter({
        adapterMethod: (params: IGetTableAdapterParams) =>
            adapter.getTable(params.databaseName, params.tableName),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });

    // callbacks
    const handleSourceTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            dispatch({
                type: DataSourceStepActionType.SET_SELECTED_SOURCE_TYPE,
                sourceType: option.key as SourceType
            });
        },
        []
    );
    const handleSourceClusterChange = useCallback((clusterUrl: string) => {
        dispatch({
            type: DataSourceStepActionType.SET_SELECTED_SOURCE_CLUSTER,
            clusterUrl
        });
        dispatch({
            type: DataSourceStepActionType.SET_SELECTED_SOURCE_DATABASE,
            database: ''
        });
    }, []);
    const handleSourceDatabaseChange = useCallback(
        (databaseName: string) => {
            dispatch({
                type: DataSourceStepActionType.SET_SELECTED_SOURCE_DATABASE,
                database: databaseName
            });
            // fetch tables of selected database
            getTablesState.callAdapter({
                databaseName: databaseName
            });
        },
        [getTablesState]
    );
    const handleSourceTableChange = useCallback(
        (_event, option: IDropdownOption) => {
            dispatch({
                type: DataSourceStepActionType.SET_SELECTED_SOURCE_TABLE,
                table: option.text
            });
            getTableState.callAdapter({
                databaseName: state.selectedSourceDatabase,
                tableName: option.text
            });
        },
        [getTableState, state.selectedSourceDatabase]
    );
    const handleSourceTwinIDColumnChange = useCallback(
        (_event, option: IDropdownOption) => {
            dispatch({
                type:
                    DataSourceStepActionType.SET_SELECTED_SOURCE_TWIN_ID_COLUMN,
                columnName: option.text
            });
        },
        []
    );
    const handleCookButtonClick = useCallback(() => {
        const cookAssets = cookSourceTable(
            `${adapter.connectionString}/${state.selectedSourceDatabase}/${state.selectedSourceTable}`,
            state.sourceTableData,
            state.selectedSourceTwinIDColumn,
            state.selectedSourceTableType as TableTypes
        );
        setAppData(cookAssets);
        dispatch({
            type: DataSourceStepActionType.SET_COOK_ASSETS,
            cookAssets
        });
    }, [
        adapter.connectionString,
        state.selectedSourceDatabase,
        state.selectedSourceTable,
        state.sourceTableData,
        state.selectedSourceTwinIDColumn,
        state.selectedSourceTableType
    ]);

    const handleNextClick = useCallback(() => {
        // Temporary: commit of data into global store in this part until this component's
        // reducer gets merged into global data context
        wizardDataManagementContextDispatch({
            type: WizardDataManagementContextActionType.SET_SOURCE_INFORMATION,
            payload: {
                data: [
                    {
                        selectedSourceCluster: state.selectedSourceCluster,
                        selectedSourceDatabase: state.selectedSourceDatabase,
                        selectedSourceTable: state.selectedSourceTable,
                        selectedSourceTableType: state.selectedSourceTableType,
                        selectedSourceTwinIDColumn:
                            state.selectedSourceTwinIDColumn
                    }
                ]
            }
        });

        wizardDataManagementContextDispatch({
            type: WizardDataManagementContextActionType.SET_INITIAL_ASSETS,
            payload: {
                data: state.cookAssets
            }
        });
        // End of temporary section

        // Navigation only, since all data is updated through other handlers
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.NAVIGATE_TO,
            payload: {
                stepNumber: 1
            }
        });
    }, [
        state.cookAssets,
        state.selectedSourceCluster,
        state.selectedSourceDatabase,
        state.selectedSourceTable,
        state.selectedSourceTableType,
        state.selectedSourceTwinIDColumn,
        wizardDataManagementContextDispatch,
        wizardNavigationContextDispatch
    ]);

    // side effects
    useEffect(() => {
        if (getTablesState?.adapterResult?.result) {
            const data = getTablesState.adapterResult.getData();
            dispatch({
                type: DataSourceStepActionType.SET_SOURCE_TABLE_OPTIONS,
                options: data.map((d) => ({ key: d, text: d }))
            });
        }
    }, [getTablesState?.adapterResult]);

    useEffect(() => {
        if (getTableState?.adapterResult?.result) {
            const data = getTableState.adapterResult.getData() as ITable;
            dispatch({
                type: DataSourceStepActionType.SET_SOURCE_TABLE_DATA,
                tableData: data
            });
        }
    }, [getTableState?.adapterResult]);

    // effects
    useEffect(() => {
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.SET_PRIMARY_ACTION,
            payload: {
                buttonProps: {
                    onClick: handleNextClick,
                    disabled: !appData
                }
            }
        });
    }, [appData, handleNextClick, wizardNavigationContextDispatch]);

    // styles
    const classNames = getClassNames(styles, {
        theme
    });

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <p className={classNames.informationText}>
                {t('legionApp.dataSourceStep.infoText')}
            </p>
            <Stack
                tokens={{ childrenGap: 8 }}
                styles={classNames.subComponentStyles.stack}
            >
                <Dropdown
                    label={t('legionApp.dataPusher.source.type')}
                    onChange={handleSourceTypeChange}
                    options={SourceTypeOptions}
                    placeholder={t(
                        'legionApp.dataPusher.source.typePlaceholder'
                    )}
                    defaultSelectedKey={state.selectedSourceType}
                />
                {state.selectedSourceType === SourceType.Timeseries ? (
                    <>
                        <ClusterPicker
                            isCreatable={false}
                            onClusterUrlChange={handleSourceClusterChange}
                            label={t('legionApp.Common.clusterLabel')}
                            selectedClusterUrl={state.selectedSourceCluster}
                        />
                        <DatabasePicker
                            isCreatable={false}
                            onDatabaseNameChange={handleSourceDatabaseChange}
                            label={t('legionApp.Common.databaseLabel')}
                            placeholder={t(
                                'legionApp.dataPusher.source.selectDatabase'
                            )}
                            selectedDatabaseName={state.selectedSourceDatabase}
                        />
                        <Dropdown
                            required
                            label={t('legionApp.Common.tableLabel')}
                            onChange={handleSourceTableChange}
                            options={state.sourceTableOptions}
                            placeholder={
                                getTablesState.isLoading
                                    ? t('loading')
                                    : t(
                                          'legionApp.dataPusher.source.selectTable'
                                      )
                            }
                            selectedKey={state.selectedSourceTable}
                        />
                        <Dropdown
                            required
                            label={t('legionApp.Common.tableIdColumnLabel')}
                            onChange={handleSourceTwinIDColumnChange}
                            options={state.sourceTableColumnOptions}
                            placeholder={
                                getTableState.isLoading
                                    ? t('loading')
                                    : t(
                                          'legionApp.dataPusher.source.selectTwinIDProperty'
                                      )
                            }
                            selectedKey={state.selectedSourceTwinIDColumn}
                        />
                    </>
                ) : (
                    <TextField
                        label={t('legionApp.Common.urlLabel')}
                        placeholder={t('legionApp.Common.urlPlaceholder')}
                    />
                )}
                <DefaultButton
                    text={t('legionApp.dataPusher.actions.cook')}
                    disabled={
                        !(
                            state.selectedSourceTable &&
                            state.selectedSourceTwinIDColumn
                        )
                    }
                    onClick={handleCookButtonClick}
                />
            </Stack>
            {appData && (
                <div className={classNames.informationText}>
                    <p>{`${
                        appData.models.length
                    } possible models found with properties ${appData.models
                        .map((model) => {
                            return `[${model.propertyIds
                                .map(
                                    (propId) =>
                                        appData.properties.find(
                                            (p) => p.id === propId
                                        ).name
                                )
                                .join(',')}]`;
                        })
                        .join(',')}`}</p>
                    <p>{`${
                        appData.properties.length
                    } unique properties found: ${appData.properties
                        .map((p) => p.name)
                        .join(',')}`}</p>
                    <p>{`${
                        appData.twins.length
                    } unique twins found: ${appData.twins
                        .map((t) => t.id)
                        .join(',')}`}</p>
                </div>
            )}
        </div>
    );
};

export default styled<
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>(DataSourceStep, getStyles);
