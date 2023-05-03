import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICookSourceProps } from './CookSource.types';
import { getStyles } from './CookSource.styles';
import { Dropdown, IDropdownOption, Stack } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    PIDSourceOptions,
    SourceType,
    SourceTypeOptions,
    TIMESTAMP_COLUMN_NAME
} from '../DataPusher/DataPusher.types';
import ClusterPicker from '../Pickers/ClusterPicker/ClusterPicker';
import DatabasePicker from '../Pickers/DatabasePicker/DatabasePicker';
import TablePicker from '../Pickers/TablePicker/TablePicker';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import {
    IGetTableAdapterParams,
    ITable
} from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { useADXAdapter } from '../../Hooks/useADXAdapter';
import {
    IADXAdapterTargetContext,
    IADXConnection,
    ICookSource,
    IPIDDocument
} from '../../Models';
import produce from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import { getTableSchemaTypeFromTable } from '../../Services/DataPusherUtils';
import { AppDataContext } from '../../Contexts/AppDataContext/AppDataContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('CookSource', debugLogging);

const defaultTimeSeriesSource: ICookSource = {
    cluster: null,
    database: null,
    table: null,
    twinIdColumn: null,
    tableType: null
};

const defaultPIDSource: ICookSource = {
    pidUrl: ''
};

