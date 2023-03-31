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
    PrimaryButton,
    SelectionMode,
    Stack
} from '@fluentui/react';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import {
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
    TableTypeOptions,
    TableTypes,
    TIMESTAMP_COLUMN_NAME
} from '../DataPusher.types';

const INGESTION_TICK_INTERVAL = 5000;

const Ingest: React.FC = () => {
    const { adapter, classNames } = useDataPusherContext();

    // state
    const [sourceDatabaseOptions, setSourceDatabaseOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [sourceTableOptions, setSourceTableOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [
        selectedSourceDatabase,
        setSelectedSourceDatabase
    ] = useState<string>(null);
    const [selectedSourceTable, setSelectedSourceTable] = useState<string>(
        null
    );
    const [
        selectedSourceTableType,
        setSelectedSourceTableType
    ] = useState<string>(TableTypes.Wide);
    const [tableData, setTableData] = useState<ITable>(null);
    const [adapterResult, setAdapterResult] = useState(null);

    // hooks
    const { t } = useTranslation();
    const ingestionRef = useRef(null);
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
    const handleSourceDatabaseChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceDatabase(option.text);
            setSelectedSourceTable(null);
            setTableData(null);
            // fetch tables of selected database
            getTablesState.callAdapter({
                databaseName: option.text
            });
        },
        [getTablesState]
    );
    const handleSourceTableChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceTable(option.text);
            setTableData(null);
            getTableState.callAdapter({
                databaseName: selectedSourceDatabase,
                tableName: option.text
            });
        },
        [getTableState, selectedSourceDatabase]
    );
    const handleSourceTableTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceTableType(option.key as string);
        },
        []
    );
    const ingestData = useCallback(() => {
        let dataToIngest: Array<IIngestRow> = [];
        switch (selectedSourceTableType) {
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
        setAdapterResult(null);
        upsertTableState.callAdapter({
            databaseName: selectedSourceDatabase,
            tableName: selectedSourceTable,
            rows: dataToIngest
        });
    }, [
        selectedSourceTableType,
        upsertTableState,
        selectedSourceDatabase,
        selectedSourceTable
    ]);
    const handleIngestRowsButtonClick = useCallback(() => {
        if (ingestionRef.current) {
            clearInterval(ingestionRef.current);
            ingestionRef.current = null;
            setAdapterResult(null);
        } else {
            // Clear any prior interval
            clearInterval(ingestionRef.current);
            ingestData();
            ingestionRef.current = setInterval(() => {
                ingestData();
            }, INGESTION_TICK_INTERVAL);
        }
    }, [ingestData]);

    // side effects
    useEffect(() => {
        return () => {
            clearInterval(ingestionRef.current);
        };
    }, []);

    useEffect(() => {
        if (getDatabasesState?.adapterResult?.result) {
            const data = getDatabasesState.adapterResult.getData();
            setSourceDatabaseOptions(data.map((d) => ({ key: d, text: d })));
        }
    }, [getDatabasesState?.adapterResult]);

    useEffect(() => {
        if (getTablesState?.adapterResult?.result) {
            const data = getTablesState.adapterResult.getData();
            setSourceTableOptions(data.map((d) => ({ key: d, text: d })));
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
            const data = upsertTableState?.adapterResult.getData();
            setAdapterResult(data);
            getTableState.callAdapter({
                databaseName: selectedSourceDatabase,
                tableName: selectedSourceTable
            });
        }
    }, [upsertTableState?.adapterResult]);

    return (
        <div>
            <Stack
                tokens={{ childrenGap: 8 }}
                styles={classNames.subComponentStyles.stack}
            >
                <p className={classNames.informationText}>
                    Using this ingest tool you can ingest rows to source table
                    and see the table content. Please note that, if you recently
                    created the table, it may not be ready for ingestion, wait
                    for couple of minutes before ingestion.
                </p>
                <Dropdown
                    label={t('legionApp.dataPusher.source.database')}
                    onChange={handleSourceDatabaseChange}
                    options={sourceDatabaseOptions}
                    placeholder={
                        getDatabasesState.isLoading
                            ? t('loading')
                            : t('legionApp.dataPusher.source.selectDatabase')
                    }
                />
                <Dropdown
                    label={t('legionApp.dataPusher.source.table')}
                    onChange={handleSourceTableChange}
                    options={sourceTableOptions}
                    placeholder={
                        getTablesState.isLoading
                            ? t('loading')
                            : t('legionApp.dataPusher.source.selectTable')
                    }
                    selectedKey={selectedSourceTable}
                />
                <Dropdown
                    label={t('legionApp.dataPusher.source.tableType')}
                    onChange={handleSourceTableTypeChange}
                    options={TableTypeOptions}
                    placeholder={t(
                        'legionApp.dataPusher.source.selectTableType'
                    )}
                    defaultSelectedKey={selectedSourceTableType}
                />
                <PrimaryButton
                    text={
                        ingestionRef.current
                            ? t('legionApp.dataPusher.progress.ingest')
                            : t('legionApp.dataPusher.actions.ingest')
                    }
                    disabled={!selectedSourceTable}
                    onClick={handleIngestRowsButtonClick}
                />
                <p className={classNames.informationText}>
                    {adapterResult ? t('success') : ''}
                </p>
            </Stack>

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
