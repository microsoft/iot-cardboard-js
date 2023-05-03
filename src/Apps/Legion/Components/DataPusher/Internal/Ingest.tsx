import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    DetailsList,
    IColumn,
    Label,
    PrimaryButton,
    ProgressIndicator,
    SelectionMode,
    Stack,
    StackItem,
    TextField
} from '@fluentui/react';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import {
    ICreateTableAdapterParams,
    IGetTableAdapterParams,
    IGetTablesAdapterParams,
    IIngestRow,
    ITable,
    IUpsertTableAdapterParams
} from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { DataPusherContext, useDataPusherContext } from '../DataPusher';
import { useTranslation } from 'react-i18next';
import {
    INGESTION_MAPPING_NAME,
    TableColumns,
    TableTypeOptions,
    TableTypes,
    TIMESTAMP_COLUMN_NAME
} from '../DataPusher.types';
import TooltipCallout from '../../../../../Components/TooltipCallout/TooltipCallout';
import { IReactSelectOption } from '../../../Models/Types';
import DatabasePicker from '../../Pickers/DatabasePicker/DatabasePicker';
import { getMockData } from '../../../Services/DataPusherUtils';
import { useId } from '@fluentui/react-hooks';
import CardboardComboBox from '../../CardboardComboBox/CardboardComboBox';

const DEFAULT_INGESTION_FREQUENCY_IN_SEC = 5;
const MIN_INGESTION_FREQUENCY_IN_SEC = 1;