const CookSource: React.FC<ICookSourceProps> = (props) => {
    const {
        onSourceTypeChange,
        onSourceChange,
        onGetTableData,
        targetAdapterContext = AppDataContext,
        isClusterVisible = true
    } = props;

    // state
    const [selectedSourceType, setSelectedSourceType] = useState<SourceType>(
        SourceType.Timeseries
    );
    const [selectedSource, setSelectedSource] = useState<ICookSource>(
        defaultTimeSeriesSource
    );
    const [sourceTableColumnOptions, setSourceTableColumnOptions] = useState<
        Array<IDropdownOption>
    >([]);

    // hooks
    const { t } = useTranslation();
    const adapter = useADXAdapter(
        targetAdapterContext as React.Context<IADXAdapterTargetContext>
    );

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
    const handleSourceTypeChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceType(option.key as SourceType);
            onSourceTypeChange?.(option.key as SourceType);
            const newSource =
                option.key === SourceType.Timeseries
                    ? defaultTimeSeriesSource
                    : defaultPIDSource;
            setSelectedSource(newSource);
            onSourceChange?.(newSource);
        },
        [onSourceChange, onSourceTypeChange]
    );
    const handleSourceClusterChange = useCallback(
        (clusterUrl: string) => {
            const newSource: IADXConnection = {
                ...(selectedSource as IADXConnection),
                cluster: clusterUrl,
                database: null,
                table: null,
                twinIdColumn: null,
                tableData: null
            };
            setSelectedSource(newSource);
            onSourceChange?.(newSource);
            onGetTableData?.(null);
        },
        [onGetTableData, onSourceChange, selectedSource]
    );
    const handleSourceDatabaseChange = useCallback(
        (databaseName: string) => {
            const newSource: IADXConnection = {
                ...(selectedSource as IADXConnection),
                database: databaseName,
                table: null,
                twinIdColumn: null,
                tableData: null
            };
            setSelectedSource(newSource);
            onSourceChange?.(newSource);
            onGetTableData?.(null);
        },
        [onGetTableData, onSourceChange, selectedSource]
    );
    const handleSourceTableChange = useCallback(
        (tableName: string) => {
            const newSource: IADXConnection = {
                ...(selectedSource as IADXConnection),
                table: tableName,
                twinIdColumn: null,
                tableData: null
            };
            setSelectedSource(newSource);
            onSourceChange?.(newSource);
            onGetTableData?.(null);

            getTableState.callAdapter({
                databaseName: (selectedSource as IADXConnection).database,
                tableName: tableName
            });
        },
        [getTableState, onGetTableData, onSourceChange, selectedSource]
    );
    const handleSourceTwinIDColumnChange = useCallback(
        (_event, option: IDropdownOption) => {
            const newSource: IADXConnection = {
                ...(selectedSource as IADXConnection),
                twinIdColumn: option.text
            };
            setSelectedSource(newSource);
            onSourceChange?.(newSource);
        },
        [onSourceChange, selectedSource]
    );

    const handlePIDUrlChange = useCallback(
        (_event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any>) => {
            const newSource: IPIDDocument = {
                ...(selectedSource as IPIDDocument),
                pidUrl: option.text
            };
            setSelectedSource(newSource);
            onSourceChange?.(newSource);
        },
        [onSourceChange, selectedSource]
    );

    // side effects
    useEffect(() => {
        if (getTableState?.adapterResult?.result) {
            const data = getTableState.adapterResult.getData() as ITable;
            setSelectedSource(
                produce((draft: WritableDraft<IADXConnection>) => {
                    draft.tableData = data;
                    draft.tableType = getTableSchemaTypeFromTable(data);
                })
            );
            setSourceTableColumnOptions(
                data.Columns.map((d) => ({
                    key: d.columnName,
                    text: d.columnName
                }))
            );
            onGetTableData?.(data);
        }
    }, [getTableState?.adapterResult]); // keep the dependency list as is

    useEffect(() => {
        if (!isClusterVisible) {
            setSelectedSource({
                ...selectedSource,
                cluster: adapter.connectionString
            });
        }
    }, [adapter]); // keep the dependency list as is

    // styles
    const classNames = getStyles();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Dropdown
                label={t('legionApp.Common.typeLabel')}
                onChange={handleSourceTypeChange}
                options={SourceTypeOptions}
                placeholder={t('legionApp.Common.typePlaceholder')}
                defaultSelectedKey={selectedSourceType}
            />
            {selectedSourceType === SourceType.Timeseries ? (
                <Stack tokens={{ childrenGap: 8 }}>
                    {isClusterVisible && (
                        <ClusterPicker
                            isCreatable={false}
                            onClusterUrlChange={handleSourceClusterChange}
                            label={t('legionApp.Common.clusterLabel')}
                            selectedClusterUrl={
                                (selectedSource as IADXConnection).cluster
                            }
                            targetAdapterContext={targetAdapterContext}
                        />
                    )}
                    <DatabasePicker
                        isDisabled={!(selectedSource as IADXConnection).cluster}
                        isCreatable={false}
                        onDatabaseNameChange={handleSourceDatabaseChange}
                        label={t('legionApp.Common.databaseLabel')}
                        placeholder={t('legionApp.Common.databasePlaceholder')}
                        targetAdapterContext={targetAdapterContext}
                    />
                    <TablePicker
                        isDisabled={
                            !(selectedSource as IADXConnection).database
                        }
                        databaseName={
                            (selectedSource as IADXConnection).database
                        }
                        onTableNameChange={handleSourceTableChange}
                        targetAdapterContext={targetAdapterContext}
                    />
                    <Dropdown
                        disabled={!(selectedSource as IADXConnection).table}
                        required
                        label={t('legionApp.Common.tableIdColumnLabel')}
                        onChange={handleSourceTwinIDColumnChange}
                        options={sourceTableColumnOptions}
                        placeholder={
                            getTableState.isLoading
                                ? t('loading')
                                : t('legionApp.Common.tableIdColumnPlaceholder')
                        }
                        selectedKey={
                            (selectedSource as IADXConnection).twinIdColumn
                        }
                    />
                </Stack>
            ) : (
                <Dropdown
                    required
                    label={t('legionApp.Common.urlLabel')}
                    onChange={handlePIDUrlChange}
                    options={PIDSourceOptions}
                    placeholder={t('legionApp.Common.urlPlaceholder')}
                />
            )}
        </div>
    );
};

export default CookSource;
