import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState
} from 'react';
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
    Label,
    PrimaryButton,
    Spinner,
    SpinnerSize,
    Stack,
    StackItem,
    styled
} from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import CreatableSelect from 'react-select/creatable';
import {
    TableTypeOptions,
    TableTypes,
    TIMESTAMP_COLUMN_NAME
} from '../../../DataPusher/DataPusher.types';
import {
    ICreateDatabaseAdapterParams,
    IGetTableAdapterParams,
    IGetTablesAdapterParams,
    ITable
} from '../../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { ICookAssets } from '../../../../Models/Interfaces';
import useAdapter from '../../../../../../Models/Hooks/useAdapter';
import { ActionMeta } from 'react-select';
import {
    cookSourceTable,
    getViewModelsFromCookedAssets,
    getViewTwinsFromCookedAssets
} from '../../../../Services/DataPusherUtils';
import { getReactSelectStyles } from '../../../../../../Resources/Styles/ReactSelect.styles';
import { useTranslation } from 'react-i18next';
import {
    dateSourceStepReducer,
    defaultDataSourceStepState
} from './DataSourceStep.state';
import { useWizardNavigationContext } from '../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { WizardNavigationContextActionType } from '../../../../Models/Context/WizardNavigationContext/WizardNavigationContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DataSourceStep', debugLogging);

const getClassNames = classNamesFunction<
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>();

