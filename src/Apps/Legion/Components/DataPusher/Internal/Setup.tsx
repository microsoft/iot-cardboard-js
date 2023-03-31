import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dropdown,
    IDropdownOption,
    Label,
    Spinner,
    SpinnerSize,
    Stack,
    StackItem
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../../Models/Hooks/useExtendedTheme';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta } from 'react-select';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import {
    ICreateDatabaseAdapterParams,
    ICreateTableAdapterParams,
    IGetTablesAdapterParams
} from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { getReactSelectStyles } from '../../../../../Resources/Styles/ReactSelect.styles';
import { useTranslation } from 'react-i18next';
import { useDataPusherContext } from '../DataPusher';
import {
    INGESTION_MAPPING_NAME,
    IReactSelectOption,
    TableColumns,
    TableTypeOptions,
    TableTypes
} from '../DataPusher.types';

const Setup: React.FC = () => {
    const { adapter, classNames } = useDataPusherContext();

    // state
    const [databaseOptions, setDatabaseOptions] = useState<
        Array<IReactSelectOption>
    >([]);
    const [tableOptions, setTableOptions] = useState<Array<IReactSelectOption>>(
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
    const [adapterResult, setAdapterResult] = useState(null);

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

    // callbacks
    const handleDatabaseChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedDatabase(newValue);
            setSelectedTable(null);
            if (actionMeta.action === 'create-option') {
                setAdapterResult(null);
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
    const handleTableChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedTable(newValue);

            if (actionMeta.action === 'create-option') {
                setAdapterResult(null);
                createTableState.callAdapter({
                    databaseName: selectedDatabase.label,
                    tableName: newValue.label,
                    columns: TableColumns[selectedTableType]
                });
                setTableOptions(tableOptions.concat(newValue));
            }
        },
        [createTableState, selectedDatabase, selectedTableType, tableOptions]
    );
    const handleTableTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedTableType(option.key as string);
        },
        []
    );

    // side effects
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
        if (createDatabaseState?.adapterResult?.result) {
            const data = createDatabaseState.adapterResult.getData();
            setAdapterResult(data);
        }
    }, [createDatabaseState?.adapterResult]);
    useEffect(() => {
        if (createTableState?.adapterResult?.result) {
            const data = createTableState.adapterResult.getData();
            setAdapterResult(data);
        }
    }, [createTableState?.adapterResult]);

    // styles
    const selectStyles = useMemo(() => getReactSelectStyles(theme, {}), [
        theme
    ]);

    return (
        <Stack
            tokens={{ childrenGap: 8 }}
            styles={classNames.subComponentStyles.stack}
        >
            <p className={classNames.informationText}>
                Using this setup tool you can create new mock source database
                and table based on the selected table schema.
            </p>
            <StackItem>
                <Label>{t('legionApp.dataPusher.source.database')}</Label>
                <CreatableSelect
                    onChange={handleDatabaseChange}
                    isClearable
                    options={databaseOptions}
                    placeholder={t(
                        'legionApp.dataPusher.source.selectDatabase'
                    )}
                    styles={selectStyles}
                    isLoading={getDatabasesState.isLoading}
                    value={selectedDatabase}
                />
            </StackItem>
            <Dropdown
                label={t('legionApp.dataPusher.source.tableType')}
                onChange={handleTableTypeChange}
                options={TableTypeOptions}
                placeholder={t('legionApp.dataPusher.source.selectTableType')}
                defaultSelectedKey={selectedTableType}
            />
            <StackItem>
                <Label>{t('legionApp.dataPusher.source.table')}</Label>
                <CreatableSelect
                    onChange={handleTableChange}
                    isClearable
                    options={tableOptions}
                    placeholder={t('legionApp.dataPusher.source.selectTable')}
                    styles={selectStyles}
                    isLoading={getTablesState.isLoading}
                    value={selectedTable}
                />
            </StackItem>
            <StackItem>
                {createDatabaseState.isLoading && (
                    <Spinner
                        label={t(
                            'legionApp.dataPusher.progress.createSourceDatabase'
                        )}
                        size={SpinnerSize.small}
                    />
                )}
                {createTableState.isLoading && (
                    <Spinner
                        label={t('legionApp.dataPusher.progress.createTable')}
                        size={SpinnerSize.small}
                    />
                )}
                <p className={classNames.informationText}>
                    {adapterResult ? t('success') : ''}
                </p>
            </StackItem>
        </Stack>
    );
};

export default Setup;
