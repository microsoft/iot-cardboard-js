import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    DetailsList,
    Dropdown,
    IColumn,
    IDropdownOption,
    Label,
    PrimaryButton,
    ProgressIndicator,
    SelectionMode,
    Spinner,
    SpinnerSize,
    Stack,
    StackItem,
    TextField
} from '@fluentui/react';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import {
    ICreateDatabaseAdapterParams,
    ICreateTableAdapterParams,
    IGetTableAdapterParams,
    IGetTablesAdapterParams,
    IIngestRow,
    ITable,
    IUpsertTableAdapterParams
} from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { useDataPusherContext } from '../DataPusher';
import { useTranslation } from 'react-i18next';
import {
    INGESTION_MAPPING_NAME,
    IReactSelectOption,
    TableColumns,
    TableTypeOptions,
    TableTypes,
    TIMESTAMP_COLUMN_NAME
} from '../DataPusher.types';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta } from 'react-select';
import { getReactSelectStyles } from '../../../../../Resources/Styles/ReactSelect.styles';
import { useExtendedTheme } from '../../../../../Models/Hooks/useExtendedTheme';
import TooltipCallout from '../../../../../Components/TooltipCallout/TooltipCallout';

const DEFAULT_INGESTION_FREQUENCY_IN_SEC = 5;
const MIN_INGESTION_FREQUENCY_IN_SEC = 1;