const DataSourceStep: React.FC<IDataSourceStepProps> = (props) => {
    const { adapter, styles } = props;
    // state
    const [state, dispatch] = useReducer(
        dateSourceStepReducer,
        defaultDataSourceStepState
    );

    const [adapterResult, setAdapterResult] = useState(null);
    const [cookAssets, setCookAssets] = useState<ICookAssets>(null);

    // contexts
    const { wizardNavigationContextDispatch } = useWizardNavigationContext();

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    const getDatabasesState = useAdapter({
        adapterMethod: () => adapter.getDatabases(),
        refetchDependencies: [adapter]
    });
    const createDatabaseState = useAdapter({
        adapterMethod: (param: ICreateDatabaseAdapterParams) =>
            adapter.createDatabase(param.databaseName),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });
    const getTablesState = useAdapter({
        adapterMethod: (param: IGetTablesAdapterParams) =>
            adapter.getTables(param.databaseName),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });
    const getTableState = useAdapter({
        adapterMethod: (params: IGetTableAdapterParams) =>
            adapter.getTable(
                params.databaseName,
                params.tableName,
                TIMESTAMP_COLUMN_NAME
            ),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });

    // callbacks
    const handleSourceDatabaseChange = useCallback(
        (_event, option: IDropdownOption) => {
            dispatch({
                type: DataSourceStepActionType.SET_SELECTED_SOURCE_DATABASE,
                database: option.text
            });
            // fetch tables of selected database
            getTablesState.callAdapter({
                databaseName: option.text
            });
        },
        [getTablesState]
    );
    const handleTargetDatabaseChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            dispatch({
                type: DataSourceStepActionType.SET_SELECTED_TARGET_DATABASE,
                database: newValue
            });

            if (actionMeta.action === 'create-option') {
                setAdapterResult(null);
                createDatabaseState.callAdapter({
                    databaseName: newValue.label
                });
                dispatch({
                    type: DataSourceStepActionType.SET_TARGET_DATABASE_OPTIONS,
                    options: state.targetDatabaseOptions.concat(newValue)
                });
            }
        },
        [createDatabaseState, state.targetDatabaseOptions]
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
    const handleSourceTableTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            dispatch({
                type: DataSourceStepActionType.SET_SELECTED_SOURCE_TABLE_TYPE,
                tableType: option.key as string
            });
        },
        []
    );
    const handleCookButtonClick = useCallback(() => {
        setCookAssets(
            cookSourceTable(
                `${adapter.connectionString}/${state.selectedSourceDatabase}/${state.selectedSourceTable}`,
                state.sourceTableData,
                state.selectedSourceTwinIDColumn,
                state.selectedSourceTableType as TableTypes
            )
        );
    }, [
        adapter.connectionString,
        state.selectedSourceDatabase,
        state.selectedSourceTable,
        state.sourceTableData,
        state.selectedSourceTwinIDColumn,
        state.selectedSourceTableType
    ]);

    const handleNextClick = () => {
        const viewModels = getViewModelsFromCookedAssets(cookAssets.models);
        const viewTwins = getViewTwinsFromCookedAssets(
            cookAssets.twins,
            viewModels
        );
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.SET_CONNECT_STEP_DATA,
            payload: {
                selectedSourceDatabase: state.selectedSourceDatabase,
                selectedSourceTable: state.selectedSourceTable,
                selectedSourceTwinIDColumn: state.selectedSourceTwinIDColumn,
                selectedSourceTableType: state.selectedSourceTableType,
                selectedTargetDatabase: state.selectedTargetDatabase.label,
                cookedAssets: cookAssets
            }
        });
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.SET_VERIFICATION_STEP_DATA,
            payload: {
                models: viewModels,
                properties: cookAssets.properties,
                twins: viewTwins
            }
        });
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.NAVIGATE_TO,
            payload: { stepNumber: 1 }
        });
    };

    // side effects
    useEffect(() => {
        if (getDatabasesState?.adapterResult?.result) {
            const data = getDatabasesState.adapterResult.getData();
            dispatch({
                type: DataSourceStepActionType.SET_SOURCE_DATABASE_OPTIONS,
                options: data.map((d) => ({ key: d, text: d }))
            });
            dispatch({
                type: DataSourceStepActionType.SET_TARGET_DATABASE_OPTIONS,
                options: data.map((d) => ({ value: d, label: d }))
            });
        }
    }, [getDatabasesState?.adapterResult]);

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

    useEffect(() => {
        if (createDatabaseState?.adapterResult?.result) {
            const data = createDatabaseState.adapterResult.getData();
            setAdapterResult(data);
        }
    }, [createDatabaseState?.adapterResult]);

    // styles
    const classNames = getClassNames(styles, {
        theme
    });
    const selectStyles = useMemo(() => getReactSelectStyles(theme, {}), [
        theme
    ]);

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Stack
                tokens={{ childrenGap: 8 }}
                styles={classNames.subComponentStyles.stack}
            >
                <Dropdown
                    label={t('legionApp.dataPusher.source.database')}
                    onChange={handleSourceDatabaseChange}
                    options={state.sourceDatabaseOptions}
                    placeholder={
                        getDatabasesState.isLoading
                            ? t('loading')
                            : t('legionApp.dataPusher.source.selectDatabase')
                    }
                    selectedKey={state.selectedSourceDatabase}
                />
                <Dropdown
                    label={t('legionApp.dataPusher.source.table')}
                    onChange={handleSourceTableChange}
                    options={state.sourceTableOptions}
                    placeholder={
                        getTablesState.isLoading
                            ? t('loading')
                            : t('legionApp.dataPusher.source.selectTable')
                    }
                    selectedKey={state.selectedSourceTable}
                />
                <Dropdown
                    label={t('legionApp.dataPusher.source.twinIDProperty')}
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
                <Dropdown
                    label={t('legionApp.dataPusher.source.tableType')}
                    onChange={handleSourceTableTypeChange}
                    options={TableTypeOptions}
                    placeholder={t(
                        'legionApp.dataPusher.source.selectTableType'
                    )}
                    defaultSelectedKey={state.selectedSourceTableType}
                />
                <StackItem>
                    <Label>{t('legionApp.dataPusher.target.database')}</Label>
                    <CreatableSelect
                        onChange={handleTargetDatabaseChange}
                        isClearable
                        options={state.targetDatabaseOptions}
                        placeholder={t(
                            'legionApp.dataPusher.target.selectDatabase'
                        )}
                        styles={selectStyles}
                        isLoading={getDatabasesState.isLoading}
                        value={state.selectedTargetDatabase}
                    />
                </StackItem>
                <DefaultButton
                    text={t('legionApp.dataPusher.actions.cook')}
                    disabled={
                        !(
                            state.selectedSourceTable &&
                            state.selectedSourceTwinIDColumn &&
                            state.selectedTargetDatabase
                        )
                    }
                    onClick={handleCookButtonClick}
                />
                <StackItem>
                    {createDatabaseState.isLoading && (
                        <Spinner
                            label={t(
                                'legionApp.dataPusher.progress.createDatabase'
                            )}
                            size={SpinnerSize.small}
                        />
                    )}
                    <p className={classNames.informationText}>
                        {adapterResult ? t('success') : ''}
                    </p>
                </StackItem>
            </Stack>
            {cookAssets && (
                <div className={classNames.informationText}>
                    <p>{`${
                        cookAssets.models.length
                    } possible models found with properties ${cookAssets.models
                        .map((model) => {
                            return `[${model.propertyIds
                                .map(
                                    (propId) =>
                                        cookAssets.properties.find(
                                            (p) => p.id === propId
                                        ).name
                                )
                                .join(',')}]`;
                        })
                        .join(',')}`}</p>
                    <p>{`${
                        cookAssets.properties.length
                    } unique properties found: ${cookAssets.properties
                        .map((p) => p.name)
                        .join(',')}`}</p>
                    <p>{`${
                        cookAssets.twins.length
                    } unique twins found: ${cookAssets.twins
                        .map((t) => t.id)
                        .join(',')}`}</p>
                </div>
            )}
            <PrimaryButton
                text="Next"
                disabled={!cookAssets}
                styles={classNames.subComponentStyles.button()}
                onClick={handleNextClick}
            />
        </div>
    );
};

export default styled<
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>(DataSourceStep, getStyles);
