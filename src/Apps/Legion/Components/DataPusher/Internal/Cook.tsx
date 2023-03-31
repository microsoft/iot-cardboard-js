import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    DetailsList,
    Dropdown,
    IColumn,
    IDropdownOption,
    Label,
    PrimaryButton,
    SelectionMode,
    Spinner,
    SpinnerSize,
    Stack,
    StackItem
} from '@fluentui/react';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import {
    ICreateDatabaseAdapterParams,
    IGetTableAdapterParams,
    IGetTablesAdapterParams,
    ITable
} from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { useDataPusherContext } from '../DataPusher';
import { useTranslation } from 'react-i18next';
import { IReactSelectOption } from '../DataPusher.types';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta } from 'react-select';
import { getReactSelectStyles } from '../../../../../Resources/Styles/ReactSelect.styles';
import { useExtendedTheme } from '../../../../../Models/Hooks/useExtendedTheme';

const Cook: React.FC = () => {
    const { adapter, classNames } = useDataPusherContext();

    // state
    const [sourceDatabaseOptions, setSourceDatabaseOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [targetDatabaseOptions, setTargetDatabaseOptions] = useState<
        Array<IReactSelectOption>
    >([]);
    const [sourceTableOptions, setSourceTableOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [sourceTableColumnOptions, setSourceTableColumnOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [
        selectedSourceDatabase,
        setSelectedSourceDatabase
    ] = useState<string>(null);
    const [
        selectedTargetDatabase,
        setSelectedTargetDatabase
    ] = useState<IReactSelectOption>(null);
    const [selectedSourceTable, setSelectedSourceTable] = useState<string>(
        null
    );
    const [
        selectedSourceTwinIDColumn,
        setSelectedSourceTwinIDColumn
    ] = useState<string>(null);
    const [tableData, setTableData] = useState<ITable>(null);
    const [adapterResult, setAdapterResult] = useState(null);

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();
    const tableColumns = useMemo<Array<IColumn>>(
        () =>
            tableData?.Columns.map((c, idx) => ({
                key: c,
                name: c,
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
            adapter.getTable(params.databaseName, params.tableName),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });

    // callbacks
    const handleSourceDatabaseChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceDatabase(option.text);
            setSelectedSourceTable(null);
            setSelectedSourceTwinIDColumn(null);
            setTableData(null);
            // fetch tables of selected database
            getTablesState.callAdapter({
                databaseName: option.text
            });
        },
        [getTablesState]
    );
    const handleTargetDatabaseChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedTargetDatabase(newValue);

            if (actionMeta.action === 'create-option') {
                setAdapterResult(null);
                createDatabaseState.callAdapter({
                    databaseName: newValue.label
                });
                setTargetDatabaseOptions(
                    targetDatabaseOptions.concat(newValue)
                );
            } else {
                // fetch tables of selected database
                getTablesState.callAdapter({
                    databaseName: newValue.label
                });
            }
        },
        [createDatabaseState, targetDatabaseOptions, getTablesState]
    );
    const handleSourceTableChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceTable(option.text);
            setSelectedSourceTwinIDColumn(null);
            setTableData(null);
            getTableState.callAdapter({
                databaseName: selectedSourceDatabase,
                tableName: option.text
            });
        },
        [getTableState, selectedSourceDatabase]
    );
    const handleSourceTwinIDColumnChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceTwinIDColumn(option.text);
        },
        []
    );
    const handleCookButtonClick = useCallback(() => {
        alert('Not implemented yet!');
    }, []);

    // side effects
    useEffect(() => {
        if (getDatabasesState?.adapterResult?.result) {
            const data = getDatabasesState.adapterResult.getData();
            setSourceDatabaseOptions(data.map((d) => ({ key: d, text: d })));
            setTargetDatabaseOptions(data.map((d) => ({ value: d, label: d })));
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
            setSourceTableColumnOptions(
                data.Columns.map((d) => ({ key: d, text: d }))
            );
        }
    }, [getTableState?.adapterResult]);

    useEffect(() => {
        if (createDatabaseState?.adapterResult?.result) {
            const data = createDatabaseState.adapterResult.getData();
            setAdapterResult(data);
        }
    }, [createDatabaseState?.adapterResult]);

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
                    Using this cook tool you can cook twins graph based on
                    selected source table and push it to target tables.
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
                    selectedKey={selectedSourceDatabase}
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
                    label={t('legionApp.dataPusher.source.twinIDProperty')}
                    onChange={handleSourceTwinIDColumnChange}
                    options={sourceTableColumnOptions}
                    placeholder={
                        getTableState.isLoading
                            ? t('loading')
                            : t(
                                  'legionApp.dataPusher.source.selectTwinIDProperty'
                              )
                    }
                    selectedKey={selectedSourceTwinIDColumn}
                />
                <StackItem>
                    <Label>{t('legionApp.dataPusher.target.database')}</Label>
                    <CreatableSelect
                        onChange={handleTargetDatabaseChange}
                        isClearable
                        options={targetDatabaseOptions}
                        placeholder={t(
                            'legionApp.dataPusher.target.selectDatabase'
                        )}
                        styles={selectStyles}
                        isLoading={getDatabasesState.isLoading}
                        value={selectedTargetDatabase}
                    />
                </StackItem>
                <PrimaryButton
                    text={t('legionApp.dataPusher.actions.cook')}
                    disabled={!(selectedSourceTable && selectedTargetDatabase)}
                    onClick={handleCookButtonClick}
                />
                <StackItem>
                    {createDatabaseState.isLoading && (
                        <Spinner
                            label={t(
                                'legionApp.dataPusher.progress.createSourceDatabase'
                            )}
                            size={SpinnerSize.small}
                        />
                    )}
                    <p className={classNames.informationText}>
                        {adapterResult ? t('success') : ''}
                    </p>
                </StackItem>
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

export default Cook;
