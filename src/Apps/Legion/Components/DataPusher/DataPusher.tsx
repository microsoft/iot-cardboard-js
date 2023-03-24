import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    DataFetchType,
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
    IGetDataAdapterParams,
    IPushDataAdapterParams
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
    const [rows, setRows] = useState(null);

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

    const dataFetchType = useRef<DataFetchType>(DataFetchType.database);

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    const getDataState = useAdapter({
        adapterMethod: (
            params: IGetDataAdapterParams = {
                databaseName: selectedDatabase?.label
            }
        ) => adapter.getData(params),
        refetchDependencies: [adapter]
    });
    const pushDataState = useAdapter({
        adapterMethod: (params: IPushDataAdapterParams) =>
            adapter.pushData(params),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });

    // callbacks
    const handleDatabaseChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedDatabase(newValue);
            setSelectedTable(null); // reset tables
            if (actionMeta.action === 'create-option') {
                pushDataState.callAdapter({ data: newValue.label });
                setDatabaseOptions(databaseOptions.concat(newValue));
            } else {
                // fetch tables of selected database
                dataFetchType.current = DataFetchType.table;
                getDataState.callAdapter({
                    databaseName: newValue.label
                });
            }
        },
        [getDataState, pushDataState, databaseOptions]
    );
    const handleTableChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedTable(newValue);
            setRows(null); // reset rows
            if (actionMeta.action === 'create-option') {
                // create table
                setTableOptions(tableOptions.concat(newValue));
            } else {
                // fetch rows of selected table
                dataFetchType.current = DataFetchType.row;
                getDataState.callAdapter({
                    databaseName: selectedDatabase.label,
                    tableName: newValue.label
                });
            }
        },
        [getDataState, tableOptions, selectedDatabase]
    );
    const handleSimulationTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSimulationType(option.text);
        },
        []
    );
    const handlePrimaryButtonClick = useCallback(() => {
        // push data
        console.log('clicked!');
    }, []);

    // side effects
    useEffect(() => {
        if (getDataState?.adapterResult?.result) {
            const data = getDataState.adapterResult.getData();
            switch (dataFetchType.current) {
                case DataFetchType.database:
                    setDatabaseOptions(
                        data.map((d) => ({ value: d, label: d }))
                    );
                    break;
                case DataFetchType.table:
                    setTableOptions(data.map((d) => ({ value: d, label: d })));
                    break;
                case DataFetchType.row:
                    debugger;
                    setRows(data);
                    break;
                default:
                    break;
            }
        }
    }, [getDataState?.adapterResult]);

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
            <h3 style={{ marginTop: 0 }}>Connect and push data</h3>
            <Stack tokens={{ childrenGap: 8 }}>
                <StackItem>
                    <CreatableSelect
                        onChange={handleDatabaseChange}
                        isClearable
                        options={databaseOptions}
                        placeholder="Select database"
                        styles={selectStyles}
                        value={selectedDatabase}
                    />
                    {pushDataState.isLoading && selectedDatabase?.__isNew__ && (
                        <Spinner
                            label={'Creating database...'}
                            size={SpinnerSize.small}
                        />
                    )}
                </StackItem>
                <StackItem>
                    <CreatableSelect
                        onChange={handleTableChange}
                        isClearable
                        options={tableOptions}
                        placeholder="Select table"
                        styles={selectStyles}
                        value={selectedTable}
                    />
                    {pushDataState.isLoading && selectedTable?.__isNew__ && (
                        <Spinner
                            label={'Creating table...'}
                            size={SpinnerSize.small}
                        />
                    )}
                </StackItem>
                <Dropdown
                    onChange={handleSimulationTypeChange}
                    options={simulationOptions}
                    placeholder="Select simulation type"
                />
                <PrimaryButton
                    text={'Connect & Push simulation data'}
                    onClick={handlePrimaryButtonClick}
                />
            </Stack>

            {rows?.Rows.length > 0 && (
                <DetailsList
                    items={rows.Rows}
                    columns={rows.Columns.map((c) => ({
                        key: c,
                        name: c,
                        minWidth: 20
                    }))}
                    isHeaderVisible={true}
                    selectionMode={SelectionMode.none}
                />
            )}
        </div>
    );
};

export default styled<
    IDataPusherProps,
    IDataPusherStyleProps,
    IDataPusherStyles
>(DataPusher, getStyles);