const Ingest: React.FC = () => {
    const { adapter, selectedClusterUrl, classNames } = useDataPusherContext();

    // state
    const [tableOptions, setTableOptions] = useState<Array<IReactSelectOption>>(
        []
    );
    const [selectedDatabaseName, setSelectedDatabaseName] = useState<string>(
        null
    );
    const [selectedTable, setSelectedTable] = useState<IReactSelectOption>(
        null
    );
    const [
        selectedTableTypeOption,
        setSelectedTableTypeOption
    ] = useState<IReactSelectOption>(TableTypeOptions[0]);
    const [selectedFrequency, setSelectedFrequency] = useState<number>(
        DEFAULT_INGESTION_FREQUENCY_IN_SEC
    );
    const [tableData, setTableData] = useState<ITable>(null);
    const [isIngesting, setIsIngesting] = useState(false);

    // hooks
    const { t } = useTranslation();

    const frequencyLabelId = useId('frequency-label');

    const ingestionRef = useRef(null);
    const ingestedDataSizeRef = useRef(0);
    const numberOfRowsIngestedRef = useRef(0);
    const numberOfRowsAttemptedToIngestRef = useRef(0);
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

    const getTablesState = useAdapter({
        adapterMethod: (param: IGetTablesAdapterParams) =>
            adapter.getTables(param.databaseName),
        isAdapterCalledOnMount: false,
        refetchDependencies: []
    });

    const getTableState = useAdapter({
        adapterMethod: (params: IGetTableAdapterParams) =>
            adapter.getTable(
                params.databaseName,
                params.tableName,
                TIMESTAMP_COLUMN_NAME
            ),
        isAdapterCalledOnMount: false,
        refetchDependencies: []
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
        refetchDependencies: []
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
        refetchDependencies: []
    });

    // callbacks
    const handleDatabaseChange = useCallback(
        (databaseName: string, isNew: boolean) => {
            setSelectedDatabaseName(databaseName);
            setTableOptions([]);
            setSelectedTable(null);
            setTableData(null);
            if (!isNew) {
                // fetch tables of selected database
                getTablesState.callAdapter({
                    databaseName: databaseName
                });
            }
        },
        [getTablesState]
    );

    const handleTableTypeChange = useCallback((option: IReactSelectOption) => {
        setSelectedTableTypeOption(option);
    }, []);

    const handleTableChange = useCallback(
        (newValue: IReactSelectOption, isNew: boolean) => {
            setSelectedTable(newValue);
            setTableData(null);
            if (isNew) {
                if (selectedTableTypeOption) {
                    createTableState.callAdapter({
                        databaseName: selectedDatabaseName,
                        tableName: newValue.label,
                        columns: TableColumns[selectedTableTypeOption.value]
                    });
                    setTableOptions(tableOptions.concat(newValue));
                } else {
                    alert('Select target table type first');
                }
            } else {
                setSelectedTableTypeOption(null);
                if (newValue) {
                    getTableState.callAdapter({
                        databaseName: selectedDatabaseName,
                        tableName: newValue.label
                    });
                }
            }
        },
        [
            createTableState,
            getTableState,
            selectedDatabaseName,
            selectedTableTypeOption,
            tableOptions
        ]
    );

    const ingestData = useCallback(() => {
        const dataToIngest: Array<IIngestRow> = getMockData(
            selectedTableTypeOption.value as TableTypes
        );
        ingestedDataSizeRef.current = dataToIngest.length;
        numberOfRowsAttemptedToIngestRef.current += dataToIngest.length;
        upsertTableState.callAdapter({
            databaseName: selectedDatabaseName,
            tableName: selectedTable.label,
            rows: dataToIngest
        });
    }, [
        selectedTableTypeOption,
        upsertTableState,
        selectedDatabaseName,
        selectedTable
    ]);

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
            numberOfRowsIngestedRef.current = 0;
            numberOfRowsAttemptedToIngestRef.current = 0;
            ingestedDataSizeRef.current = 0;
        } else {
            clearInterval(ingestionRef.current); // clear any prior interval
            setIsIngesting(true);
            ingestData();
            ingestionRef.current = setInterval(() => {
                ingestData();
            }, selectedFrequency * 1000);
        }
    }, [ingestData, selectedFrequency]);

    // side effects
    useEffect(() => {
        return () => {
            clearInterval(ingestionRef.current);
        };
    }, []);

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
                databaseName: selectedDatabaseName,
                tableName: selectedTable.label
            });
            numberOfRowsIngestedRef.current += ingestedDataSizeRef.current;
        }
    }, [upsertTableState?.adapterResult]);

    return (
        <div>
            <Stack
                tokens={{ childrenGap: 8 }}
                styles={classNames.subComponentStyles.stack}
            >
                <p className={classNames.informationText}>
                    {t('legionApp.dataPusher.ingestInfo')}
                </p>
                <DatabasePicker
                    isDisabled={!selectedClusterUrl}
                    onDatabaseNameChange={handleDatabaseChange}
                    targetAdapterContext={DataPusherContext}
                    isCreatable={true}
                />
                <CardboardComboBox
                    isCreatable={false}
                    label={t('legionApp.Common.tableTypeLabel')}
                    onSelectionChange={handleTableTypeChange}
                    options={TableTypeOptions}
                    placeholder={t('legionApp.Common.tableTypePlaceholder')}
                    selectedItem={selectedTableTypeOption}
                    tooltip={{
                        content: {
                            buttonAriaLabel: t(
                                'legionApp.dataPusher.tableTypeTooltipContent'
                            ),
                            calloutContent: t(
                                'legionApp.dataPusher.tableTypeTooltipContent'
                            )
                        }
                    }}
                />
                <CardboardComboBox
                    isLoading={getTablesState.isLoading}
                    label={t('legionApp.Common.tableLabel')}
                    onSelectionChange={handleTableChange}
                    options={tableOptions}
                    placeholder={t('legionApp.Common.tablePlaceholder')}
                    selectedItem={selectedTable}
                    isSpinnerVisible={createTableState.isLoading}
                    spinnerLabel={t(
                        'legionApp.dataPusher.progress.createTable'
                    )}
                    tooltip={{
                        content: {
                            buttonAriaLabel: t(
                                'legionApp.dataPusher.tableSelectInfo',
                                {
                                    ingestionMapping: INGESTION_MAPPING_NAME
                                }
                            ),
                            calloutContent: t(
                                'legionApp.dataPusher.tableSelectInfo',
                                {
                                    ingestionMapping: INGESTION_MAPPING_NAME
                                }
                            )
                        }
                    }}
                    isDisabled={!selectedDatabaseName}
                />
                <StackItem>
                    <Stack horizontal verticalAlign={'center'}>
                        <Label required id={frequencyLabelId}>
                            {`${t('legionApp.dataPusher.frequency')} (sec)`}
                        </Label>
                        <TooltipCallout
                            content={{
                                buttonAriaLabel: t(
                                    'legionApp.dataPusher.frequencyInfo'
                                ),
                                calloutContent: t(
                                    'legionApp.dataPusher.frequencyInfo'
                                )
                            }}
                        />
                    </Stack>
                    <TextField
                        aria-labelledby={frequencyLabelId}
                        type="number"
                        min={MIN_INGESTION_FREQUENCY_IN_SEC}
                        value={selectedFrequency.toString()}
                        onChange={handleFrequencyChange}
                    />
                </StackItem>
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
                        !selectedTableTypeOption
                    }
                    onClick={handleIngestRowsButtonClick}
                />
            </Stack>

            {isIngesting && (
                <ProgressIndicator
                    label={t('legionApp.dataPusher.progress.ingest')}
                    description={`Pushed ${numberOfRowsIngestedRef.current}/${numberOfRowsAttemptedToIngestRef.current} rows`}
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