const Ingest: React.FC = () => {
    const { adapter, classNames } = useDataPusherContext();

    // state
    const [databaseOptions, setDatabaseOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [tableOptions, setTableOptions] = useState<Array<IDropdownOption>>(
        []
    );
    const [
        selectedDatabase,
        setSelectedDatabase
    ] = useState<IReactSelectOption>(null);
    const [selectedTable, setSelectedTable] = useState<IReactSelectOption>(
        null
    );
    const [selectedTableType, setSelectedTableType] = useState<string>(
        TableTypes.Wide
    );
    const [selectedFrequency, setSelectedFrequency] = useState<number>(
        DEFAULT_INGESTION_FREQUENCY_IN_SEC
    );
    const [tableData, setTableData] = useState<ITable>(null);
    const [isIngesting, setIsIngesting] = useState(false);

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    const ingestionRef = useRef(null);
    const numberOfRowsBeforeIngestionRef = useRef(null);
    const tableColumns = useMemo<Array<IColumn>>(
        () =>
            tableData?.Columns.map((c, idx) => ({
                key: c.columnName,
                name: c.columnName,
                minWidth: 20,
                maxWidth: 100,
                isResizable: true,
                isCollapsible: true,
                onRender: (item) => item[idx]
            })) || [],
        [tableData]
    );

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

    const createTableState = useAdapter({
        adapterMethod: (params: ICreateTableAdapterParams) =>
            adapter.createTable(
                params.databaseName,
                params.tableName,
                params.columns,
                INGESTION_MAPPING_NAME
            ),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });

    const upsertTableState = useAdapter({
        adapterMethod: (params: IUpsertTableAdapterParams) =>
            adapter.upsertTable(
                params.databaseName,
                params.tableName,
                params.rows,
                INGESTION_MAPPING_NAME
            ),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });

    // callbacks
    const handleDatabaseChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedDatabase(newValue);
            setTableOptions([]);
            setSelectedTable(null);
            setTableData(null);
            if (actionMeta.action === 'create-option') {
                createDatabaseState.callAdapter({
                    databaseName: newValue.label
                });
                setDatabaseOptions(databaseOptions.concat(newValue));
            } else {
                // fetch tables of selected database
                getTablesState.callAdapter({
                    databaseName: newValue.label
                });
            }
        },
        [createDatabaseState, databaseOptions, getTablesState]
    );

    const handleTableTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedTableType(option.key as string);
        },
        []
    );

    const handleTableChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedTable(newValue);
            setTableData(null);
            if (actionMeta.action === 'create-option') {
                createTableState.callAdapter({
                    databaseName: selectedDatabase.label,
                    tableName: newValue.label,
                    columns: TableColumns[selectedTableType]
                });
                setTableOptions(tableOptions.concat(newValue));
            } else {
                setSelectedTableType(null);
                getTableState.callAdapter({
                    databaseName: selectedDatabase.label,
                    tableName: newValue.label
                });
            }
        },
        [
            createTableState,
            getTableState,
            selectedDatabase,
            selectedTableType,
            tableOptions
        ]
    );

    const ingestData = useCallback(() => {
        let dataToIngest: Array<IIngestRow> = [];
        switch (selectedTableType) {
            case TableTypes.Wide:
                dataToIngest = [
                    {
                        ID: 'Past_1',
                        Timestamp: new Date().toISOString(),
                        Temperature: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Past_1',
                        Timestamp: new Date().toISOString(),
                        Pressure: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Salt_1',
                        Timestamp: new Date().toISOString(),
                        FanSpeed: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Salt_1',
                        Timestamp: new Date().toISOString(),
                        FlowRate: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Past_2',
                        Timestamp: new Date().toISOString(),
                        Temperature: Math.floor(Math.random() * 100),
                        Pressure: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Dryer_1',
                        Timestamp: new Date().toISOString(),
                        Pressure: Math.floor(Math.random() * 100),
                        FanSpeed: Math.floor(Math.random() * 100)
                    }
                ];
                break;
            case TableTypes.Narrow:
                dataToIngest = [
                    {
                        ID: 'Past_1',
                        Timestamp: new Date().toISOString(),
                        PropertyName: 'Temperature',
                        Value: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Salt_1',
                        Timestamp: new Date().toISOString(),
                        PropertyName: 'FanSpeed',
                        Value: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Past_1',
                        Timestamp: new Date().toISOString(),
                        PropertyName: 'Pressure',
                        Value: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Salt_1',
                        Timestamp: new Date().toISOString(),
                        PropertyName: 'FlowRate',
                        Value: Math.floor(Math.random() * 100)
                    }
                ];
                break;
            case TableTypes.Tags:
                dataToIngest = [
                    {
                        ID: 'Past_1',
                        Timestamp: new Date().toISOString(),
                        Value: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Salt_1',
                        Timestamp: new Date().toISOString(),
                        Value: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Past_1',
                        Timestamp: new Date().toISOString(),
                        Value: Math.floor(Math.random() * 100)
                    },
                    {
                        ID: 'Salt_1',
                        Timestamp: new Date().toISOString(),
                        Value: Math.floor(Math.random() * 100)
                    }
                ];
                break;
            default:
                break;
        }
        upsertTableState.callAdapter({
            databaseName: selectedDatabase.label,
            tableName: selectedTable.label,
            rows: dataToIngest
        });
    }, [selectedTableType, upsertTableState, selectedDatabase, selectedTable]);

    const handleFrequencyChange = useCallback((_event, newValue?: string) => {
        const frequency = Number(newValue);
        if (frequency === 0) {
            setSelectedFrequency(MIN_INGESTION_FREQUENCY_IN_SEC);
        } else {
            setSelectedFrequency(Number(newValue));
        }
    }, []);

    const handleIngestRowsButtonClick = useCallback(() => {
        if (ingestionRef.current) {
            setIsIngesting(false);
            clearInterval(ingestionRef.current);
            ingestionRef.current = null;
            numberOfRowsBeforeIngestionRef.current = null;
        } else {
            clearInterval(ingestionRef.current); // clear any prior interval
            setIsIngesting(true);
            numberOfRowsBeforeIngestionRef.current = tableData.Rows.length;
            ingestData();
            ingestionRef.current = setInterval(() => {
                ingestData();
            }, selectedFrequency * 1000);
        }
    }, [ingestData, selectedFrequency, tableData]);

    // side effects
    useEffect(() => {
        return () => {
            clearInterval(ingestionRef.current);
        };
    }, []);

    useEffect(() => {
        if (getDatabasesState?.adapterResult?.result) {
            const data = getDatabasesState.adapterResult.getData();
            setDatabaseOptions(data.map((d) => ({ value: d, label: d })));
        }
    }, [getDatabasesState?.adapterResult]);

    useEffect(() => {
        if (getTablesState?.adapterResult?.result) {
            const data = getTablesState.adapterResult.getData();
            setTableOptions(data.map((d) => ({ value: d, label: d })));
        }
    }, [getTablesState?.adapterResult]);

    useEffect(() => {
        if (getTableState?.adapterResult?.result) {
            const data = getTableState.adapterResult.getData() as ITable;
            setTableData(data);
        }
    }, [getTableState?.adapterResult]);

    useEffect(() => {
        if (upsertTableState?.adapterResult?.result) {
            getTableState.callAdapter({
                databaseName: selectedDatabase.label,
                tableName: selectedTable.label
            });
        }
    }, [upsertTableState?.adapterResult]);

    // styles
    const selectStyles = useMemo(() => getReactSelectStyles(theme, {}), [
        theme
    ]);

    return (
        <div>
            <Stack
                tokens={{ childrenGap: 8 }}
                styles={classNames.subComponentStyles.stack}
            >
                <p className={classNames.informationText}>
                    You can create a new database or table, and ingest rows to a
                    target table. Please note that if you recently created the
                    table, it may not be ready for ingestion, wait for couple of
                    minutes before ingestion.
                </p>
                <StackItem>
                    <Stack horizontal horizontalAlign="space-between">
                        <Label required>
                            {t('legionApp.dataPusher.target.database')}
                        </Label>
                        {createDatabaseState.isLoading && (
                            <Spinner
                                label={t(
                                    'legionApp.dataPusher.progress.createDatabase'
                                )}
                                size={SpinnerSize.small}
                                labelPosition={'right'}
                            />
                        )}
                    </Stack>
                    <CreatableSelect
                        onChange={handleDatabaseChange}
                        isClearable
                        options={databaseOptions}
                        placeholder={t(
                            'legionApp.dataPusher.target.selectDatabase'
                        )}
                        styles={selectStyles}
                        isLoading={getDatabasesState.isLoading}
                        value={selectedDatabase}
                    />
                </StackItem>
                <StackItem>
                    <Stack horizontal verticalAlign={'center'}>
                        <Label required>
                            {t('legionApp.dataPusher.target.tableType')}
                        </Label>
                        <TooltipCallout
                            content={{
                                buttonAriaLabel: t(
                                    'legionApp.dataPusher.target.tableTypeTooltipContent'
                                ),
                                calloutContent: t(
                                    'legionApp.dataPusher.target.tableTypeTooltipContent'
                                )
                            }}
                        />
                    </Stack>
                    <Dropdown
                        onChange={handleTableTypeChange}
                        options={TableTypeOptions}
                        placeholder={t(
                            'legionApp.dataPusher.target.selectTableType'
                        )}
                        selectedKey={selectedTableType}
                    />
                </StackItem>
                <StackItem>
                    <Stack horizontal horizontalAlign="space-between">
                        <Label required>
                            {t('legionApp.dataPusher.target.table')}
                        </Label>
                        {createTableState.isLoading && (
                            <Spinner
                                label={t(
                                    'legionApp.dataPusher.progress.createTable'
                                )}
                                size={SpinnerSize.small}
                                labelPosition={'right'}
                            />
                        )}
                    </Stack>
                    <CreatableSelect
                        onChange={handleTableChange}
                        isClearable
                        options={tableOptions}
                        placeholder={t(
                            'legionApp.dataPusher.target.selectTable'
                        )}
                        styles={selectStyles}
                        isLoading={getTablesState.isLoading}
                        value={selectedTable}
                        isDisabled={!selectedDatabase}
                    />
                </StackItem>
                <StackItem>
                    <Stack horizontal verticalAlign={'center'}>
                        <Label required>
                            {`${t('legionApp.dataPusher.pushFrequency')} (sec)`}
                        </Label>
                        <TooltipCallout
                            content={{
                                buttonAriaLabel: t(
                                    'legionApp.dataPusher.pushFrequencyInfo'
                                ),
                                calloutContent: t(
                                    'legionApp.dataPusher.pushFrequencyInfo'
                                )
                            }}
                        />
                    </Stack>
                    <TextField
                        type="number"
                        min={MIN_INGESTION_FREQUENCY_IN_SEC}
                        value={selectedFrequency.toString()}
                        onChange={handleFrequencyChange}
                    />
                </StackItem>
                <StackItem>
                    <PrimaryButton
                        styles={classNames.subComponentStyles.button()}
                        text={
                            isIngesting
                                ? t('legionApp.dataPusher.actions.stopIngest')
                                : t('legionApp.dataPusher.actions.startIngest')
                        }
                        disabled={
                            !selectedTable ||
                            createTableState.isLoading ||
                            !selectedTableType
                        }
                        onClick={handleIngestRowsButtonClick}
                    />
                </StackItem>
            </Stack>

            {isIngesting && (
                <ProgressIndicator
                    label={t('legionApp.dataPusher.progress.ingest')}
                    description={`Pushed ${
                        tableData.Rows.length -
                        numberOfRowsBeforeIngestionRef.current
                    } rows`}
                />
            )}

            <div className={classNames.tableContainer}>
                {tableData?.Rows.length > 0 && (
                    <DetailsList
                        items={tableData.Rows}
                        columns={tableColumns}
                        isHeaderVisible={true}
                        selectionMode={SelectionMode.none}
                    />
                )}
            </div>
        </div>
    );
};

export default Ingest;
