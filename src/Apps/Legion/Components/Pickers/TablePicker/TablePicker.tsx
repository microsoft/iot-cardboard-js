import React, { useCallback, useEffect, useState } from 'react';
import { getDebugLogger } from '../../../../../Models/Services/Utils';
import { ITablePickerProps } from './TablePicker.types';
import { getStyles } from './TablePicker.styles';
import { WizardDataManagementContext } from '../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import { useTranslation } from 'react-i18next';
import { useADXAdapter } from '../../../Hooks/useADXAdapter';
import { IADXAdapterTargetContext } from '../../../Models';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { IGetTablesAdapterParams } from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TablePicker', debugLogging);

const TablePicker: React.FC<ITablePickerProps> = (props) => {
    // state
    const {
        databaseName,
        selectedTableName,
        onTableNameChange,
        isDisabled = false,
        targetAdapterContext = WizardDataManagementContext
    } = props;
    const [sourceTableOptions, setSourceTableOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [selectedSourceTable, setSelectedSourceTable] = useState<string>(
        selectedTableName
    );

    // hooks
    const { t } = useTranslation();
    const adapter = useADXAdapter(
        targetAdapterContext as React.Context<IADXAdapterTargetContext>
    );
    const getTablesState = useAdapter({
        adapterMethod: (params: IGetTablesAdapterParams) =>
            adapter.getTables(params.databaseName),
        isAdapterCalledOnMount: false,
        refetchDependencies: []
    });

    // callbacks
    const handleSourceTableChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedSourceTable(option.text);
            if (onTableNameChange) {
                onTableNameChange(option.text);
            }
        },
        [onTableNameChange]
    );

    // side effects
    useEffect(() => {
        if (getTablesState?.adapterResult?.result) {
            const data = getTablesState.adapterResult.getData();
            setSourceTableOptions(data.map((d) => ({ key: d, text: d })));
        }
    }, [getTablesState?.adapterResult]);
    useEffect(() => {
        if (databaseName) {
            setSelectedSourceTable(null);
            getTablesState.callAdapter({ databaseName: databaseName });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [databaseName]);

    // styles
    const classNames = getStyles();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Dropdown
                required
                label={t('legionApp.Common.tableLabel')}
                onChange={handleSourceTableChange}
                options={sourceTableOptions}
                placeholder={
                    getTablesState.isLoading
                        ? t('loading')
                        : t('legionApp.Common.tablePlaceholder')
                }
                selectedKey={selectedSourceTable}
                disabled={isDisabled}
            />
        </div>
    );
};

export default TablePicker;
