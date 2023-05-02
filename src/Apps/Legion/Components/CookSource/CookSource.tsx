import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICookSourceProps } from './CookSource.types';
import { getStyles } from './CookSource.styles';
import { Dropdown, IDropdownOption, Stack, TextField } from '@fluentui/react';
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
import { WizardDataManagementContext } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
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

const debugLogging = false;
const logDebugConsole = getDebugLogger('CookSource', debugLogging);

const CookSource: React.FC<ICookSourceProps> = (props) => {
    const {
        onSourceTypeChange,
        onSourceChange,
        onGetTableData,
        targetAdapterContext = WizardDataManagementContext
    } = props;

    // state
    const [selectedSourceType, setSelectedSourceType] = useState<SourceType>(
        SourceType.Timeseries
    );
    const [sourceInformation, setSourceInformation] = useState<ICookSource>({
        cluster: null,
        database: null,
        table: null,
        twinIdColumn: null,
        tableType: null
    });
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
            if (onSourceTypeChange) {
                onSourceTypeChange(option.key as SourceType);
            }
        },
        [onSourceTypeChange]
    );
    const handleSourceClusterChange = useCallback(
        (clusterUrl: string) => {
            const newSource: IADXConnection = {
                ...(sourceInformation as IADXConnection),
                cluster: clusterUrl,
                database: null
            };
            setSourceInformation(newSource);
            if (onSourceChange) {
                onSourceChange(newSource);
            }
        },
        [onSourceChange, sourceInformation]
    );
    const handleSourceDatabaseChange = useCallback(
        (databaseName: string) => {
            const newSource: IADXConnection = {
                ...(sourceInformation as IADXConnection),
                database: databaseName,
                table: null,
                twinIdColumn: null
            };
            setSourceInformation(newSource);
            if (onSourceChange) {
                onSourceChange(newSource);
            }
        },
        [onSourceChange, sourceInformation]
    );
    const handleSourceTableChange = useCallback(
        (tableName: string) => {
            const newSource: IADXConnection = {
                ...(sourceInformation as IADXConnection),
                table: tableName
            };
            setSourceInformation(newSource);
            if (onSourceChange) {
                onSourceChange(newSource);
            }
            getTableState.callAdapter({
                databaseName: (sourceInformation as IADXConnection).database,
                tableName: tableName
            });
        },
        [getTableState, onSourceChange, sourceInformation]
    );
    const handleSourceTwinIDColumnChange = useCallback(
        (_event, option: IDropdownOption) => {
            const newSource: IADXConnection = {
                ...(sourceInformation as IADXConnection),
                twinIdColumn: option.text
            };
            setSourceInformation(newSource);
            if (onSourceChange) {
                onSourceChange(newSource);
            }
        },
        [onSourceChange, sourceInformation]
    );

    const handlePIDUrlChange = useCallback(
        (_event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any>) => {
            const newSource: IPIDDocument = {
                ...(sourceInformation as IPIDDocument),
                pidUrl: option.text
            };
            setSourceInformation(newSource);
            if (onSourceChange) {
                onSourceChange(newSource);
            }
        },
        [onSourceChange, sourceInformation]
    );

    // side effects
    useEffect(() => {
        if (getTableState?.adapterResult?.result) {
            const data = getTableState.adapterResult.getData() as ITable;
            setSourceInformation(
                produce((draft: WritableDraft<IADXConnection>) => {
                    draft.tableType = getTableSchemaTypeFromTable(data);
                })
            );
            setSourceTableColumnOptions(
                data.Columns.map((d) => ({
                    key: d.columnName,
                    text: d.columnName
                }))
            );
            onGetTableData(data);
        }
    }, [getTableState?.adapterResult]); // keep the dependency list as is

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
                    <ClusterPicker
                        isCreatable={false}
                        onClusterUrlChange={handleSourceClusterChange}
                        label={t('legionApp.Common.clusterLabel')}
                    />
                    <DatabasePicker
                        isDisabled={
                            !(sourceInformation as IADXConnection).cluster
                        }
                        isCreatable={false}
                        onDatabaseNameChange={handleSourceDatabaseChange}
                        label={t('legionApp.Common.databaseLabel')}
                        placeholder={t('legionApp.Common.databasePlaceholder')}
                    />
                    <TablePicker
                        isDisabled={
                            !(sourceInformation as IADXConnection).database
                        }
                        databaseName={
                            (sourceInformation as IADXConnection).database
                        }
                        onTableNameChange={handleSourceTableChange}
                    />
                    <Dropdown
                        disabled={!(sourceInformation as IADXConnection).table}
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
                            (sourceInformation as IADXConnection).twinIdColumn
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
