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
import CreatableSelect from 'react-select/creatable';
import { ActionMeta } from 'react-select';
import { getReactSelectStyles } from '../../../../../Resources/Styles/ReactSelect.styles';
import { useExtendedTheme } from '../../../../../Models/Hooks/useExtendedTheme';
import TooltipCallout from '../../../../../Components/TooltipCallout/TooltipCallout';
import { IReactSelectOption } from '../../../Models/Interfaces';
import DatabasePicker from '../../Pickers/DatabasePicker/DatabasePicker';
import { getMockData } from '../../../Services/DataPusherUtils';

const DEFAULT_INGESTION_FREQUENCY_IN_SEC = 5;
const MIN_INGESTION_FREQUENCY_IN_SEC = 1;

const Ingest: React.FC = () => {
    const { adapter, classNames } = useDataPusherContext();

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
    const [selectedTableType, setSelectedTableType] = useState<TableTypes>(
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
    const numberOfRowsIngestedRef = useRef(0);
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

    const handleTableTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedTableType(option.key as TableTypes);
        },
        []
    );

    const handleTableChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedTable(newValue);
            setTableData(null);
            if (actionMeta.action === 'create-option') {
                if (selectedTableType) {
                    createTableState.callAdapter({
                        databaseName: selectedDatabaseName,
                        tableName: newValue.label,
                        columns: TableColumns[selectedTableType]
                    });
                    setTableOptions(tableOptions.concat(newValue));
                } else {
                    alert('Select target table type first');
                }
            } else {
                setSelectedTableType(null);
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
            selectedTableType,
            tableOptions
        ]
    );

    const ingestData = useCallback(() => {
        const dataToIngest: Array<IIngestRow> = getMockData(selectedTableType);
        upsertTableState.callAdapter({
            databaseName: selectedDatabaseName,
            tableName: selectedTable.label,
            rows: dataToIngest
        });
        return dataToIngest.length;
    }, [
        selectedTableType,
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
        } else {
            clearInterval(ingestionRef.current); // clear any prior interval
            setIsIngesting(true);
            numberOfRowsIngestedRef.current += ingestData();
            ingestionRef.current = setInterval(() => {
                numberOfRowsIngestedRef.current += ingestData();
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
                    {t('legionApp.dataPusher.ingestInfo')}
                </p>
                <DatabasePicker
                    onDatabaseNameChange={handleDatabaseChange}
                    targetAdapterContext={DataPusherContext}
                    isCreatable
                />
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
                        <Stack horizontal>
                            <Label required>
                                {t('legionApp.dataPusher.target.table')}
                            </Label>
                            <TooltipCallout
                                content={{
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
                                }}
                            />
                        </Stack>
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
                        isDisabled={!selectedDatabaseName}
                    />
                </StackItem>
                <StackItem>
                    <Stack horizontal verticalAlign={'center'}>
                        <Label required>
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
                    description={`Pushed ${numberOfRowsIngestedRef.current} rows`}
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
