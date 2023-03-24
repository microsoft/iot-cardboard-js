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
    IGetTablesAdapterParams
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
    const [databaseOptions, setDatabaseOptions] = useState([]);
    const [tableOptions, setTableOptions] = useState([]);
    const [tableData, setTableData] = useState(null);

    const [selectedDatabase, setSelectedDatabase] = useState<{
        value: string;
        label: string;
        __isNew__: boolean;
    }>(null);
    const [selectedTable, setSelectedTable] = useState<{
        value: string;
        label: string;
        __isNew__: boolean;
    }>(null);
    const [selectedSimulationType, setSelectedSimulationType] = useState(null);

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
    const tableColumns = useMemo(
        () =>
            tableData?.Columns.map(
                (c, idx) =>
                    ({
                        key: c,
                        name: c,
                        minWidth: 20,
                        maxWidth: 100,
                        onRender: (item) => item[idx]
                    } || [])
            ),
        [tableData]
    );

    // callbacks
    const handleDatabaseChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedDatabase(newValue);
            setSelectedTable(null);
            setTableOptions([]);
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
        [getTablesState, createDatabaseState, databaseOptions]
    );
    const handleTableChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedTable(newValue);
            setTableData(null);
            if (actionMeta.action === 'create-option') {
                // create table
                setTableOptions(tableOptions.concat(newValue));
            } else {
                getTableState.callAdapter({
                    databaseName: selectedDatabase.label,
                    tableName: newValue.label
                });
            }
        },
        [getTableState, tableOptions, selectedDatabase]
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
            const data = getTableState.adapterResult.getData();
            setTableData(data);
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
                    <Label>{t('legionApp.dataPusher.database')}</Label>
                    <CreatableSelect
                        onChange={handleDatabaseChange}
                        isClearable
                        options={databaseOptions}
                        placeholder={t(
                            'legionApp.dataPusher.selectDatabasePlaceholder'
                        )}
                        styles={selectStyles}
                        value={selectedDatabase}
                        isLoading={getDatabasesState.isLoading}
                    />
                    {createDatabaseState.isLoading && (
                        <Spinner
                            label={t(
                                'legionApp.dataPusher.progress.createDatabase'
                            )}
                            size={SpinnerSize.small}
                        />
                    )}
                </StackItem>
                <StackItem>
                    <Label>{t('legionApp.dataPusher.table')}</Label>
                    <CreatableSelect
                        onChange={handleTableChange}
                        isClearable
                        options={tableOptions}
                        placeholder={t(
                            'legionApp.dataPusher.selectTablePlaceholder'
                        )}
                        styles={selectStyles}
                        value={selectedTable}
                        isLoading={getTablesState.isLoading}
                    />
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
