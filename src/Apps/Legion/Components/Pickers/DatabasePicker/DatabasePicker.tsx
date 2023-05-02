import React, { useCallback, useEffect, useState } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../../Models/Services/Utils';
import {
    IDatabasePickerProps,
    IDatabasePickerStyleProps,
    IDatabasePickerStyles
} from './DatabasePicker.types';
import { getStyles } from './DatabasePicker.styles';
import { useTranslation } from 'react-i18next';
import { useAdapter } from '../../../../../Models/Hooks';
import { IReactSelectOption } from '../../../Models/Types';
import { useADXAdapter } from '../../../Hooks/useADXAdapter';
import { ICreateDatabaseAdapterParams } from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { WizardDataManagementContext } from '../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import CardboardComboBox from '../../CardboardComboBox/CardboardComboBox';
import { IADXAdapterTargetContext } from '../../../Models/Interfaces';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DatabasePicker', debugLogging);

const getClassNames = classNamesFunction<
    IDatabasePickerStyleProps,
    IDatabasePickerStyles
>();

const DatabasePicker: React.FC<IDatabasePickerProps> = (props) => {
    const {
        selectedDatabaseName,
        onDatabaseNameChange,
        targetAdapterContext = WizardDataManagementContext,
        isCreatable = true,
        isRequired = true,
        isDisabled = false,
        label,
        placeholder,
        styles
    } = props;

    //state
    const [databaseOptions, setDatabaseOptions] = useState<
        Array<IReactSelectOption>
    >([]);
    const [
        selectedDatabaseOption,
        setSelectedDatabaseOption
    ] = useState<IReactSelectOption>(null);

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    const adapter = useADXAdapter(
        targetAdapterContext as React.Context<IADXAdapterTargetContext>
    );
    const getDatabasesState = useAdapter({
        adapterMethod: () => adapter.getDatabases(),
        refetchDependencies: [adapter.connectionString]
    });

    const createDatabaseState = useAdapter({
        adapterMethod: (param: ICreateDatabaseAdapterParams) =>
            adapter.createDatabase(param.databaseName),
        isAdapterCalledOnMount: false,
        refetchDependencies: []
    });

    //callbacks
    const handleDatabaseNameChange = useCallback(
        (newValue: IReactSelectOption, isNew: boolean) => {
            setSelectedDatabaseOption(newValue);
            if (isNew) {
                createDatabaseState.callAdapter({
                    databaseName: newValue.label
                });
                setDatabaseOptions(databaseOptions.concat(newValue));
            }
            if (onDatabaseNameChange) {
                onDatabaseNameChange(newValue.label, isNew);
            }
        },
        [createDatabaseState, databaseOptions, onDatabaseNameChange]
    );

    //side-effects
    useEffect(() => {
        if (getDatabasesState?.adapterResult?.result) {
            const data = getDatabasesState.adapterResult.getData();
            setDatabaseOptions(data?.map((d) => ({ value: d, label: d })));
        }
    }, [getDatabasesState?.adapterResult]);
    useEffect(() => {
        setSelectedDatabaseOption(
            selectedDatabaseName
                ? {
                      value: selectedDatabaseName,
                      label: selectedDatabaseName
                  }
                : null
        );
    }, [selectedDatabaseName]);

    // styles
    const classNames = getClassNames(styles, {
        theme
    });

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <CardboardComboBox
                isLoading={getDatabasesState.isLoading}
                required={isRequired}
                isCreatable={isCreatable}
                label={label || t('legionApp.Common.databaseLabel')}
                onSelectionChange={handleDatabaseNameChange}
                options={databaseOptions}
                placeholder={
                    placeholder || t('legionApp.Common.databasePlaceholder')
                }
                selectedItem={selectedDatabaseOption}
                isSpinnerVisible={isCreatable && createDatabaseState.isLoading}
                spinnerLabel={t('legionApp.dataPusher.progress.createDatabase')}
                isDisabled={isDisabled}
            />
        </div>
    );
};

export default styled<
    IDatabasePickerProps,
    IDatabasePickerStyleProps,
    IDatabasePickerStyles
>(DatabasePicker, getStyles);
