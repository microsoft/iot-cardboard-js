import React, { useCallback, useEffect, useState } from 'react';
import {
    Label,
    Spinner,
    SpinnerSize,
    Stack,
    classNamesFunction,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../../Models/Services/Utils';
import {
    IDatabasePickerProps,
    IDatabasePickerStyleProps,
    IDatabasePickerStyles
} from './DatabasePicker.types';
import { getStyles } from './DatabasePicker.styles';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import { useAdapter } from '../../../../../Models/Hooks';
import { getReactSelectStyles } from '../../../../../Resources/Styles/ReactSelect.styles';
import { IReactSelectOption } from '../../../Models/Types';
import { useADXAdapter } from '../../../Hooks/useADXAdapter';
import { ICreateDatabaseAdapterParams } from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { ActionMeta } from 'react-select';
import { WizardDataManagementContext } from '../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import { useId } from '@fluentui/react-hooks';

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

    const databaseLabelId = useId('database-label');

    const adapter = useADXAdapter(targetAdapterContext);
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
        (
            newValue: IReactSelectOption,
            actionMeta: ActionMeta<IReactSelectOption>
        ) => {
            setSelectedDatabaseOption(newValue);
            if (actionMeta.action === 'create-option') {
                createDatabaseState.callAdapter({
                    databaseName: newValue.label
                });
                setDatabaseOptions(databaseOptions.concat(newValue));
            }
            if (onDatabaseNameChange) {
                onDatabaseNameChange(
                    newValue.label,
                    actionMeta.action === 'create-option'
                );
            }
        },
        [createDatabaseState, databaseOptions, onDatabaseNameChange]
    );
    const isCreateVisible = useCallback(
        (inputValue) => isCreatable && !!inputValue,
        [isCreatable]
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
    const selectStyles = getReactSelectStyles(theme, {});

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Stack horizontal horizontalAlign="space-between">
                <Label required id={databaseLabelId}>
                    {label || t('legionApp.dataPusher.target.database')}
                </Label>
                {isCreatable && createDatabaseState.isLoading && (
                    <Spinner
                        label={t(
                            'legionApp.dataPusher.progress.createDatabase'
                        )}
                        size={SpinnerSize.small}
                        labelPosition={'right'}
                    />
                )}
            </Stack>
            <CreatableSelect
                aria-labelledby={databaseLabelId}
                onChange={handleDatabaseNameChange}
                isClearable
                options={databaseOptions}
                placeholder={
                    placeholder ||
                    t('legionApp.dataPusher.target.selectDatabase')
                }
                styles={selectStyles}
                isLoading={getDatabasesState.isLoading}
                value={selectedDatabaseOption}
                isDisabled={!adapter.connectionString}
                isValidNewOption={isCreateVisible}
            />
        </div>
    );
};

export default styled<
    IDatabasePickerProps,
    IDatabasePickerStyleProps,
    IDatabasePickerStyles
>(DatabasePicker, getStyles);
