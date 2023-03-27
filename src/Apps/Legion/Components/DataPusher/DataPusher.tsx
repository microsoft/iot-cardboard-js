import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    IDataPusherProps,
    IDataPusherStyleProps,
    IDataPusherStyles
} from './DataPusher.types';
import { getStyles } from './DataPusher.styles';
import {
    classNamesFunction,
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
    StackItem,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta } from 'react-select';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import {
    ICreateDatabaseAdapterParams,
    IGetTableAdapterParams,
    IGetTablesAdapterParams,
    ITable
} from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { getReactSelectStyles } from '../../../../Resources/Styles/ReactSelect.styles';
import { AdtPusherSimulationType } from '../../../../Models/Constants/Interfaces';
import { useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DataPusher', debugLogging);

const getClassNames = classNamesFunction<
    IDataPusherStyleProps,
    IDataPusherStyles
>();

const DataPusher: React.FC<IDataPusherProps> = (props) => {
    const { adapter, styles } = props;

    // state
    const [sourceDatabaseOptions, setSourceDatabaseOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [targetDatabaseOptions, setTargetDatabaseOptions] = useState([]);
    const [sourceTableOptions, setSourceTableOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [sourceTableColumnOptions, setSourceTableColumnOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [tableData, setTableData] = useState<ITable>(null);

    const [selectedTargetDatabase, setSelectedTargetDatabase] = useState<{
        value: string;
        label: string;
        __isNew__: boolean;
    }>(null);
    const [
        selectedSourceDatabase,
        setSelectedSourceDatabase
    ] = useState<string>(null);
    const [selectedSourceTable, setSelectedSourceTable] = useState<string>(
        null
    );
    const [
        selectedSourceTwinIDColumn,
        setSelectedSourceTwinIDColumn
    ] = useState<string>(null);
    const [
        selectedSimulationType,
        setSelectedSimulationType
    ] = useState<string>(null);

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
            adapter.getTable(params.databaseName, params.tableName),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });
    const tableColumns = useMemo<Array<IColumn>>(
        () =>
            tableData?.Columns.map((c, idx) => ({
                key: c,
                name: c,
                minWidth: 20,
                maxWidth: 100,
                onRender: (item) => item[idx]
            })) || [],
        [tableData]
    );

    // callbacks
    const handleTargetDatabaseChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedTargetDatabase(newValue);

            if (actionMeta.action === 'create-option') {
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
        [getTablesState, createDatabaseState, targetDatabaseOptions]
    );
    const handleSourceDatabaseChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceDatabase(option.text);

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
    const handleSourceTwinIDColumnChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceTwinIDColumn(option.text);
        },
        []
    );

    const handleSimulationTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSimulationType(option.text);
        },
        []
    );
    const handlePrimaryButtonClick = useCallback(() => {
        // push data
        alert('clicked!');
    }, []);

    // side effects
    useEffect(() => {
        if (getDatabasesState?.adapterResult?.result) {
            const data = getDatabasesState.adapterResult.getData();
            setSourceDatabaseOptions(
                data.map((d) => ({ key: `source-${d}`, text: d }))
            );
            setTargetDatabaseOptions(
                data.map((d) => ({ key: `target-${d}`, value: d, label: d }))
            );
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

    // styles
    const classNames = getClassNames(styles, {
        theme
    });
    const selectStyles = useMemo(() => getReactSelectStyles(theme, {}), [
        theme
    ]);

    const simulationOptions: IDropdownOption[] = [
        {
            key: AdtPusherSimulationType.RobotArms,
            text: t('dataPusher.robotArms')
        },
        {
            key: AdtPusherSimulationType.DairyProduction,
            text: t('dataPusher.dairyProduction')
        }
    ];

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <h3 style={{ marginTop: 0 }}>{t('legionApp.dataPusher.title')}</h3>
            <Stack
                styles={{ root: { width: 300 } }}
                tokens={{ childrenGap: 8 }}
            >
                <StackItem>
                    <Dropdown
                        label={t('legionApp.dataPusher.sourceDatabase')}
                        onChange={handleSourceDatabaseChange}
                        options={sourceDatabaseOptions}
                        placeholder={t(
                            'legionApp.dataPusher.selectSourceDatabasePlaceholder'
                        )}
                    />
                    <Dropdown
                        label={t('legionApp.dataPusher.sourceTable')}
                        onChange={handleSourceTableChange}
                        options={sourceTableOptions}
                        placeholder={t(
                            'legionApp.dataPusher.selectSourceTablePlaceholder'
                        )}
                    />
                    <Dropdown
                        label={t('legionApp.dataPusher.sourceTwinIDProperty')}
                        onChange={handleSourceTwinIDColumnChange}
                        options={sourceTableColumnOptions}
                        placeholder={t(
                            'legionApp.dataPusher.selectSourceTwinIDPropertyPlaceholder'
                        )}
                    />
                </StackItem>
                <StackItem>
                    <Label>{t('legionApp.dataPusher.targetDatabase')}</Label>
                    <CreatableSelect
                        onChange={handleTargetDatabaseChange}
                        isClearable
                        options={targetDatabaseOptions}
                        placeholder={t(
                            'legionApp.dataPusher.selectTargetDatabasePlaceholder'
                        )}
                        styles={selectStyles}
                        value={selectedTargetDatabase}
                        isLoading={getDatabasesState.isLoading}
                    />
                    {createDatabaseState.isLoading && (
                        <Spinner
                            label={t(
                                'legionApp.dataPusher.progress.createTargetDatabase'
                            )}
                            size={SpinnerSize.small}
                        />
                    )}
                </StackItem>
                <StackItem>
                    <Label>{t('legionApp.dataPusher.simulationType')}</Label>
                    <Dropdown
                        onChange={handleSimulationTypeChange}
                        options={simulationOptions}
                        placeholder={t(
                            'legionApp.dataPusher.selectSimulationTypePlaceholder'
                        )}
                    />
                </StackItem>
                <PrimaryButton
                    text={t('legionApp.dataPusher.primaryActionLabel')}
                    onClick={handlePrimaryButtonClick}
                />
            </Stack>

            {tableData?.Rows.length > 0 && (
                <div className={classNames.tableContainer}>
                    <DetailsList
                        items={tableData.Rows}
                        columns={tableColumns}
                        isHeaderVisible={true}
                        selectionMode={SelectionMode.none}
                    />
                </div>
            )}
        </div>
    );
};

export default styled<
    IDataPusherProps,
    IDataPusherStyleProps,
    IDataPusherStyles
>(DataPusher, getStyles);
